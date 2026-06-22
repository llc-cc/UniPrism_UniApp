import {
  CHAT_SCREEN_ORDER,
  SCREEN_QUESTION_IDS,
  boundedScreenIndex,
  getScreenStageIndex,
  isStageIntroScreen,
} from './discover-chat-screens'
import {
  FINAL_CAREER_CALIBRATION_QUESTION_IDS,
  MBTI_KNOWN_QUESTION_ID,
  computePreCareerRiasecTopDimensions,
  getHollandFineQuestionIdsForDimensions,
} from './discover-questions'
import { isDiscoverReportComplete, readDiscoverReportCache } from './profile-sync'

const unique = (items) => [...new Set(items.filter(Boolean))]

const PERSONALITY_STAGE_QUESTION_IDS = unique([
  ...(SCREEN_QUESTION_IDS['personality-1'] || []),
  ...(SCREEN_QUESTION_IDS['personality-2'] || []),
  ...(SCREEN_QUESTION_IDS['personality-3'] || []),
  ...(SCREEN_QUESTION_IDS['personality-4'] || []),
])

const HOLLAND_STAGE_QUESTION_IDS = unique([
  ...(SCREEN_QUESTION_IDS['personality-holland-1'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-2'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-3'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-4'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-5'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-6'] || []),
])

function getDeepStageQuestionIds(answers) {
  const topDimensions = computePreCareerRiasecTopDimensions(
    Array.isArray(answers) ? answers : [],
    2,
  )
  const hollandFineIds = topDimensions.length > 0
    ? getHollandFineQuestionIdsForDimensions(topDimensions)
    : []
  return unique([...hollandFineIds, ...FINAL_CAREER_CALIBRATION_QUESTION_IDS])
}

function getStageSpecs(answers) {
  return [
    { id: 'personality', label: '性格测试', questionIds: PERSONALITY_STAGE_QUESTION_IDS },
    { id: 'holland', label: '职业测试', questionIds: HOLLAND_STAGE_QUESTION_IDS },
    { id: 'deep', label: '深度测评', questionIds: getDeepStageQuestionIds(answers) },
  ]
}

function hasNonEmptyAnswer(answer) {
  if (!answer || !answer.questionId) return false
  const value = answer.value
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') return Object.keys(value).length > 0
  return value !== undefined && value !== null
}

function buildAnsweredIdSet(answers) {
  return new Set((answers || [])
    .filter(hasNonEmptyAnswer)
    .map((answer) => answer.questionId)
    .filter(Boolean))
}

function isStageComplete(answeredIdSet, questionIds, extraCheck) {
  if (typeof extraCheck === 'function' && extraCheck(answeredIdSet)) return true
  return questionIds.length > 0 && questionIds.every((id) => answeredIdSet.has(id))
}

function hasPersonalitySkippedViaMbti(answeredIdSet) {
  if (!answeredIdSet.has(MBTI_KNOWN_QUESTION_ID)) return false
  return !PERSONALITY_STAGE_QUESTION_IDS.every((id) => answeredIdSet.has(id))
}

export function getSessionScreenId(session) {
  const index = session && session.currentQuestionIndex
  if (typeof index !== 'number' || !Number.isFinite(index)) return 'basic'
  return CHAT_SCREEN_ORDER[boundedScreenIndex(index, CHAT_SCREEN_ORDER.length)] || 'basic'
}

function getStageIntroIndex(screenId) {
  if (!isStageIntroScreen(screenId)) return -1
  return getScreenStageIndex(screenId)
}

function getReachedAssessmentStageIndex(session, answeredIdSet) {
  const screenId = getSessionScreenId(session)
  let reachedStageIndex = getScreenStageIndex(screenId)
  const introStageIndex = getStageIntroIndex(screenId)
  if (introStageIndex >= 0) {
    reachedStageIndex = Math.max(reachedStageIndex, introStageIndex)
  }
  if (hasPersonalitySkippedViaMbti(answeredIdSet)) {
    reachedStageIndex = Math.max(reachedStageIndex, 1)
  }
  return reachedStageIndex
}

export { getReachedAssessmentStageIndex }

const ASSESSMENT_STAGE_IDS = ['personality', 'holland', 'deep']

/**
 * @param {{ answers?: Array<{ questionId: string, value: unknown }>, currentQuestionIndex?: number }} session
 */
export function getInterestContinueAnchorIndex(session) {
  const stages = getInterestProgressSnapshot(session)
  const currentIndex = stages.findIndex((stage) => stage.status === 'current')
  const answers = (session && session.answers) || []
  const answeredIdSet = buildAnsweredIdSet(answers)
  const reachedStageIndex = getReachedAssessmentStageIndex(session, answeredIdSet)
  return Math.max(currentIndex >= 0 ? currentIndex : 0, reachedStageIndex)
}

/**
 * @param {{ answers?: Array<{ questionId: string, value: unknown }>, currentQuestionIndex?: number }} session
 */
export function getInterestContinueAnchorStageId(session) {
  const anchorIndex = getInterestContinueAnchorIndex(session)
  return ASSESSMENT_STAGE_IDS[Math.min(anchorIndex, ASSESSMENT_STAGE_IDS.length - 1)] || 'personality'
}

/**
 * @param {{ answers?: Array<{ questionId: string, value: unknown }>, currentQuestionIndex?: number }} session
 */
export function getInterestProgressSnapshot(session) {
  const answers = (session && session.answers) || []
  const answeredIdSet = buildAnsweredIdSet(answers)
  const stageSpecs = getStageSpecs(answers)
  const currentScreenId = getSessionScreenId(session)
  const reachedStageIndex = getReachedAssessmentStageIndex(session, answeredIdSet)

  const firstIncompleteIndex = stageSpecs.findIndex((item) => {
    if (item.id === 'personality') {
      return !isStageComplete(answeredIdSet, item.questionIds, (set) => set.has(MBTI_KNOWN_QUESTION_ID))
    }
    return !isStageComplete(answeredIdSet, item.questionIds)
  })

  const answerBasedCurrentIndex = firstIncompleteIndex < 0 ? stageSpecs.length : firstIncompleteIndex
  const currentStageIndex = Math.min(
    stageSpecs.length - 1,
    Math.max(answerBasedCurrentIndex, reachedStageIndex),
  )

  return stageSpecs.map((spec, index) => {
    const answeredCount = spec.questionIds.filter((id) => answeredIdSet.has(id)).length
    const complete = spec.id === 'personality'
      ? isStageComplete(answeredIdSet, spec.questionIds, (set) => set.has(MBTI_KNOWN_QUESTION_ID))
      : isStageComplete(answeredIdSet, spec.questionIds)

    let status = 'locked'
    if (complete || firstIncompleteIndex < 0) {
      status = 'completed'
    } else if (index === currentStageIndex) {
      status = 'current'
    } else if (index < currentStageIndex && complete) {
      status = 'completed'
    }

    let progressPercent = spec.questionIds.length
      ? Math.round((answeredCount / spec.questionIds.length) * 100)
      : 0

    if (index === reachedStageIndex) {
      progressPercent = Math.max(progressPercent, 100)
    }

    return {
      id: spec.id,
      label: spec.label,
      status,
      totalCount: spec.questionIds.length,
      answeredCount,
      progressPercent,
    }
  })
}

function normalizeLatestReportApiState(data) {
  if (!data || typeof data !== 'object') {
    return { exists: false, status: null, queued: false }
  }
  const status = typeof data.status === 'string' ? data.status : null
  const exists = data.exists === true || status === 'completed'
  const queued = data.queued === true || status === 'pending' || status === 'generating'
  return { exists, status, queued }
}

/**
 * @param {{ answers?: unknown[], profile?: unknown }} session
 * @param {ReturnType<typeof normalizeLatestReportApiState> | null | undefined} [apiReport]
 */
export function getHomeReportState(session, apiReport) {
  const cached = readDiscoverReportCache(session)
  if (cached || isDiscoverReportComplete(session)) {
    return { exists: true, status: 'completed', queued: false }
  }

  if (apiReport) {
    const remote = normalizeLatestReportApiState(apiReport)
    if (remote.exists) {
      return { exists: true, status: 'completed', queued: false }
    }
    if (remote.queued) {
      return { exists: false, status: remote.status, queued: true }
    }
  }

  return { exists: false, status: null, queued: false }
}

export function isDiscoveryCompleted(session) {
  const stages = getInterestProgressSnapshot(session)
  return stages.every((stage) => stage.status === 'completed')
}

export const INTEREST_NODE_ORDER = ['personality', 'holland', 'deep', 'report']

export const INTEREST_NODE_LABELS = {
  personality: '性格测试',
  holland: '职业测试',
  deep: '深度测评',
  report: '生成报告',
}

/** @param {ReturnType<typeof getInterestProgressSnapshot>} stages */
export function getFirstIncompleteStage(stages) {
  return stages.find((stage) => stage.status !== 'completed') || null
}

const ASSESSMENT_STAGE_ORDER = ['personality', 'holland', 'deep']

/**
 * @param {typeof INTEREST_NODE_ORDER[number]} targetNodeId
 * @param {ReturnType<typeof getInterestProgressSnapshot>} stages
 */
export function getInterestLockPromptCopy(targetNodeId, stages) {
  if (targetNodeId === 'report') {
    const incompleteLabels = ASSESSMENT_STAGE_ORDER
      .map((id) => stages.find((stage) => stage.id === id))
      .filter((stage) => stage && stage.status !== 'completed')
      .map((stage) => stage.label)

    if (incompleteLabels.length > 0) {
      return {
        stageLabel: incompleteLabels.join('、'),
        hint: incompleteLabels.length > 1 ? '请先完成以上阶段，完成后即可生成报告' : '请先完成该阶段，完成后即可生成报告',
      }
    }

    return {
      stageLabel: INTEREST_NODE_LABELS.report,
      hint: '完成全部测评后即可生成报告',
    }
  }

  const targetIndex = ASSESSMENT_STAGE_ORDER.indexOf(targetNodeId)
  const prerequisiteLabels = ASSESSMENT_STAGE_ORDER
    .slice(0, Math.max(0, targetIndex))
    .map((id) => stages.find((stage) => stage.id === id))
    .filter((stage) => stage && stage.status !== 'completed')
    .map((stage) => stage.label)

  if (prerequisiteLabels.length > 0) {
    return {
      stageLabel: prerequisiteLabels.join('、'),
      hint: prerequisiteLabels.length > 1 ? '请先完成以上阶段，完成后即可进入当前阶段' : '请先完成该阶段，完成后即可进入当前阶段',
    }
  }

  const stage = getFirstIncompleteStage(stages)
  return {
    stageLabel: stage ? stage.label : '上一阶段',
    hint: '请先按顺序完成当前阶段内容',
  }
}

/**
 * @param {typeof INTEREST_NODE_ORDER[number]} nodeId
 * @param {ReturnType<typeof getInterestProgressSnapshot>} stages
 * @param {boolean} discoveryCompleted
 */
export function isInterestNodeUnlocked(nodeId, stages, discoveryCompleted) {
  if (nodeId === 'personality') return true
  if (nodeId === 'report') return discoveryCompleted
  const assessmentOrder = ['personality', 'holland', 'deep']
  const idx = assessmentOrder.indexOf(nodeId)
  if (idx <= 0) return true
  for (let i = 0; i < idx; i += 1) {
    const stage = stages.find((item) => item.id === assessmentOrder[i])
    if (!stage || stage.status !== 'completed') return false
  }
  return true
}
