import { getCareerById, getMajorById, getRecommendedCareers } from '../../../business/explore-data'
import { readDiscoverReportCache } from '../../../business/profile-sync'

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function uniqueOrderedIds(ids, isSupported) {
  const result = []
  ;(ids || []).forEach((id) => {
    if (!id || result.includes(id)) return
    if (typeof isSupported === 'function' && !isSupported(id)) return
    result.push(id)
  })
  return result
}

function extractMajorRecommendations(report) {
  if (!report || typeof report !== 'object') return []

  const merged = [
    ...((Array.isArray(report.recommendedMajors) && report.recommendedMajors) || []),
    ...(((report.majorRecommendations && report.majorRecommendations.majors) || []).map((item) => ({
      majorId: item.majorId,
      name: item.name,
      personalizedReason: item.personalizedReason,
    }))),
    ...(((report.expandedReport && report.expandedReport.majorExperience) || []).map((item) => ({
      majorId: item.majorId || item.id,
      name: item.name,
      body: item.body,
      nextAction: item.nextAction,
    }))),
  ]

  const seen = new Set()
  return merged.reduce((list, item) => {
    const id = item && (item.majorId || item.id)
    if (!id || seen.has(id)) return list
    seen.add(id)
    list.push({
      id,
      name: item.name || '',
      score: Number(item.matchScore),
      reason: normalizeText(
        item.personalizedReason || item.body || item.reason || item.knowledgeReason || item.nextAction,
      ),
    })
    return list
  }, [])
}

function extractCareerRecommendations(report) {
  if (!report || typeof report !== 'object') return []

  const merged = [
    ...((Array.isArray(report.recommendedCareers) && report.recommendedCareers) || []),
    ...(((report.careerRecommendations && report.careerRecommendations.careers) || []).map((item) => ({
      careerId: item.careerId,
      name: item.name,
      personalizedReason: item.personalizedReason,
    }))),
    ...(((report.expandedReport && report.expandedReport.careerRecommendations) || []).map((item) => ({
      careerId: item.careerId || item.id,
      name: item.name,
      body: item.body,
      nextAction: item.nextAction,
    }))),
  ]

  const seen = new Set()
  return merged.reduce((list, item) => {
    const id = item && (item.careerId || item.id)
    if (!id || seen.has(id)) return list
    seen.add(id)
    list.push({
      id,
      name: item.name || '',
      score: Number(item.matchScore),
      reason: normalizeText(
        item.personalizedReason || item.body || item.reason || item.knowledgeReason || item.nextAction,
      ),
    })
    return list
  }, [])
}

function readReportRecommendations(session) {
  const report = readDiscoverReportCache(session)
  if (!report) {
    return { majors: [], careers: [] }
  }
  return {
    majors: extractMajorRecommendations(report),
    careers: extractCareerRecommendations(report),
  }
}

export function getPreferredMajorIds(session, fallbackIds) {
  const recommendations = readReportRecommendations(session)
  const backendIds = recommendations.majors.map((item) => item.id)
  return uniqueOrderedIds([...(backendIds || []), ...((fallbackIds || []).filter(Boolean) || [])], getMajorById)
}

export function buildCareerWorkspaceRecommendations(session) {
  const profile = session && session.profile
  const fallbackMajorIds = ((session && session.recommendedMajors) || [])
    .map((item) => item && item.majorId)
    .filter(Boolean)
  const recommendations = readReportRecommendations(session)
  const localRanked = getRecommendedCareers(profile ? profile.topDimensions : [], fallbackMajorIds)
  const merged = []
  const seen = new Set()

  recommendations.careers.forEach((item) => {
    const localCareer = getCareerById(item.id)
    if (!localCareer || seen.has(item.id)) return
    seen.add(item.id)
    merged.push({
      ...localCareer,
      recommendationText: item.reason,
      backendMatchScore: Number.isFinite(item.score) ? item.score : null,
    })
  })

  localRanked.forEach((career) => {
    if (!career || !career.id) return
    if (seen.has(career.id)) {
      const index = merged.findIndex((item) => item.id === career.id)
      if (index >= 0) {
        merged[index] = {
          ...career,
          ...merged[index],
          recommendationText: merged[index].recommendationText || normalizeText(career.reason || ''),
        }
      }
      return
    }
    seen.add(career.id)
    merged.push({
      ...career,
      recommendationText: normalizeText(career.reason || ''),
      backendMatchScore: null,
    })
  })

  return merged
}
