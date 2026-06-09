export type CourseTopicParagraphItem = {
  type: 'paragraph';
  text: string;
};

export type CourseTopicFigureItem = {
  type: 'figure';
  imageSrc: string;
  imageAlt: string;
  caption: string;
  imageWidth: number;
  imageHeight: number;
};

export type CourseTopicFormulaItem = {
  type: 'blockFormula';
  latex: string;
  explanation: string;
};

export type CourseTopicContentItem = CourseTopicParagraphItem | CourseTopicFigureItem | CourseTopicFormulaItem;

export type CourseTopicPage = {
  title: string;
  role: string;
  content: CourseTopicContentItem[];
};

type AnalysisTopicParagraphItem = CourseTopicParagraphItem;
type AnalysisTopicFigureItem = CourseTopicFigureItem;
type AnalysisTopicFormulaItem = CourseTopicFormulaItem;
type AnalysisTopicContentItem = CourseTopicContentItem;
type AnalysisTopicPage = CourseTopicPage;

export type AnalysisArticleSection = {
  title: string;
  role?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  paragraphs: string[];
  formula: string;
  content?: CourseTopicContentItem[];
};

const COURSE_REDO_FIGURE_WIDTH = 1672;
const COURSE_REDO_FIGURE_HEIGHT = 941;

function findAnalysisTopicFigure(page: CourseTopicPage) {
  return page.content.find((item): item is CourseTopicFigureItem => item.type === 'figure');
}

function findAnalysisTopicFormula(page: CourseTopicPage) {
  return page.content.find((item): item is CourseTopicFormulaItem => item.type === 'blockFormula');
}

function topicPagesToArticleSections(pages: CourseTopicPage[]): AnalysisArticleSection[] {
  return pages.map((page) => {
    const figure = findAnalysisTopicFigure(page);
    const formula = findAnalysisTopicFormula(page);

    return {
      title: page.title,
      role: page.role,
      imageSrc: figure?.imageSrc,
      imageAlt: figure?.imageAlt,
      imageWidth: figure?.imageWidth,
      imageHeight: figure?.imageHeight,
      paragraphs: page.content
        .filter((item): item is CourseTopicParagraphItem => item.type === 'paragraph')
        .map((item) => item.text),
      formula: formula?.latex ?? '',
      content: page.content,
    };
  });
}

export const analysisTopicPages: CourseTopicPage[] = [
  {
    title: "无穷脚印怎样抵达终点：极限的误差规则",
    role: "科普入口 / 极限",
    content: [
      {
        type: 'paragraph',
        text: "想象一条直跑道，终点前有一面旗。你每次只走剩余距离的一半：先走一半，再走剩下一半的一半，然后继续。脚印会越来越密，纸面上却总能再标出下一小段。古希腊思想家芝诺用类似故事追问过一个尖锐问题：如果一段路可以被切成无穷多段，有限时间里的到达该怎样说明？",
      },
      {
        type: 'paragraph',
        text: "日常经验会立刻反驳“永远到不了”：人会走到旗旁，箭会击中靶心，视频里的物体也会从一帧移动到下一帧。困难不在运动本身，而在“越来越近”这句话太松。数学需要一种验收方式：别人先给出一个很小的误差要求，你必须说明从某一步开始，后面所有位置都能落进这个要求里。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f01-infinite-steps.png",
        imageAlt: "无穷脚印逐步靠近目标，终点附近用中文标出容许误差。",
        caption: "无穷分段与容许误差。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "极限把问题改写得更可操作：不必把每一小段真的走完，只要能回应任意误差要求。若终点周围画出一条窄带，剩余距离进入窄带就满足这次要求；若窄带继续缩小，我们还能找到更靠后的脚印。这样一来，“靠近”不再是眼睛的感觉，而是一份可以被检查的承诺。",
      },
      {
        type: 'paragraph',
        text: "函数极限沿用同一顺序。先给输出端允许的误差 ε，再寻找输入端需要多接近，记作 δ。只要输入 x 距离 a 足够近，且 x 本身不等于 a，就能保证 f(x) 距离目标值 L 小于 ε。精度要求先出现，控制方案随后给出，这个先后顺序正是定义的骨架。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f02-limit-window.png",
        imageAlt: "输出误差带与输入窗口对应，所有可见标签为中文。",
        caption: "输出误差与输入控制窗口。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'blockFormula',
        latex: "0<|x-a|<\\delta \\Rightarrow |f(x)-L|<\\varepsilon",
        explanation: "先给输出误差 ε，再找到足够小的输入窗口 δ。",
      },
      {
        type: 'paragraph',
        text: "这也解释了极限和代入的差别。函数在某点可以没有值，或者那个点被单独改成一个奇怪读数；只要周围趋势稳定，极限依然可以存在。跑道故事里也是这样，某个中间脚印没有特殊地位，真正被检验的是剩余距离能否压到任意指定尺度以下。",
      },
      {
        type: 'paragraph',
        text: "现代计算每天都在使用这套语言。动画渲染不会等“无穷细分”完成，数值迭代也不会追求神秘的绝对精确；程序会设定容许误差，比如位置差不到一个像素、相邻两次结果变化低于阈值，就让计算停下。极限把古老的无限困惑翻译成了机器能执行的误差规则。",
      },
      {
        type: 'paragraph',
        text: "后面的连续、导数、积分、级数都会借用这套动作。连续性要问输出跳不跳，导数要问短窗口的平均变化是否稳定，积分和级数要问剩余误差是否可控。极限的价值就在这里：它把“差不多”变成可以提出要求、给出控制、记录失败原因的判断。",
      },
    ],
  },
  {
    title: "尺子上不能有洞：逼近为什么需要实数",
    role: "数系基础 / 完备性",
    content: [
      {
        type: 'paragraph',
        text: "把边长为 1 的正方形画在纸上，再用尺子量对角线。勾股定理告诉我们长度应当是 √2，可尺面上只能读出有限小数：1.4、1.41、1.414、1.4142。读数越来越稳定，却还没有回答一个更基础的问题：这串读数究竟在靠近数轴上的哪个点？",
      },
      {
        type: 'paragraph',
        text: "如果数轴只允许分数，这个点会消失。许多分数的平方可以很接近 2，却没有一个分数平方正好等于 2。于是问题从“怎么多算几位”转向“越来越稳定的逼近是否有对象承接”。没有承接点，极限只能描述一串越来越好的记录，无法保证记录指向一个真正的数。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f03-ruler-sqrt2.png",
        imageAlt: "有缺口的尺子与完整实数尺子的对比，中文标出近似读数和落点。",
        caption: "近似读数需要完整落点。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "完备性就是对这把尺子的要求：合理的逼近过程不能掉进数轴的洞里。可以想象一串不断缩小的括号，每一步都把可能位置夹得更紧；如果所有括号互相套住，最终应当有一个点被锁在里面。实数的完备性给这种锁定提供保证。",
      },
      {
        type: 'paragraph',
        text: "二分法求方程根时，这件事会变得很具体。先找到函数值一正一负的两个端点，再把区间一半一半切开，始终保留夹住根的那一段。区间越来越短，根的位置越来越清楚；实数线没有缺口，才让这个被夹住的位置有地方落下。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f04-bracket-root.png",
        imageAlt: "二分法不断缩小保留区间，中文标出根的位置。",
        caption: "缩小区间锁定根的位置。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "被上界压住的上升过程也依赖同一种保证。若一个数列不断上升，却永远越不过某个天花板，实数中可以谈论它逼近的最低天花板。许多存在性证明都在借这条路：暂时拿不出目标对象，就先证明所有近似被稳定夹住，目标因此不能逃出数轴。",
      },
      {
        type: 'blockFormula',
        latex: "a_1\\le a_2\\le\\cdots,\\quad a_n\\le M",
        explanation: "一个被上界压住的上升近似过程会指向可讨论的极限候选。",
      },
      {
        type: 'paragraph',
        text: "测量、求根、面积逼近和积分构造都会遇到同一个边界：近似值越来越好，还需要一个数系保证目标没有丢在外面。工程测量中的真实长度、算法中被夹住的根、面积估计的最终值，都要靠这条没有缺口的数线承接。",
      },
      {
        type: 'paragraph',
        text: "有了完备性，极限语言才有落点。极限负责把误差压小，实数负责保证被压出来的目标存在。接下来，当读数沿着这条没有缺口的数线移动时，新的问题出现了：它会不会跳过某个关键位置？",
      },
    ],
  },
  {
    title: "警戒线会被碰到吗：连续性给出的保证",
    role: "稳定性 / 连续",
    content: [
      {
        type: 'paragraph',
        text: "桥梁传感器的读数从安全区缓慢升高，工程师最关心的也许不是曲线多漂亮，而是它有没有碰到警戒线。若读数从 65 逐步升到 90，中间的 80 不能被悄悄绕开；只要变化过程没有断裂，就必然有一刻仪表正好指向警戒值。",
      },
      {
        type: 'paragraph',
        text: "连续性把这个朴素判断写成条件：小的输入变化只能带来小的输出变化，曲线不能从目标值一侧瞬间跳到另一侧。温度、形变、压力、位置，只要随时间连续变化，就能被阈值线追踪。它给出的保证不是“看上去平滑”，而是“中间值不会失踪”。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f05-threshold-continuity.png",
        imageAlt: "传感器读数从安全区进入危险区，连续曲线穿过警戒线。",
        caption: "连续读数穿过警戒线。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "数学把这件事压缩成介值定理。若连续函数在区间一端低于目标值，另一端高于目标值，那么中间至少有一点正好等于目标值。找方程根时，我们甚至可以先不知道根在哪里；只要两端符号相反，并且曲线没有断开，就知道中间藏着一个零点。",
      },
      {
        type: 'paragraph',
        text: "条件失效时，保证也会失效。曲线中间跳一下，可能从目标线下方直接跃到上方；区间拿掉端点，函数可能越来越接近最高值却始终取不到。闭区间上的连续函数能取到最大最小值，这个结论同时依赖曲线不断裂、端点也被保留。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f06-conditions-existence.png",
        imageAlt: "条件满足与条件缺失的对照图，中文标出连续、闭区间和保证失效。",
        caption: "连续闭区间与条件缺失。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'blockFormula',
        latex: "x_n\\to a \\Rightarrow f(x_n)\\to f(a)",
        explanation: "输入端的靠近不会被函数破坏。",
      },
      {
        type: 'paragraph',
        text: "安全阈值、温控系统、材料形变、数值求根都在使用这类判断。工程师并不需要每次都看见完整曲线，只要知道读数连续、端点状态可靠，就能判断警戒线一定被碰到，或者某个最坏状态一定会在区间内出现。",
      },
      {
        type: 'paragraph',
        text: "用数列也能表达同一意思：只要输入点列趋向 a，连续函数的输出就趋向 f(a)。这句话很短，却在说输入端的靠近不会被函数破坏。它让曲线像一条能追踪的路径，阈值、零点、极值都有了可检查的存在条件。",
      },
      {
        type: 'paragraph',
        text: "连续性回答的是“会不会经过”。接下来，读者还会问更细的问题：如果一辆车经过了某个位置，我们怎样知道它在那个瞬间有多快？这就把视线从整条路径推进到一个点附近的局部变化。",
      },
    ],
  },
  {
    title: "一瞬间的速度从哪里来：导数的局部读数",
    role: "局部变化 / 导数",
    content: [
      {
        type: 'paragraph',
        text: "汽车经过测速点时，仪表上显示的是这一瞬间的速度。平均速度很好算：一段路程除以一段时间即可；可“此刻速度”像是在问零时间里的变化，普通除法没有直接入口。炮弹轨迹、行星运动、机器臂定位都会遇到同样问题：怎样从整段变化抓住局部读数？",
      },
      {
        type: 'paragraph',
        text: "自然的办法是不断缩短观察窗口。先算 1 秒内的平均速度，再算 0.1 秒、0.01 秒内的平均速度。如果这些平均速度逐渐稳定到某个数，就把它当作那一刻的瞬时速度。导数从这个稳定读数里长出来，它记录的是窗口缩小后留下的变化率。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f07-instant-speed.png",
        imageAlt: "平均速度窗口逐步缩短并逼近瞬时速度，中文标出切线。",
        caption: "缩短观察窗口逼近瞬时速度。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "对函数来说，这个过程写成差商。取 a 附近的另一个点 a+h，先看两点之间的平均斜率，再让 h 趋向 0。若这个平均斜率趋向固定值，曲线在 a 附近就可以用一条直线近似。图像被放大时，弯曲暂时退后，切线成了局部模型。",
      },
      {
        type: 'blockFormula',
        latex: "f'(a)=\\lim_{h\\to0}\\frac{f(a+h)-f(a)}{h}",
        explanation: "导数把越来越短窗口里的平均变化率压缩成一个局部读数。",
      },
      {
        type: 'paragraph',
        text: "一个小例子能看清这个过程。若位置函数是 s(t)=t²，在 t=3 附近，短时间平均速度等于 6+h。随着 h 缩小，读数稳定到 6。这个数字不是求导技巧的装饰，它说明短时间运动在极限中留下了一个可计算的局部变化率。",
      },
      {
        type: 'paragraph',
        text: "平均值定理把这个局部读数和整段变化接上。只要函数在闭区间上连续、开区间内可导，就有某个内部点 c 的瞬时变化率等于整段平均变化率。开车一小时走了 80 公里，某个时刻的速度表读数必然等于 80 公里每小时。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f08-local-line-mvt.png",
        imageAlt: "局部切线模型与平均值定理，中文标出内部一点和平行切线。",
        caption: "局部直线模型与平均值定理。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'blockFormula',
        latex: "f'(c)=\\frac{f(b)-f(a)}{b-a}",
        explanation: "平均值定理把一个内部瞬时变化率和整段平均变化率相连。",
      },
      {
        type: 'paragraph',
        text: "导数的应用远远超过测速。优化算法用导数判断参数应该往哪个方向调整，曲线拟合用导数理解局部趋势，物理模型用导数写下力、速度和变化率之间的关系。它把“正在怎样变”压缩成局部线性信号，让复杂运动可以被预测、比较和控制。",
      },
      {
        type: 'paragraph',
        text: "求导规则因此有了更清楚的位置。乘积法则、链式法则、隐函数求导，都在追踪局部变化怎样穿过不同运算。导数给出的专业视角，是把曲线附近的一小块世界先看成直线，再估计这条直线能解释多少。下一步，若局部变化率已经知道，我们还要把它们重新加回总量。",
      },
    ],
  },
  {
    title: "碎片怎样合成总量：积分的累积账本",
    role: "累积 / 积分",
    content: [
      {
        type: 'paragraph',
        text: "很早以前，人们想求圆的面积，会在圆里画内接多边形，再不断增加边数。多边形越贴近圆，剩下的缝隙越小。这个把剩余误差挤掉的方法早于现代积分符号，却已经抓住了一个核心画面：用可计算的碎片逼近曲边整体。",
      },
      {
        type: 'paragraph',
        text: "今天换成行车场景。汽车速度一直变化，里程表却要给出总路程。可以把时间切成许多小段，每段用“这一小段的速度乘以时间宽度”估算位移，再把所有小位移加起来。切得越细，每段内部的速度变化越小，总估计也越稳定。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f09-exhaustion-area.png",
        imageAlt: "多边形逐步逼近圆面积，中文标出剩余误差和边数增加。",
        caption: "多边形逼近圆面积。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "黎曼和把这个想法写成固定动作：分割区间，选取每段代表值，乘以小段宽度，再求和。若分割越来越细时，这些有限和稳定到同一个数，就称它为积分。积分延续的是有限求和；极限负责说明误差已经被控制住。",
      },
      {
        type: 'paragraph',
        text: "微积分基本定理把积分和导数接上。导数把位置拆成速度这样的局部变化率，积分把局部变化率重新累积成位置差。如果 v(t)=s'(t)，那么从 a 到 b 的速度积分等于 s(b)-s(a)。局部读数和整体账本在这里合成一件事。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f10-rate-total.png",
        imageAlt: "速度曲线下的小段位移累积成总路程，中文标出里程表。",
        caption: "速度曲线累积成总路程。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'blockFormula',
        latex: "\\int_a^b f'(x)\\,dx=f(b)-f(a)",
        explanation: "局部变化率的累积等于整体状态差。",
      },
      {
        type: 'paragraph',
        text: "这条桥梁让许多总量有了同一种读法。材料密度沿长度分布时，积分给出总质量；功率随时间变化时，积分给出总能量；概率密度铺在区间上时，积分给出事件概率。不同场景背后，都是局部贡献沿着某个范围被可靠累积。",
      },
      {
        type: 'paragraph',
        text: "积分还可以在没有漂亮初等原函数时工作。数值求积、上下估计、比较定理都能给出可靠信息。对工程计算来说，关键常常是局部密度、速度、概率或能量怎样被累积，以及累积误差能否压住，不一定是符号能否化成一个简洁表达式。",
      },
      {
        type: 'paragraph',
        text: "古代割圆、现代里程表和工程能耗曲线用的是同一个累积思想：当一个整体由许多小贡献组成时，先把碎片逐一记账，再让分割细到误差可控。积分让“许多小块加起来”从直觉操作变成可检验的总量判断。",
      },
    ],
  },
  {
    title: "计算器为什么可以停下：级数与泰勒的误差尾巴",
    role: "近似 / 级数与 Taylor",
    content: [
      {
        type: 'paragraph',
        text: "按下计算器上的 e^0.1，屏幕很快显示一个小数。机器并没有把指数函数的无限信息全部写完，它通常只计算若干项多项式，然后停下。真正的问题不在屏幕有几位小数，而在那些没有写出来的项会不会继续改变结果。",
      },
      {
        type: 'paragraph',
        text: "级数把无限计算拆成部分和。先算第一项，再算前两项、前三项，观察这些有限结果是否稳定。如果剩余尾巴能被压到任意指定误差以下，有限计算才有资格代表无限对象。单项变小只是提示，尾巴整体能否控制才是关键。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f11-calculator-tail.png",
        imageAlt: "有限项与剩余尾项的中文教学图，显示可以停止的误差判断。",
        caption: "有限项与剩余尾项。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "几何级数 1+1/2+1/4+... 很适合做样板。前 n 项和为 2-2^{-n}，离 2 只差 2^{-n}。这里不仅知道它接近 2，还知道还差多少。可信的近似总要带着这样的误差账本，否则“看起来稳定”很容易误导判断。",
      },
      {
        type: 'paragraph',
        text: "泰勒多项式把函数也变成可近似的对象。在某个展开点附近，函数的高度、斜率、弯曲和更高阶变化会依次进入多项式。前几项给出可计算的近似，余项负责说明剩下的误差能否接受。近似的可信度，主要看余项是否被管住。",
      },
      {
        type: 'blockFormula',
        latex: "f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(a)}{k!}(x-a)^k+R_n(x)",
        explanation: "有限多项式负责近似，余项负责说明误差是否可接受。",
      },
      {
        type: 'paragraph',
        text: "以 e^x 为例，靠近 0 时可以先用 1+x+x²/2。当 x=0.1，后续项因为阶乘分母迅速增大而变小；但离展开点很远，或者换成别的函数，同样几项可能不够。泰勒多项式提供的是一张有有效范围的近似凭证。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/math-analysis-20260527-cn-f12-taylor-local.png",
        imageAlt: "真实曲线与一次、二次、三次近似在局部有效区内贴合，离开后误差增大。",
        caption: "泰勒多项式的局部有效区。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "科学计算、物理仿真和工程模型经常靠近似工作。它们不能只问公式像不像，还要问误差是否可估计、尾巴是否可忽略、停止计算是否有理由。许多数值方法的核心，正是在每一步给出可接受的局部误差，再控制它们累积后的总影响。",
      },
      {
        type: 'paragraph',
        text: "这也把前面几个主题连在一起：极限给误差规则，完备性给落点，连续性避免跳跃，导数读出局部变化，积分累积局部贡献，级数和泰勒管住无限尾巴。数学分析让“差不多”具备检查方法，让一次有限计算能够说明自己为什么可以停下。",
      },
    ],
  }
];

export const analysisArticleSections: AnalysisArticleSection[] = topicPagesToArticleSections(analysisTopicPages);

export const linearAlgebraTopicPages: CourseTopicPage[] = [
  {
    title: "线性系统：把多条件问题压成矩阵",
    role: "入口 / 方程语言",
    content: [
      {
        type: 'paragraph',
        text: "线性代数的入口不是矩阵乘法，而是“同时满足多条线性条件”。当变量很多、方程很多时，逐条看条件会失去整体结构；矩阵把这些条件打包，让我们能讨论可解性、自由度和稳定性。",
      },
      {
        type: 'paragraph',
        text: "方程 Ax=b 的高层含义是：b 能不能由 A 的列向量线性组合出来。若能，解就是组合系数；若不能，问题没有精确解，只能转向近似。这个解释比机械消元更重要，因为它直接连接列空间。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t1-f1.png",
        imageAlt: "多条线性方程汇入矩阵框：左侧是若干约束，右侧变成 Ax=b 和增广矩阵。",
        caption: "多条线性方程汇入矩阵框：左侧是若干约束，右侧变成 Ax=b 和增广矩阵。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "消元法是一种把信息重排的过程。通过行变换，我们不改变方程组的解集，却把隐藏关系显露出来：主元列代表独立条件，自由变量代表剩余自由度，零行矛盾代表不可解。",
      },
      {
        type: 'blockFormula',
        latex: "Ax=b",
        explanation: "矩阵方程把许多线性条件合并为一个结构问题：b 是否落在 A 的列空间中。",
      },
      {
        type: 'paragraph',
        text: "例如一个资源分配问题可以写成三个变量和多个约束。消元后若出现 0=5，说明约束彼此冲突；若出现自由变量，说明目标没有唯一方案。矩阵语言让“条件是否过多、是否重复”变得可见。",
      },
      {
        type: 'paragraph',
        text: "学生要警惕把矩阵当成表格。矩阵是线性映射的记录，也是列向量家族的组织方式。计算每一步都应追问：我是在保留解集、改变坐标、还是观察空间中的方向？",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t1-f2.png",
        imageAlt: "二维/三维几何图：两条直线相交、平行、重合，对应唯一解、无解、无穷多解。",
        caption: "二维/三维几何图：两条直线相交、平行、重合，对应唯一解、无解、无穷多解。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页建立课程基调：线性代数不是一套孤立算法，而是研究线性条件如何组合、压缩和揭示结构的语言。后面的基、子空间、投影和特征值都从 Ax=b 展开。",
      },
    ],
  },
  {
    title: "向量空间与基：自由度如何被计数",
    role: "空间结构 / 坐标观",
    content: [
      {
        type: 'paragraph',
        text: "向量空间把“可以相加、可以数乘”的对象统一起来。它不只包含平面箭头，也包含多项式、函数、数据特征和解空间。只要对象满足线性组合规则，就可以用同一套语言讨论。",
      },
      {
        type: 'paragraph',
        text: "基是一组最小而完整的描述器。“完整”表示它能张成整个空间，“最小”表示没有冗余向量。维数不是图形的维度感，而是独立自由度的数量：要唯一描述一个对象，需要多少个坐标。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t2-f1.png",
        imageAlt: "张成与独立对比图：两个不平行向量张成平面，两个同方向向量只能张成一条线。",
        caption: "张成与独立对比图：两个不平行向量张成平面，两个同方向向量只能张成一条线。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这个视角能解释为什么线性代数在数据科学中无处不在。一个样本有很多特征，但许多特征可能高度相关；寻找低维表示，本质上是在找更有效的基或近似基。降维不是简单删列，而是重新组织自由度。",
      },
      {
        type: 'blockFormula',
        latex: "v=c_1v_1+\\cdots+c_kv_k",
        explanation: "一组基让空间中的每个向量都有唯一坐标；维数就是描述对象所需的独立自由度数量。",
      },
      {
        type: 'paragraph',
        text: "例如二次多项式空间：1、x、x^2 形成一组基，任何次数不超过二次的多项式都能唯一写成 a+bx+cx^2。这里没有箭头图像，却完全符合向量空间规则。",
      },
      {
        type: 'paragraph',
        text: "初学者常把“坐标”误认为对象本身。其实坐标依赖于基，换一组基，数字会变，但几何对象或函数对象没有变。线性代数要求你同时看见对象和它的表示。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t2-f2.png",
        imageAlt: "换基图：同一个几何箭头在两套坐标网格下有不同坐标，但对象本身不变。",
        caption: "换基图：同一个几何箭头在两套坐标网格下有不同坐标，但对象本身不变。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页的结论是：基和维数让复杂对象可计数、可编码、可压缩。理解自由度之后，矩阵的秩、零空间和投影都会变成同一件事的不同侧面。",
      },
    ],
  },
  {
    title: "线性变换与四个子空间：矩阵作为空间动作",
    role: "结构核心 / 映射观",
    content: [
      {
        type: 'paragraph',
        text: "矩阵最专业的读法，是把它看成空间动作。它接收一个输入向量，输出另一个向量；列向量告诉你基方向被送到哪里。矩阵乘法就是多个空间动作的复合。",
      },
      {
        type: 'paragraph',
        text: "四个基本子空间给出了这个动作的完整剖面。列空间描述输出能到达哪里，零空间描述哪些输入被压成零；行空间描述真正被矩阵读取的输入信息，左零空间描述输出空间中无法被触及的方向。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t3-f1.png",
        imageAlt: "空间动作图：网格被矩阵拉伸、旋转、压缩，展示矩阵不是静态表格而是变换。",
        caption: "空间动作图：网格被矩阵拉伸、旋转、压缩，展示矩阵不是静态表格而是变换。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "秩-零化度定理是自由度守恒的表达。输入空间的 n 个自由度，一部分变成可见输出，一部分被矩阵丢掉。这个定理不是单纯公式，而是在告诉你线性系统的信息流向。",
      },
      {
        type: 'blockFormula',
        latex: "\\dim N(A)+\\operatorname{rank}(A)=n",
        explanation: "秩-零化度定理说明输入自由度被分成“保留下来的方向”和“被压扁的方向”。",
      },
      {
        type: 'paragraph',
        text: "例如一个投影矩阵会把三维空间压缩到一个平面上。平面上的方向被保留，垂直方向进入零空间。若你只看投影结果，就无法恢复被压掉的高度信息；这就是不可逆性的几何原因。",
      },
      {
        type: 'paragraph',
        text: "学生要避免把四个子空间背成表格。真正有用的练习是给定一个矩阵，说明它保留什么、丢掉什么、能产生什么、永远不能产生什么。这样才能把计算和解释连接起来。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t3-f2.png",
        imageAlt: "四个子空间关系图：列空间、零空间、行空间、左零空间分布在输入/输出空间两侧。",
        caption: "四个子空间关系图：列空间、零空间、行空间、左零空间分布在输入/输出空间两侧。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页把线性代数推进到结构层：矩阵既是方程组，也是映射，也是空间压缩器。掌握四个子空间，后面的最小二乘和特征分解就有了统一背景。",
      },
    ],
  },
  {
    title: "正交投影与最小二乘：无精确解时的最佳近似",
    role: "应用核心 / 近似观",
    content: [
      {
        type: 'paragraph',
        text: "现实数据很少完全满足线性方程。测量误差、噪声和遗漏变量会让 b 不在列空间里，这时 Ax=b 没有精确解。线性代数的答案不是放弃，而是寻找列空间中离 b 最近的点。",
      },
      {
        type: 'paragraph',
        text: "正交投影给出“最近”的几何定义。若 b 的投影是 A x_hat，那么残差 r=b-A x_hat 必须与列空间中所有方向垂直；否则还可以沿某个列方向继续缩小误差。由这个正交条件推出正规方程。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t4-f1.png",
        imageAlt: "投影图：点 b 在列空间外，垂线落到列空间上的 A x_hat，残差与列空间成直角。",
        caption: "投影图：点 b 在列空间外，垂线落到列空间上的 A x_hat，残差与列空间成直角。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "最小二乘因此不是一个统计黑箱，而是几何事实：模型能解释的部分被投到列空间里，模型解释不了的部分留在正交残差中。这个分解帮助我们判断拟合质量，也提醒模型能力有边界。",
      },
      {
        type: 'blockFormula',
        latex: "A^TA\\hat{x}=A^Tb",
        explanation: "最小二乘让残差 b-Ax 与列空间正交，因此误差中不再含有可由模型解释的部分。",
      },
      {
        type: 'paragraph',
        text: "例如用学习时间预测考试分数，散点不会全部落在一条直线上。最佳直线不是穿过最多点，而是让所有竖直残差平方和最小。矩阵形式把这种拟合扩展到多变量数据。",
      },
      {
        type: 'paragraph',
        text: "学生需要注意，最小二乘给的是在选定模型内的最佳近似，不保证模型本身正确。若关系非线性、存在强异常点、特征选择错误，投影仍会执行，但解释可能失真。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t4-f2.png",
        imageAlt: "拟合图：散点云和最佳拟合直线，旁边用竖线标出残差平方和。",
        caption: "拟合图：散点云和最佳拟合直线，旁边用竖线标出残差平方和。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页展示线性代数的应用风格：当精确世界破裂时，用几何结构定义最佳近似。它是数据分析、信号处理和机器学习中最常见的数学底层动作之一。",
      },
    ],
  },
  {
    title: "特征值与分解：反复作用下的稳定结构",
    role: "长期行为 / 分解观",
    content: [
      {
        type: 'paragraph',
        text: "当一个线性变换只作用一次，矩阵乘法就够了；当它反复作用，真正重要的是哪些方向会长期主导。特征值和特征向量正是用来识别这些稳定方向的工具。",
      },
      {
        type: 'paragraph',
        text: "若 Av=λv，向量 v 的方向在变换后不变，只被 λ 缩放。反复作用时，|λ|>1 的方向会放大，|λ|<1 的方向会消失，负特征值会翻转，复特征值会带来旋转。长期行为因此由少数结构决定。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t5-f1.png",
        imageAlt: "特征方向图：多个箭头经矩阵变换后改变方向，少数箭头只改变长度不改变方向。",
        caption: "特征方向图：多个箭头经矩阵变换后改变方向，少数箭头只改变长度不改变方向。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "矩阵分解把这种思想系统化。对角化把变换拆成换坐标、独立缩放、再换回；奇异值分解则适用于更广泛矩阵，揭示输入方向如何被拉伸到输出方向。分解的目标是让复杂动作变得可读。",
      },
      {
        type: 'blockFormula',
        latex: "Av=\\lambda v",
        explanation: "特征向量是在矩阵作用下方向不变的结构，特征值记录该方向被拉伸或压缩的倍率。",
      },
      {
        type: 'paragraph',
        text: "例如网页排序、人口迁移、马尔可夫链和离散动力系统，都关心反复乘同一个矩阵后的稳定状态。最大的特征值及其方向往往决定最终分布或主导模式。",
      },
      {
        type: 'paragraph',
        text: "学生不应把特征值只当作行列式方程的根。求根是计算步骤，核心问题是：这个系统有哪些不变方向？哪些方向增长最快？哪些信息会被压缩？",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-linear-algebra-t5-f2.png",
        imageAlt: "分解流程图：矩阵 A 被拆成 QΛQ^{-1} 或 UΣV^T，复杂作用变成方向上的独立缩放。",
        caption: "分解流程图：矩阵 A 被拆成 QΛQ^{-1} 或 UΣV^T，复杂作用变成方向上的独立缩放。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页收束线性代数：从方程到空间，从近似到长期结构，矩阵始终是在组织自由度。特征值与分解让我们看见复杂系统中最稳定、最有解释力的骨架。",
      },
    ],
  }
];

export const linearAlgebraArticleSections: AnalysisArticleSection[] = topicPagesToArticleSections(linearAlgebraTopicPages);

export const mathFoundationsSetLogicTopicPages: CourseTopicPage[] = [
  {
    title: "命题、谓词与量词：把自然语言变成可检查语句",
    role: "形式语言 / 表达控制",
    content: [
      {
        type: 'paragraph',
        text: "数理逻辑的第一步，是把自然语言中容易模糊或歧义的意思固定下来。数学命题不是一句“差不多明白”的话，而是能够在明确语境中判断真假的表达。谓词和量词让我们讨论对象范围、性质和存在性。",
      },
      {
        type: 'paragraph',
        text: "命题逻辑处理“且、或、非、如果那么”等连接方式，谓词逻辑进一步允许变量进入语句。比如“每个连续函数都有介值性质”包含对象范围、性质条件和结论结构；符号化能暴露它究竟依赖哪些前提。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t1-f1.png",
        imageAlt: "自然语言到符号流程图：句子、对象范围、谓词、量词、逻辑连接词逐步标注。",
        caption: "自然语言到符号流程图：句子、对象范围、谓词、量词、逻辑连接词逐步标注。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "量词是最容易出错的部分。许多错误证明来自把“对任意”与“存在”交换，或把否定放错位置。逻辑训练的意义，是让这些微小语义差异变得可见、可检查。",
      },
      {
        type: 'blockFormula',
        latex: "\\neg\\forall x\\,P(x) \\equiv \\exists x\\,\\neg P(x)",
        explanation: "量词的否定规则说明“不是所有”并不等于“所有都不是”，而是“至少有一个反例”。",
      },
      {
        type: 'paragraph',
        text: "例如“所有学生都提交了作业”的否定，不是“所有学生都没交”，而是“至少有一个学生没交”。在数学中，这个差别对应证明一个全称命题失败时只需要构造一个反例。",
      },
      {
        type: 'paragraph',
        text: "高层视角上，形式语言是一种压缩工具。它牺牲自然语言的弹性，换来推理过程的可复制性。学生要学会在直觉解释和符号表达之间来回转换，而不是只背符号。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t1-f2.png",
        imageAlt: "量词否定对照表：forall/exists 在否定下互换，并用小集合反例示意。",
        caption: "量词否定对照表：forall/exists 在否定下互换，并用小集合反例示意。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页的目标是建立逻辑课程的底层习惯：先说明对象范围，再说明性质，再说明推理连接。只有表达被固定，后面的模型、证明和完备性才有意义。",
      },
    ],
  },
  {
    title: "语义模型与真值：公式什么时候为真",
    role: "模型观 / 解释系统",
    content: [
      {
        type: 'paragraph',
        text: "公式本身只是符号串，语义模型给它意义。一个模型要指定对象域，并解释符号表示什么对象、关系或函数。只有在模型中，公式才谈得上为真或为假。",
      },
      {
        type: 'paragraph',
        text: "这件事对数学很重要，因为同一个公理系统可能有不同模型。群公理可以被整数加法满足，也可以被几何对称满足；逻辑让我们区分“形式上可推导”和“在所有模型中为真”。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t2-f1.png",
        imageAlt: "模型结构图：对象域、关系、函数、常量分别映射到一个小型世界。",
        caption: "模型结构图：对象域、关系、函数、常量分别映射到一个小型世界。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "语义视角能解释有效论证。若在所有使前提为真的模型里，结论也为真，那么这个推理是语义有效的。它不依赖某个特殊例子，而是跨越所有可能解释。",
      },
      {
        type: 'blockFormula',
        latex: "\\mathcal{M}\\vDash \\varphi",
        explanation: "语义符号表示公式 φ 在模型 M 中为真；真假依赖对象域和符号解释。",
      },
      {
        type: 'paragraph',
        text: "例如公式 ∀x(P(x)->Q(x)) 与 P(a) 共同推出 Q(a)。你可以在任何模型中检查：若所有 P 对象都是 Q，而 a 又是 P，那么 a 必然是 Q。这个推理和具体对象是什么无关。",
      },
      {
        type: 'paragraph',
        text: "学生需要注意，模型不是现实世界本身，而是为了判断公式真假而搭建的解释系统。换一个对象域或关系解释，公式真假可能改变；这正是模型论视角的力量。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t2-f2.png",
        imageAlt: "同一公式在两个模型中真假不同：一边满足，另一边因关系缺失失败。",
        caption: "同一公式在两个模型中真假不同：一边满足，另一边因关系缺失失败。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页把逻辑从符号推向意义：语义模型让我们精确讨论“什么时候为真”。它也是后续可靠性、完备性和可判定性问题的共同背景。",
      },
    ],
  },
  {
    title: "证明规则与自然演绎：推理如何逐行审计",
    role: "证明系统 / 规则化推理",
    content: [
      {
        type: 'paragraph',
        text: "证明规则把“我觉得能推出”变成逐行可审计的程序。自然演绎尤其适合教学，因为每条规则都对应日常推理动作：要证明 A 且 B，就分别证明 A 和 B；要使用 A 且 B，就可以取出其中一项。",
      },
      {
        type: 'paragraph',
        text: "语法证明和语义模型是两种互补的视角。语义问“在所有解释中是否为真”，语法问“能否按规则写出证明”。一门成熟的逻辑课程必须让学生同时看到这两条线。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t3-f1.png",
        imageAlt: "自然演绎证明树：前提经过合取消去、蕴含引入、反证等规则到达结论。",
        caption: "自然演绎证明树：前提经过合取消去、蕴含引入、反证等规则到达结论。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "子证明是自然演绎的关键技巧。为了证明 P->Q，可以暂时假设 P，在假设环境中推出 Q，然后关闭假设得到条件命题。反证法也是类似结构：暂时假设目标的否定，推出矛盾，再撤销假设。",
      },
      {
        type: 'blockFormula',
        latex: "\\Gamma\\vdash \\varphi",
        explanation: "语法推导表示从前提集合 Γ 出发，能按规则写出公式 φ 的证明。",
      },
      {
        type: 'paragraph',
        text: "例如要证明 P->(Q->P)，可以先假设 P，再假设 Q，此时 P 已经可用，于是得到 Q->P，最后再得到 P->(Q->P)。这个证明看似绕，但每一步都有清楚的假设边界。",
      },
      {
        type: 'paragraph',
        text: "学生常把证明写成散文式解释，导致隐藏前提和跳步。自然演绎的训练价值，是迫使每个推理动作都标注来源。它不会替代数学直觉，但能让直觉接受审计。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t3-f2.png",
        imageAlt: "子证明框图：假设进入缩进框，推出结论后关闭假设得到条件命题。",
        caption: "子证明框图：假设进入缩进框，推出结论后关闭假设得到条件命题。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页的结论是：形式证明不是为了让数学变得机械，而是为了让复杂推理保持透明。规则、假设边界和结论依赖关系，是逻辑给所有数学课程提供的基础工具。",
      },
    ],
  },
  {
    title: "集合、关系、函数与递归：离散结构的基本骨架",
    role: "基础结构 / 建模语言",
    content: [
      {
        type: 'paragraph',
        text: "数理逻辑基础不只研究命题，也要建立集合、关系、函数这些通用结构。数学对象一旦进入严格讨论，就需要说明元素属于哪里、对象之间如何关联、操作如何作用。",
      },
      {
        type: 'paragraph',
        text: "关系可以表达顺序、等价、相邻、可达、依赖等信息。等价关系把对象分成类，偏序关系组织层级，图关系描述网络。许多数学结构都可以先被看作“集合加关系”。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t4-f1.png",
        imageAlt: "集合关系图：元素点、箭头函数、关系边、等价类分块放在同一张图中。",
        caption: "集合关系图：元素点、箭头函数、关系边、等价类分块放在同一张图中。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "函数则强调确定性输入输出。单射、满射、双射不只是定义题，它们分别表达信息是否丢失、目标是否覆盖、对象是否可以一一重命名。双射是比较大小和结构的核心工具。",
      },
      {
        type: 'blockFormula',
        latex: "f:A\\to B,\\quad R\\subseteq A\\times A",
        explanation: "函数描述确定映射，关系描述对象之间的连接；它们共同构成离散数学对象的骨架。",
      },
      {
        type: 'paragraph',
        text: "递归与归纳是一对配套思想：递归说明对象如何从基础情形一步步生成，归纳说明只要基础情形成立且规则保持性质，所有生成对象都满足性质。自然数、语法树、算法过程都依赖它。",
      },
      {
        type: 'paragraph',
        text: "例如定义公式集合时，先给原子公式，再规定若 φ、ψ 是公式，则 ¬φ、φ∧ψ 也是公式。这是递归定义；证明所有公式都有某个性质时，就按构造规则做结构归纳。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t4-f2.png",
        imageAlt: "递归构造图：初始对象、生成规则、归纳证明三层结构串联。",
        caption: "递归构造图：初始对象、生成规则、归纳证明三层结构串联。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页让逻辑基础与计算、代数、拓扑连接起来：集合给对象，关系给结构，函数给变换，递归给生成规则。它们是后续所有形式系统的基础骨架。",
      },
    ],
  },
  {
    title: "完备性、可判定性与边界：形式系统能做什么",
    role: "高层视角 / 能力边界",
    content: [
      {
        type: 'paragraph',
        text: "逻辑课程的高层问题是：形式系统的能力边界在哪里？如果一个结论在所有模型中都为真，我们是否总能写出证明？如果能写出证明，是否有算法总能在有限时间内判断？这些问题区分了可靠性、完备性、可判定性、可计算性。",
      },
      {
        type: 'paragraph',
        text: "可靠性说：按规则证明出来的东西不会在语义上出错。完备性说：只要语义上必然成立，就存在形式证明。一阶逻辑的完备性是深刻结果，它让语义和语法在“是否存在证明”层面吻合。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t5-f1.png",
        imageAlt: "三层关系图：语义真、语法可证、算法可判定三个圆相互关联但不完全重合。",
        caption: "三层关系图：语义真、语法可证、算法可判定三个圆相互关联但不完全重合。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "但完备不等于可判定。存在证明不意味着有一个程序总能快速告诉你证明是否存在。命题逻辑可以用真值表判定，一阶逻辑的一般有效性却没有这样的总算法。",
      },
      {
        type: 'blockFormula',
        latex: "\\Gamma\\vDash\\varphi \\Longleftrightarrow \\Gamma\\vdash\\varphi",
        explanation: "一阶逻辑完备性连接语义有效与语法可证；但可证、可判定、可计算并不是同一件事。",
      },
      {
        type: 'paragraph',
        text: "更进一步，足够强的算术系统会遇到不可完备现象：存在系统内表达得出来、但无法在系统内证明或否证的命题。这里不需要在入门课展开技术细节，但要让学生知道形式化有力量，也有边界。",
      },
      {
        type: 'paragraph',
        text: "这个视角对学习数学非常重要。形式系统不是为了消灭思考，而是为了说明哪些步骤可机械检查，哪些问题超出某类规则或算法的能力。逻辑训练让人同时尊重严格性和边界。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-logic-t5-f2.png",
        imageAlt: "边界示意图：命题逻辑可判定，一阶逻辑完备但一般不可判定，算术出现不可完备现象。",
        caption: "边界示意图：命题逻辑可判定，一阶逻辑完备但一般不可判定，算术出现不可完备现象。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页收束数理逻辑基础：表达、模型、证明、结构和边界构成完整链条。学生学到的不只是符号操作，而是理解数学推理为何可信、何处有限。",
      },
    ],
  }
];

export const logicFoundationsTopicPages: CourseTopicPage[] = [];

export const logicArticleSections: AnalysisArticleSection[] = topicPagesToArticleSections([
  ...mathFoundationsSetLogicTopicPages,
  ...logicFoundationsTopicPages,
]);

export const probabilityTopicPages: CourseTopicPage[] = [
  {
    title: "概率公理：不确定性如何被计量",
    role: "入口 / 公理化语言",
    content: [
      {
        type: 'paragraph',
        text: "概率论不是“猜测学”，而是一套给不确定性分配数值的规则。样本空间列出所有可能结果，事件是结果集合，概率则是对事件大小的度量。公理化语言让我们能在硬币、天气、金融和算法之间迁移。",
      },
      {
        type: 'paragraph',
        text: "最核心的规则是非负性、总量为 1、互斥可加性。它们看起来简单，却足以推出大量结论。概率不是随便给分数，而是必须尊重事件之间的包含、交并和互斥结构。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t1-f1.png",
        imageAlt: "样本空间图：矩形 Ω 中放置事件 A、B、C，用区域面积表示概率。",
        caption: "样本空间图：矩形 Ω 中放置事件 A、B、C，用区域面积表示概率。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "频率直觉有帮助，但课程不能停在频率。某些概率来自对称性，某些来自模型假设，某些来自主观信息更新。公理化的好处是：无论概率如何来源，只要满足规则，就能进行一致推理。",
      },
      {
        type: 'blockFormula',
        latex: "P(A\\cup B)=P(A)+P(B)\\quad(A\\cap B=\\varnothing)",
        explanation: "互斥事件的可加性是概率测度的核心规则，它让复杂事件能由简单事件组合。",
      },
      {
        type: 'paragraph',
        text: "例如掷骰子的偶数事件由 {2,4,6} 构成，若每个点等可能，概率是 3/6。若骰子有偏，点概率不同，但事件概率仍然是这些点概率之和。样本空间视角让改变假设变得明确。",
      },
      {
        type: 'paragraph',
        text: "学生容易把概率当作单次预言。实际上概率衡量的是在给定信息和模型下，事件在样本空间中所占的权重。单次事件可能发生或不发生，但概率规则仍然约束我们的长期判断和决策。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t1-f2.png",
        imageAlt: "频率到公理图：重复实验频率波动，右侧抽象成满足三条公理的概率测度。",
        caption: "频率到公理图：重复实验频率波动，右侧抽象成满足三条公理的概率测度。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页建立概率论的底层语法：先定义样本空间，再定义事件，再说明概率分配。只有对象清楚，条件概率、随机变量和极限定理才不会漂浮。",
      },
    ],
  },
  {
    title: "随机变量与分布：把结果压缩成数值结构",
    role: "建模核心 / 分布观",
    content: [
      {
        type: 'paragraph',
        text: "随机变量不是“会随机变化的变量”这么简单，而是把复杂结果映射到数值的函数。一次实验可能产生天气状态、用户行为或测量曲线；随机变量选择其中某个可量化特征，让概率进入数轴。",
      },
      {
        type: 'paragraph',
        text: "分布描述随机变量的整体行为。离散变量用概率质量函数记录每个取值的概率，连续变量用密度描述区间概率，分布函数则统一两者：它告诉我们 X 不超过某个阈值的概率。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t2-f1.png",
        imageAlt: "样本结果到随机变量图：天气/骰子/人群结果经 X 映射到数轴。",
        caption: "样本结果到随机变量图：天气/骰子/人群结果经 X 映射到数轴。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这个压缩非常重要。建模时我们往往不关心样本空间的全部细节，而关心某个指标，比如等待时间、误差大小、收益率或故障次数。随机变量就是从世界到指标的投影。",
      },
      {
        type: 'blockFormula',
        latex: "F_X(x)=P(X\\le x)",
        explanation: "分布函数用一个函数记录随机变量落在阈值以下的概率，是离散和连续情形的统一语言。",
      },
      {
        type: 'paragraph',
        text: "例如抛两枚硬币的原始结果有 HH、HT、TH、TT。若 X 表示正面个数，四个结果被压缩为 0、1、2 三个数值，并得到二项分布雏形。不同原始结果可能对应同一个数值。",
      },
      {
        type: 'paragraph',
        text: "学生要注意密度不是概率。连续变量在单点取值的概率通常为 0，真正有意义的是区间面积。把密度高度误读成概率，是学习连续分布时最常见的错误。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t2-f2.png",
        imageAlt: "PMF/PDF/CDF 对照图：柱状概率、密度曲线、累积分布曲线并排展示。",
        caption: "PMF/PDF/CDF 对照图：柱状概率、密度曲线、累积分布曲线并排展示。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页让概率论从事件集合进入函数语言。随机变量和分布把不确定性组织成可计算对象，为期望、方差、条件分布和极限定理打下基础。",
      },
    ],
  },
  {
    title: "条件概率、独立与 Bayes：信息如何更新判断",
    role: "信息更新 / 依赖结构",
    content: [
      {
        type: 'paragraph',
        text: "概率判断总依赖信息。条件概率 P(A|B) 说的是：在 B 已经发生或被观测到的前提下，A 的概率是多少。它不是新公式游戏，而是把样本空间缩小到当前信息允许的区域。",
      },
      {
        type: 'paragraph',
        text: "独立性表示一个事件的信息不会改变另一个事件的概率。若 P(A|B)=P(A)，观察 B 对判断 A 没有帮助。现实建模中，独立性是强假设，不是默认事实；错误独立假设会让模型过度自信。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t3-f1.png",
        imageAlt: "条件概率面积图：事件 B 区域被放大，A∩B 在 B 内所占比例成为 P(A|B)。",
        caption: "条件概率面积图：事件 B 区域被放大，A∩B 在 B 内所占比例成为 P(A|B)。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "Bayes 公式提供反向推断。很多时候我们知道原因导致证据的概率 P(B|A)，却真正想知道看见证据后原因的概率 P(A|B)。公式通过先验和证据总体概率完成转换。",
      },
      {
        type: 'blockFormula',
        latex: "P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}",
        explanation: "Bayes 公式把先验概率和新证据结合起来，得到事件 A 在观察到 B 后的更新概率。",
      },
      {
        type: 'paragraph',
        text: "医学筛查是典型例子。即使检测灵敏度很高，若疾病基础率很低，阳性结果对应的患病后验概率也可能不高。这个例子提醒学生：证据强度必须和先验比例一起看。",
      },
      {
        type: 'paragraph',
        text: "课程讲解应避免把 Bayes 公式神秘化。它只是条件概率定义的代数重排，但它改变了思考方式：概率不是静态标签，而是随信息更新的判断状态，这一视角也是贝叶斯统计的核心。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t3-f2.png",
        imageAlt: "Bayes 树图：先验分叉、证据命中率、后验归一化三步展示。",
        caption: "Bayes 树图：先验分叉、证据命中率、后验归一化三步展示。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页的专业视角是依赖结构。条件、独立、相关、因果并不等同；概率论先给我们处理信息更新的精确语言，再让更复杂的统计推断有可能。",
      },
    ],
  },
  {
    title: "期望、方差与大数定律：长期平均为什么稳定",
    role: "统计量 / 稳定性",
    content: [
      {
        type: 'paragraph',
        text: "期望不是最可能的结果，而是概率加权平均。它回答“长期重复下平均收益或平均误差会落在哪里”。方差进一步描述结果围绕期望的波动幅度。",
      },
      {
        type: 'paragraph',
        text: "这两个量把完整分布压缩成关键指标。压缩会损失信息，但非常有用：比较两个策略、估计误差范围、设计样本量时，我们常先看期望和方差。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t4-f1.png",
        imageAlt: "期望天平图：不同取值和概率作为权重，平衡点表示期望。",
        caption: "期望天平图：不同取值和概率作为权重，平衡点表示期望。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "大数定律解释为什么概率模型能被数据检验。若独立重复实验具有共同期望，样本平均会逐渐靠近期望。单次结果可以非常偶然，长期平均却会稳定，这是概率论最重要的桥梁之一。",
      },
      {
        type: 'blockFormula',
        latex: "\\bar X_n=\\frac{1}{n}\\sum_{i=1}^n X_i \\to \\mathbb{E}[X]",
        explanation: "大数定律说明独立重复样本的平均值会趋近理论期望，连接模型参数和长期观测。",
      },
      {
        type: 'paragraph',
        text: "例如一个公平骰子的理论期望是 3.5。掷 5 次的平均数可能偏得很远，掷 5000 次后平均数通常贴近 3.5。稳定的不是每次结果，而是大量重复后的平均结构。",
      },
      {
        type: 'paragraph',
        text: "学生要注意，大数定律需要条件：独立性、相同分布或适当弱化条件、有限期望等。现实数据有相关性、选择偏差和非平稳性时，样本平均未必像理想模型那样可靠。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t4-f2.png",
        imageAlt: "样本平均收敛图：多条模拟曲线随 n 增大逐渐靠近期望线。",
        caption: "样本平均收敛图：多条模拟曲线随 n 增大逐渐靠近期望线。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页让概率从不确定性走向可估计性。期望和方差提供压缩指标，大数定律说明为什么这些指标能通过数据逐步显现。",
      },
    ],
  },
  {
    title: "极限定理与模型风险：正态近似何时可信",
    role: "高层视角 / 近似边界",
    content: [
      {
        type: 'paragraph',
        text: "中心极限定理解释了正态分布为何频繁出现。很多小误差叠加时，单个误差的细节会被平均掉，标准化后的总和趋向钟形。这让复杂随机系统可以被简单近似描述。",
      },
      {
        type: 'paragraph',
        text: "它的力量来自普适性：单个变量不必正态，只要满足适当条件，总和就可能接近正态。但普适不等于无条件。独立性、方差有限、没有单个因素支配整体，都是近似可信的重要前提。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t5-f1.png",
        imageAlt: "分布叠加图：偏斜单个变量相加后，标准化直方图逐渐接近钟形曲线。",
        caption: "分布叠加图：偏斜单个变量相加后，标准化直方图逐渐接近钟形曲线。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "在统计推断中，中心极限定理支撑置信区间、假设检验和误差估计。我们用样本平均近似总体均值，并用标准误衡量不确定性。这是概率论进入数据分析的关键通道。",
      },
      {
        type: 'blockFormula',
        latex: "\\frac{\\sum X_i-n\\mu}{\\sigma\\sqrt n}\\Rightarrow N(0,1)",
        explanation: "中心极限定理说明许多小的独立扰动相加后，经标准化会接近正态分布。",
      },
      {
        type: 'paragraph',
        text: "例子可以看测量误差。每次测量受温度、仪器、读数等许多小因素影响，总误差往往接近正态。但金融极端损失、网络流量峰值这类厚尾现象，可能让正态近似严重低估风险。",
      },
      {
        type: 'paragraph',
        text: "课程应把极限定理和模型风险一起讲。学生既要理解为什么近似有用，也要知道何时该怀疑近似。数学成熟度不只是会套用定理，还包括主动检查定理条件是否满足。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-probability-t5-f2.png",
        imageAlt: "模型风险检查表图：独立性、尾部厚度、样本量、异常值四项决定近似可信度。",
        caption: "模型风险检查表图：独立性、尾部厚度、样本量、异常值四项决定近似可信度。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页收束概率论：公理给规则，分布给对象，条件概率给信息更新，期望方差给长期指标，极限定理给近似方法。专业判断始终围绕两个问题：模型假设是什么，误差边界在哪里？",
      },
    ],
  }
];

export const probabilityArticleSections: AnalysisArticleSection[] = topicPagesToArticleSections(probabilityTopicPages);

export const abstractAlgebraTopicPages: CourseTopicPage[] = [
  {
    title: "运算与结构：从算术规律到代数对象",
    role: "入口 / 结构化思维",
    content: [
      {
        type: 'paragraph',
        text: "抽象代数的入口，是把熟悉的加减乘除从具体数字中抽离出来。我们不再只问 2+3 等于多少，而是问：一个集合配上某种运算后，满足哪些规则？这些规则能推出什么结构？",
      },
      {
        type: 'paragraph',
        text: "这种抽象看似远离计算，实际上是在寻找不同数学对象之间的共同骨架。整数加法、矩阵乘法、几何对称、置换组合都可以被放进统一框架，因为它们共享封闭性、结合律、单位元或逆元等性质。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t1-f1.png",
        imageAlt: "运算表图：元素集合加二元运算表，突出封闭性、单位元、逆元。",
        caption: "运算表图：元素集合加二元运算表，突出封闭性、单位元、逆元。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "代数结构的价值在于“规则决定推理”。如果一个结构有逆元，我们可以解方程；如果乘法不交换，很多熟悉变形就不再合法；如果没有单位元，某些归一化步骤无法进行。",
      },
      {
        type: 'blockFormula',
        latex: "(a*b)*c=a*(b*c)",
        explanation: "结合律等运算规则决定了对象属于哪类代数结构，也决定哪些推理合法。",
      },
      {
        type: 'paragraph',
        text: "例如矩阵乘法满足结合律但一般不满足交换律。AB 和 BA 可能完全不同，这迫使我们重新审视中学代数里默认使用的交换技巧。抽象代数让规则从背景走到前台。",
      },
      {
        type: 'paragraph',
        text: "学生要避免把定义背成清单。每条公理都对应一种可执行能力：封闭性保证运算不出界，结合律保证括号可移动，单位元提供静止动作，逆元提供撤销动作。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t1-f2.png",
        imageAlt: "结构层级图：半群、幺半群、群、环、域按规则逐步增强。",
        caption: "结构层级图：半群、幺半群、群、环、域按规则逐步增强。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页建立高层视角：抽象代数研究的不是某类数字，而是运算规则组织出的结构世界。后面的群、环、域、同态都在回答同一个问题：哪些性质在规则下被保留下来？",
      },
    ],
  },
  {
    title: "群与对称：动作如何被组合和反转",
    role: "对称语言 / 群论核心",
    content: [
      {
        type: 'paragraph',
        text: "群是最纯粹的可逆动作系统。一个群包含若干操作，操作可以组合，有不动操作，每个操作都能撤销。正方形的旋转和翻折、整数加法、置换组合都是群。",
      },
      {
        type: 'paragraph',
        text: "群论的专业视角是对称。我们不只看对象本身，还看哪些变换会保持对象结构不变。对称越多，对象越有规律；对称的组合方式揭示结构的深层限制。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t2-f1.png",
        imageAlt: "正方形对称图：旋转、翻折构成变换集合，组合后仍是对称。",
        caption: "正方形对称图：旋转、翻折构成变换集合，组合后仍是对称。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "群作用把抽象群落到具体对象上。群元素可以移动点、排列根、变换图形或作用在向量空间上。轨道说明对象在群作用下能到达哪些位置，稳定子说明哪些变换保持对象不动。",
      },
      {
        type: 'blockFormula',
        latex: "G\\curvearrowright X",
        explanation: "群作用描述群元素如何作为变换作用在对象集合上，把抽象群和具体对称连接起来。",
      },
      {
        type: 'paragraph',
        text: "例如正方形的一个顶点在旋转作用下可以到达四个顶点；保持某个顶点不动的对称只有少数几个。轨道和稳定子的关系把“可移动性”和“剩余对称”联系起来。",
      },
      {
        type: 'paragraph',
        text: "学生应把群表和计算看作入口，而不是终点。真正重要的是识别可逆动作：密码置换、晶体结构、方程根的排列、物理守恒都可以用群语言表达。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t2-f2.png",
        imageAlt: "轨道-稳定子图：一个点在群作用下移动形成轨道，保持它不动的变换形成稳定子。",
        caption: "轨道-稳定子图：一个点在群作用下移动形成轨道，保持它不动的变换形成稳定子。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页让抽象代数第一次显露力量：群把对称从图形直觉提升为可计算结构。理解群，就是理解“动作如何组合、如何撤销、如何保留形状”。",
      },
    ],
  },
  {
    title: "环、理想与商结构：在等价下重新组织运算",
    role: "双运算结构 / 商思想",
    content: [
      {
        type: 'paragraph',
        text: "环比群多一层结构：它同时有加法和乘法。整数、多项式、矩阵、函数都可以形成环。加法通常像群一样可逆，乘法则提供因式分解、零因子、整除和代数方程等信息。",
      },
      {
        type: 'paragraph',
        text: "理想是环论的核心对象。它不仅是加法子群，还能吸收环中任意元素的乘法。这个吸收性质保证我们可以把理想中的元素当作“零误差”，从而构造商环。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t3-f1.png",
        imageAlt: "整数模 n 图：数轴按余数折叠成 n 个等价类，展示商结构。",
        caption: "整数模 n 图：数轴按余数折叠成 n 个等价类，展示商结构。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "商结构是抽象代数最重要的思想之一：当我们决定忽略某类差异，对象会被分成等价类，并在等价类上继承运算。模 n 算术就是最熟悉的商环。",
      },
      {
        type: 'blockFormula',
        latex: "R/I=\\{a+I:a\\in R\\}",
        explanation: "商环把相差一个理想元素的对象视为等价，形成新的运算世界。",
      },
      {
        type: 'paragraph',
        text: "例如在整数模 5 中，12 和 2 属于同一类，因为它们相差 10，是 5 的倍数。加法和乘法只看余数。这个简单例子背后，是商环把无限整数折叠成有限结构。",
      },
      {
        type: 'paragraph',
        text: "学生常觉得理想抽象，是因为它不像普通子集那样有直观形状。可以从“允许忽略的误差”理解：理想规定哪些元素被视为零，商结构研究忽略这些误差后剩下的世界。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t3-f2.png",
        imageAlt: "理想吸收图：环元素乘理想仍落回理想，说明理想适合做商。",
        caption: "理想吸收图：环元素乘理想仍落回理想，说明理想适合做商。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页把代数从对称推进到构造：环提供双运算世界，理想规定可忽略差异，商结构在等价下生成新对象。许多高级代数和几何都依赖这个动作。",
      },
    ],
  },
  {
    title: "域、向量空间与多项式：可解性和构造",
    role: "可除结构 / 方程视角",
    content: [
      {
        type: 'paragraph',
        text: "域是可以做加减乘除的代数世界，除了 0 之外每个元素都有乘法逆元。有理数、实数、复数、有限域都是域。域让线性代数中的解方程、基、维数等概念能够稳定运行。",
      },
      {
        type: 'paragraph',
        text: "多项式把代数结构和方程连接起来。在一个域上，多项式可以相加相乘，可以讨论整除、最大公因式、不可约性。不可约多项式像“代数素数”，决定哪些方程不能在当前域中分解。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t4-f1.png",
        imageAlt: "域结构图：非零元素都有乘法逆元，因此线性方程 ax=b 可解。",
        caption: "域结构图：非零元素都有乘法逆元，因此线性方程 ax=b 可解。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "扩域的思想非常有力量：当一个方程在原域里没有根，我们可以构造一个更大的域，让这个根成为新元素。复数就是为 x^2+1=0 添入 i 的典型例子。",
      },
      {
        type: 'blockFormula',
        latex: "F[x]/(p(x))",
        explanation: "用不可约多项式生成商环，可以构造扩域，从而让原本无根的方程获得根。",
      },
      {
        type: 'paragraph',
        text: "有限域则显示另一种方向：在有限集合上仍然可以拥有完整的加减乘除结构。它们在编码理论、密码学和离散几何中非常关键，因为有限性带来可计算性，域结构带来代数控制。",
      },
      {
        type: 'paragraph',
        text: "学生要注意，域不是“更高级的数”而是“除法可用的结构”。很多定理需要域而不只是环，原因就在于我们需要除以非零系数，或需要向量空间理论。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t4-f2.png",
        imageAlt: "扩域构造图：实数中 x^2+1 无根，引入 i 后形成复数平面。",
        caption: "扩域构造图：实数中 x^2+1 无根，引入 i 后形成复数平面。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页展示代数的构造能力：通过域、多项式和扩张，我们不仅研究已有对象，还能系统构造新对象，让方程、编码和几何问题进入可解框架。",
      },
    ],
  },
  {
    title: "同态、表示与不变量：用结构保持映射比较对象",
    role: "高层视角 / 比较方法",
    content: [
      {
        type: 'paragraph',
        text: "抽象代数不只关心单个结构，还关心结构之间如何比较。同态是保持运算的映射：先在原结构中运算再映射，等于先映射再在目标结构中运算。它捕捉“结构不变”的核心。",
      },
      {
        type: 'paragraph',
        text: "同构是可逆同态，表示两个对象在结构上完全相同，只是元素名字不同。数学分类常常不是按外观，而是按同构类型：若能建立同构，就说明两者拥有相同代数骨架。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t5-f1.png",
        imageAlt: "同态交换图：两个结构之间有映射，运算后再映射与映射后再运算结果一致。",
        caption: "同态交换图：两个结构之间有映射，运算后再映射与映射后再运算结果一致。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "表示论进一步把抽象群或代数对象转化为矩阵变换。这样一来，抽象运算可以被线性代数工具研究。表示不是简单翻译，而是寻找一个能保留结构的具体动作模型。",
      },
      {
        type: 'blockFormula',
        latex: "\\varphi(ab)=\\varphi(a)\\varphi(b)",
        explanation: "同态要求映射尊重运算；它让我们比较不同代数对象中真正相同的结构。",
      },
      {
        type: 'paragraph',
        text: "不变量则用于区分对象。群的阶、元素阶、是否交换、中心大小；环的理想结构、零因子；域的特征和扩张次数，都是在同构下不改变的指标。若不变量不同，对象不可能同构。",
      },
      {
        type: 'paragraph',
        text: "学生要从“求答案”转向“比较结构”。抽象代数成熟之处在于：它提供映射、商、作用、不变量这些统一方法，让不同领域的问题可以被放在同一张结构图上进行比较。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-abstract-algebra-t5-f2.png",
        imageAlt: "不变量分类图：阶、中心、交换性、理想结构等指标用于区分对象。",
        caption: "不变量分类图：阶、中心、交换性、理想结构等指标用于区分对象。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页收束抽象代数：运算规则生成结构，同态比较结构，表示把结构具体化，不变量帮助分类。它是一门训练高层抽象和结构识别能力的核心课程。",
      },
    ],
  }
];

export const abstractAlgebraArticleSections: AnalysisArticleSection[] = topicPagesToArticleSections(abstractAlgebraTopicPages);

export const topologyTopicPages: CourseTopicPage[] = [
  {
    title: "连续变形与不变量：长度角度之外看形状",
    role: "入口 / 拓扑视角",
    content: [
      {
        type: 'paragraph',
        text: "拓扑学换了一种看形状的方式。几何关心长度、角度、面积，拓扑关心在连续拉伸、弯曲、压缩下仍然不变的性质。只要不撕裂、不粘合，许多形状被视为同一种结构。",
      },
      {
        type: 'paragraph',
        text: "这种视角看似宽松，其实非常有力量。它把复杂图形简化为连通性、洞、边界、可缩性等稳定特征。拓扑不变量就是在连续变形下保持不变的量，用来判断两个空间是否真的不同。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t1-f1.png",
        imageAlt: "咖啡杯到甜甜圈连续变形图：手柄孔保持存在，长度和角度改变但洞数不变。",
        caption: "咖啡杯到甜甜圈连续变形图：手柄孔保持存在，长度和角度改变但洞数不变。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "同胚是拓扑中的等价关系。若两个空间之间存在连续双向映射，且逆映射也连续，它们在拓扑意义下相同。咖啡杯和甜甜圈常被拿来举例，因为它们都只有一个洞。",
      },
      {
        type: 'blockFormula',
        latex: "X\\cong Y",
        explanation: "同胚表示两个空间可通过连续且可逆的变形互相对应，是拓扑中的“形状相同”。",
      },
      {
        type: 'paragraph',
        text: "学生应注意，拓扑并非允许任意变形。撕开圆环、粘住两个点、切断区间都会改变拓扑结构。允许什么变形，禁止什么操作，决定了不变量是否有意义。",
      },
      {
        type: 'paragraph',
        text: "一个入门例子是圆和线段。它们都连通，但线段去掉一个中间点会断成两段，圆去掉一个点仍然连通成一条开弧。这个性质可以区分两者。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t1-f2.png",
        imageAlt: "不变量对比图：圆、区间、两个圆分别标出连通分支和洞的数量。",
        caption: "不变量对比图：圆、区间、两个圆分别标出连通分支和洞的数量。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页建立拓扑课程的高层问题：当度量细节被忽略后，形状还剩下什么？拓扑学就是寻找这些稳定骨架，并证明它们无法被连续变形消除。",
      },
    ],
  },
  {
    title: "开集、邻域与连续映射：没有距离也能说接近",
    role: "基础语言 / 连续性",
    content: [
      {
        type: 'paragraph',
        text: "为了在没有距离的空间里讨论接近，拓扑学把开集作为基本语言。一个拓扑就是指定哪些子集被认为是开集；邻域、收敛、连续性都从开集出发定义。",
      },
      {
        type: 'paragraph',
        text: "这比欧氏距离更抽象，也更统一。函数空间、商空间、离散结构、代数几何中的空间未必有自然距离，但只要有合适开集，就能讨论局部性质和连续变化。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t2-f1.png",
        imageAlt: "开集邻域图：点周围有可容纳的小区域，边界点和内部点用颜色区分。",
        caption: "开集邻域图：点周围有可容纳的小区域，边界点和内部点用颜色区分。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "连续映射的开集定义非常关键：目标空间任意开集的原像在源空间中仍是开集。它表达的是连续性不会突然中断；如果输出落在一个可观测开放条件里，输入也能找到相应的开放条件保证它。",
      },
      {
        type: 'blockFormula',
        latex: "f^{-1}(U)\\text{ is open whenever }U\\text{ is open}",
        explanation: "拓扑连续性用开集原像刻画，不必依赖具体距离公式。",
      },
      {
        type: 'paragraph',
        text: "这个定义和数学分析中的 ε-δ 连续并不冲突。在度量空间里，两者等价；拓扑定义只是把“距离小于 ε”的特殊表达抽象成“开邻域”的语言。",
      },
      {
        type: 'paragraph',
        text: "学生常问为什么不用图像直觉。原因是拓扑要处理的对象远超平面曲线。开集语言让我们在不同空间中使用同一种连续性定义，这是抽象带来的统一。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t2-f2.png",
        imageAlt: "连续映射原像图：目标空间开集拉回到源空间仍是开集，表示没有突然撕裂。",
        caption: "连续映射原像图：目标空间开集拉回到源空间仍是开集，表示没有突然撕裂。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页给出拓扑的技术入口：开集定义局部可观察范围，邻域描述接近，连续映射保持这种局部结构。后面的紧致、连通和基本群都依赖这套语言。",
      },
    ],
  },
  {
    title: "连通与紧致：整体形状如何被控制",
    role: "整体性质 / 控制原则",
    content: [
      {
        type: 'paragraph',
        text: "连通性描述空间是否是一整块。若一个空间能被分成两个互不相交、互相隔开的非空开集，它就是不连通的；否则就是连通的。这个概念抽象了“不断裂”的整体性质。",
      },
      {
        type: 'paragraph',
        text: "紧致性更微妙，它是拓扑中的有限控制原则。即使问题以无限覆盖形式出现，紧致空间允许我们选出有限子覆盖。许多分析定理中的最大值存在、均匀连续，都可以从紧致性获得解释。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t3-f1.png",
        imageAlt: "连通性图：一个整体区域无法分成两个互不接触的开闭块，旁边对比分离空间。",
        caption: "连通性图：一个整体区域无法分成两个互不接触的开闭块，旁边对比分离空间。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "在实数线上，闭区间 [a,b] 紧致，而开区间 (a,b) 不紧致。区别不在长度有限，而在端点是否被包含。缺失端点会让某些覆盖无法被有限选取控制。",
      },
      {
        type: 'blockFormula',
        latex: "\\text{every open cover has a finite subcover}",
        explanation: "紧致性说明无限开放覆盖可被有限信息控制，是拓扑中的有限性替代品。",
      },
      {
        type: 'paragraph',
        text: "连通和紧致经常配合连续映射使用。连续映射会把连通空间送到连通空间，把紧致空间送到紧致空间。这意味着整体性质能通过连续映射保持，是拓扑方法服务其他数学分支的关键。",
      },
      {
        type: 'paragraph',
        text: "学生应把紧致理解成“无限问题可有限检验”的条件，而不是只背开覆盖定义。它是现代数学中极其重要的技术词，出现在分析、几何、动力系统和优化中。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t3-f2.png",
        imageAlt: "紧致覆盖图：许多开区间覆盖闭区间，从中选出有限个仍能覆盖。",
        caption: "紧致覆盖图：许多开区间覆盖闭区间，从中选出有限个仍能覆盖。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页展示拓扑如何控制整体形状：连通性防止空间被拆开，紧致性防止信息逃到无穷或边界外。它们让连续对象拥有可证明的全局结论。",
      },
    ],
  },
  {
    title: "曲面、粘边与洞：从纸片构造空间",
    role: "构造直觉 / 曲面分类",
    content: [
      {
        type: 'paragraph',
        text: "我们可以通过构造方式得到拓扑空间。拿一张纸片，按规则粘合边界，就能得到圆柱、莫比乌斯带、环面等曲面。这个过程让抽象空间变得可视，也让“洞”和“扭转”具体出现。",
      },
      {
        type: 'paragraph',
        text: "曲面分类的思想是：复杂曲面可以按少数不变量组织，例如是否可定向、边界数量、洞的数量或 Euler 示性数。分类不是凭外观，而是凭连续变形下无法改变的结构。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t4-f1.png",
        imageAlt: "边粘合图：正方形对边同向粘成圆柱和环面，反向粘成莫比乌斯带。",
        caption: "边粘合图：正方形对边同向粘成圆柱和环面，反向粘成莫比乌斯带。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "Euler 示性数 V-E+F 看起来依赖切分方式，但对同一曲面保持不变。球面的示性数是 2，环面是 0。这个数可以帮助区分曲面，也连接组合、几何和拓扑。",
      },
      {
        type: 'blockFormula',
        latex: "\\chi=V-E+F",
        explanation: "Euler 示性数是曲面的拓扑不变量之一，可用顶点、边、面数量组合得到。",
      },
      {
        type: 'paragraph',
        text: "例如把正方形左右边、上下边分别同向粘合，可以得到环面。图上只是一个方块，但粘合规则改变了空间的全局连接方式。学生需要学会从边标记读出真实空间。",
      },
      {
        type: 'paragraph',
        text: "粘边构造也提醒我们：拓扑对象不一定要嵌在三维空间中才能研究。很多空间可以通过局部图块和粘合规则定义，这为流形、覆盖空间和代数拓扑铺路。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t4-f2.png",
        imageAlt: "曲面不变量表：球面、环面、双环面对应不同洞数和 Euler 示性数。",
        caption: "曲面不变量表：球面、环面、双环面对应不同洞数和 Euler 示性数。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页把拓扑从性质推进到构造：通过粘合，我们制造空间；通过不变量，我们识别空间。洞、边界和定向性成为理解曲面的核心线索。",
      },
    ],
  },
  {
    title: "基本群与同调直觉：用代数记录拓扑障碍",
    role: "高层视角 / 代数化",
    content: [
      {
        type: 'paragraph',
        text: "代数拓扑的核心想法，是把空间中的洞和绕行障碍翻译成代数对象。基本群记录闭合路径如何绕洞，同调则用更高维的方式统计环、空腔和边界关系。",
      },
      {
        type: 'paragraph',
        text: "在没有洞的平面上，任意闭合路径都可以连续缩成一点；在圆环或环面上，绕洞的路径无法缩掉。这种“缩不掉”不是因为路径太长，而是因为空间的拓扑结构阻止它。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t5-f1.png",
        imageAlt: "环面闭合路径图：绕经线、纬线的环路不能缩成点，用不同颜色标出。",
        caption: "环面闭合路径图：绕经线、纬线的环路不能缩成点，用不同颜色标出。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "基本群把闭合路径按同伦等价分类，并用路径拼接定义群运算。若两个空间同胚，它们的基本群同构；因此基本群是区分空间的不变量。",
      },
      {
        type: 'blockFormula',
        latex: "\\pi_1(X,x_0)",
        explanation: "基本群记录从基点出发的闭合路径在连续变形下的等价类，捕捉一维洞。",
      },
      {
        type: 'paragraph',
        text: "同调的直觉更偏向“边界是否围出东西”。一个闭合环若是某个面片的边界，就不代表真正的洞；若不是任何面片的边界，它就记录了拓扑空缺。这个思想能推广到高维。",
      },
      {
        type: 'paragraph',
        text: "学生在入门阶段不必掌握所有代数细节，但要看见转化路线：几何问题先变成路径或链，再变成群或向量空间，最后用代数计算比较空间。",
      },
      {
        type: 'figure',
        imageSrc: "/design/math-speed/generated/course-redo-20260526-topology-t5-f2.png",
        imageAlt: "拓扑到代数流程图：路径/洞 → 等价类 → 群或同调群 → 可比较不变量。",
        caption: "拓扑到代数流程图：路径/洞 → 等价类 → 群或同调群 → 可比较不变量。",
        imageWidth: COURSE_REDO_FIGURE_WIDTH,
        imageHeight: COURSE_REDO_FIGURE_HEIGHT,
      },
      {
        type: 'paragraph',
        text: "这一页收束拓扑学：从连续变形到开集语言，从全局性质到曲面构造，再到代数不变量。拓扑的高阶价值，是用稳定结构理解形状，并把形状问题转化为可计算的代数问题。",
      },
    ],
  }
];

export const topologyArticleSections: AnalysisArticleSection[] = topicPagesToArticleSections(topologyTopicPages);
