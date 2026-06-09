/**
 * AUTO-SYNCED from UniPrism_New-main/lib/discover-questions.ts
 * Do not edit manually — run: npm run questions:sync
 * Synced at: 2026-06-08T07:48:29.725Z
 */

import { RIASECDimension, RIASECScores } from './riasecEngine';

export type QuestionType =
  | 'profile-form'
  | 'interest-tag-grid'
  | 'multi-select'
  | 'rank-select'
  | 'scenario-pair'
  | 'slider'
  | 'card-select'
  | 'career-scenario'
  | 'free-text'
  | 'ai-dialogue';

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  iconSrc?: string;
  correct?: boolean;
  riasecWeights: Partial<Record<RIASECDimension, number>>;
  personalityTags?: string[];
}

export interface ScenarioPair {
  optionA: QuestionOption;
  optionB: QuestionOption;
}

export interface ProfileField {
  id: string;
  label: string;
  type: 'text' | 'single' | 'multi';
  placeholder?: string;
  minLength?: number;
  maxSelections?: number;
  options?: QuestionOption[];
}

export interface AbilitySetup {
  series: string;
  title: string;
  lines: string[];
}

export interface AbilityPuzzleTable {
  columns: string[];
  rows: string[][];
}

export type AbilityBoardPieceSide = 'B' | 'W';

export interface AbilityBoardPiece {
  at: string;
  side: AbilityBoardPieceSide;
}

export interface AbilityBoard {
  pieces: AbilityBoardPiece[];
  focus?: string[];
  caption?: string;
}

export interface AbilityPuzzle {
  scene: string;
  imageSrc: string;
  hint?: string;
  tables?: AbilityPuzzleTable[];
  board?: AbilityBoard;
}

export interface CareerScenarioConfig {
  scene: string;
  sceneImageSrc?: string;
  firstPrompt: string;
  firstOptions: QuestionOption[];
  itemScene?: string;
  itemImageSrc?: string;
  itemPrompt: string;
  itemOptions: QuestionOption[];
  itemMaxSelections: number;
  openScene?: string;
  openImageSrc?: string;
  teamPrompt?: string;
  teamOptions?: QuestionOption[];
  openPrompt: string;
  openFields: ProfileField[];
}

export interface Question {
  id: string;
  phase: 'A' | 'B' | 'C' | 'D';
  type: QuestionType;
  prompt: string;
  subtext?: string;
  imageSrc?: string;
  profileFields?: ProfileField[];
  abilitySetup?: AbilitySetup;
  abilityPuzzle?: AbilityPuzzle;
  careerScenario?: CareerScenarioConfig;
  options?: QuestionOption[];
  scenarioPair?: ScenarioPair;
  rankWeights?: number[];
  sliderConfig?: {
    leftLabel: string;
    rightLabel: string;
    leftWeights: Partial<Record<RIASECDimension, number>>;
    rightWeights: Partial<Record<RIASECDimension, number>>;
  };
  multiSelect?: boolean;
  maxSelections?: number;
  placeholder?: string;
  minLength?: number;
  correctFeedback?: string;
  incorrectFeedback?: string;
}

export interface AiDialogueAnswer {
  dialogueId: string | null;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    inputMode?: 'text' | 'voice_transcript';
    createdAt: string;
  }>;
  scoringSummary: {
    deltas: Record<RIASECDimension, number>;
    topDimensions: RIASECDimension[];
    confidence: number;
  };
  completed: boolean;
}

export interface CareerScenarioAnswer {
  firstChoiceId: string;
  itemChoiceIds: string[];
  teamChoiceId: string;
  openResponses: Record<string, string>;
  aiDialogue: AiDialogueAnswer;
}

export type AnswerValue =
  | string
  | string[]
  | number
  | { text: string }
  | { fields: Record<string, string | string[]> }
  | CareerScenarioAnswer
  | AiDialogueAnswer;

export interface Answer {
  questionId: string;
  value: AnswerValue;
  timestamp: number;
}

const DISCOVER_IMAGE = (index: number) => `/images/explore/discover/generated/interest-q-${String(index).padStart(2, '0')}-v1.png`;
const DISCOVER_GENERATED_IMAGE = (fileName: string) => `/images/explore/discover/generated/${fileName}`;
const DISCOVER_CHOICE_ICON = (fileName: string) => `/images/explore/discover/icons/generated/${fileName}`;

type InterestTagSource = {
  id: string;
  label: string;
  category: string;
};

const INTEREST_TAG_SOURCES: InterestTagSource[] = [
  { id: 'movie', label: '电影', category: 'A' },
  { id: 'anime-game', label: '二次元游戏', category: 'AR' },
  { id: 'yoga', label: '瑜伽', category: 'RS' },
  { id: 'perfume', label: '香水', category: 'AE' },
  { id: 'drama-series', label: '追剧', category: 'A' },
  { id: 'road-trip', label: '自驾游', category: 'R' },
  { id: 'cycling', label: '骑行', category: 'RS' },
  { id: 'pets', label: '宠物', category: 'SR' },
  { id: 'animation', label: '动漫', category: 'A' },
  { id: 'camping', label: '露营', category: 'R' },
  { id: 'football', label: '足球', category: 'RSE' },
  { id: 'kids', label: '萌娃', category: 'S' },
  { id: 'variety-show', label: '综艺', category: 'AS' },
  { id: 'hiking', label: '户外徒步', category: 'R' },
  { id: 'basketball', label: '篮球', category: 'RSE' },
  { id: 'relationship', label: '情感', category: 'S' },
  { id: 'music', label: '音乐', category: 'A' },
  { id: 'landmark-checkin', label: '景点打卡', category: 'SA' },
  { id: 'tennis', label: '网球', category: 'RSE' },
  { id: 'astrology', label: '星座', category: 'AS' },
  { id: 'concert', label: '演唱会', category: 'AE' },
  { id: 'diving', label: '潜水', category: 'R' },
  { id: 'badminton', label: '羽毛球', category: 'RSE' },
  { id: 'fortune-telling', label: '占卜', category: 'AS' },
  { id: 'kpop', label: 'K-pop', category: 'AE' },
  { id: 'skiing', label: '滑雪', category: 'R' },
  { id: 'surfing', label: '冲浪', category: 'R' },
  { id: 'technology', label: '科技', category: 'IE' },
  { id: 'photography', label: '摄影', category: 'A' },
  { id: 'travel', label: '旅游', category: 'R' },
  { id: 'climbing', label: '攀岩', category: 'R' },
  { id: 'digital-products', label: '数码', category: 'IRE' },
  { id: 'design', label: '设计', category: 'AI' },
  { id: 'outfit', label: '穿搭', category: 'AE' },
  { id: 'baking', label: '烘焙', category: 'RCA' },
  { id: 'history', label: '历史', category: 'IA' },
  { id: 'literature', label: '文学', category: 'AI' },
  { id: 'makeup', label: '美妆', category: 'AE' },
  { id: 'food-review', label: '美食探店', category: 'AES' },
  { id: 'psychology', label: '心理学', category: 'IS' },
  { id: 'calligraphy', label: '书法', category: 'A' },
  { id: 'skincare', label: '护肤', category: 'A' },
  { id: 'coffee', label: '咖啡', category: 'RA' },
  { id: 'popular-science', label: '科普', category: 'IS' },
  { id: 'cosplay', label: 'Cosplay', category: 'AE' },
  { id: 'hairstyling', label: '美发', category: 'AR' },
  { id: 'tea-art', label: '茶艺', category: 'RS' },
  { id: 'cars', label: '汽车', category: 'RI' },
  { id: 'handcraft', label: '手工', category: 'RA' },
  { id: 'trend-items', label: '潮流单品', category: 'AE' },
  { id: 'local-snacks', label: '地方小吃', category: 'RAC' },
  { id: 'foreign-language', label: '外语', category: 'IS' },
  { id: 'fitness', label: '健身', category: 'RS' },
  { id: 'sneaker-culture', label: '球鞋文化', category: 'AEC' },
  { id: 'dessert', label: '甜品', category: 'RAC' },
  { id: 'figures', label: '手办', category: 'AC' },
  { id: 'running', label: '跑步', category: 'RS' },
  { id: 'luxury-goods', label: '奢侈品', category: 'EA' },
  { id: 'esports', label: '电竞', category: 'RI' },
  { id: 'building-blocks', label: '积木', category: 'RAI' },
  { id: 'board-games', label: '桌游', category: 'SI' },
  { id: 'model-making', label: '模型制作', category: 'RA' },
  { id: 'console-games', label: '主机游戏', category: 'RIA' },
  { id: 'collecting', label: '收藏', category: 'CA' },
  { id: 'three-d-printing', label: '3D打印', category: 'RIA' },
];

function stableInterestHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getInterestWeights(category: string): Partial<Record<RIASECDimension, number>> {
  const letters = Array.from(category).filter((letter): letter is RIASECDimension =>
    ['R', 'I', 'A', 'S', 'E', 'C'].includes(letter),
  );
  const weightsByLength: Record<number, number[]> = {
    1: [1],
    2: [0.6, 0.4],
    3: [0.5, 0.3, 0.2],
  };
  const weights = weightsByLength[letters.length] ?? [];
  const result: Partial<Record<RIASECDimension, number>> = {};
  letters.forEach((letter, index) => {
    const weight = weights[index] ?? 0;
    if (weight > 0) result[letter] = weight;
  });
  return result;
}

function toInterestOption(source: InterestTagSource): QuestionOption {
  return {
    id: `interest-${source.id}`,
    label: source.label,
    iconSrc: DISCOVER_CHOICE_ICON(`discover-choice-icon-interest-${source.id}-20260607-v1.svg`),
    riasecWeights: getInterestWeights(source.category),
  };
}

function chunkOptions<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

const SHUFFLED_INTEREST_TAGS = [...INTEREST_TAG_SOURCES].sort(
  (left, right) =>
    stableInterestHash(`${left.id}:uniprism-20260607`) -
    stableInterestHash(`${right.id}:uniprism-20260607`),
);

const INTEREST_TAG_QUESTIONS: Question[] = chunkOptions(SHUFFLED_INTEREST_TAGS.map(toInterestOption), 22).map(
  (options, index) => ({
    id: `interest-tags-${index + 1}`,
    phase: 'A',
    type: 'interest-tag-grid',
    prompt: `兴趣探索 ${index + 1}/3：下面这些内容里，哪些算是“我会主动点开 / 愿意投入时间”的标签？`,
    subtext: '点击表示符合；没有点击的标签会按“不符合”处理。',
    options,
  }),
);

const BASIC_INFO: Question[] = [
  {
    id: 'basic-profile',
    phase: 'A',
    type: 'profile-form',
    imageSrc: DISCOVER_IMAGE(1),
    prompt: '先完成一页基本信息',
    subtext: '这些信息用于生成报告口径和初始画像，不设标准答案。',
    profileFields: [
      { id: 'name', label: '报告里怎么称呼你？', type: 'text', placeholder: '姓名或昵称', minLength: 1 },
      {
        id: 'gender',
        label: '性别',
        type: 'single',
        options: [
          { id: 'gender-female', label: '女', riasecWeights: {} },
          { id: 'gender-male', label: '男', riasecWeights: {} },
          { id: 'gender-private', label: '暂不填写', riasecWeights: {} },
        ],
      },
      {
        id: 'status',
        label: '你现在更接近那种状态？',
        type: 'single',
        options: [
          { id: 'status-early', label: '还在广泛了解', riasecWeights: { I: 1, A: 1 }, personalityTags: ['open'] },
          { id: 'status-late', label: '需要尽快缩小范围', riasecWeights: { C: 2, E: 1 }, personalityTags: ['pragmatic'] },
          { id: 'status-checking', label: '有方向，想验证适配度', riasecWeights: { I: 2, C: 1 }, personalityTags: ['analytical'] },
          { id: 'status-lost', label: '比较迷茫，需要系统帮我建立候选方向', riasecWeights: { S: 1, A: 1 }, personalityTags: ['reflective'] },
        ],
      },
      {
        id: 'clarity',
        label: '是否已有明确想学的专业或职业？',
        type: 'single',
        options: [
          { id: 'clarity-major', label: '有明确专业', riasecWeights: { I: 1, C: 2 }, personalityTags: ['focused'] },
          { id: 'clarity-career', label: '有明确职业', riasecWeights: { E: 2, C: 1 }, personalityTags: ['goal-oriented'] },
          { id: 'clarity-area', label: '只有大概领域', riasecWeights: { I: 1, A: 1, R: 1 }, personalityTags: ['exploring'] },
          { id: 'clarity-none', label: '完全没有', riasecWeights: { S: 1, A: 1 }, personalityTags: ['open'] },
        ],
      },
      {
        id: 'dislike',
        label: '下面哪3类事情最消耗你？',
        type: 'multi',
        maxSelections: 3,
        options: [
          { id: 'hate-proof', label: '长时间抽象推理和证明', riasecWeights: { I: -2, C: -1 }, personalityTags: ['avoid-abstraction'] },
          { id: 'hate-debug', label: '反复调试、失败、重做', riasecWeights: { R: -2, I: -1 }, personalityTags: ['avoid-iteration'] },
          { id: 'hate-writing', label: '写长文、表达观点、做展示', riasecWeights: { A: -2, S: -1 }, personalityTags: ['avoid-expression'] },
          { id: 'hate-social', label: '大量社交、协调、处理冲突', riasecWeights: { S: -2, E: -1 }, personalityTags: ['avoid-social-load'] },
          { id: 'hate-detail', label: '长期做表格、文档和细节核对', riasecWeights: { C: -3 }, personalityTags: ['avoid-detail'] },
          { id: 'hate-risk', label: '竞争、压力和不确定结果', riasecWeights: { E: -3 }, personalityTags: ['avoid-risk'] },
          { id: 'hate-lab', label: '重复实验和精密操作', riasecWeights: { R: -2, C: -1 }, personalityTags: ['avoid-lab'] },
          { id: 'hate-care', label: '持续照顾他人情绪和需求', riasecWeights: { S: -3 }, personalityTags: ['avoid-care'] },
          { id: 'hate-opencreate', label: '没有标准答案的创作任务', riasecWeights: { A: -3 }, personalityTags: ['avoid-ambiguity'] },
          { id: 'hate-business', label: '谈判、销售、争取资源', riasecWeights: { E: -2, S: -1 }, personalityTags: ['avoid-persuasion'] },
        ],
      },
    ],
  },
];

const CORE_QUESTIONS: Question[] = [
  {
    id: 'core-flow',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(2),
    prompt: '哪类任务最容易让你进入“停不下来”的状态？',
    options: [
      { id: 'flow-model', label: '把复杂问题拆成模型、规则和证明', riasecWeights: { I: 4, C: 1 }, personalityTags: ['deep-thinking'] },
      { id: 'flow-build', label: '把想法做成能运行的工具或作品', riasecWeights: { R: 3, I: 1 }, personalityTags: ['builder'] },
      { id: 'flow-create', label: '写作、影像、设计或表达观点', riasecWeights: { A: 4 }, personalityTags: ['creative'] },
      { id: 'flow-connect', label: '和人讨论、组织活动、推进共识', riasecWeights: { S: 2, E: 2 }, personalityTags: ['social'] },
    ],
  },
  {
    id: 'core-problem-entry',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(3),
    prompt: '遇到一个陌生难题，你第一反应更像哪一种？',
    options: [
      { id: 'entry-structure', label: '先定义问题、列出条件和变量', riasecWeights: { I: 3, C: 2 }, personalityTags: ['structured'] },
      { id: 'entry-try', label: '先做一个小实验或原型试试看', riasecWeights: { R: 3, I: 1 }, personalityTags: ['experimental'] },
      { id: 'entry-people', label: '先问相关的人，理解真实需求', riasecWeights: { S: 3, E: 1 }, personalityTags: ['user-oriented'] },
      { id: 'entry-vision', label: '先想最后想呈现出什么效果', riasecWeights: { A: 3, E: 1 }, personalityTags: ['vision-driven'] },
    ],
  },
  {
    id: 'core-evidence',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(4),
    prompt: '你更信任哪种“证明一件事有效”的方式？',
    options: [
      { id: 'evidence-data', label: '数据对比和可重复结果', riasecWeights: { I: 3, C: 2 }, personalityTags: ['evidence-based'] },
      { id: 'evidence-field', label: '真实场景里的试用反馈', riasecWeights: { R: 2, S: 2 }, personalityTags: ['practical'] },
      { id: 'evidence-expert', label: '专家经验和行业判断', riasecWeights: { E: 2, C: 1 }, personalityTags: ['strategic'] },
      { id: 'evidence-story', label: '人的体验变化和故事', riasecWeights: { A: 2, S: 2 }, personalityTags: ['empathetic'] },
    ],
  },
  {
    id: 'core-output',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(5),
    prompt: '如果一周后要交付成果，你更愿意交付什么？',
    options: [
      { id: 'output-report', label: '一份结构清晰的分析报告', riasecWeights: { I: 2, C: 3 }, personalityTags: ['analytical'] },
      { id: 'output-tool', label: '一个能解决问题的工具 / 原型', riasecWeights: { R: 4, I: 1 }, personalityTags: ['builder'] },
      { id: 'output-work', label: '一个有表达力的作品 / 方案', riasecWeights: { A: 4 }, personalityTags: ['creative'] },
      { id: 'output-event', label: '一次让团队行动起来的推进会', riasecWeights: { E: 3, S: 2 }, personalityTags: ['organizer'] },
    ],
  },
  {
    id: 'core-team-role',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(6),
    prompt: '团队项目里，你最自然承担哪个角色？',
    options: [
      { id: 'team-analyst', label: '分析者：找规律、查漏洞、定框架', riasecWeights: { I: 3, C: 2 }, personalityTags: ['analytical'] },
      { id: 'team-maker', label: '执行者：把东西做出来、调通、落地', riasecWeights: { R: 4 }, personalityTags: ['hands-on'] },
      { id: 'team-voice', label: '表达者：讲故事、做展示、统一风格', riasecWeights: { A: 3, S: 1 }, personalityTags: ['expressive'] },
      { id: 'team-driver', label: '推动者：分工、协调、争取资源', riasecWeights: { E: 4, S: 1 }, personalityTags: ['leadership'] },
    ],
  },
  {
    id: 'core-learning-source',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(7),
    prompt: '学习新东西时，哪种材料最适合你？',
    options: [
      { id: 'learn-theory', label: '从原理和定义开始，一步步推导', riasecWeights: { I: 4, C: 1 }, personalityTags: ['theory-first'] },
      { id: 'learn-case', label: '从案例和项目开始，边做边懂', riasecWeights: { R: 3, I: 1 }, personalityTags: ['practice-first'] },
      { id: 'learn-dialogue', label: '有人讲解、讨论和即时反馈', riasecWeights: { S: 3 }, personalityTags: ['interactive'] },
      { id: 'learn-visual', label: '图像、故事、类比和直观体验', riasecWeights: { A: 3, S: 1 }, personalityTags: ['visual'] },
    ],
  },
  {
    id: 'core-preferred-system',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(8),
    prompt: '下面哪类“系统”最吸引你研究？',
    options: [
      { id: 'system-natural', label: '自然系统：宇宙、生命、材料、能量', riasecWeights: { I: 3, R: 2 }, personalityTags: ['science-curious'] },
      { id: 'system-digital', label: '数字系统：算法、软件、网络、AI', riasecWeights: { I: 3, R: 2, C: 1 }, personalityTags: ['digital'] },
      { id: 'system-human', label: '人类系统：心理、教育、社会关系', riasecWeights: { S: 3, I: 2 }, personalityTags: ['human-focused'] },
      { id: 'system-market', label: '资源系统：商业、金融、组织、政策', riasecWeights: { E: 3, C: 2 }, personalityTags: ['market-aware'] },
    ],
  },
  {
    id: 'core-feedback',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(9),
    prompt: '哪种反馈最能激励你继续投入？',
    options: [
      { id: 'feedback-truth', label: '发现了一个更深的规律', riasecWeights: { I: 4 }, personalityTags: ['truth-seeking'] },
      { id: 'feedback-useful', label: '别人真的用上了我的东西', riasecWeights: { R: 2, S: 2 }, personalityTags: ['impact'] },
      { id: 'feedback-beauty', label: '作品变得更有美感和表达力', riasecWeights: { A: 4 }, personalityTags: ['aesthetic'] },
      { id: 'feedback-win', label: '目标达成、资源增加、影响力变大', riasecWeights: { E: 4 }, personalityTags: ['achievement'] },
    ],
  },
  {
    id: 'core-uncertainty',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(10),
    prompt: '面对不确定性，你更能接受哪一种？',
    options: [
      { id: 'uncertain-research', label: '问题很难，但可以慢慢推理清楚', riasecWeights: { I: 4 }, personalityTags: ['patient-reasoning'] },
      { id: 'uncertain-build', label: '会失败很多次，但每次都能改进', riasecWeights: { R: 3, I: 1 }, personalityTags: ['iteration'] },
      { id: 'uncertain-create', label: '没有标准答案，但可以做出独特方案', riasecWeights: { A: 4 }, personalityTags: ['ambiguity-tolerant'] },
      { id: 'uncertain-competition', label: '结果不确定，但赢了回报很大', riasecWeights: { E: 4 }, personalityTags: ['risk-taking'] },
    ],
  },
  {
    id: 'core-detail',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(11),
    prompt: '你对“细节工作”的真实态度更接近哪一个？',
    options: [
      { id: 'detail-love', label: '喜欢把表格、流程和规范整理得很清楚', riasecWeights: { C: 4 }, personalityTags: ['organized'] },
      { id: 'detail-logic', label: '只要细节服务于严密推理，我可以投入', riasecWeights: { I: 2, C: 2 }, personalityTags: ['rigorous'] },
      { id: 'detail-craft', label: '调参数、修工具、打磨手感我能接受', riasecWeights: { R: 3, C: 1 }, personalityTags: ['craft'] },
      { id: 'detail-drain', label: '重复核对会明显消耗我', riasecWeights: { A: 1, C: -2 }, personalityTags: ['low-detail-tolerance'] },
    ],
  },
  {
    id: 'core-people-load',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(12),
    prompt: '大量和人打交道，对你来说更像什么？',
    options: [
      { id: 'people-energy', label: '会让我获得信息和能量', riasecWeights: { S: 3, E: 2 }, personalityTags: ['social-energy'] },
      { id: 'people-purpose', label: '如果是在帮助真实的人，我愿意投入', riasecWeights: { S: 4 }, personalityTags: ['care-driven'] },
      { id: 'people-strategy', label: '如果能推动目标和资源，我可以做好', riasecWeights: { E: 4, C: 1 }, personalityTags: ['strategic-social'] },
      { id: 'people-drain', label: '长期高强度社交会明显消耗我', riasecWeights: { I: 2, S: -2 }, personalityTags: ['solo-preferred'] },
    ],
  },
  {
    id: 'core-long-project',
    phase: 'A',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(13),
    prompt: '如果要坚持一年，你更可能坚持哪件事？',
    options: [
      { id: 'long-paper', label: '研究一个问题并写出系统结论', riasecWeights: { I: 4, C: 1 }, personalityTags: ['research'] },
      { id: 'long-product', label: '持续迭代一个产品或工程项目', riasecWeights: { R: 3, I: 1, E: 1 }, personalityTags: ['product-minded'] },
      { id: 'long-portfolio', label: '持续产出作品集或内容系列', riasecWeights: { A: 4, S: 1 }, personalityTags: ['portfolio'] },
      { id: 'long-org', label: '运营一个社群、社团或小团队', riasecWeights: { E: 3, S: 2 }, personalityTags: ['community-builder'] },
    ],
  },
];

function personalityOption(id: string, label: string, tag: string): QuestionOption {
  return {
    id,
    label,
    riasecWeights: {},
    personalityTags: [`mbti:${tag}`],
  };
}

const PERSONALITY_QUESTIONS: Question[] = [
  {
    id: 'personality-ei-1',
    phase: 'C',
    type: 'card-select',
    prompt: '新生见面会：大学新生群组织了一次线下聚餐，会有很多新同学参加。你更可能：',
    options: [
      personalityOption('personality-ei-1-a', '很期待，主动去认识大家，聊得热火朝天', 'E'),
      personalityOption('personality-ei-1-b', '有点犹豫，担心人多会累，或者只和同宿舍的坐一起', 'I'),
    ],
  },
  {
    id: 'personality-ei-2',
    phase: 'C',
    type: 'card-select',
    prompt: '一整天社交后：周末参加了一次社团露营或朋友聚会，从早到晚都和人待在一起。结束时你通常：',
    options: [
      personalityOption('personality-ei-2-a', '还想续摊，觉得越玩越有劲', 'E'),
      personalityOption('personality-ei-2-b', '电量耗尽，需要一个人静静，比如戴上耳机听歌或闷头睡一觉', 'I'),
    ],
  },
  {
    id: 'personality-ei-3',
    phase: 'C',
    type: 'card-select',
    prompt: '课堂或会议发言：在小组讨论或线上会议中，你通常是：',
    options: [
      personalityOption('personality-ei-3-a', '想到什么就说什么，不怕打断别人', 'E'),
      personalityOption('personality-ei-3-b', '先把想法在心里过一遍，确认成熟了再开口', 'I'),
    ],
  },
  {
    id: 'personality-ei-4',
    phase: 'C',
    type: 'card-select',
    prompt: '食堂吃饭：在学校食堂吃午饭，你更喜欢：',
    options: [
      personalityOption('personality-ei-4-a', '坐到人多的地方，边吃边聊', 'E'),
      personalityOption('personality-ei-4-b', '找一个相对安静的角落，独自吃完或者只和 1 个熟人一起', 'I'),
    ],
  },
  {
    id: 'personality-ei-5',
    phase: 'C',
    type: 'card-select',
    prompt: '周末早晨：周六早上醒来，你更想做：',
    options: [
      personalityOption('personality-ei-5-a', '立刻看手机有没有人约，或者主动找人出去玩', 'E'),
      personalityOption('personality-ei-5-b', '先享受一段完全属于自己的安静时间，发呆、听歌或打游戏', 'I'),
    ],
  },
  {
    id: 'personality-ei-6',
    phase: 'C',
    type: 'card-select',
    prompt: '自我介绍：在一个新班级或新团队里做自我介绍，你通常：',
    options: [
      personalityOption('personality-ei-6-a', '声音洪亮，讲得比较长，希望给别人留下印象', 'E'),
      personalityOption('personality-ei-6-b', '简短几句，希望快点结束，不太习惯成为焦点', 'I'),
    ],
  },
  {
    id: 'personality-sn-1',
    phase: 'C',
    type: 'card-select',
    prompt: '看宿舍好物推荐：你在小红书或抖音刷到一篇“大学宿舍必备好物”分享。你更在意：',
    options: [
      personalityOption('personality-sn-1-a', '具体的价格、尺寸、链接、实拍细节图', 'S'),
      personalityOption('personality-sn-1-b', '这个博主整体营造的生活氛围和改造灵感', 'N'),
    ],
  },
  {
    id: 'personality-sn-2',
    phase: 'C',
    type: 'card-select',
    prompt: '做课程项目：老师布置了一个开放性课题，比如设计一个小程序或策划一场活动。你习惯：',
    options: [
      personalityOption('personality-sn-2-a', '先找现成的案例和成熟模板，按照成功经验来做', 'S'),
      personalityOption('personality-sn-2-b', '自己先天马行空想几个有意思的点子，再慢慢落地', 'N'),
    ],
  },
  {
    id: 'personality-sn-3',
    phase: 'C',
    type: 'card-select',
    prompt: '欣赏的博主：你更愿意关注哪种类型的博主或 up 主？',
    options: [
      personalityOption('personality-sn-3-a', '实用型：教你怎么学、怎么省、怎么解决实际问题', 'S'),
      personalityOption('personality-sn-3-b', '创意型：脑洞大、视角独特、总能给你新鲜感', 'N'),
    ],
  },
  {
    id: 'personality-sn-4',
    phase: 'C',
    type: 'card-select',
    prompt: '看新闻：刷到一条关于“AI 发展”的新闻，你更容易被哪部分吸引？',
    options: [
      personalityOption('personality-sn-4-a', '具体数据：最新模型的参数、成本、应用案例', 'S'),
      personalityOption('personality-sn-4-b', '未来想象：AI 会如何改变人类生活、带来哪些可能性', 'N'),
    ],
  },
  {
    id: 'personality-sn-5',
    phase: 'C',
    type: 'card-select',
    prompt: '学新技能：你想学一个手机剪辑软件。你更倾向于：',
    options: [
      personalityOption('personality-sn-5-a', '找一份图文教程，一步步跟着操作', 'S'),
      personalityOption('personality-sn-5-b', '自己先乱点乱试，遇到不懂的再查，或者直接看创意混剪找灵感', 'N'),
    ],
  },
  {
    id: 'personality-sn-6',
    phase: 'C',
    type: 'card-select',
    prompt: '听朋友讲旅行：朋友刚从外地回来，跟你讲旅途经历。你更喜欢听：',
    options: [
      personalityOption('personality-sn-6-a', '他去了哪些具体景点、花了多少钱、吃了什么好吃的', 'S'),
      personalityOption('personality-sn-6-b', '他整个旅程的心情变化、遇到的有趣陌生人或意外奇遇', 'N'),
    ],
  },
  {
    id: 'personality-tf-1',
    phase: 'C',
    type: 'card-select',
    prompt: '选暑假工：两份兼职时薪差不多，一份数据录入，一份奶茶店员。你更看重：',
    options: [
      personalityOption('personality-tf-1-a', '哪份工作更高效、更划算、更符合我的实际收益', 'T'),
      personalityOption('personality-tf-1-b', '哪份工作做起来更开心、同事关系更融洽', 'F'),
    ],
  },
  {
    id: 'personality-tf-2',
    phase: 'C',
    type: 'card-select',
    prompt: '朋友失恋：你的好朋友失恋了，半夜给你发消息。你会：',
    options: [
      personalityOption('personality-tf-2-a', '帮他理性复盘：你们主要矛盾是什么？接下来该怎么做？', 'T'),
      personalityOption('personality-tf-2-b', '先陪他骂一通、听他哭，说“我知道你很难受，我陪你”', 'F'),
    ],
  },
  {
    id: 'personality-tf-3',
    phase: 'C',
    type: 'card-select',
    prompt: '选小组搭档：A 同学逻辑强、做事快但说话直接；B 同学性格好、配合度高但能力一般。你更可能选：',
    options: [
      personalityOption('personality-tf-3-a', 'A 同学，效率优先', 'T'),
      personalityOption('personality-tf-3-b', 'B 同学，合作舒服优先', 'F'),
    ],
  },
  {
    id: 'personality-tf-4',
    phase: 'C',
    type: 'card-select',
    prompt: '看辩论赛：你看了一场辩论赛，正反方观点都很有道理。你更容易被哪一方说服？',
    options: [
      personalityOption('personality-tf-4-a', '逻辑更严密、数据更充分、反驳更有力的一方', 'T'),
      personalityOption('personality-tf-4-b', '表达更打动人、更有人情味、更能引发共情的一方', 'F'),
    ],
  },
  {
    id: 'personality-tf-5',
    phase: 'C',
    type: 'card-select',
    prompt: '宿舍公约：你和室友一起制定宿舍公约。关于空调温度设定，有人怕冷有人怕热。你更倾向：',
    options: [
      personalityOption('personality-tf-5-a', '投票决定一个固定温度，少数服从多数，严格执行', 'T'),
      personalityOption('personality-tf-5-b', '大家灵活商量，热的时候调低，冷了就调高，以都舒服为主', 'F'),
    ],
  },
  {
    id: 'personality-tf-6',
    phase: 'C',
    type: 'card-select',
    prompt: '被批评：老师或领导当着别人的面批评了你，但他说得确实有道理。你的第一反应是：',
    options: [
      personalityOption('personality-tf-6-a', '虽然不舒服，但先听进去哪些地方说得对，以后改进', 'T'),
      personalityOption('personality-tf-6-b', '很受伤，觉得他完全可以私下说，太不给面子了', 'F'),
    ],
  },
  {
    id: 'personality-jp-1',
    phase: 'C',
    type: 'card-select',
    prompt: '规划暑假：暑假快到了，你通常：',
    options: [
      personalityOption('personality-jp-1-a', '提前把实习、旅行、学习都排好日程，甚至精确到每天几点', 'J'),
      personalityOption('personality-jp-1-b', '只有一个大概想法，比如“这个暑假要减肥/学个技能”，具体再说', 'P'),
    ],
  },
  {
    id: 'personality-jp-2',
    phase: 'C',
    type: 'card-select',
    prompt: '交论文：你有两周时间完成一篇期末论文。你的习惯是：',
    options: [
      personalityOption('personality-jp-2-a', '马上开始查资料、列大纲，每天写一点，提前一两天交', 'J'),
      personalityOption('personality-jp-2-b', '前 10 天基本没动，最后 3 天熬夜赶出来', 'P'),
    ],
  },
  {
    id: 'personality-jp-3',
    phase: 'C',
    type: 'card-select',
    prompt: '手机桌面：看一眼你的手机主屏幕或电脑桌面，更像哪种？',
    options: [
      personalityOption('personality-jp-3-a', '分类放在文件夹里，只有少量常用 App 留在外面，很整洁', 'J'),
      personalityOption('personality-jp-3-b', '好几屏 App 散落，图标位置比较随意，但我找得到', 'P'),
    ],
  },
  {
    id: 'personality-jp-4',
    phase: 'C',
    type: 'card-select',
    prompt: '看电影：你打算周末看一部电影。你通常：',
    options: [
      personalityOption('personality-jp-4-a', '提前选好片子、下载好、定好几点开始看', 'J'),
      personalityOption('personality-jp-4-b', '到了时间随便翻，看到哪个海报顺眼就看哪个', 'P'),
    ],
  },
  {
    id: 'personality-jp-5',
    phase: 'C',
    type: 'card-select',
    prompt: '做旅行攻略：和朋友计划一次短期旅游。你在团队里通常扮演：',
    options: [
      personalityOption('personality-jp-5-a', '负责订车票、酒店、列出每日景点和时间表的人', 'J'),
      personalityOption('personality-jp-5-b', '跟着走就行，或者只提“我想去这个地方”，具体随性', 'P'),
    ],
  },
  {
    id: 'personality-jp-6',
    phase: 'C',
    type: 'card-select',
    prompt: '整理笔记：期末考试前复习，你的笔记或电子文档通常是：',
    options: [
      personalityOption('personality-jp-6-a', '有清晰的大纲、标题、分点，查找方便', 'J'),
      personalityOption('personality-jp-6-b', '比较分散，有些在书上、有些在便签、有些在手机备忘录，但自己知道在哪', 'P'),
    ],
  },
];

const LEGACY_ABILITY_TESTS: Question[] = [
  {
    id: 'ability-language-1',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '语言学 1/5', title: '未知语言：词序', lines: ['nala tor = 蓝色的河', 'nala ven = 蓝色的树', 'sori tor = 红色的河'] },
    prompt: '“红色的树”最可能怎么说？',
    correctFeedback: '正确。前一个词表示颜色，后一个词表示名词。',
    incorrectFeedback: '先比较 nala/sori 和 tor/ven 的位置变化。',
    options: [
      { id: 'lang1-a', label: 'sori ven', correct: true, riasecWeights: { I: 4, C: 1 }, personalityTags: ['pattern-detection'] },
      { id: 'lang1-b', label: 'ven sori', riasecWeights: {} },
      { id: 'lang1-c', label: 'nala sori', riasecWeights: {} },
      { id: 'lang1-d', label: 'tor ven', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-language-2',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '语言学 2/5', title: '未知语言：复数', lines: ['meka tor = 大河', 'meka tori = 大河们', 'lumi ven = 小树'] },
    prompt: '“小树们”最可能怎么说？',
    correctFeedback: '正确。复数是在名词后加 i，所以 ven 变成 veni。',
    incorrectFeedback: '观察 tor 和 tori 的差别，复数标记附着在名词后。',
    options: [
      { id: 'lang2-a', label: 'lumi veni', correct: true, riasecWeights: { I: 4, C: 1 }, personalityTags: ['rule-transfer'] },
      { id: 'lang2-b', label: 'lumii ven', riasecWeights: {} },
      { id: 'lang2-c', label: 'ven lumi', riasecWeights: {} },
      { id: 'lang2-d', label: 'meka veni', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-language-3',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '语言学 3/5', title: '未知语言：主语替换', lines: ['mi nala ven = 我看蓝树', 'tu nala ven = 你看蓝树', 'mi sori tor = 我看红河'] },
    prompt: '“你看红河”最可能怎么说？',
    correctFeedback: '正确。mi/tu 是主语，我/你；后面颜色和名词保持同样顺序。',
    incorrectFeedback: '只替换主语和颜色，不要改变词序。',
    options: [
      { id: 'lang3-a', label: 'tu sori tor', correct: true, riasecWeights: { I: 4, C: 1 }, personalityTags: ['compositional'] },
      { id: 'lang3-b', label: 'mi sori ven', riasecWeights: {} },
      { id: 'lang3-c', label: 'sori tu tor', riasecWeights: {} },
      { id: 'lang3-d', label: 'tu tor sori', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-language-4',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '语言学 4/5', title: '未知语言：时间标记', lines: ['ka mi tor = 我昨天去河边', 'na mi tor = 我明天去河边', 'ka tu ven = 你昨天去树边'] },
    prompt: '“你明天去树边”最可能怎么说？',
    correctFeedback: '正确。ka/na 表示昨天/明天，mi/tu 表示我/你，tor/ven 表示河边/树边。',
    incorrectFeedback: '时间标记在最前面，主语在中间，地点在最后。',
    options: [
      { id: 'lang4-a', label: 'na tu ven', correct: true, riasecWeights: { I: 4, C: 1 }, personalityTags: ['syntax'] },
      { id: 'lang4-b', label: 'ka tu ven', riasecWeights: {} },
      { id: 'lang4-c', label: 'tu na ven', riasecWeights: {} },
      { id: 'lang4-d', label: 'na mi ven', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-language-5',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '语言学 5/5', title: '未知语言：组合迁移', lines: ['mi meka veni = 我看大树们', 'tu lumi tor = 你看小河', 'daro = 石头'] },
    prompt: '“你看小石头们”最可能怎么说？',
    correctFeedback: '正确。tu = 你，lumi = 小，daro 加复数 i 变 daroi。',
    incorrectFeedback: '把主语、形容词、名词和复数标记分别组合起来。',
    options: [
      { id: 'lang5-a', label: 'tu lumi daroi', correct: true, riasecWeights: { I: 5, C: 1 }, personalityTags: ['transfer'] },
      { id: 'lang5-b', label: 'mi lumi daro', riasecWeights: {} },
      { id: 'lang5-c', label: 'tu daro lumi', riasecWeights: {} },
      { id: 'lang5-d', label: 'lumi tu daroi', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-symbol-1',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '符号规则 1/4', title: '符号运算', lines: ['A ⊕ B = A 后面接 B', 'A ★ B = B 后面接 A', '例：红 ⊕ 蓝 = 红蓝'] },
    prompt: '“猫 ★ 鱼”的结果是什么？',
    correctFeedback: '正确。★ 会把后面的内容放到前面。',
    incorrectFeedback: '注意 ★ 和 ⊕ 的方向相反。',
    options: [
      { id: 'sym1-a', label: '鱼猫', correct: true, riasecWeights: { I: 3, C: 2 }, personalityTags: ['formal-rule'] },
      { id: 'sym1-b', label: '猫鱼', riasecWeights: {} },
      { id: 'sym1-c', label: '鱼鱼', riasecWeights: {} },
      { id: 'sym1-d', label: '猫猫', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-symbol-2',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '符号规则 2/4', title: '括号规则', lines: ['f(x) = x + 2', 'g(x) = 3x', '先算括号内，再算外层'] },
    prompt: 'f(g(2)) 的结果是多少？',
    correctFeedback: '正确。g(2)=6，f(6)=8。',
    incorrectFeedback: '先算 g(2)，再把结果放进 f。',
    options: [
      { id: 'sym2-a', label: '8', correct: true, riasecWeights: { I: 4, C: 2 }, personalityTags: ['formal-calculation'] },
      { id: 'sym2-b', label: '6', riasecWeights: {} },
      { id: 'sym2-c', label: '10', riasecWeights: {} },
      { id: 'sym2-d', label: '12', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-symbol-3',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '符号规则 3/4', title: '代码追踪', lines: ['开始：x = 2', '第 1 步：x = x + 3', '第 2 步：x = 2 * x'] },
    prompt: '执行完两步后，x 等于多少？',
    correctFeedback: '正确。先变成 5，再变成 10。',
    incorrectFeedback: '变量会被更新，第二步用的是更新后的 x。',
    options: [
      { id: 'sym3-a', label: '10', correct: true, riasecWeights: { I: 3, C: 3, R: 1 }, personalityTags: ['program-tracing'] },
      { id: 'sym3-b', label: '7', riasecWeights: {} },
      { id: 'sym3-c', label: '8', riasecWeights: {} },
      { id: 'sym3-d', label: '12', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-symbol-4',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '符号规则 4/4', title: '分类规则', lines: ['若对象有 A 特征，放入 1 类', '若对象没有 A 但有 B，放入 2 类', '若 A、B 都没有，放入 3 类'] },
    prompt: '一个对象没有 A，但有 B，应放入哪一类？',
    correctFeedback: '正确。第二条规则命中：没有 A 但有 B。',
    incorrectFeedback: '按规则顺序判断，先看 A，再看 B。',
    options: [
      { id: 'sym4-a', label: '2 类', correct: true, riasecWeights: { I: 3, C: 3 }, personalityTags: ['classification'] },
      { id: 'sym4-b', label: '1 类', riasecWeights: {} },
      { id: 'sym4-c', label: '3 类', riasecWeights: {} },
      { id: 'sym4-d', label: '无法判断', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-data-1',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '数据推理 1/4', title: '比例判断', lines: ['A 班：20 人中 5 人选择机器人社', 'B 班：40 人中 8 人选择机器人社', '比较“比例”，不是人数'] },
    prompt: '哪个班选择机器人社的比例更高？',
    correctFeedback: '正确。A 班是 25%，B 班是 20%。',
    incorrectFeedback: '人数多不等于比例高，先分别除以总人数。',
    options: [
      { id: 'data1-a', label: 'A 班', correct: true, riasecWeights: { I: 3, C: 2 }, personalityTags: ['numeracy'] },
      { id: 'data1-b', label: 'B 班', riasecWeights: {} },
      { id: 'data1-c', label: '一样高', riasecWeights: {} },
      { id: 'data1-d', label: '无法比较', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-data-2',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '数据推理 2/4', title: '增长率', lines: ['第一周：10 个用户', '第二周：15 个用户', '第三周：21 个用户'] },
    prompt: '从第二周到第三周的增长率最接近多少？',
    correctFeedback: '正确。从 15 到 21 增加 6，6/15 = 40%。',
    incorrectFeedback: '增长率用增加量除以前一周的基数。',
    options: [
      { id: 'data2-a', label: '40%', correct: true, riasecWeights: { I: 3, C: 2 }, personalityTags: ['quantitative'] },
      { id: 'data2-b', label: '30%', riasecWeights: {} },
      { id: 'data2-c', label: '50%', riasecWeights: {} },
      { id: 'data2-d', label: '60%', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-data-3',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '数据推理 3/4', title: '加权平均', lines: ['平时作业占 40%，得 80 分', '期末考试占 60%，得 90 分', '总评 = 0.4 * 作业 + 0.6 * 期末'] },
    prompt: '总评是多少？',
    correctFeedback: '正确。0.4*80 + 0.6*90 = 86。',
    incorrectFeedback: '不要直接平均 80 和 90，要按权重计算。',
    options: [
      { id: 'data3-a', label: '86', correct: true, riasecWeights: { I: 3, C: 3 }, personalityTags: ['weighted-thinking'] },
      { id: 'data3-b', label: '85', riasecWeights: {} },
      { id: 'data3-c', label: '88', riasecWeights: {} },
      { id: 'data3-d', label: '90', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-data-4',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '数据推理 4/4', title: '异常值', lines: ['五次测试：10、11、12、13、60', '多数数据集中在 10 到 13', '60 明显远离其他值'] },
    prompt: '如果要描述“典型水平”，哪种说法更谨慎？',
    correctFeedback: '正确。异常值会显著拉高平均数，中位数更稳健。',
    incorrectFeedback: '注意 60 是异常值，会改变平均数。',
    options: [
      { id: 'data4-a', label: '中位数更能代表典型水平', correct: true, riasecWeights: { I: 3, C: 2 }, personalityTags: ['data-sense'] },
      { id: 'data4-b', label: '平均数一定最可靠', riasecWeights: {} },
      { id: 'data4-c', label: '只看最大值 60', riasecWeights: {} },
      { id: 'data4-d', label: '这些数据无法描述', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-science-1',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '科学实验 1/4', title: '变量控制', lines: ['变量控制 = 一次只改变一个因素', '目标：测试肥料是否影响植物高度', '其他条件尽量保持一致'] },
    prompt: '最合理的实验设计是哪一个？',
    correctFeedback: '正确。只改变肥料，其他条件尽量一致。',
    incorrectFeedback: '一次只改变你要研究的因素。',
    options: [
      { id: 'sci1-a', label: '一组加肥料，一组不加，水和光照尽量一样', correct: true, riasecWeights: { I: 3, C: 2, R: 1 }, personalityTags: ['scientific'] },
      { id: 'sci1-b', label: '一组加肥料且多晒太阳，另一组不加且少晒太阳', riasecWeights: {} },
      { id: 'sci1-c', label: '只观察一盆植物', riasecWeights: {} },
      { id: 'sci1-d', label: '问同学觉得肥料有没有用', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-science-2',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '科学实验 2/4', title: '相关与因果', lines: ['发现：喝咖啡多的人熬夜也多', '可能：咖啡导致熬夜', '也可能：熬夜的人更需要咖啡'] },
    prompt: '最严谨的判断是？',
    correctFeedback: '正确。相关不等于因果，需要进一步实验或控制变量。',
    incorrectFeedback: '看到共同变化时，先警惕第三变量或反向因果。',
    options: [
      { id: 'sci2-a', label: '只能说二者相关，不能直接断定因果', correct: true, riasecWeights: { I: 4, C: 2 }, personalityTags: ['causal-reasoning'] },
      { id: 'sci2-b', label: '一定是咖啡导致熬夜', riasecWeights: {} },
      { id: 'sci2-c', label: '一定是熬夜导致咖啡', riasecWeights: {} },
      { id: 'sci2-d', label: '数据没有任何意义', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-science-3',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '科学实验 3/4', title: '样本偏差', lines: ['想了解全校学生睡眠情况', '只调查篮球队 20 人', '篮球队作息可能不代表全校'] },
    prompt: '这个调查最大的风险是什么？',
    correctFeedback: '正确。样本来源太单一，可能不代表总体。',
    incorrectFeedback: '关键不是 20 这个数字本身，而是样本来源偏了。',
    options: [
      { id: 'sci3-a', label: '样本偏差', correct: true, riasecWeights: { I: 3, C: 2, S: 1 }, personalityTags: ['sampling'] },
      { id: 'sci3-b', label: '计算太复杂', riasecWeights: {} },
      { id: 'sci3-c', label: '问题太简单', riasecWeights: {} },
      { id: 'sci3-d', label: '不需要调查', riasecWeights: {} },
    ],
  },
  {
    id: 'ability-science-4',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '科学实验 4/4', title: '证据强度', lines: ['同学甲说：我试过一次，有用', '实验乙：100 人随机分组，重复三轮', '结论需要看证据质量'] },
    prompt: '哪种证据更可靠？',
    correctFeedback: '正确。随机分组和重复实验更能减少偶然性。',
    incorrectFeedback: '个人经验有价值，但证据强度通常低于可重复实验。',
    options: [
      { id: 'sci4-a', label: '实验乙更可靠', correct: true, riasecWeights: { I: 4, C: 2 }, personalityTags: ['evidence-based'] },
      { id: 'sci4-b', label: '同学甲更可靠', riasecWeights: {} },
      { id: 'sci4-c', label: '二者完全一样', riasecWeights: {} },
      { id: 'sci4-d', label: '都不能提供任何信息', riasecWeights: {} },
    ],
  },
];

const CORRECT_ABILITY_WEIGHTS: Partial<Record<RIASECDimension, number>> = { I: 4, C: 1 };

function lampLanguageOption(
  id: string,
  label: string,
  correct = false,
  personalityTags: string[] = [],
): QuestionOption {
  return {
    id,
    label,
    correct: correct || undefined,
    riasecWeights: correct ? CORRECT_ABILITY_WEIGHTS : {},
    personalityTags: correct ? personalityTags : undefined,
  };
}

function surakartaOption(
  id: string,
  label: string,
  correct = false,
  personalityTags: string[] = [],
): QuestionOption {
  return {
    id,
    label,
    correct: correct || undefined,
    riasecWeights: correct ? CORRECT_ABILITY_WEIGHTS : {},
    personalityTags: correct ? personalityTags : undefined,
  };
}

function surakartaBoard(
  pieces: AbilityBoardPiece[],
  caption: string,
  focus: string[] = [],
): AbilityBoard {
  return { pieces, caption, focus };
}

const ABILITY_TESTS: Question[] = [
  {
    id: 'ability-jinchao-lamp-1',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '烬潮城的灯语 1/8', title: '第一题：灰墙上的三重刻痕', lines: [] },
    abilityPuzzle: {
      scene: '你穿越到一座没有太阳的异世界城市——烬潮城。每到夜晚，黑潮会从地下涌出，城里的人用一种被探险家称为“灯语”的语言交流。\n\n你从裂开的天空坠入烬潮城，醒来时正靠在一面灰墙下。墙上刻着门、桥、水、井和灯的图案。部分图案旁边留下了探险家的中文注释。',
      hint: '同一个后缀般的影子词，常常改变前面那个东西的性质。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-jinchao-gray-wall-20260607-v1.png'),
      tables: [
        {
          columns: ['灯语', '中文意思'],
          rows: [
            ['vark', '门'],
            ['sel', '桥'],
            ['omi', '水'],
            ['kora', '井'],
            ['lio', '灯'],
            ['vark oru', '古门'],
            ['sel oru', '古桥'],
            ['omi nesh', '黑水'],
            ['kora nesh', '黑井'],
            ['sel sai', '受庇护的桥'],
            ['lio sai', '受庇护的灯'],
          ],
        },
      ],
    },
    prompt: '灰墙上还有一幅被火烧缺的图：一口井上方画着白色灯圈，旁边刻着 `kora sai`。它最可能表示什么？',
    correctFeedback: '正确。sai 是后置修饰词，表示“受庇护的 / 安全的”，kora sai 就是受庇护的井。',
    incorrectFeedback: '先比较 sel sai 和 lio sai，判断 sai 放在名词后时表示什么。',
    options: [
      lampLanguageOption('jinchao-lamp-1-a', '受庇护的井', true, ['linguistic-pattern', 'modifier-after-noun']),
      lampLanguageOption('jinchao-lamp-1-b', '受庇护的水'),
      lampLanguageOption('jinchao-lamp-1-c', '黑井'),
      lampLanguageOption('jinchao-lamp-1-d', '古桥'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-2',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '烬潮城的灯语 2/8', title: '第二题：祈灯室的残缺名册', lines: [] },
    abilityPuzzle: {
      scene: '你沿着墙上的灯痕前进，进入一间废弃的祈灯室。室内挂着小斗篷、铜灯架和一排空名牌。桌上有一本被黑潮泡烂的名册，记录了灯童、守夜人、潮影和灯具。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-jinchao-lamp-registry-20260607-v1.png'),
      tables: [
        {
          columns: ['灯语', '中文意思'],
          rows: [
            ['ko ena', '一名灯童'],
            ['nar ena-ri', '两名灯童'],
            ['sen vel-ri', '三名守夜人'],
            ['nar moru-ri', '两只潮影'],
            ['ko lio', '一盏灯'],
            ['nar lio-ta', '两盏灯'],
            ['sen vark-ta', '三扇门'],
            ['nar kora-ta nesh', '两口黑井'],
          ],
        },
      ],
    },
    prompt: '名册缺页上画着三盏被白色灯圈围住的灯。这个标签最可能应该写作什么？',
    correctFeedback: '正确。sen 表示三，非活物复数用 -ta，sai 仍放在整个名词单位后面。',
    incorrectFeedback: '先区分活物复数 -ri 和非活物复数 -ta，再看修饰词 sai 的位置。',
    options: [
      lampLanguageOption('jinchao-lamp-2-a', 'sen lio-ri sai'),
      lampLanguageOption('jinchao-lamp-2-b', 'sai sen lio-ta'),
      lampLanguageOption('jinchao-lamp-2-c', 'sen lio-ta sai', true, ['rule-transfer', 'morphology', 'modifier-after-noun']),
      lampLanguageOption('jinchao-lamp-2-d', 'sen lio sai-ta'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-3',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '烬潮城的灯语 3/8', title: '第三题：桥边审讯记录', lines: [] },
    abilityPuzzle: {
      scene: '你离开祈灯室，来到一座断桥前。桥边石碑刻着几句像是审讯记录的话。探险家翻译了其中几句，并在石碑底部写了一行小字：',
      hint: '这里的小词比词序更重要。谁做事、给谁、对什么做事，都有标记。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-jinchao-bridge-record-20260607-v1.png'),
      tables: [
        {
          columns: ['灯语', '中文意思'],
          rows: [
            ['mi e omi u mir-a.', '我喝水。'],
            ['vel e vark u rek-a.', '守夜人开启门。'],
            ['mi e sel sai ra ru-a.', '我去受庇护的桥。'],
            ['vel e ena ra lio u dar-a.', '守夜人把灯交给灯童。'],
            ['moru e vark nesh ra ru-a.', '潮影去黑门那边。'],
          ],
        },
      ],
    },
    prompt: '石碑背面还有一句未译文字：`ena e vel ra omi nesh u dar-a.` 它最可能是什么意思？',
    correctFeedback: '正确。e 标记动作发出者，ra 标记接受者，u 标记被给予物。',
    incorrectFeedback: '用 vel e ena ra lio u dar-a. 作为模板，替换给予者、接受者和物品。',
    options: [
      lampLanguageOption('jinchao-lamp-3-a', '灯童把黑水交给守夜人。', true, ['syntax-role', 'compositional-reasoning']),
      lampLanguageOption('jinchao-lamp-3-b', '守夜人把黑水交给灯童。'),
      lampLanguageOption('jinchao-lamp-3-c', '灯童喝了黑水。'),
      lampLanguageOption('jinchao-lamp-3-d', '潮影去黑井那边。'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-4',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '烬潮城的灯语 4/8', title: '第四题：钟塔下的潮汐预言', lines: [] },
    abilityPuzzle: {
      scene: '你进入烬潮城中央的钟塔。塔底刻着一圈潮汐预言，旁边的探险家笔记比之前更潦草：',
      hint: '黑潮涨起前，必须分清已经发生、正在发生和即将发生。黑井水不能喝。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-jinchao-clocktower-prophecy-20260607-v1.png'),
      tables: [
        {
          columns: ['灯语', '中文意思'],
          rows: [
            ['mi e vark u rek-o.', '我开启了门。'],
            ['mi e vark u rek-a.', '我正在开启门。'],
            ['mi e vark u rek-el.', '我将开启门。'],
            ['tu e sel sai ra ru-el.', '你将去受庇护的桥。'],
            ['mi e omi u ma mir-a.', '我不喝水。'],
            ['omi nesh u ma mir-ke.', '不要喝黑水！'],
          ],
        },
      ],
    },
    prompt: '潮门忽然用你的声音说话。守夜人盯着你，等你表明下一步。你要表达“我将不会开启黑门”，应选择哪一句？',
    correctFeedback: '正确。将来时用 -el，否定 ma 放在动词前，开启黑门仍用宾语标记 u。',
    incorrectFeedback: '先保留“我 + 黑门 + 开启”的结构，再加入否定 ma 和将来时 -el。',
    options: [
      lampLanguageOption('jinchao-lamp-4-a', 'mi e vark nesh u ma rek-el.', true, ['tense-negation', 'syntax-role']),
      lampLanguageOption('jinchao-lamp-4-b', 'mi e vark nesh u ma rek-o.'),
      lampLanguageOption('jinchao-lamp-4-c', 'vark nesh u ma rek-ke.'),
      lampLanguageOption('jinchao-lamp-4-d', 'mi e vark nesh ra ma ru-el.'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-5',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '烬潮城的灯语 5/8', title: '第五题：失灯的灯童', lines: [] },
    abilityPuzzle: {
      scene: '黑潮第一次越过街沟。一名灯童摔在墙根，胸前的灯碎成两半。两只潮影贴着墙面滑近。守夜人抱着一盏备用灯，却被潮声震住，迟迟没有动作。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-jinchao-lost-lamp-child-20260607-v1.png'),
    },
    prompt: '你只能喊出一句灯语。哪一句最能立刻改变局势？',
    correctFeedback: '正确。局势里最需要的是让守夜人把灯交给灯童，命令句 -ke 能立刻发出指令。',
    incorrectFeedback: '先判断场景目标：灯童失去灯，守夜人有备用灯，危险正在逼近。',
    options: [
      lampLanguageOption('jinchao-lamp-5-a', 'ena ra lio u dar-ke.', true, ['scene-judgment', 'imperative', 'syntax-role']),
      lampLanguageOption('jinchao-lamp-5-b', 'ena ra omi u dar-ke.'),
      lampLanguageOption('jinchao-lamp-5-c', 'moru-ri e ena ra ru-a.'),
      lampLanguageOption('jinchao-lamp-5-d', 'mi e sel sai ra ru-el.'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-6',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '烬潮城的灯语 6/8', title: '第六题：黑井边的银光', lines: [] },
    abilityPuzzle: {
      scene: '灯童带你们穿过祈灯室后的窄巷。井口的水泛着银光，井沿却粘着黑色盐痕。你的同伴没有看过钟塔预言，已经把手伸进井里。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-jinchao-black-well-20260607-v1.png'),
    },
    prompt: '你必须在他饮下前作出反应。选出最合适的一句。',
    correctFeedback: '正确。黑井水不能喝，应使用否定命令：不要喝黑水。',
    incorrectFeedback: '银光不是关键，黑色盐痕和前面的预言才是危险线索。',
    options: [
      lampLanguageOption('jinchao-lamp-6-a', 'omi nesh u mir-ke.'),
      lampLanguageOption('jinchao-lamp-6-b', 'omi nesh u ma mir-ke.', true, ['scene-judgment', 'danger-recognition', 'tense-negation']),
      lampLanguageOption('jinchao-lamp-6-c', 'mi e kora nesh ra ru-el.'),
      lampLanguageOption('jinchao-lamp-6-d', 'tu e sel sai ra ru-el.'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-7',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '烬潮城的灯语 7/8', title: '第七题：会说话的潮门', lines: [] },
    abilityPuzzle: {
      scene: '岔路左边是一扇黑门，门内传来亲人的声音。右边是一座刻着 `sai` 标记的桥，桥下黑潮翻滚。守夜人抬起长杖，挡在路中央，似乎只等你说出选择。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-jinchao-talking-gate-20260607-v1.png'),
    },
    prompt: '哪一句最可能让守夜人放你通过？',
    correctFeedback: '正确。sai 标记受庇护的桥，说“我将去受庇护的桥”最符合安全路线。',
    incorrectFeedback: '黑门会诱惑人；守夜人等待你表明的是路线选择，不是开门或过去发生的事。',
    options: [
      lampLanguageOption('jinchao-lamp-7-a', 'mi e vark nesh u rek-el.'),
      lampLanguageOption('jinchao-lamp-7-b', 'mi e sel sai ra ru-el.', true, ['scene-judgment', 'safe-route', 'future-tense']),
      lampLanguageOption('jinchao-lamp-7-c', 'tu e sel sai ra ru-o.'),
      lampLanguageOption('jinchao-lamp-7-d', 'vel e vark u rek-o.'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-8',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '烬潮城的灯语 8/8', title: '第八题：潮桥前的交灯仪式', lines: [] },
    abilityPuzzle: {
      scene: '桥面尽头，三名灯童排成一列。每个人都举着一盏灯，灯柄朝向你。守夜人退到一旁，向灯童们低头。你的同伴压低声音问：“他们要做什么？”',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-jinchao-lamp-ritual-20260607-v1.png'),
    },
    prompt: '根据你已掌握的灯语，哪一句最像对此时情景的判断？',
    correctFeedback: '正确。三名灯童将把三盏灯交给你，句子同时用到了复数、给予结构和将来时。',
    incorrectFeedback: '根据动作判断：灯童们举着灯柄朝向你，守夜人退让，说明他们要把灯交给你。',
    options: [
      lampLanguageOption('jinchao-lamp-8-a', 'sen ena-ri e mi ra sen lio-ta u dar-el.', true, ['scene-judgment', 'morphology', 'syntax-role', 'future-tense']),
      lampLanguageOption('jinchao-lamp-8-b', 'sen ena-ri e sen lio-ta ra mi u dar-el.'),
      lampLanguageOption('jinchao-lamp-8-c', 'sen ena-ri e kora nesh ra ru-el.'),
      lampLanguageOption('jinchao-lamp-8-d', 'mi e sen ena-ri ra lio u dar-el.'),
    ],
  },
];

const SURAKARTA_ABILITY_TESTS: Question[] = [
  {
    id: 'ability-surakarta-1-step-count',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '苏拉卡尔塔棋局 1/6', title: '第一题：基础邻移计数', lines: [] },
    abilityPuzzle: {
      scene: '第二个能力场景切换到一张 6 x 6 交点棋盘。你面前的是标准苏拉卡尔塔棋残局：棋子落在交点上，普通移动只能走到周围一格的空交点，吃子才会使用外侧回路。',
      hint: '本题只问“不经过回路”的普通邻移。目标点必须相邻，而且必须是空点。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-step-count-20260607-v1.png'),
      board: surakartaBoard(
        [
          { side: 'W', at: 'B2' },
          { side: 'B', at: 'C2' },
          { side: 'W', at: 'D2' },
          { side: 'W', at: 'B3' },
          { side: 'B', at: 'C3' },
          { side: 'B', at: 'D3' },
        ],
        '目标棋子：黑棋 C3。只统计普通邻移，不统计旋吃。',
        ['C3'],
      ),
    },
    prompt: '黑棋 C3 不经过回路时，有几种合法邻移？',
    correctFeedback: '正确。C3 周围只有 B4、C4、D4 是空的相邻交点。',
    incorrectFeedback: '先看 C3 周围 8 个交点，再排除已被黑白棋占住的位置。',
    options: [
      surakartaOption('surakarta-1-a', '3 种：B4、C4、D4', true, ['spatial-reasoning', 'local-constraint-check']),
      surakartaOption('surakarta-1-b', '5 种：B2、C2、D2、B4、D4'),
      surakartaOption('surakarta-1-c', '2 种：C4、D4'),
      surakartaOption('surakarta-1-d', '8 种：周围八个交点都可以走'),
    ],
  },
  {
    id: 'ability-surakarta-2-capture-targets',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '苏拉卡尔塔棋局 2/6', title: '第二题：单子旋吃目标判断', lines: [] },
    abilityPuzzle: {
      scene: '你已经知道普通邻移的规则。现在棋局进入苏拉卡尔塔棋最特殊的部分：吃子必须沿横竖线穿过至少一个回路，路径中不能提前撞上任何棋子。',
      hint: '经过回路之前遇到的敌子不是可吃目标，而是阻塞点。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-loop-capture-20260607-v1.png'),
      board: surakartaBoard(
        [
          { side: 'W', at: 'F3' },
          { side: 'B', at: 'D4' },
          { side: 'W', at: 'E4' },
          { side: 'W', at: 'C6' },
          { side: 'W', at: 'D6' },
        ],
        '目标棋子：黑棋 D4。只数可以经过回路旋吃到的白棋坐标。',
        ['D4'],
      ),
    },
    prompt: '黑棋 D4 当前可以旋吃到几枚白棋？',
    correctFeedback: '正确。D4 可以经回路吃到 F3 和 C6；E4、D6 在对应方向上提前阻塞。',
    incorrectFeedback: '不要把相邻白棋直接算作可吃目标，苏拉卡尔塔棋吃子必须先经过回路。',
    options: [
      surakartaOption('surakarta-2-a', '2 枚：F3、C6', true, ['rule-transfer', 'path-blocking']),
      surakartaOption('surakarta-2-b', '4 枚：F3、E4、C6、D6'),
      surakartaOption('surakarta-2-c', '1 枚：F3'),
      surakartaOption('surakarta-2-d', '0 枚：D4 当前没有旋吃'),
    ],
  },
  {
    id: 'ability-surakarta-3-side-captures',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '苏拉卡尔塔棋局 3/6', title: '第三题：全局旋吃数量', lines: [] },
    abilityPuzzle: {
      scene: '棋盘上不止一枚黑棋。你需要从局部判断升级到全局扫描：分别检查每枚黑棋从四个正交方向出发，是否能经过回路吃到白棋。',
      hint: '同一个终点只按一手棋计数；本题要求列出所有黑方合法旋吃。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-global-scan-20260607-v1.png'),
      board: surakartaBoard(
        [
          { side: 'B', at: 'B2' },
          { side: 'W', at: 'A3' },
          { side: 'B', at: 'C3' },
          { side: 'W', at: 'F3' },
          { side: 'B', at: 'D4' },
          { side: 'W', at: 'F5' },
          { side: 'W', at: 'B6' },
          { side: 'W', at: 'C6' },
        ],
        '黑方行动。请扫描所有黑棋，而不是只看 D4。',
        ['B2', 'C3', 'D4'],
      ),
    },
    prompt: '黑方当前一共有多少个合法旋吃走法？',
    correctFeedback: '正确。四个旋吃是 B2xF5、C3xA3、D4xC6、D4xF3。',
    incorrectFeedback: '把每枚黑棋都当作起点检查一次，并确认路径是否先经过回路。',
    options: [
      surakartaOption('surakarta-3-a', '4 个：B2xF5、C3xA3、D4xC6、D4xF3', true, ['global-scan', 'path-enumeration']),
      surakartaOption('surakarta-3-b', '3 个：C3xA3、D4xC6、D4xF3'),
      surakartaOption('surakarta-3-c', '5 个：再加 D4xE4'),
      surakartaOption('surakarta-3-d', '2 个：D4xC6、D4xF3'),
    ],
  },
  {
    id: 'ability-surakarta-4-piece-legal-moves',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '苏拉卡尔塔棋局 4/6', title: '第四题：单子总合法走法计数', lines: [] },
    abilityPuzzle: {
      scene: '这一题把两套规则合并：普通邻移看周围八格，旋吃看横竖方向和回路。你需要把两类合法走法合在一起计数。',
      hint: '普通邻移不能吃子；旋吃必须经过回路。两类走法不要混在同一条规则里判断。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-legal-moves-20260607-v1.png'),
      board: surakartaBoard(
        [
          { side: 'B', at: 'C3' },
          { side: 'W', at: 'F3' },
          { side: 'B', at: 'D4' },
          { side: 'W', at: 'E4' },
          { side: 'B', at: 'E5' },
          { side: 'W', at: 'C6' },
          { side: 'W', at: 'D6' },
        ],
        '目标棋子：黑棋 D4。统计普通邻移和旋吃的总数。',
        ['D4'],
      ),
    },
    prompt: '黑棋 D4 当前总共有几种合法走法？',
    correctFeedback: '正确。D4 有 5 个普通邻移，加上 D4xC6、D4xF3 两个旋吃，共 7 种。',
    incorrectFeedback: '先单独数普通邻移，再单独数经过回路后的旋吃目标。',
    options: [
      surakartaOption('surakarta-4-a', '7 种：5 个邻移，加 D4xC6、D4xF3', true, ['compositional-reasoning', 'move-counting']),
      surakartaOption('surakarta-4-b', '5 种：只包括普通邻移'),
      surakartaOption('surakarta-4-c', '6 种：5 个邻移，加 D4xF3'),
      surakartaOption('surakarta-4-d', '8 种：5 个邻移，加 D4xC6、D4xF3、D4xE4'),
    ],
  },
  {
    id: 'ability-surakarta-5-mate-in-one',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '苏拉卡尔塔棋局 5/6', title: '第五题：一步获胜判断', lines: [] },
    abilityPuzzle: {
      scene: '残局越来越短。白方只剩最后一枚棋子，黑方先行。你需要判断有没有一手棋能立刻吃掉它。',
      hint: '如果一手吃掉对方最后一枚棋子，就立即获胜。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-final-capture-20260607-v1.png'),
      board: surakartaBoard(
        [
          { side: 'W', at: 'F3' },
          { side: 'B', at: 'D4' },
        ],
        '黑方先行。白方只剩 F3 一枚棋子。',
        ['D4'],
      ),
    },
    prompt: '黑方是否有一步必胜？',
    correctFeedback: '正确。D4 可以经回路旋吃 F3，吃掉白方最后一枚棋子后立即获胜。',
    incorrectFeedback: '不要只看相邻关系；检查 D4 是否能沿直线进入回路后到达 F3。',
    options: [
      surakartaOption('surakarta-5-a', '有，唯一获胜走法是 D4xF3', true, ['terminal-state', 'capture-recognition']),
      surakartaOption('surakarta-5-b', '有，唯一获胜走法是 D4-E4'),
      surakartaOption('surakarta-5-c', '没有，D4 与 F3 不相邻'),
      surakartaOption('surakarta-5-d', '有，唯一获胜走法是 D4xE4'),
    ],
  },
  {
    id: 'ability-surakarta-6-forced-win-depth',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '苏拉卡尔塔棋局 6/6', title: '第六题：两手内强制必胜', lines: [] },
    abilityPuzzle: {
      scene: '最后一题不是只看眼前能不能吃，而是看一个很小的博弈树。黑方第一手走完后，无论白方怎样逃，黑方下一手都要能吃掉白方唯一棋子。',
      hint: '强制必胜的关键是：第一手不能只制造一种威胁，而要覆盖白方所有合法应手。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-forced-win-20260607-v1.png'),
      board: surakartaBoard(
        [
          { side: 'B', at: 'A2' },
          { side: 'W', at: 'D2' },
          { side: 'B', at: 'E2' },
        ],
        '黑方先行。目标是保证黑方第二手吃掉白方唯一棋子。',
        ['A2', 'E2'],
      ),
    },
    prompt: '黑方是否具有两手内强制必胜策略？',
    correctFeedback: '正确。A2-B3 后，无论白方如何应对，黑方下一手都能吃掉白方唯一棋子。',
    incorrectFeedback: '检验第一手后白方的所有合法应手；只威胁一种逃法不算强制必胜。',
    options: [
      surakartaOption('surakarta-6-a', '有，唯一最优第一手是 A2-B3', true, ['search-planning', 'strategy-tree']),
      surakartaOption('surakarta-6-b', '有，唯一最优第一手是 E2-D3'),
      surakartaOption('surakarta-6-c', '有，黑方现在可以直接 E2xD2'),
      surakartaOption('surakarta-6-d', '没有，白棋 D2 总能逃出包围'),
    ],
  },
];

const SCENARIO_TESTS: Question[] = [
  {
    id: 'scenario-role',
    phase: 'C',
    type: 'rank-select',
    imageSrc: '/images/explore/discover/generated/q31-short-video-placeholder.svg',
    prompt: '情景 1/5：如果你刷短视频，你最喜欢刷哪一类内容？请排出前三名。',
    maxSelections: 3,
    rankWeights: [5, 3, 1],
    options: [
      { id: 'shortvideo-repair', label: '维修改装 / 3D 打印 / 工具测评', riasecWeights: { R: 1 }, personalityTags: ['hands-on'] },
      { id: 'shortvideo-science', label: '黑洞 / 疫苗 / 芯片原理硬核科普', riasecWeights: { I: 1 }, personalityTags: ['science-curious'] },
      { id: 'shortvideo-create', label: 'vlog / 漫画 / 音乐 / 设计创作', riasecWeights: { A: 1 }, personalityTags: ['creative'] },
      { id: 'shortvideo-help', label: '学习方法 / 心理沟通 / 成长故事', riasecWeights: { S: 1 }, personalityTags: ['care-driven'] },
      { id: 'shortvideo-business', label: '商业营销 / 创业 / 电商运营', riasecWeights: { E: 1 }, personalityTags: ['market-aware'] },
      { id: 'shortvideo-order', label: '效率工具 / 资料整理 / 学习规划', riasecWeights: { C: 1 }, personalityTags: ['organized'] },
    ],
  },
  {
    id: 'scenario-injury',
    phase: 'C',
    type: 'ai-dialogue',
    imageSrc: DISCOVER_IMAGE(9),
    prompt: '情景 2/5：如果你穿越到三国，你最想成为哪个角色？',
    subtext: '可以写真实人物，也可以写一种角色。请说明你为什么选他/她，以及你会靠什么方式在那个时代立足。Agent 会根据回答返回六维兴趣倾向评分。',
    placeholder: '我最想成为……因为……如果在三国立足，我会……',
  },
  {
    id: 'scenario-conflict',
    phase: 'C',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(10),
    prompt: '情景 3/5：团队因为路线选择吵起来了。你第一句话最可能是？',
    options: [
      { id: 'conflict-data', label: '“先把地图、补给和风险列出来。”', riasecWeights: { I: 2, C: 3 }, personalityTags: ['structured'] },
      { id: 'conflict-emotion', label: '“大家先冷静一下，每个人说清楚担心什么。”', riasecWeights: { S: 4 }, personalityTags: ['mediating'] },
      { id: 'conflict-command', label: '“先按我的方案走，路上再调整。”', riasecWeights: { E: 4 }, personalityTags: ['decisive'] },
      { id: 'conflict-try', label: '“先派两个人探路，十分钟后再定。”', riasecWeights: { R: 3, I: 1 }, personalityTags: ['experimental'] },
    ],
  },
  {
    id: 'scenario-resource',
    phase: 'C',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(11),
    prompt: '情景 4/5：小队只剩一份关键资源，你会优先按什么原则分配？',
    options: [
      { id: 'resource-need', label: '谁最需要，先给谁', riasecWeights: { S: 4 }, personalityTags: ['care'] },
      { id: 'resource-output', label: '给最能提升小队成功率的人', riasecWeights: { E: 3, C: 1 }, personalityTags: ['outcome-driven'] },
      { id: 'resource-rule', label: '按事先约定的规则执行', riasecWeights: { C: 4 }, personalityTags: ['principled'] },
      { id: 'resource-invent', label: '先尝试替代方案，避免直接二选一', riasecWeights: { A: 2, I: 2, R: 1 }, personalityTags: ['creative-problem-solving'] },
    ],
  },
  {
    id: 'scenario-trust',
    phase: 'C',
    type: 'free-text',
    imageSrc: DISCOVER_IMAGE(15),
    prompt: '情景 5/5：如果你是这个小队的一员，你最希望别人依赖你哪一件事？为什么？',
    placeholder: '我希望别人依赖我……因为……',
    minLength: 12,
  },
];

const VALUE_TESTS: Question[] = [
  {
    id: 'value-life-goal',
    phase: 'D',
    type: 'career-scenario',
    imageSrc: DISCOVER_IMAGE(12),
    prompt: '职业倾向 —— 情景测试题',
    careerScenario: {
      scene:
        '如果一觉醒来，你发现整座城市似乎只剩下你一个人；手机没有信号。大街上空荡荡的，还有很多地方一地狼藉；像是发生过什么灵异事件。你想起你还没吃早饭，周围的超市大门敞开；远处隐隐约约听到一些规律的噪声。',
      sceneImageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-empty-city-no-signal-20260607-v1.png'),
      firstPrompt: '你的第一反应是......',
      firstOptions: [
        { id: 'city-calm-analyze', label: '保持冷静，尝试分析出当下的处境和可能的威胁再行动', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'structured'] },
        { id: 'city-story-clues', label: '观察周围场景和任何不自然的现象，试着在脑海中想出一个合理的故事', riasecWeights: { A: 1, I: 1 }, personalityTags: ['creative', 'pattern-seeking'] },
        { id: 'city-supplies-first', label: '事已至此、我可能仍有危险，先搜集点物资回家再说', riasecWeights: { R: 1, C: 1 }, personalityTags: ['practical', 'risk-aware'] },
        { id: 'city-find-survivors', label: '远处似乎还有幸存者。我想去确认情况，如果真的有人，就先把大家组织起来。', riasecWeights: { S: 1, E: 1 }, personalityTags: ['social', 'organizer'] },
      ],
      itemScene:
        '你想了想，决定先走进超市。货架上的物品几乎被洗劫一空，地上散着包装袋、碎玻璃和被翻乱的购物篮。就在你准备继续往里走时，门外突然传来一阵急促的汽车鸣笛，声音越来越近，你一下慌了神。',
      itemImageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-looted-supermarket-horn-20260607-v1.png'),
      itemPrompt: '你只能从眼前还能拿到的物品里快速选 4 组带走。你的第一反应会选哪 4 组？请按优先级从先到后排列。',
      itemMaxSelections: 4,
      itemOptions: [
        { id: 'city-item-headlamp', label: '头灯、备用电池、小镜子', riasecWeights: { R: 2, A: 1 }, personalityTags: ['action-ready', 'observant'] },
        { id: 'city-item-water-food', label: '瓶装水、能量棒、密封面包', riasecWeights: { C: 3 }, personalityTags: ['stability-first'] },
        { id: 'city-item-map-radio-pencil', label: '城区折页地图、便携收音机、铅笔', riasecWeights: { I: 2, C: 1 }, personalityTags: ['information-seeking', 'structured'] },
        { id: 'city-item-first-aid-protection', label: '碘伏棉片、弹性绷带、一次性手套', riasecWeights: { S: 2, R: 1 }, personalityTags: ['helper', 'risk-aware'] },
        { id: 'city-item-contact-signal', label: '对讲机、反光背心、口哨', riasecWeights: { E: 2, S: 1 }, personalityTags: ['connector', 'organizer'] },
        { id: 'city-item-record-label', label: '拍立得相机、透明文件袋、防水记号笔', riasecWeights: { A: 2, I: 1 }, personalityTags: ['expressive', 'pattern-seeking'] },
        { id: 'city-item-repair-tools', label: '尼龙绳、宽胶带、螺丝刀', riasecWeights: { R: 2, E: 1 }, personalityTags: ['practical', 'resourceful'] },
        { id: 'city-item-inventory', label: '大号收纳袋、标签贴、小记账本', riasecWeights: { C: 1, I: 1, A: 1 }, personalityTags: ['organized', 'record-keeper'] },
        { id: 'city-item-care-comfort', label: '毛巾、暖宝宝、硬糖', riasecWeights: { S: 2, A: 1 }, personalityTags: ['supportive', 'empathetic'] },
        { id: 'city-item-power-card-calculator', label: '移动电源、预付电话卡、小型计算器', riasecWeights: { E: 2, I: 1 }, personalityTags: ['connector', 'judgment'] },
      ],
      openScene:
        '远方驶来一辆车，是一批和你一样不知道发生了什么的幸存者；他们邀请你接下来一起探索城市、发掘真相。你们一共有4名成员。决定一起在这个未知的世界中探明真相。',
      openImageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-survivor-team-20260607-v1.png'),
      teamPrompt: '大家在交换彼此的意见，你倾向于接下来首先应该做什么？',
      teamOptions: [
        { id: 'city-team-analyze-info', label: '整理一下大家已有的信息，分析造成这一切的原因', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'structured'] },
        { id: 'city-team-name-photo', label: '给我们的队伍先起个好听的名字并拍一张集体照', riasecWeights: { A: 1, I: 1 }, personalityTags: ['creative', 'story-maker'] },
        { id: 'city-team-inventory', label: '计算一下车上的物资还够维持多久、是否齐全', riasecWeights: { R: 1, C: 1 }, personalityTags: ['practical', 'stability-first'] },
        { id: 'city-team-find-others', label: '尽快沿着路一直走，沿途可能还有其余的幸存者', riasecWeights: { S: 1, E: 1 }, personalityTags: ['social', 'connector'] },
      ],
      openPrompt: '大家决定分工。你觉得自己在这个四人小队里最适合承担什么角色？',
      openFields: [
        { id: 'teamRole', label: '（可选）大家决定分工。你觉得自己在这个四人小队里最适合承担什么角色？', type: 'text', placeholder: '我可以当一名技术大佬 / 领导组织者 / 物资后勤保障 / 联络外界 / 鼓舞人心……' },
      ],
    },
  },
  {
    id: 'value-moral-line',
    phase: 'D',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(13),
    prompt: '道德判断：一个选择能提高效率，但会让少数人明显受损，你会怎么判断？',
    options: [
      { id: 'moral-efficiency', label: '看总体收益，只要结果足够好就可以接受', riasecWeights: { E: 3, C: 1 }, personalityTags: ['utilitarian'] },
      { id: 'moral-rights', label: '先保护少数人的基本权益', riasecWeights: { S: 4, I: 1 }, personalityTags: ['fairness'] },
      { id: 'moral-rules', label: '先看规则和程序是否正当', riasecWeights: { C: 4, I: 1 }, personalityTags: ['principled'] },
      { id: 'moral-redesign', label: '重新设计方案，不轻易接受二选一', riasecWeights: { A: 2, I: 2, S: 1 }, personalityTags: ['creative-problem-solving'] },
    ],
  },
  {
    id: 'value-tradeoff',
    phase: 'D',
    type: 'card-select',
    imageSrc: DISCOVER_IMAGE(14),
    prompt: '专业选择里，如果只能优先考虑一个，你会选？',
    options: [
      { id: 'trade-interest', label: '长期兴趣：我愿意每天继续学', riasecWeights: { I: 2, A: 2 }, personalityTags: ['intrinsic'] },
      { id: 'trade-income', label: '现实回报：就业、收入、确定性', riasecWeights: { E: 3, C: 2 }, personalityTags: ['pragmatic'] },
      { id: 'trade-society', label: '社会价值：这件事是否帮助真实的人', riasecWeights: { S: 4 }, personalityTags: ['purpose-driven'] },
      { id: 'trade-mastery', label: '专业深度：我能不能成为高手', riasecWeights: { I: 3, R: 1, C: 1 }, personalityTags: ['mastery'] },
    ],
  },
  {
    id: 'value-open',
    phase: 'D',
    type: 'free-text',
    imageSrc: DISCOVER_IMAGE(16),
    prompt: '开放题：如果 10 年后你对现在的自己说“这个选择是值得的”，那时最重要的证据会是什么？',
    placeholder: '10 年后我会觉得值得，是因为……',
    minLength: 12,
  },
];

const AI_DIALOGUE_QUESTIONS: Question[] = [
  {
    id: 'ai-career-spark',
    phase: 'D',
    type: 'ai-dialogue',
    imageSrc: DISCOVER_IMAGE(16),
    prompt: 'AI 补充题：用几轮短对话补上问卷没有问到的真实兴趣线索',
    subtext: '可以打字，也可以使用浏览器语音转文字。AI 只返回候选评分，最终结果仍由系统校验后合并。',
  },
];

const FULL_QUESTION_BANK: Question[] = [
  ...BASIC_INFO,
  ...INTEREST_TAG_QUESTIONS,
  ...CORE_QUESTIONS,
  ...PERSONALITY_QUESTIONS,
  ...LEGACY_ABILITY_TESTS,
  ...ABILITY_TESTS,
  ...SURAKARTA_ABILITY_TESTS,
  ...SCENARIO_TESTS,
  ...AI_DIALOGUE_QUESTIONS,
  ...VALUE_TESTS,
];

const ACTIVE_QUESTION_IDS = [
  'basic-profile',
  'interest-tags-1',
  'interest-tags-2',
  'interest-tags-3',
  'personality-ei-1',
  'personality-ei-2',
  'personality-ei-3',
  'personality-ei-4',
  'personality-ei-5',
  'personality-ei-6',
  'personality-sn-1',
  'personality-sn-2',
  'personality-sn-3',
  'personality-sn-4',
  'personality-sn-5',
  'personality-sn-6',
  'personality-tf-1',
  'personality-tf-2',
  'personality-tf-3',
  'personality-tf-4',
  'personality-tf-5',
  'personality-tf-6',
  'personality-jp-1',
  'personality-jp-2',
  'personality-jp-3',
  'personality-jp-4',
  'personality-jp-5',
  'personality-jp-6',
  'ability-jinchao-lamp-1',
  'ability-jinchao-lamp-2',
  'ability-jinchao-lamp-3',
  'ability-jinchao-lamp-4',
  'ability-jinchao-lamp-5',
  'ability-jinchao-lamp-6',
  'ability-jinchao-lamp-7',
  'ability-jinchao-lamp-8',
  'value-life-goal',
] as const;

export const ALL_QUESTIONS: Question[] = ACTIVE_QUESTION_IDS.map((questionId) => {
  const question = FULL_QUESTION_BANK.find((item) => item.id === questionId);
  if (!question) throw new Error(`Missing active Discover question: ${questionId}`);
  return question;
});

function isProfileValue(value: AnswerValue): value is { fields: Record<string, string | string[]> } {
  return typeof value === 'object' && !Array.isArray(value) && 'fields' in value;
}

export function isAiDialogueValue(value: AnswerValue): value is AiDialogueAnswer {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'messages' in value &&
    'scoringSummary' in value
  );
}

export function createEmptyAiDialogueAnswer(): AiDialogueAnswer {
  return {
    dialogueId: null,
    messages: [],
    scoringSummary: {
      deltas: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
      topDimensions: [],
      confidence: 0,
    },
    completed: false,
  };
}

export function createEmptyCareerScenarioAnswer(): CareerScenarioAnswer {
  return {
    firstChoiceId: '',
    itemChoiceIds: [],
    teamChoiceId: '',
    openResponses: {
      teamRole: '',
    },
    aiDialogue: createEmptyAiDialogueAnswer(),
  };
}

export function isCareerScenarioValue(value: AnswerValue | undefined): value is CareerScenarioAnswer {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'firstChoiceId' in value &&
    'itemChoiceIds' in value &&
    'openResponses' in value &&
    'aiDialogue' in value
  );
}

function collectProfileOptions(question: Question, value: AnswerValue): QuestionOption[] {
  if (!question.profileFields || !isProfileValue(value)) return [];
  const options: QuestionOption[] = [];

  for (const field of question.profileFields) {
    const selected = value.fields[field.id];
    const selectedIds = Array.isArray(selected) ? selected : selected ? [selected] : [];
    for (const id of selectedIds) {
      const option = field.options?.find((item) => item.id === id);
      if (option) options.push(option);
    }
  }

  return options;
}

export function computeRawScores(answers: Answer[]): RIASECScores {
  const scores: RIASECScores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

  for (const answer of answers) {
    const question = ALL_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;

    switch (question.type) {
      case 'profile-form': {
        for (const opt of collectProfileOptions(question, answer.value)) {
          for (const [dim, weight] of Object.entries(opt.riasecWeights)) {
            scores[dim as RIASECDimension] += weight;
          }
        }
        break;
      }

      case 'interest-tag-grid':
      case 'multi-select': {
        const selectedIds = answer.value as string[];
        for (const optId of selectedIds) {
          const opt = question.options?.find((o) => o.id === optId);
          if (opt) {
            for (const [dim, weight] of Object.entries(opt.riasecWeights)) {
              scores[dim as RIASECDimension] += weight;
            }
          }
        }
        break;
      }

      case 'rank-select': {
        if (!Array.isArray(answer.value)) break;
        const rankWeights = question.rankWeights ?? [5, 3, 1];
        answer.value.forEach((optId, rankIndex) => {
          const rankWeight = rankWeights[rankIndex] ?? 0;
          if (rankWeight <= 0) return;
          const opt = question.options?.find((o) => o.id === optId);
          if (!opt) return;
          for (const [dim, weight] of Object.entries(opt.riasecWeights)) {
            scores[dim as RIASECDimension] += weight * rankWeight;
          }
        });
        break;
      }

      case 'career-scenario': {
        const careerValue = answer.value;
        if (!isCareerScenarioValue(careerValue)) break;
        const scenario = question.careerScenario;
        if (!scenario) break;

        const firstOption = scenario.firstOptions.find((option) => option.id === careerValue.firstChoiceId);
        if (firstOption) {
          for (const [dim, weight] of Object.entries(firstOption.riasecWeights)) {
            scores[dim as RIASECDimension] += weight;
          }
        }

        for (const optId of careerValue.itemChoiceIds) {
          const opt = scenario.itemOptions.find((option) => option.id === optId);
          if (!opt) continue;
          for (const [dim, weight] of Object.entries(opt.riasecWeights)) {
            scores[dim as RIASECDimension] += weight;
          }
        }

        const teamOption = scenario.teamOptions?.find((option) => option.id === careerValue.teamChoiceId);
        if (teamOption) {
          for (const [dim, weight] of Object.entries(teamOption.riasecWeights)) {
            scores[dim as RIASECDimension] += weight;
          }
        }

        if (isAiDialogueValue(careerValue.aiDialogue)) {
          for (const [dim, weight] of Object.entries(careerValue.aiDialogue.scoringSummary.deltas)) {
            scores[dim as RIASECDimension] += Number(weight);
          }
        }
        break;
      }

      case 'card-select': {
        const selectedId = answer.value as string;
        const opt = question.options?.find((o) => o.id === selectedId);
        if (opt) {
          for (const [dim, weight] of Object.entries(opt.riasecWeights)) {
            scores[dim as RIASECDimension] += weight;
          }
        }
        break;
      }

      case 'scenario-pair': {
        const selectedId = answer.value as string;
        const pair = question.scenarioPair;
        if (!pair) break;
        const chosen = selectedId === pair.optionA.id ? pair.optionA : pair.optionB;
        for (const [dim, weight] of Object.entries(chosen.riasecWeights)) {
          scores[dim as RIASECDimension] += weight;
        }
        break;
      }

      case 'slider': {
        const sliderValue = answer.value as number;
        const config = question.sliderConfig;
        if (!config) break;
        const leftFactor = (100 - sliderValue) / 100;
        const rightFactor = sliderValue / 100;

        for (const [dim, weight] of Object.entries(config.leftWeights)) {
          scores[dim as RIASECDimension] += weight * leftFactor;
        }
        for (const [dim, weight] of Object.entries(config.rightWeights)) {
          scores[dim as RIASECDimension] += weight * rightFactor;
        }
        break;
      }

      case 'free-text':
        break;

      case 'ai-dialogue': {
        if (!isAiDialogueValue(answer.value)) break;
        for (const [dim, weight] of Object.entries(answer.value.scoringSummary.deltas)) {
          scores[dim as RIASECDimension] += weight;
        }
        break;
      }
    }
  }

  return scores;
}

export function extractPersonalityTraits(answers: Answer[]): Record<string, number> {
  const traits: Record<string, number> = {};

  for (const answer of answers) {
    const question = ALL_QUESTIONS.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const collectTags = (opt: QuestionOption) => {
      if (!opt.personalityTags) return;
      for (const tag of opt.personalityTags) {
        traits[tag] = (traits[tag] || 0) + 1;
      }
    };

    switch (question.type) {
      case 'profile-form': {
        for (const opt of collectProfileOptions(question, answer.value)) {
          collectTags(opt);
        }
        break;
      }
      case 'interest-tag-grid':
      case 'multi-select': {
        const selectedIds = answer.value as string[];
        for (const optId of selectedIds) {
          const opt = question.options?.find((o) => o.id === optId);
          if (opt) collectTags(opt);
        }
        break;
      }
      case 'rank-select': {
        const selectedIds = Array.isArray(answer.value) ? answer.value : [];
        for (const optId of selectedIds) {
          const opt = question.options?.find((o) => o.id === optId);
          if (opt) collectTags(opt);
        }
        break;
      }
      case 'career-scenario': {
        const careerValue = answer.value;
        if (!isCareerScenarioValue(careerValue) || !question.careerScenario) break;
        const firstOption = question.careerScenario.firstOptions.find((option) => option.id === careerValue.firstChoiceId);
        if (firstOption) collectTags(firstOption);
        for (const optId of careerValue.itemChoiceIds) {
          const opt = question.careerScenario.itemOptions.find((option) => option.id === optId);
          if (opt) collectTags(opt);
        }
        const teamOption = question.careerScenario.teamOptions?.find((option) => option.id === careerValue.teamChoiceId);
        if (teamOption) collectTags(teamOption);
        break;
      }
      case 'card-select': {
        const opt = question.options?.find((o) => o.id === answer.value);
        if (opt) collectTags(opt);
        break;
      }
      case 'scenario-pair': {
        const pair = question.scenarioPair;
        if (!pair) break;
        const chosen = answer.value === pair.optionA.id ? pair.optionA : pair.optionB;
        collectTags(chosen);
        break;
      }
      case 'slider':
      case 'free-text':
      case 'ai-dialogue':
        break;
    }
  }

  return traits;
}

export function extractOpenEndedAnswers(answers: Answer[]): Record<string, string> {
  const result: Record<string, string> = {};

  for (const answer of answers) {
    const question = ALL_QUESTIONS.find((q) => q.id === answer.questionId);
    if (question?.type === 'free-text' && typeof answer.value === 'object' && 'text' in answer.value) {
      result[question.id] = answer.value.text;
    }
    if (question?.type === 'career-scenario' && isCareerScenarioValue(answer.value)) {
      for (const [fieldId, text] of Object.entries(answer.value.openResponses)) {
        if (text.trim()) result[`${question.id}.${fieldId}`] = text;
      }
      const userText = answer.value.aiDialogue.messages
        .filter((message) => message.role === 'user')
        .map((message) => message.content)
        .join('\n');
      if (userText) result[`${question.id}.agent`] = userText;
    }
    if (question?.type === 'ai-dialogue' && isAiDialogueValue(answer.value)) {
      const userText = answer.value.messages
        .filter((message) => message.role === 'user')
        .map((message) => message.content)
        .join('\n');
      if (userText) result[question.id] = userText;
    }
    if (question?.type === 'profile-form' && isProfileValue(answer.value)) {
      for (const field of question.profileFields ?? []) {
        const value = answer.value.fields[field.id];
        if (typeof value === 'string') {
          result[`${question.id}.${field.id}`] = value;
        }
      }
    }
  }

  return result;
}

export const ADVISOR_INTRO_MESSAGES = [
  '先完成基本信息，再进入现学现考、情景模拟和价值判断。',
  '系统会根据所有回答生成 Top3 专业推荐和一份报告。',
];

export const ADVISOR_TRANSITION_B = '进入逻辑能力和学习能力的现学现考题。';
export const ADVISOR_TRANSITION_C = '进入情景下的对话和开放式模拟。';
export const ADVISOR_TRANSITION_D = '进入职业倾向开放题。';
export const ADVISOR_COMPUTING = '正在生成推荐专业 Top3 和报告。';
