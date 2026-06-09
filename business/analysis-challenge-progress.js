const STORAGE_KEY = 'uniprism.math.analysisChallengeProgress'

const EMPTY = () => ({
  calculation: { stars: 0, progress: 0, completed: false },
  'proof-sort': { stars: 0, progress: 0, completed: false },
  'proof-interactive': { stars: 0, progress: 0, completed: false },
})

function normalizeEntry(value) {
  if (!value || typeof value !== 'object') {
    return { stars: 0, progress: 0, completed: false }
  }
  const stars =
    typeof value.stars === 'number' && Number.isFinite(value.stars)
      ? Math.max(0, Math.min(3, Math.floor(value.stars)))
      : 0
  const progress =
    typeof value.progress === 'number' && Number.isFinite(value.progress)
      ? Math.max(0, Math.min(100, Math.round(value.progress)))
      : 0
  return {
    stars,
    progress,
    completed: value.completed === true,
  }
}

export function readAnalysisChallengeProgress() {
  try {
    const raw = uni.getStorageSync(STORAGE_KEY)
    if (!raw || typeof raw !== 'object') return EMPTY()
    return {
      calculation: normalizeEntry(raw.calculation),
      'proof-sort': normalizeEntry(raw['proof-sort']),
      'proof-interactive': normalizeEntry(raw['proof-interactive']),
    }
  } catch (error) {
    console.error('[analysis-challenge-progress] read failed', error)
    return EMPTY()
  }
}

export function writeAnalysisChallengeProgress(progress) {
  try {
    uni.setStorageSync(STORAGE_KEY, progress)
  } catch (error) {
    console.error('[analysis-challenge-progress] write failed', error)
  }
}

/** 完成某一关挑战（需在前一关已通过的前提下才会被调用） */
export function markAnalysisChallengeTaskCompleted(taskId) {
  const progress = readAnalysisChallengeProgress()
  progress[taskId] = { stars: 3, progress: 100, completed: true }
  writeAnalysisChallengeProgress(progress)
}

export function isAnalysisChallengeTaskLocked(taskId, progress) {
  const state = progress || readAnalysisChallengeProgress()
  if (taskId === 'proof-sort') return !state.calculation.completed
  if (taskId === 'proof-interactive') return !state['proof-sort'].completed
  return false
}

export function getAnalysisChallengeUnlockHint(taskId) {
  if (taskId === 'proof-sort') return '请先完成概念应用挑战。'
  if (taskId === 'proof-interactive') return '请先完成证明排序挑战。'
  return ''
}
