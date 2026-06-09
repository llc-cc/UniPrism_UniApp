/**
 * RIASEC Interest Assessment Engine
 *
 * Implements Holland's RIASEC model for career/major interest profiling.
 * Maps questionnaire answers to 6-dimensional interest vectors and
 * recommends university majors based on the resulting profile.
 */

export type RIASECDimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface RIASECScores {
  R: number; // Realistic - 实际型
  I: number; // Investigative - 研究型
  A: number; // Artistic - 艺术型
  S: number; // Social - 社会型
  E: number; // Enterprising - 企业型
  C: number; // Conventional - 常规型
}

export interface RIASECProfile {
  scores: RIASECScores;
  normalized: RIASECScores; // 0-100 scale
  topDimensions: RIASECDimension[];
  code: string; // e.g. "IA" or "RIE"
  description: string;
}

export interface MajorMatch {
  majorId: string;
  name: string;
  matchScore: number; // 0-100
  primaryDimensions: RIASECDimension[];
  description: string;
}

// ─── Dimension Descriptions ───

export const DIMENSION_DESCRIPTIONS: Record<RIASECDimension, { label: string; description: string; traits: string[] }> = {
  R: {
    label: '实际型',
    description: '喜欢动手操作，擅长使用工具和机械，偏好具体、实际的任务',
    traits: ['动手能力强', '注重实效', '喜欢户外活动'],
  },
  I: {
    label: '研究型',
    description: '喜欢观察、分析和解决问题，对科学研究和理论探索充满好奇',
    traits: ['好奇心强', '善于思考', '追求真理'],
  },
  A: {
    label: '艺术型',
    description: '富有创造力和想象力，喜欢自由表达，追求美感和独特性',
    traits: ['创造力丰富', '感受力强', '追求个性'],
  },
  S: {
    label: '社会型',
    description: '喜欢与人交流互动，善于倾听和帮助他人，关心社会问题',
    traits: ['善解人意', '乐于助人', '沟通能力强'],
  },
  E: {
    label: '企业型',
    description: '有领导力和说服力，喜欢组织管理和商业活动，追求成就和影响力',
    traits: ['目标导向', '善于决策', '有进取心'],
  },
  C: {
    label: '常规型',
    description: '做事有条理，注重细节和规则，擅长数据处理和系统化工作',
    traits: ['细致严谨', '有条理', '注重规范'],
  },
};

// ─── Famous People by RIASEC Code ───

export const FAMOUS_PEOPLE: Record<string, { name: string; description: string }[]> = {
  RI: [{ name: '爱因斯坦', description: '物理学家，将实验直觉与理论研究完美结合' }],
  IR: [{ name: '爱因斯坦', description: '物理学家，将实验直觉与理论研究完美结合' }],
  IA: [{ name: '达芬奇', description: '跨越科学与艺术的文艺复兴巨人' }],
  AI: [{ name: '达芬奇', description: '跨越科学与艺术的文艺复兴巨人' }],
  IS: [{ name: '弗洛伊德', description: '精神分析之父，用科学理解人类心灵' }],
  SI: [{ name: '弗洛伊德', description: '精神分析之父，用科学理解人类心灵' }],
  IE: [{ name: '埃隆·马斯克', description: '用科技创业改变世界的企业家' }],
  EI: [{ name: '埃隆·马斯克', description: '用科技创业改变世界的企业家' }],
  IC: [{ name: '高斯', description: '数学王子，将严谨计算与深邃洞察结合' }],
  CI: [{ name: '高斯', description: '数学王子，将严谨计算与深邃洞察结合' }],
  RA: [{ name: '乔布斯', description: '将工程与设计美学融为一体' }],
  AR: [{ name: '乔布斯', description: '将工程与设计美学融为一体' }],
  RS: [{ name: '南丁格尔', description: '将实际行动投入到社会关怀中' }],
  SR: [{ name: '南丁格尔', description: '将实际行动投入到社会关怀中' }],
  RE: [{ name: '任正非', description: '从工程师到企业领袖的实干家' }],
  ER: [{ name: '任正非', description: '从工程师到企业领袖的实干家' }],
  AS: [{ name: '宫崎骏', description: '用艺术创作温暖人心的大师' }],
  SA: [{ name: '宫崎骏', description: '用艺术创作温暖人心的大师' }],
  AE: [{ name: '安迪·沃霍尔', description: '将艺术变成商业的波普之王' }],
  EA: [{ name: '安迪·沃霍尔', description: '将艺术变成商业的波普之王' }],
  AC: [{ name: '巴赫', description: '用数学般精密的结构创造音乐之美' }],
  CA: [{ name: '巴赫', description: '用数学般精密的结构创造音乐之美' }],
  SE: [{ name: '马丁·路德·金', description: '以社会关怀驱动领导力的民权领袖' }],
  ES: [{ name: '马丁·路德·金', description: '以社会关怀驱动领导力的民权领袖' }],
  SC: [{ name: '樊锦诗', description: '数十年如一日守护敦煌的文保学者' }],
  CS: [{ name: '樊锦诗', description: '数十年如一日守护敦煌的文保学者' }],
  EC: [{ name: '巴菲特', description: '将精确分析与商业直觉结合的投资大师' }],
  CE: [{ name: '巴菲特', description: '将精确分析与商业直觉结合的投资大师' }],
  RC: [{ name: '詹天佑', description: '中国铁路之父，精确工程的典范' }],
  CR: [{ name: '詹天佑', description: '中国铁路之父，精确工程的典范' }],
};

// ─── RIASEC → Major Mapping ───

interface MajorProfile {
  majorId: string;
  name: string;
  dimensions: RIASECDimension[];
  weights: number[]; // corresponding weights for each dimension
  description: string;
}

const MAJOR_PROFILES: MajorProfile[] = [
  // 数学与统计
  { majorId: 'math-u', name: '数学与应用数学', dimensions: ['I', 'C', 'R'], weights: [0.5, 0.3, 0.2], description: '纯粹与应用数学的研究' },
  { majorId: 'statistics-u', name: '统计学', dimensions: ['I', 'C', 'E'], weights: [0.4, 0.4, 0.2], description: '数据分析与统计建模' },

  // 物理与天文
  { majorId: 'physics-u', name: '物理学', dimensions: ['I', 'R', 'C'], weights: [0.5, 0.3, 0.2], description: '探索自然界基本规律' },
  { majorId: 'astronomy-u', name: '天文学', dimensions: ['I', 'R', 'A'], weights: [0.5, 0.3, 0.2], description: '探索宇宙的奥秘' },

  // 信息技术
  { majorId: 'cs-u', name: '计算机科学与技术', dimensions: ['I', 'R', 'C'], weights: [0.4, 0.3, 0.3], description: '算法、系统与软件开发' },
  { majorId: 'ai-u', name: '人工智能', dimensions: ['I', 'R', 'E'], weights: [0.4, 0.3, 0.3], description: '机器学习与智能系统' },
  { majorId: 'se-u', name: '软件工程', dimensions: ['R', 'I', 'C'], weights: [0.4, 0.3, 0.3], description: '大规模软件系统的构建' },

  // 电子电气
  { majorId: 'ee-u', name: '电子信息工程', dimensions: ['R', 'I', 'C'], weights: [0.4, 0.3, 0.3], description: '信号处理与通信系统' },
  { majorId: 'ic-u', name: '集成电路设计', dimensions: ['R', 'I', 'C'], weights: [0.4, 0.3, 0.3], description: '芯片设计与半导体技术' },
  { majorId: 'comm-u', name: '通信工程', dimensions: ['R', 'I', 'C'], weights: [0.4, 0.3, 0.3], description: '无线通信与网络技术' },

  // 传统工学
  { majorId: 'aerospace-u', name: '航空航天工程', dimensions: ['R', 'I', 'E'], weights: [0.4, 0.3, 0.3], description: '飞行器设计与航天技术' },
  { majorId: 'mech-u', name: '机械工程', dimensions: ['R', 'I', 'C'], weights: [0.5, 0.3, 0.2], description: '机械设计与制造' },
  { majorId: 'civil-u', name: '土木工程', dimensions: ['R', 'C', 'I'], weights: [0.4, 0.3, 0.3], description: '建筑结构与基础设施' },
  { majorId: 'arch-u', name: '建筑学', dimensions: ['A', 'R', 'I'], weights: [0.4, 0.3, 0.3], description: '建筑设计与城市规划' },

  // 化学与生物
  { majorId: 'chem-u', name: '化学', dimensions: ['I', 'R', 'C'], weights: [0.4, 0.3, 0.3], description: '分子世界的探索' },
  { majorId: 'bio-u', name: '生物科学', dimensions: ['I', 'R', 'S'], weights: [0.4, 0.3, 0.3], description: '生命现象的研究' },
  { majorId: 'bioeng-u', name: '生物工程', dimensions: ['I', 'R', 'E'], weights: [0.4, 0.3, 0.3], description: '工程技术改造生命' },
  { majorId: 'pharma-u', name: '药学', dimensions: ['I', 'R', 'S'], weights: [0.4, 0.3, 0.3], description: '药物研发与临床应用' },

  // 医学
  { majorId: 'med-u', name: '临床医学', dimensions: ['I', 'S', 'R'], weights: [0.3, 0.4, 0.3], description: '诊断与治疗疾病' },
  { majorId: 'psych-u', name: '心理学', dimensions: ['S', 'I', 'A'], weights: [0.4, 0.3, 0.3], description: '理解人类心理与行为' },

  // 经管法
  { majorId: 'econ-u', name: '经济学', dimensions: ['I', 'E', 'C'], weights: [0.3, 0.4, 0.3], description: '经济现象与政策分析' },
  { majorId: 'finance-u', name: '金融学', dimensions: ['E', 'I', 'C'], weights: [0.4, 0.3, 0.3], description: '金融市场与投资' },
  { majorId: 'actuarial-u', name: '精算学', dimensions: ['I', 'C', 'E'], weights: [0.4, 0.4, 0.2], description: '保险定价、准备金与风险资本' },
  { majorId: 'acct-u', name: '会计学', dimensions: ['C', 'E', 'I'], weights: [0.4, 0.3, 0.3], description: '财务报告与审计' },
  { majorId: 'law-u', name: '法学', dimensions: ['E', 'S', 'I'], weights: [0.3, 0.4, 0.3], description: '法律制度与司法实践' },
  { majorId: 'biz-u', name: '工商管理', dimensions: ['E', 'S', 'C'], weights: [0.4, 0.3, 0.3], description: '企业管理与战略' },

  // 人文社科
  { majorId: 'chinese-u', name: '中国语言文学', dimensions: ['A', 'S', 'I'], weights: [0.4, 0.3, 0.3], description: '文学创作与文化研究' },
  { majorId: 'history-u', name: '历史学', dimensions: ['I', 'A', 'S'], weights: [0.4, 0.3, 0.3], description: '历史研究与文化传承' },
  { majorId: 'edu-u', name: '教育学', dimensions: ['S', 'A', 'I'], weights: [0.4, 0.3, 0.3], description: '教育理论与实践' },
  { majorId: 'design-u', name: '工业设计', dimensions: ['A', 'R', 'E'], weights: [0.4, 0.3, 0.3], description: '产品设计与用户体验' },
];

// ─── Scoring Functions ───

/**
 * Normalize raw scores to 0-100 scale
 */
export function normalizeScores(raw: RIASECScores): RIASECScores {
  const values = Object.values(raw);
  const max = Math.max(...values, 1);
  const result = {} as RIASECScores;
  for (const key of Object.keys(raw) as RIASECDimension[]) {
    result[key] = Math.round((raw[key] / max) * 100);
  }
  return result;
}

/**
 * Get top N dimensions from scores
 */
export function getTopDimensions(scores: RIASECScores, n: number = 2): RIASECDimension[] {
  return (Object.entries(scores) as [RIASECDimension, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([dim]) => dim);
}

/**
 * Compute RIASEC profile from raw scores
 */
export function computeProfile(rawScores: RIASECScores): RIASECProfile {
  const normalized = normalizeScores(rawScores);
  const topDimensions = getTopDimensions(normalized, 2);
  const code = topDimensions.join('');

  const desc1 = DIMENSION_DESCRIPTIONS[topDimensions[0]];
  const desc2 = DIMENSION_DESCRIPTIONS[topDimensions[1]];
  const description = `你是${desc1.label}与${desc2.label}的结合——${desc1.traits[0]}，同时${desc2.traits[1]}。`;

  return {
    scores: rawScores,
    normalized,
    topDimensions,
    code,
    description,
  };
}

/**
 * Match RIASEC profile to university majors
 */
export function matchMajors(scores: RIASECScores, topN: number = 3): MajorMatch[] {
  const normalized = normalizeScores(scores);

  const results: MajorMatch[] = MAJOR_PROFILES.map((major) => {
    let matchScore = 0;
    for (let i = 0; i < major.dimensions.length; i++) {
      matchScore += normalized[major.dimensions[i]] * major.weights[i];
    }

    return {
      majorId: major.majorId,
      name: major.name,
      matchScore: Math.round(matchScore),
      primaryDimensions: major.dimensions,
      description: major.description,
    };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);
  return results.slice(0, topN);
}

/**
 * Get a famous person match for the given RIASEC code
 */
export function getFamousPerson(code: string): { name: string; description: string } | null {
  const twoChar = code.substring(0, 2);
  const matches = FAMOUS_PEOPLE[twoChar];
  return matches ? matches[0] : null;
}
