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
  understand: '/images/explore/discover/figma/math-welcome-card-understand-328-30291.png',
  courses: '/images/explore/discover/figma/math-welcome-card-courses-328-30291.png',
  career: '/images/explore/discover/figma/math-welcome-card-career-328-30291.png',
  stream: '/images/explore/discover/figma/math-welcome-card-stream-328-30291.png',
}

export const MATH_WELCOME_CARDS = [
  {
    index: '01',
    title: '了解理学院数学专业',
    body: '先看数学专业关注什么、会训练哪些能力，再用数学分析、线性代数等样本判断自己是否适合这种抽象训练。',
    image: '/design/math-speed/generated/math-intro-card-major-v3.png',
    remoteImage: '/design/math-speed/generated/math-intro-card-major-v3.png',
  },
  {
    index: '02',
    title: '体验真实题型样本',
    body: '可选体验抽象代数、概率论、拓扑学里的典型问题，感受继续学下去会遇到的思维方式、困难和成就感。',
    image: '/design/math-speed/generated/math-intro-card-problem-v3.png',
    remoteImage: '/design/math-speed/generated/math-intro-card-problem-v3.png',
  },
  {
    index: '03',
    title: '了解就业去向与分流',
    body: '结合自身兴趣和未来规划，比较不同数学方向与职业任务是否匹配，而不是先要求自己学完全部课程。',
    image: '/design/math-speed/generated/math-intro-card-career-v3.png',
    remoteImage: '/design/math-speed/generated/math-intro-card-career-v3.png',
  },
  {
    index: '04',
    title: '完成专业体验',
    body: '完成本次体验后，可以继续按兴趣进入更具体的方向模拟流程。',
    image: '/design/math-speed/generated/math-intro-card-branch-v3.png',
    remoteImage: '/design/math-speed/generated/math-intro-card-branch-v3.png',
  },
]

/** 顶部五步进度条标签（Web TOP_PROGRESS_LABELS） */
export const MATH_TOP_PROGRESS_LABELS = [
  '1.数学专业介绍',
  '2.数学课程介绍',
  '3.可选深度样本',
  '4.数学方向选择',
  '5.体验完成',
]

/** 移动端一级阶段 Tab（Web MobileStageTabs） */
export const MATH_MOBILE_STAGE_TABS = [
  { key: 'intro', label: '介绍', pageId: 'major-intro-text', stageIndex: 0 },
  { key: 'foundation', label: '课程', pageId: 'analysis-longform-video', stageIndex: 1 },
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
