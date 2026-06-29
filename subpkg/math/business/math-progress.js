const MATH_PROGRESS_KEY = 'uniprism.math.experience'
const MATH_PROGRESS_SCHEMA_VERSION = 3

function createDefaultMathProgress() {
  return {
    progressSchemaVersion: MATH_PROGRESS_SCHEMA_VERSION,
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

function migrateMathProgress(raw) {
  const progress = {
    ...createDefaultMathProgress(),
    pageIndex: typeof raw.pageIndex === 'number' ? raw.pageIndex : 0,
    unlockedPageIndex:
      typeof raw.unlockedPageIndex === 'number'
        ? raw.unlockedPageIndex
        : typeof raw.pageIndex === 'number'
          ? raw.pageIndex
          : 0,
    selectedBranchId: raw.selectedBranchId || 'basic',
    selectedBranchTitle: raw.selectedBranchTitle || '基础数学',
    fitChoice: raw.fitChoice || '',
    unlockedStageIndexes: Array.isArray(raw.unlockedStageIndexes) ? raw.unlockedStageIndexes : [0],
    visitedCourses: raw.visitedCourses || [],
    visitedChallenges: raw.visitedChallenges || [],
    completed: Boolean(raw.completed),
    progressSchemaVersion:
      typeof raw.progressSchemaVersion === 'number' ? raw.progressSchemaVersion : 1,
  }

  if (progress.progressSchemaVersion < 2) {
    if (progress.pageIndex >= 2) progress.pageIndex -= 1
    if (progress.unlockedPageIndex >= 2) progress.unlockedPageIndex -= 1
    progress.progressSchemaVersion = 2
  }

  if (progress.progressSchemaVersion < 3) {
    const unlockedStage = Array.isArray(progress.unlockedStageIndexes) && progress.unlockedStageIndexes.length
      ? Math.max(...progress.unlockedStageIndexes)
      : 0
    if (unlockedStage >= 2) {
      progress.pageIndex = Math.max(1, progress.pageIndex - 3)
      progress.unlockedPageIndex = Math.max(1, progress.unlockedPageIndex - 3)
    } else if (unlockedStage >= 1 || progress.pageIndex >= 1) {
      progress.pageIndex = Math.max(1, Math.min(progress.pageIndex, 1))
      progress.unlockedPageIndex = Math.max(1, progress.unlockedPageIndex)
    } else {
      progress.pageIndex = 0
      progress.unlockedPageIndex = 0
    }
    progress.progressSchemaVersion = MATH_PROGRESS_SCHEMA_VERSION
  }

  return progress
}

export const MATH_STAGES = [
  { key: 'intro', label: '数学专业介绍' },
  { key: 'foundation', label: '数学课程介绍' },
  { key: 'advanced', label: '三门进阶课程' },
  { key: 'stream', label: '数学专业分流' },
  { key: 'complete', label: '体验完成' },
]

export function loadMathProgress() {
  try {
    const raw = uni.getStorageSync(MATH_PROGRESS_KEY)
    if (!raw) {
      return createDefaultMathProgress()
    }
    const progress = migrateMathProgress(raw)
    if ((raw.progressSchemaVersion || 1) < MATH_PROGRESS_SCHEMA_VERSION) {
      uni.setStorageSync(MATH_PROGRESS_KEY, progress)
    }
    return progress
  } catch (error) {
    console.error('[math-progress] load failed', error)
    return createDefaultMathProgress()
  }
}

export function saveMathProgress(progress) {
  try {
    const existing = loadMathProgress()
    uni.setStorageSync(MATH_PROGRESS_KEY, {
      ...existing,
      ...progress,
      progressSchemaVersion: MATH_PROGRESS_SCHEMA_VERSION,
    })
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
