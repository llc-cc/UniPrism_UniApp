import { getMathCourse, mathCourses } from './math-catalog'
import {
  MATH_BRANCH_DIRECTIONS,
  MATH_BRANCH_TOPICS,
  MATH_STAGE_COMPLETIONS,
} from './math-config'
import {
  probabilityArticleSections,
  abstractAlgebraArticleSections,
  topologyArticleSections,
} from './math-content.ts'
import { buildWebAlignedIntroPages } from './math-course-intro-pages'

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
  foundation: 'Part 2：数学课程介绍',
  advanced: 'Part 3：可选深度样本',
  branch: 'Part 4：数学专业分流',
  complete: 'Part 5：体验完成',
}

/** 路线图标签（Figma）与体验壳标签（Web） */
export const MATH_STAGE_META = [
  { key: 'intro', label: '数学专业介绍', shortLabel: '介绍', phase: '阶段一', experienceLabel: '数学专业介绍' },
  { key: 'foundation', label: '数学课程介绍', shortLabel: '课程', phase: '阶段二', experienceLabel: '数学课程介绍' },
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

export function buildMathSpeedPages(selectedBranchId, options = {}) {
  const branch =
    MATH_BRANCH_DIRECTIONS.find((item) => item.id === selectedBranchId) ||
    MATH_BRANCH_DIRECTIONS[0]

  const deepCourses = mathCourses
    .filter((course) => course.group === 'deep-dive')
    .map((course) => coursePreview(course.id))

  const pages = [...buildWebAlignedIntroPages(options.courseIntroManifest)]

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
