import { api } from '../utils/api'

const ANONYMOUS_ID_KEY = 'uniprism.anonymousId'
const SESSION_ID_KEY = 'uniprism.sessionId'

function ensureAnonymousId() {
  let anonymousId = uni.getStorageSync(ANONYMOUS_ID_KEY)
  if (!anonymousId) {
    anonymousId = 'anon-' + Date.now()
    uni.setStorageSync(ANONYMOUS_ID_KEY, anonymousId)
  }
  return anonymousId
}

/**
 * 登录/注册成功后，将本地匿名探索会话关联到当前账号。
 */
export async function mergeExploreSession() {
  if (!api.getToken()) return null
  try {
    const anonymousId = uni.getStorageSync(ANONYMOUS_ID_KEY) || ensureAnonymousId()
    const res = await api.createSession(anonymousId)
    const sessionId = (res && res.data && res.data.sessionId) || (res && res.sessionId)
    if (sessionId) {
      uni.setStorageSync(SESSION_ID_KEY, sessionId)
      if (res.data && res.data.anonymousId) {
        uni.setStorageSync(ANONYMOUS_ID_KEY, res.data.anonymousId)
      }
    }
    return sessionId || null
  } catch (e) {
    console.warn('mergeExploreSession failed', e)
    return null
  }
}

export function buildAuthUserPayload(user, fallbackName) {
  const name = (user && (user.name || user.email || user.phone)) || fallbackName || '同学'
  return {
    id: (user && user.id) || '',
    name,
    email: (user && user.email) || '',
    phone: (user && user.phone) || '',
    wechatNickname: (user && user.wechatNickname) || '',
    avatarUrl: (user && (user.avatarUrl || user.image)) || '',
    loginAt: Date.now(),
  }
}

export async function completeAuthLogin(res, fallbackName) {
  const token = res && res.data && res.data.token
  const user = (res && res.data && res.data.user) || {}
  api.setAuthSession(token, buildAuthUserPayload(user, fallbackName))
  await mergeExploreSession()
}
