import type { AnalysisChallengeLearningArticleId } from './analysis-challenge-learning-articles';

export type ChallengeTaskId = 'calculation' | 'proof-sort' | 'proof-interactive';
export type LessonStage = 'principle' | 'principle-rules' | 'example' | 'practice';
export type VisualKind = 'limit' | 'parts' | 'series';

type SymbolicExpression = unknown;
type SymbolicFact = { id: string; label?: string; expression?: SymbolicExpression };
type SymbolicRule = { id: string; label?: string; premises: unknown[]; conclusion?: unknown };

const ANALYSIS_CHALLENGE_PROGRESS_STORAGE_KEY = 'uniprism.math.analysisChallengeProgress';
const ANALYSIS_CHALLENGE_PROGRESS_EVENT = 'uniprism:analysisChallengeProgressUpdated';

export type PracticeOption = {
  label: string;
  value?: string;
  correct?: boolean;
};

export type PracticeSolutionSegment = string | { math: string };

export type PracticeQuestion = {
  id: string;
  intro?: string;
  prompt: string;
  hint: string;
  options: PracticeOption[];
  solution: PracticeSolutionSegment[];
};

type PracticeQuestionOutcome = 'correct' | 'incorrect' | 'skipped';

type PracticeQuestionState = {
  selectedValue: string;
  outcome: PracticeQuestionOutcome;
  updatedAt: string;
};

type PracticeQuestionStatesByModule = Record<string, Record<string, PracticeQuestionState>>;

export type CalculationModule = {
  id: string;
  learningArticleId: AnalysisChallengeLearningArticleId;
  badge: string;
  shortTitle: string;
  principleTitle: string;
  principleSubtitle: string;
  visual: VisualKind;
  goals: string[];
  intuitionTitle: string;
  intuition: string[];
  formulae: Array<{
    label: string;
    math: string;
    note: string;
  }>;
  example: {
    title: string;
    subtitle: string;
    problem: string;
    steps: Array<{
      title: string;
      body: string;
      math: string;
    }>;
    answer: string;
  };
  practice: {
    title: string;
    subtitle: string;
    questions: PracticeQuestion[];
  };
};

export type ProofSortStep = {
  id: string;
  title: string;
  body: string;
  math?: string;
};

type ProofSortPageKind = 'principle' | 'example' | 'practice';

type ProofSortPage = {
  id: string;
  moduleIndex: number;
  kind: ProofSortPageKind;
  principlePageIndex?: number;
};

export type ProofSortChallenge = {
  id: string;
  eyebrow: string;
  title: string;
  prompt: string;
  promptMath: string;
  visualSrc: string;
  visualAlt: string;
  knownConditions: string[];
  steps: ProofSortStep[];
  shuffledStepIds: string[];
  hint: string;
  successMessage: string;
};

export type ProofSortModule = {
  id: string;
  learningArticleId: AnalysisChallengeLearningArticleId;
  badge: string;
  shortTitle: string;
  challenge: ProofSortChallenge;
};

type ProofInteractivePageKind = 'principle' | 'example' | 'practice';

type ProofInteractivePage = {
  id: string;
  moduleIndex: number;
  kind: ProofInteractivePageKind;
  principlePageIndex?: number;
};

type ProofInteractiveFact = SymbolicFact;

type ProofInteractiveRule = SymbolicRule;

type ProofInteractiveExampleStep = {
  ruleId: string;
  factIds: string[];
  resultId: string;
  body: string;
  math: string;
};

type ProofInteractiveKnowledgeItem = {
  title: string;
  body: string;
  math?: string;
};

type ProofInteractivePrincipleFormula = {
  label: string;
  math: string;
  note: string;
};

type ProofInteractivePrinciplePageContent = {
  title: string;
  subtitle: string;
  paragraphs: string[];
  formulae?: ProofInteractivePrincipleFormula[];
  flow?: string[];
};

type ProofInteractiveChallenge = {
  id: string;
  eyebrow: string;
  title: string;
  prompt: string;
  promptMath: string;
  visualSrc: string;
  visualAlt: string;
  initialFacts: ProofInteractiveFact[];
  targetFactId: string;
  targetExpression: SymbolicExpression;
  principlePages: ProofInteractivePrinciplePageContent[];
  principleIntro: string[];
  knowledgeItems: ProofInteractiveKnowledgeItem[];
  principleFlow: string[];
  exampleTitle: string;
  exampleIntro: string;
  exampleClosing: string;
  practiceTitle: string;
  rules: ProofInteractiveRule[];
  exampleSteps: ProofInteractiveExampleStep[];
};

type ProofInteractiveModule = {
  id: string;
  badge: string;
  shortTitle: string;
  challenge: ProofInteractiveChallenge;
};

type ProofInteractiveFeedback = {
  kind: 'success' | 'error' | 'info';
  title: string;
  body: string;
};

export type CalculationLesson = {
  id: string;
  moduleIndex: number;
  stage: LessonStage;
  practiceQuestionIndex?: number;
};

type ChallengeStarMarker = {
  id: string;
  label: string;
  progress: number;
  earned: boolean;
};

const lessonStages: LessonStage[] = ['principle', 'example', 'practice'];
const calculationLessonStagesByModuleId: Record<string, LessonStage[]> = {
  'limits-lhopital': ['principle', 'principle-rules', 'example', 'practice'],
  'integration-by-parts': ['principle', 'principle-rules', 'example', 'practice'],
  'series-summation': ['principle', 'principle-rules', 'example', 'practice'],
};

export const calculationModules: CalculationModule[] = [
  {
    id: 'limits-lhopital',
    learningArticleId: 'calculation-lhopital',
    badge: '极限',
    shortTitle: '未定式判断',
    principleTitle: '未定式不是答案',
    principleSubtitle: '先判断两个量是否一起归零，再检查能否用导数比较速度。',
    visual: 'limit',
    goals: ['区分直接代入和极限过程', '把 0/0 看成比较信号', '合法使用洛必达并处理链式法则'],
    intuitionTitle: '先判断，再求导',
    intuition: [
      '直接代入得到 0/0 时，原式还没有给出答案，只说明分子和分母一起趋近 0。',
      '极限看的是到达目标点之前的附近模式；目标点本身无定义，附近比值仍可能稳定。',
      '洛必达只有在未定式和可导条件都满足时才可用，它比较的是分子、分母的局部变化率。',
    ],
    formulae: [
      {
        label: '极限行为',
        math: '\\displaystyle \\lim_{x\\to a}f(x)=L',
        note: '描述的是目标点附近的趋势。',
      },
      {
        label: '连续点直接代入',
        math: '\\displaystyle f\\text{ 在 }a\\text{ 连续}\\Rightarrow \\lim_{x\\to a}f(x)=f(a)',
        note: '使用前仍要检查表达式在目标点是否有意义。',
      },
      {
        label: '未定式信号',
        math: '\\displaystyle \\frac{0}{0}\\quad\\text{或}\\quad\\frac{\\infty}{\\infty}',
        note: '这不是最终答案，只提示需要比较变化方式。',
      },
      {
        label: '洛必达法则',
        math: '\\displaystyle \\lim_{x\\to a}\\frac{f(x)}{g(x)}=\\lim_{x\\to a}\\frac{f^{\\prime}(x)}{g^{\\prime}(x)}',
        note: '只在未定式和可导条件满足时使用；分子、分母分别求导。',
      },
    ],
    example: {
      title: '例题：同一条判断链的三种落点',
      subtitle: '三题只训练同一件事：先判断形态，再决定是否求导。',
      problem: '\\displaystyle \\lim_{x\\to 0}\\frac{\\sin(3x)}{x}',
      steps: [
        {
          title: '直接代入会失败',
          body: '分子和分母都趋近 0，出现未定式。',
          math: '\\displaystyle \\frac{\\sin 0}{0}=\\frac{0}{0}',
        },
        {
          title: '检查条件后分别求导',
          body: '分子和分母在 0 附近可导，分母导数为 1。分子求导要用链式法则。',
          math: '\\displaystyle \\lim_{x\\to 0}\\frac{\\sin(3x)}{x}=\\lim_{x\\to 0}\\frac{3\\cos(3x)}{1}',
        },
        {
          title: '重新代入',
          body: '导数之比已经可以直接计算。',
          math: '\\displaystyle 3\\cos 0=3',
        },
      ],
      answer: '3',
    },
    practice: {
      title: '练习：沿着判断链算极限',
      subtitle: '每题先代入，再决定是否需要洛必达。',
      questions: [
        {
          id: 'strict-direct-polynomial',
          intro: '先判断直接代入是否已经足够。',
          prompt: '\\displaystyle \\lim_{x\\to 1}(x^2+2x)',
          hint: '这是多项式，在每个实数点连续。',
          options: [{ label: '0' }, { label: '1' }, { label: '3', correct: true }, { label: '\\text{不存在}' }],
          solution: [
            '多项式在 ',
            { math: 'x=1' },
            ' 处连续，直接代入得到 ',
            { math: '1^2+2\\cdot1=3' },
            '。',
          ],
        },
        {
          id: 'strict-sin-3x',
          intro: '代入出现 0/0 后，再检查洛必达条件。',
          prompt: '\\displaystyle \\lim_{x\\to 0}\\frac{\\sin(3x)}{x}',
          hint: '分子导数是 3\\cos(3x)，分母导数是 1。',
          options: [{ label: '0' }, { label: '1' }, { label: '3', correct: true }, { label: '\\text{不存在}' }],
          solution: [
            '代入得到 ',
            { math: '\\frac{0}{0}' },
            ' 型。条件满足后分别求导：',
            { math: '(\\sin(3x))^{\\prime}=3\\cos(3x)' },
            '，',
            { math: '(x)^{\\prime}=1' },
            '。新极限为 ',
            { math: '3\\cos 0=3' },
            '。',
          ],
        },
        {
          id: 'strict-sin-4x',
          intro: '同样是 0/0，但系数由链式法则决定。',
          prompt: '\\displaystyle \\lim_{x\\to 0}\\frac{\\sin(4x)}{x}',
          hint: '求导时要把 sin(4x) 的内层导数 4 带出来。',
          options: [{ label: '0' }, { label: '1' }, { label: '4', correct: true }, { label: '\\infty' }],
          solution: [
            '代入得到 ',
            { math: '\\frac{0}{0}' },
            ' 型。分子导数为 ',
            { math: '4\\cos(4x)' },
            '，分母导数为 ',
            { math: '1' },
            '。代入新极限得到 ',
            { math: '4' },
            '。',
          ],
        },
      ],
    },
  },
  {
    id: 'integration-by-parts',
    learningArticleId: 'calculation-integration-by-parts',
    badge: '积分',
    shortTitle: '分部积分',
    principleTitle: '从积分到分部积分',
    principleSubtitle: '先把积分理解为“反过来求导”，再看乘积函数为什么需要分部积分。',
    visual: 'parts',
    goals: ['理解不定积分是在找原函数', '认识本关会用到的常见积分', '理解 u 和 dv 的分工'],
    intuitionTitle: '基本原理',
    intuition: [
      '不定积分要找一个原函数：如果 F 的导数是 f，那么 f 的积分可以写成 F+C。',
      '常见函数能直接积分；乘积函数常常不能直接查表，需要把它改写。',
      '分部积分来自乘积求导公式。它让一部分函数求导变简单，另一部分函数用常见积分表处理。',
    ],
    formulae: [
      {
        label: '不定积分',
        math: '\\displaystyle F^{\\prime}(x)=f(x)\\Rightarrow \\int f(x)\\,dx=F(x)+C',
        note: '积分先问“谁求导后会得到 f(x)”。常数 C 来自常数求导后为 0。',
      },
      {
        label: '常见积分',
        math: '\\displaystyle \\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C,\\quad \\int e^x\\,dx=e^x+C,\\quad \\int \\cos x\\,dx=\\sin x+C',
        note: '本关会反复用这些基本积木处理剩下的积分。',
      },
      {
        label: '乘积求导',
        math: '\\displaystyle (uv)^{\\prime}=u^{\\prime}v+uv^{\\prime}',
        note: '分部积分就是把这条求导公式反过来整理。',
      },
      {
        label: '分部积分',
        math: '\\displaystyle \\int u\\,dv=uv-\\int v\\,du',
        note: '选 u 时希望它求导后更简单；选 dv 时希望它容易积分成 v。',
      },
      {
        label: '本关选择策略',
        math: '\\displaystyle u=x\\Rightarrow du=dx,\\qquad dv=e^x dx\\Rightarrow v=e^x',
        note: '一个负责变简单，一个负责用常见积分表积分。',
      },
    ],
    example: {
      title: '例题：x 和指数函数相乘',
      subtitle: '这类题的核心是让 x 变简单，让指数函数负责积分。',
      problem: '\\displaystyle \\int xe^x\\,dx',
      steps: [
        {
          title: '选择 u 和 dv',
          body: '让 x 负责求导变简单，让 e^x dx 负责积分。',
          math: '\\displaystyle u=x,\\quad dv=e^x\\,dx',
        },
        {
          title: '得到 du 和 v',
          body: 'x 的导数是 1，e^x 的积分还是 e^x。',
          math: '\\displaystyle du=dx,\\quad v=e^x',
        },
        {
          title: '代入公式',
          body: '把 u、dv、du、v 放进公式。',
          math: '\\displaystyle \\int xe^x\\,dx=xe^x-\\int e^x\\,dx',
        },
        {
          title: '整理结果',
          body: '不定积分最后要加常数 C。',
          math: '\\displaystyle xe^x-e^x+C=(x-1)e^x+C',
        },
      ],
      answer: '\\displaystyle (x-1)e^x+C',
    },
    practice: {
      title: '练习：选择 u 和 dv',
      subtitle: '目标不是一眼秒杀，而是能稳定套公式。',
      questions: [
        {
          id: 'parts-x-cos',
          intro: '先选择分部积分的拆法。',
          prompt: '\\displaystyle \\int x\\cos x\\,dx\\quad\\text{应怎样选择 }u\\text{ 与 }dv?',
          hint: '让 x 负责求导变简单，让 cos x dx 负责用常见积分表积分。',
          options: [
            { label: 'u=x,\\quad dv=\\cos x\\,dx', correct: true },
            { label: 'u=\\cos x,\\quad dv=x\\,dx' },
            { label: 'u=x\\cos x,\\quad dv=dx' },
            { label: 'u=1,\\quad dv=x\\cos x\\,dx' },
          ],
          solution: [
            '合适的选择是 ',
            { math: 'u=x' },
            '，',
            { math: 'dv=\\cos x\\,dx' },
            '。这样 ',
            { math: 'x' },
            ' 求导后变成 ',
            { math: '1' },
            '，而 ',
            { math: '\\cos x' },
            ' 可以直接积分成 ',
            { math: 'v=\\sin x' },
            '。',
          ],
        },
        {
          id: 'parts-ln',
          intro: '完整计算一个分部积分。',
          prompt: '\\displaystyle \\int \\ln x\\,dx',
          hint: '这题没有明显的乘积，可以把 ln x 看成 ln x 乘 1。',
          options: [
            { label: '\\dfrac{1}{x}+C' },
            { label: 'x\\ln x-x+C', correct: true },
            { label: 'x\\ln x+C' },
            { label: '\\ln(x^2)+C' },
          ],
          solution: [
            '把 ',
            { math: '\\ln x' },
            ' 看成 ',
            { math: '\\ln x\\cdot1' },
            '。取 ',
            { math: 'u=\\ln x' },
            '，',
            { math: 'dv=dx' },
            '，则 ',
            { math: 'du=\\frac1x dx' },
            '，',
            { math: 'v=x' },
            '。代入公式得到 ',
            { math: 'x\\ln x-\\int 1\\,dx=x\\ln x-x+C' },
            '。',
          ],
        },
        {
          id: 'parts-x-cos-result',
          intro: '把选择代入公式并处理剩下的常见积分。',
          prompt: '\\displaystyle \\int x\\cos x\\,dx',
          hint: '取 u=x，dv=cos x dx 后，v=sin x，剩下的是 -∫sin x dx。',
          options: [
            { label: 'x\\sin x+\\cos x+C', correct: true },
            { label: 'x\\cos x-\\sin x+C' },
            { label: '\\sin x+C' },
            { label: 'x\\sin x-\\cos x+C' },
          ],
          solution: [
            '取 ',
            { math: 'u=x' },
            '，',
            { math: 'dv=\\cos x\\,dx' },
            '，得到 ',
            { math: 'du=dx' },
            '，',
            { math: 'v=\\sin x' },
            '。代入公式：',
            { math: '\\int x\\cos x\\,dx=x\\sin x-\\int \\sin x\\,dx=x\\sin x+\\cos x+C' },
            '。',
          ],
        },
      ],
    },
  },
  {
    id: 'series-summation',
    learningArticleId: 'calculation-series-summation',
    badge: '级数',
    shortTitle: '级数收敛',
    principleTitle: '从有限求和到无穷级数',
    principleSubtitle: '先把求和符号和部分和讲清楚，再判断无穷多项能不能稳定下来。',
    visual: 'series',
    goals: ['读懂求和符号', '理解部分和数列', '用必要条件和等比模型判断收敛'],
    intuitionTitle: '基本原理',
    intuition: [
      '求和符号 Σ 表示按同一个规则生成一串数，再把指定范围内的项加起来。',
      '无穷级数不能一次加完，要先看前 n 项部分和怎样变化。',
      '通项趋近 0 是收敛的必要条件；等比级数还要看公比绝对值是否小于 1。',
    ],
    formulae: [
      {
        label: '部分和定义',
        math: '\\displaystyle S_n=\\sum_{k=1}^{n}a_k',
        note: '无穷级数是否收敛，先看部分和数列是否趋向有限值。',
      },
      {
        label: '收敛必要条件',
        math: '\\displaystyle \\sum_{n=1}^{\\infty}a_n\\text{ 收敛}\\Rightarrow \\lim_{n\\to\\infty}a_n=0',
        note: '通项不趋近 0，级数一定发散；但通项趋近 0 不保证级数收敛。',
      },
      {
        label: '无穷等比级数',
        math: '\\displaystyle S_\\infty=\\frac{a_1}{1-r}\\quad(|r|<1)',
        note: '比例的绝对值小于 1，后面的项才会越来越小。',
      },
    ],
    example: {
      title: '例题：有限等比求和',
      subtitle: '先看首项、公比、项数，再代入公式。',
      problem: '\\displaystyle \\sum_{k=0}^{4}2\\left(\\frac{1}{2}\\right)^k',
      steps: [
        {
          title: '看出首项和公比',
          body: 'k 从 0 开始，所以第一项是 2。',
          math: '\\displaystyle a_1=2,\\quad r=\\frac{1}{2}',
        },
        {
          title: '数清楚项数',
          body: 'k=0,1,2,3,4，一共 5 项。',
          math: '\\displaystyle n=5',
        },
        {
          title: '代入公式',
          body: '使用有限等比求和公式。',
          math: '\\displaystyle S_5=2\\cdot\\frac{1-(\\frac{1}{2})^5}{1-\\frac{1}{2}}=\\frac{31}{8}',
        },
      ],
      answer: '\\displaystyle \\frac{31}{8}',
    },
    practice: {
      title: '练习：判断级数收敛',
      subtitle: '先看通项，再判断部分和是否有有限极限。',
      questions: [
        {
          id: 'series-read-sigma',
          intro: '先读懂求和符号表示的项。',
          prompt: '\\displaystyle \\sum_{k=1}^{3}2^k',
          hint: '把 k=1,2,3 分别代入 2^k，再相加。',
          options: [
            { label: '6' },
            { label: '8' },
            { label: '14', correct: true },
            { label: '16' },
          ],
          solution: [
            '当 ',
            { math: 'k=1,2,3' },
            ' 时，三项分别为 ',
            { math: '2,4,8' },
            '，所以有限和是 ',
            { math: '2+4+8=14' },
            '。',
          ],
        },
        {
          id: 'series-geometric-half',
          intro: '判断一个无穷等比级数。',
          prompt: '\\displaystyle \\sum_{n=1}^{\\infty}\\frac{3}{2^n}',
          hint: '把通项写成等比形式，找公比。',
          options: [
            { label: '\\text{收敛}', correct: true },
            { label: '\\text{发散}' },
            { label: '\\text{不存在}' },
            { label: '\\text{无法判断}' },
          ],
          solution: [
            '这是无穷等比级数，首项为 ',
            { math: '\\frac32' },
            '，公比为 ',
            { math: '\\frac12' },
            '。因为 ',
            { math: '|r|<1' },
            '，所以级数收敛。',
          ],
        },
        {
          id: 'series-term-test-n-over-n-plus-one',
          intro: '先用通项必要条件排除不可能收敛的级数。',
          prompt: '\\displaystyle \\sum_{n=1}^{\\infty}\\frac{n}{n+1}',
          hint: '先看通项是否趋近 0。',
          options: [
            { label: '\\text{收敛}' },
            { label: '\\text{发散}', correct: true },
            { label: '\\text{条件收敛}' },
            { label: '\\text{绝对收敛}' },
          ],
          solution: [
            '通项满足 ',
            { math: '\\lim_{n\\to\\infty}\\frac{n}{n+1}=1' },
            '，没有趋近 ',
            { math: '0' },
            '。级数收敛必须先有 ',
            { math: 'a_n\\to0' },
            '，所以该级数发散。',
          ],
        },
      ],
    },
  },
];

export const calculationChallengeModules = calculationModules;

export const calculationPages: CalculationLesson[] = calculationChallengeModules.flatMap((module, moduleIndex) => {
  const stages = calculationLessonStagesByModuleId[module.id] ?? lessonStages;

  return stages.flatMap((stage): CalculationLesson[] => {
    if (stage !== 'practice') {
      return [{
        id: `${module.id}-${stage}`,
        moduleIndex,
        stage,
      }];
    }

    return module.practice.questions.map((question, practiceQuestionIndex) => ({
      id: `${module.id}-${stage}-${question.id}`,
      moduleIndex,
      stage,
      practiceQuestionIndex,
    }));
  });
});

export function getCalculationModuleEndPageIndex(moduleIndex: number) {
  for (let index = calculationPages.length - 1; index >= 0; index -= 1) {
    if (calculationPages[index].moduleIndex === moduleIndex) {
      return index;
    }
  }

  return 0;
}

export const theoremLibrary = calculationModules.flatMap((module) =>
  module.formulae.map((formula) => ({
    id: `${module.id}-${formula.label}`,
    module: module.shortTitle,
    topic: module.badge,
    title: formula.label,
    math: formula.math,
    note: formula.note,
  })),
);

export { challengeTaskCards, challengeTaskConfigs } from './challenge-task-cards';

export type LearningInlineFigure = {
  afterHeadingIncludes: string;
  src: string;
  alt: string;
  align: 'left' | 'right';
  shape?: 'standard' | 'wide';
};

export const learningInlineFigures: Partial<Record<AnalysisChallengeLearningArticleId, LearningInlineFigure[]>> = {
  'calculation-lhopital': [
    {
      afterHeadingIncludes: '极限关注的是',
      src: '/design/math-speed/generated/math-analysis-challenge-lhopital-inline-limit-process-polished-20260530.png',
      alt: '黑白小图用曲线、空点和趋近箭头说明极限关注靠近过程。',
      align: 'right',
    },
    {
      afterHeadingIncludes: '\\(\\frac{0}{0}\\)',
      src: '/design/math-speed/generated/math-analysis-challenge-lhopital-inline-zero-speed-polished-20260530.png',
      alt: '黑白小图用两条趋零轨迹和分式符号说明 0/0 要比较趋近速度。',
      align: 'left',
      shape: 'wide',
    },
    {
      afterHeadingIncludes: '用导数比较',
      src: '/design/math-speed/generated/math-analysis-challenge-lhopital-inline-derivative-ratio-polished-20260530.png',
      alt: '黑白小图用 f/g 到 f prime/g prime 的箭头说明洛必达分别求导。',
      align: 'right',
    },
  ],
  'calculation-integration-by-parts': [
    {
      afterHeadingIncludes: '积分：从导数回到原函数',
      src: '/design/math-speed/generated/math-analysis-challenge-parts-inline-antiderivative-polished-20260530.png',
      alt: '黑白 LaTeX 小图用反向箭头和原函数族说明不定积分是在寻找原函数。',
      align: 'right',
      shape: 'wide',
    },
    {
      afterHeadingIncludes: '从乘积求导公式反推出分部积分',
      src: '/design/math-speed/generated/math-analysis-challenge-parts-inline-product-rule-polished-20260530.png',
      alt: '黑白 LaTeX 小图把乘积求导公式转化为分部积分公式。',
      align: 'left',
    },
    {
      afterHeadingIncludes: '怎样选择',
      src: '/design/math-speed/generated/math-analysis-challenge-parts-inline-choice-polished-20260530.png',
      alt: '黑白 LaTeX 小图展示分部积分中 u 求导变简单、dv 可直接积分的选择原则。',
      align: 'right',
    },
  ],
  'calculation-series-summation': [
    {
      afterHeadingIncludes: '无限项求和的真正困难',
      src: '/design/math-speed/generated/math-analysis-challenge-series-inline-partial-sums-polished-20260530.png',
      alt: '黑白 LaTeX 小图用部分和数列说明无限求和先看有限累积的趋势。',
      align: 'right',
      shape: 'wide',
    },
    {
      afterHeadingIncludes: '无穷等比级数',
      src: '/design/math-speed/generated/math-analysis-challenge-proof-sort-series-inline-tail-polished-20260530.png',
      alt: '黑白 LaTeX 小图用等比部分和和尾项消失说明 |r| 小于 1 时级数收敛。',
      align: 'left',
    },
  ],
  'proof-sort-continuity': [
    {
      afterHeadingIncludes: '点连续',
      src: '/design/math-speed/generated/math-analysis-challenge-proof-sort-continuity-inline-epsilon-polished-20260530.png',
      alt: '黑白 LaTeX 小图用 ε-δ 误差带说明点连续证明的输入输出控制。',
      align: 'right',
      shape: 'wide',
    },
  ],
  'proof-sort-uniform-continuity': [
    {
      afterHeadingIncludes: '局部',
      src: '/design/math-speed/generated/math-analysis-challenge-proof-sort-uniform-inline-global-delta-polished-20260530.png',
      alt: '黑白 LaTeX 小图对比局部 δ 和全局 δ，说明一致连续的统一控制。',
      align: 'right',
    },
  ],
  'proof-sort-geometric-series': [
    {
      afterHeadingIncludes: '部分和',
      src: '/design/math-speed/generated/math-analysis-challenge-series-inline-partial-sums-polished-20260530.png',
      alt: '黑白 LaTeX 小图用有限部分和说明等比级数证明先把无限转成有限。',
      align: 'right',
      shape: 'wide',
    },
    {
      afterHeadingIncludes: '尾部',
      src: '/design/math-speed/generated/math-analysis-challenge-proof-sort-series-inline-tail-polished-20260530.png',
      alt: '黑白 LaTeX 小图突出 r 的高次幂尾项，说明 |r| 小于 1 时尾部趋零。',
      align: 'left',
    },
  ],
  'proof-interactive-compact-uniform': [
    {
      afterHeadingIncludes: '紧集',
      src: '/design/math-speed/generated/math-analysis-challenge-proof-interactive-uniform-inline-upgrade-polished-20260530.png',
      alt: '黑白 LaTeX 小图用紧集到一致连续的箭头说明 Heine-Cantor 升级通道。',
      align: 'right',
      shape: 'wide',
    },
  ],
  'proof-interactive-series-combination': [
    {
      afterHeadingIncludes: '绝对收敛',
      src: '/design/math-speed/generated/math-analysis-challenge-proof-interactive-series-inline-chain-polished-20260530.png',
      alt: '黑白 LaTeX 小图展示由绝对收敛和比较判别翻译出标准收敛事实。',
      align: 'right',
    },
  ],
  'proof-interactive-integral-linearity': [
    {
      afterHeadingIncludes: '牛顿',
      src: '/design/math-speed/generated/math-analysis-challenge-proof-interactive-integral-inline-linearity-polished-20260530.png',
      alt: '黑白 LaTeX 小图用端点差说明牛顿莱布尼茨公式把积分转成数值。',
      align: 'right',
      shape: 'wide',
    },
  ],
};

export const proofSortModules: ProofSortModule[] = [
  {
    id: 'continuity',
    badge: '连续',
    shortTitle: '点连续',
    learningArticleId: 'proof-sort-continuity',
    challenge: {
      id: 'continuity-sum-proof',
      eyebrow: '证明排序挑战 · 连续 · 习题',
      title: '证明：两个点连续函数的和仍点连续',
      prompt: '设 f 与 g 都在 a 点连续。请把步骤排成一段完整证明，推出 f+g 在 a 点连续。',
      promptMath: '\\displaystyle f,g\\text{ 在 }a\\text{ 点连续}\\quad\\Longrightarrow\\quad f+g\\text{ 在 }a\\text{ 点连续}',
      visualSrc: '/design/math-speed/generated/math-analysis-challenge-proof-sort-continuity-bwlatex-20260529.png',
      visualAlt: '黑白 LaTeX 概念图展示点连续证明的 ε-δ 依赖链、共同 δ 和三角不等式。',
      knownConditions: ['先任取 ε，再让已知连续性给出可用的 δ', '两个函数各自给出的 δ 要合并成共同范围', '最后用三角不等式把两个小误差加回目标误差'],
      steps: [
        { id: 'continuity-goal', title: '从定义写出本次目标', body: '任取 ε>0。证明 f+g 在 a 点连续，就是要找到 δ>0，使 0<|x-a|<δ 时，总误差小于 ε。', math: '\\varepsilon>0,\\quad |(f+g)(x)-(f+g)(a)|<\\varepsilon' },
        { id: 'continuity-use-definition', title: '把目标误差分给两个函数', body: '由 f 与 g 在 a 点连续，分别对 ε/2 应用连续定义，得到 δ_f>0 与 δ_g>0。', math: '|f(x)-f(a)|<\\frac{\\varepsilon}{2},\\quad |g(x)-g(a)|<\\frac{\\varepsilon}{2}' },
        { id: 'continuity-common-delta', title: '合并成共同输入范围', body: '取 δ=min(δ_f,δ_g)。这样 x 只要落在这个更小的邻域内，就同时落在两个函数允许的范围内。', math: '\\delta=\\min(\\delta_f,\\delta_g)' },
        { id: 'continuity-activate', title: '让 x 进入共同邻域', body: '当 0<|x-a|<δ 时，因为 δ≤δ_f 且 δ≤δ_g，两个 ε/2 估计同时成立。', math: '|f(x)-f(a)|<\\frac{\\varepsilon}{2},\\quad |g(x)-g(a)|<\\frac{\\varepsilon}{2}' },
        { id: 'continuity-estimate', title: '拆开和函数误差', body: '把和函数的差写成 f 的差与 g 的差，再用三角不等式合并两项估计。', math: '|(f+g)(x)-(f+g)(a)|\\le |f(x)-f(a)|+|g(x)-g(a)|<\\varepsilon' },
        { id: 'continuity-conclusion', title: '回到点连续定义', body: '任意 ε>0 都能找到这样的 δ>0，所以 f+g 在 a 点连续。', math: 'f+g\\text{ 在 }a\\text{ 点连续}' },
      ],
      shuffledStepIds: ['continuity-common-delta', 'continuity-goal', 'continuity-estimate', 'continuity-use-definition', 'continuity-conclusion', 'continuity-activate'],
      hint: '先固定 ε，再从两个连续性定义得到两个 δ，然后取共同 δ。',
      successMessage: '顺序正确。这个证明的依赖链是：ε 目标、连续性给 δ、共同邻域、误差估计、连续性结论。',
    },
  },
  {
    id: 'uniform-continuity',
    badge: '一致连续',
    shortTitle: '一致连续',
    learningArticleId: 'proof-sort-uniform-continuity',
    challenge: {
      id: 'uniform-continuity-sum-proof',
      eyebrow: '证明排序挑战 · 一致连续 · 习题',
      title: '证明：两个一致连续函数的和仍一致连续',
      prompt: '设 f 与 g 都在集合 E 上一致连续。请把步骤排成一段完整证明，推出 f+g 在 E 上一致连续。',
      promptMath: '\\displaystyle f,g\\text{ 在 }E\\text{ 上一致连续}\\quad\\Longrightarrow\\quad f+g\\text{ 在 }E\\text{ 上一致连续}',
      visualSrc: '/design/math-speed/generated/math-analysis-challenge-proof-sort-uniform-bwlatex-20260529.png',
      visualAlt: '黑白 LaTeX 概念图展示一致连续中全局 δ 必须先于任意点选择。',
      knownConditions: ['一致连续的 δ 只能依赖 ε，不能等看到点以后再选', '先选全局 δ，再放入任意 x,y∈E', '和函数误差仍用三角不等式拆成两项'],
      steps: [
        { id: 'uniform-goal', title: '从一致连续定义写目标', body: '任取 ε>0。要证明 f+g 一致连续，需要找一个只依赖 ε 的 δ>0，统一控制所有 x,y∈E。', math: 'x,y\\in E,\\ |x-y|<\\delta\\Rightarrow |(f+g)(x)-(f+g)(y)|<\\varepsilon' },
        { id: 'uniform-use-definition', title: '把误差分给两个一致连续条件', body: '由 f 与 g 在 E 上一致连续，分别对 ε/2 应用定义，得到 δ_f>0 与 δ_g>0。', math: '|f(x)-f(y)|<\\frac{\\varepsilon}{2},\\quad |g(x)-g(y)|<\\frac{\\varepsilon}{2}' },
        { id: 'uniform-common-delta', title: '先选全局共同 δ', body: '取 δ=min(δ_f,δ_g)。这个 δ 由 ε 决定，不依赖具体的 x 或 y。', math: '\\delta=\\min(\\delta_f,\\delta_g)' },
        { id: 'uniform-arbitrary-points', title: '放入任意两点', body: '任取 x,y∈E 且 |x-y|<δ。由于 δ 同时不超过 δ_f 与 δ_g，两个半误差估计同时成立。', math: '|f(x)-f(y)|<\\frac{\\varepsilon}{2},\\quad |g(x)-g(y)|<\\frac{\\varepsilon}{2}' },
        { id: 'uniform-estimate', title: '估计和函数差', body: '把 (f+g)(x)-(f+g)(y) 拆成 f 的差与 g 的差，用三角不等式得到总误差小于 ε。', math: '|(f+g)(x)-(f+g)(y)|\\le |f(x)-f(y)|+|g(x)-g(y)|<\\varepsilon' },
        { id: 'uniform-conclusion', title: '得到一致连续', body: '这个 δ 对 E 中任意 x,y 都有效，并且只依赖 ε，所以 f+g 在 E 上一致连续。', math: 'f+g\\text{ 在 }E\\text{ 上一致连续}' },
      ],
      shuffledStepIds: ['uniform-estimate', 'uniform-common-delta', 'uniform-goal', 'uniform-conclusion', 'uniform-use-definition', 'uniform-arbitrary-points'],
      hint: '检查 δ 是否依赖点。若某一步先固定了点再选 δ，就不是一致连续的证明顺序。',
      successMessage: '顺序正确。这里的关键是先选出全局 δ，再让任意两点进入这个共同范围。',
    },
  },
  {
    id: 'series-convergence',
    badge: '级数',
    shortTitle: '级数收敛',
    learningArticleId: 'proof-sort-geometric-series',
    challenge: {
      id: 'geometric-series-convergence-proof',
      eyebrow: '证明排序挑战 · 级数 · 习题',
      title: '证明：等比级数在 |r|<1 时收敛',
      prompt: '设 |r|<1。请把步骤排成一段完整证明，推出等比级数 1+r+r^2+... 收敛并求出它的和。',
      promptMath: '\\displaystyle |r|<1\\quad\\Longrightarrow\\quad \\sum_{n=0}^{\\infty}r^n=\\frac{1}{1-r}',
      visualSrc: '/design/math-speed/generated/math-analysis-challenge-proof-sort-series-bwlatex-20260529.png',
      visualAlt: '黑白 LaTeX 概念图展示等比级数证明中部分和、代数抵消、余项趋零和回到定义的顺序。',
      knownConditions: ['级数收敛不能直接加无限多项，要先看部分和数列', '等比部分和可以化成封闭公式', '|r|<1 的作用是保证余项 r^{n+1} 趋于 0'],
      steps: [
        { id: 'series-define-partial-sum', title: '按定义改看部分和', body: '级数收敛要看部分和数列是否有极限，因此先写第 n 个部分和 S_n。', math: 'S_n=1+r+r^2+\\cdots+r^n' },
        { id: 'series-subtract', title: '构造等比部分和公式', body: '把 S_n 乘以 1-r，相邻项会抵消，只留下首项和最后的余项。', math: '(1-r)S_n=1-r^{n+1}' },
        { id: 'series-solve-formula', title: '解出部分和', body: '因为 |r|<1，所以 r\\ne1，可以把部分和写成一个显式表达式。', math: 'S_n=\\frac{1-r^{n+1}}{1-r}' },
        { id: 'series-tail-limit', title: '处理余项极限', body: '得到部分和公式后，唯一还需要处理的是余项。由 |r|<1 可知 r^{n+1}\\to0，所以上式中的余项会消失。', math: 'r^{n+1}\\to0' },
        { id: 'series-partial-sum-limit', title: '得到部分和极限', body: '把余项极限代入部分和公式，得到 S_n 的极限。', math: '\\lim_{n\\to\\infty}S_n=\\frac{1}{1-r}' },
        { id: 'series-conclusion', title: '回到级数收敛定义', body: '部分和数列有有限极限，因此等比级数收敛，级数和就是这个极限。', math: '\\sum_{n=0}^{\\infty}r^n=\\frac{1}{1-r}' },
      ],
      shuffledStepIds: ['series-solve-formula', 'series-define-partial-sum', 'series-conclusion', 'series-tail-limit', 'series-subtract', 'series-partial-sum-limit'],
      hint: '级数不是直接加无限多项，而是先看有限部分和，再让 n 趋向无穷。',
      successMessage: '顺序正确。级数收敛的关键是先转成部分和数列，再利用 |r|<1 处理余项。',
    },
  },
];

export type MiniProofInteractiveFact = {
  id: string;
  label: string;
  detail?: string;
  source?: 'given' | 'derived';
};

export type MiniProofInteractiveRule = {
  id: string;
  title: string;
  math: string;
  note: string;
  needs: string[];
  gives: MiniProofInteractiveFact;
};

export type MiniProofInteractiveStep = {
  ruleId: string;
  factIds: string[];
  resultId: string;
  body: string;
  math: string;
};

export type MiniProofInteractiveModule = {
  id: string;
  learningArticleId: AnalysisChallengeLearningArticleId;
  badge: string;
  shortTitle: string;
  title: string;
  prompt: string;
  promptMath: string;
  visualSrc: string;
  visualAlt: string;
  targetFactId: string;
  initialFacts: MiniProofInteractiveFact[];
  rules: MiniProofInteractiveRule[];
  principleFlow: string[];
  exampleSteps: MiniProofInteractiveStep[];
  successMessage: string;
};

export const proofInteractiveModules: MiniProofInteractiveModule[] = [
  {
    id: 'uniform-continuity-knowledge',
    learningArticleId: 'proof-interactive-compact-uniform',
    badge: '一致连续',
    shortTitle: '紧集一致连续',
    title: '紧集上连续函数与一致连续函数相加',
    prompt: '设 E 是紧集，f、g 在 E 上连续，h 在 E 上一致连续。请用定理库和条件库推出 f+g+h 在 E 上一致连续。',
    promptMath: '\\displaystyle E\\text{ 紧},\\ f,g\\in C(E),\\ h\\text{ 在 }E\\text{ 上一致连续}\\Longrightarrow f+g+h\\text{ 在 }E\\text{ 上一致连续}',
    visualSrc: '/design/math-speed/generated/math-analysis-challenge-proof-interactive-uniform-bwlatex-20260529.png',
    visualAlt: '黑白 LaTeX 事实规则图展示用海涅-康托尔定理把紧集连续函数升级为一致连续，再用加法定理合并目标。',
    targetFactId: 'uc-f-g-h-on-e',
    initialFacts: [
      { id: 'compact-e', label: 'E 是紧集', source: 'given' },
      { id: 'continuous-f-e', label: 'f 在 E 上连续', source: 'given' },
      { id: 'continuous-g-e', label: 'g 在 E 上连续', source: 'given' },
      { id: 'uc-h-e', label: 'h 在 E 上一致连续', source: 'given' },
      { id: 'continuous-k-e', label: 'k 在 E 上连续（旁路条件）', source: 'given' },
    ],
    rules: [
      { id: 'heine-f', title: '海涅-康托尔定理：升级 f', math: 'E\\text{ 紧},\\ f\\in C(E)\\Rightarrow f\\text{ 一致连续}', note: '需要紧集事实和 f 的连续性。', needs: ['compact-e', 'continuous-f-e'], gives: { id: 'uc-f-e', label: 'f 在 E 上一致连续', source: 'derived' } },
      { id: 'heine-g', title: '海涅-康托尔定理：升级 g', math: 'E\\text{ 紧},\\ g\\in C(E)\\Rightarrow g\\text{ 一致连续}', note: '需要紧集事实和 g 的连续性。', needs: ['compact-e', 'continuous-g-e'], gives: { id: 'uc-g-e', label: 'g 在 E 上一致连续', source: 'derived' } },
      { id: 'sum-fg', title: '一致连续加法：合并 f 与 g', math: 'f,g\\text{ 一致连续}\\Rightarrow f+g\\text{ 一致连续}', note: '两个前提必须已经都是一致连续事实。', needs: ['uc-f-e', 'uc-g-e'], gives: { id: 'uc-f-g-e', label: 'f+g 在 E 上一致连续', source: 'derived' } },
      { id: 'sum-fgh', title: '一致连续加法：加入 h', math: 'f+g,h\\text{ 一致连续}\\Rightarrow f+g+h\\text{ 一致连续}', note: '用已得到的 f+g 事实和题目给出的 h 事实达成目标。', needs: ['uc-f-g-e', 'uc-h-e'], gives: { id: 'uc-f-g-h-on-e', label: 'f+g+h 在 E 上一致连续', source: 'derived' } },
    ],
    principleFlow: ['用 E 紧和 f 在 E 上连续，推出 f 在 E 上一致连续', '用 E 紧和 g 在 E 上连续，推出 g 在 E 上一致连续', '合并 f 与 g，推出 f+g 在 E 上一致连续', '再与 h 的一致连续性合并，得到 f+g+h 在 E 上一致连续'],
    exampleSteps: [
      { ruleId: 'heine-f', factIds: ['compact-e', 'continuous-f-e'], resultId: 'uc-f-e', body: '先用 E 是紧集与 f 在 E 上连续，调用海涅-康托尔定理，得到 f 在 E 上一致连续。', math: 'E\\text{ 紧},\\ f\\text{ 在 }E\\text{ 上连续}\\Rightarrow f\\text{ 在 }E\\text{ 上一致连续}' },
      { ruleId: 'heine-g', factIds: ['compact-e', 'continuous-g-e'], resultId: 'uc-g-e', body: '同理，把 g 在 E 上连续也升级为 g 在 E 上一致连续。', math: 'E\\text{ 紧},\\ g\\text{ 在 }E\\text{ 上连续}\\Rightarrow g\\text{ 在 }E\\text{ 上一致连续}' },
      { ruleId: 'sum-fg', factIds: ['uc-f-e', 'uc-g-e'], resultId: 'uc-f-g-e', body: '现在 f 与 g 都在 E 上一致连续，可以用加法定理推出 f+g 在 E 上一致连续。', math: 'f,g\\text{ 一致连续}\\Rightarrow f+g\\text{ 一致连续}' },
      { ruleId: 'sum-fgh', factIds: ['uc-f-g-e', 'uc-h-e'], resultId: 'uc-f-g-h-on-e', body: '最后把 f+g 与 h 的一致连续性合并，得到目标结论。', math: 'f+g,h\\text{ 一致连续}\\Rightarrow f+g+h\\text{ 一致连续}' },
    ],
    successMessage: '目标已推出。正确路线是先升级 f、g，再用一致连续加法定理合并两次。',
  },
  {
    id: 'series-convergence-knowledge',
    learningArticleId: 'proof-interactive-series-combination',
    badge: '级数',
    shortTitle: '级数收敛',
    title: '用绝对收敛、比较判别法与级数加法证明收敛',
    prompt: '已知 ∑|a_n| 收敛，∑b_n 收敛，c_n 从某项起非负，c_n≤d_n 从某项起成立，且 ∑d_n 收敛。请推出 ∑(a_n+b_n+c_n) 收敛。',
    promptMath: '\\displaystyle \\sum|a_n|\\text{ 收敛},\\ \\sum b_n\\text{ 收敛},\\ 0\\le c_n\\le d_n,\\ \\sum d_n\\text{ 收敛}\\Longrightarrow \\sum(a_n+b_n+c_n)\\text{ 收敛}',
    visualSrc: '/design/math-speed/generated/math-analysis-challenge-proof-interactive-series-bwlatex-20260529.png',
    visualAlt: '黑白 LaTeX 事实规则图展示把绝对收敛和比较判别法转成收敛事实，再用级数加法得到目标。',
    targetFactId: 'conv-a-b-c',
    initialFacts: [
      { id: 'abs-a', label: '∑|a_n| 收敛', source: 'given' },
      { id: 'conv-b', label: '∑b_n 收敛', source: 'given' },
      { id: 'nonneg-c', label: 'c_n 从某项起非负', source: 'given' },
      { id: 'dominated-c-d', label: 'c_n≤d_n 从某项起成立', source: 'given' },
      { id: 'conv-d', label: '∑d_n 收敛', source: 'given' },
    ],
    rules: [
      { id: 'abs-to-conv', title: '绝对收敛推出收敛', math: '\\sum |a_n|\\text{ 收敛}\\Rightarrow \\sum a_n\\text{ 收敛}', note: '把绝对值级数收敛翻译成普通收敛事实。', needs: ['abs-a'], gives: { id: 'conv-a', label: '∑a_n 收敛', source: 'derived' } },
      { id: 'compare-c', title: '非负项比较判别法', math: '0\\le c_n\\le d_n,\\ \\sum d_n\\text{ 收敛}\\Rightarrow \\sum c_n\\text{ 收敛}', note: '需要非负、逐项上界和控制级数收敛。', needs: ['nonneg-c', 'dominated-c-d', 'conv-d'], gives: { id: 'conv-c', label: '∑c_n 收敛', source: 'derived' } },
      { id: 'sum-ab', title: '收敛级数加法：合并 a 与 b', math: '\\sum a_n,\\sum b_n\\text{ 收敛}\\Rightarrow \\sum(a_n+b_n)\\text{ 收敛}', note: '一次只合并两个已经证明收敛的级数。', needs: ['conv-a', 'conv-b'], gives: { id: 'conv-a-b', label: '∑(a_n+b_n) 收敛', source: 'derived' } },
      { id: 'sum-abc', title: '收敛级数加法：加入 c', math: '\\sum(a_n+b_n),\\sum c_n\\text{ 收敛}\\Rightarrow \\sum(a_n+b_n+c_n)\\text{ 收敛}', note: '第二次加法达成目标。', needs: ['conv-a-b', 'conv-c'], gives: { id: 'conv-a-b-c', label: '∑(a_n+b_n+c_n) 收敛', source: 'derived' } },
    ],
    principleFlow: ['由 ∑|a_n| 收敛推出 ∑a_n 收敛', '由比较判别法推出 ∑c_n 收敛', '由 ∑a_n 和 ∑b_n 收敛推出 ∑(a_n+b_n) 收敛', '由 ∑(a_n+b_n) 和 ∑c_n 收敛推出目标级数收敛'],
    exampleSteps: [
      { ruleId: 'abs-to-conv', factIds: ['abs-a'], resultId: 'conv-a', body: '由 ∑|a_n| 收敛，使用绝对收敛推出收敛，得到 ∑a_n 收敛。', math: '\\sum |a_n|\\text{ 收敛}\\Rightarrow \\sum a_n\\text{ 收敛}' },
      { ruleId: 'compare-c', factIds: ['nonneg-c', 'dominated-c-d', 'conv-d'], resultId: 'conv-c', body: '由 c_n 非负、c_n≤d_n 和 ∑d_n 收敛，使用比较判别法得到 ∑c_n 收敛。', math: '0\\le c_n\\le d_n,\\ \\sum d_n\\text{ 收敛}\\Rightarrow \\sum c_n\\text{ 收敛}' },
      { ruleId: 'sum-ab', factIds: ['conv-a', 'conv-b'], resultId: 'conv-a-b', body: '把已经得到的 ∑a_n 收敛和已知的 ∑b_n 收敛合并，推出 ∑(a_n+b_n) 收敛。', math: '\\sum a_n,\\sum b_n\\text{ 收敛}\\Rightarrow \\sum(a_n+b_n)\\text{ 收敛}' },
      { ruleId: 'sum-abc', factIds: ['conv-a-b', 'conv-c'], resultId: 'conv-a-b-c', body: '最后把 ∑(a_n+b_n) 与 ∑c_n 合并，得到目标级数收敛。', math: '\\sum(a_n+b_n),\\sum c_n\\text{ 收敛}\\Rightarrow \\sum(a_n+b_n+c_n)\\text{ 收敛}' },
    ],
    successMessage: '目标已推出。关键是先把条件翻译成三个收敛事实，再分两次合并。',
  },
  {
    id: 'integration-knowledge',
    learningArticleId: 'proof-interactive-integral-linearity',
    badge: '积分',
    shortTitle: '定积分线性',
    title: '用牛顿-莱布尼茨公式与定积分线性计算三项积分',
    prompt: '设 F、G 分别是 f、g 在区间 I 上的原函数，F 在 I 两端差为 A，G 在 I 两端差为 B，并且 ∫_I h dx=C。请推出 ∫_I(f+g+h)dx=A+B+C。',
    promptMath: "\\displaystyle F'=f,\\ G'=g,\\ F\\big|_{\\partial I}=A,\\ G\\big|_{\\partial I}=B,\\ \\int_I h\\,dx=C\\Longrightarrow \\int_I(f+g+h)\\,dx=A+B+C",
    visualSrc: '/design/math-speed/generated/math-analysis-challenge-proof-interactive-integral-bwlatex-20260529.png',
    visualAlt: '黑白 LaTeX 事实规则图展示先用牛顿-莱布尼茨公式取出积分值，再用定积分线性合并。',
    targetFactId: 'integral-f-g-h',
    initialFacts: [
      { id: 'primitive-f', label: 'F 是 f 在 I 上的原函数', source: 'given' },
      { id: 'endpoint-f-a', label: 'F 在 I 两端差为 A', source: 'given' },
      { id: 'primitive-g', label: 'G 是 g 在 I 上的原函数', source: 'given' },
      { id: 'endpoint-g-b', label: 'G 在 I 两端差为 B', source: 'given' },
      { id: 'integral-h-c', label: '∫_I h dx=C', source: 'given' },
    ],
    rules: [
      { id: 'n-l-f', title: '牛顿-莱布尼茨公式：取出 f 的积分值', math: "F'=f,\\ F(b)-F(a)=A\\Rightarrow \\int_I f\\,dx=A", note: '需要原函数关系和端点差。', needs: ['primitive-f', 'endpoint-f-a'], gives: { id: 'integral-f-a', label: '∫_I f dx=A', source: 'derived' } },
      { id: 'n-l-g', title: '牛顿-莱布尼茨公式：取出 g 的积分值', math: "G'=g,\\ G(b)-G(a)=B\\Rightarrow \\int_I g\\,dx=B", note: '同样先把积分转成数值。', needs: ['primitive-g', 'endpoint-g-b'], gives: { id: 'integral-g-b', label: '∫_I g dx=B', source: 'derived' } },
      { id: 'linear-fg', title: '定积分线性：合并 f 与 g', math: '\\int_I(f+g)dx=\\int_I f dx+\\int_I g dx=A+B', note: '线性性质合并两个已知积分值。', needs: ['integral-f-a', 'integral-g-b'], gives: { id: 'integral-f-g', label: '∫_I(f+g)dx=A+B', source: 'derived' } },
      { id: 'linear-fgh', title: '定积分线性：加入 h', math: '\\int_I(f+g+h)dx=A+B+C', note: '再合并 h 的已知积分值，得到目标。', needs: ['integral-f-g', 'integral-h-c'], gives: { id: 'integral-f-g-h', label: '∫_I(f+g+h)dx=A+B+C', source: 'derived' } },
    ],
    principleFlow: ['由 F 是 f 的原函数和端点差 A，推出 ∫_I f dx=A', '由 G 是 g 的原函数和端点差 B，推出 ∫_I g dx=B', '用定积分线性合并 f 与 g，得到 ∫_I(f+g)dx=A+B', '再与 ∫_I h dx=C 合并，得到目标积分值'],
    exampleSteps: [
      { ruleId: 'n-l-f', factIds: ['primitive-f', 'endpoint-f-a'], resultId: 'integral-f-a', body: '由 F 是 f 的原函数和端点差 A，使用牛顿-莱布尼茨公式得到 ∫_I f dx=A。', math: "F'=f,\\ F(b)-F(a)=A\\Rightarrow \\int_I f\\,dx=A" },
      { ruleId: 'n-l-g', factIds: ['primitive-g', 'endpoint-g-b'], resultId: 'integral-g-b', body: '同理，由 G 是 g 的原函数和端点差 B，得到 ∫_I g dx=B。', math: "G'=g,\\ G(b)-G(a)=B\\Rightarrow \\int_I g\\,dx=B" },
      { ruleId: 'linear-fg', factIds: ['integral-f-a', 'integral-g-b'], resultId: 'integral-f-g', body: '用定积分线性性质，把 f 与 g 的积分值合并为 A+B。', math: '\\int_I(f+g)dx=A+B' },
      { ruleId: 'linear-fgh', factIds: ['integral-f-g', 'integral-h-c'], resultId: 'integral-f-g-h', body: '最后与 h 的已知积分值 C 合并，得到目标 A+B+C。', math: '\\int_I(f+g+h)dx=A+B+C' },
    ],
    successMessage: '目标已推出。正确节奏是先用原函数取数值，再用线性分步相加。',
  },
];
