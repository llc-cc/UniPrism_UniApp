// 数学专业体验配置（与 Web MathSpeedExperience 对齐）

export const MATH_CATALOG_OVERVIEW_CARDS = [
  {
    index: '01',
    title: '了解理学院数学专业',
    body: '先看数学专业关注什么、会训练哪些能力，再用数学分析、线性代数等样本判断自己是否适合这种抽象训练。',
    image: '/design/math-speed/generated/math-intro-card-major-v3.png',
  },
  {
    index: '02',
    title: '体验真实题型样本',
    body: '可选体验抽象代数、概率论、拓扑学里的典型问题，感受继续学下去会遇到的思维方式、困难和成就感。',
    image: '/design/math-speed/generated/math-intro-card-problem-v3.png',
  },
  {
    index: '03',
    title: '了解就业去向与分流',
    body: '结合自身兴趣和未来规划，比较不同数学方向与职业任务是否匹配，而不是先要求自己学完全部课程。',
    image: '/design/math-speed/generated/math-intro-card-career-v3.png',
  },
  {
    index: '04',
    title: '完成专业体验',
    body: '完成本次体验后，可以继续按兴趣进入更具体的方向模拟流程。',
    image: '/design/math-speed/generated/math-intro-card-branch-v3.png',
  },
]

export const MATH_BRANCH_DIRECTIONS = [
  {
    id: 'basic',
    title: '基础数学',
    subtitle: '定理、结构与抽象证明',
    body: '基础数学更关注数学结构本身。它不急着解决工程问题，而是追问概念之间的关系、命题成立的条件、理论体系的边界。数论、代数、几何、拓扑、分析、逻辑与集合论，都属于基础数学的重要领域。',
    modules: ['交换代数', '代数拓扑'],
    fit: '走这条路的人，需要长期面对抽象问题，愿意为一个定义、一个反例、一条证明链反复推敲。它的反馈往往很慢，但也最接近数学本身的核心气质。',
    imageSrc: '/design/math-speed/generated/math-branch-basic-card-v3.png',
    imageAlt: '基础数学方向的证明链、几何结构、拓扑结和代数积木插图',
    videoSrc: '/videos/math-major/pure-math.mp4',
    videoTitle: '基础数学方向介绍',
  },
  {
    id: 'applied',
    title: '应用数学',
    subtitle: '把现实问题写成模型',
    body: '应用数学更像站在现实和理论之间的翻译者。现实不会把问题整理成课本题交给你。桥梁振动、疫情传播、交通调度、神经网络训练、能源系统优化，都会带来混乱的数据、约束和风险。',
    modules: ['博弈论', '组合数学'],
    fit: '应用数学要做的，是把这些现象转化成变量、方程、目标函数和模型，再把模型结论翻译回现实决策。它不比基础数学低一层，只是驱动力不同：基础数学向内追问结构，应用数学向外触碰真实系统。',
    imageSrc: '/design/math-speed/generated/math-branch-applied-card-v3.png',
    imageAlt: '应用数学方向把交通、热流和现实系统转成模型的插图',
    videoSrc: '/videos/math-major/applied-math.mp4',
    videoTitle: '应用数学方向介绍',
  },
  {
    id: 'computational',
    title: '计算数学',
    subtitle: '用算法逼近复杂模型',
    body: '计算数学关心的是：模型有了以后，怎样真正算出来。很多方程在纸面上没有精确解，但工程师、医生、气象员和算法研究者不能等数学家慢慢解完。',
    modules: ['计算机图形学', 'PDE 数值解'],
    fit: '计算数学把连续世界离散化，用网格、矩阵、迭代、随机模拟等方法求近似解，同时研究误差、稳定性和收敛性。它要求你既懂数学推导，也愿意写代码、跑程序、看结果。',
    imageSrc: '/design/math-speed/generated/math-branch-computational-card-v3.png',
    imageAlt: '计算数学方向的网格剖分、矩阵计算、迭代收敛和数值曲面插图',
    videoSrc: '/videos/math-major/computational-math.mp4',
    videoTitle: '计算数学方向介绍',
  },
  {
    id: 'statistics',
    title: '统计学',
    subtitle: '在不确定数据中判断规律',
    body: '统计学把目光放在不确定性上。一次实验、一组样本、一份调查、一批传感器数据，都可能带着随机波动。统计要判断的是：这个现象是真有规律，还是只是偶然？',
    modules: ['统计推断', '随机过程'],
    fit: '从经典实验到现代医学试验、A/B 测试、公共政策评估，统计都在帮助人们把“我觉得”变成“证据支持到什么程度”。它适合对数据敏感、愿意在有限信息中做谨慎判断的人。',
    imageSrc: '/design/math-speed/generated/math-branch-statistics-card-v3.png',
    imageAlt: '统计方向从样本、散点、回归、直方图和置信区间判断证据的插图',
    videoSrc: '/videos/math-major/statistics.mp4',
    videoTitle: '统计学方向介绍',
  },
  {
    id: 'financial',
    title: '金融数学',
    subtitle: '在风险和价格之间建模',
    body: '金融数学关注的是风险、时间和不确定收益。期权定价、资产组合、利率模型、风险管理，听起来像金融问题，背后却离不开概率、随机过程、优化和数值计算。',
    modules: ['期权定价', '风险管理'],
    fit: '金融数学不是教人猜涨跌，而是研究在不确定价格路径下，一个合约应该怎样定价，一个策略会暴露什么尾部风险，极端情况下损失能不能被提前看见。',
    imageSrc: '/design/math-speed/generated/math-branch-financial-card-v3.png',
    imageAlt: '金融数学方向用价格路径、期权收益、组合配置和风险盾牌建模市场的插图',
    videoSrc: '/videos/math-major/financial-math.mp4',
    videoTitle: '金融数学方向介绍',
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
    title: '基础数学',
    body: '基础数学更关注数学结构本身。它不急着解决工程问题，而是追问概念之间的关系、命题成立的条件、理论体系的边界。数论、代数、几何、拓扑、分析、逻辑与集合论，都属于基础数学的重要领域。',
    image: '/design/math-speed/generated/math-major-intro/math-intro-02-proof-chain.png',
  },
  {
    index: '02',
    title: '应用数学',
    body: '应用数学更像站在现实和理论之间的翻译者。现实不会把问题整理成课本题交给你。桥梁振动、疫情传播、交通调度、神经网络训练、能源系统优化，都会带来混乱的数据、约束和风险。',
    image: '/design/math-speed/generated/math-major-intro/math-intro-03-applied-bridge.png',
  },
  {
    index: '03',
    title: '计算数学',
    body: '计算数学关心的是：模型有了以后，怎样真正算出来。很多方程在纸面上没有精确解，但工程师、医生、气象员和算法研究者不能等数学家慢慢解完。',
    image: '/design/math-speed/generated/math-major-intro/math-intro-04-computational-mesh.png',
  },
  {
    index: '04',
    title: '统计学',
    body: '统计学把目光放在不确定性上。一次实验、一组样本、一份调查、一批传感器数据，都可能带着随机波动。统计要判断的是：这个现象是真有规律，还是只是偶然？',
    image: '/design/math-speed/generated/math-major-intro/math-intro-05-statistics-tea.png',
  },
  {
    index: '05',
    title: '金融数学',
    body: '金融数学关注的是风险、时间和不确定收益。期权定价、资产组合、利率模型、风险管理，听起来像金融问题，背后却离不开概率、随机过程、优化和数值计算。',
    image: '/design/math-speed/generated/math-major-intro/math-intro-06-financial-risk.png',
  },
  {
    index: '06',
    title: '进入真实样本之前',
    body: '所以，数学专业并不是单一路线。你可以向内走，进入更纯粹的理论；也可以向外走，把数学放进工程、计算、统计、金融或人工智能场景。',
    image: '/design/math-speed/generated/math-major-intro/math-intro-01-real-world.png',
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
