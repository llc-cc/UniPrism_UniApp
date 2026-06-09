/** 挑战入口卡片（与 Web MathSpeedExperience 一致，单独文件避免 tree-shaking 剥离模块数据） */

export const challengeTaskConfigs = {
  calculation: {
    title: '概念应用挑战',
    labels: {
      target: '应用题目',
      process: '解题步骤',
      interaction: '答案选择',
      support: '已知条件',
    },
  },
  'proof-sort': {
    title: '证明排序挑战',
    labels: {
      target: '待证明命题',
      process: '证明步骤排序',
      interaction: '排序区',
      support: '逻辑线索',
    },
  },
  'proof-interactive': {
    title: '证明交互挑战',
    labels: {
      target: '证明目标',
      process: '推理过程',
      interaction: '交互填空',
      support: '关键条件',
    },
  },
}

export const challengeTaskCards = [
  {
    id: 'calculation',
    sequenceLabel: '任务 01',
    title: '概念应用挑战',
    body: '先读本课程核心概念与规则，再完成三组递进应用题。',
    starTotal: 3,
    imageSrc: '/design/math-speed/generated/math-analysis-challenge-entry-calculation-course-style-20260529.png',
    imageAlt: '概念应用挑战入口插图，展示从概念、条件、公式到判断和解题的应用流程。',
  },
  {
    id: 'proof-sort',
    sequenceLabel: '任务 02',
    title: '证明排序挑战',
    body: '把定义、条件和中间结论排成完整证明链。',
    starTotal: 3,
    imageSrc: '/design/math-speed/generated/math-analysis-challenge-entry-proof-sort-course-style-20260529.png',
    imageAlt: '证明排序挑战入口插图，展示将散乱证明步骤排成完整论证链。',
  },
  {
    id: 'proof-interactive',
    sequenceLabel: '任务 03',
    title: '证明交互挑战',
    body: '用条件库事实和定理规则生成新结论，亲手推出目标。',
    starTotal: 3,
    imageSrc: '/design/math-speed/generated/math-analysis-challenge-entry-proof-interactive-course-style-20260529.png',
    imageAlt: '证明交互挑战入口插图，展示用已知事实和定理规则推出目标结论。',
  },
]
