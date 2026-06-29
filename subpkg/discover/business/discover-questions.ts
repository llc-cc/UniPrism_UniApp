/**
 * AUTO-SYNCED from UniPrism_New-main/lib/discover-questions.ts
 * Do not edit manually — run: npm run questions:sync
 * Synced at: 2026-06-18T05:00:23.775Z
 */

import {
  HOLLAND_FINE_DIMENSION_DATA,
  HOLLAND_FINE_DIMENSION_ORDER,
  type HollandFineBankItem,
  type HollandFineBankSection,
} from './hollandFineQuestionBank';
import { DISCOVER_ABILITY_QUESTION_IDS } from './discoverAbilityModule';
import { getTopDimensions, normalizeScores, RIASECDimension, RIASECScores } from '../../../business/riasecEngine';
import { SURAKARTA_PUZZLES_V2, type SurakartaPuzzle } from './surakarta/puzzles';

export type QuestionType =
  | 'profile-form'
  | 'interest-tag-grid'
  | 'multi-select'
  | 'rank-select'
  | 'scenario-pair'
  | 'slider'
  | 'card-select'
  | 'career-scenario'
  | 'holland-fine-grained'
  | 'career-calibration-scale'
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
  hollandFineAxis?: {
    dimension: RIASECDimension;
    axisKey: string;
    axisLabel: string;
    side: 'left' | 'right';
    sideKey: string;
    sideLabel: string;
  };
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
  visible?: boolean;
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

export interface AbilityPuzzleVisual {
  imageSrc: string;
  title?: string;
  kind?: 'scene' | 'clue';
}

export interface AbilityPuzzle {
  scene: string;
  imageSrc: string;
  hint?: string;
  tables?: AbilityPuzzleTable[];
  board?: AbilityBoard;
  visuals?: AbilityPuzzleVisual[];
}

export interface CareerScenarioConfig {
  scene: string;
  sceneImageSrc?: string;
  sceneImageMode?: 'per-section' | 'single';
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

export interface HollandFineQuestionConfig extends HollandFineBankSection {
  dimension: RIASECDimension;
  dimensionLabel: string;
  sourcePath: string;
}

export type CareerCalibrationDimensionKey =
  | 'stabilityChangeTolerance'
  | 'innovationMeaningNeed'
  | 'moneyStatusWeight'
  | 'riskUncertaintyTolerance'
  | 'workLifeBoundaryPreference';

export type CareerCalibrationScoringDirection = 'positive' | 'reverse';

export interface CareerCalibrationQuestionConfig {
  sourcePath: string;
  dimension: CareerCalibrationDimensionKey;
  dimensionLabel: string;
  scoringDirection: CareerCalibrationScoringDirection;
  questionNumber: number;
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
  hollandFine?: HollandFineQuestionConfig;
  careerCalibration?: CareerCalibrationQuestionConfig;
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

export interface HollandFineAnswerItemValue {
  selectedOptionIds?: string[];
  openResponses?: Record<string, string>;
}

export interface HollandFineAnswer {
  items: Record<string, HollandFineAnswerItemValue>;
}

export type AnswerValue =
  | string
  | string[]
  | number
  | { text: string }
  | { fields: Record<string, string | string[]> }
  | CareerScenarioAnswer
  | HollandFineAnswer
  | AiDialogueAnswer;

export interface Answer {
  questionId: string;
  value: AnswerValue;
  timestamp: number;
}

export const MBTI_KNOWN_QUESTION_ID = 'personality-mbti-known-type';

export type MbtiLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export type MbtiDimensionKey = 'EI' | 'SN' | 'TF' | 'JP';
export type MbtiSource = 'self-selected' | 'system-tested';

export interface MbtiDimensionScore {
  dimension: MbtiDimensionKey;
  left: MbtiLetter;
  right: MbtiLetter;
  leftScore: number;
  rightScore: number;
  selected: MbtiLetter;
}

export interface MbtiProfile {
  type: string;
  source: MbtiSource;
  confidence: number;
  scores: Record<MbtiLetter, number>;
  dimensions: MbtiDimensionScore[];
  answerIds: string[];
  selectedOptionIds: string[];
}

const DISCOVER_IMAGE = (index: number) => `/images/explore/discover/generated/interest-q-${String(index).padStart(2, '0')}-v1.png`;
const DISCOVER_GENERATED_IMAGE = (fileName: string) => `/images/explore/discover/generated/${fileName}`;
const DISCOVER_ASSESSMENT_MBTI_IMAGE = (sectionKey: string, index: number) =>
  DISCOVER_GENERATED_IMAGE(`discover-question-scene-mbti-${sectionKey}-doc-${String(index + 1).padStart(2, '0')}-20260615-semantic-v5.png`);
const DISCOVER_ASSESSMENT_HOLLAND_IMAGE = (sectionSlug: string, index: number) =>
  DISCOVER_GENERATED_IMAGE(`discover-question-scene-holland-${sectionSlug}-${String(index + 1).padStart(2, '0')}-20260615-semantic-v5.png`);
const DISCOVER_ASSESSMENT_DEEP_HOLLAND_SCENE_IMAGE = (sectionSlug: string, sceneIndex: number) =>
  DISCOVER_GENERATED_IMAGE(`discover-question-scene-deep-holland-${sectionSlug}-scene-${String(sceneIndex + 1).padStart(2, '0')}-20260625-v1.png`);
const DISCOVER_CAREER_CALIBRATION_IMAGE = (index: number) =>
  DISCOVER_GENERATED_IMAGE(`discover-question-scene-career-calibration-${String(index + 1).padStart(2, '0')}-20260616-semantic-v1.png`);
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

function stableOptionShuffle<T extends { id: string }>(items: T[], seed: string): T[] {
  return [...items].sort((left, right) =>
    stableInterestHash(`${seed}:${left.id}:career-option-order-20260611`) -
    stableInterestHash(`${seed}:${right.id}:career-option-order-20260611`),
  );
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
    iconSrc: DISCOVER_CHOICE_ICON(`discover-choice-icon-interest-${source.id}-20260610-v5.png`),
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

type MbtiQuestionSeed = {
  id: string;
  prompt: string;
  leftLabel: string;
  leftLetter: MbtiLetter;
  rightLabel: string;
  rightLetter: MbtiLetter;
};

const MBTI_QUESTION_SECTIONS = {
  ei: {
    leftLetter: 'E',
    rightLetter: 'I',
    items: [
      ['到一个新班级或新社团时，我通常会：', '主动和别人聊天，尽快熟悉环境', '先观察一段时间，等熟悉后再交流'],
      ['忙了一周后，我更想通过以下方式恢复状态：', '约朋友出去玩、聊天、参加活动', '一个人休息、看书、听音乐或打游戏'],
      ['小组讨论时，我更常：', '边说边整理想法', '先想清楚，再选择性发言'],
      ['当我有一个新想法时，我通常会：', '很快说出来，和别人一起碰撞', '先自己琢磨，想成熟后再说'],
      ['在很多人参加的活动中，我通常：', '越聊越有精神', '时间久了会想安静一下'],
      ['面对陌生同学，我通常：', '比较容易主动开启话题', '需要一点时间进入状态'],
      ['我更喜欢的课堂形式是：', '有互动、讨论、展示和活动', '有安静思考、独立完成任务的空间'],
      ['当遇到烦恼时，我更可能：', '找朋友说出来，边说边理清楚', '先自己消化，不一定马上告诉别人'],
      ['在团队项目中，我更自然的角色是：', '带动气氛，协调大家交流', '深入思考，负责比较安静但重要的部分'],
      ['别人通常会觉得我：', '比较外向、好接近', '比较安静、慢热'],
      ['我在表达观点时，通常：', '说出来以后更容易想清楚', '想清楚以后才更愿意说出来'],
      ['如果连续几天都有社交活动，我会：', '觉得挺充实，甚至还想继续', '感觉消耗比较大，需要独处恢复'],
      ['在课间或宿舍休息时，我通常更倾向于：', '找人聊天、开玩笑或一起活动', '安静待一会儿，做自己的事情'],
      ['当老师提出一个开放性问题时，我通常会：', '比较愿意现场说出自己的看法', '更希望先思考，再决定是否回答'],
      ['对我来说，认识新朋友通常是：', '一件比较自然、轻松的事情', '一件需要时间慢慢适应的事情'],
    ],
  },
  sn: {
    leftLetter: 'S',
    rightLetter: 'N',
    items: [
      ['学习新知识时，我更喜欢：', '先看具体例子、步骤和应用', '先理解整体概念、规律和意义'],
      ['选择专业时，我更关注：', '这个专业具体学什么、就业路径是否清楚', '这个专业未来可能带来的发展空间'],
      ['做作业或项目时，我更擅长：', '按要求一步步完成', '提出新想法、新角度'],
      ['听老师讲课时，我更容易记住：', '具体案例、定义、公式、操作方法', '背后的逻辑、趋势、框架和可能性'],
      ['我更喜欢的学习资料是：', '重点明确、结构清晰、有例题', '启发思考、有观点、有延展内容'],
      ['当别人提出一个计划时，我通常先想：', '现实中能不能执行', '有没有更有创意的可能'],
      ['我更喜欢的任务是：', '要求清楚、目标具体', '空间较大、可以自由发挥'],
      ['看待问题时，我更常关注：', '眼前实际情况和已有事实', '未来趋势和潜在机会'],
      ['我更相信：', '已经验证过的方法', '新思路和新可能'],
      ['做选择时，我更喜欢依据：', '现实条件、数据、经验', '灵感、方向感、长远想象'],
      ['当我读一本书或看一个视频时，我更容易被吸引的是：', '具体内容是否实用', '它带来的启发和想象空间'],
      ['我通常更像：', '关注细节、事实和当下', '关注概念、意义和未来'],
      ['面对一个复杂问题时，我通常会先：', '找出已有信息和具体条件', '思考这个问题背后的可能规律'],
      ['当老师布置一个开放作业时，我更希望：', '老师给出清楚要求和评分标准', '老师给我较大的发挥空间'],
      ['我在理解一个知识点时，更依赖：', '例题、步骤、图表和实际操作', '比喻、联想、框架和整体理解'],
    ],
  },
  tf: {
    leftLetter: 'T',
    rightLetter: 'F',
    items: [
      ['朋友向我倾诉问题时，我通常会：', '帮他分析原因，提出解决办法', '先理解他的感受，给他情绪支持'],
      ['小组合作中，如果有人拖延，我更倾向于：', '直接指出问题，希望提高效率', '注意表达方式，避免伤害关系'],
      ['做重要决定时，我更看重：', '逻辑是否成立，结果是否有效', '是否照顾到自己和他人的感受'],
      ['我更希望别人评价我：', '理性、公正、有判断力', '温暖、体贴、善解人意'],
      ['发生争论时，我通常更在意：', '哪个观点更有道理', '双方关系会不会变僵'],
      ['如果老师或同学批评我，我更容易关注：', '批评内容是否合理，能否帮助改进', '对方语气和态度是否让我舒服'],
      ['团队做决策时，我更倾向于：', '按标准、数据、效率判断', '考虑大家是否能接受'],
      ['我认为一个好决定应该首先：', '客观、清楚、有效', '合适、体贴、让人舒服'],
      ['当规则和人情冲突时，我通常更倾向于：', '维护规则和公平', '结合具体情况照顾感受'],
      ['我在表达不同意见时，更看重：', '把问题讲清楚', '让对方更容易接受'],
      ['面对一个失败的项目，我首先会想：', '问题出在哪里，如何改进', '大家的感受如何，如何安抚和鼓励'],
      ['我更像是：', '用理性分析做判断', '用价值感和关系感做判断'],
      ['当朋友问我真实意见时，我通常会：', '直接说出我的判断，即使不太好听', '尽量用温和方式表达，避免让对方难受'],
      ['在评价一个方案时，我更重视：', '方案是否高效、合理、有结果', '方案是否照顾到参与者的感受'],
      ['当班级或小组需要分工时，我更倾向于：', '按能力和效率分配任务', '尽量考虑每个人的意愿和感受'],
    ],
  },
  jp: {
    leftLetter: 'J',
    rightLetter: 'P',
    items: [
      ['面对考试复习，我通常会：', '提前安排计划，按进度推进', '看状态调整，临近考试时效率更高'],
      ['我的书桌、电脑文件或学习资料通常：', '比较有分类和秩序', '不一定整齐，但我自己知道在哪里'],
      ['做项目时，我更喜欢：', '尽早确定主题和方案', '多探索一段时间，最后再定'],
      ['周末安排上，我更喜欢：', '提前约好时间和活动', '随性一点，看当天状态'],
      ['当计划被临时改变时，我通常：', '会有点不舒服，希望重新安排', '可以接受，随机应变也不错'],
      ['我更喜欢的任务状态是：', '截止时间清楚、要求明确', '空间灵活，可以边做边调整'],
      ['完成作业时，我更接近：', '分阶段完成，尽量不拖到最后', '灵感来了集中完成'],
      ['对未来规划，我更倾向于：', '尽早设定目标，按计划推进', '保持开放，边探索边决定'],
      ['当有很多任务时，我通常会：', '列清单、排优先级', '先做最想做或最紧急的'],
      ['我更喜欢：', '确定感和稳定节奏', '灵活感和变化空间'],
      ['如果一个活动没有明确安排，我会：', '想知道具体流程和时间', '觉得这样也挺自由'],
      ['我通常更像：', '先计划，再行动', '先行动，再根据情况调整'],
      ['面对一项长期任务，我更习惯：', '先拆分步骤，再逐步完成', '先大致开始，过程中不断调整'],
      ['当截止日期还比较远时，我通常会：', '提前启动，避免最后赶工', '等压力明显后再集中完成'],
      ['我对生活和学习安排的偏好更接近：', '有计划、有节奏、心里更踏实', '保持弹性、随时调整、更自在'],
    ],
  },
} as const satisfies Record<string, {
  leftLetter: MbtiLetter;
  rightLetter: MbtiLetter;
  items: readonly (readonly [string, string, string])[];
}>;

function createMbtiQuestions(sectionKey: keyof typeof MBTI_QUESTION_SECTIONS): Question[] {
  const section = MBTI_QUESTION_SECTIONS[sectionKey];
  return section.items.map(([prompt, leftLabel, rightLabel], index) => {
    const questionId = `personality-${sectionKey}-doc-${String(index + 1).padStart(2, '0')}`;
    return {
      id: questionId,
      phase: 'C',
      type: 'card-select',
      imageSrc: DISCOVER_ASSESSMENT_MBTI_IMAGE(sectionKey, index),
      prompt,
      options: [
        personalityOption(`${questionId}-a`, leftLabel, section.leftLetter),
        personalityOption(`${questionId}-b`, rightLabel, section.rightLetter),
      ],
    };
  });
}

type HollandScaleQuestionSeed = {
  dimension: RIASECDimension;
  slug: string;
  prompts: string[];
};

const HOLLAND_SCALE_CHOICES = [
  { id: '5', label: '非常符合', score: 5 },
  { id: '4', label: '符合', score: 4 },
  { id: '3', label: '一般', score: 3 },
  { id: '2', label: '不符合', score: 2 },
  { id: '1', label: '非常不符合', score: 1 },
] as const;

const HOLLAND_SCALE_SECTIONS: HollandScaleQuestionSeed[] = [
  {
    dimension: 'R',
    slug: 'r',
    prompts: [
      '我喜欢研究电子产品、电脑配件、相机、无人机或游戏设备是怎么工作的。',
      '如果学校有机器人、无人机、赛车模型、3D打印或工程制作类活动，我会想参加。',
      '我喜欢把一个想法真正做出来，比如模型、装置、手工、实验作品或技术作品。',
      '比起只听理论课，我更喜欢实验课、实训课、体育训练课或实践操作课。',
      '当电脑、耳机、手机、打印机或其他设备出问题时，我会想尝试自己解决。',
      '我愿意学习摄影设备、剪辑设备、实验仪器、运动器械或专业工具的使用方法。',
      '我对智能硬件、汽车、建筑、航空、机械、电子设备或运动训练比较感兴趣。',
      '如果一个任务需要搭建、调试、安装、修复或操作设备，我通常不会排斥。',
      '我喜欢看到自己亲手完成的东西有实际效果，而不只是停留在想法上。',
      '如果未来的专业或职业能接触技术设备、工程现场、实验室或运动训练，我会觉得有吸引力。',
    ],
  },
  {
    dimension: 'I',
    slug: 'i',
    prompts: [
      '我喜欢研究一个现象背后的原因，比如为什么某个App会火，为什么短视频让人停不下来。',
      '当一个观点很流行时，我会想查资料、看数据，而不是马上相信。',
      '我对AI、心理学、医学、经济、科技、社会热点背后的规律感兴趣。',
      '我喜欢分析问题，比如学习效率为什么下降、一个产品为什么成功、一个游戏机制为什么吸引人。',
      '遇到复杂问题时，我愿意慢慢推理，而不是只听别人给结论。',
      '我喜欢用数据、证据、实验或逻辑来支持自己的看法。',
      '我愿意学习编程、数据分析、统计、建模、实验设计或AI工具的原理。',
      '如果一个游戏、影视作品、品牌或社交平台很受欢迎，我会想分析它成功的原因。',
      '我喜欢解决有挑战的问题，比如数学题、推理题、策略题、编程题或商业案例分析。',
      '如果未来能做研究、数据分析、科技开发、医学、金融分析或咨询类工作，我会感兴趣。',
    ],
  },
  {
    dimension: 'A',
    slug: 'a',
    prompts: [
      '我喜欢拍照、剪视频、写文案、做海报、画画、设计PPT或制作内容。',
      '我会注意一个视频、账号、游戏、电影、品牌或海报的画面风格和审美。',
      '我喜欢有创意发挥空间的作业，比如短片、演讲、故事、展示、海报或活动策划。',
      '我经常会想到一些有趣的点子，比如视频选题、人物设定、标题文案、视觉风格或剧情创意。',
      '我喜欢用文字、图片、音乐、视频、表演或设计来表达自己的想法。',
      '如果班级或社团要做宣传片、公众号推文、活动海报或短视频，我愿意参与创意制作。',
      '我不太喜欢所有事情都只有标准答案，更喜欢可以表达个人想法的任务。',
      '我对影视、动画、音乐、设计、摄影、文学、新媒体、游戏美术或内容创作感兴趣。',
      '我希望自己的作品有个人风格，而不是和别人看起来完全一样。',
      '如果未来能做设计、传媒、影视、广告、品牌策划、游戏内容或自媒体相关工作，我会感兴趣。',
    ],
  },
  {
    dimension: 'S',
    slug: 's',
    prompts: [
      '当朋友情绪不好或遇到困扰时，我愿意听他倾诉。',
      '我喜欢和别人交流想法，也愿意理解不同人的感受和处境。',
      '如果同学学习上遇到困难，我愿意给他讲题、分享方法或帮他整理思路。',
      '我对心理、教育、医学、公益、社会服务、校园辅导等方向有兴趣。',
      '我愿意参加志愿服务、迎新活动、支教活动、公益项目或校园服务工作。',
      '当我帮助别人解决问题或变得更好时，我会有成就感。',
      '在团队中，我常常会注意大家的状态，愿意协调关系或缓和气氛。',
      '我喜欢需要沟通、陪伴、教学、引导、咨询或服务他人的任务。',
      '如果学校有朋辈辅导、学习互助、社团培训、心理活动或志愿者项目，我会愿意参与。',
      '如果未来能做教师、心理咨询、医生、护理、人力资源、培训、公益服务等工作，我会感兴趣。',
    ],
  },
  {
    dimension: 'E',
    slug: 'e',
    prompts: [
      '我喜欢组织活动，比如班级活动、社团招新、比赛项目、校园市集或线上活动。',
      '我对赚钱、创业、商业模式、品牌运营、直播带货、市场营销等话题感兴趣。',
      '在小组合作中，我愿意负责分工、推进进度、协调资源或带大家完成任务。',
      '如果有机会做校园小生意、线上账号、二手交易、活动策划或创业项目，我会想尝试。',
      '我喜欢表达观点，也愿意说服别人接受一个方案、产品或想法。',
      '我会关注热门品牌、网红店、App、游戏、产品为什么能火。',
      '我希望未来的学习和工作有成长空间、竞争感、影响力和成就感。',
      '我愿意参加商业挑战赛、创业比赛、模拟公司、辩论赛、演讲比赛或营销策划活动。',
      '遇到机会时，我更倾向于主动争取，而不是一直等别人安排。',
      '如果未来能做管理、市场、金融、销售、法律、创业、产品经理或商务拓展类工作，我会感兴趣。',
    ],
  },
  {
    dimension: 'C',
    slug: 'c',
    prompts: [
      '我喜欢把学习资料、文件、笔记、照片、任务清单或网盘内容整理得有条理。',
      '我做事比较重视准确性，不喜欢马虎、混乱或没有规则。',
      '我愿意处理表格、数据、账目、流程、计划安排、报名信息或活动预算。',
      '相比变化很大、规则不清的任务，我更喜欢要求明确、步骤清楚的任务。',
      '我能接受需要耐心、细心、重复检查的工作，比如核对信息、整理数据、检查格式。',
      '做小组项目时，我愿意负责记录、排期、资料整理、预算统计或提交文件。',
      '我喜欢用日程表、待办清单、Excel、Notion、飞书、备忘录等工具管理学习和任务。',
      '我觉得稳定、有秩序、有明确规则的学习或工作环境更适合我。',
      '我对会计、财务、审计、行政、数据管理、银行、运营、供应链等方向不排斥。',
      '如果未来能做财务、审计、行政管理、银行业务、数据运营、项目执行或流程管理，我会感兴趣。',
    ],
  },
];

function hollandScaleOption(questionId: string, dimension: RIASECDimension, choice: (typeof HOLLAND_SCALE_CHOICES)[number]): QuestionOption {
  const riasecWeights: Partial<Record<RIASECDimension, number>> = { [dimension]: choice.score };
  return {
    id: `${questionId}-${choice.id}`,
    label: choice.label,
    riasecWeights,
  };
}

function createHollandScaleQuestions(section: HollandScaleQuestionSeed): Question[] {
  return section.prompts.map((prompt, index) => {
    const questionId = `personality-holland-${section.slug}-${String(index + 1).padStart(2, '0')}`;
    return {
      id: questionId,
      phase: 'C',
      type: 'card-select',
      imageSrc: DISCOVER_ASSESSMENT_HOLLAND_IMAGE(section.slug, index),
      prompt,
      options: HOLLAND_SCALE_CHOICES.map((choice) => hollandScaleOption(questionId, section.dimension, choice)),
    };
  });
}

export const PERSONALITY_MBTI_QUESTION_IDS = (Object.keys(MBTI_QUESTION_SECTIONS) as Array<keyof typeof MBTI_QUESTION_SECTIONS>)
  .flatMap((sectionKey) =>
    MBTI_QUESTION_SECTIONS[sectionKey].items.map((_, index) =>
      `personality-${sectionKey}-doc-${String(index + 1).padStart(2, '0')}`,
    ),
  );

export const PERSONALITY_HOLLAND_SCALE_QUESTION_IDS = HOLLAND_SCALE_SECTIONS.flatMap((section) =>
  section.prompts.map((_, index) => `personality-holland-${section.slug}-${String(index + 1).padStart(2, '0')}`),
);

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableShuffle<T>(items: readonly T[], seed: string): T[] {
  return items
    .map((item, index) => ({
      item,
      index,
      sortKey: stableHash(`${seed}:${index}:${String(item)}`),
    }))
    .sort((a, b) => a.sortKey - b.sortKey || a.index - b.index)
    .map(({ item }) => item);
}

function interleaveStableShuffledGroups<T>(groups: readonly (readonly T[])[], seed: string): T[] {
  const shuffledGroups = groups.map((group, index) => stableShuffle(group, `${seed}:group-${index}`));
  const maxLength = Math.max(...shuffledGroups.map((group) => group.length));
  const result: T[] = [];

  for (let row = 0; row < maxLength; row += 1) {
    const groupOrder = stableShuffle(
      groups.map((_, index) => index),
      `${seed}:row-${row}`,
    );

    for (const groupIndex of groupOrder) {
      const item = shuffledGroups[groupIndex]?.[row];
      if (item !== undefined) result.push(item);
    }
  }

  return result;
}

export const PERSONALITY_MBTI_DISPLAY_QUESTION_IDS = interleaveStableShuffledGroups(
  [
    PERSONALITY_MBTI_QUESTION_IDS.slice(0, 15),
    PERSONALITY_MBTI_QUESTION_IDS.slice(15, 30),
    PERSONALITY_MBTI_QUESTION_IDS.slice(30, 45),
    PERSONALITY_MBTI_QUESTION_IDS.slice(45, 60),
  ],
  'discover-second-stage-mbti-display-20260614',
);

export const PERSONALITY_HOLLAND_SCALE_DISPLAY_QUESTION_IDS = interleaveStableShuffledGroups(
  [
    PERSONALITY_HOLLAND_SCALE_QUESTION_IDS.slice(0, 10),
    PERSONALITY_HOLLAND_SCALE_QUESTION_IDS.slice(10, 20),
    PERSONALITY_HOLLAND_SCALE_QUESTION_IDS.slice(20, 30),
    PERSONALITY_HOLLAND_SCALE_QUESTION_IDS.slice(30, 40),
    PERSONALITY_HOLLAND_SCALE_QUESTION_IDS.slice(40, 50),
    PERSONALITY_HOLLAND_SCALE_QUESTION_IDS.slice(50, 60),
  ],
  'discover-second-stage-holland-display-20260614',
);

const PERSONALITY_QUESTIONS: Question[] = [
  ...createMbtiQuestions('ei'),
  ...createMbtiQuestions('sn'),
  ...createMbtiQuestions('tf'),
  ...createMbtiQuestions('jp'),
  ...HOLLAND_SCALE_SECTIONS.flatMap(createHollandScaleQuestions),
];

const LEGACY_ABILITY_TESTS: Question[] = [
  {
    id: 'ability-language-1',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '语言学 1/5', title: '未知语言：词序', lines: ['nala tor = 蓝色的河', 'nala ven = 蓝色的树', 'sori tor = 红色的河'] },
    prompt: '“红色的树”最可能怎么说？',
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
    options: [
      { id: 'sci4-a', label: '实验乙更可靠', correct: true, riasecWeights: { I: 4, C: 2 }, personalityTags: ['evidence-based'] },
      { id: 'sci4-b', label: '同学甲更可靠', riasecWeights: {} },
      { id: 'sci4-c', label: '二者完全一样', riasecWeights: {} },
      { id: 'sci4-d', label: '都不能提供任何信息', riasecWeights: {} },
    ],
  },
];

const CORRECT_ABILITY_WEIGHTS: Partial<Record<RIASECDimension, number>> = { I: 4, C: 1 };

function lotaLanguageOption(
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
    abilitySetup: { series: '', title: '东门棚下的食物小牌', lines: [] },
    abilityPuzzle: {
      scene: '东门棚下的灯石还在滴水，几块食物小牌被风吹得轻轻碰撞。摊主把面饼、青汤、河鱼和茶杯摆在柜台前，只等外乡人自己读牌点单。\n\n同行者饿得发慌，指着一盘冒着热气、撒着红香料的河鱼问你那块小牌到底写的是什么。旧笔记第一页残留着几组图牌对照，刚好可以让你先摸清词语排列的习惯。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-gate-signs-20260610-flat2d-r1.png'),
      tables: [
        {
          columns: ['旧笔记图牌', '图上物件'],
          rows: [
            ['banu lomi', '一块冒热气的面饼'],
            ['banu salo', '一块撒着红香料的面饼'],
            ['raku kera', '一盘放在冰石上的河鱼'],
            ['tela kera', '一杯冷茶'],
            ['sema mira', '一碗颜色很淡的青汤'],
          ],
        },
      ],
    },
    prompt: '那盘河鱼旁的小牌写着 `raku lomi salo`。同行者问你这到底是什么，哪一项最合理？',
    options: [
      lotaLanguageOption('jinchao-lamp-1-a', '清淡青汤。'),
      lotaLanguageOption('jinchao-lamp-1-b', '热辣鱼肉。', true, ['linguistic-pattern', 'modifier-after-noun']),
      lotaLanguageOption('jinchao-lamp-1-c', '冷茶。'),
      lotaLanguageOption('jinchao-lamp-1-d', '安全的面饼。'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-2',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '', title: '取餐牌和进城名册', lines: [] },
    abilityPuzzle: {
      scene: '穿过月井广场时，钟声敲到第二下。摊主把取餐牌挂到绳上，城门文书在旁边登记进城的人；食物、物件和人名挤在同一块木板上，数字写法相似，词尾却不完全一样。\n\n厨窗里正好摆出三碗清淡青汤，老板把一块空木牌推到你面前，等你写给后厨看。同行者对着名册和取餐牌看了一会儿，低声说：人名和食物后面的词尾好像不是同一种。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-order-tags-20260610-flat2d-r1.png'),
      tables: [
        {
          columns: ['木牌文字', '木牌旁的图画 / 记录'],
          rows: [
            ['un banu', '一份面饼'],
            ['do banu-ta', '两份面饼'],
            ['tri tela-ta kera', '三杯冷茶'],
            ['un vora', '一名保管人'],
            ['do vora-ri', '两名保管人'],
            ['tri ena-ri', '三个孩子'],
            ['sema mira', '清淡青汤'],
          ],
        },
      ],
    },
    prompt: '厨窗要挂出“三碗清淡青汤”的取餐牌。根据你刚看到的名册和取餐牌，这块牌最应该写成哪一项？',
    options: [
      lotaLanguageOption('jinchao-lamp-2-a', 'tri mira sema-ta'),
      lotaLanguageOption('jinchao-lamp-2-b', 'tri sema-ri mira'),
      lotaLanguageOption('jinchao-lamp-2-c', 'sema-ta tri mira'),
      lotaLanguageOption('jinchao-lamp-2-d', 'tri sema-ta mira', true, ['rule-transfer', 'morphology', 'modifier-after-noun']),
    ],
  },
  {
    id: 'ability-jinchao-lamp-3',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '', title: '发证柜台前的交付顺序', lines: [] },
    abilityPuzzle: {
      scene: '发证柜台前的人越来越多。保管人 `vora` 从木盒里拿出一个盖着暮桥徽记的小包 `sabo`，正递到你的腕牌前；旁边的孩子也伸手去够柜台上的另一只木盒，同行者一时看错，以为小包是递给孩子的。\n\n柜台墙上贴着几张旧交付图，每张图都把人名、物品和递送方向写在同一句洛塔语里。你压低声音提醒同行者：眼前这次交付，是保管人正在把通行小包递给你。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-ticket-wall-20260610-flat2d-r1.png'),
      tables: [
        {
          columns: ['旧交付图', '图里发生的事'],
          rows: [
            ['vora e mi ra kelo u da-a.', '钥匙从保管人手边递到写着 mi 的腕牌前'],
            ['mi e ena ra tela kera u da-a.', '冷茶从写着 mi 的手边递到孩子 ena 面前'],
            ['ena e vora ra sema mira u da-a.', '青汤从孩子 ena 面前递到保管人柜台前'],
            ['sabo', '暮桥徽记小包上的标签'],
          ],
        },
      ],
    },
    prompt: '同行者把交付方向看反了。你要提醒他：保管人正在把通行小包递给我。哪一句最合适？',
    options: [
      lotaLanguageOption('jinchao-lamp-3-a', 'mi e vora ra sabo u da-a.'),
      lotaLanguageOption('jinchao-lamp-3-b', 'vora e sabo ra mi u da-a.'),
      lotaLanguageOption('jinchao-lamp-3-c', 'vora e mi ra sabo u da-a.', true, ['syntax-role', 'compositional-reasoning']),
      lotaLanguageOption('jinchao-lamp-3-d', 'vora e mi u sabo ra da-a.'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-4',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '', title: '封路牌旁的守卫警告', lines: [] },
    abilityPuzzle: {
      scene: '离开广场时，香料市 `tavi` 那条街忽然拉起封路绳。一个守卫举着红灯牌拦住行人，洛塔语喊得很快；同行者听不懂，还以为那只是普通问路，已经往封路绳那边迈了一步。\n\n旧笔记这一页抄着同一个动词在不同时间和语气里的样子。你来不及解释整句，只需要立刻喊出最短的提醒，让同行者别再往集市走。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-bridge-register-20260610-flat2d-r1.png'),
      tables: [
        {
          columns: ['旧笔记残句', '残页小图'],
          rows: [
            ['mi e doro ra vel-o.', '写着 mi 的人已经站在旅店牌下'],
            ['mi e doro ra vel-el.', '写着 mi 的人还在去旅店的路上'],
            ['doro ra vel-ke.', '有人指着旅店方向催同伴过去'],
            ['tela u nor-ke.', '有人端起茶杯准备喝'],
            ['tela lomi u ma nor-ke.', '红叉挡在热茶前'],
            ['mi ra kelo u da-ke.', '有人把钥匙递向写着 mi 的腕牌'],
          ],
        },
      ],
    },
    prompt: '同行者正要往封路的 `tavi` 走，你要立刻提醒他“不要去集市！”。哪一句最合理？',
    options: [
      lotaLanguageOption('jinchao-lamp-4-a', 'tavi ra ma vel-o.'),
      lotaLanguageOption('jinchao-lamp-4-b', 'tavi ra ma vel-ke.', true, ['tense-negation', 'imperative-negation']),
      lotaLanguageOption('jinchao-lamp-4-c', 'mi e tavi ra vel-el.'),
      lotaLanguageOption('jinchao-lamp-4-d', 'tavi u ma nor-ke.'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-5',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '', title: '月井面铺的点菜单', lines: [] },
    abilityPuzzle: {
      scene: '通行小包已经拿到，但暮桥要等最后一盏夜灯亮起才放行。你和同行者挤进月井旁的小面铺，老板把木菜单推到柜台中间，只等你把要点的东西念出来。\n\n你们钱袋里只有 17 枚星贝，要凑一份能带走的路餐：至少一份主食、至少一份鱼肉、至少两份茶饮。同行者指了指红香料河鱼，说冷雾里走到桥口需要一点辣味，所以鱼肉必须选辣的那一种；菜单上有洛塔语名、价格和给外乡人看的小图，旧笔记只帮你确认一句“请把某物给我”的说法。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-noodle-shop-20260609-v1.png'),
      visuals: [
        { imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-noodle-shop-20260609-v1.png'), kind: 'scene' },
        { imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-clue-lota-city-noodle-menu-20260609-v2.png'), kind: 'clue' },
      ],
      tables: [
        {
          columns: ['旧笔记残句', '残页小图'],
          rows: [
            ['mi ra kelo u da-ke.', '一只手把钥匙递向写着 mi 的腕牌'],
            ['un banu', '单独一份面饼的取餐牌'],
            ['do banu-ta', '两份面饼的取餐牌'],
            ['tri tela-ta kera', '三杯冷茶的取餐牌'],
          ],
        },
      ],
    },
    prompt: '你要点一份主食、一份辣鱼肉、至少两份茶饮，总价不能超过 17 枚星贝。哪一句最适合对老板说？',
    options: [
      lotaLanguageOption('jinchao-lamp-5-a', 'mi ra un banu lomi u da-ke; mi ra un raku lomi u da-ke; mi ra do tela-ta kera u da-ke.'),
      lotaLanguageOption('jinchao-lamp-5-b', 'mi ra un banu lomi u da-ke; mi ra un raku salo u da-ke; mi ra do tela-ta kera u da-ke.', true, ['scene-judgment', 'budget-constraint', 'syntax-role']),
      lotaLanguageOption('jinchao-lamp-5-c', 'mi ra un banu lomi u da-ke; mi ra un raku lomi u da-ke; mi ra un tela kera u da-ke.'),
      lotaLanguageOption('jinchao-lamp-5-d', 'mi ra un banu lomi u da-ke; mi ra un sema mira u da-ke; mi ra un raku lomi u da-ke; mi ra do tela-ta kera u da-ke.'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-6',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '', title: '蓝桥路口的纸地图', lines: [] },
    abilityPuzzle: {
      scene: '饭后，水雾压低了街灯。你们从旅店 `doro` 出发，正北的小巷被路障封住，香料市 `tavi` 也不能穿过；安全桥 `brin sai` 在地图另一侧，最后一盏夜灯已经亮到一半。\n\n纸地图上没有画路线，只把旅店、小广场、药坊、香料市和安全桥标出来。旧笔记夹着几张走格子的小图：每张图只画两个相邻地点和一句短命令。你要先判断方向词，再选一条能绕开封路的路线。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-route-20260610-flat2d-r1.png'),
      visuals: [
        { imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-route-20260610-flat2d-r1.png'), kind: 'scene' },
        { imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-clue-lota-city-route-map-20260610-flat2d-r1.png'), kind: 'clue' },
      ],
      tables: [
        {
          columns: ['旧笔记小图', '图下短句'],
          rows: [
            ['药坊 havo 在小广场的上方', 'nora ra vel-ke.'],
            ['香料市 tavi 在小广场的右方', 'est ra vel-ke.'],
            ['月井在小广场的下方', 'suda ra vel-ke.'],
            ['旅店 doro 在小广场的左方', 'ves ra vel-ke.'],
            ['两张小图连在一起时，中间写', 'pe'],
          ],
        },
      ],
    },
    prompt: '从旅店 `doro` 出发，避开正北路障和封路的香料市 `tavi`，哪串短命令能把你们带到安全桥 `brin sai`？',
    options: [
      lotaLanguageOption('jinchao-lamp-6-a', 'est ra vel-ke, pe est ra vel-ke, pe nora ra vel-ke.'),
      lotaLanguageOption('jinchao-lamp-6-b', 'nora ra vel-ke, pe est ra vel-ke, pe est ra vel-ke.'),
      lotaLanguageOption('jinchao-lamp-6-c', 'suda ra vel-ke, pe est ra vel-ke, pe nora ra vel-ke.'),
      lotaLanguageOption('jinchao-lamp-6-d', 'est ra vel-ke, pe nora ra vel-ke, pe est ra vel-ke.', true, ['scene-judgment', 'safe-route', 'direction-sequence']),
    ],
  },
  {
    id: 'ability-jinchao-lamp-7',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '', title: '药坊柜台上的两杯药茶', lines: [] },
    abilityPuzzle: {
      scene: '去暮桥前，你们经过药坊 `havo`。香料市的辛辣粉尘被风吹到巷口，同行者咳得说不出话。药师把两杯应急药茶放在柜台上：蓝杯靠着凉石和清水碗，红杯靠着辛辣粉袋。\n\n药师被后排病人叫走的一瞬间，同行者误把红杯拿起来。你来不及解释，只能先叫他别喝手里那杯，再指向旁边的蓝杯。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-pharmacy-20260609-v4.png'),
      tables: [
        {
          columns: ['旧笔记残句 / 现场物件', '你看到的关系'],
          rows: [
            ['tela kera', '贴在靠近凉石的茶杯旁'],
            ['tela lomi salo', '贴在靠近辛辣粉袋的茶杯旁'],
            ['sema mira', '前一页清淡青汤旁也出现过 mira'],
            ['tela u nor-ke.', '笔记小图里有人端起茶杯喝'],
            ['tela lomi u ma nor-ke.', '笔记小图里红叉挡在热茶前'],
          ],
        },
      ],
    },
    prompt: '同行者已经把红杯举到嘴边。哪一句最像你此刻会脱口而出的提醒：先别喝红杯，再喝蓝杯？',
    options: [
      lotaLanguageOption('jinchao-lamp-7-a', 'tela kera mira u ma nor-ke; tela lomi salo u nor-ke.'),
      lotaLanguageOption('jinchao-lamp-7-b', 'tela lomi salo u ma nor-ke; tela kera mira u nor-ke.', true, ['scene-judgment', 'danger-recognition', 'imperative-negation']),
      lotaLanguageOption('jinchao-lamp-7-c', 'raku salo u nor-ke; tela lomi salo u da-ke.'),
      lotaLanguageOption('jinchao-lamp-7-d', 'mi e tela kera mira u nor-o; tu e tavi ra vel-el.'),
    ],
  },
  {
    id: 'ability-jinchao-lamp-8',
    phase: 'B',
    type: 'card-select',
    abilitySetup: { series: '', title: '暮桥守卫前的领取争执', lines: [] },
    abilityPuzzle: {
      scene: '暮桥前最后一盏灯亮起时，守卫拦住你们。他认得你手里的通行小包 `sabo`，但登记册上你们那一格还空着；如果说不清小包从哪里来，他会让你们回到发证柜台重排。\n\n你把小包背面翻给他看：保管人 `vora` 的印章压在左下，旁边刻着你的腕牌编号 `mi`。守卫看完印章，等你用洛塔语说明这只小包已经交到你手里。',
      imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-lota-city-inn-deposit-20260609-v4.png'),
      tables: [
        {
          columns: ['旧笔记残句 / 现场物件', '你能确认的关系'],
          rows: [
            ['sabo', '小包正面同一个徽记下写着这个词'],
            ['vora', '保管人印章旁写着这个词'],
            ['mi', '你的腕牌编号旁写着这个词'],
            ['vora e mi ra kelo u da-a.', '旧图里钥匙从保管人手边递到你的腕牌前'],
            ['mi e vora ra tela kera u da-a.', '旧图里冷茶从你的手边递到保管人柜台前'],
            ['mi e tavi ra vel-o.', '旧图里你已经站在集市牌下'],
            ['mi e tavi ra vel-el.', '旧图里你还在去集市的路上'],
          ],
        },
      ],
    },
    prompt: '守卫要听你说清小包的来源。哪一句最自然地说明：保管人已经把通行小包给了你？',
    options: [
      lotaLanguageOption('jinchao-lamp-8-a', 'mi e vora ra sabo u da-o.'),
      lotaLanguageOption('jinchao-lamp-8-b', 'vora e mi ra sabo u da-el.'),
      lotaLanguageOption('jinchao-lamp-8-c', 'vora e mi ra sabo u da-o.', true, ['scene-judgment', 'syntax-role', 'past-tense']),
      lotaLanguageOption('jinchao-lamp-8-d', 'vora e sabo ra mi u da-o.'),
    ],
  },
];

const SURAKARTA_PUZZLE_BY_ID = new Map(SURAKARTA_PUZZLES_V2.map((puzzle) => [puzzle.id, puzzle]));

function getSurakartaPuzzle(id: string): SurakartaPuzzle {
  const puzzle = SURAKARTA_PUZZLE_BY_ID.get(id);
  if (!puzzle) throw new Error(`Missing Surakarta v2 puzzle: ${id}`);
  return puzzle;
}

function surakartaPuzzleBoard(puzzle: SurakartaPuzzle, caption: string, focus: string[] = []): AbilityBoard {
  return surakartaBoard(
    puzzle.board.pieces.map((piece) => ({ side: piece.side, at: piece.at })),
    caption,
    focus,
  );
}

const SURAKARTA_ABILITY_TESTS: Question[] = (() => {
  const q1 = getSurakartaPuzzle('surakarta-01-step-count');
  const q2 = getSurakartaPuzzle('surakarta-02-capture-targets');
  const q3 = getSurakartaPuzzle('surakarta-03-side-captures');
  const q4 = getSurakartaPuzzle('surakarta-04-piece-legal-moves');

  return [
    {
      id: 'ability-surakarta-1-step-count',
      phase: 'B',
      type: 'card-select',
      abilityPuzzle: {
        scene: '',
        imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-step-count-20260610-flat2d-r1.png'),
        board: surakartaPuzzleBoard(q1, '', ['C3']),
      },
      prompt: q1.prompt.text,
      options: [
        surakartaOption('surakarta-v2-1-a', '3 种', true, ['spatial-reasoning', 'local-constraint-check']),
        surakartaOption('surakarta-v2-1-b', '5 种'),
        surakartaOption('surakarta-v2-1-c', '2 种'),
        surakartaOption('surakarta-v2-1-d', '8 种'),
      ],
    },
    {
      id: 'ability-surakarta-2-capture-targets',
      phase: 'B',
      type: 'card-select',
      abilityPuzzle: {
        scene: '',
        imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-loop-capture-20260610-flat2d-r1.png'),
        board: surakartaPuzzleBoard(q2, '', ['D4']),
      },
      prompt: q2.prompt.text,
      options: [
        surakartaOption('surakarta-v2-2-a', '2 枚', true, ['rule-transfer', 'path-blocking']),
        surakartaOption('surakarta-v2-2-b', '4 枚'),
        surakartaOption('surakarta-v2-2-c', '1 枚'),
        surakartaOption('surakarta-v2-2-d', '0 枚'),
      ],
    },
    {
      id: 'ability-surakarta-3-side-captures',
      phase: 'B',
      type: 'card-select',
      abilityPuzzle: {
        scene: '',
        imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-global-scan-20260610-flat2d-r1.png'),
        board: surakartaPuzzleBoard(q3, '', ['C3', 'D4', 'E4']),
      },
      prompt: q3.prompt.text,
      options: [
        surakartaOption('surakarta-v2-3-a', '4 个', true, ['global-scan', 'path-enumeration']),
        surakartaOption('surakarta-v2-3-b', '3 个'),
        surakartaOption('surakarta-v2-3-c', '5 个'),
        surakartaOption('surakarta-v2-3-d', '6 个'),
      ],
    },
    {
      id: 'ability-surakarta-4-piece-legal-moves',
      phase: 'B',
      type: 'card-select',
      abilityPuzzle: {
        scene: '',
        imageSrc: DISCOVER_GENERATED_IMAGE('discover-question-scene-surakarta-legal-moves-20260610-flat2d-r1.png'),
        board: surakartaPuzzleBoard(q4, '', ['D4']),
      },
      prompt: q4.prompt.text,
      options: [
        surakartaOption('surakarta-v2-4-a', '7 种', true, ['compositional-reasoning', 'move-counting']),
        surakartaOption('surakarta-v2-4-b', '5 种'),
        surakartaOption('surakarta-v2-4-c', '6 种'),
        surakartaOption('surakarta-v2-4-d', '8 种'),
      ],
    },
  ];
})();

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

const CAREER_SCENARIO_IMAGE = (slug: string) =>
  DISCOVER_GENERATED_IMAGE(`discover-question-scene-career-${slug}-20260610-flat2d-r3.png`);

const VALUE_TESTS: Question[] = [
  {
    id: 'value-life-goal',
    phase: 'D',
    type: 'career-scenario',
    imageSrc: CAREER_SCENARIO_IMAGE('empty-city-survival-first-reaction'),
    prompt: '末日生存 / 空城幸存者',
    careerScenario: {
      scene:
        '一觉醒来，城市空荡，手机没有信号。大街上有被翻乱的痕迹，超市大门敞开，远处传来规律噪声。后来，一辆车靠近，你遇到一支同样困惑的幸存者小队。',
      sceneImageSrc: CAREER_SCENARIO_IMAGE('empty-city-survival-first-reaction'),
      sceneImageMode: 'per-section',
      firstPrompt: '如果这是你醒来后的第一分钟，你最可能先做什么？',
      firstOptions: [
        { id: 'city-first-risk-map', label: '先观察街道、噪声方向和异常痕迹，判断有没有危险', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'structured'] },
        { id: 'city-first-record-clues', label: '记录眼前画面和细节，试着理解这座城市发生了什么', riasecWeights: { A: 1, I: 1 }, personalityTags: ['creative', 'pattern-seeking'] },
        { id: 'city-first-supply-run', label: '先找水、食物、工具和可用装备，保证自己撑过今天', riasecWeights: { R: 1, C: 1 }, personalityTags: ['practical', 'risk-aware'] },
        { id: 'city-first-find-team', label: '朝可能有人声或车辆声的方向靠近，确认能否合作', riasecWeights: { S: 1, E: 1 }, personalityTags: ['social', 'organizer'] },
      ],
      itemScene:
        '你进入超市后，货架几乎被洗劫一空。门外忽然传来急促鸣笛，你只能快速选 4 组眼前还能拿到的物品。',
      itemImageSrc: CAREER_SCENARIO_IMAGE('empty-city-survival-ranking'),
      itemPrompt: '你只能快速选 4 组物资带走。你的第一反应会选哪 4 组？请按优先级从先到后排列。',
      itemMaxSelections: 4,
      itemOptions: [
        { id: 'city-item-toolkit', label: '手电筒、胶带、多功能刀', riasecWeights: { R: 1 }, personalityTags: ['hands-on'] },
        { id: 'city-item-fire-rope', label: '备用电池、打火机、绳索', riasecWeights: { R: 1 }, personalityTags: ['practical'] },
        { id: 'city-item-map-notebook', label: '城市地图、笔记本、记号笔', riasecWeights: { I: 1 }, personalityTags: ['information-seeking'] },
        { id: 'city-item-radio-board', label: '收音机、旧手机、可拆电路板', riasecWeights: { I: 1 }, personalityTags: ['technical-curiosity'] },
        { id: 'city-item-camera-tags', label: '相机、录音笔、彩色贴纸', riasecWeights: { A: 1 }, personalityTags: ['expressive'] },
        { id: 'city-item-sign-board', label: '彩笔、纸板、醒目标识牌', riasecWeights: { A: 1 }, personalityTags: ['visual-communication'] },
        { id: 'city-item-first-aid', label: '急救包、干净毛巾、常用药', riasecWeights: { S: 1 }, personalityTags: ['helper'] },
        { id: 'city-item-signal-help', label: '扩音器、口哨、求助纸牌', riasecWeights: { S: 1 }, personalityTags: ['supportive'] },
        { id: 'city-item-car-radio', label: '对讲机、车钥匙、工具箱', riasecWeights: { E: 1 }, personalityTags: ['connector'] },
        { id: 'city-item-task-board', label: '小白板、任务贴、分工表', riasecWeights: { E: 1 }, personalityTags: ['organizer'] },
        { id: 'city-item-food-water', label: '饮用水、压缩饼干、罐头', riasecWeights: { C: 1 }, personalityTags: ['stability-first'] },
        { id: 'city-item-storage-list', label: '塑料箱、密封袋、清单夹', riasecWeights: { C: 1 }, personalityTags: ['record-keeper'] },
      ],
      openScene:
        '车上共有 4 名成员。大家决定一起探索城市、确认真相，也必须马上分工。',
      openImageSrc: CAREER_SCENARIO_IMAGE('empty-city-survival-team-next-step'),
      teamPrompt: '大家交换意见时，你倾向于小队首先应该做什么？',
      teamOptions: [
        { id: 'city-team-info-model', label: '整理已知信息，分析异常原因、风险区域和下一步假设', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'structured'] },
        { id: 'city-team-visual-clues', label: '记录异常画面、声音和线索，从细节里找隐藏规律', riasecWeights: { A: 1, I: 1 }, personalityTags: ['creative', 'pattern-seeking'] },
        { id: 'city-team-supply-plan', label: '计算物资还能撑多久，列出最急需补充的清单', riasecWeights: { R: 1, C: 1 }, personalityTags: ['practical', 'stability-first'] },
        { id: 'city-team-roles-contact', label: '先确定队伍分工和沟通方式，再寻找更多幸存者', riasecWeights: { S: 1, E: 1 }, personalityTags: ['social', 'organizer'] },
      ],
      openPrompt: '大家决定分工。你觉得自己在这个四人小队里最适合承担什么角色？',
      openFields: [
        { id: 'teamRole', label: '（可选）你最适合承担什么角色？', type: 'text', placeholder: '例如技术大佬、领导组织者、物资后勤、联络外界、鼓舞人心，或者你自己的角色。' },
      ],
    },
  },
  {
    id: 'value-ai-life-route',
    phase: 'D',
    type: 'career-scenario',
    imageSrc: CAREER_SCENARIO_IMAGE('ai-life-route-first-reaction'),
    prompt: 'AI 生成了一份完美人生路线',
    careerScenario: {
      scene:
        '高考结束后，一个生涯规划软件把你的成绩、兴趣、热门专业和就业率交给 AI，生成一份十年路线：学校、专业、实习、工作和年薪都写得很完整。可是你越看越觉得，它好像不太像你。',
      sceneImageSrc: CAREER_SCENARIO_IMAGE('ai-life-route-first-reaction'),
      sceneImageMode: 'per-section',
      firstPrompt: '拿到这份路线时，你的第一反应是什么？',
      firstOptions: [
        { id: 'ai-first-source-check', label: '先核对数据来源、推理过程和有没有明显编造', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'fact-checking'] },
        { id: 'ai-first-personal-edit', label: '删掉不像自己的部分，改成更符合想象的未来版本', riasecWeights: { A: 1, I: 1 }, personalityTags: ['creative', 'self-authoring'] },
        { id: 'ai-first-small-test', label: '挑一个能展示的小任务，先做出来再拿去沟通', riasecWeights: { R: 1, E: 1 }, personalityTags: ['practical', 'initiative'] },
        { id: 'ai-first-feedback', label: '主动约老师或学长讨论，争取看清哪些建议更现实', riasecWeights: { S: 1, E: 1 }, personalityTags: ['feedback-seeking', 'initiative'] },
      ],
      itemScene:
        '你决定不马上相信，也不马上否定这份 AI 报告。接下来你只能先做 4 件事来验证它。',
      itemImageSrc: CAREER_SCENARIO_IMAGE('ai-life-route-ranking'),
      itemPrompt: '你会优先做哪 4 件事来验证这份 AI 路线？请按优先级从先到后排列。',
      itemMaxSelections: 4,
      itemOptions: [
        { id: 'ai-item-fact-check', label: '查学校和专业数据来源', riasecWeights: { I: 1 }, personalityTags: ['fact-checking'] },
        { id: 'ai-item-compare-courses', label: '对比真实专业课内容', riasecWeights: { I: 1 }, personalityTags: ['researching'] },
        { id: 'ai-item-three-day-task', label: '做一个三天小任务', riasecWeights: { R: 1 }, personalityTags: ['hands-on'] },
        { id: 'ai-item-shadow-work', label: '体验一次真实工作片段', riasecWeights: { R: 1 }, personalityTags: ['practice-first'] },
        { id: 'ai-item-future-story', label: '重写一版未来生活画面', riasecWeights: { A: 1 }, personalityTags: ['self-authoring'] },
        { id: 'ai-item-route-board', label: '做一张个人路线草图', riasecWeights: { A: 1 }, personalityTags: ['visual-thinking'] },
        { id: 'ai-item-teacher-talk', label: '约老师聊路线合理性', riasecWeights: { S: 1 }, personalityTags: ['feedback-seeking'] },
        { id: 'ai-item-peer-review', label: '请朋友指出哪里不像我', riasecWeights: { S: 1 }, personalityTags: ['social-reflection'] },
        { id: 'ai-item-ask-admissions', label: '主动咨询招生或从业者', riasecWeights: { E: 1 }, personalityTags: ['initiative'] },
        { id: 'ai-item-decision-pitch', label: '把选择理由讲给家人听', riasecWeights: { E: 1 }, personalityTags: ['persuasive'] },
        { id: 'ai-item-risk-list', label: '列出风险、截止期和成本', riasecWeights: { C: 1 }, personalityTags: ['structured'] },
        { id: 'ai-item-plan-table', label: '整理一张验证计划表', riasecWeights: { C: 1 }, personalityTags: ['organized'] },
      ],
      openScene:
        '你准备把 AI 路线改成一个能被自己真正使用的版本。',
      openImageSrc: CAREER_SCENARIO_IMAGE('ai-life-route-team-next-step'),
      teamPrompt: '如果你觉得这份路线“不太像自己”，你最可能怎么处理？',
      teamOptions: [
        { id: 'ai-team-data-audit', label: '逐项查证学校、专业、薪资和就业数据是否可靠', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'structured'] },
        { id: 'ai-team-self-prompt', label: '重新描述自己想过的生活，主动把 AI 引向更像自己的版本', riasecWeights: { A: 1, E: 1 }, personalityTags: ['creative', 'self-authoring'] },
        { id: 'ai-team-action-proof', label: '从路线里挑一个能展示的小任务，用结果推动判断', riasecWeights: { R: 1, E: 1 }, personalityTags: ['practical', 'initiative'] },
        { id: 'ai-team-human-review', label: '组织一次小范围讨论，区分模板建议和真实建议', riasecWeights: { S: 1, E: 1 }, personalityTags: ['feedback-seeking', 'organizer'] },
      ],
      openPrompt: '如果你花 30 分钟填写这样一份报告，你最希望它帮你解决什么问题？',
      openFields: [
        { id: 'teamRole', label: '（可选）你最希望这份报告帮你解决什么？', type: 'text', placeholder: '例如验证方向、找到行动入口、看清不适感、和家人沟通，或其他具体问题。' },
      ],
    },
  },
  {
    id: 'value-17th-century',
    phase: 'D',
    type: 'career-scenario',
    imageSrc: CAREER_SCENARIO_IMAGE('17th-century-first-reaction'),
    prompt: '穿越到 17 世纪',
    careerScenario: {
      scene:
        '穿越系统出了 BUG，你被送到 17 世纪。这里没有现代网络和工业体系，但当地工坊、港口、学校和集市都愿意听你带来的未来知识。你只能选择少量东西和少量行动，决定先怎样推动改变。',
      sceneImageSrc: CAREER_SCENARIO_IMAGE('17th-century-first-reaction'),
      sceneImageMode: 'per-section',
      firstPrompt: '如果只能先带一种“未来知识”过去，你更想带什么？',
      firstOptions: [
        { id: 'century-first-tools', label: '带基础机械工具和制作方法，先改造生产问题', riasecWeights: { R: 1, A: 1 }, personalityTags: ['hands-on', 'creative-problem-solving'] },
        { id: 'century-first-experiments', label: '带自然科学实验笔记，先建立验证和解释方法', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'scientific'] },
        { id: 'century-first-printing', label: '带图文传播和印刷方法，让新想法被更多人看见', riasecWeights: { A: 1, E: 1 }, personalityTags: ['creative', 'influential'] },
        { id: 'century-first-school', label: '带学校和工坊协作方法，先组织人一起学习', riasecWeights: { S: 1, E: 1 }, personalityTags: ['teaching', 'organizer'] },
      ],
      itemScene:
        '系统允许你从随身包里留下 4 类资料或工具。每类都可能改变一部分生活，但你不能全带。',
      itemImageSrc: CAREER_SCENARIO_IMAGE('17th-century-ranking'),
      itemPrompt: '你会优先留下哪 4 类资料或工具？请按优先级从先到后排列。',
      itemMaxSelections: 4,
      itemOptions: [
        { id: 'century-item-toolbox', label: '锯、钳、尺和手摇钻图纸', riasecWeights: { R: 1 }, personalityTags: ['hands-on'] },
        { id: 'century-item-medical-kit', label: '消毒、急救和卫生手册', riasecWeights: { R: 1 }, personalityTags: ['practical-care'] },
        { id: 'century-item-science-notes', label: '电、热、光的实验笔记', riasecWeights: { I: 1 }, personalityTags: ['scientific'] },
        { id: 'century-item-navigation', label: '地图、天文和航海方法', riasecWeights: { I: 1 }, personalityTags: ['exploration'] },
        { id: 'century-item-art-book', label: '戏剧、绘画和音乐作品集', riasecWeights: { A: 1 }, personalityTags: ['creative'] },
        { id: 'century-item-printing', label: '印刷排版和图文传播法', riasecWeights: { A: 1 }, personalityTags: ['visual-communication'] },
        { id: 'century-item-school-plan', label: '识字课堂和学徒训练方案', riasecWeights: { S: 1 }, personalityTags: ['teaching'] },
        { id: 'century-item-health-lessons', label: '公共卫生和照护课程', riasecWeights: { S: 1 }, personalityTags: ['helper'] },
        { id: 'century-item-workshop-network', label: '工坊联盟和交易谈判指南', riasecWeights: { E: 1 }, personalityTags: ['initiative'] },
        { id: 'century-item-demo-day', label: '公开演示和募资计划', riasecWeights: { E: 1 }, personalityTags: ['persuasive'] },
        { id: 'century-item-accounts', label: '账本、标准计量和库存法', riasecWeights: { C: 1 }, personalityTags: ['structured'] },
        { id: 'century-item-farming-plan', label: '农作流程和粮食保存表', riasecWeights: { C: 1 }, personalityTags: ['organized'] },
      ],
      openScene:
        '当地人给你一个机会：你可以先推广一件事，证明未来知识不是空话。',
      openImageSrc: CAREER_SCENARIO_IMAGE('17th-century-team-next-step'),
      teamPrompt: '你最想先推广哪一类改变？',
      teamOptions: [
        { id: 'century-team-production', label: '能立刻改善生产和生活的工具、工艺与示范', riasecWeights: { R: 1, S: 1 }, personalityTags: ['practical', 'helpful'] },
        { id: 'century-team-science', label: '能解释自然现象的实验方法和证据标准', riasecWeights: { I: 1, C: 1 }, personalityTags: ['scientific', 'analytical'] },
        { id: 'century-team-culture', label: '能改变想象力的故事、图像和公共表达', riasecWeights: { A: 1, E: 1 }, personalityTags: ['creative', 'influential'] },
        { id: 'century-team-learning', label: '能组织学校、工坊或公共讨论的协作方式', riasecWeights: { S: 1, E: 1 }, personalityTags: ['teaching', 'organizer'] },
      ],
      openPrompt: '如果只能用一句话说服当地人信任你，你会强调自己的什么贡献？',
      openFields: [
        { id: 'teamRole', label: '（可选）你会强调自己能带来什么贡献？', type: 'text', placeholder: '例如修工具、做实验、传播故事、组织课堂、管理物资，或其他具体贡献。' },
      ],
    },
  },
  {
    id: 'value-roommate-rules',
    phase: 'D',
    type: 'career-scenario',
    imageSrc: CAREER_SCENARIO_IMAGE('roommate-rules-first-reaction'),
    prompt: '室友合租规则谈不拢',
    careerScenario: {
      scene:
        '你和室友住在一起一段时间后，问题越来越多：有人晚归开灯，有人公共区堆东西，有人觉得打扫不公平，也有人不想把关系弄僵。大家终于坐下来谈规则，但每个人都觉得自己有理由。',
      sceneImageSrc: CAREER_SCENARIO_IMAGE('roommate-rules-first-reaction'),
      sceneImageMode: 'per-section',
      firstPrompt: '刚开始谈的时候，你最可能先做什么？',
      firstOptions: [
        { id: 'roommate-first-list-facts', label: '先把具体问题列出来，分清哪些是偶发、哪些是长期影响', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'structured'] },
        { id: 'roommate-first-feelings', label: '先让每个人说出最受不了的点，避免一上来就互相指责', riasecWeights: { S: 1, I: 1 }, personalityTags: ['supportive', 'reflective'] },
        { id: 'roommate-first-rule-table', label: '先提出一张值日和公共区规则表，让事情有标准可执行', riasecWeights: { C: 1, E: 1 }, personalityTags: ['structured', 'organizer'] },
        { id: 'roommate-first-space-fix', label: '先调整公共空间和物品摆放，减少以后继续冲突的机会', riasecWeights: { R: 1, A: 1 }, personalityTags: ['hands-on', 'creative-problem-solving'] },
      ],
      itemScene:
        '规则谈判不能只靠情绪，也不能只靠一张表。你需要选择最先推动的具体动作。',
      itemImageSrc: CAREER_SCENARIO_IMAGE('roommate-rules-ranking'),
      itemPrompt: '你只能先推动 4 个具体解决动作。你会优先选哪 4 个？请按优先级从先到后排列。',
      itemMaxSelections: 4,
      itemOptions: [
        { id: 'roommate-item-clear-space', label: '整理公共区物品', riasecWeights: { R: 1 }, personalityTags: ['hands-on'] },
        { id: 'roommate-item-fix-device', label: '修好或替换常出问题的设备', riasecWeights: { R: 1 }, personalityTags: ['practical'] },
        { id: 'roommate-item-log-conflict', label: '记录一周冲突发生时间', riasecWeights: { I: 1 }, personalityTags: ['observant'] },
        { id: 'roommate-item-root-cause', label: '分析最容易引爆矛盾的原因', riasecWeights: { I: 1 }, personalityTags: ['analytical'] },
        { id: 'roommate-item-layout', label: '重新设计公共区布局', riasecWeights: { A: 1 }, personalityTags: ['creative'] },
        { id: 'roommate-item-friendly-note', label: '做一张友好的规则提醒', riasecWeights: { A: 1 }, personalityTags: ['visual-communication'] },
        { id: 'roommate-item-listen', label: '单独听室友真实顾虑', riasecWeights: { S: 1 }, personalityTags: ['supportive'] },
        { id: 'roommate-item-talk', label: '组织一次不指责的沟通', riasecWeights: { S: 1 }, personalityTags: ['mediating'] },
        { id: 'roommate-item-host-meeting', label: '主持一次规则讨论', riasecWeights: { E: 1 }, personalityTags: ['organizer'] },
        { id: 'roommate-item-decide', label: '推动大家现场做决定', riasecWeights: { E: 1 }, personalityTags: ['decisive'] },
        { id: 'roommate-item-duty-table', label: '制定值日和费用表', riasecWeights: { C: 1 }, personalityTags: ['structured'] },
        { id: 'roommate-item-boundary', label: '写清噪音和访客边界', riasecWeights: { C: 1 }, personalityTags: ['detail-oriented'] },
      ],
      openScene:
        '如果大家意见仍然不一致，你需要让关系、规则和执行同时向前走一点。',
      openImageSrc: CAREER_SCENARIO_IMAGE('roommate-rules-team-next-step'),
      teamPrompt: '你会怎么推进？',
      teamOptions: [
        { id: 'roommate-team-trial', label: '先定一个两周试行规则，到期按事实调整', riasecWeights: { R: 1, C: 1 }, personalityTags: ['practice-first', 'structured'] },
        { id: 'roommate-team-mediate', label: '先处理最伤关系的部分，让每个人觉得被听见', riasecWeights: { S: 1, I: 1 }, personalityTags: ['mediating', 'reflective'] },
        { id: 'roommate-team-redesign', label: '改造公共区和提醒方式，用环境减少摩擦', riasecWeights: { R: 1, A: 1 }, personalityTags: ['hands-on', 'creative-problem-solving'] },
        { id: 'roommate-team-decision', label: '把争议拆成几项清楚选项，让每个人更容易表达底线', riasecWeights: { A: 1, S: 1 }, personalityTags: ['visual-communication', 'mediating'] },
      ],
      openPrompt: '如果你是这个合租小组的一员，你最适合负责哪种贡献？',
      openFields: [
        { id: 'teamRole', label: '（可选）你最适合负责哪种贡献？', type: 'text', placeholder: '例如整理空间、分析原因、安抚沟通、主持讨论、制定规则、记录执行，或其他具体贡献。' },
      ],
    },
  },
  {
    id: 'value-family-pet-decision',
    phase: 'D',
    type: 'career-scenario',
    imageSrc: CAREER_SCENARIO_IMAGE('family-pet-decision-first-reaction'),
    prompt: '家里突然讨论要不要养宠物',
    careerScenario: {
      scene:
        '家里突然认真讨论要不要养一只宠物。有人很期待陪伴，有人担心花费、卫生和责任，也有人担心只是三分钟热度。你不需要立刻表态喜欢或不喜欢，而是要判断这件事能不能长期负责。',
      sceneImageSrc: CAREER_SCENARIO_IMAGE('family-pet-decision-first-reaction'),
      sceneImageMode: 'per-section',
      firstPrompt: '听到这个讨论时，你最可能先做什么？',
      firstOptions: [
        { id: 'pet-first-care-test', label: '先试着照顾几天，看看自己能不能承担日常喂养和清理', riasecWeights: { R: 1, S: 1 }, personalityTags: ['hands-on', 'helper'] },
        { id: 'pet-first-cost-risk', label: '先查费用、疾病、时间和空间要求，判断现实压力', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'structured'] },
        { id: 'pet-first-family-talk', label: '先听每个人的期待和担心，确认冲突点在哪里', riasecWeights: { S: 1, I: 1 }, personalityTags: ['supportive', 'reflective'] },
        { id: 'pet-first-home-design', label: '先想象它进入家庭后的生活动线和空间布置', riasecWeights: { A: 1, R: 1 }, personalityTags: ['creative', 'hands-on'] },
      ],
      itemScene:
        '养宠物不是一个只靠喜欢就能决定的问题。你需要先选出几项能验证长期责任的准备。',
      itemImageSrc: CAREER_SCENARIO_IMAGE('family-pet-decision-ranking'),
      itemPrompt: '如果要认真评估这件事，你会先做哪 4 项准备？请按优先级从先到后排列。',
      itemMaxSelections: 4,
      itemOptions: [
        { id: 'pet-item-feed-clean', label: '试做喂养和清洁', riasecWeights: { R: 1 }, personalityTags: ['hands-on'] },
        { id: 'pet-item-supplies', label: '准备基础用品清单', riasecWeights: { R: 1 }, personalityTags: ['practical'] },
        { id: 'pet-item-health-risk', label: '查询品种和健康风险', riasecWeights: { I: 1 }, personalityTags: ['researching'] },
        { id: 'pet-item-real-cases', label: '比较真实养护案例', riasecWeights: { I: 1 }, personalityTags: ['analytical'] },
        { id: 'pet-item-activity-corner', label: '设计宠物活动角落', riasecWeights: { A: 1 }, personalityTags: ['creative'] },
        { id: 'pet-item-life-scene', label: '记录理想相处画面', riasecWeights: { A: 1 }, personalityTags: ['self-authoring'] },
        { id: 'pet-item-family-concerns', label: '和家人分别沟通顾虑', riasecWeights: { S: 1 }, personalityTags: ['supportive'] },
        { id: 'pet-item-care-trial', label: '安排照护责任试运行', riasecWeights: { S: 1 }, personalityTags: ['helper'] },
        { id: 'pet-item-adoption-contact', label: '联系领养或咨询机构', riasecWeights: { E: 1 }, personalityTags: ['initiative'] },
        { id: 'pet-item-family-meeting', label: '推动一次家庭决策会议', riasecWeights: { E: 1 }, personalityTags: ['organizer'] },
        { id: 'pet-item-monthly-cost', label: '计算月度费用', riasecWeights: { C: 1 }, personalityTags: ['structured'] },
        { id: 'pet-item-duty-roster', label: '制定喂养和清洁排班', riasecWeights: { C: 1 }, personalityTags: ['organized'] },
      ],
      openScene:
        '如果家里意见不一致，你需要让喜欢、担心和责任都变得更具体。',
      openImageSrc: CAREER_SCENARIO_IMAGE('family-pet-decision-team-next-step'),
      teamPrompt: '你更倾向于下一步怎么做？',
      teamOptions: [
        { id: 'pet-team-trial-care', label: '先做一段试照护，用真实执行情况推动家里做决定', riasecWeights: { R: 1, E: 1 }, personalityTags: ['hands-on', 'initiative'] },
        { id: 'pet-team-risk-check', label: '把费用、时间、疾病和空间风险查清楚再谈', riasecWeights: { A: 1, C: 1 }, personalityTags: ['visual-thinking', 'risk-aware'] },
        { id: 'pet-team-family-balance', label: '先解决家人最担心的责任分配和情绪顾虑', riasecWeights: { S: 1, E: 1 }, personalityTags: ['supportive', 'organizer'] },
        { id: 'pet-team-space-plan', label: '设计一个不打扰生活的宠物空间和相处方式', riasecWeights: { A: 1, S: 1 }, personalityTags: ['creative', 'social'] },
      ],
      openPrompt: '如果最后真的养了，你最愿意长期承担哪一部分责任？',
      openFields: [
        { id: 'teamRole', label: '（可选）你愿意长期承担什么责任？', type: 'text', placeholder: '例如喂养、清洁、观察健康、陪伴训练、费用记录、家庭沟通，或其他长期责任。' },
      ],
    },
  },
  {
    id: 'value-future-self-letter',
    phase: 'D',
    type: 'career-scenario',
    imageSrc: CAREER_SCENARIO_IMAGE('future-self-letter-first-reaction'),
    prompt: '给未来的自己写一封信',
    careerScenario: {
      scene:
        '测评快结束时，系统弹出一个特别任务：给未来的自己写一封信。不是写漂亮愿望，而是留下一个未来能检查的证据：你希望几年后的自己回头看时，能看到你从现在开始真正做过什么。',
      sceneImageSrc: CAREER_SCENARIO_IMAGE('future-self-letter-first-reaction'),
      sceneImageMode: 'per-section',
      firstPrompt: '如果这封信只能留下一个核心证据，你最想写下什么？',
      firstOptions: [
        { id: 'future-first-made-thing', label: '我希望未来能看到自己亲手做成过一个具体作品或项目', riasecWeights: { R: 1, A: 1 }, personalityTags: ['hands-on', 'creative'] },
        { id: 'future-first-understood', label: '我希望未来能看到自己拆解并验证过一个复杂问题', riasecWeights: { I: 1, R: 1 }, personalityTags: ['analytical', 'practice-first'] },
        { id: 'future-first-helped', label: '我希望未来能看到自己长期做成过一件对真实的人有帮助的小事', riasecWeights: { R: 1, C: 1 }, personalityTags: ['helper', 'consistent'] },
        { id: 'future-first-led', label: '我希望未来能看到自己争取过机会，并带动别人一起做成事', riasecWeights: { E: 1, S: 1 }, personalityTags: ['initiative', 'organizer'] },
      ],
      itemScene:
        '为了让这封信不是空话，你需要留下能被未来自己看见的证据。不同证据代表不同的投入方式。',
      itemImageSrc: CAREER_SCENARIO_IMAGE('future-self-letter-ranking'),
      itemPrompt: '为了让这封信不是空话，你会先留下哪 4 种证据？请按优先级从先到后排列。',
      itemMaxSelections: 4,
      itemOptions: [
        { id: 'future-item-small-work', label: '一个可展示的小作品', riasecWeights: { R: 1 }, personalityTags: ['hands-on'] },
        { id: 'future-item-practice-log', label: '一次真实动手实践记录', riasecWeights: { R: 1 }, personalityTags: ['practice-first'] },
        { id: 'future-item-research-note', label: '一份问题研究笔记', riasecWeights: { I: 1 }, personalityTags: ['researching'] },
        { id: 'future-item-evidence-map', label: '一张概念或证据地图', riasecWeights: { I: 1 }, personalityTags: ['analytical'] },
        { id: 'future-item-artist-statement', label: '一段个人作品陈述', riasecWeights: { A: 1 }, personalityTags: ['self-authoring'] },
        { id: 'future-item-creative-set', label: '一组图像、文字或声音作品', riasecWeights: { A: 1 }, personalityTags: ['creative'] },
        { id: 'future-item-help-record', label: '一次帮助别人的记录', riasecWeights: { S: 1 }, personalityTags: ['helper'] },
        { id: 'future-item-feedback', label: '一段来自他人的反馈', riasecWeights: { S: 1 }, personalityTags: ['feedback-seeking'] },
        { id: 'future-item-opportunity', label: '一次主动争取机会', riasecWeights: { E: 1 }, personalityTags: ['initiative'] },
        { id: 'future-item-organize-action', label: '一次组织或推进行动', riasecWeights: { E: 1 }, personalityTags: ['organizer'] },
        { id: 'future-item-long-plan', label: '一张长期计划表', riasecWeights: { C: 1 }, personalityTags: ['structured'] },
        { id: 'future-item-review-list', label: '一次阶段复盘清单', riasecWeights: { C: 1 }, personalityTags: ['organized'] },
      ],
      openScene:
        '如果未来的你只看一段话，你需要让那段话能提醒自己做出真实行动。',
      openImageSrc: CAREER_SCENARIO_IMAGE('future-self-letter-team-next-step'),
      teamPrompt: '你更希望那段话提醒自己什么？',
      teamOptions: [
        { id: 'future-team-build', label: '不要只想，至少亲手做出一个能被看见的东西', riasecWeights: { R: 1, A: 1 }, personalityTags: ['hands-on', 'creative'] },
        { id: 'future-team-learn', label: '不要只跟风，要留下自己理解和判断的证据', riasecWeights: { I: 1, C: 1 }, personalityTags: ['analytical', 'structured'] },
        { id: 'future-team-care', label: '不要只追求个人结果，也要记得自己怎样影响别人', riasecWeights: { S: 1, A: 1 }, personalityTags: ['supportive', 'expressive'] },
        { id: 'future-team-lead', label: '不要等别人安排，要主动争取并组织一次机会', riasecWeights: { E: 1, C: 1 }, personalityTags: ['initiative', 'organized'] },
      ],
      openPrompt: '你会给未来的自己留下一句什么提醒？这句话最好能对应一个真实行动。',
      openFields: [
        { id: 'teamRole', label: '（可选）你会留下什么提醒？', type: 'text', placeholder: '例如我要做出作品、查清问题、持续帮助别人、主动争取机会，或你自己的真实行动。' },
      ],
    },
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

function scrambleCareerScenarioOptions(question: Question): Question {
  const scenario = question.careerScenario;
  if (!scenario) return question;

  return {
    ...question,
    careerScenario: {
      ...scenario,
      firstOptions: stableOptionShuffle(scenario.firstOptions, `${question.id}:first`),
      itemOptions: stableOptionShuffle(scenario.itemOptions, `${question.id}:items`),
      teamOptions: scenario.teamOptions
        ? stableOptionShuffle(scenario.teamOptions, `${question.id}:team`)
        : scenario.teamOptions,
    },
  };
}

const SCRAMBLED_VALUE_TESTS = VALUE_TESTS.map(scrambleCareerScenarioOptions);

const HOLLAND_FINE_DIMENSION_IMAGES: Record<RIASECDimension, string> = {
  R: DISCOVER_ASSESSMENT_DEEP_HOLLAND_SCENE_IMAGE('r', 0),
  I: DISCOVER_ASSESSMENT_DEEP_HOLLAND_SCENE_IMAGE('i', 0),
  A: DISCOVER_ASSESSMENT_DEEP_HOLLAND_SCENE_IMAGE('a', 0),
  S: DISCOVER_ASSESSMENT_DEEP_HOLLAND_SCENE_IMAGE('s', 0),
  E: DISCOVER_ASSESSMENT_DEEP_HOLLAND_SCENE_IMAGE('e', 0),
  C: DISCOVER_ASSESSMENT_DEEP_HOLLAND_SCENE_IMAGE('c', 0),
};

const HOLLAND_FINE_ACCEPTED_DEEP_IMAGE_DIMENSIONS = new Set<RIASECDimension>(['R', 'I', 'A', 'S', 'E', 'C']);

function getAcceptedHollandFineItemSceneImageSrc(
  dimension: RIASECDimension,
  item: HollandFineBankItem,
  itemIndex: number,
) {
  if (!HOLLAND_FINE_ACCEPTED_DEEP_IMAGE_DIMENSIONS.has(dimension)) return item.sceneImageSrc;
  const sceneIndex = Number(item.number ?? itemIndex + 1) - 1;
  return DISCOVER_ASSESSMENT_DEEP_HOLLAND_SCENE_IMAGE(dimension.toLowerCase(), sceneIndex);
}

function createHollandFineSceneQuestion(dimension: RIASECDimension, sceneIndex: number): Question {
  const dimensionData = HOLLAND_FINE_DIMENSION_DATA[dimension];
  const sceneItems = dimensionData.sections
    .map((section) => section.items[sceneIndex])
    .filter(Boolean);
  const firstItem = sceneItems[0];
  const sceneNumber = sceneIndex + 1;
  const sceneId = `holland-${dimension.toLowerCase()}-scene-${String(sceneNumber).padStart(2, '0')}`;

  return {
    id: sceneId,
    phase: 'D',
    type: 'holland-fine-grained',
    prompt: `${dimensionData.label}｜${firstItem?.sceneTitle ?? `场景 ${sceneNumber}`}`,
    subtext: dimensionData.sections.map((section) => section.axisLabel).filter(Boolean).join(' / '),
    imageSrc: HOLLAND_FINE_DIMENSION_IMAGES[dimension],
    hollandFine: {
      id: sceneId,
      title: firstItem?.sceneTitle ?? `场景 ${sceneNumber}`,
      mode: 'single',
      sectionIntro: firstItem?.scene,
      dimension,
      dimensionLabel: dimensionData.label,
      sourcePath: dimensionData.sourcePath,
      items: sceneItems.map((item) => ({
        ...item,
        options: item.options
          ? stableOptionShuffle(item.options, `${sceneId}:${item.id}:holland-fine-option-order`)
          : item.options,
        sceneImageSrc: getAcceptedHollandFineItemSceneImageSrc(dimension, item, sceneIndex),
      })) as HollandFineBankItem[],
    },
  };
}

export const HOLLAND_FINE_QUESTIONS: Question[] = HOLLAND_FINE_DIMENSION_ORDER.flatMap((dimension) =>
  Array.from({ length: 5 }, (_, sceneIndex) => createHollandFineSceneQuestion(dimension, sceneIndex)),
);

export const HOLLAND_FINE_QUESTION_IDS = HOLLAND_FINE_QUESTIONS.map((question) => question.id);

export function getHollandFineQuestionIdsForDimensions(dimensions: RIASECDimension[]) {
  const uniqueDimensions = Array.from(new Set(dimensions)).filter((dimension) => HOLLAND_FINE_DIMENSION_DATA[dimension]);
  return uniqueDimensions.flatMap((dimension) =>
    Array.from({ length: 5 }, (_, sceneIndex) =>
      `holland-${dimension.toLowerCase()}-scene-${String(sceneIndex + 1).padStart(2, '0')}`,
    ),
  );
}

export function getHollandFineQuestionsForDimensions(dimensions: RIASECDimension[]) {
  const ids = new Set(getHollandFineQuestionIdsForDimensions(dimensions));
  return HOLLAND_FINE_QUESTIONS.filter((question) => ids.has(question.id));
}

export const FINAL_CAREER_CALIBRATION_SOURCE_PATH =
  'docs/Zhiye_Huolande_Doc/final_career_recommendation_assessment.md';

export const CAREER_CALIBRATION_DIMENSIONS: Array<{
  key: CareerCalibrationDimensionKey;
  label: string;
  highMeaning: string;
  lowMeaning: string;
}> = [
  {
    key: 'stabilityChangeTolerance',
    label: '稳定与变化承受',
    highMeaning: '更能接受稳定流程、固定岗位、重复任务和长期积累。',
    lowMeaning: '更需要变化、新问题、移动空间和阶段性更新。',
  },
  {
    key: 'innovationMeaningNeed',
    label: '创新与意义需求',
    highMeaning: '更需要创新、表达、探索、问题解决和可感知的工作意义。',
    lowMeaning: '可以接受任务意义不强但稳定清晰的工作安排。',
  },
  {
    key: 'moneyStatusWeight',
    label: '金钱与外部评价权重',
    highMeaning: '更重视收入增长、社会认可、头衔、行业排名和可见成就。',
    lowMeaning: '更能接受低曝光、低排名压力或回报较慢的方向。',
  },
  {
    key: 'riskUncertaintyTolerance',
    label: '风险与不确定性承受',
    highMeaning: '可以接受不确定路径、竞争压力、阶段性失败和结果波动。',
    lowMeaning: '更适合路径清晰、培养稳定、规则明确和风险较低的方向。',
  },
  {
    key: 'workLifeBoundaryPreference',
    label: '工作生活边界与节奏偏好',
    highMeaning: '更需要清晰边界、稳定节奏、可预期作息和长期生活安排。',
    lowMeaning: '能接受高强度、项目制、即时响应和阶段性投入。',
  },
];

const CAREER_CALIBRATION_DIMENSION_BY_KEY = new Map(
  CAREER_CALIBRATION_DIMENSIONS.map((dimension) => [dimension.key, dimension]),
);

export const CAREER_CALIBRATION_SCALE_OPTIONS: QuestionOption[] = [
  { id: 'final-career-calibration-scale-5', label: '非常符合', riasecWeights: {} },
  { id: 'final-career-calibration-scale-4', label: '比较符合', riasecWeights: {} },
  { id: 'final-career-calibration-scale-3', label: '一般', riasecWeights: {} },
  { id: 'final-career-calibration-scale-2', label: '不太符合', riasecWeights: {} },
  { id: 'final-career-calibration-scale-1', label: '非常不符合', riasecWeights: {} },
];

type FinalCareerCalibrationQuestionSource = {
  prompt: string;
  dimension: CareerCalibrationDimensionKey;
  scoringDirection: CareerCalibrationScoringDirection;
};

const FINAL_CAREER_CALIBRATION_SOURCES: FinalCareerCalibrationQuestionSource[] = [
  {
    dimension: 'stabilityChangeTolerance',
    scoringDirection: 'positive',
    prompt: '如果一份工作每天面对相似流程、相似对象和相似评价标准，只要它稳定可靠，我可以长期投入。',
  },
  {
    dimension: 'stabilityChangeTolerance',
    scoringDirection: 'positive',
    prompt: '我能接受几年内工作内容变化不大，只要职责清楚、收入稳定、组织规则明确。',
  },
  {
    dimension: 'stabilityChangeTolerance',
    scoringDirection: 'reverse',
    prompt: '如果一份工作很少出现新任务、新人群或新问题，即使条件不错，我也会明显感到消耗。',
  },
  {
    dimension: 'stabilityChangeTolerance',
    scoringDirection: 'positive',
    prompt: '相比频繁换项目、换团队、换目标，我更愿意在一个熟悉岗位里把细节越做越稳。',
  },
  {
    dimension: 'stabilityChangeTolerance',
    scoringDirection: 'reverse',
    prompt: '当生活和工作过于可预测时，我会主动寻找新的任务、环境或挑战来打破惯性。',
  },
  {
    dimension: 'innovationMeaningNeed',
    scoringDirection: 'positive',
    prompt: '如果一份工作长期只是执行已有流程，没有提出新想法或改进方法的空间，我很难保持投入。',
  },
  {
    dimension: 'innovationMeaningNeed',
    scoringDirection: 'positive',
    prompt: '选择专业或职业时，我会认真考虑这件事是否能让我接触真实问题，而不只是完成被分配的任务。',
  },
  {
    dimension: 'innovationMeaningNeed',
    scoringDirection: 'reverse',
    prompt: '如果工作收入稳定、要求明确、压力可控，即使它本身没有太多创造性，我也可以接受。',
  },
  {
    dimension: 'innovationMeaningNeed',
    scoringDirection: 'positive',
    prompt: '当一个方向能让我做出新方案、新表达、新产品或新解释时，它会明显增加我的兴趣。',
  },
  {
    dimension: 'innovationMeaningNeed',
    scoringDirection: 'positive',
    prompt: '我不希望未来的工作只是在系统里处理任务、提交结果，而看不到它连接的真实人、问题或变化。',
  },
  {
    dimension: 'moneyStatusWeight',
    scoringDirection: 'positive',
    prompt: '选择专业或职业时，未来收入上限会明显影响我的判断。',
  },
  {
    dimension: 'moneyStatusWeight',
    scoringDirection: 'positive',
    prompt: '如果一个方向社会评价高、身边人也认可，我会更愿意认真考虑它。',
  },
  {
    dimension: 'moneyStatusWeight',
    scoringDirection: 'reverse',
    prompt: '即使一个方向不热门、收入增长慢，只要它符合我的长期兴趣，我也能接受。',
  },
  {
    dimension: 'moneyStatusWeight',
    scoringDirection: 'positive',
    prompt: '我希望自己的工作成果能被清楚看见，例如排名、奖金、晋升、作品传播或项目影响力。',
  },
  {
    dimension: 'moneyStatusWeight',
    scoringDirection: 'positive',
    prompt: '如果一份工作很有价值但长期缺少外部认可、公开反馈或职业身份感，我会犹豫。',
  },
  {
    dimension: 'riskUncertaintyTolerance',
    scoringDirection: 'positive',
    prompt: '如果一个职业方向前期路径不清晰，但有较大成长空间，我愿意用实习、项目和试错去验证。',
  },
  {
    dimension: 'riskUncertaintyTolerance',
    scoringDirection: 'positive',
    prompt: '面对竞争强、淘汰快、反馈直接的环境，我会紧张，但不一定会回避。',
  },
  {
    dimension: 'riskUncertaintyTolerance',
    scoringDirection: 'reverse',
    prompt: '如果一个方向需要长期承受收入波动、机会不稳定或项目失败，我会倾向避开。',
  },
  {
    dimension: 'riskUncertaintyTolerance',
    scoringDirection: 'positive',
    prompt: '我可以接受先进入一个变化很快的行业，再根据真实反馈调整自己的位置。',
  },
  {
    dimension: 'riskUncertaintyTolerance',
    scoringDirection: 'reverse',
    prompt: '相比高回报但不确定的路线，我更愿意选择培养路径、考试规则或晋升方式更明确的路线。',
  },
  {
    dimension: 'workLifeBoundaryPreference',
    scoringDirection: 'positive',
    prompt: '选择职业时，我会认真考虑它是否长期占用晚上、周末或假期。',
  },
  {
    dimension: 'workLifeBoundaryPreference',
    scoringDirection: 'positive',
    prompt: '如果一份工作经常需要临时响应、加班或根据项目节奏调整生活，我会比较难适应。',
  },
  {
    dimension: 'workLifeBoundaryPreference',
    scoringDirection: 'reverse',
    prompt: '为了获得更快成长、更高收入或更好的机会，我可以接受一段时间的高强度工作。',
  },
  {
    dimension: 'workLifeBoundaryPreference',
    scoringDirection: 'positive',
    prompt: '我希望未来工作结束后，仍然能保留稳定的家庭、朋友、休息和个人兴趣时间。',
  },
  {
    dimension: 'workLifeBoundaryPreference',
    scoringDirection: 'reverse',
    prompt: '如果工作本身足够吸引我，我可以接受它阶段性占据生活中的大部分注意力。',
  },
];

export const FINAL_CAREER_CALIBRATION_QUESTIONS: Question[] = FINAL_CAREER_CALIBRATION_SOURCES.map((source, index) => {
  const dimension = CAREER_CALIBRATION_DIMENSION_BY_KEY.get(source.dimension);
  if (!dimension) throw new Error(`Missing career calibration dimension: ${source.dimension}`);
  const questionNumber = index + 1;
  return {
    id: `final-career-calibration-${String(questionNumber).padStart(2, '0')}`,
    phase: 'D',
    type: 'career-calibration-scale',
    imageSrc: DISCOVER_CAREER_CALIBRATION_IMAGE(index),
    prompt: source.prompt,
    careerCalibration: {
      sourcePath: FINAL_CAREER_CALIBRATION_SOURCE_PATH,
      dimension: source.dimension,
      dimensionLabel: dimension.label,
      scoringDirection: source.scoringDirection,
      questionNumber,
    },
    options: CAREER_CALIBRATION_SCALE_OPTIONS,
  };
});

export const FINAL_CAREER_CALIBRATION_QUESTION_IDS =
  FINAL_CAREER_CALIBRATION_QUESTIONS.map((question) => question.id);

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
  ...HOLLAND_FINE_QUESTIONS,
  ...FINAL_CAREER_CALIBRATION_QUESTIONS,
  ...SCRAMBLED_VALUE_TESTS,
];

const FULL_QUESTION_BY_ID = new Map(FULL_QUESTION_BANK.map((question) => [question.id, question]));

export function getDiscoverQuestionDefinition(questionId: string) {
  return FULL_QUESTION_BY_ID.get(questionId) ?? null;
}

export const DISCOVER_ABILITY_MODULE_QUESTIONS: Question[] = DISCOVER_ABILITY_QUESTION_IDS.map((questionId) => {
  const question = getDiscoverQuestionDefinition(questionId);
  if (!question) throw new Error(`Missing inactive Discover ability question: ${questionId}`);
  return question;
});

const ACTIVE_QUESTION_IDS = [
  'basic-profile',
  ...PERSONALITY_MBTI_QUESTION_IDS,
  ...PERSONALITY_HOLLAND_SCALE_QUESTION_IDS,
  ...HOLLAND_FINE_QUESTION_IDS,
  ...FINAL_CAREER_CALIBRATION_QUESTION_IDS,
] as const;

export const ALL_QUESTIONS: Question[] = ACTIVE_QUESTION_IDS.map((questionId) => {
  const question = getDiscoverQuestionDefinition(questionId);
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

export function createEmptyHollandFineAnswer(question?: Question): HollandFineAnswer {
  const items: Record<string, HollandFineAnswerItemValue> = {};
  for (const item of question?.hollandFine?.items ?? []) {
    items[item.id] = item.mode === 'open' ? { openResponses: {} } : { selectedOptionIds: [] };
  }
  return { items };
}

export function isHollandFineAnswerValue(value: AnswerValue | undefined): value is HollandFineAnswer {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'items' in value &&
    typeof (value as { items?: unknown }).items === 'object' &&
    (value as { items?: unknown }).items !== null
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

const RIASEC_DIMENSIONS: RIASECDimension[] = ['R', 'I', 'A', 'S', 'E', 'C'];
export const DISCOVER_RIASEC_SECTION_WEIGHTS = {
  preCareer: 1,
  fineGrained: 0,
  // Legacy keys are kept for older audit/debug callers.
  interest: 1,
  career: 0,
} as const;

export type AbilityQuestionType = 'language_understanding' | 'board_reasoning';

export interface AbilityPerformanceItem {
  questionId: string;
  questionType: AbilityQuestionType;
  questionTypeLabel: string;
  selectedOptionId: string;
  selectedLabel: string;
  correctOptionId: string;
  correctLabel: string;
  isCorrect: boolean;
}

export interface AbilityPerformanceByType {
  questionType: AbilityQuestionType;
  questionTypeLabel: string;
  totalCount: number;
  correctCount: number;
  incorrectCount: number;
}

export interface AbilityPerformanceSummary {
  version: 'ability_performance_v1';
  totalCount: number;
  correctCount: number;
  incorrectCount: number;
  byQuestionType: AbilityPerformanceByType[];
  items: AbilityPerformanceItem[];
}

function createEmptyRiasecScores(): RIASECScores {
  return { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
}

function addRiasecWeights(
  scores: RIASECScores,
  weights: Partial<Record<RIASECDimension, number>>,
  multiplier = 1,
) {
  for (const [dim, weight] of Object.entries(weights)) {
    const numericWeight = Number(weight);
    if (!Number.isFinite(numericWeight)) continue;
    scores[dim as RIASECDimension] += numericWeight * multiplier;
  }
}

function addCareerScenarioClosedChoiceScores(
  scores: RIASECScores,
  question: Question,
  value: AnswerValue,
) {
  if (!isCareerScenarioValue(value)) return;
  const scenario = question.careerScenario;
  if (!scenario) return;

  const firstOption = scenario.firstOptions.find((option) => option.id === value.firstChoiceId);
  if (firstOption) addRiasecWeights(scores, firstOption.riasecWeights);

  for (const optId of value.itemChoiceIds) {
    const option = scenario.itemOptions.find((item) => item.id === optId);
    if (option) addRiasecWeights(scores, option.riasecWeights);
  }

  const teamOption = scenario.teamOptions?.find((option) => option.id === value.teamChoiceId);
  if (teamOption) addRiasecWeights(scores, teamOption.riasecWeights);
}

function scoreTotal(scores: RIASECScores) {
  return RIASEC_DIMENSIONS.reduce((total, dimension) => total + Math.max(0, scores[dimension]), 0);
}

function collectHollandFineOptions(question: Question, value: AnswerValue): QuestionOption[] {
  if (!question.hollandFine || !isHollandFineAnswerValue(value)) return [];
  const options: QuestionOption[] = [];

  for (const item of question.hollandFine.items) {
    const answerItem = value.items[item.id];
    const selectedIds = answerItem?.selectedOptionIds ?? [];
    for (const optionId of selectedIds) {
      const option = item.options?.find((candidate) => candidate.id === optionId);
      if (option) options.push(option);
    }
  }

  return options;
}

function addHollandFineClosedChoiceScores(
  scores: RIASECScores,
  question: Question,
  value: AnswerValue,
) {
  for (const option of collectHollandFineOptions(question, value)) {
    addRiasecWeights(scores, option.riasecWeights);
  }
}

export function computeInterestTagScores(answers: Answer[]): RIASECScores {
  const scores = createEmptyRiasecScores();

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
    if (question?.type !== 'interest-tag-grid' || !question.id.startsWith('interest-tags-')) continue;
    const selectedIds = Array.isArray(answer.value) ? answer.value : [];
    for (const optId of selectedIds) {
      const option = question.options?.find((item) => item.id === optId);
      if (option) addRiasecWeights(scores, option.riasecWeights);
    }
  }

  return scores;
}

export function computeCareerScenarioScores(answers: Answer[]): RIASECScores {
  const scores = createEmptyRiasecScores();

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
    if (question?.type !== 'career-scenario') continue;
    addCareerScenarioClosedChoiceScores(scores, question, answer.value);
  }

  return scores;
}

export function computeHollandFineScores(answers: Answer[]): RIASECScores {
  const scores = createEmptyRiasecScores();

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
    if (question?.type !== 'holland-fine-grained') continue;
    addHollandFineClosedChoiceScores(scores, question, answer.value);
  }

  return scores;
}

export function computeSecondStageHollandScaleScores(answers: Answer[]): RIASECScores {
  const scores = createEmptyRiasecScores();

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
    if (question?.type !== 'card-select' || !question.id.startsWith('personality-holland-')) continue;
    const selectedId = typeof answer.value === 'string' ? answer.value : '';
    const option = question.options?.find((item) => item.id === selectedId);
    if (option) addRiasecWeights(scores, option.riasecWeights);
  }

  return scores;
}

export function computeBlendedRiasecScores(answers: Answer[]): RIASECScores {
  const interestScores = computeInterestTagScores(answers);
  const hollandScaleScores = computeSecondStageHollandScaleScores(answers);
  const hasInterestScores = scoreTotal(interestScores) > 0;
  const hasHollandScaleScores = scoreTotal(hollandScaleScores) > 0;

  if (hasHollandScaleScores) return normalizeScores(hollandScaleScores);
  if (hasInterestScores) return normalizeScores(interestScores);

  return createEmptyRiasecScores();
}

export function computePreCareerRiasecScores(answers: Answer[]): RIASECScores {
  const blendedScores = computeBlendedRiasecScores(answers);
  if (scoreTotal(blendedScores) > 0) return blendedScores;

  const preCareerAnswers = answers.filter((answer) => {
    const question = getDiscoverQuestionDefinition(answer.questionId);
    return question &&
      question.phase !== 'D' &&
      (
        question.type === 'profile-form' ||
        question.type === 'interest-tag-grid' ||
        question.type === 'multi-select' ||
        question.type === 'rank-select' ||
        question.type === 'scenario-pair' ||
        question.type === 'slider'
      );
  });
  return normalizeScores(computeRawScores(preCareerAnswers));
}

export function computePreCareerRiasecTopDimensions(answers: Answer[], count = 2): RIASECDimension[] {
  return getTopDimensions(computePreCareerRiasecScores(answers), count);
}

export function computeWeightedRiasecScores(answers: Answer[]): RIASECScores {
  return computePreCareerRiasecScores(answers);
}

function getAbilityQuestionType(question: Question): {
  questionType: AbilityQuestionType;
  questionTypeLabel: string;
} | null {
  if (question.id.startsWith('ability-jinchao-lamp-')) {
    return { questionType: 'language_understanding', questionTypeLabel: '语言理解' };
  }
  if (question.id.startsWith('ability-surakarta-')) {
    return { questionType: 'board_reasoning', questionTypeLabel: '棋类逻辑' };
  }
  return null;
}

function createAbilityPerformanceGroup(
  questionType: AbilityQuestionType,
  questionTypeLabel: string,
): AbilityPerformanceByType {
  return {
    questionType,
    questionTypeLabel,
    totalCount: 0,
    correctCount: 0,
    incorrectCount: 0,
  };
}

export function computeAbilityPerformance(answers: Answer[]): AbilityPerformanceSummary {
  const items: AbilityPerformanceItem[] = [];
  const groups = new Map<AbilityQuestionType, AbilityPerformanceByType>();

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
    if (!question || question.type !== 'card-select') continue;
    const typeInfo = getAbilityQuestionType(question);
    if (!typeInfo) continue;
    const selectedOptionId = typeof answer.value === 'string' ? answer.value : '';
    if (!selectedOptionId) continue;

    const selectedOption = question.options?.find((option) => option.id === selectedOptionId);
    const correctOption = question.options?.find((option) => option.correct);
    if (!correctOption) continue;

    const isCorrect = selectedOptionId === correctOption.id;
    const item: AbilityPerformanceItem = {
      questionId: question.id,
      questionType: typeInfo.questionType,
      questionTypeLabel: typeInfo.questionTypeLabel,
      selectedOptionId,
      selectedLabel: selectedOption?.label ?? selectedOptionId,
      correctOptionId: correctOption.id,
      correctLabel: correctOption.label,
      isCorrect,
    };
    items.push(item);

    const group = groups.get(typeInfo.questionType) ??
      createAbilityPerformanceGroup(typeInfo.questionType, typeInfo.questionTypeLabel);
    group.totalCount += 1;
    if (isCorrect) {
      group.correctCount += 1;
    } else {
      group.incorrectCount += 1;
    }
    groups.set(typeInfo.questionType, group);
  }

  const correctCount = items.filter((item) => item.isCorrect).length;
  const totalCount = items.length;

  return {
    version: 'ability_performance_v1',
    totalCount,
    correctCount,
    incorrectCount: totalCount - correctCount,
    byQuestionType: Array.from(groups.values()),
    items,
  };
}

export type CareerCalibrationLevel = 'low' | 'medium' | 'high';

export interface CareerCalibrationDimensionScore {
  key: CareerCalibrationDimensionKey;
  label: string;
  score: number;
  maxScore: number;
  average: number;
  normalizedScore: number;
  level: CareerCalibrationLevel;
  answeredCount: number;
  questionIds: string[];
  selectedOptionIds: string[];
  highMeaning: string;
  lowMeaning: string;
}

export interface CareerCalibrationProfile {
  version: 'final_career_calibration_v1';
  sourcePath: string;
  answeredCount: number;
  totalQuestions: number;
  completed: boolean;
  scale: Array<{ score: number; label: string }>;
  dimensions: Record<CareerCalibrationDimensionKey, CareerCalibrationDimensionScore>;
  answerIds: string[];
  selectedOptionIds: string[];
}

export function getCareerCalibrationOptionScore(optionId: string) {
  const match = optionId.match(/^final-career-calibration-scale-([1-5])$/);
  return match ? Number(match[1]) : null;
}

function getCareerCalibrationLevel(score: number): CareerCalibrationLevel {
  if (score <= 11) return 'low';
  if (score <= 18) return 'medium';
  return 'high';
}

export function computeCareerCalibrationProfile(answers: Answer[]): CareerCalibrationProfile {
  const scoreBuckets = new Map<CareerCalibrationDimensionKey, {
    score: number;
    answeredCount: number;
    questionIds: string[];
    selectedOptionIds: string[];
  }>();
  const answerIds: string[] = [];
  const selectedOptionIds: string[] = [];

  for (const dimension of CAREER_CALIBRATION_DIMENSIONS) {
    scoreBuckets.set(dimension.key, {
      score: 0,
      answeredCount: 0,
      questionIds: [],
      selectedOptionIds: [],
    });
  }

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
    const calibration = question?.careerCalibration;
    if (question?.type !== 'career-calibration-scale' || !calibration || typeof answer.value !== 'string') continue;
    const rawScore = getCareerCalibrationOptionScore(answer.value);
    if (!rawScore) continue;
    const adjustedScore = calibration.scoringDirection === 'reverse' ? 6 - rawScore : rawScore;
    const bucket = scoreBuckets.get(calibration.dimension);
    if (!bucket) continue;
    bucket.score += adjustedScore;
    bucket.answeredCount += 1;
    bucket.questionIds.push(question.id);
    bucket.selectedOptionIds.push(answer.value);
    answerIds.push(question.id);
    selectedOptionIds.push(answer.value);
  }

  const dimensions = Object.fromEntries(
    CAREER_CALIBRATION_DIMENSIONS.map((dimension) => {
      const bucket = scoreBuckets.get(dimension.key) ?? {
        score: 0,
        answeredCount: 0,
        questionIds: [],
        selectedOptionIds: [],
      };
      const average = bucket.answeredCount > 0 ? bucket.score / bucket.answeredCount : 0;
      const score = bucket.score;
      const normalizedScore = Math.max(0, Math.min(100, Math.round(((score - 5) / 20) * 100)));
      return [
        dimension.key,
        {
          key: dimension.key,
          label: dimension.label,
          score,
          maxScore: 25,
          average: Math.round(average * 100) / 100,
          normalizedScore,
          level: getCareerCalibrationLevel(score),
          answeredCount: bucket.answeredCount,
          questionIds: bucket.questionIds,
          selectedOptionIds: bucket.selectedOptionIds,
          highMeaning: dimension.highMeaning,
          lowMeaning: dimension.lowMeaning,
        },
      ];
    }),
  ) as Record<CareerCalibrationDimensionKey, CareerCalibrationDimensionScore>;

  return {
    version: 'final_career_calibration_v1',
    sourcePath: FINAL_CAREER_CALIBRATION_SOURCE_PATH,
    answeredCount: answerIds.length,
    totalQuestions: FINAL_CAREER_CALIBRATION_QUESTION_IDS.length,
    completed: answerIds.length >= FINAL_CAREER_CALIBRATION_QUESTION_IDS.length,
    scale: CAREER_CALIBRATION_SCALE_OPTIONS.map((option, index) => ({
      score: getCareerCalibrationOptionScore(option.id) ?? index + 1,
      label: option.label,
    })),
    dimensions,
    answerIds,
    selectedOptionIds,
  };
}

// Legacy aggregate for scoring audits. Product recommendations should use computeWeightedRiasecScores.
export function computeRawScores(answers: Answer[]): RIASECScores {
  const scores = createEmptyRiasecScores();

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
    if (!question) continue;

    switch (question.type) {
      case 'profile-form': {
        for (const opt of collectProfileOptions(question, answer.value)) {
          addRiasecWeights(scores, opt.riasecWeights);
        }
        break;
      }

      case 'interest-tag-grid':
      case 'multi-select': {
        const selectedIds = Array.isArray(answer.value) ? answer.value : [];
        for (const optId of selectedIds) {
          const opt = question.options?.find((o) => o.id === optId);
          if (opt) addRiasecWeights(scores, opt.riasecWeights);
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
          addRiasecWeights(scores, opt.riasecWeights, rankWeight);
        });
        break;
      }

      case 'career-scenario': {
        const careerValue = answer.value;
        if (!isCareerScenarioValue(careerValue)) break;
        addCareerScenarioClosedChoiceScores(scores, question, careerValue);

        if (isAiDialogueValue(careerValue.aiDialogue)) {
          addRiasecWeights(scores, careerValue.aiDialogue.scoringSummary.deltas);
        }
        break;
      }

      case 'holland-fine-grained': {
        addHollandFineClosedChoiceScores(scores, question, answer.value);
        break;
      }

      case 'card-select': {
        const selectedId = typeof answer.value === 'string' ? answer.value : '';
        const opt = question.options?.find((o) => o.id === selectedId);
        if (opt) addRiasecWeights(scores, opt.riasecWeights);
        break;
      }

      case 'scenario-pair': {
        const selectedId = typeof answer.value === 'string' ? answer.value : '';
        const pair = question.scenarioPair;
        if (!pair) break;
        const chosen = selectedId === pair.optionA.id ? pair.optionA : pair.optionB;
        addRiasecWeights(scores, chosen.riasecWeights);
        break;
      }

      case 'slider': {
        const sliderValue = typeof answer.value === 'number' && Number.isFinite(answer.value) ? answer.value : 50;
        const config = question.sliderConfig;
        if (!config) break;
        const leftFactor = (100 - sliderValue) / 100;
        const rightFactor = sliderValue / 100;

        addRiasecWeights(scores, config.leftWeights, leftFactor);
        addRiasecWeights(scores, config.rightWeights, rightFactor);
        break;
      }

      case 'free-text':
      case 'career-calibration-scale':
        break;

      case 'ai-dialogue': {
        if (!isAiDialogueValue(answer.value)) break;
        addRiasecWeights(scores, answer.value.scoringSummary.deltas);
        break;
      }
    }
  }

  return scores;
}

export function extractPersonalityTraits(answers: Answer[]): Record<string, number> {
  const traits: Record<string, number> = {};

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
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
        const selectedIds = Array.isArray(answer.value) ? answer.value : [];
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
      case 'holland-fine-grained': {
        for (const option of collectHollandFineOptions(question, answer.value)) {
          collectTags(option);
        }
        break;
      }
      case 'card-select': {
        const selectedId = typeof answer.value === 'string' ? answer.value : '';
        const opt = question.options?.find((o) => o.id === selectedId);
        if (opt) collectTags(opt);
        break;
      }
      case 'scenario-pair': {
        const pair = question.scenarioPair;
        if (!pair) break;
        const selectedId = typeof answer.value === 'string' ? answer.value : '';
        const chosen = selectedId === pair.optionA.id ? pair.optionA : pair.optionB;
        collectTags(chosen);
        break;
      }
      case 'slider':
      case 'free-text':
      case 'career-calibration-scale':
      case 'ai-dialogue':
        break;
    }
  }

  return traits;
}

const MBTI_DIMENSIONS: Array<{
  key: MbtiDimensionKey;
  left: MbtiLetter;
  right: MbtiLetter;
  fallback: MbtiLetter;
}> = [
  { key: 'EI', left: 'E', right: 'I', fallback: 'E' },
  { key: 'SN', left: 'S', right: 'N', fallback: 'S' },
  { key: 'TF', left: 'T', right: 'F', fallback: 'T' },
  { key: 'JP', left: 'J', right: 'P', fallback: 'J' },
];

const MBTI_DIMENSION_BY_LETTER = new Map<MbtiLetter, MbtiDimensionKey>(
  MBTI_DIMENSIONS.flatMap(({ key, left, right }) => [
    [left, key] as const,
    [right, key] as const,
  ]),
);
const MBTI_TYPE_RE = /^(E|I)(S|N)(T|F)(J|P)$/;

function createEmptyMbtiScores(): Record<MbtiLetter, number> {
  return { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
}

function isMbtiLetter(value: string): value is MbtiLetter {
  return ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].includes(value);
}

function buildMbtiDimensions(
  scores: Record<MbtiLetter, number>,
  lastSelectedByDimension: Partial<Record<MbtiDimensionKey, MbtiLetter>> = {},
): MbtiDimensionScore[] {
  return MBTI_DIMENSIONS.map(({ key, left, right, fallback }) => {
    const leftScore = scores[left];
    const rightScore = scores[right];
    const selected = leftScore > rightScore
      ? left
      : rightScore > leftScore
        ? right
        : fallback;

    return {
      dimension: key,
      left,
      right,
      leftScore,
      rightScore,
      selected,
    };
  });
}

function buildMbtiType(dimensions: MbtiDimensionScore[]) {
  return dimensions.map((dimension) => dimension.selected).join('');
}

function extractMbtiLetter(option: QuestionOption): MbtiLetter | null {
  for (const tag of option.personalityTags ?? []) {
    if (!tag.startsWith('mbti:')) continue;
    const letter = tag.slice('mbti:'.length);
    if (isMbtiLetter(letter)) return letter;
  }
  return null;
}

export function computeMbtiProfile(answers: Answer[]): MbtiProfile | null {
  const knownTypeAnswer = answers.find((answer) => answer.questionId === MBTI_KNOWN_QUESTION_ID);
  if (knownTypeAnswer && typeof knownTypeAnswer.value === 'string') {
    const type = knownTypeAnswer.value.trim().toUpperCase();
    if (MBTI_TYPE_RE.test(type)) {
      const scores = createEmptyMbtiScores();
      for (const letter of type) {
        if (isMbtiLetter(letter)) scores[letter] += 1;
      }
      const dimensions = buildMbtiDimensions(scores);
      return {
        type,
        source: 'self-selected',
        confidence: 100,
        scores,
        dimensions,
        answerIds: [MBTI_KNOWN_QUESTION_ID],
        selectedOptionIds: [],
      };
    }
  }

  const scores = createEmptyMbtiScores();
  const answerIds: string[] = [];
  const selectedOptionIds: string[] = [];
  const lastSelectedByDimension: Partial<Record<MbtiDimensionKey, MbtiLetter>> = {};

  const orderedAnswers = answers
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp);

  for (const answer of orderedAnswers) {
    if (answer.questionId === MBTI_KNOWN_QUESTION_ID || typeof answer.value !== 'string') continue;
    const question = getDiscoverQuestionDefinition(answer.questionId);
    const option = question?.options?.find((item) => item.id === answer.value);
    if (!question || !option) continue;

    const letter = extractMbtiLetter(option);
    if (!letter) continue;
    const dimension = MBTI_DIMENSION_BY_LETTER.get(letter);
    if (!dimension) continue;

    scores[letter] += 1;
    lastSelectedByDimension[dimension] = letter;
    answerIds.push(question.id);
    selectedOptionIds.push(option.id);
  }

  if (answerIds.length === 0) return null;

  const dimensions = buildMbtiDimensions(scores, lastSelectedByDimension);
  const margin = dimensions.reduce((total, dimension) => {
    return total + Math.abs(dimension.leftScore - dimension.rightScore);
  }, 0);
  const confidence = Math.max(60, Math.min(92, 52 + answerIds.length * 5 + margin * 4));

  return {
    type: buildMbtiType(dimensions),
    source: 'system-tested',
    confidence,
    scores,
    dimensions,
    answerIds,
    selectedOptionIds,
  };
}

export function extractOpenEndedAnswers(answers: Answer[]): Record<string, string> {
  const result: Record<string, string> = {};

  for (const answer of answers) {
    const question = getDiscoverQuestionDefinition(answer.questionId);
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
    if (question?.type === 'holland-fine-grained' && isHollandFineAnswerValue(answer.value)) {
      for (const item of question.hollandFine?.items ?? []) {
        const answerItem = answer.value.items[item.id];
        for (const [fieldId, text] of Object.entries(answerItem?.openResponses ?? {})) {
          if (text.trim()) result[`${question.id}.${item.id}.${fieldId}`] = text;
        }
      }
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
  '系统会根据所有回答生成 Top5 专业推荐和一份报告。',
];

export const ADVISOR_TRANSITION_B = '进入逻辑能力和学习能力的现学现考题。';
export const ADVISOR_TRANSITION_C = '进入情景下的对话和开放式模拟。';
export const ADVISOR_TRANSITION_D = '进入职业倾向开放题。';
export const ADVISOR_COMPUTING = '正在生成推荐专业 Top5 和报告。';
