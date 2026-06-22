import {
  FINAL_CAREER_CALIBRATION_QUESTION_IDS,
  PERSONALITY_HOLLAND_SCALE_DISPLAY_QUESTION_IDS,
  PERSONALITY_MBTI_DISPLAY_QUESTION_IDS,
  computePreCareerRiasecTopDimensions,
  getHollandFineQuestionIdsForDimensions,
} from './discover-questions'

/**
 * 问卷分屏配置（对齐 Web /explore/discover/chat SCREEN_ORDER 主流程）
 * 这里额外把深度测评可能出现的 `career-1..career-6` 全部枚举出来，
 * 以兼容 Top2 维度各 3 题的动态分屏。
 */
export const CHAT_SCREEN_ORDER = [
  'basic',
  'stage-personality-intro',
  'personality-1',
  'personality-2',
  'personality-3',
  'personality-4',
  'stage-holland-intro',
  'personality-holland-1',
  'personality-holland-2',
  'personality-holland-3',
  'personality-holland-4',
  'personality-holland-5',
  'personality-holland-6',
  'stage-deep-intro',
  'career-1',
  'career-2',
  'career-3',
  'career-4',
  'career-5',
  'career-6',
  'career-calibration-1',
  'career-calibration-2',
]

const PERSONALITY_PAGE_SIZE = 15
const HOLLAND_PAGE_SIZE = 10
const CAREER_CALIBRATION_PAGE_SIZE = 15

export const SCREEN_QUESTION_IDS = {
  basic: ['basic-profile'],
  'personality-1': [...PERSONALITY_MBTI_DISPLAY_QUESTION_IDS.slice(0, PERSONALITY_PAGE_SIZE)],
  'personality-2': [...PERSONALITY_MBTI_DISPLAY_QUESTION_IDS.slice(PERSONALITY_PAGE_SIZE, PERSONALITY_PAGE_SIZE * 2)],
  'personality-3': [...PERSONALITY_MBTI_DISPLAY_QUESTION_IDS.slice(PERSONALITY_PAGE_SIZE * 2, PERSONALITY_PAGE_SIZE * 3)],
  'personality-4': [...PERSONALITY_MBTI_DISPLAY_QUESTION_IDS.slice(PERSONALITY_PAGE_SIZE * 3, PERSONALITY_PAGE_SIZE * 4)],
  'personality-holland-1': [...PERSONALITY_HOLLAND_SCALE_DISPLAY_QUESTION_IDS.slice(0, HOLLAND_PAGE_SIZE)],
  'personality-holland-2': [...PERSONALITY_HOLLAND_SCALE_DISPLAY_QUESTION_IDS.slice(HOLLAND_PAGE_SIZE, HOLLAND_PAGE_SIZE * 2)],
  'personality-holland-3': [...PERSONALITY_HOLLAND_SCALE_DISPLAY_QUESTION_IDS.slice(HOLLAND_PAGE_SIZE * 2, HOLLAND_PAGE_SIZE * 3)],
  'personality-holland-4': [...PERSONALITY_HOLLAND_SCALE_DISPLAY_QUESTION_IDS.slice(HOLLAND_PAGE_SIZE * 3, HOLLAND_PAGE_SIZE * 4)],
  'personality-holland-5': [...PERSONALITY_HOLLAND_SCALE_DISPLAY_QUESTION_IDS.slice(HOLLAND_PAGE_SIZE * 4, HOLLAND_PAGE_SIZE * 5)],
  'personality-holland-6': [...PERSONALITY_HOLLAND_SCALE_DISPLAY_QUESTION_IDS.slice(HOLLAND_PAGE_SIZE * 5, HOLLAND_PAGE_SIZE * 6)],
  'career-calibration-1': [...FINAL_CAREER_CALIBRATION_QUESTION_IDS.slice(0, CAREER_CALIBRATION_PAGE_SIZE)],
  'career-calibration-2': [...FINAL_CAREER_CALIBRATION_QUESTION_IDS.slice(CAREER_CALIBRATION_PAGE_SIZE, CAREER_CALIBRATION_PAGE_SIZE * 2)],
}

export const PERSONALITY_SCREEN_TITLES = {
  'personality-1': '性格测试 1/4：能量来源',
  'personality-2': '性格测试 2/4：信息获取',
  'personality-3': '性格测试 3/4：决策方式',
  'personality-4': '性格测试 4/4：生活方式',
  'personality-holland-1': '职业测评 1/6：职业兴趣量表',
  'personality-holland-2': '职业测评 2/6：职业兴趣量表',
  'personality-holland-3': '职业测评 3/6：职业兴趣量表',
  'personality-holland-4': '职业测评 4/6：职业兴趣量表',
  'personality-holland-5': '职业测评 5/6：职业兴趣量表',
  'personality-holland-6': '职业测评 6/6：职业兴趣量表',
}

/** @param {string} screenId */
export function isStageIntroScreen(screenId) {
  return screenId === 'stage-personality-intro'
    || screenId === 'stage-holland-intro'
    || screenId === 'stage-deep-intro'
}

/** @param {string} screenId */
export function isInterestScreen(screenId) {
  return screenId.startsWith('interest-')
}

/** @param {string} screenId */
export function isPersonalityScreen(screenId) {
  return screenId.startsWith('personality-')
}

/** @param {string} screenId */
export function isCareerScreen(screenId) {
  return /^career-\d+$/.test(screenId)
}

/** @param {string} screenId */
export function isCareerCalibrationScreen(screenId) {
  return /^career-calibration-\d+$/.test(screenId)
}

/** @param {string} screenId */
export function isAbilityOverviewScreen(screenId) {
  return false
}

/** @param {string} screenId */
export function isAbilityScreen(screenId) {
  return false
}

/** @param {string} screenId */
export function isBatchScreen(screenId) {
  return isPersonalityScreen(screenId) || isCareerCalibrationScreen(screenId)
}

function getCareerQuestionIds(answers = []) {
  const topDimensions = computePreCareerRiasecTopDimensions(Array.isArray(answers) ? answers : [], 2)
  return topDimensions.flatMap((dimension) => getHollandFineQuestionIdsForDimensions([dimension]))
}

/** @param {string} screenId */
export function getScreenStageIndex(screenId) {
  if (screenId === 'basic' || screenId === 'stage-personality-intro' || /^personality-\d+$/.test(screenId)) return 0
  if (screenId === 'stage-holland-intro' || /^personality-holland-\d+$/.test(screenId)) return 1
  if (screenId === 'stage-deep-intro' || isCareerScreen(screenId) || isCareerCalibrationScreen(screenId)) return 2
  return 0
}

/** @param {string} screenId @param {Array<{ id?: string }>} [screenQuestions] */
export function getScreenTitle(screenId, screenQuestions = []) {
  if (screenId === 'stage-personality-intro') return '阶段一：性格测试'
  if (screenId === 'stage-holland-intro') return '阶段二：职业测试'
  if (screenId === 'stage-deep-intro') return '阶段三：深度测评'
  if (PERSONALITY_SCREEN_TITLES[screenId]) return PERSONALITY_SCREEN_TITLES[screenId]
  if (isCareerScreen(screenId)) return '深度测评'
  if (isCareerCalibrationScreen(screenId)) return '深度测评：职业校准'
  if (screenId === 'basic') return '先完成一页基本信息'
  return ''
}

/** @param {Array<{ id?: string }>} screenQuestions */
export function getAbilityBatchDescription(screenQuestions) {
  return `共 ${screenQuestions.length} 题，每题单选。请根据题面描述选择最符合你的答案。`
}

/**
 * @param {string} screenId
 * @param {Map<string, unknown>} questionById
 * @param {Array<{ questionId?: string, value?: unknown }>} [answers]
 */
export function getQuestionsForScreen(screenId, questionById, answers = []) {
  let ids = SCREEN_QUESTION_IDS[screenId] || []
  if (isCareerScreen(screenId)) {
    const index = Number(screenId.split('-')[1] || 0) - 1
    const careerIds = getCareerQuestionIds(answers)
    ids = careerIds[index] ? [careerIds[index]] : []
  }
  return ids.map((id) => questionById.get(id)).filter(Boolean)
}

export const DISCOVER_ACTIVE_QUESTION_COUNT = [
  ...new Set(Object.values(SCREEN_QUESTION_IDS).flat()),
].length

/** 顶部进度条四阶段：性格测试、职业测评、深度测评、生成报告 */
export const PROGRESS_STAGE_SPECS = [
  { id: 'personality', shortLabel: '性格', targetScreen: 'stage-personality-intro' },
  { id: 'career', shortLabel: '职业', targetScreen: 'personality-holland-1' },
  { id: 'deep-assessment', shortLabel: '深测', targetScreen: 'career-1' },
  { id: 'report', shortLabel: '报告', targetScreen: 'complete' },
]

/** @param {string} screenId @param {boolean} [isComplete] */
export function getProgressStageIndex(screenId, isComplete = false) {
  if (isComplete) return PROGRESS_STAGE_SPECS.length - 1
  if (screenId === 'basic' || screenId === 'stage-personality-intro' || /^personality-\d+$/.test(screenId)) return 0
  if (screenId === 'stage-holland-intro' || /^personality-holland-\d+$/.test(screenId)) return 1
  if (screenId === 'stage-deep-intro' || isCareerScreen(screenId) || isCareerCalibrationScreen(screenId)) return 2
  return 0
}

/** @param {number} stageIndex */
export function getProgressStageTargetScreenIndex(stageIndex) {
  const spec = PROGRESS_STAGE_SPECS[stageIndex]
  if (!spec || spec.targetScreen === 'complete') return -1
  const idx = CHAT_SCREEN_ORDER.indexOf(spec.targetScreen)
  return idx >= 0 ? idx : 0
}

/** @param {number} stageIndex @param {number} activeStageIndex @param {boolean} [isComplete] */
export function isProgressStageClickable(stageIndex, activeStageIndex, isComplete = false) {
  if (stageIndex < 0 || stageIndex >= PROGRESS_STAGE_SPECS.length) return false
  if (stageIndex >= PROGRESS_STAGE_SPECS.length - 1) return false
  if (isComplete) return stageIndex < PROGRESS_STAGE_SPECS.length - 1
  return stageIndex < activeStageIndex
}

/** @param {Map<string, unknown>} questionById */
export function findFirstScreenIndexWithQuestions(questionById) {
  for (let index = 0; index < CHAT_SCREEN_ORDER.length; index += 1) {
    const screenId = CHAT_SCREEN_ORDER[index]
    if (getQuestionsForScreen(screenId, questionById).length > 0) return index
  }
  return 0
}

/** @param {number} index @param {number} [total] */
export function boundedScreenIndex(index, total = CHAT_SCREEN_ORDER.length) {
  if (typeof index !== 'number' || !Number.isFinite(index)) return 0
  return Math.max(0, Math.min(total - 1, Math.floor(index)))
}
