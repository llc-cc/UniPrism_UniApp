/** 与 Web MajorTemplateExperience 的 pages 序列对齐 */
export const MAJOR_SPEED_STAGE_META = [
  { key: 'overview', label: '概览' },
  { key: 'foundation', label: '介绍' },
  { key: 'core', label: '深入' },
  { key: 'branching', label: '分流' },
  { key: 'branch', label: '方向' },
]

export function buildMajorSpeedPages(template, selectedBranchId) {
  if (!template) return []

  const branch =
    template.branchDirections.find((item) => item.id === selectedBranchId) ||
    template.branchDirections[0] ||
    null

  const pages = []

  pages.push({
    id: 'catalog',
    type: 'overview',
    stageIndex: 0,
    title: `${template.labelLong}概览`,
  })

  pages.push({
    id: 'catalog-complete',
    type: 'stage-complete',
    stageIndex: 0,
    title: `${template.labelLong}概览：下一阶段预告`,
    completedStageTitle: `${template.labelLong}概览`,
    completionTitle: '概览阶段完成',
    completionDescription: `你已经建立了对${template.labelLong}的第一印象。接下来会进入基础课程层，按文章正文、解释图示和专业动作说明理解这门专业怎样训练学生。`,
    nextStageTitle: `${template.labelLong}介绍`,
    nextStageDescription: '从课程体系进入正式专业内容，先看基础课程如何建立专业语言。',
  })

  pages.push({
    id: 'courses',
    type: 'course-map',
    stageIndex: 1,
    title: `${template.labelLong}介绍`,
    intro: template.foundationIntro,
    courses: template.foundationArticles,
    level: 'foundation',
  })

  template.foundationArticles.forEach((course) => {
    pages.push({
      id: `course-${course.id}`,
      type: 'course-preview',
      stageIndex: 1,
      title: `${template.labelLong}介绍：${course.title}`,
      courseId: course.id,
      course,
      article: course,
      level: 'foundation',
      challengeTask: 'model',
    })
  })

  pages.push({
    id: 'intro-complete',
    type: 'stage-complete',
    stageIndex: 1,
    title: `${template.labelLong}介绍：阶段完成`,
    completedStageTitle: `${template.labelLong}介绍`,
    completionTitle: '专业介绍完成',
    completionDescription: `你已经看过 ${template.foundationArticles.map((item) => item.title).join('、')} 等代表课程。下一阶段会进入更高阶的核心课程，继续观察这门专业怎样处理更复杂的问题。`,
    nextStageTitle: `深入体验${template.label}`,
    nextStageDescription: '深度课程会继续使用同样的文章结构，但问题难度、输入对象和错误反馈都会更接近本科核心课。',
  })

  pages.push({
    id: 'deep-start',
    type: 'deep-start',
    stageIndex: 2,
    title: `深入体验${template.label}`,
    intro: template.coreIntro,
    courses: template.deepDiveArticles,
  })

  template.deepDiveChallenges.forEach((challenge) => {
    const article = template.deepDiveArticles.find((item) => item.id === challenge.id)
    pages.push({
      id: `deep-course-${challenge.id}`,
      type: 'deep-preview',
      stageIndex: 2,
      title: `深入体验${template.label}：${challenge.course}`,
      courseId: challenge.id,
      challenge,
      article,
      level: 'core',
      challengeTask: 'diagnose',
    })
  })

  pages.push({
    id: 'deep-complete',
    type: 'stage-complete',
    stageIndex: 2,
    title: `深入体验${template.label}：阶段完成`,
    completedStageTitle: `深入体验${template.label}`,
    completionTitle: '深入体验完成',
    completionDescription: `你已经通过深度课程接触了${template.labelLong}更接近本科核心课的专业动作。接下来会选择一个方向，进入方向专题级内容。`,
    nextStageTitle: `${template.labelLong}分流`,
    nextStageDescription: '比较不同方向的训练重点、代表问题和前沿交互。',
  })

  pages.push({
    id: 'branching',
    type: 'branching',
    stageIndex: 3,
    title: `${template.labelLong}分流`,
    branches: template.branchDirections,
  })

  if (branch) {
    pages.push({
      id: 'branch-overview',
      type: 'branch-overview',
      stageIndex: 4,
      title: `专业方向体验：${branch.title}`,
      branchId: branch.id,
      direction: branch,
    })

    branch.topics.forEach((topic, index) => {
      pages.push({
        id: `branch-topic-${branch.id}-${index}`,
        type: 'branch-topic',
        stageIndex: 4,
        title: `专业方向体验：${topic.title}`,
        branchId: branch.id,
        topicIndex: index,
        topic,
        challengeTask: 'report',
      })
    })

  }

  pages.push({
    id: 'done',
    type: 'done',
    stageIndex: 4,
    title: `${template.labelLong}体验完成`,
    completedStageTitle: `${template.labelLong}体验`,
    completionTitle: '专业体验完成',
    completionDescription: `你已经走完了${template.labelLong}的概览、基础课程、深度课程、分流和方向专题。`,
    nextStageTitle: '返回继续探索',
    nextStageDescription: '可以继续体验其他专业，或进入职业模拟阶段。',
  })

  return pages
}

export function findBranchOverviewPageIndex(pages) {
  return pages.findIndex((page) => page.id === 'branch-overview')
}
