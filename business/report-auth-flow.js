import { api } from '../utils/api'

export function isLoggedInForReport() {
  return api.isLoggedIn()
}

export const PENDING_REPORT_GENERATION_FLAG = 'uniprism.pendingReportGeneration'
export const BASIC_PROFILE_USER_ID_KEY = 'uniprism.basicProfileCompletedUserId'
export const POST_LOGIN_PROFILE_URL = '/subpkg/discover/chat?profile=1'
export const POST_LOGIN_REPORT_URL = '/subpkg/discover/results?generate=1'
export const EXPLORATION_START_URL = '/subpkg/discover/chat?screen=stage-personality-intro'

const AUTH_PAGE = '/pages/auth/login'
const POST_LOGIN_LAUNCH_URL = '/pages/auth/launch'

export function hasPendingReportGeneration() {
  return Boolean(uni.getStorageSync(PENDING_REPORT_GENERATION_FLAG))
}

export function markPendingReportGeneration() {
  uni.setStorageSync(PENDING_REPORT_GENERATION_FLAG, '1')
}

export function clearPendingReportGeneration() {
  uni.removeStorageSync(PENDING_REPORT_GENERATION_FLAG)
}

export function hasBasicProfileAnswer(session) {
  const answers = (session && session.answers) || []
  const basic = answers.find((item) => item.questionId === 'basic-profile')
  const fields = basic && basic.value && basic.value.fields
  if (!fields || typeof fields !== 'object') return false
  const name = fields.name
  return typeof name === 'string' && name.trim().length > 0
}

export function markBasicProfileCompleted(userId) {
  if (!userId) return
  uni.setStorageSync(BASIC_PROFILE_USER_ID_KEY, userId)
}

export function hasCompletedBasicProfileForUser(userId) {
  if (!userId) return false
  return uni.getStorageSync(BASIC_PROFILE_USER_ID_KEY) === userId
}

/**
 * 报告登录成功后应跳转的目标。
 * - 新用户：启动引导 → 基本信息
 * - 老用户（已填基本信息）：直接生成报告
 * - 老用户（缺基本信息）：仅补填基本信息
 */
function loadLocalAnswers() {
  try {
    const raw = uni.getStorageSync('uniprism.mini.discoverSession')
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return Array.isArray(parsed && parsed.answers) ? parsed.answers : []
  } catch (e) {
    return []
  }
}

export function resolvePostReportLoginTarget(res) {
  const userId = (res && res.data && res.data.user && res.data.user.id) || ''
  const isNewUser = res && res.data && res.data.isNewUser === true
  const answers = loadLocalAnswers()
  const localBasicReady = hasBasicProfileAnswer({ answers })
  const returningUser = res && res.data && res.data.isNewUser === false
  const knownBasicProfile = returningUser || hasCompletedBasicProfileForUser(userId) || localBasicReady

  if (knownBasicProfile) {
    return POST_LOGIN_REPORT_URL
  }

  if (isNewUser) {
    return `${POST_LOGIN_LAUNCH_URL}?next=${encodeURIComponent(POST_LOGIN_PROFILE_URL)}`
  }

  return POST_LOGIN_PROFILE_URL
}

function buildLoginRedirectUrl(returnUrl = '') {
  const path = String(returnUrl || '').split('?')[0]
  if (!path || path.includes('/pages/auth/login')) return AUTH_PAGE
  return `${AUTH_PAGE}?redirect=${encodeURIComponent(path)}`
}

/** 未登录时弹窗询问是否去登录；已登录则直接返回 true。 */
export function promptLoginForReport(returnUrl = '/subpkg/discover/chat?screen=complete') {
  if (isLoggedInForReport()) {
    return Promise.resolve(true)
  }

  return new Promise((resolve) => {
    uni.showModal({
      title: '登录后可生成报告',
      content: '生成报告需要登录账号。你可以现在登录，也可以稍后再说，继续浏览其他内容。',
      confirmText: '去登录',
      cancelText: '稍后再说',
      success: (res) => {
        if (res.confirm) {
          markPendingReportGeneration()
          uni.reLaunch({ url: buildLoginRedirectUrl(returnUrl) })
        }
        resolve(false)
      },
      fail: () => resolve(false),
    })
  })
}

/** @deprecated 请改用 promptLoginForReport */
export function requireLoginForReport(returnUrl = '/subpkg/discover/chat?screen=complete') {
  return promptLoginForReport(returnUrl)
}

export function continueToReportGeneration() {
  clearPendingReportGeneration()
  uni.redirectTo({ url: POST_LOGIN_REPORT_URL })
}

/** 已登录用户生成报告前若缺少基本信息，引导补填。 */
export function ensureBasicProfileBeforeReport(session) {
  if (hasBasicProfileAnswer(session)) return true
  uni.navigateTo({ url: POST_LOGIN_PROFILE_URL })
  return false
}
