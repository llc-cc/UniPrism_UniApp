const storageKey = (majorId, moduleId, task) =>
  `uniprism.majorChallenge.${majorId}.${moduleId}.${task}`

export function readMajorChallengeProgress(majorId, moduleId, task) {
  try {
    const raw = uni.getStorageSync(storageKey(majorId, moduleId, task))
    if (!raw || typeof raw !== 'object') {
      return { stars: 0, progress: 0, completed: false }
    }
    return {
      stars: typeof raw.stars === 'number' ? raw.stars : 0,
      progress: typeof raw.progress === 'number' ? raw.progress : 0,
      completed: raw.completed === true,
    }
  } catch (error) {
    console.error('[major-challenge-progress] read failed', error)
    return { stars: 0, progress: 0, completed: false }
  }
}

export function writeMajorChallengeProgress(majorId, moduleId, task, payload) {
  try {
    uni.setStorageSync(storageKey(majorId, moduleId, task), {
      ...payload,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error('[major-challenge-progress] write failed', error)
  }
}

export function markMajorChallengeCompleted(majorId, moduleId, task, stars, progress) {
  writeMajorChallengeProgress(majorId, moduleId, task, {
    stars,
    progress,
    completed: stars >= 3,
  })
}

export function isMajorChallengeCompleted(majorId, moduleId, task) {
  return readMajorChallengeProgress(majorId, moduleId, task).completed
}
