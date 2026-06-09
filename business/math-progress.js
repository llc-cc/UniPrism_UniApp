const MATH_PROGRESS_KEY = 'uniprism.math.experience'

export const MATH_STAGES = [
  { key: 'overview', label: '概览' },
  { key: 'intro', label: '介绍' },
  { key: 'deep', label: '深入' },
  { key: 'branching', label: '分流' },
  { key: 'direction', label: '方向' },
]

export function loadMathProgress() {
  try {
    const raw = uni.getStorageSync(MATH_PROGRESS_KEY)
    if (!raw) {
      return {
        pageIndex: 0,
        selectedBranchId: 'basic',
        selectedBranchTitle: '基础数学',
        fitChoice: '',
        unlockedStageIndexes: [0],
        visitedCourses: [],
        visitedChallenges: [],
        completed: false,
      }
    }
    return {
      pageIndex: typeof raw.pageIndex === 'number' ? raw.pageIndex : 0,
      selectedBranchId: raw.selectedBranchId || 'basic',
      selectedBranchTitle: raw.selectedBranchTitle || '基础数学',
      fitChoice: raw.fitChoice || '',
      unlockedStageIndexes: Array.isArray(raw.unlockedStageIndexes) ? raw.unlockedStageIndexes : [0],
      visitedCourses: raw.visitedCourses || [],
      visitedChallenges: raw.visitedChallenges || [],
      completed: Boolean(raw.completed),
    }
  } catch (error) {
    console.error('[math-progress] load failed', error)
    return {
      pageIndex: 0,
      selectedBranchId: 'basic',
      selectedBranchTitle: '基础数学',
      fitChoice: '',
      unlockedStageIndexes: [0],
      visitedCourses: [],
      visitedChallenges: [],
      completed: false,
    }
  }
}

export function saveMathProgress(progress) {
  try {
    const existing = loadMathProgress()
    uni.setStorageSync(MATH_PROGRESS_KEY, { ...existing, ...progress })
  } catch (error) {
    console.error('[math-progress] save failed', error)
  }
}

export function markMathCourseVisited(courseId) {
  const progress = loadMathProgress()
  const visitedCourses = Array.from(new Set([...(progress.visitedCourses || []), courseId]))
  saveMathProgress({ ...progress, visitedCourses })
}

export function markMathChallengeVisited(challengeId) {
  const progress = loadMathProgress()
  const visitedChallenges = Array.from(new Set([...(progress.visitedChallenges || []), challengeId]))
  saveMathProgress({ ...progress, visitedChallenges })
}

export function isMathExperienceReadyToComplete(progress) {
  const state = progress || loadMathProgress()
  return (state.visitedCourses || []).length >= 1 || (state.visitedChallenges || []).length >= 1
}
