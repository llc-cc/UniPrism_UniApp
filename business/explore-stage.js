import { DISCOVER_STAGES } from './explore-data'

/** 与 Web discover 页 getDefaultStage 对齐 */
export function getDefaultStageId({ hasProfile, majorsExplored = [], careersExplored = [] }) {
  if (!hasProfile) return 'interest'
  if (majorsExplored.length === 0) return 'major'
  if (careersExplored.length === 0) return 'career'
  return 'report'
}

export function isStageUnlocked(stageId, { hasProfile, majorsExplored = [] }) {
  if (stageId === 'interest') return true
  if (stageId === 'major') return hasProfile
  if (stageId === 'career') return majorsExplored.length > 0
  if (stageId === 'report') return hasProfile
  return false
}

export function isStageCompleted(stageId, { hasProfile, majorsExplored = [], careersExplored = [] }) {
  if (stageId === 'interest') return hasProfile
  if (stageId === 'major') return majorsExplored.length > 0
  if (stageId === 'career') return careersExplored.length > 0
  if (stageId === 'report') return hasProfile
  return false
}

export function getStageById(stageId) {
  return DISCOVER_STAGES.find((item) => item.id === stageId) || DISCOVER_STAGES[0]
}

/** 与 Web stageCardMeta.progress 对齐 */
export function getStageProgress(stageId, { hasProfile, answeredCount, totalCount, majorsExplored = [], careersExplored = [] }) {
  if (stageId === 'interest') {
    if (!totalCount) return hasProfile ? 100 : 0
    if (hasProfile) return 100
    return Math.round((answeredCount / totalCount) * 100)
  }
  if (stageId === 'major') {
    const count = majorsExplored.length
    if (count >= 3) return 100
    if (count > 0) return Math.min(100, Math.round((count / 3) * 100))
    return hasProfile ? 35 : 0
  }
  if (stageId === 'career') {
    if (careersExplored.length > 0) return 100
    return majorsExplored.length > 0 ? 35 : 0
  }
  if (stageId === 'report') {
    return hasProfile ? 100 : 0
  }
  return 0
}

export function getStageActionLabel(stageId, { hasProfile, answeredCount, majorsExplored = [], careersExplored = [] }) {
  if (stageId === 'interest') {
    if (hasProfile) return '查看结果'
    if (answeredCount > 0) return '继续探索'
    return '开始探索'
  }
  if (stageId === 'major') {
    if (majorsExplored.length >= 3) return '继续探索专业'
    if (majorsExplored.length > 0) return '继续专业体验'
    return '开始体验'
  }
  if (stageId === 'career') {
    if (careersExplored.length > 0) return '继续职业模拟'
    return '进入模拟'
  }
  if (stageId === 'report') return '查看探索报告'
  return '继续'
}
