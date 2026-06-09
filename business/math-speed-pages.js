import { getMathCourse, mathCourses } from './math-catalog'
import {
  MATH_BRANCH_DIRECTIONS,
  MATH_BRANCH_TOPICS,
  MATH_CATALOG_OVERVIEW_CARDS,
  MATH_INTRO_HOME_CARDS,
  MATH_STAGE_COMPLETIONS,
} from './math-config'

/** 与 Web MathSpeedExperience stages 标题对齐 */
export const MATH_STAGE_META = [
  { key: 'overview', label: '概览' },
  { key: 'intro', label: '介绍' },
  { key: 'deep', label: '深入' },
  { key: 'branching', label: '分流' },
  { key: 'direction', label: '方向' },
]

function coursePreview(courseId) {
  const course = getMathCourse(courseId)
  const firstPage = course?.pages?.[0]
  const firstParagraph = firstPage?.content?.find((item) => item.type === 'paragraph')
  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    pagesCount: course.pages.length,
    preview: firstParagraph?.text || course.subtitle,
    challengeEnabled: Boolean(course.challengeEnabled),
  }
}

export function buildMathSpeedPages(selectedBranchId) {
  const branch =
    MATH_BRANCH_DIRECTIONS.find((item) => item.id === selectedBranchId) ||
    MATH_BRANCH_DIRECTIONS[0]

  const foundationCourses = mathCourses
    .filter((course) => course.group === 'foundation')
    .map((course) => coursePreview(course.id))

  const deepCourses = mathCourses
    .filter((course) => course.group === 'deep-dive')
    .map((course) => coursePreview(course.id))

  const pages = []

  pages.push({
    id: 'catalog',
    type: 'catalog',
    stageIndex: 0,
    title: '数学专业概览',
    cards: MATH_CATALOG_OVERVIEW_CARDS,
    heroImage: '/design/math-speed/generated/math-intro-home-curriculum-v5.png',
  })

  pages.push({
    id: 'catalog-preview',
    type: 'stage-complete',
    stageIndex: 0,
    title: '数学专业概览：下一阶段预告',
    ...MATH_STAGE_COMPLETIONS.catalog,
  })

  pages.push({
    id: 'home',
    type: 'intro-home',
    stageIndex: 1,
    title: '数学专业介绍',
    cards: MATH_INTRO_HOME_CARDS,
    heroImage: '/design/math-speed/generated/math-intro-home-curriculum-v5.png',
  })

  foundationCourses.forEach((course) => {
    pages.push({
      id: course.id,
      type: course.id === 'analysis' ? 'math-analysis-inline' : 'math-course',
      stageIndex: 1,
      title: `数学专业介绍：${course.title}`,
      course,
      level: 'foundation',
    })
  })

  pages.push({
    id: 'major-intro-complete',
    type: 'stage-complete',
    stageIndex: 1,
    title: '数学专业介绍：阶段完成',
    ...MATH_STAGE_COMPLETIONS.intro,
  })

  pages.push({
    id: 'deep-dive-start',
    type: 'deep-start',
    stageIndex: 2,
    title: '深入体验数学',
    intro:
      '这一阶段会进入概率论、抽象代数、拓扑学等更接近本科核心课的内容。你可以先阅读课程文章，再通过挑战任务感受数学专业的抽象思维与证明节奏。',
    courses: deepCourses,
    heroImage: '/design/math-speed/generated/math-intro-card-problem-v3.png',
  })

  deepCourses.forEach((course) => {
    pages.push({
      id: `deep-${course.id}`,
      type: 'math-course',
      stageIndex: 2,
      title: `深入体验数学：${course.title}`,
      course,
      level: 'deep',
    })
  })

  pages.push({
    id: 'deep-dive-complete',
    type: 'stage-complete',
    stageIndex: 2,
    title: '深入体验数学：阶段完成',
    ...MATH_STAGE_COMPLETIONS.deep,
  })

  pages.push({
    id: 'branching-start',
    type: 'branching',
    stageIndex: 3,
    title: '数学专业分流',
    branches: MATH_BRANCH_DIRECTIONS,
    heroImage: '/design/math-speed/generated/math-branching-start-v1.png',
  })

  if (branch) {
    const topics = MATH_BRANCH_TOPICS[branch.id] || []

    pages.push({
      id: 'branch-overview',
      type: 'branch-overview',
      stageIndex: 4,
      title: `专业方向体验：${branch.title}`,
      branch,
      heroImage: branch.imageSrc || '/design/math-speed/generated/math-branching-start-v1.png',
    })

    topics.forEach((topic, index) => {
      pages.push({
        id: `branch-topic-${index}`,
        type: 'branch-topic',
        stageIndex: 4,
        title: `专业方向体验：${topic.title}`,
        branchId: branch.id,
        topic,
      })
    })

    pages.push({
      id: 'branch-rolemap',
      type: 'branch-rolemap',
      stageIndex: 4,
      title: `专业方向体验：${branch.title}职业路径`,
      branch,
    })

    pages.push({
      id: 'branch-experience-complete',
      type: 'done',
      stageIndex: 4,
      title: `专业方向体验：${branch.title}完成`,
      ...MATH_STAGE_COMPLETIONS.direction,
      branchTitle: branch.title,
    })
  }

  return pages
}

export function findMathBranchOverviewPageIndex(pages) {
  return pages.findIndex((page) => page.id === 'branch-overview')
}
