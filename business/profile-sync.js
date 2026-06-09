import { api } from '../utils/api'

const SESSION_ID_KEY = 'uniprism.sessionId'
const ANONYMOUS_ID_KEY = 'uniprism.anonymousId'
const PROFILE_UPLOADED_KEY = 'uniprism.profileUploaded'

function ensureAnonymousId() {
  let anonymousId = uni.getStorageSync(ANONYMOUS_ID_KEY)
  if (!anonymousId) {
    anonymousId = 'anon-' + Date.now()
    uni.setStorageSync(ANONYMOUS_ID_KEY, anonymousId)
  }
  return anonymousId
}

/** 获取或创建服务端探索 sessionId（登录后 mergeExploreSession 通常已写入）。 */
export async function ensureExploreSessionId() {
  let sessionId = uni.getStorageSync(SESSION_ID_KEY)
  if (sessionId) return sessionId

  const anonymousId = ensureAnonymousId()
  const res = await api.createSession(anonymousId)
  sessionId = (res && res.data && res.data.sessionId) || (res && res.sessionId)
  if (sessionId) {
    uni.setStorageSync(SESSION_ID_KEY, sessionId)
    if (res.data && res.data.anonymousId) {
      uni.setStorageSync(ANONYMOUS_ID_KEY, res.data.anonymousId)
    }
  }
  return sessionId || null
}

/** 与 Web results 页一致：上传 0–100 归一化分数。 */
export function buildProfileScores(profile) {
  if (!profile) return {}
  return profile.normalized || profile.scores || {}
}

/**
 * 问卷完成后保存兴趣画像到服务端（saveProfile + discoveryCompleted）。
 * @param {import('./discover-session').DiscoverSession} session
 * @param {{ force?: boolean }} [options]
 * @returns {Promise<string|null>} sessionId
 */
export async function syncDiscoverProfileToBackend(session, options) {
  const opts = options || {}
  if (!session || !session.profile) {
    throw new Error('请先完成兴趣问卷')
  }

  if (!opts.force && uni.getStorageSync(PROFILE_UPLOADED_KEY)) {
    return uni.getStorageSync(SESSION_ID_KEY) || null
  }

  const sessionId = await ensureExploreSessionId()
  if (!sessionId) throw new Error('无法创建探索会话')

  await api.saveProfile(
    sessionId,
    buildProfileScores(session.profile),
    session.profile.topDimensions,
    session.recommendedMajors || [],
    session.answers || [],
    session.openEndedAnswers || {},
    session.personalityTraits || {},
  )

  uni.setStorageSync(PROFILE_UPLOADED_KEY, true)
  return sessionId
}

export function clearProfileUploadFlag() {
  uni.removeStorageSync(PROFILE_UPLOADED_KEY)
}
