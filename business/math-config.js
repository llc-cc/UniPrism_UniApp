// 数学专业体验配置（与 Web MathSpeedExperience 对齐）

export const MATH_CATALOG_OVERVIEW_CARDS = [
  {
    index: '01',
    title: '了解数学专业',
    body: '了解数学专业的大概介绍和基础课程内容，包括数学分析、线性代数等。对数学专业的学习内容、专业分流、毕业去向有大体了解。同时由练习判断是否对数学感兴趣。',
    image: '/design/math-speed/generated/math-intro-card-major-v3.png',
  },
  {
    index: '02',
    title: '深入体验学习内容',
    body: '深入体验代表本科数学专业的核心课程: 抽象代数、概率论、拓扑学，进一步判断自己是否适应数学专业的抽象思维。',
    image: '/design/math-speed/generated/math-intro-card-problem-v3.png',
  },
  {
    index: '03',
    title: '了解就业去向与选择',
    body: '结合自身兴趣和日后发展的期望，在学习本科数学知识的基础上选择自己未来深耕的职业道路。体验专业细分课程和职业任务是否符合自己预期。',
    image: '/design/math-speed/generated/math-intro-card-career-v3.png',
  },
  {
    index: '04',
    title: '完成专业分流',
    body: '完成专业体验！可以根据自己的兴趣继续体验相关职业模拟流程。',
    image: '/design/math-speed/generated/math-intro-card-branch-v3.png',
  },
]

export const MATH_BRANCH_DIRECTIONS = [
  {
    id: 'basic',
    title: '基础数学',
    subtitle: '定理、结构与抽象证明',
    body: '适合希望继续深入理论课程、接受长期证明训练，并愿意研究概念本身的人。',
    modules: ['交换代数', '代数拓扑'],
    fit: '偏研究型、证明型',
    imageSrc: '/design/math-speed/generated/math-branch-basic-card-v3.png',
  },
  {
    id: 'applied',
    title: '应用数学',
    subtitle: '把现实问题写成模型',
    body: '适合喜欢从真实系统中抽象变量、建立模型，并在假设与误差之间做取舍的人。',
    modules: ['博弈论', '组合数学'],
    fit: '偏建模型、跨学科',
    imageSrc: '/design/math-speed/generated/math-branch-applied-card-v3.png',
  },
  {
    id: 'computational',
    title: '计算数学',
    subtitle: '用算法逼近复杂模型',
    body: '适合同时喜欢数学推导和编程实现，愿意把连续问题离散化、算法化的人。',
    modules: ['计算机图形学', 'PDE 数值解'],
    fit: '偏算法型、工程型',
    imageSrc: '/design/math-speed/generated/math-branch-computational-card-v3.png',
  },
  {
    id: 'statistics',
    title: '统计',
    subtitle: '在不确定数据中判断规律',
    body: '适合喜欢数据、实验、推断和模型评估，愿意把不确定性表达清楚的人。',
    modules: ['统计推断', '随机过程'],
    fit: '偏数据型、决策型',
    imageSrc: '/design/math-speed/generated/math-branch-statistics-card-v3.png',
  },
  {
    id: 'financial',
    title: '金融数学',
    subtitle: '在风险和价格之间建模',
    body: '适合对概率、优化、市场机制和风险控制感兴趣，愿意把数学用于金融系统的人。',
    modules: ['期权定价', '风险管理'],
    fit: '偏量化型、市场型',
    imageSrc: '/design/math-speed/generated/math-branch-financial-card-v3.png',
  },
]

export const MATH_EXPERIENCE_PATH = [
  '数学专业概览',
  '数学专业介绍',
  '深入体验数学',
  '数学专业分流',
  '专业方向体验',
]

export const MATH_INTRO_HOME_CARDS = [
  {
    index: '01',
    title: '四年学什么',
    body: '数学专业的学习内容通常包含核心基础课和专业选修课。核心基础课包括数学分析、线性代数、抽象代数等是对本科数学内容的入门级别训练，在完成基础课程后；你可以自行选择基础数学、应用数学等感兴趣的方向自行攻读。',
    image: '/design/math-speed/generated/math-intro-home-curriculum-v5.png',
  },
  {
    index: '02',
    title: '常见就业 Top 5',
    body: '数学专业天生提供的就业岗位有限，主要是科研岗位和教育岗位；这要求你尽早确定一个明确的应用方向。将数学能力和行业需求结合起来，发挥自己的优势。',
    image: '/design/math-speed/generated/math-intro-home-careers-v5.png',
  },
  {
    index: '03',
    title: '真实应用场景',
    body: '数学专业尤其适合理性思维占主导的行业，包括金融、算法、工程应用等。这些行业的许多岗位需求本质都是数学能力。',
    image: '/design/math-speed/generated/math-intro-home-applications-v5.png',
  },
  {
    index: '04',
    title: '数学如何连接其他学科',
    body: '数学是多个学科的基础。软件系统需要离散结构和算法，物理需要方程和数值方法，经济需要概率统计和因果推断。理解这些连接后，选方向的关键会转向：自己愿意长期处理哪类问题。',
    image: '/design/math-speed/generated/math-intro-home-network-v5.png',
  },
]

export const MATH_STAGE_COMPLETIONS = {
  catalog: {
    completionTitle: '概览阶段完成',
    completionDescription:
      '你已经建立了对数学专业的第一印象。接下来会进入基础课程层，按数学分析、线性代数和逻辑基础逐步理解这门专业怎样训练学生。',
    nextStageTitle: '数学专业介绍',
    nextStageDescription: '从课程体系进入正式专业内容，先看基础课程如何建立严格推理能力。',
  },
  intro: {
    completionTitle: '数学专业介绍完成',
    completionDescription:
      '你已经看过数学分析、线性代数、逻辑基础等代表课程。下一阶段会进入概率论、抽象代数、拓扑学，继续观察数学专业怎样处理更复杂的问题。',
    nextStageTitle: '深入体验数学',
    nextStageDescription: '深度课程会继续使用同样的文章结构，但问题难度、抽象程度和证明要求都会更接近本科核心课。',
  },
  deep: {
    completionTitle: '深入体验完成',
    completionDescription:
      '你已经通过深度课程接触了数学专业更接近本科核心课的专业动作。接下来会选择一个方向，进入方向专题级内容。',
    nextStageTitle: '数学专业分流',
    nextStageDescription: '比较不同方向的训练重点、代表问题和职业延展。',
  },
  direction: {
    completionTitle: '专业方向体验完成',
    completionDescription:
      '你已经走完了数学专业的概览、基础课程、深度课程、分流和方向专题。可以继续体验其他专业，或进入职业模拟阶段。',
    nextStageTitle: '返回继续探索',
    nextStageDescription: '完成适配判断后，会记录为“已体验数学专业”。',
  },
}

export const MATH_BRANCH_TOPICS = {
  basic: [
    {
      title: '交换代数',
      subtitle: '把整数、多项式、零点集合和局部视野统一到交换环语言里',
      summary:
        '交换代数研究环、理想、局部化与谱，是连接代数、几何与数论的重要语言。你会学习如何把几何对象翻译成代数结构，并用局部化与素理想谱理解“点附近”的行为。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否愿意长期处理抽象代数结构与证明链。',
        output: '给出一条从定义到结论的最小证明路径。',
      },
    },
    {
      title: '代数拓扑',
      subtitle: '把形状直觉翻译成同伦、基本群与同调这些可计算的不变量',
      summary:
        '代数拓扑用群与同调等不变量描述空间的“形状本质”。同伦、基本群与同调让你区分看起来相似但本质不同的空间，是研究型数学的重要入口。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否能在几何直觉与代数不变量之间来回切换。',
        output: '解释一个不变量如何区分两种相似空间。',
      },
    },
  ],
  applied: [
    {
      title: '博弈论',
      subtitle: '把互相猜测写成策略、收益、顺序与信念',
      summary:
        '博弈论研究在互相猜测下的策略选择，用收益矩阵、纳什均衡和信念更新描述竞争与合作。它连接经济学、算法与社会科学中的策略问题。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否喜欢把现实互动写成可分析的策略模型。',
        output: '写出一个两人博弈的收益表并解释均衡含义。',
      },
    },
    {
      title: '组合数学',
      subtitle: '用双射、递推、容斥、生成函数和图模型组织离散对象',
      summary:
        '组合数学关心计数、结构与存在性，常用递推、容斥与生成函数处理离散对象。它与算法设计、密码学和优化联系紧密。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否愿意在离散结构中寻找规律与证明。',
        output: '用递推或容斥解释一个计数问题的结构。',
      },
    },
  ],
  computational: [
    {
      title: '计算机图形学',
      subtitle: '把三维场景、三角形、光照和帧率约束转成屏幕图像',
      summary:
        '计算机图形学把几何、线性代数与光照模型结合，在实时约束下生成图像。网格、变换矩阵、着色与渲染管线是核心概念。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否愿意同时处理数学推导与工程实现。',
        output: '描述从三维坐标到屏幕像素的关键变换步骤。',
      },
    },
    {
      title: 'PDE 数值解',
      subtitle: '把连续方程离散成网格、格式、误差和求解器',
      summary:
        '偏微分方程数值解把连续问题离散到网格上，用有限差分/有限元与稳定性分析逼近真实解。它是计算数学与工程仿真的核心工具。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否能在连续模型与离散算法之间建立联系。',
        output: '说明离散化如何影响误差与稳定性。',
      },
    },
  ],
  statistics: [
    {
      title: '统计推断',
      subtitle: '从样本波动、似然、区间和贝叶斯更新判断总体',
      summary:
        '统计推断用样本信息推断总体参数，涉及估计、置信区间与假设检验。它强调在不确定性下做可解释的判断。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否愿意与数据波动和证据强度打交道。',
        output: '解释置信区间与点估计的区别。',
      },
    },
    {
      title: '随机过程',
      subtitle: '把不确定性放到时间轴上研究路径、转移、等待和鞅',
      summary:
        '随机过程研究随时间演化的随机现象，如马尔可夫链、泊松过程与布朗运动。它是金融、排队与机器学习中的重要模型语言。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否能在时间维度上理解不确定性。',
        output: '描述一个简单随机过程的路径特征。',
      },
    },
  ],
  financial: [
    {
      title: '期权定价',
      subtitle: '从 payoff、复制组合和动态对冲理解合约价格',
      summary:
        '期权定价用无套利与复制思想，把衍生品价格写成随机过程与偏微分方程问题。Black-Scholes 框架是金融数学的经典入口。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否对概率模型与市场机制同时感兴趣。',
        output: '说明复制组合如何支撑期权定价直觉。',
      },
    },
    {
      title: '风险管理',
      subtitle: '用损益分布、尾部指标、压力测试和限额管理坏情形',
      summary:
        '风险管理用 VaR、压力测试与组合限额控制尾部损失，把统计推断与业务约束结合。它要求既懂模型也懂决策边界。',
      interaction: {
        title: '专题任务',
        goal: '判断自己是否愿意在收益与尾部风险之间做量化权衡。',
        output: '列出一种尾部风险指标及其业务含义。',
      },
    },
  ],
}

export const MATH_BRANCH_ROLEMAPS = {
  basic: ['纯粹数学研究员', '高校教师', '代数/拓扑方向研究生'],
  applied: ['应用数学建模师', '运筹优化研究员', '跨学科项目科学家'],
  computational: ['科学计算工程师', '图形/仿真算法工程师', 'HPC 研发'],
  statistics: ['数据科学家', '生物统计师', '实验设计与推断顾问'],
  financial: ['量化分析师', '衍生品定价研究员', '风险管理工程师'],
}
