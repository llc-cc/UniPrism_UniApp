/**
 * 数学专业路线图（Figma node 600:6350 / 529:17468）资源与阶段配置。
 * 插图裁切参数与 Web MathMiniAppHome / MathMajorRoadmapHome 对齐。
 */
export const MATH_ROADMAP_ASSETS = {
  stageSprite: '/images/explore/discover/figma/home-math-roadmap-assets/math-stage-sprite-529-17468.png',
  completeChecklist: '/images/explore/discover/figma/home-math-roadmap-assets/complete-checklist-529-17468.png',
}

/** 小程序展示标签（与 Figma / Web MINIAPP_LABELS 一致） */
export const MATH_ROADMAP_STAGES = [
  {
    id: 'intro',
    key: 'intro',
    phase: '阶段一',
    label: '数学专业介绍',
    webTitle: '数学专业介绍',
    experienceLabel: '数学专业介绍',
    summary: '了解数学专业概览、课程结构与职业分流，建立整体印象。',
    durationHint: '约5分钟',
  },
  {
    id: 'foundation',
    key: 'foundation',
    phase: '阶段二',
    label: '三门基础课程',
    webTitle: '基础真实样本',
    experienceLabel: '基础真实样本',
    summary: '体验数学分析、线性代数、数理逻辑三个入口样本。',
    durationHint: '约8分钟',
  },
  {
    id: 'advanced',
    key: 'advanced',
    phase: '阶段三',
    label: '三门进阶课程',
    webTitle: '可选深度样本',
    experienceLabel: '可选深度样本',
    summary: '深入概率论、抽象代数、拓扑学等可选深度样本。',
    durationHint: '约8分钟',
  },
  {
    id: 'branch',
    key: 'branch',
    phase: '阶段四',
    label: '数学专业分流',
    webTitle: '数学专业分流',
    summary: '比较基础数学、应用数学、计算数学等方向差异并选择路径。',
    durationHint: '约6分钟',
  },
  {
    id: 'finish',
    key: 'finish',
    phase: '阶段五',
    label: '体验完成',
    webTitle: '体验完成',
    summary: '完成适配判断，输出你的数学专业体验结论。',
    durationHint: '约3分钟',
  },
]

/** sprite 裁切（百分比定位，与 Web STAGE_NODES.crop 一致） */
export const MATH_STAGE_SPRITE_CROPS = {
  intro: { width: '207.75%', height: '203.94%', left: '-0.13%', top: '0%' },
  foundation: { width: '196.21%', height: '203.94%', left: '-93.56%', top: '0%' },
  advanced: { width: '196.21%', height: '203.94%', left: '1.94%', top: '-98.68%' },
  branch: { width: '204.47%', height: '207.2%', left: '-102.02%', top: '-101.06%' },
}

export function getMathRoadmapStageByKey(key) {
  return MATH_ROADMAP_STAGES.find((stage) => stage.key === key) || MATH_ROADMAP_STAGES[0]
}

export function buildSpriteCropStyle(stageKey) {
  const crop = MATH_STAGE_SPRITE_CROPS[stageKey]
  if (!crop) return {}
  return {
    width: crop.width,
    height: crop.height,
    left: crop.left,
    top: crop.top,
    position: 'absolute',
    maxWidth: 'none',
  }
}
