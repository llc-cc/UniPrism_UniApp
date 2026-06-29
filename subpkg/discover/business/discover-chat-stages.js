/**
 * 问卷四阶段配置（对齐 Web /explore/discover/chat MobileProgressHeader）
 */
export const PROGRESS_DIAMOND_ACTIVE = '/images/explore/discover/figma/progress-diamond-active-figma-1-7669.svg'
export const PROGRESS_DIAMOND_INACTIVE = '/images/explore/discover/figma/progress-diamond-inactive-figma-1-7675.svg'

export const CHAT_STAGES = [
  {
    id: 'personality',
    label: '性格测试',
    shortLabel: '性格',
    artwork: '/images/explore/discover/generated/task-personality-model.png',
  },
  {
    id: 'career',
    label: '职业测试',
    shortLabel: '职业',
    artwork: '/images/explore/discover/career-simulation/role-to-career.png',
  },
  {
    id: 'deep-assessment',
    label: '深度测评',
    shortLabel: '深测',
    artwork: '/images/explore/discover/generated/task-ability-model.png',
  },
  {
    id: 'report',
    label: '生成报告',
    shortLabel: '报告',
    artwork: '/images/explore/discover/step-report-bg.png',
  },
]

/** @param {{ id?: string, type?: string } | null | undefined} question */
export function getQuestionStageIndex(question) {
  if (!question) return 0
  const id = question.id || ''
  const type = question.type || ''
  if (id === 'basic-profile' || id === 'personality-mbti-known-type' || id.startsWith('personality-ei-') || id.startsWith('personality-sn-') || id.startsWith('personality-tf-') || id.startsWith('personality-jp-')) return 0
  if (id.startsWith('personality-holland-')) return 1
  if (type === 'holland-fine-grained' || type === 'career-calibration-scale' || id.startsWith('final-career-calibration-')) return 2
  return 0
}

/** @param {{ id?: string, type?: string } | null | undefined} question */
export function getQuestionStage(question) {
  const index = getQuestionStageIndex(question)
  return CHAT_STAGES[index] || CHAT_STAGES[0]
}

export const STAGE_PROFILE_ARTWORK = '/images/explore/discover/figma/profile-clipboard-figma-1-6962-white-2x.png'
export const REPORT_READY_ICON = '/explore-static/discover/figma/report-ready-clipboard-figma-205-12203.png'
export const REPORT_READY_SHADOW = '/explore-static/discover/figma/report-ready-shadow-figma-205-12205.svg'

/** @param {{ id?: string, type?: string, imageSrc?: string } | null | undefined} question */
export function getQuestionStageArtwork(question) {
  if (!question) return CHAT_STAGES[0].artwork
  if (question.id === 'basic-profile') return STAGE_PROFILE_ARTWORK
  if (question.type === 'holland-fine-grained' && question.imageSrc) return question.imageSrc
  return getQuestionStage(question).artwork
}
