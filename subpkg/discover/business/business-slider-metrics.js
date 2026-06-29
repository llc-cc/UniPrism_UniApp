const MARGINAL_GAINS = [28, 56, 76, 90, 100, 107, 112, 115]

export function computeSliderMetrics(metricsFn, value) {
  switch (metricsFn) {
    case 'econ-marginal': {
      const hours = value
      const totalGain = MARGINAL_GAINS[hours - 1]
      const extraGain = hours === 1 ? MARGINAL_GAINS[0] : MARGINAL_GAINS[hours - 1] - MARGINAL_GAINS[hours - 2]
      const advice = extraGain >= 12 ? '值得' : extraGain >= 6 ? '一般' : '该休息'
      return [
        ['总效果', `${totalGain}%`],
        ['新增效果', `${extraGain}%`],
        ['判断', advice],
      ]
    }
    case 'econ-scale': {
      const monthlyQty = value * 1000
      const fixedShare = Number((26000 / monthlyQty).toFixed(1))
      const avgCost = Number((fixedShare + 10).toFixed(1))
      const scaleHint = value <= 2 ? '成本偏高' : value <= 5 ? '开始改善' : value <= 8 ? '规模优势明显' : '接近稳定'
      return [
        ['平均成本/杯', `${avgCost}元`],
        ['固定成本分摊', `${fixedShare}元`],
        ['经营含义', scaleHint],
      ]
    }
    case 'econ-demand': {
      const buyers = Math.max(20, Math.round(180 - value * 4.2))
      return [
        ['愿意购买人数', `${buyers}人`],
        ['价格水平', value >= 28 ? '偏高' : value >= 18 ? '中等' : '偏低'],
        ['需求趋势', '价格越高，需求越少'],
      ]
    }
    case 'econ-supply': {
      const supply = Math.min(120, Math.round(20 + value * 3.2))
      return [
        ['愿意供给数量', `${supply}杯`],
        ['价格水平', value >= 28 ? '偏高' : value >= 18 ? '中等' : '偏低'],
        ['供给趋势', '价格越高，供给越多'],
      ]
    }
    case 'econ-equilibrium': {
      const demand = Math.max(20, Math.round(180 - value * 4.2))
      const supply = Math.min(120, Math.round(20 + value * 3.2))
      const gap = supply - demand
      const state = Math.abs(gap) <= 8 ? '接近均衡' : gap > 0 ? '供给过剩' : '需求过剩（短缺）'
      return [
        ['需求量', `${demand}杯`],
        ['供给量', `${supply}杯`],
        ['市场状态', state],
      ]
    }
    case 'econ-ticket-scarcity': {
      const seats = 10000
      const demandPeople = value * 10000
      const gap = demandPeople - seats
      const pressure = gap <= 0 ? '无缺口' : gap <= 20000 ? '轻微涨价压力' : gap <= 50000 ? '明显涨价压力' : '强烈涨价压力'
      return [
        ['座位数', `${seats}`],
        ['需求人数', `${demandPeople}`],
        ['价格压力', pressure],
      ]
    }
    case 'marketing-target-score': {
      return []
    }
    default:
      return []
  }
}

export function computeMarketingTargetScore(values, config) {
  const { size = 0, pay = 0, comp = 0, fit = 0 } = values
  const score = size + pay + (10 - comp) + fit
  const { thresholds, results } = config
  let result = results.low
  if (score >= thresholds.high) result = results.high
  else if (score >= thresholds.medium) result = results.medium
  return {
    score,
    result,
    metrics: [
      ['综合得分', `${score}/40`],
      ['市场规模', `${size}/10`],
      ['支付意愿', `${pay}/10`],
      ['企业匹配', `${fit}/10`],
    ],
  }
}
