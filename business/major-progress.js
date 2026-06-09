const progressKey = (majorId) => `uniprism.major.experience.${majorId}`

function emptyProgress() {
  return {
    visitedCourses: [],
    visitedChallenges: [],
  }
}

export function loadMajorProgress(majorId) {
  try {
    const raw = uni.getStorageSync(progressKey(majorId))
    if (!raw || typeof raw !== 'object') return emptyProgress()
    return {
      visitedCourses: Array.isArray(raw.visitedCourses) ? raw.visitedCourses : [],
      visitedChallenges: Array.isArray(raw.visitedChallenges) ? raw.visitedChallenges : [],
    }
  } catch (error) {
    console.error('[major-progress] load failed', error)
    return emptyProgress()
  }
}

function saveMajorProgress(majorId, patch) {
  try {
    const existing = loadMajorProgress(majorId)
    uni.setStorageSync(progressKey(majorId), { ...existing, ...patch })
  } catch (error) {
    console.error('[major-progress] save failed', error)
  }
}

export function markMajorCourseVisited(majorId, courseId) {
  if (!majorId || !courseId) return
  const progress = loadMajorProgress(majorId)
  const visitedCourses = Array.from(new Set([...progress.visitedCourses, courseId]))
  saveMajorProgress(majorId, { visitedCourses })
}

export function markMajorChallengeVisited(majorId, challengeKey) {
  if (!majorId || !challengeKey) return
  const progress = loadMajorProgress(majorId)
  const visitedChallenges = Array.from(new Set([...progress.visitedChallenges, challengeKey]))
  saveMajorProgress(majorId, { visitedChallenges })
}
