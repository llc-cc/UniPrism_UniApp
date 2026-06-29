/** 职业模拟阶段「已体验专业」与推荐职业（对齐 Web discover CareerWorkspace） */

import { getMajorById } from '../../../business/explore-data'
import { getMajorRoute } from '../../../business/major-routes'

/** Web 职业阶段默认展示的 5 个专业 */
export const CAREER_WORKSPACE_MAJOR_IDS = [
  'actuarial-u',
  'math-u',
  'physics-u',
  'cs-u',
  'ai-u',
]

export function buildCareerStageMajorEntries({
  majorsExplored = [],
  recommendedMajorIds = [],
  selectedMajorId = '',
}) {
  const orderedIds = []
  const pushId = (majorId) => {
    if (!majorId || orderedIds.includes(majorId)) return
    orderedIds.push(majorId)
  }

  majorsExplored.forEach(pushId)
  pushId(selectedMajorId)
  recommendedMajorIds.forEach(pushId)
  CAREER_WORKSPACE_MAJOR_IDS.forEach(pushId)

  const entries = orderedIds
    .map((majorId) => {
      const major = getMajorById(majorId)
      if (!major) return null
      return {
        id: majorId,
        label: major.shortTitle || major.title,
        category: major.en || 'Major',
        accent: major.accent || '#2BA8BC',
        icon: major.icon,
        description: major.summary || '',
        href: getMajorRoute(majorId),
        visited: majorsExplored.includes(majorId),
      }
    })
    .filter(Boolean)

  const workspaceEntries = CAREER_WORKSPACE_MAJOR_IDS
    .map((majorId) => entries.find((entry) => entry.id === majorId))
    .filter(Boolean)

  return workspaceEntries.length ? workspaceEntries : entries.slice(0, 5)
}

export function resolveActiveMajorEntry(entries, selectedMajorId) {
  if (!entries.length) return null
  return (
    entries.find((entry) => entry.id === selectedMajorId)
    || entries.find((entry) => entry.visited)
    || entries[0]
  )
}

export function rankCareersForWorkspace(careers, { topDimensions = [], majorIds = [], selectedMajorId = '' }) {
  const dims = topDimensions || []
  const majors = selectedMajorId
    ? [selectedMajorId, ...(majorIds || []).filter((id) => id !== selectedMajorId)]
    : (majorIds || [])

  return [...careers]
    .map((career) => {
      let score = 0
      ;(career.dimensions || []).forEach((dim) => {
        if (dims.includes(dim)) score += 2
      })
      ;(career.relatedMajors || []).forEach((majorId) => {
        if (majors.includes(majorId)) score += majorId === selectedMajorId ? 5 : 3
      })
      return { ...career, _score: score }
    })
    .sort((a, b) => b._score - a._score)
}

export const CAREER_DIMENSION_LABELS = {
  R: '现实型',
  I: '研究型',
  A: '艺术型',
  S: '社会型',
  E: '企业型',
  C: '常规型',
}
