import { readStorage, removeStorage, writeStorage } from './storage'

const DISCOVER_SESSION_KEY = 'uniprism.mini.discoverSession'

/** @type {import('./discover-session').DiscoverSession} */
export const emptyDiscoverSession = {
  phase: 'intro',
  currentQuestionIndex: 0,
  backNavigationFloorIndex: null,
  answers: [],
  profile: null,
  recommendedMajors: null,
  personalityTraits: null,
  openEndedAnswers: {},
}

/** @returns {import('./discover-session').DiscoverSession} */
export function loadDiscoverSession() {
  const session = readStorage(DISCOVER_SESSION_KEY, emptyDiscoverSession)
  return {
    ...emptyDiscoverSession,
    ...session,
    backNavigationFloorIndex:
      typeof session.backNavigationFloorIndex === 'number' && Number.isFinite(session.backNavigationFloorIndex)
        ? session.backNavigationFloorIndex
        : null,
  }
}

/** @param {import('./discover-session').DiscoverSession} session */
export function saveDiscoverSession(session) {
  writeStorage(DISCOVER_SESSION_KEY, session)
}

export function resetDiscoverSession() {
  removeStorage(DISCOVER_SESSION_KEY)
}

/** @param {import('./discover-session').DiscoverSession} session @param {string} questionId @param {unknown} value */
export function submitAnswer(session, questionId, value) {
  const answer = {
    questionId,
    value,
    timestamp: Date.now(),
  }
  return {
    ...session,
    answers: [...session.answers.filter((item) => item.questionId !== questionId), answer],
  }
}
