import { api } from '../../../utils/api'

/** 与 Web `lib/math/mathCourseIntroPages.ts` 对齐的离线兜底 */
export const FALLBACK_MATH_COURSE_INTRO_PAGES = [
  {
    id: 'major-intro-text',
    stageIndex: 0,
    stageTitle: 'Part 1：数学专业介绍',
    kind: 'major-intro',
    title: '数学专业介绍',
    navTitle: '专业介绍',
  },
  {
    id: 'analysis-longform-video',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'longform-video',
    title: '数学分析长版深度介绍',
    navTitle: '数学分析',
    subtitle: '数学分析',
    videoSrc: '/videos/math-analysis/math-analysis-longform-ink-minimal-v5.mp4',
    courseId: 'analysis',
  },
  {
    id: 'analysis-video',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '极限为什么还不够',
    navTitle: '极限',
    subtitle: '数学分析',
    navParentId: 'analysis-longform-video',
    webPageId: 'analysis-video',
    courseId: 'analysis',
  },
  {
    id: 'analysis-strict-limit',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '极限的严格定义',
    navTitle: '严格定义',
    subtitle: '数学分析',
    navParentId: 'analysis-longform-video',
    webPageId: 'analysis-strict-limit',
    courseId: 'analysis',
  },
  {
    id: 'analysis-continuity',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '图像以外的连续',
    navTitle: '连续',
    subtitle: '数学分析',
    navParentId: 'analysis-longform-video',
    webPageId: 'analysis-continuity',
    courseId: 'analysis',
  },
  {
    id: 'analysis-integral',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '如何精确计算面积',
    navTitle: '积分',
    subtitle: '数学分析',
    navParentId: 'analysis-longform-video',
    webPageId: 'analysis-integral',
    courseId: 'analysis',
  },
  {
    id: 'analysis-series-approximation',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '有限项怎样逼近曲线',
    navTitle: '级数逼近',
    subtitle: '数学分析',
    navParentId: 'analysis-longform-video',
    webPageId: 'analysis-series-approximation',
    courseId: 'analysis',
  },
  {
    id: 'analysis-challenge',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'course-challenge',
    title: '数学分析习题体验',
    navTitle: '习题体验',
    navParentId: 'analysis-longform-video',
    challengeKind: 'analysis',
    courseId: 'analysis',
    summary: '先完成三组挑战任务，把极限、积分和证明链里的分析思路真正用起来。',
  },
  {
    id: 'linear-matrix-actions',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '矩阵的空间动作',
    navTitle: '线性代数',
    subtitle: '线性代数',
    webPageId: 'linear-matrix-actions',
    courseId: 'linear-algebra',
  },
  {
    id: 'linear-vector-space',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '向量不只是箭头',
    navTitle: '线性空间',
    subtitle: '线性代数',
    navParentId: 'linear-matrix-actions',
    webPageId: 'linear-vector-space',
    courseId: 'linear-algebra',
  },
  {
    id: 'linear-basis-rank',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '基底与秩',
    navTitle: '基底与秩',
    subtitle: '线性代数',
    navParentId: 'linear-matrix-actions',
    webPageId: 'linear-basis-rank',
    courseId: 'linear-algebra',
  },
  {
    id: 'linear-algebra-applications',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'web-experience',
    title: '图像与推荐的数字化',
    navTitle: '图像与推荐',
    subtitle: '线性代数',
    navParentId: 'linear-matrix-actions',
    webPageId: 'linear-algebra-applications',
    courseId: 'linear-algebra',
  },
  {
    id: 'linear-algebra-challenge',
    stageIndex: 1,
    stageTitle: 'Part 2：数学课程介绍',
    kind: 'course-challenge',
    title: '线性代数习题体验',
    navTitle: '习题体验',
    navParentId: 'linear-matrix-actions',
    challengeKind: 'linear-algebra',
    courseId: 'linear-algebra',
    summary: '围绕空间、矩阵和可逆性，继续完成概念应用与证明训练。',
  },
]

const KIND_TO_PAGE_TYPE = {
  'major-intro': 'intro-text',
  'longform-video': 'longform-video',
  'web-experience': 'web-experience',
  'course-challenge': 'course-challenge',
}

function manifestToRuntimePage(entry) {
  const base = {
    id: entry.id,
    type: KIND_TO_PAGE_TYPE[entry.kind] || 'web-experience',
    stageIndex: entry.stageIndex,
    stageTitle: entry.stageTitle,
    navTitle: entry.navTitle,
    title: entry.title,
    subtitle: entry.subtitle || '',
    navParentId: entry.navParentId || '',
    videoSrc: entry.videoSrc || '',
    videoTitle: entry.title,
    webPageId: entry.webPageId || entry.id,
    courseId: entry.courseId || '',
    challengeKind: entry.challengeKind || 'course-generic',
    summary: entry.summary || '',
  }

  if (entry.kind === 'major-intro') {
    return {
      ...base,
      stageLabel: 'Part 1 · 专业画像',
      subtitle:
        '这一页只回答“数学专业到底在观察什么、有哪些方向”。下一阶段会进入数学分析和线性代数的数学课程介绍。',
      sections: [],
      videoSrc: '/videos/math-major/math-overview.mp4',
      videoTitle: '数学专业总览',
      posterImage: '/design/math-speed/generated/math-intro-home-curriculum-v5.png',
    }
  }

  return base
}

export function buildWebAlignedIntroPages(manifest = FALLBACK_MATH_COURSE_INTRO_PAGES) {
  return (Array.isArray(manifest) ? manifest : []).map(manifestToRuntimePage)
}

export async function loadMathCourseIntroManifest() {
  try {
    const response = await api.fetchMathCourseIntroPages()
    const pages = response?.data?.pages
    if (Array.isArray(pages) && pages.length) {
      return pages
    }
  } catch (error) {
    console.warn('[math-course-intro-pages] fetch failed, using fallback', error)
  }
  return FALLBACK_MATH_COURSE_INTRO_PAGES
}
