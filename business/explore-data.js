import { asset } from '../utils/asset-map'

export const DISCOVER_STAGES = [
  {
    id: 'interest',
    number: '01',
    stageTitle: '第一阶段 兴趣探索',
    title: '兴趣探索',
    intro: '先完成兴趣问卷，得到你的 RIASEC 能力画像与推荐专业方向。',
    lines: ['完成兴趣问卷', '生成你的兴趣画像'],
    progressLabel: '兴趣探索进度',
    actionLabel: '继续探索',
    accent: '#14b8a6',
    track: '#087c72',
    fill: '#19d0b0',
    knob: '#4de5cf',
    soft: '#ebfffb',
    artwork: 'https://uniprism.cn/images/explore/discover/generated/interest-stage-student-simple-crop.png',
  },
  {
    id: 'major',
    number: '02',
    stageTitle: '第二阶段 专业体验',
    title: '专业体验',
    intro: '从兴趣画像出发，筛选适合你的专业方向并进入体验内容。',
    lines: ['进入专业任务场景', '了解真实学习内容'],
    progressLabel: '专业体验任务（至少体验三个专业内容）',
    actionLabel: '开始体验',
    accent: '#2BA8BC',
    track: '#0b65c2',
    fill: '#76d8ff',
    knob: '#a8ecff',
    soft: '#f1fcfe',
    artwork: 'https://uniprism.cn/images/explore/discover/generated/stage-major-experience-crop.png',
  },
  {
    id: 'career',
    number: '03',
    stageTitle: '第三阶段 职业模拟',
    title: '职业模拟',
    intro: '把专业理解推进到真实职业场景，判断自己是否愿意长期投入。',
    lines: ['进入职业情境', '记录你的选择偏好'],
    progressLabel: '职业模拟完成度',
    actionLabel: '进入模拟',
    accent: '#8b5cf6',
    track: '#5537c8',
    fill: '#ffb020',
    knob: '#ffd27a',
    soft: '#f7f3ff',
    artwork: 'https://uniprism.cn/images/explore/discover/generated/stage-career-simulation-crop.png',
  },
  {
    id: 'report',
    number: '04',
    title: '生成报告',
    intro: '回顾兴趣结果、探索路径、专业偏好与职业体验记录。',
    actionLabel: '查看探索报告',
    accent: '#f59e0b',
    soft: '#fff8ec',
    artwork: asset('/images/explore/discover/step-report-bg.png'),
  },
]

export const INTEREST_SHORTCUTS = [
  {
    id: 'profile',
    icon: asset('/images/explore/discover/sidebar/profile.png'),
    title: '查看个人画像',
    subtitle: '查看内容',
    lockUntilProfile: true,
  },
  {
    id: 'major',
    icon: 'https://uniprism.cn/images/explore/discover/generated/learn-majors-card-icon-v1.png',
    title: '了解不同专业',
    subtitle: '查看内容',
  },
  {
    id: 'career',
    icon: 'https://uniprism.cn/images/explore/discover/generated/learn-careers-card-icon-v1.png',
    title: '了解不同职业',
    subtitle: '查看内容',
  },
]

export const MAJOR_TASK_OVERVIEW = {
  title: '专业体验任务（至少体验三个专业内容）',
  badge: '当前阶段',
  description: '从问题、任务与能力线索出发，至少完成三个专业内容体验，找到更适合你的专业方向。',
  visualBefore: 'https://uniprism.cn/images/explore/discover/generated/task-interest-model.png',
  visualAfter: 'https://uniprism.cn/images/explore/discover/generated/task-interest-model.png',
  footerLines: [
    '在步入大学选择专业以及职业前，你对自己的真实兴趣有多少了解？',
    '下面请通过一系列体验来发掘真实的自我。',
  ],
}

export const MAJOR_EXPERIENCES = [
  {
    id: 'math-u',
    title: '数学与应用数学',
    shortTitle: '数学',
    en: 'Mathematics',
    accent: '#1769E0',
    icon: asset('/images/explore/discover/figma/major-math-345-32973.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '用函数、结构与推理理解世界，建立抽象建模与严谨证明能力。',
    fit: ['喜欢从定义出发推导结论', '愿意用模型解释复杂现象', '能接受较长的训练周期'],
    coreCourses: ['数学分析', '线性代数', '概率论', '抽象代数', '拓扑学'],
    directions: ['基础数学', '应用数学', '计算数学', '统计', '金融数学'],
    careers: ['数学家', '算法研究员', '量化分析师', '软件工程师'],
    tasks: ['了解数学专业概览与课程结构', '阅读基础课与深入方向内容', '完成数学分析挑战并选择分流方向'],
    media: [
      { type: 'image', url: 'https://uniprism.cn/design/math-speed/generated/math-branching-start-v1.png', title: '专业分流图' },
      { type: 'image', url: 'https://uniprism.cn/design/math-speed/generated/math-intro-home-curriculum-v5.png', title: '课程路径图' },
    ],
    route: '/pages/math/index',
  },
  {
    id: 'physics-u',
    title: '物理学',
    shortTitle: '物理学',
    en: 'Physics',
    accent: '#06b6d4',
    icon: asset('/images/explore/discover/figma/major-physics-345-32972.svg'),
    heroImage: 'https://uniprism.cn/design/major-sim/physics/foundation/mechanics-model-cn-v2.png',
    summary: '从普通物理基础进入理论、实验和计算训练，适合愿意用模型和证据解释自然现象的人。',
    fit: ['对自然规律有强烈好奇', '愿意在实验和理论之间切换', '擅长用数学表达现实问题'],
    coreCourses: ['力学', '电磁学', '热力学与统计物理', '光学与量子基础'],
    directions: ['理论物理', '实验物理', '计算物理', '交叉科学'],
    careers: ['科研计算', '算法研究', '高端制造研发'],
    tasks: ['理解基础课程结构', '查看典型实验与建模图', '判断自己更偏理论还是实验'],
    media: [
      { type: 'image', url: 'https://uniprism.cn/design/major-sim/physics/foundation/mechanics-model-cn-v2.png', title: '力学建模' },
      { type: 'image', url: 'https://uniprism.cn/design/major-sim/physics/foundation/electromagnetism-overview-cn-v2.png', title: '电磁学总览' },
    ],
  },
  {
    id: 'cs-u',
    title: '计算机科学',
    shortTitle: '计算机',
    en: 'Computer Science',
    accent: '#5b6cff',
    icon: asset('/images/explore/discover/icons/generated/discover-major-computer-science-technology-20260610-v2-flat2d.png'),
    heroImage: 'https://uniprism.cn/design/major-sim/cs/foundation/algorithms-data-structures-v1.png',
    summary: '从程序、离散结构和算法进入系统课程，适合愿意证明过程正确并诊断真实系统约束的人。',
    fit: ['喜欢结构化解决问题', '愿意反复调试和验证', '对系统如何运转有兴趣'],
    coreCourses: ['程序设计', '离散数学', '数据结构与算法', '操作系统'],
    directions: ['软件系统', '安全', '系统架构', '应用算法'],
    careers: ['软件工程师', '算法研究员', '系统开发'],
    tasks: ['查看算法与系统训练图', '比较不同方向输出', '评估自己更喜欢抽象推理还是工程落地'],
    media: [
      { type: 'image', url: 'https://uniprism.cn/design/major-sim/cs/foundation/algorithms-data-structures-v1.png', title: '算法与数据结构' },
      { type: 'image', url: 'https://uniprism.cn/design/major-sim/cs/foundation/systems-networks-v1.png', title: '系统与网络' },
    ],
  },
  {
    id: 'ai-u',
    title: '人工智能',
    shortTitle: '人工智能',
    en: 'Artificial Intelligence',
    accent: '#14b8a6',
    icon: asset('/images/explore/discover/icons/generated/discover-major-artificial-intelligence-20260610-v2-flat2d.png'),
    heroImage: 'https://uniprism.cn/design/major-sim/ai/generated/ai-overview-hero-v2.png',
    summary: '从数学、代码、数据实验进入机器学习和智能系统，适合愿意检查模型泛化与失败边界的人。',
    fit: ['愿意用数据和实验说话', '能接受模型不断迭代', '对算法与应用都感兴趣'],
    coreCourses: ['机器学习', '深度学习', '数据实验', '智能系统原理'],
    directions: ['算法理论', '模型应用', '智能体', 'AI 基础设施'],
    careers: ['算法研究员', 'AI 工程师', '数据科学家'],
    tasks: ['浏览训练闭环图', '比较不同技术路线', '判断自己更适合研究还是工程应用'],
    media: [
      { type: 'image', url: 'https://uniprism.cn/design/major-sim/ai/generated/ai-overview-hero-v2.png', title: 'AI 总览' },
      { type: 'image', url: 'https://uniprism.cn/design/major-sim/ai/generated/ai-course-map-v2.png', title: '课程地图' },
    ],
  },
  {
    id: 'finance-u',
    title: '金融学',
    shortTitle: '金融学',
    en: 'Finance',
    accent: '#0ea5e9',
    icon: asset('/images/explore/discover/icons/generated/majors/major-finance.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '从财报、估值、市场和风险管理进入投资、量化、金融科技与监管科技方向。',
    fit: ['对数据和商业判断都敏感', '愿意理解市场波动', '喜欢风险与收益分析'],
    coreCourses: ['公司金融', '投资学', '计量分析', '风险管理'],
    directions: ['投资研究', '量化金融', '金融科技', '监管与风控'],
    careers: ['投资分析师', '量化研究员', '金融产品经理'],
    tasks: ['比较行业方向', '理解课程与职业转化', '确认自己更偏研究还是业务'],
    media: [
      { type: 'image', url: asset('/images/explore/discover/stage-hero-major-clean.png'), title: '专业入口' },
    ],
  },
  {
    id: 'econ-u',
    title: '经济学',
    shortTitle: '经济学',
    en: 'Economics',
    accent: '#6366f1',
    icon: asset('/images/explore/discover/icons/generated/majors/major-economics.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '从选择、激励、制度和数据证据进入计量、因果推断、政策与产业分析。',
    fit: ['喜欢解释社会运行机制', '能接受抽象模型与数据并行', '对政策和产业有兴趣'],
    coreCourses: ['微观经济学', '宏观经济学', '计量经济学', '博弈论'],
    directions: ['政策研究', '产业分析', '数据研究', '商业策略'],
    careers: ['经济研究员', '产业分析师', '咨询顾问'],
    tasks: ['观察模型如何解释社会现象', '理解数据证据的重要性', '判断自己是否喜欢长期分析'],
    media: [
      { type: 'image', url: asset('/images/explore/discover/stage-hero-major-clean.png'), title: '专业入口' },
    ],
  },
  {
    id: 'actuarial-u',
    title: '精算学',
    shortTitle: '精算学',
    en: 'Actuarial Science',
    accent: '#0f766e',
    icon: asset('/images/explore/discover/icons/generated/majors/major-actuarial.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '把概率、金融数学、保险业务和资本监管组织成不确定现金流的定价与准备。',
    fit: ['对概率与风险很敏感', '偏好严谨规范的分析工作', '愿意长期训练数理能力'],
    coreCourses: ['概率论', '金融数学', '保险学', '风险建模'],
    directions: ['保险定价', '风险评估', '资本管理', '数据风控'],
    careers: ['精算分析师', '风险经理', '保险产品研究'],
    tasks: ['理解定价逻辑', '比较风险控制与业务应用', '判断自己是否喜欢规范型工作'],
    media: [
      { type: 'image', url: asset('/images/explore/discover/stage-hero-major-clean.png'), title: '专业入口' },
    ],
  },
  {
    id: 'chem-u',
    title: '化学',
    shortTitle: '化学',
    en: 'Chemistry',
    accent: '#ea580c',
    icon: asset('/images/explore/discover/icons/generated/majors/major-chemistry.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '从结构、反应、谱图和安全记录进入材料能源、药物、分析和绿色化学方向。',
    fit: ['喜欢观察物质变化', '愿意遵守实验规范', '对材料或生命应用感兴趣'],
    coreCourses: ['无机化学', '有机化学', '分析化学', '物理化学'],
    directions: ['材料化学', '药物研发', '分析检测', '绿色化学'],
    careers: ['材料研发', '药物研究', '实验分析工程师'],
    tasks: ['了解实验训练强度', '比较不同应用方向', '判断自己是否喜欢实验室环境'],
    media: [
      { type: 'image', url: asset('/images/explore/discover/stage-hero-major-clean.png'), title: '专业入口' },
    ],
  },
  {
    id: 'bio-u',
    title: '生物学',
    shortTitle: '生物',
    en: 'Biology',
    accent: '#22c55e',
    icon: asset('/images/explore/discover/figma/major-biology-345-32970.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '从细胞、遗传、生态和实验设计进入生命科学、医学转化和生物技术方向。',
    fit: ['对生命系统有持续好奇', '愿意做观察记录与实验验证', '能接受长期积累和反复复核'],
    coreCourses: ['细胞生物学', '遗传学', '生物化学', '生态学'],
    directions: ['分子生物', '生物技术', '生态与环境', '医学相关研究'],
    careers: ['生物研发', '实验研究员', '医学与健康相关分析'],
    tasks: ['理解生命科学训练路径', '比较实验与应用方向', '判断自己是否喜欢持续观察和验证'],
    media: [
      { type: 'image', url: asset('/images/explore/discover/stage-hero-major-clean.png'), title: '专业入口' },
    ],
  },
  {
    id: 'mech-u',
    title: '机械工程',
    shortTitle: '机械工程',
    en: 'Mechanical Engineering',
    accent: '#475569',
    icon: asset('/images/explore/discover/icons/generated/majors/major-mechanical.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '把力学、材料、热流体、控制和制造约束变成可验证、可量产的机械系统。',
    fit: ['喜欢实体系统和结构', '愿意在约束下做设计', '重视可制造性与可靠性'],
    coreCourses: ['工程力学', '机械设计', '材料基础', '制造工艺'],
    directions: ['结构设计', '制造系统', '自动化设备', '工业研发'],
    careers: ['机械设计工程师', '产品研发工程师', '制造工程师'],
    tasks: ['理解工程约束', '比较设计与制造角色', '判断自己是否喜欢硬件系统'],
    media: [
      { type: 'image', url: asset('/images/explore/discover/stage-hero-major-clean.png'), title: '专业入口' },
    ],
  },
  {
    id: 'ee-u',
    title: '电子电器',
    shortTitle: '电子电器',
    en: 'Electrical and Electronic Engineering',
    accent: '#2563eb',
    icon: asset('/images/explore/discover/icons/generated/majors/major-ee.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '从电路、信号、逻辑、嵌入式和电磁功率进入通信、控制、板级硬件与测试。',
    fit: ['喜欢电路和系统联动', '能处理抽象信号与真实硬件', '愿意调试复杂设备'],
    coreCourses: ['电路基础', '信号与系统', '嵌入式系统', '控制原理'],
    directions: ['通信', '控制', '嵌入式', '硬件测试'],
    careers: ['硬件工程师', '嵌入式开发', '控制系统工程师'],
    tasks: ['理解信号与硬件关系', '比较不同工程方向', '判断自己更偏底层还是系统'],
    media: [
      { type: 'image', url: asset('/images/explore/discover/stage-hero-major-clean.png'), title: '专业入口' },
    ],
  },
  {
    id: 'ic-u',
    title: '集成电路',
    shortTitle: '集成电路',
    en: 'Integrated Circuit',
    accent: '#7c3aed',
    icon: asset('/images/explore/discover/icons/generated/majors/major-ic.svg'),
    heroImage: asset('/images/explore/discover/stage-hero-major-clean.png'),
    summary: '从半导体器件、RTL、验证、后端和封装约束进入芯片设计与 AI 加速器方向。',
    fit: ['对底层硬件逻辑敏感', '愿意处理复杂约束和长周期项目', '喜欢高精度协作'],
    coreCourses: ['数字电路', '半导体器件', '芯片设计', '验证与后端'],
    directions: ['数字前端', '验证', '后端实现', 'AI 芯片'],
    careers: ['芯片设计工程师', '验证工程师', 'EDA 研发'],
    tasks: ['了解芯片开发流程', '比较前后端角色', '判断自己是否适合高约束协作环境'],
    media: [
      { type: 'image', url: asset('/images/explore/discover/stage-hero-major-clean.png'), title: '专业入口' },
    ],
  },
]

export const CAREER_SIMULATIONS = [
  {
    id: 'mathematician',
    title: '数学家',
    badge: '纯粹研究',
    track: '理科',
    accent: '#3b82f6',
    icon: asset('/images/explore/discover/icons/generated/careers/career-mathematician.png'),
    heroImage: asset('/images/careers/simulation-mathematician.png'),
    summary: '从结构、证明与抽象系统中寻找新的知识边界。',
    dimensions: ['I', 'C'],
    relatedMajors: ['math-u', 'physics-u', 'cs-u'],
    steps: [
      { title: '认识工作对象', body: '数学家的任务不是做现成题目，而是把模糊直觉改写成可验证的命题与证明。', image: asset('/images/careers/simulation-mathematician.png') },
      { title: '拆解研究流程', body: '先读文献、找例子、看边界，再把问题压缩成局部命题，逐步形成证明。', image: 'https://uniprism.cn/design/math-speed/generated/math-logic-article-proof-bw-v2.png' },
      { title: '进入情境任务', body: '面对一个图结构猜想，判断先找反例、先做特例，还是先补背景。', image: asset('/images/explore/discover/career-simulation/scenario-to-task.png') },
      { title: '形成适配判断', body: '最终回到一个核心问题：你是否愿意长期面对不确定、反复打磨表达与证明。', image: asset('/images/explore/discover/career-simulation/choice-to-fit.png') },
    ],
  },
  {
    id: 'algorithm-researcher',
    title: '算法研究员',
    badge: '算法设计',
    track: '交叉',
    accent: '#00a889',
    icon: asset('/images/explore/discover/icons/generated/careers/career-algorithm-researcher.png'),
    heroImage: asset('/images/explore/discover/stage-hero-career-clean.png'),
    summary: '在图结构、复杂度与最优路径中验证更高效的解决方案。',
    dimensions: ['I', 'C'],
    relatedMajors: ['cs-u', 'ai-u', 'math-u'],
    steps: [
      { title: '理解问题形态', body: '算法研究员把现实任务翻译成搜索、优化、预测或决策问题。', image: 'https://uniprism.cn/design/major-sim/cs/foundation/algorithms-data-structures-v1.png' },
      { title: '比较解决策略', body: '你要在精确性、速度、资源消耗和泛化能力之间做取舍。', image: 'https://uniprism.cn/design/major-sim/ai/foundation/training-loop-v1.png' },
      { title: '模拟研究节奏', body: '从 baseline 到误差分析，再到模型迭代，真正的工作是持续判断。', image: 'https://uniprism.cn/design/major-sim/ai/foundation/knowledge-search-v1.png' },
    ],
  },
  {
    id: 'software-engineer',
    title: '软件工程师',
    badge: '系统构建',
    track: '工科',
    accent: '#5b6cff',
    icon: asset('/images/explore/discover/icons/generated/careers/career-software-engineer.png'),
    heroImage: asset('/images/explore/discover/stage-hero-career-clean.png'),
    summary: '把模块、接口与调试反馈组织成稳定可用的软件系统。',
    dimensions: ['R', 'I', 'C'],
    relatedMajors: ['cs-u', 'ai-u', 'ee-u'],
    steps: [
      { title: '认识系统约束', body: '软件工程师不仅写功能，还要处理性能、稳定性、协作和可维护性。', image: 'https://uniprism.cn/design/major-sim/cs/foundation/systems-networks-v1.png' },
      { title: '搭建实现路径', body: '需求拆解、接口定义、测试验证、日志诊断构成了核心工作流。', image: 'https://uniprism.cn/design/major-sim/cs/foundation/algorithms-data-structures-v1.png' },
      { title: '判断职业适配', body: '如果你喜欢通过迭代把复杂系统打磨成可用产品，这条路径会更匹配你。', image: asset('/images/explore/discover/stage-hero-career-clean.png') },
    ],
  },
]

export function getMajorById(majorId) {
  return MAJOR_EXPERIENCES.find((item) => item.id === majorId) || null
}

export function getCareerById(careerId) {
  return CAREER_SIMULATIONS.find((item) => item.id === careerId) || null
}

export function getRecommendedCareers(topDimensions, recommendedMajorIds) {
  const dims = topDimensions || []
  const majors = recommendedMajorIds || []
  return CAREER_SIMULATIONS
    .map((career) => {
      let score = 0
      ;(career.dimensions || []).forEach((dim) => {
        if (dims.includes(dim)) score += 2
      })
      ;(career.relatedMajors || []).forEach((majorId) => {
        if (majors.includes(majorId)) score += 3
      })
      if (career.id === 'mathematician' && dims.includes('I')) score += 1
      return { ...career, _score: score }
    })
    .sort((a, b) => b._score - a._score)
}
