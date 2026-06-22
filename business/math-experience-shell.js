/**
 * 数学专业体验壳层配置（Figma 328:30291 / 630:7554，与 Web MathProfessionalFigmaShell 对齐）
 */
import { MATH_ROADMAP_STAGES } from './math-roadmap-config'

export const MATH_THEME_GREEN = '#4cc8c1'
export const MATH_THEME_GREEN_SHADOW = '#155753'

/** 下拉导航左侧五步标签（与路线图 / Figma 一致） */
export const MATH_DROPDOWN_STAGE_LABELS = MATH_ROADMAP_STAGES.map((stage, index) => ({
  stageIndex: index,
  label: `${index + 1}.${stage.label}`,
  navTitle: stage.webTitle || stage.label,
}))

export const MATH_WELCOME_CARD_ASSETS = {
  understand: '/static/assets/math/math-welcome-card-understand.png',
  courses: '/static/assets/math/math-welcome-card-courses.png',
  career: '/static/assets/math/math-welcome-card-career.png',
  stream: '/static/assets/math/math-welcome-card-stream.png',
}

export const MATH_WELCOME_CARDS = [
  {
    index: '01',
    title: '了解数学专业',
    body: '先看数学在观察什么对象，再判断自己是否愿意长期处理抽象问题。',
    image: MATH_WELCOME_CARD_ASSETS.understand,
    remoteImage: '/images/explore/discover/figma/math-welcome-card-understand-328-30291.png',
  },
  {
    index: '02',
    title: '尝试真实任务样本',
    body: '用短样本感受证明、建模和判断边界，而不是先学完课程。',
    image: MATH_WELCOME_CARD_ASSETS.courses,
    remoteImage: '/images/explore/discover/figma/math-welcome-card-courses-328-30291.png',
  },
  {
    index: '03',
    title: '了解就业去向与选择',
    body: '比较数学能力如何迁移到算法、金融、工程、教育等现实任务。',
    image: MATH_WELCOME_CARD_ASSETS.career,
    remoteImage: '/images/explore/discover/figma/math-welcome-card-career-328-30291.png',
  },
  {
    index: '04',
    title: '完成专业分流',
    body: '根据兴趣点和消耗点选择方向，再决定下一步怎样验证。',
    image: MATH_WELCOME_CARD_ASSETS.stream,
    remoteImage: '/images/explore/discover/figma/math-welcome-card-stream-328-30291.png',
  },
]

/** 顶部五步进度条标签（Web TOP_PROGRESS_LABELS） */
export const MATH_TOP_PROGRESS_LABELS = [
  '1.数学专业介绍',
  '2.基础真实样本',
  '3.可选深度样本',
  '4.数学方向选择',
  '5.体验完成',
]

/** 移动端一级阶段 Tab（Web MobileStageTabs） */
export const MATH_MOBILE_STAGE_TABS = [
  { key: 'intro', label: '介绍', pageId: 'catalog-overview', stageIndex: 0 },
  { key: 'foundation', label: '基础课', pageId: 'foundation-courses-start', stageIndex: 1 },
  { key: 'advanced', label: '进阶课', pageId: 'deep-dive-start', stageIndex: 2 },
  { key: 'branch', label: '分流', pageId: 'branching-start', stageIndex: 3 },
  { key: 'finish', label: '完成', pageId: 'math-full-experience-complete', stageIndex: 4 },
]

export function findPageIndexById(pages, pageId) {
  return pages.findIndex((page) => page.id === pageId)
}

export function buildMobileStageTabs(pages, unlockedPageIndex, activeStageIndex) {
  return MATH_MOBILE_STAGE_TABS.map((tab) => {
    const pageIndex = findPageIndexById(pages, tab.pageId)
    return {
      ...tab,
      pageIndex,
      unlocked: pageIndex >= 0 && pageIndex <= unlockedPageIndex,
      active: tab.stageIndex === activeStageIndex,
    }
  })
}
