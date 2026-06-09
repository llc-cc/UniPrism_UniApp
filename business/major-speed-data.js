// 专业速体验内容（与 Web 端 MajorTemplateExperience 的 PAGE_ALIGNED_MAJOR_BLUEPRINTS 对齐）
// 结构：专业认知(intro + overviewCards) -> 基础内容(foundationCourses) -> 专业内容(coreCourses) -> 方向分流(branches) -> 相关职业(careers)
// 数学专业走独立完整体验模块，不在此表内。

import { asset } from '../utils/asset-map'
import { enrichCourseArticle } from './major-speed-article-blocks'
import { appendCourseReadingDepth } from './major-speed-reading-depth'

const majorIcon = (name) => asset(`/images/explore/discover/icons/generated/majors/${name}`)

export const MAJOR_SPEED_TEMPLATES = {
  'cs-u': {
    label: '计算机',
    labelLong: '计算机科学专业',
    en: 'Computer Science',
    accent: '#5b6cff',
    icon: majorIcon('major-cs.png'),
    intro: [
      '计算机科学研究怎样把现实问题表示为可计算对象：程序、数据结构、算法、系统、网络服务和人与机器的交互都在同一条链上。',
      '这段体验按数学专业的页面节奏重排：先建立专业认知，再进入三门基础课、三门进阶课，最后分流到系统、安全、数据和产品/语言方向。',
    ],
    overviewCards: [
      { title: '计算机科学学什么', body: '从程序、数据、系统和人机交互理解“让问题可计算”。' },
      { title: '四年课程地图', body: '编程与离散结构 -> 算法与系统 -> 软件/安全/数据 -> 分流项目。' },
      { title: '真实工作对象', body: '代码库、API、数据库、网络服务、测试、部署和安全审查。' },
      { title: '毕业去向', body: '软件工程、平台/云、数据工程、安全、产品工程、研究生路线。' },
    ],
    foundationIntro: '基础内容从编程、离散结构、算法和系统入口建立计算机的专业语言，让学生知道代码怎样变成可测试、可扩展、可运行的系统。',
    coreIntro: '专业内容进入操作系统、数据库、网络、软件工程、安全、分布式系统和云平台，把局部程序推进到真实服务和团队工程。',
    foundationCourses: [
      { id: 'cs-programming-discrete', title: '编程与离散结构', subtitle: '把问题写成可执行规则', intro: '学生先理解程序不是语法训练，而是表达对象、关系和步骤。', topics: ['变量与状态', '集合、图与关系', '递归与归纳', '布尔逻辑与条件', '小程序如何变成可测试模块'], task: '实现一个小型关系查询器并写单元测试', tags: ['程序状态', '离散结构', '测试'] },
      { id: 'cs-data-structures-algorithms', title: '数据结构与算法', subtitle: '让同一个问题快得多', intro: '从“为什么同样功能速度差很多”进入结构选择和复杂度。', topics: ['数组、链表、栈队列', '树和哈希表', '图搜索', '排序与分治', '复杂度和最坏情况'], task: '为社交网络推荐功能选结构并 benchmark', tags: ['复杂度', '图搜索', 'benchmark'] },
      { id: 'cs-systems-intro', title: '计算机系统导论', subtitle: '代码如何在机器上运行', intro: '连接 CPU、内存、文件、进程、并发和调试。', topics: ['二进制与内存', 'CPU 与指令', '进程、线程与并发', '文件和 I/O', '性能分析与 bug 追踪'], task: '追踪一个内存或并发 bug 并写 postmortem', tags: ['内存', '并发', '调试'] },
    ],
    coreCourses: [
      { id: 'cs-os-db-network', title: '操作系统、数据库与网络', subtitle: '大规模服务的三根支柱', intro: '用服务变慢、数据错乱、请求丢失解释系统课程的价值。', topics: ['进程调度与内存', '事务与索引', '网络协议', '并发与一致性', '观测日志与故障恢复'], task: '做一个带数据库的服务并分析故障日志', tags: ['OS', 'DB', 'Network'] },
      { id: 'cs-software-security', title: '软件工程与安全', subtitle: '让代码可维护、可协作、可审计', intro: '从多人协作项目进入需求、模块、测试、CI/CD、威胁模型。', topics: ['需求与接口', '测试金字塔', '版本控制和代码评审', '权限与威胁建模', '供应链与发布'], task: '为一个 API 写测试、CI 和安全审查', tags: ['测试', 'CI', '安全'] },
      { id: 'cs-distributed-cloud', title: '分布式系统与云平台', subtitle: '复制、容错与成本', intro: '前沿云系统不是“部署上去”，而是处理失败、一致性和资源成本。', topics: ['副本与一致性', '分布式存储', '任务调度', '缓存和队列', '可观测性与 SRE'], task: '实现 mini KV 或任务队列并注入故障', tags: ['一致性', 'SRE', '云平台'] },
    ],
    branches: [
      { id: 'cs-infra', title: '系统与云基础设施', fit: '喜欢底层机制、性能和可靠性', topics: ['分布式系统', '云原生与可观测性'], frontier: 'tracing、Kubernetes、serverless 作为工具，不替代系统原理', project: '搭建可观测 mini service 并写故障恢复报告', roles: ['后端', '平台', 'SRE'] },
      { id: 'cs-security', title: '安全与可靠软件', fit: '喜欢攻击防御、证明和审计', topics: ['应用安全', '形式化与软件测试'], frontier: 'OWASP、fuzzing、SBOM、供应链安全', project: '复现漏洞、修复并补回归测试', roles: ['安全工程', '可靠性工程'] },
      { id: 'cs-ai-data', title: 'AI 与数据系统', fit: '喜欢数据管道和模型基础设施', topics: ['数据工程', 'ML 系统基础'], frontier: 'feature store、向量检索、batch/stream', project: '建一个数据管道并验证数据质量', roles: ['数据工程', 'ML 平台'] },
      { id: 'cs-hci-pl', title: 'HCI / 产品工程 / PL', fit: '喜欢把技术交给人使用', topics: ['人机交互', '程序语言与 API 设计'], frontier: 'A/B test、可访问性、类型系统', project: '做一个可用性测试并改进 API 或界面', roles: ['产品工程', '前端', '开发工具'] },
    ],
    careers: ['软件工程', '平台工程', '数据工程', '安全工程', '研究生路线'],
  },
  'ai-u': {
    label: '人工智能',
    labelLong: '人工智能专业',
    en: 'Artificial Intelligence',
    accent: '#00a889',
    icon: majorIcon('major-ai.png'),
    intro: [
      '人工智能不等于只会调用大模型。它把数学、数据、模型、系统、评测、安全和真实任务组织成可验证的智能工程。',
      '体验会从数学统计与优化、CS 和数据工程、AI 问题形式化进入 ML/DL/RL/LLM/Agent，再分流到 Agent 工程、研究预备、具身智能和安全评测。',
    ],
    overviewCards: [
      { title: 'AI 不只是大模型', body: '从数学、数据、模型、系统、评测和安全理解 AI。' },
      { title: '四年课程地图', body: '数学统计优化 -> ML/DL/RL -> LLM/Agent -> 安全与应用分流。' },
      { title: '真实工作对象', body: '数据集、模型、实验、评测、工具调用、监控和风险报告。' },
      { title: '毕业去向', body: 'ML 工程、LLM 应用、AI 安全评测、机器人、研究工程。' },
    ],
    foundationIntro: '基础内容先建立模型学习的语言、数据生命周期和智能任务形式化，避免学生一开始只追工具名而忽略可验证问题。',
    coreIntro: '专业内容进入机器学习、深度学习、强化学习、机器人决策、LLM、Agent、评测和安全，重点是能力边界与失败诊断。',
    foundationCourses: [
      { id: 'ai-math-stat-optimization', title: '数学、统计与优化', subtitle: '模型学习的语言', intro: '从误差如何被压小进入线代、概率、估计和梯度。', topics: ['向量和矩阵表示', '概率与不确定性', '损失函数', '梯度下降', '泛化和偏差方差'], task: '从零实现线性分类器并解释误差', tags: ['线性代数', '概率统计', '优化'] },
      { id: 'ai-cs-data-foundation', title: 'CS 与数据工程基础', subtitle: '模型进入真实数据', intro: '让学生理解数据生命周期比单个模型更长。', topics: ['Python 与数据结构', '数据清洗', '训练、验证、测试划分', 'SQL 与数据管道', '实验记录'], task: '构建数据集卡和 baseline notebook', tags: ['数据工程', '实验记录', 'baseline'] },
      { id: 'ai-problem-formalization', title: 'AI 问题形式化', subtitle: '状态、动作、目标和评估', intro: '在深度学习前先学会把智能任务写成可求解问题。', topics: ['搜索与规划', '知识表示', '概率推理', '决策理论', '评估指标'], task: '设计一个搜索或规划任务并比较策略', tags: ['搜索', '规划', '评估'] },
    ],
    coreCourses: [
      { id: 'ai-ml-dl', title: '机器学习与深度学习', subtitle: '从数据中学习函数', intro: '用泛化失败解释监督学习、深度网络和训练实践。', topics: ['监督学习', '无监督与表征', '神经网络', 'Transformer 直觉', 'ablation 和复现实验'], task: '训练一个模型并写 ablation 报告', tags: ['ML', 'DL', 'Transformer'] },
      { id: 'ai-rl-robotics', title: '强化学习与机器人决策', subtitle: '从反馈中学习行动', intro: '用游戏或机器人说明策略、价值函数、探索和仿真。', topics: ['MDP', '价值迭代', '策略梯度', '探索利用', '仿真到现实差距'], task: '在仿真环境训练并评估策略', tags: ['RL', '机器人', '仿真'] },
      { id: 'ai-llm-agent-eval-safety', title: 'LLM、Agent、评测与安全', subtitle: '工具时代的 AI 工程', intro: '进入 RAG、函数调用、MCP/Agents SDK、coding agent、安全评测。', topics: ['LLM 与 RAG', '工具调用和 MCP', 'Agent workflow', 'SWE-bench/MLE-bench/GAIA', 'prompt injection 和 guardrails'], task: '构建可审计 RAG/Agent 并做失效分析', tags: ['LLM', 'Agent', '评测安全'] },
    ],
    branches: [
      { id: 'ai-agent', title: 'LLM / Agent 工程', fit: '喜欢把模型接入工具和流程', topics: ['Agent 工程', 'Coding Agent 评测'], frontier: 'Agents SDK、MCP、SWE-bench', project: '让 agent 修改小仓库并通过测试和权限审计', roles: ['LLM 应用工程'] },
      { id: 'ai-research', title: 'AI 研究预备', fit: '喜欢论文、模型和实验', topics: ['深度学习理论', 'RL 与优化'], frontier: '前沿 RL reasoning 等需持续复核', project: '复现论文并写 ablation', roles: ['研究工程', '研究生'] },
      { id: 'ai-embodied', title: '机器人与具身 AI', fit: '喜欢真实环境、控制和视觉', topics: ['机器人学习', '视觉与控制'], frontier: 'ROS2、仿真器、具身评测', project: '机器人任务策略和 sim-to-real 风险报告', roles: ['机器人 AI'] },
      { id: 'ai-safety-industry', title: 'AI 安全、评测与行业 AI', fit: '喜欢测试边界和治理', topics: ['AI 安全评测', '行业 AI 应用'], frontier: 'NIST AI RMF、OWASP LLM、模型卡', project: '红队一个 LLM 应用并写风险卡', roles: ['AI safety/eval', '行业 AI PM/工程'] },
    ],
    careers: ['ML 工程', 'LLM 应用工程', 'AI 安全评测', '机器人 AI', '研究工程'],
  },
  'finance-u': {
    label: '金融',
    labelLong: '金融学专业',
    en: 'Finance',
    accent: '#0ea5e9',
    icon: majorIcon('major-finance.svg'),
    intro: [
      '金融研究资金如何在时间、风险、信息和制度之间流动。它不是“赚钱技巧”，而是现金流、定价、风险和监管的判断训练。',
      '体验会先读懂财报、经济与统计底座，再进入估值、市场、投资、衍生品、风险管理和金融科技分流。',
    ],
    overviewCards: [
      { title: '金融学什么', body: '研究资金如何跨时间、风险和制度流动。' },
      { title: '四年课程地图', body: '会计统计 -> 公司金融/市场 -> 投资衍生品风险 -> 分流。' },
      { title: '真实工作对象', body: '财报、估值模型、组合、风险指标、交易成本和监管报告。' },
      { title: '毕业去向', body: '投资、公司金融、量化、风险管理、金融科技。' },
    ],
    foundationIntro: '基础内容把财报、宏观环境、统计波动、时间价值和市场工具整理成金融语言。',
    coreIntro: '专业内容进入投资、固定收益、衍生品、风险管理、模型治理、金融数据和市场基础设施。',
    foundationCourses: [
      { id: 'finance-accounting-econ-stat', title: '会计、经济与统计底座', subtitle: '读懂企业和市场', intro: '用财报、宏观环境和样本波动建立金融语言。', topics: ['三张报表', '现金流与利润', '利率和通胀', '统计描述', '风险收益直觉'], task: '重构一家公司简化财报并解释指标', tags: ['财报', '统计', '宏观'] },
      { id: 'finance-corporate-valuation', title: '公司金融与估值', subtitle: '今天的钱和未来的钱', intro: '讲清时间价值、资本预算、DCF、WACC 和资本结构。', topics: ['时间价值', '项目现金流', '资本成本', 'DCF 估值', '敏感性分析'], task: '做一个 DCF 并写投资建议', tags: ['DCF', 'WACC', '资本结构'] },
      { id: 'finance-markets-instruments', title: '金融市场与工具', subtitle: '价格从哪里来', intro: '连接股票、债券、基金、衍生品、交易机制和伦理。', topics: ['市场参与者', '股票和债券', '基金和组合', '期货期权直觉', '伦理和信息披露'], task: '写一页投资备忘录', tags: ['市场', '债券', '衍生品'] },
    ],
    coreCourses: [
      { id: 'finance-investment-fixed-income-derivatives', title: '投资、固定收益与衍生品', subtitle: '给风险定价', intro: '从收益分布、久期、期权 payoff 和套保进入投资核心。', topics: ['组合和分散化', '因子和 alpha', '债券久期', '期权 payoff', '动态对冲'], task: '构建组合并用衍生品对冲风险', tags: ['组合', '固定收益', '期权'] },
      { id: 'finance-risk-model-governance', title: '风险管理与模型治理', subtitle: '坏情形如何进入决策', intro: '把 VaR/ES、压力测试、信用风险、模型验证和 SR 11-7 串成闭环。', topics: ['VaR/ES', '压力测试', '信用和流动性风险', '模型验证', '风险限额'], task: '做风险仪表盘和模型验证 memo', tags: ['VaR', '压力测试', '模型治理'] },
      { id: 'finance-fintech-infra', title: '金融数据、FinTech 与市场基础设施', subtitle: '市场背后的数据和清算', intro: '讲 API 数据、交易成本、支付、tokenisation、监管科技和 AI 风险。', topics: ['市场数据 API', '交易成本', '支付清算', '统一账本/代币化', 'GenAI 金融治理'], task: '设计一个清算或合规模型案例', tags: ['FinTech', '支付清算', 'RegTech'] },
    ],
    branches: [
      { id: 'finance-investment', title: '投资管理', fit: '喜欢研究公司和资产', topics: ['股票分析', '固定收益与组合'], frontier: 'CFA 知识域、私募和另类投资', project: '投资委员会 memo', roles: ['证券分析', '基金分析'] },
      { id: 'finance-corporate-banking', title: '公司金融与投行', fit: '喜欢企业决策和交易', topics: ['M&A 与资本结构', '创业金融'], frontier: '尽调、条款表、资本市场窗口', project: '并购估值和融资方案', roles: ['投行', '战略财务'] },
      { id: 'finance-quant-risk', title: '量化与风险', fit: '喜欢概率、模型和验证', topics: ['量化策略', '市场/信用风险'], frontier: 'backtest、VaR/ES、Basel/FRTB', project: '策略回测和风险限额报告', roles: ['Quant', '风控'] },
      { id: 'finance-fintech-regtech', title: '金融科技与监管科技', fit: '喜欢系统、支付和合规', topics: ['支付清算', 'AI 金融治理'], frontier: 'tokenisation、GenAI risk、RegTech', project: '监管数据和模型风险报告', roles: ['FinTech', '合规科技'] },
    ],
    careers: ['投资分析', '投行与战略财务', '量化研究', '风险管理', '金融科技'],
  },
  'econ-u': {
    label: '经济',
    labelLong: '经济学专业',
    en: 'Economics',
    accent: '#6366f1',
    icon: majorIcon('major-economics.svg'),
    intro: [
      '经济学研究选择、激励、制度和资源配置。它把争议性现实问题变成模型、数据、识别假设和政策备忘录。',
      '体验会从微观、宏观、统计和研究问题进入计量、因果推断、宏观金融数据与政策方向。',
    ],
    overviewCards: [
      { title: '经济学学什么', body: '研究选择、激励、制度和资源配置。' },
      { title: '四年课程地图', body: '微宏观 -> 数学统计 -> 计量因果 -> 政策/产业/发展分流。' },
      { title: '真实工作对象', body: '公共数据、模型、政策备忘录、预测和因果证据。' },
      { title: '毕业去向', body: '政策研究、咨询、数据分析、金融经济、研究生路线。' },
    ],
    foundationIntro: '基础内容建立模型假设、经济数据、统计证据和研究问题意识，让学生理解相关性不能直接替代因果。',
    coreIntro: '专业内容进入中级微宏观、计量、因果推断、政策评估和实时宏观数据预测。',
    foundationCourses: [
      { id: 'econ-micro-macro-institutions', title: '微观、宏观与制度直觉', subtitle: '个体选择到整体经济', intro: '让学生理解模型为何需要假设、激励和均衡。', topics: ['稀缺与选择', '供需和价格', '企业与市场结构', 'GDP/通胀/失业', '制度与激励'], task: '解释一个价格管制或补贴案例', tags: ['微观', '宏观', '制度'] },
      { id: 'econ-stat-data-literacy', title: '数学统计与数据素养', subtitle: '证据如何从数据来', intro: '建立概率、统计、回归和数据清洗基础。', topics: ['概率和样本', '统计推断', '回归直觉', '数据清洗', '可视化和数据来源'], task: '用公开数据重建一个指标图', tags: ['统计', '回归', '数据'] },
      { id: 'econ-writing-research-question', title: '经济写作与研究问题', subtitle: '问一个能被回答的问题', intro: '训练问题定义、文献、识别思路和政策表达。', topics: ['相关与因果', '研究问题', '变量和数据', '识别假设', '政策 memo 结构'], task: '写一个研究设计 memo', tags: ['研究设计', '政策表达', '因果'] },
    ],
    coreCourses: [
      { id: 'econ-intermediate-econometrics', title: '中级微观、宏观与计量', subtitle: '从直觉到可估计模型', intro: '连接优化、均衡、宏观动态和回归识别。', topics: ['消费者与企业', '一般均衡', '增长和周期', 'OLS 与误差', '面板/时间序列入口'], task: '做一个计量报告和稳健性检查', tags: ['中级微观', '宏观', '计量'] },
      { id: 'econ-causal-policy', title: '因果推断与政策评估', subtitle: '相关不等于因果', intro: '用 RCT、DID、IV、RDD、DML 解释政策评估。', topics: ['随机实验', 'DID', '工具变量', '断点回归', '双重/去偏机器学习'], task: '评估一个政策效果并写结论', tags: ['RCT', 'DID', 'DML'] },
      { id: 'econ-macro-financial-data', title: '宏观金融数据与预测', subtitle: '用实时数据看经济', intro: '使用 FRED/IMF/OECD/World Bank 等 API 做预测和情景。', topics: ['通胀和就业', '利率和货币政策', '财政与债务', '国际贸易', 'AI 与生产率'], task: '做宏观 dashboard 和预测 memo', tags: ['宏观数据', '预测', '政策'] },
    ],
    branches: [
      { id: 'econ-policy-central-bank', title: '政策与央行分析', fit: '喜欢宏观和公共决策', topics: ['货币财政政策', '宏观预测'], frontier: 'real-time data API、AI productivity', project: '写政策简报', roles: ['政策分析', '央行/智库'] },
      { id: 'econ-causal-consulting', title: '因果与数据咨询', fit: '喜欢用数据判断效果', topics: ['应用计量', '实验与准实验'], frontier: 'DML、GRF、可复现实证', project: '做政策评估报告', roles: ['咨询', '数据分析'] },
      { id: 'econ-industry-labor-development', title: '产业、劳动与发展', fit: '喜欢企业、劳动力和发展问题', topics: ['产业组织', '劳动与发展经济学'], frontier: '平台经济、分配、发展约束', project: '写产业或发展 memo', roles: ['研究助理', '咨询'] },
      { id: 'econ-finance-climate-digital', title: '金融、环境与数字经济', fit: '喜欢跨学科政策问题', topics: ['金融经济', '环境与数字经济'], frontier: 'climate economics、digital platforms', project: '做气候或平台政策评估', roles: ['金融经济', '公共政策'] },
    ],
    careers: ['政策研究', '咨询', '数据分析', '金融经济', '研究生路线'],
  },
  'actuarial-u': {
    label: '精算',
    labelLong: '精算学专业',
    en: 'Actuarial Science',
    accent: '#0f766e',
    icon: majorIcon('major-actuarial.svg'),
    intro: [
      '精算把不确定未来变成今天可定价、可准备、可监管的承诺。它连接概率、金融数学、保险业务、数据模型和资本监管。',
      '体验会从不确定现金流和保险业务底座进入寿险、损失模型、准备金、预测分析、资本监管和保险数据科学分流。',
    ],
    overviewCards: [
      { title: '精算学什么', body: '把不确定未来变成可定价、可准备、可监管的承诺。' },
      { title: '四年课程地图', body: '概率金融数学 -> 寿险/非寿险 -> 预测分析/资本监管。' },
      { title: '真实工作对象', body: '生命表、损失三角形、保费、准备金、资本和模型验证。' },
      { title: '毕业去向', body: '寿险、财险、再保、风险资本、保险数据科学。' },
    ],
    foundationIntro: '基础内容建立概率统计、金融数学、保险业务、精算编程和数据处理能力，让学生先读懂保险承诺。',
    coreIntro: '专业内容进入寿险、损失模型、准备金、预测分析、模型验证、资本监管和财务报告。',
    foundationCourses: [
      { id: 'actuarial-prob-stat-finmath', title: '概率统计与金融数学', subtitle: '不确定现金流的语言', intro: '将分布、期望、利率、年金和现值连接到保险承诺。', topics: ['随机变量', '常见分布', '利息理论', '年金和现值', '风险度量'], task: '计算一组保险现金流现值', tags: ['概率', '现值', '风险度量'] },
      { id: 'actuarial-business-accounting-econ', title: '保险业务、会计与经济', subtitle: '风险池如何运转', intro: '解释保费、赔付、准备金、再保、监管和报表。', topics: ['风险池', '保费和赔付', '准备金直觉', '保险公司报表', '监管为何存在'], task: '画出简化保险公司资产负债图', tags: ['保险业务', '准备金', '监管'] },
      { id: 'actuarial-programming-data', title: '精算编程与数据处理', subtitle: '从考试题到数据表', intro: '训练 R/Python、数据清洗、loss triangle、可复现报告。', topics: ['数据导入清洗', '三角形数据', 'GLM 直觉', '可视化', '可复现报告'], task: '清洗赔付数据并生成三角形', tags: ['R/Python', 'loss triangle', 'GLM'] },
    ],
    coreCourses: [
      { id: 'actuarial-life-loss-reserving', title: '寿险、损失模型与准备金', subtitle: '承诺、赔付和时间错配', intro: '覆盖 mortality、survival、loss models、reserving、credibility。', topics: ['生命表', '寿险现值', '损失分布', '准备金三角形', '可信度'], task: '写 reserve/pricing report', tags: ['寿险', '损失模型', '准备金'] },
      { id: 'actuarial-predictive-validation', title: '预测分析与模型验证', subtitle: '用模型定价，也要解释模型', intro: '连接 GLM/树模型、交叉验证、解释性、公平和监控。', topics: ['GLM 定价', '树模型', '交叉验证', '可解释性', '模型监控'], task: '做一个保险定价模型卡', tags: ['预测分析', '模型卡', '监控'] },
      { id: 'actuarial-capital-reg-reporting', title: '资本、监管与财务报告', subtitle: '公司能否承受坏未来', intro: '讲 RBC/Solvency II、IFRS 17、ORSA、ALM、气候情景。', topics: ['风险资本', 'IFRS 17', 'ALM', '压力情景', '气候/长寿风险'], task: '做资本情景和监管 memo', tags: ['资本', 'IFRS 17', 'ORSA'] },
    ],
    branches: [
      { id: 'actuarial-life-health', title: '寿险与健康险', fit: '喜欢长期现金流和人群风险', topics: ['寿险精算', '健康险与养老金'], frontier: 'IFRS 17、长寿风险', project: '寿险估值报告', roles: ['寿险精算', '健康精算'] },
      { id: 'actuarial-pc-cat', title: 'P&C 与巨灾风险', fit: '喜欢损失数据和极端事件', topics: ['非寿险定价', '巨灾与再保'], frontier: 'climate scenarios、cat models', project: 'loss triangle + 巨灾情景', roles: ['财险精算', '再保精算'] },
      { id: 'actuarial-erm-capital', title: '风险资本与监管', fit: '喜欢资本、报表和治理', topics: ['经济资本', '偿付能力监管'], frontier: 'RBC/Solvency II/ORSA', project: '资本充足率 memo', roles: ['风险资本', 'ERM'] },
      { id: 'actuarial-data-science', title: '保险数据科学', fit: '喜欢模型和业务决策', topics: ['预测分析', 'InsurTech'], frontier: 'telematics、fraud、model governance', project: '自动承保模型卡', roles: ['保险数据科学'] },
    ],
    careers: ['寿险精算', '财险精算', '再保', '风险资本', '保险数据科学'],
  },
  'chem-u': {
    label: '化学',
    labelLong: '化学专业',
    en: 'Chemistry',
    accent: '#ea580c',
    icon: majorIcon('major-chemistry.svg'),
    intro: [
      '化学研究物质如何组成、反应、转化和被证明。它把结构、能量、证据和安全约束放在同一张实验记录里。',
      '体验会从普通化学、分析、安全和反应记录进入有机无机、仪器谱学、物理化学、计算化学和材料/药物/绿色方向。',
    ],
    overviewCards: [
      { title: '化学学什么', body: '研究物质如何组成、反应、转化和被证明。' },
      { title: '四年课程地图', body: '普通/分析安全 -> 有机无机物化 -> 仪器/材料/计算分流。' },
      { title: '真实工作对象', body: '实验记录、谱图、样品、仪器数据、合成路线和安全评估。' },
      { title: '毕业去向', body: '研发、分析/QC、材料能源、药物、绿色环境、计算化学。' },
    ],
    foundationIntro: '基础内容从原子分子、平衡、定量分析、安全文化、结构反应和计算工具建立化学证据规则。',
    coreIntro: '专业内容进入反应机制、催化、仪器谱学、方法验证、物理化学、计算化学和材料能源。',
    foundationCourses: [
      { id: 'chem-general-analytical-safety', title: '普通化学、定量分析与安全', subtitle: '实验室里的第一套证据规则', intro: '把原子分子、平衡、热力学、氧化还原和安全文化连接起来。', topics: ['原子与键', '平衡与酸碱', '热力学入口', '氧化还原', '实验安全和记录'], task: '写安全 SOP 和定量误差报告', tags: ['普通化学', '定量分析', '安全'] },
      { id: 'chem-structure-reaction-record', title: '结构、反应与实验记录', subtitle: '分子为什么这样反应', intro: '从结构、官能团、机理、无机配位和证据链进入化学推理。', topics: ['有机结构', '反应机理', '配位和固体', '实验笔记', '产物证据'], task: '设计一条合成路线并说明证据', tags: ['结构', '机理', '证据链'] },
      { id: 'chem-math-physics-computation', title: '数学、物理与计算工具', subtitle: '反应背后的能量和光谱', intro: '给物化、量化、动力学、谱学和数据库使用打底。', topics: ['能量面', '动力学', '量子和光谱', '统计热力学', 'NIST/PubChem 数据'], task: '用数据库解释分子性质', tags: ['物化', '光谱', '数据库'] },
    ],
    coreCourses: [
      { id: 'chem-organic-inorganic-mechanism', title: '有机、无机与反应机制', subtitle: '设计和控制化学变化', intro: '深入选择性、催化、合成、配位和固体结构。', topics: ['选择性', '催化循环', '逆合成', '配位化学', '固体与材料入口'], task: '评审一条更绿色的合成路线', tags: ['有机', '无机', '催化'] },
      { id: 'chem-instrumental-spectroscopy', title: '分析、仪器与谱学', subtitle: '仪器读数如何变成证据', intro: 'HPLC/GC/MS/NMR/IR/UV、校准、方法验证和误差。', topics: ['校准曲线', '色谱', '质谱', 'NMR/IR', 'LOD/LOQ 和方法验证'], task: '完成谱图解析和方法验证报告', tags: ['谱学', '方法验证', '仪器'] },
      { id: 'chem-physical-computational-materials', title: '物理化学、计算化学与材料', subtitle: '从分子到材料性能', intro: '连接热力学、动力学、量子化学、DFT、材料和能源。', topics: ['热力学函数', '反应速率', '量子化学', 'DFT 边界', '电池/催化材料'], task: '小分子或材料性质计算和验证', tags: ['物理化学', 'DFT', '材料'] },
    ],
    branches: [
      { id: 'chem-material-energy', title: '材料与能源化学', fit: '喜欢性能、结构和应用', topics: ['电化学能源', '催化与固体材料'], frontier: 'AI materials、LCA', project: '电池或催化材料评估', roles: ['材料研发', '能源研发'] },
      { id: 'chem-drug-chemical-bio', title: '药物与化学生物', fit: '喜欢生命分子和合成', topics: ['药物化学', '结构生物与分子设计'], frontier: 'AlphaFold、PubChem、ADMET', project: 'hit-to-lead brief', roles: ['药物研发'] },
      { id: 'chem-qc-instrument', title: '分析/QC 与仪器', fit: '喜欢证据、标准和仪器', topics: ['高级仪器分析', '质量方法验证'], frontier: 'NIST 数据、HPLC/GC/MS', project: '方法验证报告', roles: ['QC/QA', '分析化学'] },
      { id: 'chem-green-ai', title: '绿色环境与 AI 化学', fit: '喜欢可持续和计算', topics: ['绿色化学', 'AI for Chemistry'], frontier: 'autonomous lab watchlist', project: '绿色工艺和模型边界 audit', roles: ['环境化学', '计算化学'] },
    ],
    careers: ['化学研发', '分析/QC', '材料能源', '药物研发', '计算化学'],
  },
  'physics-u': {
    label: '物理',
    labelLong: '物理学专业',
    en: 'Physics',
    accent: '#1cb0f6',
    icon: majorIcon('major-physics.png'),
    intro: [
      '物理学用模型、实验和数学寻找自然规律。一个看似噪声的信号，可能需要方程、仪器和统计证据共同判断。',
      '体验会按 page-level 大纲从基础方程、热统计量子直觉、实验计算数据进入高阶理论、凝聚态、大科学装置和量子信息方向。',
    ],
    overviewCards: [
      { title: '物理学学什么', body: '用模型、实验和数学寻找自然规律。' },
      { title: '四年课程地图', body: '力电热量 -> 实验计算 -> 凝聚态/量子/宇宙/光电分流。' },
      { title: '真实工作对象', body: '方程、实验仪器、数据、误差、仿真和开放科学数据。' },
      { title: '毕业去向', body: '科研深造、仪器工程、数据科学、光电/量子、教育。' },
    ],
    foundationIntro: '基础内容从运动、场、能量、微分方程、热统计、量子直觉、测量误差和 Python 数据分析建立物理语言。',
    coreIntro: '专业内容进入经典力学、电动力学、量子核心、统计物理、凝聚态、实验物理、大科学装置和量子信息。',
    foundationCourses: [
      { id: 'physics-mech-em-math', title: '力学、电磁与数学方法', subtitle: '方程如何预测世界', intro: '用运动、场、能量和微分方程建立物理语言。', topics: ['牛顿与能量', '振动和波', '电场磁场', '麦克斯韦直觉', '数学方法'], task: '仿真一个振动或轨迹并做误差说明', tags: ['力学', '电磁', '数学方法'] },
      { id: 'physics-thermal-stat-quantum', title: '热、统计与量子直觉', subtitle: '宏观现象来自微观可能性', intro: '从温度、熵、分布、波函数和测量进入现代物理。', topics: ['温度与熵', '概率分布', '量子态', '测量', '简单量子系统'], task: '模拟随机过程或量子井', tags: ['热统计', '量子', '测量'] },
      { id: 'physics-experiment-computation-uncertainty', title: '实验、计算与数据不确定性', subtitle: '什么时候结果可信', intro: '训练测量、误差、仪器、电子学、拟合和 Python。', topics: ['测量与误差', '仪器和电子学', '拟合', '信号处理', '可复现实验报告'], task: '写 uncertainty budget 和拟合报告', tags: ['实验', '计算', '不确定性'] },
    ],
    coreCourses: [
      { id: 'physics-classical-ed-quantum', title: '经典、电动力学与量子核心', subtitle: '从现象到高阶理论', intro: '深入拉格朗日/哈密顿、电磁场、量子态和微扰。', topics: ['变分原理', '哈密顿形式', '电磁波', '量子算符', '微扰和跃迁'], task: '解释一个光谱或散射现象', tags: ['理论力学', '电动力学', '量子'] },
      { id: 'physics-stat-condensed-material', title: '统计物理、凝聚态与材料', subtitle: '许多粒子如何产生新性质', intro: '连接费米/玻色、相变、能带、输运和半导体。', topics: ['系综', '相变', '晶格', '能带', '输运和半导体'], task: '建一个能带或输运简化模型', tags: ['统计物理', '凝聚态', '材料'] },
      { id: 'physics-experiment-big-science-qi', title: '实验物理、大科学装置与量子信息', subtitle: '现代物理如何看见罕见信号', intro: '进入探测器、触发、开放数据、量子线路和误差校正。', topics: ['探测器', 'CERN/LIGO 数据', '贝叶斯推断', '量子比特', '退相干'], task: '分析开放信号数据或量子线路', tags: ['大科学装置', '开放数据', '量子信息'] },
    ],
    branches: [
      { id: 'physics-condensed-quantum-material', title: '凝聚态与量子材料', fit: '喜欢微观结构和材料性质', topics: ['固体物理', '量子材料'], frontier: 'topological/quantum materials', project: '能带和材料性质报告', roles: ['材料工程', '量子工程'] },
      { id: 'physics-particle-cosmos-data', title: '粒子、宇宙与大数据', fit: '喜欢基本规律和大科学装置', topics: ['粒子物理', '宇宙学与引力波'], frontier: 'CERN、LIGO、JWST/Rubin', project: '事件或信号分析 notebook', roles: ['科研', '科学数据'] },
      { id: 'physics-photonics-instrument', title: '光电、仪器与测量', fit: '喜欢实验系统和工程', topics: ['光学与激光', '仪器电子学'], frontier: 'photonics、detectors', project: '光学测量系统设计', roles: ['光电工程', '仪器工程'] },
      { id: 'physics-computational-data', title: '计算与数据物理', fit: '喜欢模拟和数值方法', topics: ['计算物理', '统计推断与反演'], frontier: 'HPC、Monte Carlo、open data', project: '数值模拟和不确定性报告', roles: ['数据', '科学软件'] },
    ],
    careers: ['科研深造', '仪器工程', '数据科学', '光电/量子', '教育'],
  },
  'mech-u': {
    label: '机械',
    labelLong: '机械工程专业',
    en: 'Mechanical Engineering',
    accent: '#475569',
    icon: majorIcon('major-mechanical.svg'),
    intro: [
      '机械工程把力、材料、热、运动和制造约束变成可工作的机器。CAD 看似完美的零件，还必须通过材料、工艺和测试验证。',
      '体验会从图学、材料、力学、热流体进入控制、设计制造、数字孪生、增材制造和机器人/能源分流。',
    ],
    overviewCards: [
      { title: '机械学什么', body: '把力、材料、热、运动和制造约束变成可工作的机器。' },
      { title: '四年课程地图', body: '图学材料力学 -> 热流体控制 -> 设计制造/机器人/能源分流。' },
      { title: '真实工作对象', body: 'CAD 图、仿真、原型、测试、工艺路线和设计评审。' },
      { title: '毕业去向', body: '产品设计、CAE、制造工艺、机器人自动化、热能源系统。' },
    ],
    foundationIntro: '基础内容从工程表达、材料、静动力学、固体力学、热力学、流体和传热入口建立机械系统语言。',
    coreIntro: '专业内容进入固体热流体控制、设计制造、验证确认、数字孪生、增材制造和机器人。',
    foundationCourses: [
      { id: 'mech-drawing-material-programming', title: '工程图学、材料与编程', subtitle: '想法如何变成工程表达', intro: '让学生早期接触图纸、材料、测量和数值计算。', topics: ['工程图和投影', 'CAD 建模', '材料性质', 'Python/MATLAB', '测量和数据'], task: '画一个零件并做材料选择', tags: ['CAD', '材料', '测量'] },
      { id: 'mech-statics-dynamics-solid', title: '静力学、动力学与固体力学', subtitle: '结构为什么站得住', intro: '从受力、约束、应力、变形、振动和疲劳进入力学。', topics: ['受力分析', '约束和反力', '应力应变', '梁和轴', '振动和疲劳'], task: '对零件做手算加 FEA 对照', tags: ['静力学', '固体力学', 'FEA'] },
      { id: 'mech-thermo-fluid-heat', title: '热力学、流体与传热入口', subtitle: '热和流体如何限制机器', intro: '连接能量守恒、流动、换热、泵阀和电子散热。', topics: ['热力学第一定律', '流体阻力', '泵和管路', '传热', '热管理'], task: '估算一个散热系统', tags: ['热力学', '流体', '传热'] },
    ],
    coreCourses: [
      { id: 'mech-solid-thermal-control', title: '固体、热流体与控制系统', subtitle: '机器如何稳定可靠', intro: '把力、热和反馈控制放进同一个机械系统。', topics: ['有限元直觉', 'CFD 边界条件', '传感器反馈', '控制稳定性', '试验对标'], task: '做一个控制/热/结构综合分析', tags: ['FEA', 'CFD', '控制'] },
      { id: 'mech-design-manufacturing-vv', title: '设计制造与 V&V', subtitle: '能设计不等于能量产', intro: '从 DFM、GD&T、工艺、质量、成本和验证讲产品落地。', topics: ['设计需求', 'GD&T', '加工工艺', '质量控制', 'V&V 和设计评审'], task: '输出设计评审包', tags: ['DFM', 'GD&T', 'V&V'] },
      { id: 'mech-digital-twin-am-robotics', title: '数字孪生、增材制造与机器人', subtitle: '前沿机械系统', intro: '引入 digital twin、AM-Bench、ROS2、可持续制造和可靠性。', topics: ['数字孪生分层', 'AM 工艺窗口', '拓扑优化', 'ROS2 机器人', 'LCA 与可持续制造'], task: 'AM 件仿真-实测对照或 ROS2 项目', tags: ['数字孪生', 'AM', 'ROS2'] },
    ],
    branches: [
      { id: 'mech-product-cae', title: '产品设计与 CAE', fit: '喜欢实物、力学和验证', topics: ['机械设计', 'CAE/V&V'], frontier: 'CAD/CAE/PLM、model calibration', project: '设计评审包', roles: ['设计工程师', 'CAE 工程师'] },
      { id: 'mech-robotics-automation', title: '机器人与自动化', fit: '喜欢机电软件交叉', topics: ['机器人系统', '机电控制'], frontier: 'ROS2、sensors、PLC boundary', project: 'pick-and-place sim', roles: ['机器人', '自动化'] },
      { id: 'mech-advanced-manufacturing', title: '先进制造与材料', fit: '喜欢工艺和质量', topics: ['增材制造', '制造质量工程'], frontier: 'ISO/ASTM AM、AM-Bench', project: '工艺窗口和质量报告', roles: ['制造', '工艺'] },
      { id: 'mech-thermal-energy', title: '热流体与能源系统', fit: '喜欢能量和系统效率', topics: ['热管理', '能源与流体系统'], frontier: 'electronics cooling、sustainable manufacturing', project: '换热/散热设计 memo', roles: ['热能源工程'] },
    ],
    careers: ['产品设计', 'CAE', '制造工艺', '机器人自动化', '热能源系统'],
  },
  'ee-u': {
    label: '电子电器',
    labelLong: '电子电器工程专业',
    en: 'Electrical and Electronic Engineering',
    accent: '#2563eb',
    icon: majorIcon('major-ee.svg'),
    intro: [
      '电子电器工程控制电能、信号、信息和硬件系统。仿真正确的电路，落到 PCB、仪器和电磁环境中仍可能失败。',
      '体验会从电路、信号、逻辑、嵌入式、电磁和功率进入电子通信、控制、PCB、EMC 和硬件测试分流。',
    ],
    overviewCards: [
      { title: '电子电器学什么', body: '控制电能、信号、信息和硬件系统。' },
      { title: '四年课程地图', body: '电路信号 -> 电子/通信/控制/电力 -> PCB/嵌入式/RF 分流。' },
      { title: '真实工作对象', body: '原理图、PCB、固件、仪器波形、功率系统和测试记录。' },
      { title: '毕业去向', body: '硬件、嵌入式、通信、功率电子、测试、RF/高速板级。' },
    ],
    foundationIntro: '基础内容从 KCL/KVL、波形、频域、逻辑、MCU、电磁、功率和安全建立 EE 系统入口。',
    coreIntro: '专业内容进入模拟/数字电子、通信、控制、嵌入式、功率系统、PCB、EMC 和高速硬件。',
    foundationCourses: [
      { id: 'ee-circuit-measurement-signal', title: '电路、测量与信号', subtitle: '波形如何表达信息和能量', intro: '从 KCL/KVL、频域、滤波、采样和仪器测量建立入口。', topics: ['电压电流功率', '一阶/二阶电路', '频域和滤波', '采样', '示波器和误差'], task: 'SPICE + 实测波形报告', tags: ['电路', '信号', '测量'] },
      { id: 'ee-digital-embedded', title: '数字逻辑、编程与嵌入式入口', subtitle: '逻辑如何控制设备', intro: '连接布尔逻辑、时序、MCU、C/C++、接口和调试。', topics: ['组合逻辑', '时序逻辑', 'MCU', '传感器接口', '调试日志'], task: '做一个传感器 MCU 小系统', tags: ['数字逻辑', 'MCU', '调试'] },
      { id: 'ee-em-power-safety', title: '电磁、功率与安全', subtitle: '看不见的场和真实能量', intro: '讲电磁场、传输、EMI、功率变换、电机和安全。', topics: ['电场磁场', '传输线直觉', 'EMI', 'DC-DC', '电机和高压安全'], task: '设计一个低压功率转换小实验', tags: ['电磁', '功率', '安全'] },
    ],
    coreCourses: [
      { id: 'ee-analog-digital-comm', title: '模拟/数字电子与通信', subtitle: '信号如何被放大、采集和传输', intro: '覆盖放大器、滤波、ADC/DAC、调制、编码和噪声。', topics: ['放大器', '滤波器', 'ADC/DAC', '调制编码', '通信链路预算'], task: '搭建简化通信链路', tags: ['模拟电子', '通信', '噪声'] },
      { id: 'ee-control-embedded-power', title: '控制、嵌入式与功率系统', subtitle: '算法如何驱动真实能量', intro: '把控制算法、固件、电机和功率电路放进闭环。', topics: ['PID/状态空间', 'RTOS', '电机控制', '逆变器', '热和安全'], task: 'motor control bench', tags: ['控制', 'RTOS', '电机'] },
      { id: 'ee-pcb-emc-high-speed', title: 'PCB、EMC 与高速硬件', subtitle: '从原理图到可制造板卡', intro: '进入 PCB layout、SI/PI、EMI/EMC、BOM、测试点和 DFM。', topics: ['原理图', '布局布线', '阻抗和 SI', '电源完整性', '制造文件'], task: '输出 KiCad/Altium board package', tags: ['PCB', 'EMC', 'SI/PI'] },
    ],
    branches: [
      { id: 'ee-embedded-control', title: '嵌入式与控制', fit: '喜欢设备和实时调试', topics: ['嵌入式系统', '控制工程'], frontier: 'RTOS、HIL、edge AI hardware', project: '电机/传感器闭环项目', roles: ['嵌入式', '控制'] },
      { id: 'ee-dsp-rf', title: '通信、DSP 与 RF', fit: '喜欢信号和频域', topics: ['数字信号处理', 'RF/通信系统'], frontier: 'SDR、antenna、5G/6G context', project: '通信链路实验', roles: ['通信', 'DSP', 'RF'] },
      { id: 'ee-power-energy', title: '功率电子与能源', fit: '喜欢能量转换和安全', topics: ['功率电子', '电力系统与可再生能源'], frontier: 'inverter、grid integration', project: 'DC-DC/逆变器设计 memo', roles: ['电力', '能源'] },
      { id: 'ee-board-test', title: '板级硬件与测试', fit: '喜欢从电路到产品', topics: ['高速 PCB', 'EMC/测试工程'], frontier: 'SI/PI、DFM、Altium/KiCad', project: 'PCB 调试和制造包', roles: ['硬件', '测试工程'] },
    ],
    careers: ['硬件工程', '嵌入式', '通信', '功率电子', '测试/RF'],
  },
  'ic-u': {
    label: '集成电路',
    labelLong: '集成电路专业',
    en: 'Integrated Circuit',
    accent: '#7c3aed',
    icon: majorIcon('major-ic.svg'),
    intro: [
      '集成电路从半导体器件到可制造、可验证、可封装的芯片系统。一次流片失败会把物理、电路、系统、验证和制造约束全部暴露出来。',
      '体验会从器件、数字逻辑、Linux/EDA 协作进入模拟数字 IC、验证、物理设计、制造封装和 AI 芯片方向。',
    ],
    overviewCards: [
      { title: '集成电路学什么', body: '从半导体器件到可制造、可验证、可封装的芯片系统。' },
      { title: '四年课程地图', body: '器件电路数字逻辑 -> RTL/验证/后端 -> 制造封装/AI芯片分流。' },
      { title: '真实工作对象', body: 'SPICE、RTL、testbench、STA、版图、工艺、良率和封装约束。' },
      { title: '毕业去向', body: '前端设计、验证、后端、模拟/RF、工艺良率、封装、AI芯片。' },
    ],
    foundationIntro: '基础内容从半导体物理、器件、数字逻辑、计算机组成和 EDA 工程协作建立芯片项目语言。',
    coreIntro: '专业内容进入模拟/数字 IC、体系结构、验证、DFT、物理设计、制造良率、先进封装和 AI 加速器。',
    foundationCourses: [
      { id: 'ic-semiconductor-device', title: '半导体物理与器件', subtitle: '晶体管为什么能工作', intro: '从 PN 结、MOS、CMOS、载流子和器件曲线进入芯片物理。', topics: ['半导体能带', 'PN 结', 'MOS 电容', 'MOSFET', 'CMOS 反相器'], task: '用 SPICE 解释器件曲线', tags: ['半导体', '器件', 'SPICE'] },
      { id: 'ic-digital-logic-architecture', title: '数字逻辑与计算机组成', subtitle: '逻辑门如何执行程序', intro: '连接组合/时序逻辑、FSM、流水线、存储和 ISA。', topics: ['组合逻辑', '触发器和时钟', 'FSM', '流水线', '存储层次'], task: 'FPGA/RTL 实现小模块', tags: ['数字逻辑', 'RTL', 'FPGA'] },
      { id: 'ic-linux-script-eda', title: 'Linux、脚本与 EDA 工程协作', subtitle: '芯片项目如何被自动化', intro: '训练 shell、Python/Tcl、版本控制、EDA 数据流和检查。', topics: ['Linux shell', 'Python/Tcl', '版本控制', '文件格式', '自动化检查'], task: '写脚本检查 RTL/约束文件', tags: ['Linux', 'Tcl', 'EDA'] },
    ],
    coreCourses: [
      { id: 'ic-analog-digital-architecture', title: '模拟/数字 IC 与体系结构', subtitle: 'PPA 权衡如何出现', intro: '连接 CMOS、电路、时序、功耗、存储和 interconnect。', topics: ['CMOS 逻辑', '时序和功耗', '模拟放大器', '片上互连', '体系结构和 PPA'], task: '设计并分析一个小 IP', tags: ['PPA', 'CMOS', '体系结构'] },
      { id: 'ic-verification-dft-physical', title: '验证、DFT 与物理设计', subtitle: '流片前如何证明足够正确', intro: '覆盖 SystemVerilog、UVM、coverage、formal、scan、STA、floorplan、DRC/LVS。', topics: ['testbench', 'coverage', 'UVM-lite', 'DFT/scan', 'RTL-to-GDSII'], task: '通过仿真覆盖和 OpenROAD flow', tags: ['验证', 'DFT', '后端'] },
      { id: 'ic-manufacturing-packaging-ai', title: '制造、良率、封装与 AI 加速器', subtitle: '芯片离产品还有多远', intro: '进入工艺、良率、失效、2.5D/3D、chiplet、UCIe、AI accelerator、MLPerf。', topics: ['光刻刻蚀沉积', '良率', '先进封装', 'chiplet/UCIe', 'AI 加速器数据流'], task: 'chiplet/accelerator PPA 和封装 tradeoff', tags: ['制造', '封装', 'AI 加速器'] },
    ],
    branches: [
      { id: 'ic-front-verification', title: '前端设计与验证', fit: '喜欢数字系统和找 bug', topics: ['RTL 设计', '验证方法学'], frontier: 'SystemVerilog、UVM、formal', project: 'verified IP block', roles: ['RTL 工程师', '验证工程师'] },
      { id: 'ic-backend-eda', title: '后端物理设计与 EDA', fit: '喜欢版图、约束和自动化', topics: ['物理设计', 'EDA 自动化'], frontier: 'OpenROAD、STA、DRC/LVS', project: 'RTL-to-GDS flow', roles: ['后端', 'EDA'] },
      { id: 'ic-analog-rf-device', title: '模拟/RF 与器件', fit: '喜欢连续信号和器件物理', topics: ['模拟 IC', 'RF/器件建模'], frontier: 'SPICE、noise、PVT', project: '放大器/PLL 级别分析', roles: ['模拟/RF', '器件'] },
      { id: 'ic-packaging-ai-chip', title: '制造封装与 AI 芯片', fit: '喜欢产业链和系统级权衡', topics: ['先进封装', 'AI 加速器'], frontier: 'IRDS、HIR、UCIe、MLPerf', project: 'packaging/yield/accelerator tradeoff', roles: ['工艺', '封装', 'AI芯片'] },
    ],
    careers: ['前端设计', '验证', '后端', '模拟/RF', '工艺封装', 'AI芯片'],
  },
}

function buildInteraction(major, course, level) {
  return {
    title: `${course.title}任务台`,
    level,
    goal: `围绕“${course.task}”完成${major.label}专业的对象识别、方法选择和证据说明。`,
    inputs: [course.subtitle].concat(course.topics.slice(0, 3)),
    actions: ['界定对象与约束', '选择模型或工具', '检查证据与误差', '写出可复核结论'],
    feedback: ['概念层级混淆', '忽略前提或边界', '证据链不完整', '把工具结果当最终结论'],
    output: course.task,
  }
}

function buildCourseArticle(major, course, level) {
  const firstTopics = course.topics.slice(0, 2).join('、')
  const middleTopics = course.topics.slice(2, 4).join('、')
  const finalTopic = course.topics[4] || course.topics[course.topics.length - 1] || course.title

  return {
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    summary: course.intro,
    tags: course.tags || course.topics.slice(0, 3),
    formula: course.topics.slice(0, 3).join(' -> '),
    sections: [
      {
        title: `课程大纲：${course.subtitle}`,
        paragraphs: [
          course.intro,
          `本页把这门课拆成 ${course.topics.join('、')} 等页面槽位，先用于专业体验的结构化导览，后续正文阶段再扩展为完整文章。`,
        ],
      },
      {
        title: `核心内容一：${firstTopics}`,
        paragraphs: [
          `${course.title}首先处理 ${firstTopics}。这些内容决定学生如何命名对象、识别变量，并把直觉问题转成可操作的专业语言。`,
          `在${major.labelLong}里，基础概念不能只停留在术语记忆，而要进入对象、条件和证据之间的关系。`,
        ],
      },
      {
        title: `核心内容二：${middleTopics}`,
        paragraphs: [
          `${middleTopics}把课程从概念推进到方法。学生需要选择模型、算法、实验、数据或制度框架，并说明为什么这种方法适合当前问题。`,
          '这一层也是常见误判最多的地方：工具看起来能给出结果，但结果是否可信取决于前提、尺度、误差和验证方式。',
        ],
      },
      {
        title: `核心内容三：${finalTopic}`,
        paragraphs: [
          `${finalTopic}负责把前面的判断收束成可检查产出。它要求学生说明边界，而不是只给出漂亮答案。`,
          `对应体验任务是：${course.task}。这个任务把课程知识转成一个接近真实学习或职业场景的小型交付物。`,
        ],
      },
      {
        title: '应用与总结：从课程到专业判断',
        paragraphs: [
          `${course.title}在课程体系中的作用，是帮助学生判断自己是否愿意长期处理${(course.tags || course.topics.slice(0, 3)).join('、')}这一类对象。`,
          `完成本页后，学生应该能说清楚这门课的输入、动作、错误反馈和输出，而不只是记住“${course.title}”这个名字。`,
        ],
      },
    ],
    interaction: buildInteraction(major, course, level),
  }
}

function buildChallenge(major, course) {
  const interaction = buildInteraction(major, course, 'L2/L3 核心/进阶课程')
  return {
    id: course.id,
    title: `${course.title}：${course.subtitle}`,
    badge: '核心/进阶课程',
    course: course.title,
    description: course.intro,
    interaction,
    errorTypes: ['对象定义不清', '前提与边界未说明', '证据或数据不足', '工具输出缺少复核'],
  }
}

function splitChallengeTitle(title) {
  const index = title.indexOf('：')
  if (index < 0) return { courseTitle: title, focus: title }
  return {
    courseTitle: title.slice(0, index),
    focus: title.slice(index + 1),
  }
}

function buildDeepDiveArticle(challenge) {
  const parts = splitChallengeTitle(challenge.title)
  const inputText = challenge.interaction.inputs.join('、')
  const actionText = challenge.interaction.actions.join('、')
  const feedbackText = challenge.interaction.feedback.join('、')

  return {
    id: challenge.id,
    title: parts.courseTitle,
    subtitle: `${challenge.badge}：${parts.focus}`,
    summary: `${challenge.description} 这门课的核心不是记住结论，而是把${challenge.interaction.inputs.slice(0, 3).join('、')}放进同一个问题框架，再用${challenge.interaction.actions.slice(0, 3).join('、')}检验结论是否成立。`,
    tags: [challenge.course, challenge.badge, challenge.interaction.level],
    formula: challenge.interaction.title,
    sections: [
      {
        title: '课程大纲：为什么进入这门课',
        paragraphs: [
          challenge.description,
          `${challenge.course}关心的是对象、约束和结论之间的稳定关系。条件稍有变化，模型、算法或实验读数就可能改变，因此必须先把问题对象整理清楚。`,
        ],
      },
      {
        title: '核心内容一：输入对象如何组织',
        paragraphs: [
          `${inputText}不是孤立资料，而是同一套判断的不同入口。先分清哪些是条件、哪些是变量、哪些是约束，才能知道后面的计算或推理从哪里开始。`,
          `在${challenge.course}里，输入对象的组织方式往往决定了后续结论的可靠性。对象选错，后面即使步骤完整，也只是在错误问题上推演。`,
        ],
      },
      {
        title: '核心内容二：专业动作如何推进',
        paragraphs: [
          `完成任务时需要依次${actionText}。这些动作形成一条可复核的工作链：每一步都要说明依据、假设和下一步为什么成立。`,
          `${challenge.course}的训练重点就在这条工作链里。先处理局部对象，再合成整体判断；先确认条件，再解释结果边界。`,
        ],
      },
      {
        title: '核心内容三：错误反馈如何定位问题',
        paragraphs: [
          `典型错误包括：${feedbackText}。这些错误不是扣分标签，而是指出专业动作在哪一步出现了断点。`,
          '同样的结论错误，可能来自对象选错、条件漏掉、单位或维度不一致，也可能来自把局部经验误当成普遍规律。真正的专业训练要能区分这些来源。',
        ],
      },
      {
        title: '应用与总结：怎样判断自己适不适合继续深入',
        paragraphs: [
          `${challenge.interaction.output}把这门课的判断过程压缩成一份可复核记录：条件是什么，动作如何推进，结果在什么范围内可信。`,
          `${challenge.course}继续深入后会不断遇到类似结构，只是对象更复杂、误差更隐蔽、结论边界更需要说明。`,
        ],
      },
    ],
    interaction: challenge.interaction,
  }
}

function buildBranchDirection(branch) {
  return {
    id: branch.id,
    title: branch.title,
    body: `${branch.fit}；代表项目是${branch.project}。`,
    fit: branch.fit,
    project: branch.project,
    roles: branch.roles || [],
    frontier: branch.frontier,
    tags: [branch.frontier].concat(branch.roles || []),
    topics: branch.topics.map((topicTitle, index) => ({
      id: `${branch.id}-${index + 1}`,
      title: topicTitle,
      subtitle: `${branch.title}方向代表专题 ${index + 1}：${branch.fit}`,
      sections: [
        {
          title: `专题入口：${topicTitle}`,
          paragraphs: [
            `${topicTitle}把“${branch.fit}”转成一个可体验的方向专题。学生需要先识别问题对象，再判断哪些理论、数据、工具或工程约束会影响结论。`,
            `这一方向的前沿和工具线索包括：${branch.frontier}。它们是理解行业变化的入口，但不能替代基础概念和可复核判断。`,
            `在进入具体任务前，建议先回顾基础课程与深度课程里与${topicTitle}相关的输入对象、专业动作和错误反馈。`,
          ],
        },
        {
          title: `核心判断：问题对象与约束`,
          paragraphs: [
            `专题 ${index + 1} 的核心，是把${topicTitle}从“感兴趣的话题”变成“可验证的问题”。这意味着必须写清楚对象、边界、证据来源和失败模式。`,
            `${branch.fit} 的训练重点，是让学生知道什么时候该继续深入，什么时候该停止外推。`,
          ],
        },
        {
          title: `核心判断：${branch.project}`,
          paragraphs: [
            `代表项目是“${branch.project}”。它要求学生把专题知识转成可检查的交付物，并记录输入、动作、风险和结论边界。`,
            `目标角色包括：${(branch.roles || []).join('、')}。这些去向说明该方向长期处理的问题类型，而不是简单岗位清单。`,
          ],
        },
        {
          title: '专业动作：从分析到交付',
          paragraphs: [
            `完成专题时需要依次：界定方向问题、选择理论或工具、验证边界条件、形成职业化产出。`,
            `每一步都要能回答“依据是什么、假设是什么、如果条件变化结论是否仍成立”。`,
          ],
        },
        {
          title: '应用与总结：是否继续深入该方向',
          paragraphs: [
            `完成 ${topicTitle} 专题后，应能说明自己是否愿意长期处理${branch.fit}这类问题，以及还缺哪些基础能力。`,
            `如果愿意继续，下一步通常是参与更完整的项目、实习或研究训练，而不是只记住工具名称。`,
          ],
        },
      ],
      interaction: {
        title: `${topicTitle}项目台`,
        level: '方向专题',
        goal: `围绕“${branch.project}”完成方向专题判断。`,
        inputs: [branch.fit, branch.frontier, branch.project].concat((branch.roles || []).slice(0, 2)),
        actions: ['界定方向问题', '选择理论或工具', '验证边界条件', '形成职业化产出'],
        feedback: ['只追工具名', '忽略基础课程前提', '项目产出无法复核', '职业角色理解过窄'],
        output: branch.project,
      },
    })),
  }
}

function buildMajorSpeedTemplate(blueprint) {
  const foundationArticles = blueprint.foundationCourses
    .map((course) => buildCourseArticle(blueprint, course, 'L1/L2 基础课程'))
    .map((article) => enrichCourseArticle({ ...article, sections: appendCourseReadingDepth(article.id, article.sections) }))
  const deepDiveChallenges = blueprint.coreCourses.map((course) => buildChallenge(blueprint, course))
  const deepDiveArticles = deepDiveChallenges
    .map((challenge) => buildDeepDiveArticle(challenge))
    .map((article) => enrichCourseArticle({ ...article, sections: appendCourseReadingDepth(article.id, article.sections) }))
  const branchDirections = blueprint.branches.map((branch) => buildBranchDirection(branch))
  const topicCount = branchDirections.reduce((total, branch) => total + branch.topics.length, 0)

  return Object.assign({}, blueprint, {
    methodLoop: ['专业认知', '基础内容', '专业内容', '方向分流', '项目/职业任务'],
    foundationArticles,
    deepDiveChallenges,
    deepDiveArticles,
    branchDirections,
    taskSummary: {
      foundationCount: foundationArticles.length,
      coreCount: deepDiveChallenges.length,
      branchCount: branchDirections.length,
      topicCount,
      careerCount: blueprint.careers.length,
    },
  })
}

export function getMajorSpeedTemplate(majorId) {
  const blueprint = MAJOR_SPEED_TEMPLATES[majorId]
  return blueprint ? buildMajorSpeedTemplate(blueprint) : null
}

export function hasMajorSpeedTemplate(majorId) {
  return Boolean(MAJOR_SPEED_TEMPLATES[majorId])
}
