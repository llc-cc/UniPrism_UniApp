import { getMathCourse, mathCourses } from './math-catalog'
import {
  MATH_BRANCH_DIRECTIONS,
  MATH_BRANCH_TOPICS,
  MATH_CATALOG_OVERVIEW_CARDS,
  MATH_INTRO_HOME_CARDS,
  MATH_STAGE_COMPLETIONS,
} from './math-config'
import {
  analysisArticleSections,
  linearAlgebraArticleSections,
  logicArticleSections,
  probabilityArticleSections,
  abstractAlgebraArticleSections,
  topologyArticleSections,
} from './math-content.ts'

const MATH_WELCOME_PARAGRAPHS = [
  '从小学开始，一直到初中、高中你都一直在学习数学。也在课本上了解到许多大数学家的光辉事迹，但你有没有好奇过：你在课本上学习的知识和现代最前沿的数学有多少差距呢？如今最顶级的数学家每天都在研究什么？',
  '此外，选择数学专业一定就要成为数学家吗？那些数学专业的师兄、师姐们毕业后都去了哪里？其实，数学专业能胜任的社会岗位可谓是包罗万象。在本次专业模拟体验中，你会看到数学专业的真实任务样本、不同路径选择和职业发展道路。',
  '希望在本次体验过后，你能对数学专业有一个更加全面和清晰的认知。',
]

const MATH_MAJOR_INTRO_PARAGRAPHS = [
  '数学专业既能进入高度抽象的理论世界，用严谨语言勾勒理想结构；也能进入现实工程，用一行行公式和近似算法为飞机、火箭、大型工业设施奠定理论基础。',
  '数学专业的出路是多元化的，在本科期间接受的严谨数学训练；一定会成为你今后一生不断收益的财富。这些思维最大的收获不单单是知识层面的，更多是使用“数学的视角”去审视其他领域和现实世界的问题。',
  '当然，早些规划自己的职业生涯也是十分有必要的。本次体验会带你一步步了解数学专业的核心内容、应用场景；并帮助你匹配到感兴趣的发展方向和职业路径。',
]

const COURSE_ENTRY_VISUALS = {
  analysis: '/design/math-speed/generated/course-redo-20260526-math-analysis-t1-f1.png',
  'linear-algebra': '/design/math-speed/generated/math-breadth-linear-logic-20260602-la1-f1-v1.png',
  logic: '/design/math-speed/generated/math-breadth-linear-logic-20260602-log1-f1-v1.png',
  probability: '/design/math-speed/generated/math-breadth-course-prob1-f1-20260531.png',
  'abstract-algebra': '/design/math-speed/generated/math-breadth-course-alg1-f1-20260531.png',
  topology: '/design/math-speed/generated/math-breadth-course-top1-f1-20260531.png',
}

const COURSE_ENTRY_BADGES = {
  analysis: '基础课',
  'linear-algebra': '基础课',
  logic: '基础课',
  probability: '进阶课',
  'abstract-algebra': '进阶课',
  topology: '进阶课',
}

const FOUNDATION_PAGE_FLOWS = [
  {
    id: 'analysis-video',
    courseId: 'analysis',
    title: '数学分析',
    subtitle: '理解连续世界的基础语言',
    videoSrc: '/videos/math-courses/math-analysis.mp4',
    videoTitle: '数学分析课程介绍',
    summary:
      '数学分析会把“越来越接近”和“无限累积”这两类直觉，改写成可以检查、可以证明、可以安全计算的语言。',
    sectionPrefix: 'analysis-section',
    sections: analysisArticleSections,
    challengePage: {
      id: 'analysis-challenge',
      title: '数学分析习题体验',
      summary: '先完成三组挑战任务，把极限、积分和证明链里的分析思路真正用起来。',
      challengeKind: 'analysis',
    },
  },
  {
    id: 'linear-algebra-video',
    courseId: 'linear-algebra',
    title: '线性代数',
    subtitle: '用向量、矩阵和空间变换理解多维关系',
    videoSrc: '/videos/math-courses/linear-algebra.mp4',
    videoTitle: '线性代数课程介绍',
    summary:
      '线性代数把多变量关系放进向量、矩阵和线性变换中，让复杂系统可以被压缩表达。它关心的不只是算矩阵，而是如何描述空间、约束、维度和坐标变化。',
    imageSrc: '/design/math-speed/generated/math-breadth-linear-logic-20260602-la1-f1-v1.png',
    imageAlt: '线性代数课程概览插图，展示配方表多条件约束产生冲突。',
    sectionPrefix: 'linear-algebra-section',
    sections: linearAlgebraArticleSections,
    challengePage: {
      id: 'linear-algebra-challenge',
      title: '线性代数习题体验',
      summary: '围绕空间、矩阵和可逆性，继续完成概念应用与证明训练。',
      challengeKind: 'course-generic',
    },
  },
  {
    id: 'logic-basics',
    courseId: 'logic',
    title: '数理逻辑基础',
    subtitle: '用命题、集合和形式系统理解证明',
    summary:
      '数理逻辑训练你区分命题、量词、条件和证明结构。它帮助你判断一个论证到底依赖什么假设，以及结论是否真的被推出。',
    body: [
      '这门课会让你更自觉地审视每一步推导是否合法，定义中的量词顺序是否被忽略。',
    ],
    formula: String.raw`\begin{aligned}
P&\Rightarrow Q\\
\forall x\in A,\quad &\exists y\in B\\
\neg(P\land Q)&
\end{aligned}`,
    imageSrc: '/design/math-speed/generated/math-breadth-linear-logic-20260602-log1-f1-v1.png',
    imageAlt: '数理逻辑基础课程概览插图，展示自然语言需要形式化。',
    sectionPrefix: 'logic-basics-section',
    sections: logicArticleSections,
    challengePage: {
      id: 'logic-basics-challenge',
      title: '数理逻辑基础习题体验',
      summary: '从概念应用到数学推理，继续检查命题、量词与证明结构是否真正理解。',
      challengeKind: 'course-generic',
    },
  },
]

const ADVANCED_PAGE_FLOWS = [
  {
    id: 'probability-overview',
    courseId: 'probability',
    title: '概率论',
    subtitle: '用测度、随机变量和积分建立不确定性的语言',
    summary:
      '概率论给不确定世界画地图：它不承诺未来一定怎样，而是训练你表达可能性、更新信息，并判断随机现象中哪些结构是稳定的。',
    imageSrc: '/design/math-speed/generated/math-breadth-course-prob1-f1-20260531.png',
    imageAlt: '概率论课程概览插图，展示降雨概率与日常决策。',
    sectionPrefix: 'probability-section',
    sections: probabilityArticleSections,
    challengePage: {
      id: 'probability-challenge',
      title: '概率论习题体验',
      summary: '围绕概率公理、随机变量与极限定理，继续完成概念应用和推理训练。',
      challengeKind: 'course-generic',
    },
  },
  {
    id: 'abstract-algebra-overview',
    courseId: 'abstract-algebra',
    title: '抽象代数',
    subtitle: '从群、环、域和同态理解运算结构',
    summary:
      '抽象代数研究运算规则本身：它会把方程、对称、整数和多项式背后的共同结构提炼出来，让你用结构性质判断具体问题。',
    imageSrc: '/design/math-speed/generated/math-breadth-course-alg1-f1-20260531.png',
    imageAlt: '抽象代数课程概览插图，展示对称操作形成封闭集合。',
    sectionPrefix: 'abstract-algebra-section',
    sections: abstractAlgebraArticleSections,
    challengePage: {
      id: 'abstract-algebra-challenge',
      title: '抽象代数习题体验',
      summary: '继续从群、环、域与同态的角度判断结构性质与证明链条。',
      challengeKind: 'course-generic',
    },
  },
  {
    id: 'topology-overview',
    courseId: 'topology',
    title: '拓扑学',
    subtitle: '用开集、连续、紧致和连通理解空间',
    summary:
      '拓扑学寻找连续变形中不会被揉掉的信息。它不急着测量长度和角度，而是先问一个空间在允许变形后还保留哪些证据。',
    imageSrc: '/design/math-speed/generated/math-breadth-course-top1-f1-20260531.png',
    imageAlt: '拓扑学课程概览插图，展示桥的连接和连续变形中的洞。',
    sectionPrefix: 'topology-section',
    sections: topologyArticleSections,
    challengePage: {
      id: 'topology-challenge',
      title: '拓扑学习题体验',
      summary: '从开集、连通和紧致等概念继续推进空间结构理解。',
      challengeKind: 'course-generic',
    },
  },
]

function articleSectionsToPages({ sectionPrefix, stageIndex, courseTitle, sections, navParentId, stageTitle }) {
  return sections.map((section, index) => ({
    id: `${sectionPrefix}-${index}`,
    type: 'course-section',
    stageIndex,
    stageTitle,
    navParentId,
    title: section.title,
    subtitle: courseTitle,
    role: section.role,
    summary: section.paragraphs?.[0] || '',
    paragraphs: section.paragraphs || [],
    content: section.content || [],
    formula: section.formula || '',
    imageSrc: section.imageSrc || '',
    imageAlt: section.imageAlt || '',
    imageWidth: section.imageWidth,
    imageHeight: section.imageHeight,
  }))
}

function buildBranchTopicSections(topic, branch) {
  return [
    {
      title: '专题入口',
      paragraphs: [
        topic.summary,
        `${topic.subtitle}。这一专题会把 ${branch.title} 方向常见的问题对象、分析视角和训练方式串起来。`,
      ],
    },
    {
      title: '核心判断',
      paragraphs: [
        `方向关键词包括：${branch.modules.join('、')}。进入专题时，需要先判断自己是否愿意长期处理这类对象、证据和推理链。`,
        `如果继续深入 ${branch.title}，你会不断在定义、模型、证明、计算或实验之间来回切换，而不是只记住几个结果。`,
      ],
    },
    {
      title: '适配判断',
      paragraphs: [
        topic.interaction.goal,
        `完成专题后，至少要能输出：${topic.interaction.output}。这对应的是该方向真实学习节奏里的最小交付物。`,
      ],
    },
  ]
}

/** 与 Web MathSliceExperienceCopy stageTitle 对齐 */
const STAGE_TITLES = {
  intro: 'Part 1：数学专业介绍',
  foundation: 'Part 2：基础真实样本',
  advanced: 'Part 3：可选深度样本',
  branch: 'Part 4：数学专业分流',
  complete: 'Part 5：体验完成',
}

/** 路线图标签（Figma）与体验壳标签（Web） */
export const MATH_STAGE_META = [
  { key: 'intro', label: '数学专业介绍', shortLabel: '介绍', phase: '阶段一', experienceLabel: '数学专业介绍' },
  { key: 'foundation', label: '三门基础课程', shortLabel: '基础', phase: '阶段二', experienceLabel: '基础真实样本' },
  { key: 'advanced', label: '三门进阶课程', shortLabel: '进阶', phase: '阶段三', experienceLabel: '可选深度样本' },
  { key: 'stream', label: '数学专业分流', shortLabel: '分流', phase: '阶段四', experienceLabel: '数学方向选择' },
  { key: 'complete', label: '体验完成', shortLabel: '完成', phase: '阶段五', experienceLabel: '体验完成' },
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
    heroImage: COURSE_ENTRY_VISUALS[course.id],
    badge: COURSE_ENTRY_BADGES[course.id],
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
    id: 'catalog-overview',
    type: 'welcome',
    stageIndex: 0,
    stageTitle: STAGE_TITLES.intro,
    navTitle: '欢迎页',
    title: '欢迎体验数学专业！',
    paragraphs: MATH_WELCOME_PARAGRAPHS,
    cards: MATH_CATALOG_OVERVIEW_CARDS,
  })

  pages.push({
    id: 'major-intro-text',
    type: 'intro-text',
    stageIndex: 0,
    navTitle: '数学专业介绍',
    title: '数学专业介绍',
    paragraphs: MATH_MAJOR_INTRO_PARAGRAPHS,
    cards: MATH_INTRO_HOME_CARDS,
  })

  pages.push({
    id: 'major-overview-video',
    type: 'intro-video',
    stageIndex: 0,
    navTitle: '介绍视频',
    title: '数学专业介绍视频',
    videoTitle: '数学专业总览',
    videoSrc: '/videos/math-major/math-overview.mp4',
    posterImage: '/design/math-speed/generated/math-intro-home-curriculum-v5.png',
    summary:
      '先通过一段总览视频建立对数学专业课程结构、应用场景和职业分流的整体印象，再进入后续课程与方向体验。',
  })

  pages.push({
    id: 'part-one-complete',
    type: 'stage-complete',
    stageIndex: 0,
    navTitle: 'Part 1 结束',
    title: 'Part 1 结束',
    completionTitle: '数学专业介绍完成',
    completionDescription:
      '你已经完整看过数学专业的欢迎页、专业介绍和总览视频。接下来会进入数学分析、线性代数和数理逻辑基础三个真实样本，判断自己是否适应本科数学的思维方式。',
    nextStageTitle: '基础真实样本',
    nextStageDescription:
      '数学分析关注连续与极限，线性代数关注空间和矩阵，数理逻辑基础关注命题、量词和证明结构。',
  })

  pages.push({
    id: 'foundation-courses-start',
    type: 'stage-intro',
    stageIndex: 1,
    stageTitle: STAGE_TITLES.foundation,
    navTitle: '样本概览',
    title: '基础真实样本',
    subtitle: '数学分析、线性代数、数理逻辑基础',
    intro:
      '这一部分会进入本科数学专业最典型的三个入口样本。你可以先看 Overview 视频和主线正文，也可以把习题体验当作可选 taste test，用来判断自己是否愿意继续深入。',
    heroImage: '/design/math-speed/generated/math-major-intro-complete-v1.png',
    courses: foundationCourses,
  })

  FOUNDATION_PAGE_FLOWS.forEach((flow) => {
    pages.push({
      id: flow.id,
      type: 'course-overview',
      stageIndex: 1,
      stageTitle: STAGE_TITLES.foundation,
      title: flow.title,
      subtitle: flow.subtitle,
      summary: flow.summary,
      body: flow.body || [],
      formula: flow.formula || '',
      videoSrc: flow.videoSrc || '',
      videoTitle: flow.videoTitle || '',
      imageSrc: flow.imageSrc || '',
      imageAlt: flow.imageAlt || '',
      courseId: flow.courseId,
    })
    pages.push(
      ...articleSectionsToPages({
        sectionPrefix: flow.sectionPrefix,
        stageIndex: 1,
        stageTitle: STAGE_TITLES.foundation,
        navParentId: flow.id,
        courseTitle: flow.title,
        sections: flow.sections,
      }),
    )
    pages.push({
      id: flow.challengePage.id,
      type: 'course-challenge',
      stageIndex: 1,
      stageTitle: STAGE_TITLES.foundation,
      navParentId: flow.id,
      navTitle: '习题体验',
      title: flow.challengePage.title,
      summary: flow.challengePage.summary,
      subtitle: flow.title,
      courseId: flow.courseId,
      challengeKind: flow.challengePage.challengeKind,
    })
  })

  pages.push({
    id: 'major-intro-complete',
    type: 'stage-complete',
    stageIndex: 1,
    stageTitle: STAGE_TITLES.foundation,
    navTitle: 'Part 2 结束',
    title: 'Part 2 结束',
    completionTitle: '基础真实样本完成',
    completionDescription:
      '你已经进入数学分析、线性代数和数理逻辑基础三个入口学科。到这里，数学会从零散题型组织成一套由变化、空间关系和严密推理共同支撑的训练体系。',
    nextStageTitle: '可选深度样本',
    nextStageDescription:
      '接下来会进入概率论、抽象代数和拓扑学，进一步体验数学如何处理不确定性、结构和连续变形。',
  })

  pages.push({
    id: 'deep-dive-start',
    type: 'stage-intro',
    stageIndex: 2,
    stageTitle: STAGE_TITLES.advanced,
    navTitle: '样本概览',
    title: '可选深度样本',
    subtitle: '概率论、抽象代数、拓扑学',
    intro:
      '这一阶段会进入概率论、抽象代数、拓扑学等更接近本科核心课的深度样本。你可以继续按“先建立整体印象，再进入正文与任务”的节奏，判断自己是否适合更抽象的数学训练。',
    courses: deepCourses,
    heroImage: '/design/math-speed/generated/math-deep-dive-complete-v1.png',
  })

  ADVANCED_PAGE_FLOWS.forEach((flow) => {
    pages.push({
      id: flow.id,
      type: 'course-overview',
      stageIndex: 2,
      stageTitle: STAGE_TITLES.advanced,
      title: flow.title,
      subtitle: flow.subtitle,
      summary: flow.summary,
      imageSrc: flow.imageSrc || '',
      imageAlt: flow.imageAlt || '',
      courseId: flow.courseId,
    })
    pages.push(
      ...articleSectionsToPages({
        sectionPrefix: flow.sectionPrefix,
        stageIndex: 2,
        stageTitle: STAGE_TITLES.advanced,
        navParentId: flow.id,
        courseTitle: flow.title,
        sections: flow.sections,
      }),
    )
    pages.push({
      id: flow.challengePage.id,
      type: 'course-challenge',
      stageIndex: 2,
      stageTitle: STAGE_TITLES.advanced,
      navParentId: flow.id,
      navTitle: '习题体验',
      title: flow.challengePage.title,
      summary: flow.challengePage.summary,
      subtitle: flow.title,
      courseId: flow.courseId,
      challengeKind: flow.challengePage.challengeKind,
    })
  })

  pages.push({
    id: 'deep-dive-complete',
    type: 'stage-complete',
    stageIndex: 2,
    stageTitle: STAGE_TITLES.advanced,
    navTitle: 'Part 3 结束',
    title: 'Part 3 结束',
    completionTitle: '可选深度样本完成',
    completionDescription:
      '你已经体验了概率论、抽象代数和拓扑学三种更高阶的数学视角：用测度组织随机现象，用代数结构组织运算规则，用拓扑结构组织空间关系。它们会把数学从“解题工具”推进到“建立语言”。',
    nextStageTitle: '数学专业分流',
    nextStageDescription: '接下来会先选择一个专业方向，再进入该方向对应的课程专题和职业路径。',
  })

  pages.push({
    id: 'branching-start',
    type: 'branching',
    stageIndex: 3,
    navTitle: '选择方向',
    title: 'Part 4：数学专业分流',
    branches: MATH_BRANCH_DIRECTIONS,
    heroImage: '/design/math-speed/generated/math-branching-start-v1.png',
  })

  if (branch) {
    const topics = MATH_BRANCH_TOPICS[branch.id] || []

    pages.push({
      id: `branch-${branch.id}-overview`,
      type: 'branch-overview',
      stageIndex: 4,
      title: branch.title,
      subtitle: branch.subtitle,
      summary: branch.body,
      body: [
        `代表专题：${branch.modules.join('、')}。`,
        `适配画像：${branch.fit}。`,
        '这一部分只展开你在 Part 4 选择的方向，避免把所有专业分流内容一次性塞进同一条路径。',
      ],
      branch,
      heroImage: branch.imageSrc || '/design/math-speed/generated/math-branching-start-v1.png',
      heroImageAlt: branch.imageAlt || '',
      videoSrc: branch.videoSrc || '',
      videoTitle: branch.videoTitle || '',
    })

    topics.forEach((topic, index) => {
      const flowId = `branch-${branch.id}-topic-${index}`
      const sections = buildBranchTopicSections(topic, branch)
      pages.push({
        id: `${flowId}-intro`,
        type: 'branch-topic',
        stageIndex: 4,
        title: `${branch.title}：${topic.title}`,
        navTitle: topic.title,
        flowId,
        branchId: branch.id,
        topic,
      })
      sections.forEach((section, sectionIndex) => {
        pages.push({
          id: `${flowId}-section-${sectionIndex}`,
          type: 'branch-topic-section',
          stageIndex: 4,
          title: section.title,
          subtitle: topic.title,
          navTitle: `正文 ${sectionIndex + 1}`,
          flowId,
          branchId: branch.id,
          topic,
          section,
        })
      })
      pages.push({
        id: `${flowId}-challenge`,
        type: 'branch-topic-challenge',
        stageIndex: 4,
        title: `${topic.title}：专题任务`,
        navTitle: '专题任务',
        flowId,
        branchId: branch.id,
        topic,
      })
    })

    pages.push({
      id: `branch-${branch.id}-rolemap`,
      type: 'branch-rolemap',
      stageIndex: 4,
      title: `${branch.title}职业 Rolemap`,
      branch,
    })

    pages.push({
      id: 'math-full-experience-complete',
      type: 'done',
      stageIndex: 4,
      title: `${branch.title}方向体验完成`,
      completionTitle: `${branch.title}方向体验完成`,
      completionDescription:
        `你已经走完整个数学专业体验：先建立专业整体印象，再进入数学分析、线性代数和数理逻辑基础，随后体验概率论、抽象代数、拓扑学，最后进入 ${branch.title} 方向。`,
      branchTitle: branch.title,
    })
  }

  return pages
}

export function findMathBranchOverviewPageIndex(pages) {
  return pages.findIndex((page) => /^branch-.+-overview$/.test(page.id))
}
