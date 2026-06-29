import { getTopDimensions, normalizeScores } from './riasecEngine'

function createEmptyRiasecScores() {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
}

export const MBTI_KNOWN_QUESTION_ID = 'personality-mbti-known-type'

const HOLLAND_FINE_VALID_DIMENSIONS = ['R', 'I', 'A', 'S', 'E', 'C']
const HOLLAND_SCALE_SLUG_TO_DIMENSION = {
  r: 'R',
  i: 'I',
  a: 'A',
  s: 'S',
  e: 'E',
  c: 'C',
}

export const FINAL_CAREER_CALIBRATION_QUESTION_IDS = Array.from({ length: 25 }, (_, index) =>
  `final-career-calibration-${String(index + 1).padStart(2, '0')}`,
)

/** @param {string[]} dimensions */
export function getHollandFineQuestionIdsForDimensions(dimensions) {
  const uniqueDimensions = [...new Set(dimensions)].filter((dimension) =>
    HOLLAND_FINE_VALID_DIMENSIONS.includes(dimension),
  )
  return uniqueDimensions.flatMap((dimension) =>
    Array.from({ length: 5 }, (_, sceneIndex) =>
      `holland-${dimension.toLowerCase()}-scene-${String(sceneIndex + 1).padStart(2, '0')}`,
    ),
  )
}

function addRiasecWeights(scores, weights = {}) {
  for (const [dimension, value] of Object.entries(weights)) {
    if (typeof value === 'number' && dimension in scores) {
      scores[dimension] += value
    }
  }
}

function scoreTotal(scores) {
  return Object.values(scores).reduce((sum, value) => sum + value, 0)
}

/**
 * 主包进度展示用的轻量 RIASEC 估算（对齐 personality-holland 量表计分规则）。
 * @param {Array<{ questionId?: string, value?: unknown }>} answers
 * @param {number} [count]
 */
export function computePreCareerRiasecTopDimensions(answers, count = 2) {
  const scores = createEmptyRiasecScores()
  const safeAnswers = Array.isArray(answers) ? answers : []

  for (const answer of safeAnswers) {
    const questionId = answer?.questionId
    if (typeof questionId !== 'string') continue

    const match = questionId.match(/^personality-holland-([a-z])-\d{2}$/)
    if (!match) continue

    const dimension = HOLLAND_SCALE_SLUG_TO_DIMENSION[match[1]]
    const selectedId = typeof answer.value === 'string' ? answer.value : ''
    const scoreMatch = selectedId.match(/-([1-5])$/)
    const score = scoreMatch ? Number(scoreMatch[1]) : 0
    if (!dimension || !score) continue
    addRiasecWeights(scores, { [dimension]: score })
  }

  if (scoreTotal(scores) > 0) {
    return getTopDimensions(normalizeScores(scores), count)
  }

  return []
}
