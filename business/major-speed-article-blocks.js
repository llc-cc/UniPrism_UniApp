/**
 * 课程文章区块增强（对齐 Web MajorTemplateExperience.getCourseArticleBlocks）
 */
import { asset } from '../utils/asset-map'

const ARTICLE_VISUAL_KINDS = ['map', 'concept', 'method', 'error', 'summary']

const sim = (path) => asset(`/design/major-sim/${path}`)

function figure(imageSrc, imageAlt, imageWidth = 1672, imageHeight = 941) {
  return { imageSrc, imageAlt, imageWidth, imageHeight }
}

const CS_ALGO = sim('cs/foundation/algorithms-data-structures-v1.png')
const CS_SYS = sim('cs/foundation/systems-networks-v1.png')
const AI_TRAIN = sim('ai/foundation/training-loop-v1.png')
const AI_SEARCH = sim('ai/foundation/knowledge-search-v1.png')

/** 按 page-aligned courseId 索引，每门课最多 5 张 section 图 */
export const COURSE_SECTION_IMAGE_OVERRIDES = {
  'physics-mech-em-math': [
    figure(sim('physics/foundation/mechanics-model-cn-v2.png'), '气垫导轨轨迹、参考系和运动方程建模流程图'),
    figure(sim('physics/foundation/mechanics-frame-cn-v2.png'), '加速小车摆球在实验室参考系与随车参考系中的受力差异图'),
    figure(sim('physics/foundation/electromagnetism-overview-cn-v2.png'), '电荷电流源、介质、场线和能量流的电磁学课程总览图'),
    figure(sim('physics/foundation/electromagnetism-potential-field-cn-v2.png'), '等势线、电场线和电势梯度关系图'),
    figure(sim('physics/foundation/mechanics-report-cn-v2.png'), '普通力学建模报告流程图'),
  ],
  'physics-thermal-stat-quantum': [
    figure(sim('physics/foundation/thermal-micro-macro-cn-v2.png'), '气体微观粒子状态、宏观温度压强和涨落关系图'),
    figure(sim('physics/foundation/thermal-state-process-cn-v2.png'), '活塞气体、状态量、热量功和 P-V 路径对比图'),
    figure(sim('physics/foundation/thermal-entropy-counting-cn-v2.png'), '宏观态、微观态数量和熵的状态数解释图'),
    figure(sim('physics/foundation/thermal-boltzmann-cn-v2.png'), '能级占据概率、低温高温玻尔兹曼分布和配分函数图'),
    figure(sim('physics/foundation/thermal-free-energy-cn-v2.png'), '自由能景观、平衡、热机、相变、半导体占据和分子模拟应用图'),
  ],
  'physics-experiment-computation-uncertainty': [
    figure(sim('physics/foundation/optics-overview-cn-v2.png'), '几何光学、波动光学和近代物理量子证据的递进图'),
    figure(sim('physics/foundation/optics-geometric-cn-v2.png'), '折射、薄透镜成像、光阑和傍轴近似示意图'),
    figure(sim('physics/foundation/optics-wave-cn-v2.png'), '双缝干涉、单缝衍射、偏振和相干波前示意图'),
    figure(sim('physics/foundation/optics-quantum-evidence-cn-v2.png'), '能级跃迁、离散光谱和光电效应阈值示意图'),
    figure(sim('physics/foundation/optics-applications-cn-v2.png'), '显微成像、光纤、激光谐振腔和光谱分析应用总结图'),
  ],
  'physics-classical-ed-quantum': [
    figure(sim('physics/deep/latex-model/deep-analytical-mechanics-v1.png'), '变分原理中多条候选路径与驻定作用量路径的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/deep-electrodynamics-v1.png'), '电磁波传播中相互垂直场振荡的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/deep-quantum-mechanics-v1.png'), '势阱中束缚态波函数与概率分布的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/deep-electrodynamics-v1.png'), '电磁波传播中相互垂直场振荡的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/deep-analytical-mechanics-v1.png'), '变分原理中多条候选路径与驻定作用量路径的 LaTeX 风格图'),
  ],
  'physics-stat-condensed-material': [
    figure(sim('physics/deep/latex-model/deep-statistical-physics-v1.png'), '微观格点状态生成宏观分布曲线的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/topic-band-conductor-insulator-v1.png'), '能带间隙与能带重叠区分绝缘和导电的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/topic-first-principles-band-v1.png'), '晶格结构导出电子能带曲线的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/topic-ising-monte-carlo-v1.png'), '伊辛格点自旋采样与相变曲线的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/topic-band-conductor-insulator-v1.png'), '能带间隙与能带重叠区分绝缘和导电的 LaTeX 风格图'),
  ],
  'physics-experiment-big-science-qi': [
    figure(sim('physics/deep/latex-model/topic-particle-invariant-mass-v1.png'), '碰撞径迹重建不变质量峰的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/topic-interferometry-phase-v1.png'), '干涉仪光路差转化为条纹相位移动的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/topic-qubit-readout-v1.png'), '布洛赫球量子态读出为离散结果的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/topic-noether-symmetry-v1.png'), '连续旋转对称与守恒量对应关系的 LaTeX 风格图'),
    figure(sim('physics/deep/latex-model/topic-general-relativity-geodesic-v1.png'), '弯曲时空网格中测地线路径的 LaTeX 风格图'),
  ],
  'cs-programming-discrete': Array(5).fill(figure(CS_ALGO, '程序状态、图结构、树结构和代码块组成的计算机基础训练图', 1000, 675)),
  'cs-data-structures-algorithms': Array(5).fill(figure(CS_ALGO, '图、堆、树和伪代码组成的数据结构与算法训练图', 1000, 675)),
  'cs-systems-intro': Array(5).fill(figure(CS_SYS, '缓存层级、内存块和网络协议节点组成的计算机系统图', 1000, 675)),
  'cs-os-db-network': Array(5).fill(figure(CS_SYS, '资源层级、调度路径和共享系统组件组成的操作系统图', 1000, 675)),
  'cs-software-security': Array(5).fill(figure(CS_ALGO, '语法树、代码块和状态转换组成的编译原理训练图', 1000, 675)),
  'cs-distributed-cloud': Array(5).fill(figure(CS_SYS, '网络节点、数据包流和协议分层组成的计算机网络图', 1000, 675)),
  'ai-math-stat-optimization': Array(5).fill(figure(AI_TRAIN, '张量、神经网络层、损失曲线和梯度箭头组成的 AI 数学训练图', 1000, 662)),
  'ai-cs-data-foundation': Array(5).fill(figure(AI_SEARCH, '数据划分、路径规划和决策流程组成的 AI 实验审计图', 1000, 799)),
  'ai-problem-formalization': Array(5).fill(figure(AI_SEARCH, '知识图谱、搜索网格和智能体决策流程组成的 AI 原理图', 1000, 799)),
  'ai-ml-dl': Array(5).fill(figure(AI_TRAIN, '模型训练、损失曲线和特征表示组成的机器学习诊断图', 1000, 662)),
  'ai-rl-robotics': Array(5).fill(figure(AI_SEARCH, '路径规划网格、智能体动作和决策树组成的强化学习图', 1000, 799)),
  'ai-llm-agent-eval-safety': Array(5).fill(figure(AI_TRAIN, '深度网络层、反向传播和训练曲线组成的深度学习图', 1000, 662)),
}

function compactList(items, maxItems = 5) {
  return (items || []).filter(Boolean).slice(0, maxItems)
}

function getArticleVisualKind(index) {
  return ARTICLE_VISUAL_KINDS[index] || 'summary'
}

function completeCourseArticleSection(course, section, index) {
  const visualKind = getArticleVisualKind(index)
  const imageOverride = COURSE_SECTION_IMAGE_OVERRIDES[course.id]?.[index]
  const defaultFormula =
    visualKind === 'map'
      ? course.formula
      : visualKind === 'concept'
        ? compactList(course.interaction.inputs, 3).join(' + ')
        : visualKind === 'method'
          ? compactList(course.interaction.actions, 4).join(' -> ')
          : visualKind === 'error'
            ? compactList(course.interaction.feedback, 3).join(' / ')
            : (course.interaction.output || '').replace(/。$/, '')
  const defaultFigureItems =
    visualKind === 'map'
      ? compactList([course.title, ...(course.tags || []), course.interaction.title], 5)
      : visualKind === 'concept'
        ? compactList(course.interaction.inputs, 5)
        : visualKind === 'method'
          ? compactList(course.interaction.actions, 5)
          : visualKind === 'error'
            ? compactList(course.interaction.feedback, 5)
            : compactList([course.interaction.output, ...(course.tags || [])], 5)

  return {
    ...imageOverride,
    ...section,
    visualKind,
    formula: section.formula ?? defaultFormula,
    figureItems: section.figureItems ?? defaultFigureItems,
  }
}

export function getCourseArticleBlocks(course) {
  if (!course || !Array.isArray(course.sections)) return []

  if (course.sections.length >= 5) {
    return course.sections.slice(0, 5).map((section, index) => completeCourseArticleSection(course, section, index))
  }

  return course.sections.map((section, index) => completeCourseArticleSection(course, section, index))
}

export function enrichCourseArticle(article) {
  if (!article) return article
  return {
    ...article,
    formula: article.formula || (article.tags || []).slice(0, 3).join(' -> '),
    sections: getCourseArticleBlocks(article),
  }
}
