import { DIMENSION_DESCRIPTIONS, getMajorLabelById } from './riasecEngine'
import { getMajorById } from './explore-data'
import { resolveReportPersonaCard } from './report-persona-cards'

export const REPORT_MAJOR_COUNT = 5

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function clampScore(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(60, Math.min(99, Math.round(n)))
}

export function dimensionsFromReportCode(code) {
  return String(code || '')
    .toUpperCase()
    .split('')
    .filter((item, index, list) => DIMENSION_DESCRIPTIONS[item] && list.indexOf(item) === index)
    .slice(0, 2)
}

const RIASEC_DIMENSION_ORDER = ['R', 'I', 'A', 'S', 'E', 'C']

/** 从报告职业倾向正文中识别 Top2 维度（与报告写作一致，优先于 profile 排序）。 */
export function extractDimensionsFromCareerBody(body) {
  const text = normalizeText(body)
  if (!text) return []

  const hits = []
  RIASEC_DIMENSION_ORDER.forEach((dim) => {
    const label = DIMENSION_DESCRIPTIONS[dim] && DIMENSION_DESCRIPTIONS[dim].label
    const patterns = [
      new RegExp(`${dim}型`),
      new RegExp(`\\(${dim}\\)`, 'i'),
      label ? new RegExp(label) : null,
    ].filter(Boolean)

    let earliest = Infinity
    patterns.forEach((pattern) => {
      const index = text.search(pattern)
      if (index >= 0 && index < earliest) earliest = index
    })

    if (earliest < Infinity) {
      hits.push({ dim, index: earliest })
    }
  })

  hits.sort((a, b) => a.index - b.index)
  return hits.slice(0, 2).map((item) => item.dim)
}

export function resolveReportHeroDimensions(report, profile) {
  const reportDims = dimensionsFromReportCode(report && report.riasec && report.riasec.code)
  if (reportDims.length === 2) return reportDims

  const careerBody = report
    && report.personalityAndCareerAnalysis
    && report.personalityAndCareerAnalysis.careerTendencyAnalysis
    && report.personalityAndCareerAnalysis.careerTendencyAnalysis.body
  const fromBody = extractDimensionsFromCareerBody(careerBody)
  if (fromBody.length === 2) return fromBody

  const fromProfile = (profile && profile.topDimensions) || []
  if (fromProfile.length >= 2) return fromProfile.slice(0, 2)

  const fromCode = dimensionsFromReportCode((profile && profile.code) || '')
  if (fromCode.length === 2) return fromCode

  return fromProfile.slice(0, 2)
}

function isUnresolvedMajorName(id, name) {
  const label = normalizeText(name)
  const majorId = normalizeText(id)
  if (!label) return true
  if (label === majorId) return true
  return /^[a-z0-9_-]+$/i.test(label)
}

export function resolveMajorName(id, name, reportMajors) {
  const majorId = normalizeText(id)
  const normalizedName = normalizeText(name)
  if (!isUnresolvedMajorName(majorId, normalizedName)) return normalizedName
  const fromReport = (reportMajors || []).find((item) => item.majorId === majorId)
  if (fromReport && !isUnresolvedMajorName(majorId, fromReport.name)) {
    return normalizeText(fromReport.name)
  }
  const fromRiasec = getMajorLabelById(majorId)
  if (fromRiasec) return fromRiasec
  const local = getMajorById(majorId)
  if (local && normalizeText(local.title)) return normalizeText(local.title)
  return '待定专业'
}

function appendMajorRow(rows, seen, entry) {
  if (!entry || !entry.id || seen.has(entry.id)) return
  seen.add(entry.id)
  rows.push(entry)
}

function hasStructuredReport(report) {
  return !!(
    report
    && report.personalityAndCareerAnalysis
    && report.majorRecommendations
    && report.comprehensiveAdvice
  )
}

function mapReportMajorExperience(majors) {
  return (majors || []).map((item) => ({
    id: item.majorId,
    name: item.name,
    body: item.personalizedReason || item.overview,
  }))
}

export function buildExpandedReportDetailModel(report) {
  if (!report) return null

  if (hasStructuredReport(report)) {
    return {
      majorExperience: mapReportMajorExperience(report.majorRecommendations.majors),
      comprehensiveAdvice: {
        body: report.comprehensiveAdvice.developmentAdvice || '',
      },
    }
  }

  const expanded = report.expandedReport
  if (expanded) {
    return {
      majorExperience: (expanded.majorExperience || []).map((item) => ({
        id: item.majorId || item.id,
        name: item.name,
        body: item.body,
      })),
      comprehensiveAdvice: {
        body: (expanded.growthPath && expanded.growthPath.body) || '',
      },
    }
  }

  return {
    majorExperience: (report.recommendedMajors || []).map((item) => ({
      id: item.majorId,
      name: item.name,
      body: item.reason,
    })),
    comprehensiveAdvice: {
      body: normalizeText(report.summary),
    },
  }
}

/** 专业推荐只来自报告正文，不使用 session / RIASEC 兜底或占位专业。 */
export function buildReportMajorRows({ report, detailModel }) {
  const reportMajors = [
    ...(((report && report.majorRecommendations && report.majorRecommendations.majors) || []).map((item) => ({
      majorId: item.majorId,
      name: item.name,
      matchScore: item.matchScore,
    }))),
    ...(((report && report.recommendedMajors) || [])),
  ]
  const scoreById = new Map(
    reportMajors.map((item, index) => [item.majorId, clampScore(item.matchScore, 90 - index * 4)]),
  )
  const rows = []
  const seen = new Set()

  const pushFromSource = (items) => {
    ;(items || []).forEach((item) => {
      if (rows.length >= REPORT_MAJOR_COUNT) return
      const id = item.id || item.majorId
      appendMajorRow(rows, seen, {
        id,
        name: resolveMajorName(id, item.name, reportMajors),
        score: scoreById.get(id) || clampScore(item.score || item.matchScore, 90 - rows.length * 4),
      })
    })
  }

  pushFromSource(((report && report.majorRecommendations && report.majorRecommendations.majors) || []).map((item) => ({
    id: item.majorId,
    name: item.name,
  })))
  if (rows.length < REPORT_MAJOR_COUNT) {
    pushFromSource((detailModel && detailModel.majorExperience) || [])
  }
  if (rows.length < REPORT_MAJOR_COUNT) {
    pushFromSource(reportMajors.map((major) => ({
      id: major.majorId,
      name: major.name,
      score: major.matchScore,
    })))
  }
  if (rows.length < REPORT_MAJOR_COUNT && report && report.expandedReport) {
    pushFromSource((report.expandedReport.majorExperience || []).map((item) => ({
      id: item.majorId || item.id,
      name: item.name,
    })))
  }

  return rows.slice(0, REPORT_MAJOR_COUNT).map((row, index) => ({
    ...row,
    score: row.score || clampScore(null, 90 - index * 4),
  }))
}

export function buildReportHeroModel({ report, profile, genderOptionId, personaCard }) {
  const displayTopDimensions = resolveReportHeroDimensions(report, profile)
  const reportCodeLabel = displayTopDimensions.join('')
    || (report && report.riasec && report.riasec.code)
    || (profile && profile.code)
    || 'IC'

  const resolvedPersonaCard = personaCard || resolveReportPersonaCard({
    riasecCode: reportCodeLabel,
    topDimensions: displayTopDimensions,
    genderOptionId,
  })

  return {
    personaCard: resolvedPersonaCard,
    codeTag: (resolvedPersonaCard && resolvedPersonaCard.codeTag) || `${reportCodeLabel}型`,
    taglineText: (resolvedPersonaCard && resolvedPersonaCard.typeTitle) || '',
    coverImagePath: (resolvedPersonaCard && resolvedPersonaCard.imagePath) || '',
    displayTopDimensions,
  }
}

export function computeStarCountByRank(rankIndex) {
  const rank = Number(rankIndex)
  if (!Number.isFinite(rank) || rank <= 0) return 5
  if (rank === 1) return 5
  if (rank <= 3) return 4
  return 3
}
