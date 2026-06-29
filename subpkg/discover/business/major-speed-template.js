import { getMajorById } from '../../../business/explore-data'

const AI_GENERATED_FIGURE_BASE = 'https://uniprism.cn/design/major-sim/ai/generated'

const AI_PAGE_IMAGES = {
  overview: `${AI_GENERATED_FIGURE_BASE}/ai-math-foundation-t01-orientation-f04-course-chain-20260603-v1.png`,
  courseMap: `${AI_GENERATED_FIGURE_BASE}/ai-course-math-stats-opt-t01-tensors-v1.png`,
  deepStart: `${AI_GENERATED_FIGURE_BASE}/ai-course-math-stats-opt-t05-optimization-v1.png`,
  branching: `${AI_GENERATED_FIGURE_BASE}/ai-math-foundation-t01-orientation-f05-new-samples-20260603-v1.png`,
}

const AI_COURSE_IMAGES = {
  'ai-introduction': `${AI_GENERATED_FIGURE_BASE}/ai-math-foundation-t01-orientation-f04-course-chain-20260603-v1.png`,
  'ai-programming-data-structures': `${AI_GENERATED_FIGURE_BASE}/ai-course-programming-algorithms-v1.png`,
  'ai-probability-linear-algebra': `${AI_GENERATED_FIGURE_BASE}/ai-course-math-foundation-v1.png`,
  'ai-machine-learning': `${AI_GENERATED_FIGURE_BASE}/ai-course-machine-learning-v1.png`,
  'ai-deep-learning': `${AI_GENERATED_FIGURE_BASE}/ai-course-deep-learning-v1.png`,
  'ai-systems-llm': `${AI_GENERATED_FIGURE_BASE}/ai-course-data-experiment-v1.png`,
}

const AI_BRANCH_IMAGES = {
  'ai-agent': `${AI_GENERATED_FIGURE_BASE}/ai-math-foundation-t01-orientation-f04-course-chain-20260603-v1.png`,
  'ai-vision-nlp': `${AI_GENERATED_FIGURE_BASE}/ai-course-vision-speech-v1.png`,
  'ai-robotics': `${AI_GENERATED_FIGURE_BASE}/ai-course-rl-embodied-v1.png`,
  'ai-safety-industry': `${AI_GENERATED_FIGURE_BASE}/ai-math-foundation-t01-orientation-f05-new-samples-20260603-v1.png`,
}

function ensureList(value) {
  return Array.isArray(value) ? value : []
}

function buildFigureItems(items) {
  return ensureList(items).filter(Boolean).slice(0, 6)
}

function buildCourseSections(course) {
  const intro = course.intro || course.summary || ''
  const topics = buildFigureItems(course.topics)
  const task = course.task || ''
  const sections = []

  if (intro) {
    sections.push({
      title: '课程入口',
      paragraphs: [intro],
      imageSrc: AI_COURSE_IMAGES[course.id] || '',
      imageAlt: `${course.title}课程插图`,
    })
  }

  if (topics.length) {
    sections.push({
      title: '关键主题',
      paragraphs: ['这一页先把课程的核心知识对象列出来，帮助你对齐 Web 端的主题密度与阅读节奏。'],
      visualKind: 'concept',
      figureItems: topics,
    })
  }

  if (task) {
    sections.push({
      title: '典型任务',
      paragraphs: [
        `这门课不只是记住名词，而是要能完成这样的专业动作：${task}`,
        '你需要把输入对象、方法步骤、误差来源和可复核输出组织成稳定的判断链。',
      ],
      visualKind: 'method',
      figureItems: ['识别输入对象', '选择方法路径', '检查错误来源', '输出可复核结论'],
    })
  }

  return sections
}

function buildCourseInteraction(course, taskType) {
  const topics = buildFigureItems(course.topics)
  const tags = buildFigureItems(course.tags)
  const inputs = topics.length ? topics : ['问题定义', '数据样本', '模型目标']
  const actions = taskType === 'diagnose'
    ? ['定位失败模式', '检查训练或部署环节', '比较指标变化', '给出修复路径']
    : ['定义问题', '组织输入', '执行方法', '解释结果']
  const feedback = taskType === 'diagnose'
    ? ['平均值掩盖失败样本', '训练成功但泛化不足', '部署约束未纳入判断']
    : ['概念停留在口号', '缺少可验证步骤', '没有解释边界条件']

  return {
    title: `${course.title}判断链练习`,
    goal: course.task || `围绕${course.title}形成一条可复核的专业判断链。`,
    inputs,
    actions,
    feedback: feedback.concat(tags).slice(0, 6),
    output: `${course.title}专业判断卡`,
  }
}

function buildTopicSections(branch) {
  return [
    {
      title: '方向入口',
      paragraphs: [
        `${branch.title}更适合这类同学：${branch.fit || '愿意长期处理这类问题与工具。'}`,
        `进入这个方向后，你会持续处理这些主题：${ensureList(branch.topics).join('、') || '方向主题待补充'}。`,
      ],
    },
    {
      title: '前沿线索',
      paragraphs: [
        branch.frontier || '这个方向会持续面对新的系统能力、评测方法和真实落地约束。',
        `一个典型的入门项目是：${branch.project || '完成一个能被展示和复盘的真实小项目。'}`,
      ],
    },
  ]
}

function buildTopicInteraction(branch) {
  return {
    title: `${branch.title}方向报告`,
    goal: `围绕${branch.title}写出一条“问题对象 - 方法动作 - 风险边界 - 输出结果”的简要判断链。`,
    inputs: ensureList(branch.topics).length ? ensureList(branch.topics) : ['方向主题', '真实任务', '评测标准'],
    actions: ['确认场景', '拆解方法', '标注边界', '给出项目方案'],
    feedback: ['方向理解停留在热点词', '缺少任务对象', '没有风险边界'],
    output: `${branch.title}方向判断 memo`,
  }
}

function mapFoundationCourse(course) {
  const sections = course.id === 'ai-introduction' && ensureList(course.chessLabTopics).length
    ? course.chessLabTopics.map((topic) => ({
        title: topic.title,
        paragraphs: ensureList(topic.paragraphs),
      }))
    : buildCourseSections(course)

  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    summary: course.intro || '',
    tags: ensureList(course.tags),
    sections,
    interaction: buildCourseInteraction(course, 'model'),
  }
}

function mapCoreCourse(course) {
  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    summary: course.intro || '',
    tags: ensureList(course.tags),
    sections: buildCourseSections(course),
  }
}

function mapCoreChallenge(course) {
  return {
    id: course.id,
    course: course.title,
    badge: '核心课',
    title: course.subtitle,
    description: course.intro || '',
    errorTypes: ['训练与泛化混淆', '只看模型不看系统', '忽略评测或部署边界'],
    interaction: buildCourseInteraction(course, 'diagnose'),
  }
}

function mapBranch(branch) {
  const topic = {
    id: `${branch.id}-topic-1`,
    title: `${branch.title}专题`,
    subtitle: branch.fit || branch.title,
    summary: `这个方向聚焦 ${ensureList(branch.topics).join('、')}，并延伸到 ${branch.frontier || '真实前沿问题'}。`,
    sections: buildTopicSections(branch),
    interaction: buildTopicInteraction(branch),
  }

  return {
    id: branch.id,
    title: branch.title,
    body: branch.fit || '',
    roles: ensureList(branch.roles),
    topics: [topic],
  }
}

function buildAiTemplate(major) {
  const foundationCourses = ensureList(major.foundationCoursesDetail)
  const coreCourses = ensureList(major.coreCoursesDetail)
  const branches = ensureList(major.branchDirectionsDetail)

  return {
    majorId: major.id,
    label: major.title,
    labelLong: major.labelLong || major.title,
    en: major.en,
    accent: major.accent,
    intro: ensureList(major.intro),
    methodLoop: ['专业认知', '课程地图', '核心课程', '方向分流'],
    overviewCards: ensureList(major.overviewCards),
    foundationIntro: major.foundationIntro || '',
    coreIntro: major.coreIntro || '',
    foundationArticles: foundationCourses.map(mapFoundationCourse),
    deepDiveArticles: coreCourses.map(mapCoreCourse),
    deepDiveChallenges: coreCourses.map(mapCoreChallenge),
    branchDirections: branches.map(mapBranch),
    careers: ensureList(major.careers),
  }
}

export function getMajorSpeedTemplate(majorId) {
  const major = getMajorById(majorId)
  if (!major) return null
  if (majorId === 'ai-u') return buildAiTemplate(major)
  return null
}

export function getMajorSpeedPageImage(majorId, slot, key = '') {
  if (majorId !== 'ai-u') return ''
  if (slot === 'overview' || slot === 'courseMap' || slot === 'deepStart' || slot === 'branching') {
    return AI_PAGE_IMAGES[slot] || ''
  }
  if (slot === 'course') {
    return AI_COURSE_IMAGES[key] || AI_PAGE_IMAGES.courseMap
  }
  if (slot === 'branch') {
    return AI_BRANCH_IMAGES[key] || AI_PAGE_IMAGES.branching
  }
  return ''
}
