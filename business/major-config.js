/** 非数学专业体验配置（与 Web MajorTemplateExperience 对齐） */

import { getMajorSpeedImage } from './major-speed-images'

/** Web 仅 AI 专业在概览/课图/深入/分流页展示 hero 图 */
export function shouldShowMajorHero(majorId, slot) {
  if (majorId !== 'ai-u') return false
  return ['overview', 'courseMap', 'deepStart', 'branching'].includes(slot)
}

/** Web 仅 AI 专业在方向概览展示分支图 */
export function shouldShowBranchHero(majorId) {
  return majorId === 'ai-u'
}

/** 与 Web stages 侧栏标题一致 */
export function getMajorStageMeta(template) {
  if (!template) {
    return [
      { key: 'overview', label: '概览' },
      { key: 'foundation', label: '介绍' },
      { key: 'core', label: '深入' },
      { key: 'branching', label: '分流' },
      { key: 'branch', label: '方向' },
    ]
  }
  return [
    { key: 'overview', label: `${template.labelLong}概览` },
    { key: 'foundation', label: `${template.labelLong}介绍` },
    { key: 'core', label: `深入体验${template.label}` },
    { key: 'branching', label: `${template.labelLong}分流` },
    { key: 'branch', label: '专业方向体验' },
  ]
}

/** Web getOverviewCards */
export function getOverviewCards(template) {
  if (!template || !Array.isArray(template.overviewCards)) return []
  if (template.overviewCards.length >= 4) return template.overviewCards
  return [
    ...template.overviewCards,
    {
      title: '完成专业分流',
      body: `最后比较${(template.branches || []).map((b) => b.title).join('、')}等训练路线。重点不是提前决定职业，而是判断自己更愿意长期处理哪类问题、证据和工具。`,
    },
  ]
}

/** Web IntroCardList labelSets for overview */
export function getOverviewCardLabelSets(template) {
  const loop = template?.methodLoop || []
  const branches = (template?.branchDirections || template?.branches || []).map((b) => b.title)
  return [
    loop.slice(0, 4),
    loop.slice(1, 5),
    ['建模', '推理', '实验/实现', '反馈诊断'],
    branches,
  ]
}

/** Web CourseMapPage IntroCardList labelSets */
export function getCourseMapCardLabelSets(template) {
  if (!template) return []
  return (template.foundationArticles || []).map((course) => [
    course.title,
    ...(course.tags || []),
    course.interaction?.title || '',
  ].filter(Boolean))
}

/** Web getCourseMapCards */
export function getCourseMapCards(template) {
  if (!template) return []
  return (template.foundationArticles || []).map((course) => ({
    title: course.title,
    body: `${course.summary || course.intro} 它会把${(course.interaction?.inputs || []).slice(0, 3).join('、')}组织成可判断的问题，再通过${(course.interaction?.actions || []).slice(0, 3).join('、')}形成专业训练路径。`,
  }))
}

/** 概览完成后的「专业介绍首页」卡片 */
export function getIntroHomeCards(template, majorId) {
  const cards = getOverviewCards(template)
  const heroFallback = getMajorSpeedImage(majorId, 'courseMap')
  return cards.map((card, index) => ({
    index: String(index + 1).padStart(2, '0'),
    title: card.title,
    body: card.body,
    image: heroFallback,
  }))
}

export function getBranchRolemap(template, branchId) {
  if (!template || !branchId) return []
  const direction = (template.branchDirections || []).find((item) => item.id === branchId)
  if (direction && Array.isArray(direction.roles) && direction.roles.length) {
    return direction.roles
  }
  const branch = (template.branches || []).find((item) => item.id === branchId)
  if (branch && Array.isArray(branch.roles) && branch.roles.length) {
    return branch.roles
  }
  return template.careers || []
}

export const MAJOR_CHALLENGE_TASK_LABELS = {
  model: '建模挑战',
  diagnose: '诊断挑战',
  report: '报告挑战',
}

export const COURSE_MAP_EXTRA_INTRO =
  '这一阶段不是课程目录展示。每门课都会进入正文页，用一个具体问题带出概念、方法、常见误判和可复核产出，让你先感受这门专业怎样训练判断，而不是只记住课程名称。'
