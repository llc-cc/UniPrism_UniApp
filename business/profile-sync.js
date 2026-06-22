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

/** 每次重新问卷/重新生成报告时使用，避免复用旧 session 上的缓存画像与报告。 */
export function clearExploreBackendSession() {
  uni.removeStorageSync(SESSION_ID_KEY)
  uni.removeStorageSync(PROFILE_UPLOADED_KEY)
}

const LEGACY_REPORT_CACHE_KEY = 'uniprism.discoverReport'
const REPORT_CACHE_VERSION = 2

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function isBackendReportShape(report) {
  if (!report || typeof report !== 'object') return false
  if (String(report.source || '').toLowerCase() === 'local-fallback') return false
  if (!isNonEmptyString(report.title) || !isNonEmptyString(report.summary) || !isNonEmptyString(report.disclaimer)) return false

  const riasec = report.riasec || {}
  if (!isNonEmptyString(riasec.code) || !isNonEmptyString(riasec.interpretation)) return false

  const majors = Array.isArray(report.recommendedMajors) ? report.recommendedMajors : []
  const careers = Array.isArray(report.recommendedCareers) ? report.recommendedCareers : []
  return majors.length === 3 && careers.length === 3
}

export function buildDiscoverReportCacheKey(session) {
  const profile = session && session.profile
  const code = (profile && profile.code) || 'unknown'
  const answers = (session && session.answers) || []
  const answerCount = answers.length
  const latestTs = answers.reduce((max, item) => Math.max(max, item && item.timestamp ? item.timestamp : 0), 0)
  return `${LEGACY_REPORT_CACHE_KEY}.${code}.${answerCount}.${latestTs}`
}

export function readDiscoverReportCache(session) {
  const cacheKey = buildDiscoverReportCacheKey(session)
  const cached = uni.getStorageSync(cacheKey)
  if (!cached || typeof cached !== 'object') return null
  if (cached.version !== REPORT_CACHE_VERSION) return null
  if (!isBackendReportShape(cached.report)) return null
  return cached.report
}

export function markDiscoverReportComplete(session) {
  if (!session) return
  uni.setStorageSync(`${buildDiscoverReportCacheKey(session)}.complete`, true)
}

export function isDiscoverReportComplete(session) {
  if (!session) return false
  return uni.getStorageSync(`${buildDiscoverReportCacheKey(session)}.complete`) === true
}

export function clearDiscoverReportCompleteFlag(session) {
  if (!session) return
  uni.removeStorageSync(`${buildDiscoverReportCacheKey(session)}.complete`)
}

export function writeDiscoverReportCache(session, report) {
  if (!session || !isBackendReportShape(report)) return
  uni.setStorageSync(buildDiscoverReportCacheKey(session), {
    version: REPORT_CACHE_VERSION,
    savedAt: Date.now(),
    report,
  })
  markDiscoverReportComplete(session)
}

export function clearDiscoverReportCache(session) {
  uni.removeStorageSync(LEGACY_REPORT_CACHE_KEY)
  if (session && session.profile) {
    uni.removeStorageSync(buildDiscoverReportCacheKey(session))
    clearDiscoverReportCompleteFlag(session)
  }
}
