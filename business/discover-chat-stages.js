/**
 * 问卷四阶段配置（对齐 Web /explore/discover/chat MobileProgressHeader）
 */
export const PROGRESS_DIAMOND_ACTIVE = '/images/explore/discover/figma/progress-diamond-active-figma-1-7669.svg'
export const PROGRESS_DIAMOND_INACTIVE = '/images/explore/discover/figma/progress-diamond-inactive-figma-1-7675.svg'

export const CHAT_STAGES = [
  {
    id: 'interest',
    label: '兴趣探索',
    shortLabel: '兴趣',
    artwork: '/images/explore/discover/generated/task-interest-model.png',
  },
  {
    id: 'personality',
    label: '性格测试',
    shortLabel: '性格',
    artwork: '/images/explore/discover/generated/task-personality-model.png',
  },
  {
    id: 'ability',
    label: '能力测试',
    shortLabel: '能力',
    artwork: '/images/explore/discover/generated/task-ability-model.png',
  },
  {
    id: 'career',
    label: '职业倾向',
    shortLabel: '职业',
    artwork: '/images/explore/discover/career-simulation/role-to-career.png',
  },
  {
    id: 'report',
    label: '报告生成',
    shortLabel: '报告',
    artwork: '/images/explore/discover/step-report-bg.png',
  },
]

/** @param {{ id?: string } | null | undefined} question */
export function getQuestionStageIndex(question) {
  if (!question || !question.id) return 0
  const id = question.id
  if (id === 'basic-profile' || id.startsWith('interest-tags')) return 0
  if (id.startsWith('personality-')) return 1
  if (id.startsWith('ability-')) return 2
  if (id === 'value-life-goal' || id.startsWith('value-')) return 3
  return 0
}

/** @param {{ id?: string } | null | undefined} question */
export function getQuestionStage(question) {
  const index = getQuestionStageIndex(question)
  return CHAT_STAGES[index] || CHAT_STAGES[0]
}

export const STAGE_PROFILE_ARTWORK = '/images/explore/discover/figma/profile-clipboard-figma-1-6962-white-2x.png'
export const STAGE_CAREER_FREETEXT = '/images/explore/discover/figma/free-text-lock-figma-1-7621.svg'

/** @param {{ id?: string } | null | undefined} question */
export function getQuestionStageArtwork(question) {
  if (!question || !question.id) return CHAT_STAGES[0].artwork
  if (question.id === 'basic-profile') return STAGE_PROFILE_ARTWORK
  if (question.id === 'value-life-goal') return STAGE_CAREER_FREETEXT
  return getQuestionStage(question).artwork
}
