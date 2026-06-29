import { api } from '../utils/api'
import { normalizePhone } from './auth-credential-rules'
import { guardDisabledMiniAppRoute } from './disabled-miniapp-routes'
import {
  clearPendingReportGeneration,
  hasPendingReportGeneration,
  POST_LOGIN_PROFILE_URL,
  POST_LOGIN_REPORT_URL,
  resolvePostReportLoginTarget,
} from './report-auth-flow'

const AUTH_PAGE = '/pages/auth/login'
const HOME_PAGE = '/pages/discover/index'
const POST_LOGIN_LAUNCH_URL = '/pages/auth/launch'
const POST_LOGIN_BASIC_INFO_URL = POST_LOGIN_PROFILE_URL

/** 未登录也可访问的页面（满足微信审核：先体验功能，再按需登录）。 */
const PUBLIC_ROUTE_PREFIXES = [
  '/pages/discover/',
  '/pages/placeholder/',
  '/pages/learn/',
  '/pages/progress/',
  '/pages/profile/feedback',
  '/pages/profile/personal-info',
  '/subpkg/discover/',
  '/subpkg/math/',
]
export const POST_LOGIN_FLOW_FLAG = 'uniprism.postLoginFlowPending'
export const ONBOARDING_COMPLETED_FLAG = 'uniprism.onboardingCompleted'
export const ONBOARDING_USER_ID_KEY = 'uniprism.onboardingCompletedUserId'
export const KNOWN_LOGIN_PHONES_KEY = 'uniprism.knownLoginPhones'

/** 开发阶段跳过登录；上线前改为 false。 */
const SKIP_LOGIN = false

let redirecting = false

/** 是否已登录（必须有 JWT）；SKIP_LOGIN 时视为已登录。 */
export function hasAppAccess() {
  if (SKIP_LOGIN) return true
  return api.isLoggedIn()
}

function readKnownLoginPhones() {
  const raw = uni.getStorageSync(KNOWN_LOGIN_PHONES_KEY)
  if (Array.isArray(raw)) {
    return raw.map((item) => normalizePhone(item)).filter(Boolean)
  }
  const single = normalizePhone(raw)
  return single ? [single] : []
}

function rememberLoginPhone(phone) {
  const normalized = normalizePhone(phone)
  if (!normalized) return
  const phones = readKnownLoginPhones()
  if (phones.includes(normalized)) return
  uni.setStorageSync(KNOWN_LOGIN_PHONES_KEY, [...phones, normalized].slice(-20))
}

export function hasKnownLoginPhone(phone) {
  const normalized = normalizePhone(phone)
  if (!normalized) return false
  return readKnownLoginPhones().includes(normalized)
}

function getAuthUserId(res) {
  return (res && res.data && res.data.user && res.data.user.id) || ''
}

function getAuthUserPhone(res) {
  return normalizePhone((res && res.data && res.data.user && res.data.user.phone) || '')
}

/** 清除登录后引导流程本地标记（保留已登录过的手机号记录）。 */
export function clearPostLoginFlowState() {
  uni.removeStorageSync(POST_LOGIN_FLOW_FLAG)
  uni.removeStorageSync(ONBOARDING_COMPLETED_FLAG)
}

/** 启动引导完成后调用。 */
export function markOnboardingCompleted(userId) {
  const user = api.getUser()
  const resolvedUserId = userId || (user && user.id) || ''
  if (resolvedUserId) {
    uni.setStorageSync(ONBOARDING_USER_ID_KEY, resolvedUserId)
  }
  if (user && user.phone) {
    rememberLoginPhone(user.phone)
  }
  uni.setStorageSync(ONBOARDING_COMPLETED_FLAG, '1')
  uni.removeStorageSync(POST_LOGIN_FLOW_FLAG)
}

export function hasCompletedLaunchForUser(userId) {
  if (!userId) return false
  return uni.getStorageSync(ONBOARDING_USER_ID_KEY) === userId
}

/** 是否仍有待完成的首次启动引导。 */
export function needsPendingLaunchFlow() {
  return Boolean(uni.getStorageSync(POST_LOGIN_FLOW_FLAG))
}

/** 恢复未完成的启动引导（已登录、从登录页重进时）。 */
export function resumePostLoginFlow(nextUrl = POST_LOGIN_BASIC_INFO_URL) {
  safeReLaunch(`${POST_LOGIN_LAUNCH_URL}?next=${encodeURIComponent(nextUrl)}`)
}

/** 清除历史测试数据（跳过登录残留）。 */
export function cleanupStaleAuthState() {
  if (SKIP_LOGIN || api.isLoggedIn()) return
  uni.removeStorageSync('uniprism.token')
  uni.removeStorageSync('uniprism.user')
  clearPostLoginFlowState()
}

function getCurrentRoute() {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  return current && current.route ? '/' + current.route : ''
}

function isAuthPage(route) {
  return route === AUTH_PAGE || route.endsWith('auth/login')
}

export function isPublicRoute(url) {
  const path = getRoutePath(url)
  if (!path) return true
  if (isAuthPage(path)) return true
  if (path === '/pages/profile/index') return true
  return PUBLIC_ROUTE_PREFIXES.some((prefix) => path.startsWith(prefix))
}

function isHomePage(route) {
  return route === HOME_PAGE || route.endsWith('discover/index')
}

function getRoutePath(route) {
  return String(route || '').split('?')[0]
}

function isInternalAuthRedirect(url) {
  return url.includes('/pages/auth/login') || url.includes('/pages/auth/launch')
}

export function buildLoginUrl(redirectUrl = '') {
  const target = getRoutePath(redirectUrl)
  if (!target || isAuthPage(target)) return AUTH_PAGE
  return `${AUTH_PAGE}?redirect=${encodeURIComponent(target)}`
}

function safeReLaunch(url) {
  const route = getRoutePath(getCurrentRoute())
  const target = getRoutePath(url)
  if (route === target || route.endsWith(target.replace(/^\//, ''))) return
  if (redirecting) return

  redirecting = true
  uni.reLaunch({
    url,
    complete: () => {
      redirecting = false
    },
    fail: () => {
      redirecting = false
    },
  })
}

function routeToHome(redirectUrl = '') {
  uni.removeStorageSync(POST_LOGIN_FLOW_FLAG)

  if (redirectUrl && !isInternalAuthRedirect(redirectUrl)) {
    safeReLaunch(redirectUrl)
    return
  }
  goAppHome()
}

/** 未登录时跳转登录页（仅拦截需登录页面；公开页可自由浏览）。 */
export function ensureAppAccess() {
  if (hasAppAccess()) return

  const route = getCurrentRoute()
  if (!route || isPublicRoute(route)) return

  safeReLaunch(buildLoginUrl(route))
}

/** 用户主动触发需登录能力时调用。 */
export function promptLogin(redirectUrl = '') {
  safeReLaunch(buildLoginUrl(redirectUrl || getCurrentRoute()))
}

function readIsNewUserFlag(res) {
  if (!res || !res.data || res.data.isNewUser === undefined || res.data.isNewUser === null) {
    return null
  }
  return res.data.isNewUser === true
}

/**
 * 登录成功后是否进入启动引导页。
 *
 * - 邀请码注册 / 邮箱注册 / 手机号·微信首次 → 启动页
 * - 手机号再次登录 / 用户 ID 密码登录 / 邀请码重置密码 → 兴趣探索首页
 *
 * @param {import('../utils/api').ApiEnvelope} res
 * @param {string} [loginMethod]
 */
export function shouldRouteToLaunchAfterLogin(res, loginMethod = '') {
  const userId = getAuthUserId(res)
  const phone = getAuthUserPhone(res)

  if (loginMethod === 'invite-login' || loginMethod === 'invite-reset') {
    return false
  }

  if (hasCompletedLaunchForUser(userId)) {
    return false
  }

  if ((loginMethod === 'phone' || loginMethod === 'wechat') && phone && hasKnownLoginPhone(phone)) {
    return false
  }

  if (loginMethod === 'invite-register' || loginMethod === 'email-register') {
    return true
  }

  const isNewUser = readIsNewUserFlag(res)
  if (loginMethod === 'phone' || loginMethod === 'wechat') {
    if (isNewUser === false) return false
    if (isNewUser === true) return true
    // 后端未返回 isNewUser 时，保守视为首次，进入启动页
    return true
  }

  return isNewUser !== false
}

/**
 * @param {import('../utils/api').ApiEnvelope} res
 * @param {{ loginMethod?: string, redirectUrl?: string }} [options]
 */
export function routeAfterLogin(res, options = {}) {
  const loginMethod = options.loginMethod || ''
  const redirectUrl = String(options.redirectUrl || '').trim()
  const userId = getAuthUserId(res)
  const phone = getAuthUserPhone(res)

  if (hasPendingReportGeneration()) {
    if (phone) rememberLoginPhone(phone)
    clearPendingReportGeneration()

    const nextUrl = resolvePostReportLoginTarget(res)
    if (nextUrl !== POST_LOGIN_REPORT_URL) {
      uni.setStorageSync(POST_LOGIN_FLOW_FLAG, '1')
      uni.removeStorageSync(ONBOARDING_COMPLETED_FLAG)
    }
    safeReLaunch(nextUrl)
    return
  }

  if (phone) rememberLoginPhone(phone)
  routeToHome(redirectUrl)
}

/** 进入兴趣探索首页（不要求已登录）。 */
export function goAppHome() {
  const route = getCurrentRoute()
  if (isHomePage(route)) return

  if (redirecting) return

  redirecting = true
  uni.reLaunch({
    url: HOME_PAGE,
    complete: () => {
      redirecting = false
    },
  })
}

/** 拦截未登录时的页面跳转（Tab 切换不会触发 App.onShow）。 */
export function setupAuthNavigationGuard() {
  function guard(options) {
    const url = (options && options.url) || ''
    if (guardDisabledMiniAppRoute(url)) return false

    if (hasAppAccess()) return options
    if (isPublicRoute(url)) return options

    safeReLaunch(buildLoginUrl(url || getCurrentRoute()))
    return false
  }

  ;['navigateTo', 'redirectTo', 'switchTab'].forEach((name) => {
    uni.addInterceptor(name, { invoke: guard })
  })

  uni.addInterceptor('reLaunch', {
    invoke(options) {
      const url = (options && options.url) || ''
      if (isPublicRoute(url)) return options
      return guard(options)
    },
  })
}

export function isLoginSkipped() {
  return SKIP_LOGIN
}
