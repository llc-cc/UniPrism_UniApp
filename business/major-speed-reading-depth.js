/**
 * 课程正文加深（physics 等，对齐 Web 阅读深度思路）
 */
export const MAJOR_COURSE_READING_DEPTH = {
  'physics-mech-em-math': {
    0: ['普通力学不是背公式，而是先画清楚研究对象：谁在与谁相互作用，约束是什么，守恒量是否成立。'],
    1: ['从直线运动到振动与波，关键是区分近似：小角度、小振幅、线性响应各自成立的前提。'],
    2: ['电磁部分要同时看见场与源：电荷、电流如何产生场，场又如何反作用于运动。'],
  },
  'physics-thermal-stat-quantum': {
    0: ['热学训练你看宏观量（温度、压强、熵）与微观状态数之间的桥梁。'],
    1: ['统计分布不是抽象公式，而是对大量粒子行为的有效描述；样本太少时统计直觉会失效。'],
    2: ['量子直觉从双缝、能级和测量开始：概率幅、本征态和测量坍缩必须分开理解。'],
  },
  'physics-experiment-computation-uncertainty': {
    0: ['实验物理的第一原则是记录不确定度：仪器分辨率、系统误差和随机误差要分开报告。'],
    1: ['拟合不是“让曲线穿过点”，而是估计参数并给出置信区间。'],
  },
  'physics-classical-ed-quantum': {
    0: ['分析力学用变分原理把动力学改写成几何问题：真实路径使作用量取极值。'],
    1: ['电动力学要求同时掌握麦克斯韦方程在微分与积分形式下的边界条件。'],
  },
  'physics-stat-condensed-material': {
    0: ['系综是统计物理的语言：同一宏观态对应大量微观构型，热力学量是统计平均。'],
    1: ['凝聚态的核心图像：晶格周期性如何产生能带，能隙如何区分导体与绝缘体。'],
  },
  'physics-experiment-big-science-qi': {
    0: ['大科学装置的价值在于把极弱信号从背景噪声中提取出来，触发、标定和系统误差同样重要。'],
    1: ['量子信息把态、测量和退相干放在同一框架：可读出的经典信息来自允许的测量基。'],
  },
}

export function appendCourseReadingDepth(courseId, sections) {
  if (!Array.isArray(sections)) return sections
  const depth = MAJOR_COURSE_READING_DEPTH[courseId]
  if (!depth) return sections
  return sections.map((section, index) => {
    const extra = depth[index]
    if (!extra || !extra.length) return section
    return {
      ...section,
      paragraphs: [...(section.paragraphs || []), ...extra],
    }
  })
}
