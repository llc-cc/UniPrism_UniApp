import { getBasicProfileGenderFromSession } from '../../../business/user-avatar'
import { loadDiscoverSession } from '../../../business/discover-session-storage'
import { readReportViewSnapshot } from './report-view-snapshot'
import {
  extractPersonaRole,
  extractPersonalityTypeNameFromText,
  normalizeLegacyPersonalityText,
  resolveMbtiTypePersonalityName,
  resolveReportMbtiType,
} from './report-personality-display'
import {
  buildExpandedReportDetailModel,
  buildReportHeroModel,
  buildReportMajorRows,
  computeStarCountByRank,
  resolveMajorName,
} from '../../../business/report-display-model'

const INVALID_PERSONALITY_LABELS = new Set(['未知人格', '未知画像'])
export const REPORT_SHARE_CTA = '快来体验我们的测试吧，看看你的推荐职业有哪些！'
export const REPORT_SHARE_FALLBACK_TITLE = '我的兴趣报告已生成，来看看适合我的专业方向'

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

export function splitPersonalityShareLabel(fullLabel) {
  const text = normalizeText(fullLabel)
  if (!text) {
    return {
      personalityTypeName: '',
      personalitySuffix: '',
    }
  }
  const match = text.match(/^(.+?)(人格)$/)
  if (match) {
    return {
      personalityTypeName: match[1],
      personalitySuffix: match[2],
    }
  }
  if (text.endsWith('型')) {
    return {
      personalityTypeName: text,
      personalitySuffix: '人格',
    }
  }
  return {
    personalityTypeName: text,
    personalitySuffix: '',
  }
}

function isValidPersonalityLabel(value) {
  const text = normalizeText(value)
  return !!text && !INVALID_PERSONALITY_LABELS.has(text)
}

function extractPersonalityLabel(report, fallbackLabel, profile, sessionAnswers) {
  if (isValidPersonalityLabel(fallbackLabel)) return normalizeText(fallbackLabel)

  const context = { profile, report, sessionAnswers }
  const analysis = report && report.personalityAndCareerAnalysis
  const personalityBody = normalizeText(
    (analysis && analysis.personalityTestResult && analysis.personalityTestResult.body) || '',
  )

  const fromReport = extractPersonalityTypeNameFromText(personalityBody, context)
  if (fromReport) return fromReport

  const mbtiType = resolveReportMbtiType(context)
  const fromMbti = resolveMbtiTypePersonalityName(mbtiType)
  if (fromMbti) return fromMbti

  return ''
}

function extractPersonaLabel(report, fallbackLabel) {
  if (isValidPersonalityLabel(fallbackLabel)) return normalizeText(fallbackLabel)

  const integratedText = normalizeText(
    report
    && report.personalityAndCareerAnalysis
    && report.personalityAndCareerAnalysis.integratedPersona
    && report.personalityAndCareerAnalysis.integratedPersona.body,
  )
  if (!integratedText) return ''

  return extractPersonaRole(integratedText)
}

function buildTraitText(report, detailModel) {
  const analysis = report && report.personalityAndCareerAnalysis
  const careerBody = analysis && analysis.careerTendencyAnalysis && analysis.careerTendencyAnalysis.body
  if (careerBody) return normalizeText(careerBody)
  const personalityBody = analysis && analysis.personalityTestResult && analysis.personalityTestResult.body
  if (personalityBody) return normalizeLegacyPersonalityText(personalityBody)
  const adviceBody = detailModel && detailModel.comprehensiveAdvice && detailModel.comprehensiveAdvice.body
  if (adviceBody) return normalizeText(adviceBody)
  return normalizeText(report && report.summary)
}

function buildAdviceText(report, detailModel) {
  const detailed = detailModel && detailModel.comprehensiveAdvice && detailModel.comprehensiveAdvice.body
  if (detailed) return normalizeText(detailed)
  const analysis = report && report.comprehensiveAdvice
  if (analysis && analysis.developmentAdvice) return normalizeText(analysis.developmentAdvice)
  return normalizeText(report && report.summary)
}

/** 与兴趣报告页完全相同的展示数据，用于分享页读取。 */
export function buildReportViewSnapshot({
  sessionId,
  reportId,
  report,
  profile,
  nickname,
  genderOptionId,
  personalityLabel,
  personaLabel,
  sessionAnswers,
}) {
  const detailModel = buildExpandedReportDetailModel(report)
  const hero = buildReportHeroModel({
    report,
    profile,
    genderOptionId,
  })
  const majorRows = buildReportMajorRows({ report, detailModel })
  const reportMajors = [
    ...(((report && report.majorRecommendations && report.majorRecommendations.majors) || [])),
    ...(((report && report.recommendedMajors) || [])),
  ]
  const resolvedPersonalityLabel = extractPersonalityLabel(
    report,
    personalityLabel,
    profile,
    sessionAnswers,
  )
  const resolvedPersonaLabel = extractPersonaLabel(report, personaLabel)

  return {
    sessionId,
    reportId,
    nickname: normalizeText(nickname) || '同学',
    codeTag: hero.codeTag,
    taglineText: hero.taglineText,
    coverImagePath: hero.coverImagePath,
    traitText: buildTraitText(report, detailModel),
    personalityPill: resolvedPersonalityLabel
      ? `性格测试结果---${resolvedPersonalityLabel}`
      : '',
    personaPill: resolvedPersonaLabel
      ? `综合人格画像---${resolvedPersonaLabel}`
      : '',
    adviceText: buildAdviceText(report, detailModel),
    majorSamples: majorRows.map((major, index) => ({
      rank: index + 1,
      name: resolveMajorName(major.id, major.name, reportMajors),
      stars: computeStarCountByRank(index + 1),
    })),
  }
}

function sanitizeReportViewSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return snapshot
  const next = { ...snapshot }
  const personalityPill = normalizeText(next.personalityPill)
  const personaPill = normalizeText(next.personaPill)
  if (!personalityPill || personalityPill.includes('未知人格')) {
    next.personalityPill = ''
  }
  if (!personaPill || personaPill.includes('未知画像')) {
    next.personaPill = ''
  }
  return next
}

export function buildShareInviteViewModel(payload, options = {}) {
  const sessionId = (payload && payload.sessionId) || options.sessionId || ''
  const reportId = (payload && payload.reportId) || options.reportId || ''
  const report = (payload && payload.report) || null

  // 分享接口有报告正文时，以最新 payload 为准，避免旧快照把无效兜底值覆盖回来。
  if (report) {
    const session = loadDiscoverSession()
    const profile = options.localProfile || (session && session.profile) || (payload && payload.profile) || {}
    const genderOptionId = options.genderOptionId || getBasicProfileGenderFromSession(session)

    return buildReportViewSnapshot({
      sessionId,
      reportId,
      report,
      profile,
      nickname: options.nickname || (payload && payload.nickname),
      genderOptionId,
      personalityLabel: payload && payload.personalityLabel,
      personaLabel: payload && payload.personaLabel,
      sessionAnswers: (session && session.answers) || [],
    })
  }

  const cachedSnapshot = readReportViewSnapshot(sessionId, reportId)
  if (cachedSnapshot && cachedSnapshot.codeTag) {
    return sanitizeReportViewSnapshot(cachedSnapshot)
  }

  const session = loadDiscoverSession()
  const profile = options.localProfile || (session && session.profile) || (payload && payload.profile) || {}
  const genderOptionId = options.genderOptionId || getBasicProfileGenderFromSession(session)

  return buildReportViewSnapshot({
    sessionId,
    reportId,
    report,
    profile,
    nickname: options.nickname || (payload && payload.nickname),
    genderOptionId,
    personalityLabel: payload && payload.personalityLabel,
    personaLabel: payload && payload.personaLabel,
    sessionAnswers: (session && session.answers) || [],
  })
}

export function buildReportSharePreviewModel({
  sessionId,
  reportId,
  report,
  profile,
  nickname,
  genderOptionId,
  personalityLabel,
  personaLabel,
  sessionAnswers,
}) {
  const session = loadDiscoverSession()
  const answers = sessionAnswers || (session && session.answers) || []
  const snapshot = buildReportViewSnapshot({
    sessionId,
    reportId,
    report,
    profile,
    nickname,
    genderOptionId,
    personalityLabel,
    personaLabel,
    sessionAnswers: answers,
  })
  const personalityParts = splitPersonalityShareLabel(
    extractPersonalityLabel(report, personalityLabel, profile, answers),
  )

  return {
    title: `他的兴趣类型是：${snapshot.codeTag}`,
    codeTag: snapshot.codeTag,
    taglineText: snapshot.taglineText,
    coverImagePath: snapshot.coverImagePath,
    personalityTypeName: personalityParts.personalityTypeName,
    personalitySuffix: personalityParts.personalitySuffix,
    ctaText: REPORT_SHARE_CTA,
  }
}

export function buildShareAppMessagePayload({
  sessionId,
  reportId,
  previewModel,
  shareImageUrl,
  fallbackImageUrl,
}) {
  return {
    title: (previewModel && previewModel.title) || REPORT_SHARE_FALLBACK_TITLE,
    path: buildShareInvitePath(sessionId, reportId),
    imageUrl: shareImageUrl || fallbackImageUrl || '',
  }
}

export function buildShareInvitePath(sessionId, reportId) {
  const parts = []
  if (sessionId) parts.push(`sessionId=${encodeURIComponent(sessionId)}`)
  if (reportId) parts.push(`reportId=${encodeURIComponent(reportId)}`)
  return parts.length ? `/subpkg/discover/share-invite?${parts.join('&')}` : '/subpkg/discover/share-invite'
}

export {
  buildExpandedReportDetailModel,
  buildReportHeroModel,
  buildReportMajorRows,
  computeStarCountByRank,
  resolveMajorName,
}
