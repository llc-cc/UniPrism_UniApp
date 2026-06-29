import {
  abstractAlgebraTopicPages,
  analysisTopicPages,
  linearAlgebraTopicPages,
  mathFoundationsSetLogicTopicPages,
  probabilityTopicPages,
  topologyTopicPages,
  type CourseTopicPage,
} from './math-content';

export type MathCourseId =
  | 'analysis'
  | 'linear-algebra'
  | 'logic'
  | 'probability'
  | 'abstract-algebra'
  | 'topology';

export type MathCourse = {
  id: MathCourseId;
  title: string;
  group: 'foundation' | 'deep-dive';
  subtitle: string;
  pages: CourseTopicPage[];
  challengeEnabled?: boolean;
};

export const mathCourses: MathCourse[] = [
  {
    id: 'analysis',
    title: '数学分析',
    group: 'foundation',
    subtitle: '从极限、连续、导数到积分，建立可验证的变化语言。',
    pages: analysisTopicPages,
    challengeEnabled: true,
  },
  {
    id: 'linear-algebra',
    title: '线性代数',
    group: 'foundation',
    subtitle: '用向量、矩阵、空间和特征结构理解线性系统。',
    pages: linearAlgebraTopicPages,
  },
  {
    id: 'logic',
    title: '逻辑基础',
    group: 'foundation',
    subtitle: '学习命题、量词、证明和形式系统的基本规则。',
    pages: mathFoundationsSetLogicTopicPages,
  },
  {
    id: 'probability',
    title: '概率论',
    group: 'deep-dive',
    subtitle: '从随机变量到极限定理，理解不确定性的结构。',
    pages: probabilityTopicPages,
  },
  {
    id: 'abstract-algebra',
    title: '抽象代数',
    group: 'deep-dive',
    subtitle: '用群、环、域和同态理解运算结构。',
    pages: abstractAlgebraTopicPages,
  },
  {
    id: 'topology',
    title: '拓扑学',
    group: 'deep-dive',
    subtitle: '关注连续变形中不变的空间结构。',
    pages: topologyTopicPages,
  },
];

export function getMathCourse(courseId: string | undefined) {
  return mathCourses.find((course) => course.id === courseId) ?? mathCourses[0];
}
