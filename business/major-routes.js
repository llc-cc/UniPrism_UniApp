import { guardMajorExperienceNavigation } from './disabled-miniapp-routes'

const BUSINESS_SPEED_MAJOR_IDS = new Set(['econ-u', 'finance-u', 'marketing-u'])

const REPORT_MAJOR_CONTEXT_STORAGE_KEY = 'uniprism.discover.reportMajorContext'

function normalizeReportMajorContext(majorId, context) {
  if (!majorId || !context || typeof context !== 'object') return null
  const normalized = {
    majorId,
    source: context.source === 'report' ? 'report' : '',
    name: typeof context.name === 'string' ? context.name.trim() : '',
    description: typeof context.description === 'string' ? context.description.trim() : '',
    score: Number.isFinite(Number(context.score)) ? Math.round(Number(context.score)) : null,
    rankLabel: typeof context.rankLabel === 'string' ? context.rankLabel.trim() : '',
  }
  if (!normalized.source && !normalized.description && !normalized.score && !normalized.rankLabel) {
    return null
  }
  return normalized
}

function readReportMajorContextMap() {
  const stored = uni.getStorageSync(REPORT_MAJOR_CONTEXT_STORAGE_KEY)
  return stored && typeof stored === 'object' ? stored : {}
}

function writeReportMajorContext(majorId, context) {
  const normalized = normalizeReportMajorContext(majorId, context)
  if (!normalized) return
  const current = readReportMajorContextMap()
  uni.setStorageSync(REPORT_MAJOR_CONTEXT_STORAGE_KEY, {
    ...current,
    [majorId]: {
      ...normalized,
      updatedAt: Date.now(),
    },
  })
}

export function getReportMajorContext(majorId) {
  if (!majorId) return null
  const map = readReportMajorContextMap()
  return normalizeReportMajorContext(majorId, map[majorId])
}

export function getMajorRoute(majorId) {
  if (!majorId) return '/pages/discover/major'
  if (majorId === 'math-u') return '/subpkg/math/deep-explore'
  if (majorId === 'ai-u') return `/subpkg/discover/major-speed?id=${encodeURIComponent(majorId)}`
  if (BUSINESS_SPEED_MAJOR_IDS.has(majorId)) {
    return `/subpkg/discover/business-major-speed?id=${encodeURIComponent(majorId)}`
  }
  return `/subpkg/discover/major-detail?id=${encodeURIComponent(majorId)}`
}

export function navigateToMajor(majorId, options = null) {
  if (!majorId) return
  if (guardMajorExperienceNavigation()) return
  const reportContext = normalizeReportMajorContext(majorId, options)
  if (reportContext) writeReportMajorContext(majorId, reportContext)
  if (majorId === 'math-u') {
    uni.navigateTo({ url: '/subpkg/math/deep-explore' })
    return
  }
  uni.navigateTo({ url: getMajorRoute(majorId) })
}
