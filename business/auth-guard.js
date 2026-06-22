import { api } from '../utils/api'
import { guardDisabledMiniAppRoute } from './disabled-miniapp-routes'

const AUTH_PAGE = '/pages/auth/login'
const HOME_PAGE = '/pages/discover/index'
const POST_LOGIN_LAUNCH_URL = '/pages/auth/launch'
const POST_LOGIN_BASIC_INFO_URL = '/pages/discover/chat?start=1'
export const POST_LOGIN_FLOW_FLAG = 'uniprism.postLoginFlowPending'

/** 开发阶段跳过登录；上线前改为 false。 */
const SKIP_LOGIN = false

let redirecting = false

/** 是否已登录（必须有 JWT）；SKIP_LOGIN 时视为已登录。 */
export function hasAppAccess() {
  if (SKIP_LOGIN) return true
  return api.isLoggedIn()
}

/** 清除历史测试数据（跳过登录残留）。 */
export function cleanupStaleAuthState() {
  if (SKIP_LOGIN || api.isLoggedIn()) return
  uni.removeStorageSync('uniprism.token')
  uni.removeStorageSync('uniprism.user')
}

function getCurrentRoute() {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  return current && current.route ? '/' + current.route : ''
}

function isAuthPage(route) {
  return route === AUTH_PAGE || route.endsWith('auth/login')
}

function isHomePage(route) {
  return route === HOME_PAGE || route.endsWith('discover/index')
}

function getRoutePath(route) {
  return String(route || '').split('?')[0]
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

/** 未登录时跳转登录页（登录页本身豁免；启动瞬间 page 栈未就绪时不跳转）。 */
export function ensureAppAccess() {
  if (hasAppAccess()) return

  const route = getCurrentRoute()
  if (!route || isAuthPage(route)) return

  safeReLaunch(buildLoginUrl(route))
}

/**
 * 登录成功后按是否新用户分流：
 * - isNewUser === false（手机号已注册过）→ 兴趣探索主页
 * - 否则 → 启动引导 + 基本信息
 */
export function routeAfterLogin(res) {
  const isNewUser = res && res.data && res.data.isNewUser
  if (isNewUser === false) {
    uni.removeStorageSync(POST_LOGIN_FLOW_FLAG)
    goAppHome()
    return
  }

  uni.setStorageSync(POST_LOGIN_FLOW_FLAG, '1')
  uni.reLaunch({
    url: `${POST_LOGIN_LAUNCH_URL}?next=${encodeURIComponent(POST_LOGIN_BASIC_INFO_URL)}`,
    fail: () => {
      uni.reLaunch({ url: POST_LOGIN_LAUNCH_URL })
    },
  })
}

/** 登录成功后进入首页。 */
export function goAppHome() {
  if (!hasAppAccess()) {
    safeReLaunch(buildLoginUrl(getCurrentRoute()))
    return
  }

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
    if (url.includes('auth/login')) return options

    safeReLaunch(buildLoginUrl(url || getCurrentRoute()))
    return false
  }

  ;['navigateTo', 'redirectTo', 'switchTab'].forEach((name) => {
    uni.addInterceptor(name, { invoke: guard })
  })

  uni.addInterceptor('reLaunch', {
    invoke(options) {
      const url = (options && options.url) || ''
      if (url.includes('auth/login') || url.includes('discover/index')) {
        return options
      }
      return guard(options)
    },
  })
}

export function isLoginSkipped() {
  return SKIP_LOGIN
}
