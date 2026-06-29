/** 与 Web MajorTemplateExperience 的 pages 序列对齐 */
export const MAJOR_SPEED_STAGE_META = [
  { key: 'overview', label: '概览' },
  { key: 'foundation', label: '介绍' },
  { key: 'core', label: '深入' },
  { key: 'branching', label: '分流' },
  { key: 'branch', label: '方向' },
]

function pushCourseFlowPages(pages, options) {
  const {
    stageIndex,
    previewType,
    sectionType,
    challengeType,
    titlePrefix,
    course,
    article,
    challenge,
    challengeTask,
    level,
  } = options

  const flowId = `${level}-${course.id}`

  pages.push({
    id: `${flowId}-preview`,
    type: previewType,
    stageIndex,
    title: `${titlePrefix}：${course.title}`,
    navTitle: course.title,
    flowId,
    courseId: course.id,
    course,
    article,
    challenge,
    level,
    challengeTask,
  })

  ;(article.sections || []).forEach((section, index) => {
    pages.push({
      id: `${flowId}-section-${index}`,
      type: sectionType,
      stageIndex,
      title: course.title,
      subtitle: section.title,
      navTitle: `正文 ${index + 1}`,
      flowId,
      sectionIndex: index,
      section,
      courseId: course.id,
      course,
      article,
      challenge,
      level,
      challengeTask,
    })
  })

  pages.push({
    id: `${flowId}-challenge`,
    type: challengeType,
    stageIndex,
    title: `${course.title}：${challengeTask === 'model' ? '建模挑战' : '诊断挑战'}`,
    navTitle: challengeTask === 'model' ? '建模挑战' : '诊断挑战',
    flowId,
    courseId: course.id,
    course,
    article,
    challenge,
    level,
    challengeTask,
  })
}

function pushBranchTopicFlowPages(pages, branch, topic, topicIndex) {
  const flowId = `branch-${branch.id}-topic-${topicIndex}`

  pages.push({
    id: `${flowId}-intro`,
    type: 'branch-topic-intro',
    stageIndex: 4,
    title: `专业方向体验：${topic.title}`,
    navTitle: topic.title,
    flowId,
    branchId: branch.id,
    topicIndex,
    topic,
    challengeTask: 'report',
  })

  ;(topic.sections || []).forEach((section, index) => {
    pages.push({
      id: `${flowId}-section-${index}`,
      type: 'branch-topic-section',
      stageIndex: 4,
      title: topic.title,
      subtitle: section.title,
      navTitle: `正文 ${index + 1}`,
      flowId,
      branchId: branch.id,
      topicIndex,
      sectionIndex: index,
      topic,
      section,
      challengeTask: 'report',
    })
  })

  pages.push({
    id: `${flowId}-challenge`,
    type: 'branch-topic-challenge',
    stageIndex: 4,
    title: `${topic.title}：报告挑战`,
    navTitle: '报告挑战',
    flowId,
    branchId: branch.id,
    topicIndex,
    topic,
    challengeTask: 'report',
  })
}

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
    navTitle: `${template.labelLong}概览`,
  })

  pages.push({
    id: 'catalog-complete',
    type: 'stage-complete',
    stageIndex: 0,
    title: `${template.labelLong}概览：下一阶段预告`,
    navTitle: '概览完成',
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
    navTitle: '课程总览',
    intro: template.foundationIntro,
    courses: template.foundationArticles,
    level: 'foundation',
  })

  template.foundationArticles.forEach((course) => {
    pushCourseFlowPages(pages, {
      stageIndex: 1,
      previewType: 'course-preview',
      sectionType: 'course-section',
      challengeType: 'course-challenge',
      titlePrefix: `${template.labelLong}介绍`,
      course,
      article: course,
      challenge: { interaction: course.interaction, title: course.interaction?.title || course.title },
      challengeTask: 'model',
      level: 'foundation',
    })
  })

  pages.push({
    id: 'intro-complete',
    type: 'stage-complete',
    stageIndex: 1,
    title: `${template.labelLong}介绍：阶段完成`,
    navTitle: '介绍完成',
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
    navTitle: '课程总览',
    intro: template.coreIntro,
    courses: template.deepDiveArticles,
  })

  template.deepDiveChallenges.forEach((challenge) => {
    const article = template.deepDiveArticles.find((item) => item.id === challenge.id)
    if (!article) return
    pushCourseFlowPages(pages, {
      stageIndex: 2,
      previewType: 'deep-preview',
      sectionType: 'deep-section',
      challengeType: 'deep-challenge',
      titlePrefix: `深入体验${template.label}`,
      course: {
        id: challenge.id,
        title: challenge.course,
        subtitle: challenge.title,
        summary: challenge.description,
        interaction: challenge.interaction,
      },
      article,
      challenge,
      challengeTask: 'diagnose',
      level: 'core',
    })
  })

  pages.push({
    id: 'deep-complete',
    type: 'stage-complete',
    stageIndex: 2,
    title: `深入体验${template.label}：阶段完成`,
    navTitle: '深入完成',
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
    navTitle: '选择方向',
    branches: template.branchDirections,
  })

  if (branch) {
    pages.push({
      id: 'branch-overview',
      type: 'branch-overview',
      stageIndex: 4,
      title: `专业方向体验：${branch.title}`,
      navTitle: '方向概览',
      branchId: branch.id,
      direction: branch,
    })

    branch.topics.forEach((topic, index) => {
      pushBranchTopicFlowPages(pages, branch, topic, index)
    })
  }

  pages.push({
    id: 'done',
    type: 'done',
    stageIndex: 4,
    title: `${template.labelLong}体验完成`,
    navTitle: '体验完成',
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
