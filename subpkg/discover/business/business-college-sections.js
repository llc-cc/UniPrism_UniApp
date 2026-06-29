const ECON_SECTIONS = [
  {
    id: 'econ-start',
    title: '开始',
    role: '经济学到底学什么',
    content: [
      { type: 'heading', title: '经济学不是只讲“钱”，而是在讲人和企业为什么这样选择', eyebrow: '开始' },
      { type: 'interaction', id: 'econ-logic-chain' },
      { type: 'paragraph', text: '你每天都在做经济学题：今晚复习还是休息？零花钱买奶茶还是攒起来？企业也一样，要在预算投广告、研发和扩产之间做选择。' },
      { type: 'paragraph', text: '经济学最关心的不是“有没有钱”，而是“不能全都要时怎么选”。只要一个选择会挤掉另一个选择，经济学就可以帮你分析。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：创业公司怎么花第一笔预算？',
        body: '一家新成立的饮品品牌拿到第一笔启动资金后，管理层通常不会简单地平均分。如果把钱投到广告，短期能带来曝光和试喝人数；如果投到研发，可能做出更稳定的口味；如果投到门店位置，可能获得更高客流。经济学会帮助团队比较这些选择的收益、风险和被放弃的机会。',
        rows: [
          { label: '需求很多', value: '学生想要成绩、社交、休息；企业想要增长、利润、品牌。' },
          { label: '资源有限', value: '时间、预算、产能、员工注意力都有限。' },
          { label: '必须选择', value: '选择 A，往往意味着暂时放弃 B。' },
          { label: '选择有代价', value: '经济学会问：这个代价值得吗？' },
        ],
      },
    ],
  },
  {
    id: 'econ-scarcity',
    title: '稀缺',
    role: '不是没有，而是不够用',
    content: [
      { type: 'heading', title: '稀缺：不是完全没有，而是不够大家随便用', eyebrow: 'Scarcity' },
      { type: 'interaction', id: 'econ-scarcity' },
      { type: 'paragraph', text: '考试周图书馆座位很紧张，热门餐厅需要排队，热门手机首发可能要抢购。这些都不是因为资源为零，而是因为需求超过了可用数量。' },
      { type: 'block', kind: 'definition', title: '稀缺', body: '稀缺 = 资源有限 + 需求很多。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：航空公司的座位管理',
        body: '一架飞机的座位数量在起飞前基本固定，但乘客需求差异很大。航空公司会用舱位等级、提前购票折扣、临近出发调价来分配座位。这个案例说明，稀缺资源不只是“抢不到”，企业还会设计规则来提高资源使用效率。',
      },
    ],
  },
  {
    id: 'econ-opportunity-cost',
    title: '机会成本',
    role: '选择真正放弃了什么',
    content: [
      { type: 'heading', title: '机会成本，是你为了一个选择放弃的“最好那个替代选项”。' },
      { type: 'interaction', id: 'econ-opportunity-cost' },
      { type: 'paragraph', text: '机会成本不一定是钱。它可能是时间、成绩、休息，也可能是企业错过的市场机会。比如看电影花了 50 元，但如果你因此少复习两小时，真正的机会成本可能是“成绩提升的机会”。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：广告预算 vs. 产品研发',
        body: '一家运动品牌有 100 万元预算。投广告可以让更多人立刻看到新品，短期销量可能上涨；投研发可以改进鞋底材料和舒适度，长期复购可能更强。管理层选择广告时，不能只看“广告有没有用”，还要看到被放弃的研发升级、专利积累和未来产品口碑。',
      },
    ],
  },
  {
    id: 'econ-marginal',
    title: '边际思维',
    role: '再多一点值不值',
    content: [
      { type: 'heading', title: '边际思维：再多一点值不值', eyebrow: 'Marginal Thinking' },
      { type: 'interaction', id: 'econ-marginal' },
      { type: 'paragraph', text: '经济学经常问的不是“学习有没有用”，而是“再多学一小时值不值”；不是“广告有没有用”，而是“再多投一万元广告值不值”。多做一点带来的好处叫边际收益，多做一点付出的代价叫边际成本。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：奶茶店延长营业时间',
        body: '奶茶店延长营业时间时，要比较这一小时新增利润是否大于新增成本。多开 1 小时可能多卖 30 杯，带来额外收入；但同时要付加班工资、水电费，还可能影响员工第二天状态。',
      },
    ],
  },
  {
    id: 'econ-scale',
    title: '规模经济',
    role: '为什么做大以后成本可能下降',
    content: [
      { type: 'heading', title: '规模经济：做大以后成本会怎样', eyebrow: 'Economies of Scale' },
      { type: 'interaction', id: 'econ-scale' },
      { type: 'paragraph', text: '规模经济讲的是有些生意做大以后，平均成本会下降。固定成本是不管卖多少都要花的钱，可变成本会随着销量增加而增加。当销量变大，固定成本被更多产品分摊，每件产品承担的成本可能变低。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：咖啡连锁品牌',
        body: '咖啡连锁品牌做大后，可以把门店系统、会员小程序、广告拍摄和供应链管理分摊到很多门店上，降低单杯咖啡背后的平均运营成本。',
      },
    ],
  },
  {
    id: 'econ-demand',
    title: '需求',
    role: '价格会影响购买意愿',
    content: [
      { type: 'heading', title: '需求：价格怎样影响购买意愿', eyebrow: 'Demand' },
      { type: 'interaction', id: 'econ-demand' },
      { type: 'paragraph', text: '需求不是“我想要”，而是“这个价格下，我愿意并且买得起”。一般来说，价格越高，愿意购买的人越少；价格越低，愿意购买的人越多。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：电影院学生票',
        body: '电影院在工作日下午或淡季推出学生票，并不是单纯“做福利”。这些时段空座较多，座位一旦过了放映时间就无法再卖。学生群体通常对价格更敏感，降低票价能把原本不买票的人吸引进场。',
      },
    ],
  },
  {
    id: 'econ-supply',
    title: '供给',
    role: '价格也会影响商家',
    content: [
      { type: 'heading', title: '供给：价格也会影响商家', eyebrow: 'Supply' },
      { type: 'interaction', id: 'econ-supply' },
      { type: 'paragraph', text: '价格不只影响消费者，也会影响商家愿不愿意卖。如果售价太低，商家可能觉得不划算；如果售价更高、利润更好，商家就更愿意生产、进货、延长营业。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：网约车高峰加价',
        body: '下雨、晚高峰或演唱会散场后，打车需求突然上升。平台加价后，一些原本不想接单的司机会被更高收入吸引出来，供给增加；同时一部分乘客会选择地铁、公交或晚点出发，需求被压低。',
      },
    ],
  },
  {
    id: 'econ-equilibrium',
    title: '均衡',
    role: '价格怎么形成',
    content: [
      { type: 'heading', title: '均衡：价格怎么形成', eyebrow: 'Equilibrium' },
      { type: 'interaction', id: 'econ-equilibrium' },
      { type: 'paragraph', text: '市场价格不是随便来的，它会被供给和需求一起推着走。当大家愿意买的数量接近商家愿意卖的数量，就比较接近市场均衡。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：库存和折扣',
        body: '服装品牌最怕换季库存积压。比如春季外套到了夏天还剩很多，仓储成本会上升，现金也被库存占住。品牌常用折扣、会员专场、奥莱渠道清库存。降价会刺激需求，也能让企业回收现金，减少库存风险。',
      },
    ],
  },
  {
    id: 'econ-case',
    title: '案例',
    role: '热门门票为什么涨价',
    content: [
      { type: 'heading', title: '热门门票为什么涨价', eyebrow: '综合案例' },
      { type: 'interaction', id: 'econ-case' },
      { type: 'paragraph', text: '如果一个场馆只有 10,000 个座位，但有 100,000 人想去，座位就成了稀缺资源。价格上涨会让一部分人退出购买，也会让市场重新接近平衡。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学延伸：动态定价',
        body: '酒店节假日涨价、机票临近出发更贵、网约车高峰加价，背后都是用价格管理有限供给和不同强度的需求。',
      },
    ],
  },
  {
    id: 'econ-micro-macro',
    title: '微观与宏观',
    role: '从一家店到整体经济',
    content: [
      { type: 'heading', title: '微观经济学看“小选择”，宏观经济学看“大运行”', eyebrow: 'Micro & Macro' },
      { type: 'interaction', id: 'econ-micro-macro' },
      { type: 'paragraph', text: '微观经济学研究个人、家庭和企业的决策。比如消费者为什么买这个品牌，一家店为什么这样定价。宏观经济学研究整体经济，比如通货膨胀、失业率、经济增长、利率和政府政策。' },
      {
        type: 'block',
        kind: 'example',
        title: '现实商学案例：同一个奶茶品牌的两种问题',
        body: '“这家店一杯卖多少钱”是微观问题；“经济不景气时消费者整体减少消费”更接近宏观问题。商业决策往往需要两个层面一起看。',
        rows: [
          { label: '微观经济学', value: '消费者选择、企业定价、市场竞争、成本与利润。' },
          { label: '宏观经济学', value: '通货膨胀、失业率、经济增长、利率和政策。' },
        ],
      },
    ],
  },
  {
    id: 'econ-map',
    title: '知识点地图',
    role: '把概念串起来',
    content: [
      { type: 'heading', title: '把概念串起来', eyebrow: '知识点地图' },
      { type: 'interaction', id: 'econ-map' },
      { type: 'paragraph', text: '这一章真正要带走的，不是术语，而是一套分析方式。下次看到涨价、排队、折扣、库存、广告预算时，可以先问三件事：资源稀缺吗？谁在放弃什么？价格在改变谁的行为？' },
      {
        type: 'block',
        kind: 'example',
        title: '复盘清单',
        body: '稀缺解释资源为什么不够所有人随便用；机会成本解释选择 A 时放弃了什么；边际思维解释多做一点是否值得；规模经济解释产量扩大后平均成本为什么可能下降；需求、供给和均衡解释价格如何改变消费者与商家的行为。',
      },
    ],
  },
  {
    id: 'econ-international',
    title: '国际延伸',
    role: '跨市场里的价格和供需',
    content: [
      { type: 'heading', title: '从本地价格走向跨市场判断', eyebrow: 'International Economics' },
      { type: 'paragraph', text: '经济学的同一套分析方式可以扩展到更大的市场：不同城市、不同国家、不同货币和不同制度环境下，资源、需求、供给和价格仍然会互相牵动。' },
      { type: 'paragraph', text: '在国际经济问题里，学生会继续追问：一个国家为什么进口某些商品、出口另一些商品？汇率变化会怎样影响企业成本和消费者价格？全球供应链被打断时，哪些行业会先感到压力？' },
      {
        type: 'block',
        kind: 'example',
        title: '延伸案例：机票、酒店与跨城市需求',
        body: '动态定价的原理可以自然延伸到国际旅行和跨城市市场。节假日酒店涨价、机票临近出发更贵，并不是“随便涨价”，而是房间和座位短期固定，需求强度和支付意愿在不同时间、地点、人群之间发生变化。',
      },
    ],
  },
]

const FINANCE_SECTIONS = [
  {
    id: 'finance-start',
    title: '开始',
    role: '金融到底学什么',
    content: [
      { type: 'heading', title: '金融不等于买股票。它更像是在做选择。', eyebrow: '开始' },
      { type: 'paragraph', text: '钱现在用，还是以后用？自己出钱，还是借别人的钱？追求更高回报，还是先保护现金安全？这些看起来像生活问题，其实都是金融问题。' },
      { type: 'paragraph', text: '比如你买电脑，会想一次性付款、分期，还是先存钱。企业开新店也一样：自己出钱、向银行借钱，还是找投资人入股。' },
      {
        type: 'block',
        kind: 'example',
        title: '本章主线：钱、时间、风险和选择',
        body: '先从生活场景看懂概念，再用企业案例理解商科里的用法。专业内容结束后，章末测验会用选择题检查资金选择、现金流、时间价值、复利、风险收益、融资和预算取舍。',
        rows: [
          { label: '时间', value: '同一笔钱在今天和未来意义不同。' },
          { label: '用途', value: '消费、储蓄、借款、投资会带来不同后果。' },
          { label: '风险', value: '更高回报通常伴随更高不确定性。' },
          { label: '选择', value: '金融判断很少只有一个完美答案。' },
        ],
      },
      { type: 'interaction', id: 'finance-start' },
    ],
  },
  {
    id: 'finance-money-choice',
    title: '资金选择',
    role: '同一笔钱，不同用法',
    content: [
      { type: 'heading', title: '同样是8000元，马上花、分期付、先存起来，结果都不一样。', eyebrow: '资金选择' },
      { type: 'interaction', id: 'finance-money-choice' },
      { type: 'paragraph', text: '金融会追问四件事：这笔钱什么时候用？用在哪里？谁承担风险？以后会带来收益，还是带来还款压力？' },
      { type: 'paragraph', text: '所以金融不只是投资。储蓄、借款、预算、保险、企业融资和风险管理，都属于金融。' },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：咖啡店开业的第一笔钱',
        body: '一家咖啡店开业前，要先付装修费、咖啡机费用、第一批原料费、员工培训费和几个月房租。钱不够时，老板必须排序：先保证设备？先做推广？还是多留一点现金防止开业后生意不稳定？金融就是帮企业把有限资金放到更合适的位置。',
      },
    ],
  },
  {
    id: 'finance-flow',
    title: '什么是金融',
    role: '资金怎么流动',
    content: [
      { type: 'heading', title: '金融研究的是：钱从哪里来，流向哪里，最后由谁承担风险。', eyebrow: '什么是金融' },
      { type: 'interaction', id: 'finance-flow' },
      { type: 'paragraph', text: '家庭把暂时不用的钱存进银行，银行再把钱借给企业。企业用这笔钱开店、买设备、发工资。员工拿到工资后，又会消费或储蓄。钱就这样在经济里不断流动。' },
      { type: 'block', kind: 'definition', title: '金融三问', body: '钱从哪里来？钱用到哪里去？出了问题谁承担？' },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：新饮料品牌怎么拿到启动资金',
        body: '一个新饮料品牌想进入便利店，前期要花很多钱：生产、包装、入场费、广告费都要先付。它可以向银行贷款，也可以让投资人入股。贷款的好处是不用分股份，但要还利息；入股的好处是短期还款压力小，但以后要和投资人分享公司收益。',
      },
    ],
  },
  {
    id: 'finance-cash-flow',
    title: '现金流',
    role: '钱进来，也要够出去',
    content: [
      { type: 'heading', title: '卖得多，不一定代表手里有现金。', eyebrow: '现金流' },
      { type: 'interaction', id: 'finance-cash-flow' },
      { type: 'paragraph', text: '现金流看的是一段时间里，钱真正进来了多少，又真正花出去了多少。企业可能订单很多，也可能账面上有利润，但如果客户还没付款，库存又占用了很多钱，手里的现金仍然会紧张。' },
      {
        type: 'formulaCards',
        cards: [
          {
            name: '净现金流',
            math: '本期收进来的钱 - 本期花出去的钱 = 净现金流。',
            body: '现金流关注的是现金有没有真的到账。',
          },
        ],
      },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：奶茶店为什么会“卖得多却没钱”',
        body: '奶茶店这个月卖得不错，但提前买了很多原料，又一次性交了三个月房租，还投了开业广告。月底一算，收入不少，可账户里没剩多少现金。小企业常见的问题不是没人买，而是钱进来的速度赶不上钱花出去的速度。',
      },
    ],
  },
  {
    id: 'finance-time-value',
    title: '时间价值',
    role: '今天的钱更有弹性',
    content: [
      { type: 'heading', title: '今天拿到的100元，通常比一年后才拿到的100元更有价值。', eyebrow: '时间价值' },
      { type: 'interaction', id: 'finance-time-value' },
      { type: 'paragraph', text: '原因很简单：今天的钱可以马上用，也可以拿去存款或投资。未来的钱要等一段时间才能拿到，中间还可能遇到不确定性，购买力也可能变化。' },
      {
        type: 'formulaCards',
        cards: [
          {
            name: '未来价值',
            math: '未来价值 = 本金 x (1 + 利率)^年数。',
            body: '时间价值的意思是今天的一笔钱可以在未来产生额外回报。',
          },
        ],
      },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：公司手里的100万元怎么安排？',
        body: '一家服装品牌手里有100万元，可以放银行赚利息，可以买设备提高产能，也可以投入广告推广新品。金融分析不会只看“哪个听起来好”，而是比较每个方案未来可能带来的现金回报，以及中间要承担的风险。',
      },
    ],
  },
  {
    id: 'finance-compound',
    title: '利息与复利',
    role: '利息也会产生利息',
    content: [
      { type: 'heading', title: '利息是用钱的成本；复利是利息也继续产生利息。', eyebrow: '利息与复利' },
      { type: 'interaction', id: 'finance-compound' },
      { type: 'paragraph', text: '如果你借钱，利息就是使用别人资金的成本。如果你存钱或投资，利息就是资金带来的回报。复利的特别之处在于：上一期产生的利息，会和本金一起进入下一期计算。' },
      {
        type: 'formulaCards',
        cards: [
          {
            name: '单利 Simple Interest',
            math: 'A = P(1 + rt)',
            body: '单利只按本金计算利息；复利会把已经产生的利息并入本金，再计算下一期利息。年限越长，两者差距越明显。',
          },
          {
            name: '复利 Compound Interest',
            math: 'A = P(1 + r)^t',
            body: '单利只按本金计算利息；复利会把已经产生的利息并入本金，再计算下一期利息。年限越长，两者差距越明显。',
          },
        ],
      },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：创业贷款为什么要小心',
        body: '一家小餐厅借50万元装修开店。如果利率高、还款期长，最后还的钱可能明显超过50万元。反过来，如果企业有闲置资金，长期存放或投资也会因为复利慢慢增长。',
      },
    ],
  },
  {
    id: 'finance-risk-return',
    title: '风险与收益',
    role: '高回报通常不免费',
    content: [
      { type: 'heading', title: '金融里有一个基本提醒：高收益通常伴随着高风险。', eyebrow: '风险与收益' },
      { type: 'interaction', id: 'finance-risk-return' },
      { type: 'paragraph', text: '收益指可能赚到的钱，风险指结果的不确定性。一个方案听起来回报很高时，不要只看收益，还要问：如果结果不好，会亏多少？谁来承担？' },
      { type: 'block', kind: 'definition', title: '风险收益提醒', body: '只讲高收益、不讲风险的方案，要特别小心。' },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：连锁餐饮为什么不能盲目扩张',
        body: '一家餐饮品牌可以一年开一家店，也可以一次开十家店。一次开十家听起来增长更快，但如果选址错了、供应链跟不上、员工培训不到位，亏损也会同时放大。金融决策要把增长速度和承受风险的能力放在一起看。',
      },
    ],
  },
  {
    id: 'finance-diversification',
    title: '分散投资',
    role: '不要只押一个结果',
    content: [
      { type: 'heading', title: '分散投资不能保证赚钱，但能避免把结果押在一件事上。', eyebrow: '分散投资' },
      { type: 'interaction', id: 'finance-diversification' },
      { type: 'paragraph', text: '如果所有钱都放在同一个资产里，结果就很依赖这一个资产的表现。把资金分到不同资产、行业或地区，可以减少单一失败带来的冲击。' },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：教育公司为什么要有多种收入来源',
        body: '一家教育公司如果只靠线下课程，一旦客流下降，收入会很受影响。如果同时有线下课、线上课、教材销售和升学咨询，即使某一块业务波动，公司也不会立刻陷入现金压力。',
      },
      { type: 'block', kind: 'definition', title: '分散风险', body: '分散能降低部分风险，但不能让风险消失。' },
    ],
  },
  {
    id: 'finance-financing',
    title: '企业融资',
    role: '借钱还是让别人入股',
    content: [
      { type: 'heading', title: '企业需要外部资金时，常见两种方式：借钱，或者让投资人入股。', eyebrow: '企业融资' },
      { type: 'interaction', id: 'finance-financing' },
      {
        type: 'block',
        kind: 'example',
        title: '债务融资 vs. 股权融资',
        body: '债务融资是向银行或债权人借钱，到期要还本金和利息；股权融资是让投资人出钱换股份，没有固定还款压力，但要分享股份、控制权和未来利润。',
        rows: [
          { label: '债务融资', value: '不用分股份，但必须按时还本付息。' },
          { label: '股权融资', value: '现金压力较小，但会稀释股份和未来收益。' },
        ],
      },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：科技创业公司为什么常找投资人？',
        body: '软件公司早期可能还没有稳定收入，却需要大量研发和市场推广。银行可能担心它还不起贷款，所以这类公司常选择股权融资。投资人愿意承担风险，是因为一旦公司做大，股份价值可能大幅上升。',
      },
    ],
  },
  {
    id: 'finance-capital-cost',
    title: '资本成本',
    role: '拿到钱不是免费的',
    content: [
      { type: 'heading', title: '企业做项目时，不只要问“能赚钱吗”，还要问“赚得过用钱的成本吗？”', eyebrow: '资本成本' },
      { type: 'interaction', id: 'finance-capital-cost' },
      { type: 'paragraph', text: '借钱的成本是利息。股权资金也有成本，因为投资人会要求回报。如果一个项目的回报率低于资金成本，企业表面上可能有收入，实际上却可能不划算。' },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：新店回报低于贷款利率怎么办',
        body: '一家餐饮公司借钱开新店，贷款利率是10%。如果新店预计年回报只有7%，即使销售额会增加，也要谨慎。因为这个项目赚到的钱，可能还不够覆盖借钱的成本。',
      },
      { type: 'block', kind: 'definition', title: '资本成本', body: '项目回报率高于资本成本，才更可能创造价值。' },
    ],
  },
  {
    id: 'finance-budget',
    title: '预算决策',
    role: '预算不是限制，是安排优先级',
    content: [
      { type: 'heading', title: '预算不是单纯少花钱，而是决定哪些钱必须先花。', eyebrow: '预算决策' },
      { type: 'interaction', id: 'finance-budget' },
      { type: 'paragraph', text: '企业做预算时，会估计收入、必要成本、增长投入和应急资金。好的预算既要支持增长，也要保证安全。' },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：服装品牌新品上市怎么分配预算',
        body: '品牌有100万元新品预算，要分给产品设计、面料采购、社交媒体广告、快闪店和库存储备。广告太少，消费者可能根本不知道新品；库存太多，卖不掉会占用现金；产品投入太少，质量和复购又可能受影响。',
      },
      { type: 'block', kind: 'definition', title: '预算的本质', body: '预算不是限制想法，而是把想做的事变成具体数字和优先级。' },
    ],
  },
  {
    id: 'finance-tradeoff',
    title: '金融取舍',
    role: '很少有完美答案',
    content: [
      { type: 'heading', title: '金融决策很多时候不是简单的对错，而是在不同代价之间做选择。', eyebrow: '金融取舍' },
      { type: 'interaction', id: 'finance-tradeoff' },
      { type: 'paragraph', text: '多借钱，扩张可能更快，但还款压力更大。多留现金，公司更安全，但可能错过机会。找投资人入股，现金压力小一些，但控制权会被稀释。' },
      {
        type: 'block',
        kind: 'example',
        title: '企业案例：航空公司扩张航线怎么选',
        body: '航空公司想增加国际航线，可以买新飞机、租飞机，或者先提高现有航班频次。买飞机可能长期更划算，但前期资金压力很大；租飞机更灵活，但长期租金可能更高；增加班次风险较小，但增长空间有限。',
      },
    ],
  },
  {
    id: 'finance-summary',
    title: '本章总结',
    role: '把金融串起来',
    content: [
      { type: 'heading', title: '学完这一章，你至少要记住：金融是在安排资金、时间和风险。', eyebrow: '本章总结' },
      { type: 'interaction', id: 'finance-summary' },
      { type: 'paragraph', text: '资金从闲置者流向需要资金的人和企业，现金流决定企业能不能撑住，时间价值让同一笔钱在不同时间产生不同含义，风险收益和资本成本决定一个项目是否值得做。' },
    ],
  },
]

const MARKETING_SECTIONS = [
  {
    id: 'marketing-start',
    title: '开始学习',
    role: '营销不是吆喝',
    content: [
      { type: 'paragraph', text: '营销不是把产品硬推给所有人。真正的营销，是先想清楚谁会需要你，再把产品、价格、渠道和推广都对准这群人。' },
      { type: 'block', kind: 'example', title: '本章主线', body: '先用 STP 定方向，再用 4P 把方向落地。' },
      { type: 'interaction', id: 'marketing-audience-start' },
    ],
  },
  {
    id: 'marketing-definition',
    title: '什么是营销',
    role: '顾客为什么选你',
    content: [
      { type: 'paragraph', text: '营销是在回答：顾客为什么要选你，而不是选别人？营销不只是广告，也不只是销售。它从理解顾客开始，到产品设计、定价、渠道、推广和顾客关系都会涉及。' },
      { type: 'block', kind: 'example', title: '不是只会宣传', body: '广告只是营销的一部分。产品不对、价格不对、渠道不对，广告再多也很难长期有效。' },
      { type: 'block', kind: 'example', title: '不是服务所有人', body: '企业资源有限，通常要先选出最值得服务的顾客群体。' },
      { type: 'block', kind: 'example', title: '商学案例：轻食品牌先判断人群', body: '一家轻食品牌如果只说“我们卖沙拉”，很难打动人。它要先判断顾客是健身人群、写字楼白领，还是想控制体重的学生。不同顾客在意的点不同，后面的菜单、价格、门店和推广也会不同。' },
      { type: 'interaction', id: 'marketing-work-classifier' },
    ],
  },
  {
    id: 'marketing-stp-theory',
    title: 'STP 理论',
    role: '基础战略',
    content: [
      { type: 'paragraph', text: 'STP 是营销的基础战略：先决定方向。它不是一个装饰性理论，而是在帮助企业回答三个关键问题：市场上有哪些人？我们服务谁？我们想在他们心里成为什么？' },
      {
        type: 'block',
        kind: 'table',
        title: 'STP 顺序',
        body: '先分清市场，再选择目标，最后做定位。顺序反过来，广告和产品容易都变成凭感觉。',
        rows: [
          { label: 'S 市场细分', value: '把顾客分成不同群体。' },
          { label: 'T 目标市场', value: '选择最值得服务的人群。' },
          { label: 'P 市场定位', value: '让顾客记住你的独特价值。' },
        ],
      },
      { type: 'interaction', id: 'stp-flow' },
    ],
  },
  {
    id: 'marketing-segmentation',
    title: '市场细分',
    role: 'Segmentation',
    content: [
      { type: 'paragraph', text: '市场细分是把一个大市场，按照顾客差异分成几个更小的群体。这样企业才能更准确地设计产品和传播信息。' },
      {
        type: 'block',
        kind: 'table',
        title: '细分维度',
        body: '细分可以按人口特征、行为特征、心理特征和地理位置展开。重点不是贴标签，而是看购买理由和使用场景有什么差异。',
        rows: [
          { label: '人口特征', value: '年龄、收入、职业、学生或上班族。' },
          { label: '行为特征', value: '购买频率、使用场景、价格敏感度。' },
          { label: '心理特征', value: '生活方式、兴趣、价值观。' },
          { label: '地理位置', value: '学校、社区、商圈、城市。' },
        ],
      },
      { type: 'block', kind: 'example', title: '商学案例：运动饮料的人群差异', body: '运动饮料品牌不能只说“卖给喝饮料的人”。专业运动者在意电解质和恢复，学生更看重口味和价格，健身用户关心低糖和成分，电竞用户可能在意提神和联名包装。买的都是饮料，但购买理由完全不同。' },
      { type: 'interaction', id: 'segmentation-tags' },
    ],
  },
  {
    id: 'marketing-targeting',
    title: '目标市场',
    role: 'Targeting',
    content: [
      { type: 'paragraph', text: '企业资源有限，不可能同时服务所有顾客。目标市场选择要看市场吸引力，也要看企业自己有没有能力做好。' },
      {
        type: 'block',
        kind: 'table',
        title: '目标市场判断',
        body: '选择目标市场时，要同时看人群够不够大、是否愿意付钱、竞争强不强，以及企业是否能持续服务。',
        rows: [
          { label: '市场规模', value: '人群够不够大。' },
          { label: '支付意愿', value: '顾客是否愿意付钱。' },
          { label: '竞争强度', value: '进入这个市场难不难。' },
          { label: '企业匹配度', value: '企业能力是否适合服务这群人。' },
        ],
      },
      { type: 'block', kind: 'example', title: '商学案例：低糖茶饮先服务谁', body: '低糖茶饮品牌如果资金有限，可能不会先去服务“所有爱喝饮料的人”。它可能优先考虑写字楼白领和健身人群，因为他们对低糖、品质和便利更敏感，也更可能为健康属性付费。' },
      { type: 'interaction', id: 'target-score' },
    ],
  },
  {
    id: 'marketing-positioning',
    title: '市场定位',
    role: 'Positioning',
    content: [
      { type: 'paragraph', text: '定位不是企业说“我很好”，而是让顾客清楚知道：你和别人有什么不同，你适合解决什么问题。' },
      {
        type: 'block',
        kind: 'table',
        title: '定位要回答的事',
        body: '一个定位至少要说清目标人群、使用场景和核心差异。',
        rows: [
          { label: '人群定位', value: '专为学生、白领、健身人群。' },
          { label: '场景定位', value: '适合通勤、办公、学习、运动后。' },
          { label: '价格定位', value: '平价、大众、中高端、高端。' },
          { label: '功能定位', value: '更健康、更方便、更专业。' },
        ],
      },
      { type: 'block', kind: 'example', title: '商学案例：咖啡品牌的定位差异', body: '同样是咖啡，便利型品牌强调“上班路上快速买到”，精品咖啡强调“更好的豆子和空间体验”，平价品牌强调“每天都能喝得起”。定位不同，产品、门店和传播都会不同。' },
      { type: 'interaction', id: 'positioning' },
    ],
  },
  {
    id: 'marketing-4p',
    title: '4P 营销组合',
    role: '战术执行',
    content: [
      { type: 'paragraph', text: '如果 STP 是方向，4P 就是把方向做出来。4P 是产品、价格、渠道和推广。它们不是四个独立动作，而是同一套营销方向的具体执行。' },
      {
        type: 'block',
        kind: 'table',
        title: '4P 营销组合',
        body: '先做 STP 决定“对谁说什么”，再用 4P 决定“怎么做出来”。',
        rows: [
          { label: 'Product 产品', value: '提供什么价值。' },
          { label: 'Price 价格', value: '顾客愿意付多少钱。' },
          { label: 'Place 渠道', value: '顾客在哪里可以买到。' },
          { label: 'Promotion 推广', value: '如何让顾客知道并愿意尝试。' },
        ],
      },
      { type: 'interaction', id: 'stp-4p-map' },
    ],
  },
  {
    id: 'marketing-product',
    title: '产品策略',
    role: 'Product',
    content: [
      { type: 'paragraph', text: '产品不仅是看得见的物品，还包括功能、包装、品牌、服务、售后和整体体验。顾客真正购买的，是这些元素组合起来能解决的问题。' },
      {
        type: 'block',
        kind: 'table',
        title: '产品价值层次',
        body: '产品策略要从目标顾客出发，而不是只列功能。',
        rows: [
          { label: '核心产品', value: '真正解决什么问题。' },
          { label: '实际产品', value: '功能、设计、品质、包装。' },
          { label: '延伸产品', value: '会员、售后、配送、客服。' },
          { label: '产品组合', value: '不同规格、口味、套餐和系列。' },
        ],
      },
      { type: 'block', kind: 'example', title: '商学案例：护肤品牌的产品价值', body: '护肤品牌卖的不只是面霜。敏感肌顾客在意成分安全、测试数据和客服建议；送礼用户在意包装和品牌感；长期用户会关注复购价格和会员权益。产品策略要从目标顾客出发。' },
      { type: 'interaction', id: 'product-value' },
    ],
  },
  {
    id: 'marketing-price',
    title: '价格策略',
    role: 'Price',
    content: [
      { type: 'paragraph', text: '价格会影响顾客对产品的判断。太高可能没人买，太低可能没利润，也可能让顾客怀疑品质。' },
      {
        type: 'block',
        kind: 'table',
        title: '价格不是成本加一点利润',
        body: '定价要同时看成本、竞争对手、定位和顾客感知价值。',
        rows: [
          { label: '成本', value: '产品生产和运营需要多少钱。' },
          { label: '感知价值', value: '顾客觉得它值多少钱。' },
          { label: '竞争价格', value: '类似产品在市场上卖多少。' },
          { label: '品牌定位', value: '平价、大众还是高端。' },
        ],
      },
      { type: 'block', kind: 'example', title: '商学案例：健身房定价', body: '健身房如果定位为高端小班训练，价格太低反而会削弱专业感。如果定位为大众健身，价格过高又会让顾客转向竞争对手。定价要和定位、成本、服务水平一起看。' },
      { type: 'interaction', id: 'price-simulator' },
    ],
  },
  {
    id: 'marketing-place',
    title: '渠道策略',
    role: 'Place',
    content: [
      { type: 'paragraph', text: '渠道不只是“在哪里卖”。它会影响成本、速度、覆盖范围和顾客体验。' },
      {
        type: 'block',
        kind: 'table',
        title: '常见渠道',
        body: '同一种产品进入不同渠道，会改变成本结构、用户体验和商业模型。',
        rows: [
          { label: '线下门店', value: '体验强，但租金和人员成本高。' },
          { label: '电商平台', value: '覆盖广，但竞争激烈。' },
          { label: '外卖平台', value: '方便即时消费，但有佣金。' },
          { label: '社群/团购', value: '精准触达，但运营要求高。' },
        ],
      },
      { type: 'block', kind: 'example', title: '商学案例：早餐品牌渠道选择', body: '早餐品牌服务上班族时，地铁口门店很方便但租金高；外卖平台覆盖广但平台抽佣高；写字楼团购订单稳定，但需要提前组织。渠道选择会直接影响商业模型。' },
      { type: 'interaction', id: 'channel-matcher' },
    ],
  },
  {
    id: 'marketing-promotion',
    title: '推广策略',
    role: 'Promotion',
    content: [
      { type: 'paragraph', text: '推广不是把声音做大，而是把正确的信息放到正确的人面前。它要和目标人群、定位和渠道配合，否则广告再多也很难长期有效。' },
      {
        type: 'block',
        kind: 'table',
        title: '推广方式',
        body: '推广要解决“合适的人为什么知道、相信并愿意试一次”的问题。',
        rows: [
          { label: '内容种草', value: '适合需要解释价值的产品。' },
          { label: 'KOL/KOC 推荐', value: '通过可信的人影响顾客。' },
          { label: '促销活动', value: '降低第一次尝试门槛。' },
          { label: '会员运营', value: '提高复购和长期关系。' },
        ],
      },
      { type: 'block', kind: 'example', title: '商学案例：轻食品牌的推广匹配', body: '轻食品牌想吸引健身人群，路边发传单不一定精准。更好的方法可能是和健身房合作、找本地教练试吃、发布低卡搭配内容，并推出训练后套餐。' },
      { type: 'interaction', id: 'promotion-matcher' },
    ],
  },
  {
    id: 'marketing-stp-4p-integration',
    title: 'STP与4P整合',
    role: '战略和执行一致',
    content: [
      { type: 'paragraph', text: '好营销，是战略和执行一致。如果定位是高端精品，但价格很低、包装很普通、渠道在低价批发市场，顾客会觉得不一致。STP 和 4P 要互相支持。' },
      { type: 'block', kind: 'example', title: '商学案例：白领低糖茶饮的一致性', body: '如果品牌定位是“面向年轻白领的低糖高品质茶饮”，产品应标注热量和成分，价格可以中等偏上，渠道应靠近写字楼和外卖平台，推广适合做午餐团购和健康生活内容。' },
      { type: 'block', kind: 'example', title: '一致性提醒', body: '一致性越强，顾客越容易理解你。执行越混乱，品牌印象越模糊。' },
      { type: 'interaction', id: 'consistency-checker' },
    ],
  },
  {
    id: 'marketing-brand-relationship',
    title: '品牌与顾客关系',
    role: '长期价值',
    content: [
      { type: 'paragraph', text: '营销不只是卖出一次，还要让顾客愿意回来。品牌不是 logo，也不是一句口号。品牌是顾客长期形成的印象。顾客关系管理关注第一次购买、复购、推荐、反馈和长期信任。' },
      {
        type: 'block',
        kind: 'table',
        title: '顾客关系链',
        body: '从第一次知道品牌，到购买、体验、复购和推荐，每一步都会影响长期价值。',
        rows: [
          { label: '第一次购买', value: '降低尝试门槛。' },
          { label: '使用体验', value: '产品和服务是否符合预期。' },
          { label: '复购', value: '会员、优惠和稳定品质。' },
          { label: '推荐', value: '顾客愿不愿意介绍给别人。' },
        ],
      },
      { type: 'block', kind: 'example', title: '商学案例：咖啡品牌的复购', body: '咖啡品牌开业折扣能带来第一批顾客，但复购取决于咖啡是否稳定、等待时间是否合理、店员服务是否舒服、会员积分是否有吸引力。一次购买靠促销，长期关系靠体验。' },
      { type: 'interaction', id: 'customer-journey' },
    ],
  },
  {
    id: 'marketing-summary',
    title: '本章总结',
    role: '创造顾客价值',
    content: [
      { type: 'paragraph', text: '市场营销看的是：如何创造、传递和维护顾客价值。先做战略：细分市场，选择目标顾客，确定品牌定位；再用产品、价格、渠道和推广把战略做出来。' },
      { type: 'interaction', id: 'summary-map' },
    ],
  },
]

const BUSINESS_SECTIONS_BY_MAJOR = {
  'econ-u': ECON_SECTIONS,
  'finance-u': FINANCE_SECTIONS,
  'marketing-u': MARKETING_SECTIONS,
}

export function getBusinessSections(majorId) {
  return BUSINESS_SECTIONS_BY_MAJOR[majorId] || []
}
