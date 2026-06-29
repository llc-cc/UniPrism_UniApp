import { api } from '../../../utils/api'

/** 与 Web `lib/math/mathMajorIntro.ts` 对齐的离线兜底数据 */
export const FALLBACK_MATH_MAJOR_INTRO = {
  title: '数学专业介绍',
  stageLabel: 'Part 1 · 专业画像',
  subtitle:
    '这一页只回答“数学专业到底在观察什么、有哪些方向”。下一阶段会进入数学分析和线性代数的数学课程介绍。',
  video: {
    src: '/videos/math-major/math-overview.mp4',
    title: '数学专业总览',
    poster: '/design/math-speed/generated/math-intro-home-curriculum-v5.png',
  },
  sections: [
    {
      paragraphs: [
        '理学院数学专业并不只是刷题和算答案。它更像是一套理解世界的语言，研究数量之间的关系、空间的形状、系统怎样变化、不确定性如何描述，以及一个结论为什么可以被严格相信。',
        '数学一边离现实很远，一边又深深嵌在现实世界里。通信、导航、建筑、金融、人工智能、医学影像、天气预报等领域，背后都离不开数学模型。你在课本里看到的对象，可能先是抽象结构，之后才会变成算法、理论或工程工具的一部分。',
      ],
      figure: {
        id: 'MATH-INTRO-01',
        title: '数学进入真实世界',
        src: '/design/math-speed/generated/math-major-intro/math-intro-01-real-world.png',
        alt: '导航、医学影像、结构、金融和智能任务被数学草稿连接的数学专业总览插图',
      },
    },
    {
      title: '本科数学会先训练什么',
      paragraphs: [
        '本科阶段通常会从几门核心课程开始。数学分析训练你理解连续变化、极限、导数和积分；高等代数或线性代数训练你用向量、矩阵和空间看待关系；概率统计帮助你在不确定的数据中判断证据；抽象代数、拓扑、微分方程、数值计算等课程，则会把你带向更细的方向。',
        '这个过程不只是学知识，而是在训练一种思维：面对复杂问题，先找到结构，提出假设，再用严格推理或可复核计算去验证。数学专业内部大致可以分出几个常见方向。',
      ],
    },
    {
      title: '基础数学',
      paragraphs: [
        '基础数学更关注数学结构本身。它不急着解决工程问题，而是追问概念之间的关系、命题成立的条件、理论体系的边界。数论、代数、几何、拓扑、分析、逻辑与集合论，都属于基础数学的重要领域。',
        '走这条路的人，需要长期面对抽象问题，愿意为一个定义、一个反例、一条证明链反复推敲。它的反馈往往很慢，但也最接近数学本身的核心气质。',
      ],
      figure: {
        id: 'MATH-INTRO-02',
        title: '基础数学：证明链被反例检查',
        src: '/design/math-speed/generated/math-major-intro/math-intro-02-proof-chain.png',
        alt: '定义卡、假设卡、证明链和反例卡相互核对的基础数学插图',
      },
    },
    {
      title: '应用数学',
      paragraphs: [
        '应用数学更像站在现实和理论之间的翻译者。现实不会把问题整理成课本题交给你。桥梁振动、疫情传播、交通调度、神经网络训练、能源系统优化，都会带来混乱的数据、约束和风险。',
        '应用数学要做的，是把这些现象转化成变量、方程、目标函数和模型，再把模型结论翻译回现实决策。它不比基础数学低一层，只是驱动力不同：基础数学向内追问结构，应用数学向外触碰真实系统。',
      ],
      figure: {
        id: 'MATH-INTRO-03',
        title: '应用数学：桥梁振动被翻译成模型',
        src: '/design/math-speed/generated/math-major-intro/math-intro-03-applied-bridge.png',
        alt: '桥梁振动、风速箭头和模型草图相互连接的应用数学插图',
      },
    },
    {
      title: '计算数学',
      paragraphs: [
        '计算数学关心的是：模型有了以后，怎样真正算出来。很多方程在纸面上没有精确解，但工程师、医生、气象员和算法研究者不能等数学家慢慢解完。',
        '计算数学把连续世界离散化，用网格、矩阵、迭代、随机模拟等方法求近似解，同时研究误差、稳定性和收敛性。它要求你既懂数学推导，也愿意写代码、跑程序、看结果。',
      ],
      figure: {
        id: 'MATH-INTRO-04',
        title: '计算数学：连续曲面被切成可计算网格',
        src: '/design/math-speed/generated/math-major-intro/math-intro-04-computational-mesh.png',
        alt: '连续曲面被切成网格并进行误差检查的计算数学插图',
      },
    },
    {
      title: '统计学',
      paragraphs: [
        '统计学把目光放在不确定性上。一次实验、一组样本、一份调查、一批传感器数据，都可能带着随机波动。统计要判断的是：这个现象是真有规律，还是只是偶然？',
        '从经典实验到现代医学试验、A/B 测试、公共政策评估，统计都在帮助人们把“我觉得”变成“证据支持到什么程度”。它适合对数据敏感、愿意在有限信息中做谨慎判断的人。',
      ],
      figure: {
        id: 'MATH-INTRO-05',
        title: '统计：女士品茶实验的证据桌',
        src: '/design/math-speed/generated/math-major-intro/math-intro-05-statistics-tea.png',
        alt: '八个茶杯、随机基准和证据记录卡组成的统计实验插图',
      },
    },
    {
      title: '金融数学',
      paragraphs: [
        '金融数学关注的是风险、时间和不确定收益。期权定价、资产组合、利率模型、风险管理，听起来像金融问题，背后却离不开概率、随机过程、优化和数值计算。',
        '金融数学不是教人猜涨跌，而是研究在不确定价格路径下，一个合约应该怎样定价，一个策略会暴露什么尾部风险，极端情况下损失能不能被提前看见。',
      ],
      figure: {
        id: 'MATH-INTRO-06',
        title: '金融数学：期权合约旁的极端风险标记',
        src: '/design/math-speed/generated/math-major-intro/math-intro-06-financial-risk.png',
        alt: '期权合约、价格路径和尾部风险标记组成的金融数学插图',
      },
    },
    {
      title: '进入真实样本之前',
      paragraphs: [
        '所以，数学专业并不是单一路线。你可以向内走，进入更纯粹的理论；也可以向外走，把数学放进工程、计算、统计、金融或人工智能场景。真正需要提前判断的是：你是否愿意长期面对抽象对象，是否能接受慢反馈，是否享受把混乱问题整理成结构、条件和推理链。',
        '后面的课程介绍会把这种感觉拆成两个入口：数学分析会让你接触极限与连续，线性代数会让你看到空间和变换。读完这部分，你先获得的是专业画像；进入下一阶段，再选择更具体的方向继续体验。',
      ],
    },
  ],
}

function normalizeMajorIntroPayload(payload) {
  if (!payload || typeof payload !== 'object') return null
  const sections = Array.isArray(payload.sections) ? payload.sections : []
  if (!sections.length) return null
  return {
    title: payload.title || FALLBACK_MATH_MAJOR_INTRO.title,
    stageLabel: payload.stageLabel || FALLBACK_MATH_MAJOR_INTRO.stageLabel,
    subtitle: payload.subtitle || FALLBACK_MATH_MAJOR_INTRO.subtitle,
    video: {
      src: payload.video?.src || FALLBACK_MATH_MAJOR_INTRO.video.src,
      title: payload.video?.title || FALLBACK_MATH_MAJOR_INTRO.video.title,
      poster: payload.video?.poster || FALLBACK_MATH_MAJOR_INTRO.video.poster,
    },
    sections,
  }
}

export function applyMajorIntroContent(page, content) {
  if (!page || page.id !== 'major-intro-text' || !content) return page
  return {
    ...page,
    title: content.title,
    stageLabel: content.stageLabel,
    subtitle: content.subtitle,
    sections: content.sections,
    videoSrc: content.video.src,
    videoTitle: content.video.title,
    posterImage: content.video.poster,
  }
}

export function applyMajorIntroToPages(pages, content) {
  if (!Array.isArray(pages) || !content) return pages
  return pages.map((page) => applyMajorIntroContent(page, content))
}

/**
 * 从 Web API 拉取数学专业介绍；失败时使用本地兜底。
 * @returns {Promise<typeof FALLBACK_MATH_MAJOR_INTRO>}
 */
export async function loadMathMajorIntro() {
  try {
    const response = await api.fetchMathMajorIntro()
    const normalized = normalizeMajorIntroPayload(response?.data)
    if (normalized) return normalized
  } catch (error) {
    console.warn('[math-major-intro] fetch failed, using fallback', error)
  }
  return FALLBACK_MATH_MAJOR_INTRO
}
