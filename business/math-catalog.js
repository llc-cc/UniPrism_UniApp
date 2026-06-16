/**
 * 数学专业课程目录（对齐 Web MathSliceExperienceCopy 课程分组）
 */
import {
  analysisArticleSections,
  linearAlgebraArticleSections,
  logicArticleSections,
  probabilityArticleSections,
  abstractAlgebraArticleSections,
  topologyArticleSections,
} from './math-content.ts'

function buildCourse(id, title, subtitle, group, sections, challengeEnabled = true) {
  return {
    id,
    title,
    subtitle,
    group,
    challengeEnabled,
    pages: sections.map((section) => ({
      title: section.title,
      role: section.role,
      content: section.content || [],
    })),
  }
}

export const mathCourses = [
  buildCourse(
    'analysis',
    '数学分析',
    '理解连续世界的基础语言',
    'foundation',
    analysisArticleSections,
    true,
  ),
  buildCourse(
    'linear-algebra',
    '线性代数',
    '用向量、矩阵和空间变换理解多维关系',
    'foundation',
    linearAlgebraArticleSections,
    false,
  ),
  buildCourse(
    'logic',
    '数理逻辑基础',
    '用命题、集合和形式系统理解证明',
    'foundation',
    logicArticleSections,
    false,
  ),
  buildCourse(
    'probability',
    '概率论',
    '用测度、随机变量和积分建立不确定性的语言',
    'deep-dive',
    probabilityArticleSections,
    false,
  ),
  buildCourse(
    'abstract-algebra',
    '抽象代数',
    '从群、环、域和同态理解运算结构',
    'deep-dive',
    abstractAlgebraArticleSections,
    false,
  ),
  buildCourse(
    'topology',
    '拓扑学',
    '用开集、连续、紧致和连通理解空间',
    'deep-dive',
    topologyArticleSections,
    false,
  ),
]

export function getMathCourse(courseId) {
  return mathCourses.find((course) => course.id === courseId) || null
}
