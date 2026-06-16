/**
 * 问卷分屏配置（对齐 Web /explore/discover/chat SCREEN_QUESTION_IDS）
 */
export const CHAT_SCREEN_ORDER = [
  'basic',
  'stage-interest-intro',
  'interest-1',
  'interest-2',
  'interest-3',
  'stage-personality-intro',
  'personality-1',
  'personality-2',
  'personality-3',
  'personality-4',
  'ability-1',
  'ability-2',
  'ability-3',
  'ability-surakarta-intro',
  'ability-4',
  'ability-5',
  'stage-career-intro',
  'career-1',
  'career-2',
  'career-3',
  'career-4',
  'career-5',
  'career-6',
]

const PERSONALITY_EI_QUESTION_IDS = [
  'personality-ei-new-student-dinner',
  'personality-ei-social-day-after',
  'personality-ei-group-speaking',
  'personality-ei-cafeteria-lunch',
  'personality-ei-weekend-morning',
  'personality-ei-self-introduction',
  'personality-ei-last-minute-event',
]

const PERSONALITY_SN_QUESTION_IDS = [
  'personality-sn-dorm-recommendation',
  'personality-sn-course-project',
  'personality-sn-favorite-creator',
  'personality-sn-ai-news',
  'personality-sn-new-skill',
  'personality-sn-travel-story',
  'personality-sn-new-course',
]

const PERSONALITY_TF_QUESTION_IDS = [
  'personality-tf-summer-job',
  'personality-tf-friend-breakup',
  'personality-tf-group-partner',
  'personality-tf-debate',
  'personality-tf-dorm-rule',
  'personality-tf-public-criticism',
  'personality-tf-team-disagreement',
]

const PERSONALITY_JP_QUESTION_IDS = [
  'personality-jp-summer-plan',
  'personality-jp-term-paper',
  'personality-jp-phone-home',
  'personality-jp-movie-weekend',
  'personality-jp-travel-planner',
  'personality-jp-exam-notes',
  'personality-jp-competition-signup',
]

const LOTA_ABILITY_QUESTION_IDS = [
  'ability-jinchao-lamp-1',
  'ability-jinchao-lamp-2',
  'ability-jinchao-lamp-3',
  'ability-jinchao-lamp-4',
  'ability-jinchao-lamp-6',
]

const SURAKARTA_ABILITY_QUESTION_IDS = [
  'ability-surakarta-1-step-count',
  'ability-surakarta-2-capture-targets',
  'ability-surakarta-3-side-captures',
  'ability-surakarta-4-piece-legal-moves',
]

export const SCREEN_QUESTION_IDS = {
  basic: ['basic-profile'],
  'interest-1': ['interest-tags-1'],
  'interest-2': ['interest-tags-2'],
  'interest-3': ['interest-tags-3'],
  'personality-1': [...PERSONALITY_EI_QUESTION_IDS],
  'personality-2': [...PERSONALITY_SN_QUESTION_IDS],
  'personality-3': [...PERSONALITY_TF_QUESTION_IDS],
  'personality-4': [...PERSONALITY_JP_QUESTION_IDS],
  'ability-1': [...LOTA_ABILITY_QUESTION_IDS.slice(0, 2)],
  'ability-2': [...LOTA_ABILITY_QUESTION_IDS.slice(2, 4)],
  'ability-3': [...LOTA_ABILITY_QUESTION_IDS.slice(4, 5)],
  'ability-4': [...SURAKARTA_ABILITY_QUESTION_IDS.slice(0, 2)],
  'ability-5': [...SURAKARTA_ABILITY_QUESTION_IDS.slice(2, 4)],
  'career-1': ['value-life-goal'],
  'career-2': ['value-ai-life-route'],
  'career-3': ['value-17th-century'],
  'career-4': ['value-roommate-rules'],
  'career-5': ['value-family-pet-decision'],
  'career-6': ['value-future-self-letter'],
}

export const PERSONALITY_SCREEN_TITLES = {
  'personality-1': '性格测试 1/4：能量来源',
  'personality-2': '性格测试 2/4：信息获取',
  'personality-3': '性格测试 3/4：决策方式',
  'personality-4': '性格测试 4/4：生活方式',
}

/** @param {string} screenId */
export function isStageIntroScreen(screenId) {
  return screenId === 'stage-interest-intro'
    || screenId === 'stage-personality-intro'
    || screenId === 'stage-ability-intro'
    || screenId === 'stage-career-intro'
}

/** @param {string} screenId */
export function isAbilityOverviewScreen(screenId) {
  return screenId === 'ability-surakarta-intro'
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
export function isAbilityScreen(screenId) {
  return screenId.startsWith('ability-')
}

/** @param {string} screenId */
export function isCareerScreen(screenId) {
  return screenId === 'career' || screenId.startsWith('career-')
}

/** @param {string} screenId */
export function isBatchScreen(screenId) {
  return isPersonalityScreen(screenId) || isAbilityScreen(screenId)
}

/** @param {string} screenId */
export function getScreenStageIndex(screenId) {
  if (screenId === 'basic' || screenId === 'stage-interest-intro' || isInterestScreen(screenId)) return 0
  if (screenId === 'stage-personality-intro' || isPersonalityScreen(screenId)) return 1
  if (screenId === 'stage-ability-intro' || isAbilityOverviewScreen(screenId) || isAbilityScreen(screenId)) return 2
  if (screenId === 'stage-career-intro' || isCareerScreen(screenId)) return 3
  return 0
}

/** @param {string} screenId @param {Array<{ id?: string }>} [screenQuestions] */
export function getScreenTitle(screenId, screenQuestions = []) {
  if (screenId === 'stage-interest-intro') return '阶段一：兴趣探索'
  if (screenId === 'stage-personality-intro') return '阶段二：性格测试'
  if (screenId === 'stage-ability-intro') return '阶段三：能力测试'
  if (screenId === 'stage-career-intro') return '阶段四：职业倾向'
  if (screenId === 'ability-surakarta-intro') return '能力测试：苏拉卡尔塔棋说明'
  if (PERSONALITY_SCREEN_TITLES[screenId]) return PERSONALITY_SCREEN_TITLES[screenId]
  if (isAbilityScreen(screenId)) {
    const pageNo = Number(screenId.split('-')[1] || 0)
    return screenQuestions.some((q) => q.id && q.id.startsWith('ability-surakarta-'))
      ? `能力测试 ${pageNo}/5：棋局推理`
      : `能力测试 ${pageNo}/5：灯语推理`
  }
  if (screenId === 'basic') return '先完成一页基本信息'
  if (isInterestScreen(screenId)) return '兴趣探索'
  if (isCareerScreen(screenId)) return '职业倾向情景测试'
  return ''
}

/** @param {Array<{ id?: string }>} screenQuestions */
export function getAbilityBatchDescription(screenQuestions) {
  if (screenQuestions.some((q) => q.id && q.id.startsWith('ability-surakarta-'))) {
    return `共 ${screenQuestions.length} 题，每题单选。前 ${LOTA_ABILITY_QUESTION_IDS.length} 题考察灯语规则迁移，后 ${SURAKARTA_ABILITY_QUESTION_IDS.length} 题考察苏拉卡尔塔棋局推理。`
  }
  return `共 ${screenQuestions.length} 题，每题单选。请根据题面里的灯语规则和剧情线索判断最合理的答案。`
}

/** @param {string} screenId @param {Map<string, unknown>} questionById */
export function getQuestionsForScreen(screenId, questionById) {
  const ids = SCREEN_QUESTION_IDS[screenId] || []
  return ids.map((id) => questionById.get(id)).filter(Boolean)
}

export const DISCOVER_ACTIVE_QUESTION_COUNT = [
  ...new Set(Object.values(SCREEN_QUESTION_IDS).flat()),
].length

/** 顶部进度条五阶段（对齐 Web PROGRESS_STAGE_SPECS） */
export const PROGRESS_STAGE_SPECS = [
  { id: 'interest', shortLabel: '兴趣', targetScreen: 'interest-1' },
  { id: 'personality', shortLabel: '性格', targetScreen: 'personality-1' },
  { id: 'ability', shortLabel: '能力', targetScreen: 'ability-1' },
  { id: 'career', shortLabel: '职业', targetScreen: 'career-1' },
  { id: 'report', shortLabel: '报告', targetScreen: 'complete' },
]

/** @param {string} screenId @param {boolean} [isComplete] */
export function getProgressStageIndex(screenId, isComplete = false) {
  if (isComplete) return PROGRESS_STAGE_SPECS.length - 1
  if (screenId === 'basic' || screenId === 'stage-interest-intro' || isInterestScreen(screenId)) return 0
  if (screenId === 'stage-personality-intro' || isPersonalityScreen(screenId)) return 1
  if (screenId === 'stage-ability-intro' || isAbilityOverviewScreen(screenId) || isAbilityScreen(screenId)) return 2
  if (screenId === 'stage-career-intro' || isCareerScreen(screenId)) return 3
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
