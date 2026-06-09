/**
 * 问卷分屏配置（对齐 Web /explore/discover/chat SCREEN_ORDER）
 */
export const CHAT_SCREEN_ORDER = [
  'basic',
  'interest-1',
  'interest-2',
  'interest-3',
  'personality-1',
  'personality-2',
  'personality-3',
  'personality-4',
  'ability',
  'career',
]

export const SCREEN_QUESTION_IDS = {
  basic: ['basic-profile'],
  'interest-1': ['interest-tags-1'],
  'interest-2': ['interest-tags-2'],
  'interest-3': ['interest-tags-3'],
  'personality-1': [
    'personality-ei-1',
    'personality-ei-2',
    'personality-ei-3',
    'personality-ei-4',
    'personality-ei-5',
    'personality-ei-6',
  ],
  'personality-2': [
    'personality-sn-1',
    'personality-sn-2',
    'personality-sn-3',
    'personality-sn-4',
    'personality-sn-5',
    'personality-sn-6',
  ],
  'personality-3': [
    'personality-tf-1',
    'personality-tf-2',
    'personality-tf-3',
    'personality-tf-4',
    'personality-tf-5',
    'personality-tf-6',
  ],
  'personality-4': [
    'personality-jp-1',
    'personality-jp-2',
    'personality-jp-3',
    'personality-jp-4',
    'personality-jp-5',
    'personality-jp-6',
  ],
  ability: [
    'ability-jinchao-lamp-1',
    'ability-jinchao-lamp-2',
    'ability-jinchao-lamp-3',
    'ability-jinchao-lamp-4',
    'ability-jinchao-lamp-5',
    'ability-jinchao-lamp-6',
    'ability-jinchao-lamp-7',
    'ability-jinchao-lamp-8',
  ],
  career: ['value-life-goal'],
}

export const PERSONALITY_SCREEN_TITLES = {
  'personality-1': '性格测试 1/4：能量来源',
  'personality-2': '性格测试 2/4：信息获取',
  'personality-3': '性格测试 3/4：决策方式',
  'personality-4': '性格测试 4/4：生活方式',
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
export function isBatchScreen(screenId) {
  return isPersonalityScreen(screenId) || screenId === 'ability'
}

/** @param {string} screenId */
export function getScreenStageIndex(screenId) {
  if (screenId === 'basic' || isInterestScreen(screenId)) return 0
  if (isPersonalityScreen(screenId)) return 1
  if (screenId === 'ability') return 2
  if (screenId === 'career') return 3
  return 0
}

/** @param {string} screenId @param {Array<{ id?: string }>} [screenQuestions] */
export function getScreenTitle(screenId, screenQuestions = []) {
  if (PERSONALITY_SCREEN_TITLES[screenId]) return PERSONALITY_SCREEN_TITLES[screenId]
  if (screenId === 'ability') {
    return screenQuestions.some((q) => q.id && q.id.startsWith('ability-surakarta-'))
      ? '能力测试：灯语与棋局推理'
      : '能力测试：烬潮城的灯语'
  }
  if (screenId === 'basic') return '先完成一页基本信息'
  if (isInterestScreen(screenId)) return '兴趣探索'
  if (screenId === 'career') return '职业倾向情景测试'
  return ''
}

/** @param {Array<{ id?: string }>} screenQuestions */
export function getAbilityBatchDescription(screenQuestions) {
  if (screenQuestions.some((q) => q.id && q.id.startsWith('ability-surakarta-'))) {
    return `共 ${screenQuestions.length} 题，每题单选。前 8 题考察灯语规则迁移，后 6 题考察苏拉卡尔塔棋局推理。`
  }
  return `共 ${screenQuestions.length} 题，每题单选。请根据题面里的灯语规则和剧情线索判断最合理的答案。`
}

/** @param {string} screenId @param {Map<string, unknown>} questionById */
export function getQuestionsForScreen(screenId, questionById) {
  const ids = SCREEN_QUESTION_IDS[screenId] || []
  return ids.map((id) => questionById.get(id)).filter(Boolean)
}

/** @param {number} index @param {number} [total] */
export function boundedScreenIndex(index, total = CHAT_SCREEN_ORDER.length) {
  if (typeof index !== 'number' || !Number.isFinite(index)) return 0
  return Math.max(0, Math.min(total - 1, Math.floor(index)))
}
