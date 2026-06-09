/** 数学家职业模拟内容（与 Web CareerMathematicianExperience 对齐） */

import { asset } from '../utils/asset-map'

const indexTone = {
  blue: { bg: '#e8f3ff', color: '#2f6bff' },
  teal: { bg: '#ecfbf7', color: '#087a64' },
  orange: { bg: '#fff4e7', color: '#b66a12' },
  purple: { bg: '#f2efff', color: '#6d55d8' },
}

function card(index, title, body, imageSrc, tone = 'blue') {
  return {
    index,
    title,
    body,
    imageSrc: asset(imageSrc),
    tone,
    toneStyle: indexTone[tone] || indexTone.blue,
  }
}

export const CAREER_MATHEMATICIAN_ACCENT = '#00a889'
export const CAREER_MATHEMATICIAN_GRADIENT = 'linear-gradient(90deg, #00a889 0%, #1cb0f6 100%)'

export const CAREER_MATHEMATICIAN_STAGES = [
  { key: 'overview', label: '职业概览', description: '理解数学家的工作边界与产出。' },
  { key: 'research', label: '研究任务', description: '拆解问题、猜想与证明流程。' },
  { key: 'scenario', label: '情境模拟', description: '进入研究情境，选择任务路线。' },
  { key: 'growth', label: '成长路径', description: '认识训练周期与能力结构。' },
  { key: 'reflection', label: '体验记录', description: '汇总职业适配度与下一步。' },
]

export const CAREER_WELCOME_CARDS = [
  card(
    '01',
    '认识数学家的工作对象',
    '数学家面对的不是一组现成题目，而是尚未被说清楚的结构、关系和规律。第一步会先理解职业边界：哪些问题值得研究，哪些表述还不够精确，最终产出为什么通常是命题、证明、模型和论文。',
    '/images/careers/simulation-mathematician.png',
    'blue',
  ),
  card(
    '02',
    '拆解研究流程',
    '研究不会从完整证明开始。你会先读文献、找例子、观察边界，再把直觉压缩成猜想。模拟器会把这种来回迭代的过程拆开，让你看到数学研究怎样从模糊问题走向可检查的推理。',
    '/design/math-speed/generated/math-logic-article-proof-bw-v2.png',
    'teal',
  ),
  card(
    '03',
    '进入职业情境任务',
    '你将扮演研究者处理一个图结构猜想：先找反例、先证明特殊情形，还是先查文献。不同选择没有绝对对错，关键在于看见自己更习惯哪一种研究节奏和风险判断。',
    '/images/explore/discover/career-simulation/scenario-to-task.png',
    'orange',
  ),
  card(
    '04',
    '形成适配判断',
    '最后会把本轮体验整理成职业偏好线索：你是否愿意长时间面对不确定问题，是否喜欢把直觉改写成严谨表达，以及是否能接受证明失败后的反复调整。',
    '/images/explore/discover/career-simulation/choice-to-fit.png',
    'purple',
  ),
]

export const CAREER_OVERVIEW_CARDS = [
  card(
    '01',
    '核心产出：定理、证明、模型、论文',
    '数学家的产出通常不是一个马上上线的产品，而是一套可被他人检查和复用的判断。定理说明结论，证明说明为什么成立，模型说明现实或抽象对象怎样被表达，论文则把背景、方法和边界完整记录下来。',
    '/design/math-speed/generated/math-analysis-article-macro-bw-v2.png',
    'blue',
  ),
  card(
    '02',
    '工作对象：抽象结构和不确定性',
    '不同数学家研究的对象差异很大：有人研究代数结构、空间形状和逻辑系统，有人研究概率、统计、优化和计算方法。共同点是把对象定义清楚，并判断哪些结论在这些定义下真正成立。',
    '/design/math-speed/generated/math-algebra-article-structure-bw-v3.png',
    'teal',
  ),
  card(
    '03',
    '协作方式：讨论、研讨班、同行评审',
    '数学研究经常看起来很个人，但它离不开高密度交流。一次讨论可能暴露定义漏洞，一次研讨班报告可能让证明改写，同行评审则会检查结论是否清楚、假设是否完整、引用是否可靠。',
    '/images/explore/discover/career-simulation/role-to-career.png',
    'orange',
  ),
  card(
    '04',
    '典型节奏：长周期探索，短周期汇报',
    '一个问题可能推进数月甚至数年，但研究者仍需要阶段性记录进展：今天排除了哪些反例，哪条路线卡住了，哪个特殊情形已经成立。职业体验会刻意保留这种慢变量和短反馈并存的节奏。',
    '/design/math-speed/generated/math-intro-home-network-v5.png',
    'purple',
  ),
]

export const RESEARCH_WORKFLOW_CARDS = [
  card(
    '01',
    '读文献：确认问题站在哪里',
    '开始研究前，需要先确认问题是否已经被解决、相关概念叫什么、哪些工具可以直接复用。读文献不是被动摘抄，而是把自己的问题放进已有知识网络中定位。',
    '/design/math-speed/generated/math-logic-article-set-bw-v2.png',
    'blue',
  ),
  card(
    '02',
    '找例子：从小对象观察边界',
    '很多猜想先从简单对象开始检验。小例子能帮助研究者看见规律，也能快速暴露条件是否过强。若一个反例出现，问题并没有失败，而是定义需要被重新校准。',
    '/design/math-speed/generated/math-algebra-article-group-symmetry-bw-v3.png',
    'teal',
  ),
  card(
    '03',
    '写草稿：把直觉变成命题',
    '草稿阶段会把“我觉得可能成立”改写成可检查的命题：前提是什么，结论是什么，关键步骤依赖哪个工具。数学训练最核心的一部分，就是让每个词承担明确责任。',
    '/design/math-speed/generated/math-analysis-proof-sort-continuity-bw-v1.png',
    'orange',
  ),
  card(
    '04',
    '做汇报：让推理接受压力测试',
    '研讨班和导师讨论会把证明放到压力下检查。别人追问的往往不是答案是否好看，而是定义是否充分、例子是否覆盖边界、结论是否还有更自然的表达方式。',
    '/design/math-speed/generated/math-intro-card-career-v3.png',
    'purple',
  ),
]

export const GROWTH_PATH_CARDS = [
  card(
    '01',
    '本科阶段：建立基础语言',
    '数学分析、高等代数、几何、概率和计算课程会先训练定义、证明和抽象表达。这个阶段的关键不是学完多少公式，而是能否把问题写成别人可以检查的语言。',
    '/design/math-speed/generated/math-intro-home-curriculum-v5.png',
    'blue',
  ),
  card(
    '02',
    '研究训练：读论文和做讨论班',
    '进入研究训练后，任务会从标准习题转向开放问题。你需要学会读论文、复现证明、整理问题背景，并在讨论班中用清楚的语言解释自己的理解。',
    '/design/math-speed/generated/math-analysis-article-map-bw-v2.png',
    'teal',
  ),
  card(
    '03',
    '研究生阶段：围绕方向长期推进',
    '研究生阶段通常会选择更窄的方向，围绕一个问题长期推进。你需要接受进展不均匀的现实：有时几周只有一个反例，有时一次讨论会改变整条路线。',
    '/design/math-speed/generated/math-branch-basic-card-v2.png',
    'orange',
  ),
  card(
    '04',
    '职业发展：研究、教育与产业研究',
    '数学训练可以走向高校和研究所，也可以延展到量化、算法、建模、统计和工程计算。区别不只在行业名称，而在你更愿意证明结构、解释知识，还是把模型推进到现实决策里。',
    '/images/explore/discover/career-simulation/role-to-career.png',
    'purple',
  ),
]

export const REFLECTION_CARDS = [
  card(
    '01',
    '适配信号：能和不确定性长期相处',
    '如果你愿意长时间面对没有标准答案的问题，能接受证明失败后反复调整路线，并且享受把模糊直觉改写成严谨表达，这通常是继续了解数学研究的积极信号。',
    '/images/explore/discover/career-simulation/choice-to-fit.png',
    'blue',
  ),
  card(
    '02',
    '需要适应：慢反馈和高精度表达',
    '数学研究的反馈常常很慢，而且对表达精度要求很高。一个词、一个量词、一个条件范围都可能改变结论。若你更偏好即时产出，需要提前判断自己是否能适应这种节奏。',
    '/design/math-speed/generated/math-logic-article-quantifier-bw-v2.png',
    'teal',
  ),
  card(
    '03',
    '下一步：回到数学专业分流',
    '建议继续比较基础数学、应用数学、计算数学、统计和金融数学等方向。它们都使用数学语言，但工作对象、证明强度、计算比例和现实连接方式并不相同。',
    '/design/math-speed/generated/math-branching-start-v1.png',
    'orange',
  ),
]

export const SCENARIO_BRIEF_CARD = card(
  '01',
  '判断一个图结构猜想是否值得继续推进',
  '你观察到一类网络结构似乎总能被拆成若干个稳定子结构。现在需要决定：先找反例、先证明特殊情形，还是先查阅相关文献。你的选择会影响研究路线，也会反映你处理不确定问题的习惯。',
  '/images/explore/discover/career-simulation/scenario-to-task.png',
  'blue',
)

export const SCENARIO_BRIEF_TAGS = ['已有例子不多', '定义还不够精确', '可能连接图论与代数']

export const SCENARIO_ROUTE_OPTIONS = [
  {
    id: 'counterexample',
    title: '先找反例',
    body: '用小规模对象快速检验猜想是否过强。',
    feedback: '你选择了先降低风险。数学研究里，反例不是失败，而是快速发现条件边界的工具；这条路线适合先检验命题是否需要改写。',
    badge: '搜',
  },
  {
    id: 'special-case',
    title: '证明特殊情形',
    body: '把条件收窄，先建立一个可控版本。',
    feedback: '你选择了先推进可证明版本。这说明你倾向把开放问题拆成局部命题，用小范围结果建立信心，再逐步扩大条件。',
    badge: '证',
  },
  {
    id: 'literature',
    title: '查阅文献',
    body: '确认是否已有相近定理、术语或工具。',
    feedback: '你选择了先补足背景。真实研究中，这能减少重复工作，也能帮助你把自己的猜想放进已有定理网络中重新命名和定位。',
    badge: '读',
  },
]

export const CAREER_MATHEMATICIAN_PAGES = [
  {
    id: 'welcome',
    type: 'article',
    stageIndex: 0,
    title: '数学家职业模拟：欢迎',
    pageTitle: '数学家职业模拟',
    pageSubtitle: '沉浸式体验数学家一天的工作',
    lead: [
      '在充满古典色彩的幻想中，数学家似乎是一种醉心研究的世外高人形象。但事实上，数学科研仅包含数学家实际工作中的一部分。因为数学教授的社会身份除了科研工作者以外，还包含导师、教师等多个角色。因此他们的责任也不仅仅是完成科研任务。',
      '在学术会议上，一个数学家要向同行介绍自己的研究成果；并与大家广泛交换意见。在教室中，数学家要为本科生或是研究生讲授课程、测验教学成果。在他的闲暇时间，他可能要对自己亲自指导的博士生讨论论文进展。他也要处理一大堆行政琐事，例如申请基金、组织活动、提交材料......终于，在夜深人静的时刻，他可以抽开身纯粹的思考一些科研问题。',
      '你是否觉得这样的生活和你想象中数学家的生活有所差距？接下来本模拟器会带你以第一视角体验数学家真实的一天。',
    ],
    cards: CAREER_WELCOME_CARDS,
    nextStageOnLeave: false,
  },
  {
    id: 'overview',
    type: 'article',
    stageIndex: 0,
    title: '数学家职业模拟：职业概览',
    pageTitle: '职业概览：数学家在做什么',
    pageSubtitle: '先把职业轮廓拆成任务、产出、协作和节奏四个维度。',
    lead: ['数学家并不只有一种工作形态。纯数学更关注结构与证明，应用数学更关注模型与现实问题，计算数学、统计和数据科学则会把数学语言推进到算法与数据场景中。'],
    cards: CAREER_OVERVIEW_CARDS,
    nextStageOnLeave: true,
  },
  {
    id: 'workflow',
    type: 'article',
    stageIndex: 1,
    title: '数学家职业模拟：研究任务',
    pageTitle: '研究任务：从问题到证明',
    pageSubtitle: '数学家的任务流程不是线性的，常常在例子、猜想和证明之间来回迭代。',
    lead: ['这一阶段把“做研究”拆成四个可观察动作。它们经常循环出现：一个例子会迫使你回去读文献，一次汇报会让草稿重新定义问题。'],
    cards: RESEARCH_WORKFLOW_CARDS,
    nextStageOnLeave: true,
  },
  {
    id: 'scenario-brief',
    type: 'scenario-brief',
    stageIndex: 2,
    title: '数学家职业模拟：情境简报',
    pageTitle: '情境简报：一个猜想是否可靠',
    pageSubtitle: '你将扮演一名数学研究者，先判断研究路线，再决定下一步行动。',
    lead: ['这类任务不会把你推向唯一标准答案。职业模拟关注的是研究判断：当证据还不充分时，你如何降低风险、怎样选择下一步、愿不愿意承认定义还需要被修正。'],
    briefCard: SCENARIO_BRIEF_CARD,
    briefTags: SCENARIO_BRIEF_TAGS,
    nextStageOnLeave: false,
  },
  {
    id: 'scenario-task',
    type: 'scenario-task',
    stageIndex: 2,
    title: '数学家职业模拟：情境任务',
    pageTitle: '情境任务：选择你的研究路线',
    pageSubtitle: '不同路线会形成不同研究记录，也会暴露你更习惯的思考方式。',
    lead: ['请从三条路线中选择一个第一步。这里不追求“猜中答案”，而是模拟真实研究里的取舍：快速排错、局部推进和补足背景，分别对应不同的风险控制方式。'],
    routeOptions: SCENARIO_ROUTE_OPTIONS,
    nextStageOnLeave: true,
  },
  {
    id: 'growth',
    type: 'article',
    stageIndex: 3,
    title: '数学家职业模拟：成长路径',
    pageTitle: '成长路径：数学家如何被训练出来',
    pageSubtitle: '这条路径强调长期积累，但也会通向很多交叉职业方向。',
    lead: ['数学家的训练不是一步到位，而是在基础课程、研究阅读、方向选择和真实问题推进中逐渐形成判断力。下面四个阶段对应不同的能力重心。'],
    cards: GROWTH_PATH_CARDS,
    nextStageOnLeave: true,
  },
  {
    id: 'reflection',
    type: 'article',
    stageIndex: 4,
    title: '数学家职业模拟：体验记录',
    pageTitle: '体验记录：适配度检查',
    pageSubtitle: '把本轮选择整理成职业偏好线索，帮助你判断是否愿意继续了解数学研究。',
    lead: ['这一页不是给出职业结论，而是把本轮体验转成可继续追踪的线索。你可以回到数学专业体验页，比较不同方向的内容强度和职业连接方式。'],
    cards: REFLECTION_CARDS,
    nextStageOnLeave: false,
    isFinal: true,
  },
]

export const CAREER_MATHEMATICIAN_STORAGE_KEY = 'uniprism.career.mathematician.stages'
