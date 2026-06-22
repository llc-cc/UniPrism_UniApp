const MATH_PROGRESS_KEY = 'uniprism.math.experience'

export const MATH_STAGES = [
  { key: 'intro', label: '数学专业介绍' },
  { key: 'foundation', label: '三门基础课程' },
  { key: 'advanced', label: '三门进阶课程' },
  { key: 'stream', label: '数学专业分流' },
  { key: 'complete', label: '体验完成' },
]

export function loadMathProgress() {
  try {
    const raw = uni.getStorageSync(MATH_PROGRESS_KEY)
    if (!raw) {
      return {
        pageIndex: 0,
        unlockedPageIndex: 0,
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
      unlockedPageIndex: typeof raw.unlockedPageIndex === 'number' ? raw.unlockedPageIndex : (typeof raw.pageIndex === 'number' ? raw.pageIndex : 0),
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
      unlockedPageIndex: 0,
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
