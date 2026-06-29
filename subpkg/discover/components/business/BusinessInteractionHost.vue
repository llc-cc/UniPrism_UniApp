<template>
  <view v-if="interaction" class="interaction-shell">
    <view class="interaction-head">
      <text class="interaction-title">{{ interaction.title }}</text>
      <text v-if="interaction.subtitle" class="interaction-sub">{{ interaction.subtitle }}</text>
    </view>

    <!-- flow-steps / stp-flow / finance-flow -->
    <view v-if="isStepFlow" class="flow-list">
      <view
        v-for="(step, idx) in interaction.steps"
        :key="step.title || step.key"
        class="flow-step"
        :class="{ 'flow-step--on': idx <= flowIndex }"
      >
        <view class="flow-step-top">
          <text class="flow-step-index">{{ step.key || idx + 1 }}</text>
          <view class="flow-step-copy">
            <text class="flow-step-title">{{ step.title }}</text>
            <text v-if="step.en" class="flow-step-en">{{ step.en }}</text>
          </view>
        </view>
        <text class="flow-step-body">{{ step.body }}</text>
        <text v-if="idx <= flowIndex && step.result" class="flow-step-result">{{ step.result }}</text>
        <text class="flow-step-state">{{ idx <= flowIndex ? '已达成' : '待解锁' }}</text>
      </view>
      <view class="flow-actions">
        <button class="flow-btn" :style="{ background: accent }" @tap="advanceFlow">看下一步</button>
        <button class="flow-btn flow-btn-ghost" @tap="resetFlow">重来</button>
      </view>
    </view>

    <!-- choice-cards -->
    <view v-else-if="interaction.type === 'choice-cards'" class="choice-layout">
      <view class="choice-grid">
        <view
          v-for="(choice, idx) in interaction.choices"
          :key="choice.title"
          class="choice-card"
          :class="{ 'choice-card--active': selectedChoice === idx }"
          @tap="selectedChoice = idx"
        >
          <text class="choice-card-title">{{ choice.title }}</text>
          <text class="choice-card-body">{{ choice.body }}</text>
        </view>
      </view>
      <view v-if="activeChoice" class="choice-result">
        <text class="choice-result-label">{{ interaction.resultLabel || '结果' }}</text>
        <view v-if="interaction.withRisk" class="choice-risk-row">
          <text class="choice-risk-tag">风险 {{ activeChoice.risk }}</text>
          <text class="choice-risk-tag">预期 {{ activeChoice.expectedReturn }}</text>
        </view>
        <text v-if="activeChoice.cost" class="choice-cost">放弃：{{ activeChoice.cost }}</text>
        <text class="choice-result-text">{{ activeChoice.result }}</text>
      </view>
    </view>

    <!-- slider -->
    <view v-else-if="interaction.type === 'slider'" class="slider-panel">
      <text class="slider-label">{{ sliderLabel }}</text>
      <slider
        :min="interaction.min"
        :max="interaction.max"
        :step="interaction.step || 1"
        :value="sliderValue"
        :active-color="accent"
        @change="onSliderChange"
        @changing="onSliderChanging"
      />
      <view class="metric-grid">
        <view v-for="(metric, idx) in sliderMetrics" :key="idx" class="metric-item">
          <text class="metric-label">{{ metric[0] }}</text>
          <text class="metric-value">{{ metric[1] }}</text>
        </view>
      </view>
      <text v-if="interaction.caption" class="slider-caption">{{ interaction.caption }}</text>
    </view>

    <!-- compare-columns -->
    <view v-else-if="interaction.type === 'compare-columns'" class="compare-columns">
      <view class="compare-col">
        <text class="compare-col-title">{{ interaction.left.title }}</text>
        <text v-for="(line, idx) in interaction.left.items" :key="idx" class="compare-col-item">{{ line }}</text>
      </view>
      <view class="compare-col">
        <text class="compare-col-title">{{ interaction.right.title }}</text>
        <text v-for="(line, idx) in interaction.right.items" :key="idx" class="compare-col-item">{{ line }}</text>
      </view>
    </view>

    <!-- concept-map / summary-map / static-cards -->
    <view v-else-if="interaction.type === 'concept-map' || interaction.type === 'summary-map'" class="map-grid">
      <view v-for="item in interaction.items" :key="item.label" class="map-card">
        <text class="map-label">{{ item.label }}</text>
        <text class="map-value">{{ item.value }}</text>
      </view>
    </view>

    <view v-else-if="interaction.type === 'static-cards'" class="static-grid">
      <view v-for="card in interaction.cards" :key="card.title" class="static-card">
        <text class="static-title">{{ card.title }}</text>
        <text class="static-body">{{ card.body }}</text>
      </view>
      <view v-if="interaction.bullets && interaction.bullets.length" class="static-bullets">
        <text v-for="(line, idx) in interaction.bullets" :key="idx" class="static-bullet">· {{ line }}</text>
      </view>
    </view>

    <!-- finance-cash-flow -->
    <view v-else-if="interaction.type === 'finance-cash-flow'" class="finance-sim">
      <view class="finance-controls">
        <text class="finance-control-label">本月收款 {{ financeSales }} 万</text>
        <slider :min="interaction.salesMin" :max="interaction.salesMax" :value="financeSales" :active-color="accent" @changing="e => financeSales = e.detail.value" @change="e => financeSales = e.detail.value" />
        <text class="finance-control-label">本月支出 {{ financeCost }} 万</text>
        <slider :min="interaction.costMin" :max="interaction.costMax" :value="financeCost" :active-color="accent" @changing="e => financeCost = e.detail.value" @change="e => financeCost = e.detail.value" />
      </view>
      <view class="metric-grid">
        <view class="metric-item"><text class="metric-label">期初现金</text><text class="metric-value">{{ interaction.beginCash }}万</text></view>
        <view class="metric-item"><text class="metric-label">净现金流</text><text class="metric-value">{{ financeNet }}万</text></view>
        <view class="metric-item"><text class="metric-label">期末现金</text><text class="metric-value">{{ financeEnd }}万</text></view>
      </view>
      <text class="slider-caption">{{ interaction.caption }}</text>
    </view>

    <!-- finance-time-value -->
    <view v-else-if="interaction.type === 'finance-time-value'" class="finance-sim">
      <text class="finance-control-label">本金 {{ financePrincipal }} 元</text>
      <slider :min="interaction.principalMin" :max="interaction.principalMax" :step="100" :value="financePrincipal" :active-color="accent" @changing="e => financePrincipal = e.detail.value" @change="e => financePrincipal = e.detail.value" />
      <text class="finance-control-label">年利率 {{ financeRate }}%</text>
      <slider :min="interaction.rateMin" :max="interaction.rateMax" :value="financeRate" :active-color="accent" @changing="e => financeRate = e.detail.value" @change="e => financeRate = e.detail.value" />
      <text class="finance-control-label">年数 {{ financeYears }} 年</text>
      <slider :min="interaction.yearsMin" :max="interaction.yearsMax" :value="financeYears" :active-color="accent" @changing="e => financeYears = e.detail.value" @change="e => financeYears = e.detail.value" />
      <view class="metric-grid">
        <view class="metric-item"><text class="metric-label">未来价值</text><text class="metric-value">{{ financeFutureValue }}元</text></view>
      </view>
      <text class="slider-caption">{{ interaction.caption }}</text>
    </view>

    <!-- finance-compound -->
    <view v-else-if="interaction.type === 'finance-compound'" class="finance-sim">
      <text class="finance-control-label">年限 {{ financeYears }} 年</text>
      <slider :min="interaction.yearsMin" :max="interaction.yearsMax" :value="financeYears" :active-color="accent" @changing="e => financeYears = e.detail.value" @change="e => financeYears = e.detail.value" />
      <view class="metric-grid">
        <view class="metric-item"><text class="metric-label">单利</text><text class="metric-value">{{ financeSimple }}元</text></view>
        <view class="metric-item"><text class="metric-label">复利</text><text class="metric-value">{{ financeCompound }}元</text></view>
        <view class="metric-item"><text class="metric-label">差距</text><text class="metric-value">{{ financeCompoundGap }}元</text></view>
      </view>
      <text class="slider-caption">{{ interaction.caption }}</text>
    </view>

    <!-- finance-capital-cost -->
    <view v-else-if="interaction.type === 'finance-capital-cost'" class="finance-sim">
      <text class="finance-control-label">项目回报率 {{ capitalRet }}%</text>
      <slider :min="interaction.retMin" :max="interaction.retMax" :value="capitalRet" :active-color="accent" @changing="e => capitalRet = e.detail.value" @change="e => capitalRet = e.detail.value" />
      <text class="finance-control-label">资本成本 {{ capitalCost }}%</text>
      <slider :min="interaction.costMin" :max="interaction.costMax" :value="capitalCost" :active-color="accent" @changing="e => capitalCost = e.detail.value" @change="e => capitalCost = e.detail.value" />
      <view class="capital-bars">
        <view class="capital-bar capital-bar--return" :style="{ width: `${capitalRet * 3}%` }"><text>回报 {{ capitalRet }}%</text></view>
        <view class="capital-bar capital-bar--cost" :style="{ width: `${capitalCost * 3}%` }"><text>成本 {{ capitalCost }}%</text></view>
      </view>
      <text class="choice-result-text">{{ capitalVerdict }}</text>
      <text class="slider-caption">{{ interaction.caption }}</text>
    </view>

    <!-- finance-budget -->
    <view v-else-if="interaction.type === 'finance-budget'" class="finance-sim">
      <view v-for="cat in interaction.categories" :key="cat.key" class="budget-row">
        <text class="finance-control-label">{{ cat.label }} {{ budgetValues[cat.key] }} 万</text>
        <slider :min="cat.min" :max="cat.max" :value="budgetValues[cat.key]" :active-color="accent" @changing="e => setBudget(cat.key, e.detail.value)" @change="e => setBudget(cat.key, e.detail.value)" />
        <text v-if="cat.warningLow && budgetValues[cat.key] < 15" class="budget-warn">{{ cat.warningLow }}</text>
      </view>
      <view class="metric-grid">
        <view class="metric-item"><text class="metric-label">已分配</text><text class="metric-value">{{ budgetUsed }}万</text></view>
        <view class="metric-item"><text class="metric-label">剩余现金</text><text class="metric-value">{{ budgetRemain }}万</text></view>
      </view>
    </view>

    <!-- finance-summary -->
    <view v-else-if="interaction.type === 'finance-summary'" class="map-grid">
      <view v-for="item in interaction.items" :key="item.label" class="map-card">
        <text class="map-label">{{ item.label }}</text>
        <text class="map-value">{{ item.value }}</text>
      </view>
      <text v-if="interaction.quote" class="content-quote-text">{{ interaction.quote }}</text>
    </view>

    <!-- marketing-work-classifier -->
    <view v-else-if="interaction.type === 'marketing-work-classifier'" class="choice-layout">
      <view class="choice-grid">
        <view
          v-for="(choice, idx) in interaction.choices"
          :key="choice.title"
          class="choice-card"
          :class="{ 'choice-card--active': selectedChoice === idx }"
          @tap="selectedChoice = idx"
        >
          <text class="choice-card-title">{{ choice.title }}</text>
          <text class="choice-card-body">{{ choice.body }}</text>
        </view>
      </view>
      <view v-if="activeChoice" class="choice-result">
        <text class="choice-result-text">{{ activeChoice.result }}</text>
        <text class="choice-cost">输出：{{ activeChoice.output }}</text>
      </view>
    </view>

    <!-- segmentation-tags -->
    <view v-else-if="interaction.type === 'segmentation-tags'" class="tag-layout">
      <view class="tag-grid">
        <view
          v-for="(item, idx) in interaction.items"
          :key="item.title"
          class="tag-chip"
          :class="{ 'tag-chip--active': selectedChoice === idx }"
          :style="selectedChoice === idx ? { background: accent, borderColor: accent } : {}"
          @tap="selectedChoice = idx"
        >{{ item.title }}</view>
      </view>
      <text v-if="activeTag" class="choice-result-text">{{ activeTag.result }}</text>
    </view>

    <!-- target-score -->
    <view v-else-if="interaction.type === 'target-score'" class="finance-sim">
      <view v-for="factor in interaction.factors" :key="factor.key" class="budget-row">
        <text class="finance-control-label">{{ factor.label }} {{ targetValues[factor.key] }}/10</text>
        <slider :min="interaction.min" :max="interaction.max" :value="targetValues[factor.key]" :active-color="accent" @changing="e => setTarget(factor.key, e.detail.value)" @change="e => setTarget(factor.key, e.detail.value)" />
      </view>
      <view class="metric-grid">
        <view v-for="(metric, idx) in targetMetrics" :key="idx" class="metric-item">
          <text class="metric-label">{{ metric[0] }}</text>
          <text class="metric-value">{{ metric[1] }}</text>
        </view>
      </view>
      <text class="choice-result-text">{{ targetResult }}</text>
    </view>

    <!-- positioning -->
    <view v-else-if="interaction.type === 'positioning'" class="positioning-panel">
      <view v-for="field in interaction.fields" :key="field.key" class="position-field">
        <text class="position-label">{{ field.label }}</text>
        <scroll-view scroll-x class="position-options">
          <view
            v-for="opt in field.options"
            :key="opt"
            class="position-opt"
            :class="{ 'position-opt--active': positioningValues[field.key] === opt }"
            @tap="positioningValues[field.key] = opt"
          >{{ opt }}</view>
        </scroll-view>
      </view>
      <view class="choice-result">
        <text class="choice-result-label">定位语</text>
        <text class="choice-result-text">{{ positioningStatement }}</text>
      </view>
    </view>

    <!-- stp-4p-map -->
    <view v-else-if="interaction.type === 'stp-4p-map'" class="choice-layout">
      <view class="choice-grid">
        <view
          v-for="(state, idx) in interaction.states"
          :key="state.title"
          class="choice-card"
          :class="{ 'choice-card--active': selectedChoice === idx }"
          @tap="selectedChoice = idx"
        >
          <text class="choice-card-title">{{ state.title }}</text>
          <text class="choice-card-body">{{ state.body }}</text>
        </view>
      </view>
      <view v-if="activeStpState" class="choice-result">
        <text class="choice-result-label">联动的 4P</text>
        <text v-for="target in activeStpState.targets" :key="target" class="static-bullet">· {{ target }}</text>
      </view>
      <view class="static-grid">
        <view v-for="item in interaction.fourP" :key="item.title" class="static-card">
          <text class="static-title">{{ item.title }}</text>
          <text class="static-body">{{ item.body }}</text>
        </view>
      </view>
    </view>

    <!-- promotion-matcher -->
    <view v-else-if="interaction.type === 'promotion-matcher'" class="choice-layout">
      <view class="static-grid">
        <view v-for="obj in interaction.objectives" :key="obj.title" class="static-card">
          <text class="static-title">{{ obj.title }}</text>
          <text class="static-body">{{ obj.body }}</text>
        </view>
      </view>
      <view class="choice-grid">
        <view
          v-for="(tool, idx) in interaction.tools"
          :key="tool.title"
          class="choice-card"
          :class="{ 'choice-card--active': selectedChoice === idx }"
          @tap="selectedChoice = idx"
        >
          <text class="choice-card-title">{{ tool.title }}</text>
          <text class="choice-card-body">{{ tool.body }}</text>
        </view>
      </view>
      <view v-if="activePromotionTool" class="choice-result">
        <text class="choice-result-text">{{ activePromotionTool.result }}</text>
      </view>
    </view>

    <!-- summary-map -->
    <view v-else-if="interaction.type === 'summary-map'" class="map-grid">
      <view v-for="node in summaryNodes" :key="node.title" class="map-card">
        <text class="map-label">{{ node.title }}</text>
        <text class="map-value">{{ node.body }}</text>
      </view>
    </view>

    <!-- channel-matcher / product-value / consistency-checker / customer-journey -->
    <view v-else-if="hasSelectableItems" class="choice-layout">
      <view class="choice-grid">
        <view
          v-for="(item, idx) in selectableItems"
          :key="item.title || item.label"
          class="choice-card"
          :class="{ 'choice-card--active': selectedChoice === idx }"
          @tap="selectedChoice = idx"
        >
          <text class="choice-card-title">{{ item.title || item.label }}</text>
          <text class="choice-card-body">{{ item.body || item.desc }}</text>
        </view>
      </view>
      <view v-if="activeSelectable" class="choice-result">
        <text v-if="activeSelectable.steps && activeSelectable.steps.length" class="choice-result-label">推荐路径</text>
        <text v-for="step in (activeSelectable.steps || [])" :key="step" class="static-bullet">· {{ step }}</text>
        <text v-if="activeSelectable.passCount !== undefined" class="choice-cost">一致性 {{ activeSelectable.passCount }}/4</text>
        <text class="choice-result-text">{{ activeSelectable.result || activeSelectable.tip || activeSelectable.body || activeSelectable.takeaway }}</text>
      </view>
    </view>

    <!-- price-simulator -->
    <view v-else-if="interaction.type === 'price-simulator'" class="finance-sim">
      <text class="finance-control-label">成本 {{ priceCost }} 元</text>
      <slider :min="interaction.min.cost" :max="interaction.max.cost" :value="priceCost" :active-color="accent" @changing="e => priceCost = e.detail.value" @change="e => priceCost = e.detail.value" />
      <text class="finance-control-label">感知价值 {{ priceValueSense }} 元</text>
      <slider :min="interaction.min.value" :max="interaction.max.value" :value="priceValueSense" :active-color="accent" @changing="e => priceValueSense = e.detail.value" @change="e => priceValueSense = e.detail.value" />
      <text class="finance-control-label">定价 {{ priceValue }} 元</text>
      <slider :min="interaction.min.price" :max="interaction.max.price" :value="priceValue" :active-color="accent" @changing="e => priceValue = e.detail.value" @change="e => priceValue = e.detail.value" />
      <view class="metric-grid">
        <view class="metric-item"><text class="metric-label">利润</text><text class="metric-value">{{ priceValue - priceCost }}元</text></view>
        <view class="metric-item"><text class="metric-label">价格区间</text><text class="metric-value">{{ priceVerdict }}</text></view>
      </view>
      <text class="choice-result-text">{{ priceSimulatorResult }}</text>
    </view>
  </view>
</template>

<script>
import { BUSINESS_INTERACTIONS } from '../../business/business-college-interactions'
import { computeSliderMetrics, computeMarketingTargetScore } from '../../business/business-slider-metrics'

export default {
  name: 'BusinessInteractionHost',
  props: {
    interactionId: { type: String, required: true },
    accent: { type: String, default: '#f3a43b' },
  },
  data() {
    return {
      flowIndex: 0,
      selectedChoice: 0,
      sliderValue: 5,
      financeSales: 80,
      financeCost: 70,
      financePrincipal: 5000,
      financeRate: 5,
      financeYears: 3,
      capitalRet: 12,
      capitalCost: 8,
      budgetValues: {},
      targetValues: {},
      positioningValues: {},
      priceValue: 39,
      priceCost: 18,
      priceValueSense: 32,
    }
  },
  computed: {
    interaction() {
      return BUSINESS_INTERACTIONS[this.interactionId] || null
    },
    isStepFlow() {
      const t = this.interaction?.type
      return t === 'flow-steps' || t === 'stp-flow' || t === 'finance-flow'
    },
    activeChoice() {
      const choices = this.interaction?.choices
      return choices?.[this.selectedChoice] || null
    },
    activeTag() {
      return this.interaction?.items?.[this.selectedChoice] || null
    },
    sliderLabel() {
      const tpl = this.interaction?.labelTemplate || '当前值：{value}'
      return tpl.replace('{value}', this.sliderValue)
    },
    sliderMetrics() {
      if (!this.interaction?.metricsFn) return []
      return computeSliderMetrics(this.interaction.metricsFn, this.sliderValue)
    },
    financeNet() {
      return this.financeSales - this.financeCost
    },
    financeEnd() {
      return this.interaction?.beginCash + this.financeNet
    },
    financeFutureValue() {
      const p = this.financePrincipal
      const r = this.financeRate / 100
      const t = this.financeYears
      return Math.round(p * Math.pow(1 + r, t))
    },
    financeSimple() {
      const p = this.interaction?.principal || 1000
      const r = this.interaction?.rate || 0.05
      const t = this.financeYears
      return Math.round(p * (1 + r * t))
    },
    financeCompound() {
      const p = this.interaction?.principal || 1000
      const r = this.interaction?.rate || 0.05
      const t = this.financeYears
      return Math.round(p * Math.pow(1 + r, t))
    },
    financeCompoundGap() {
      return this.financeCompound - this.financeSimple
    },
    capitalVerdict() {
      return this.capitalRet > this.capitalCost ? '项目回报高于资本成本，更值得投资。' : '项目回报没有覆盖资本成本，需要谨慎。'
    },
    budgetUsed() {
      return Object.values(this.budgetValues).reduce((sum, v) => sum + Number(v || 0), 0)
    },
    budgetRemain() {
      return (this.interaction?.totalBudget || 100) - this.budgetUsed
    },
    targetMetrics() {
      if (this.interaction?.type !== 'target-score') return []
      return computeMarketingTargetScore(this.targetValues, this.interaction).metrics
    },
    targetResult() {
      if (this.interaction?.type !== 'target-score') return ''
      return computeMarketingTargetScore(this.targetValues, this.interaction).result
    },
    positioningStatement() {
      const audience = this.positioningValues.audience || ''
      const need = this.positioningValues.need || ''
      const diff = this.positioningValues.diff || ''
      if (!audience && !need && !diff) return '请选择人群、需求和差异点。'
      return `为${audience}提供${need}，因为我们${diff}。`
    },
    priceVerdict() {
      if (this.priceValue < this.priceCost) return '亏损区'
      if (this.priceValue > this.priceValueSense) return '阻力区'
      return '合理区'
    },
    priceSimulatorResult() {
      const results = this.interaction?.results
      if (!results) return ''
      if (this.priceValue < this.priceCost) return results.belowCost
      if (this.priceValue > this.priceValueSense) return results.aboveValue
      if (this.priceValue <= this.priceCost + 3) return results.lowPrice
      return results.balanced
    },
    activeStpState() {
      return this.interaction?.states?.[this.selectedChoice] || null
    },
    activePromotionTool() {
      return this.interaction?.tools?.[this.selectedChoice] || null
    },
    hasSelectableItems() {
      const t = this.interaction?.type
      return ['product-value', 'channel-matcher', 'consistency-checker', 'customer-journey'].includes(t)
    },
    selectableItems() {
      if (!this.hasSelectableItems) return []
      return this.interaction.items || this.interaction.steps || this.interaction.choices || []
    },
    summaryNodes() {
      if (this.interaction?.type !== 'summary-map') return []
      return this.interaction.nodes || []
    },
    activeSelectable() {
      return this.selectableItems[this.selectedChoice] || null
    },
  },
  watch: {
    interaction: {
      immediate: true,
      handler(next) {
        if (!next) return
        if (next.type === 'slider') this.sliderValue = next.defaultValue ?? next.min ?? 1
        if (next.type === 'finance-cash-flow') {
          this.financeSales = 80
          this.financeCost = 70
        }
        if (next.type === 'finance-time-value') {
          this.financePrincipal = 5000
          this.financeRate = 5
          this.financeYears = 3
        }
        if (next.type === 'finance-compound') this.financeYears = 5
        if (next.type === 'finance-budget' && next.categories) {
          const values = {}
          next.categories.forEach((cat) => { values[cat.key] = cat.defaultValue ?? 0 })
          this.budgetValues = values
        }
        if (next.type === 'target-score' && next.defaultValues) {
          this.targetValues = { ...next.defaultValues }
        }
        if (next.type === 'positioning' && next.fields) {
          const values = {}
          next.fields.forEach((field) => { values[field.key] = field.defaultValue || field.options?.[0] || '' })
          this.positioningValues = values
        }
        if (next.type === 'price-simulator') {
          const defaults = next.defaultValues || {}
          this.priceCost = defaults.cost ?? 18
          this.priceValueSense = defaults.value ?? 32
          this.priceValue = defaults.price ?? 29
        }
        this.flowIndex = 0
        this.selectedChoice = 0
      },
    },
  },
  methods: {
    advanceFlow() {
      const max = (this.interaction?.steps?.length || 1) - 1
      this.flowIndex = Math.min(max, this.flowIndex + 1)
    },
    resetFlow() {
      this.flowIndex = 0
    },
    onSliderChange(e) {
      this.sliderValue = e.detail.value
    },
    onSliderChanging(e) {
      this.sliderValue = e.detail.value
    },
    setBudget(key, value) {
      this.budgetValues = { ...this.budgetValues, [key]: value }
    },
    setTarget(key, value) {
      this.targetValues = { ...this.targetValues, [key]: value }
    },
  },
}
</script>

<style scoped>
.interaction-shell { margin: 16rpx 0; padding: 24rpx; border-radius: 24rpx; background: #ffffff; border: 1rpx solid #e8edf3; box-shadow: 0 8rpx 24rpx rgba(15,23,42,0.04); }
.interaction-head { margin-bottom: 20rpx; }
.interaction-title { display: block; font-size: 28rpx; font-weight: 700; color: #1d1d1f; line-height: 1.4; }
.interaction-sub { display: block; margin-top: 8rpx; font-size: 23rpx; line-height: 1.7; color: #64748b; }
.flow-list { display: flex; flex-direction: column; gap: 16rpx; }
.flow-step { padding: 20rpx; border-radius: 16rpx; background: #f8fafc; opacity: 0.72; }
.flow-step--on { opacity: 1; background: #fff7ed; border: 1rpx solid rgba(243,164,59,0.2); }
.flow-step-top { display: flex; gap: 16rpx; align-items: flex-start; }
.flow-step-index { width: 44rpx; height: 44rpx; border-radius: 50%; background: #1d1d1f; color: #fff; font-size: 22rpx; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.flow-step-title { display: block; font-size: 26rpx; font-weight: 700; color: #1d1d1f; }
.flow-step-en { display: block; font-size: 20rpx; color: #64748b; margin-top: 4rpx; }
.flow-step-body, .flow-step-result { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }
.flow-step-result { color: #0f766e; font-weight: 600; }
.flow-step-state { display: block; margin-top: 8rpx; font-size: 20rpx; color: #94a3b8; }
.flow-actions { display: flex; gap: 16rpx; margin-top: 8rpx; }
.flow-btn { flex: 1; height: 72rpx; line-height: 72rpx; border-radius: 999rpx; color: #fff; font-size: 24rpx; font-weight: 700; border: none; }
.flow-btn-ghost { background: #f1f5f9 !important; color: #334155 !important; }
.choice-layout { display: flex; flex-direction: column; gap: 16rpx; }
.choice-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12rpx; }
.choice-card { padding: 18rpx; border-radius: 16rpx; background: #f8fafc; border: 2rpx solid transparent; }
.choice-card--active { border-color: currentColor; background: #fff; box-shadow: 0 8rpx 20rpx rgba(15,23,42,0.06); }
.choice-card-title { display: block; font-size: 24rpx; font-weight: 700; color: #1d1d1f; }
.choice-card-body { display: block; margin-top: 8rpx; font-size: 22rpx; line-height: 1.65; color: #64748b; }
.choice-result { padding: 20rpx; border-radius: 16rpx; background: #f0fdf4; }
.choice-result-label { display: block; font-size: 22rpx; font-weight: 700; color: #047857; margin-bottom: 8rpx; }
.choice-result-text { display: block; font-size: 24rpx; line-height: 1.75; color: #334155; }
.choice-risk-row { display: flex; gap: 12rpx; margin-bottom: 8rpx; flex-wrap: wrap; }
.choice-risk-tag { font-size: 20rpx; padding: 6rpx 12rpx; border-radius: 999rpx; background: #eff6ff; color: #1d4ed8; }
.choice-cost { display: block; font-size: 22rpx; color: #b45309; margin-bottom: 8rpx; }
.slider-panel, .finance-sim { display: flex; flex-direction: column; gap: 16rpx; }
.slider-label, .finance-control-label { font-size: 24rpx; font-weight: 600; color: #334155; }
.slider-caption { font-size: 22rpx; line-height: 1.7; color: #64748b; }
.metric-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12rpx; }
.metric-item { padding: 16rpx; border-radius: 12rpx; background: #f8fafc; text-align: center; }
.metric-label { display: block; font-size: 20rpx; color: #64748b; }
.metric-value { display: block; margin-top: 6rpx; font-size: 24rpx; font-weight: 700; color: #1d1d1f; }
.compare-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 12rpx; }
.compare-col { padding: 18rpx; border-radius: 16rpx; background: #f8fafc; }
.compare-col-title { display: block; font-size: 24rpx; font-weight: 700; color: #1d1d1f; margin-bottom: 10rpx; }
.compare-col-item { display: block; font-size: 22rpx; line-height: 1.65; color: #475569; margin-top: 8rpx; }
.map-grid, .static-grid { display: flex; flex-direction: column; gap: 12rpx; }
.map-card, .static-card { padding: 18rpx; border-radius: 16rpx; background: #f8fafc; }
.map-label, .static-title { display: block; font-size: 22rpx; font-weight: 700; color: #64748b; }
.map-value, .static-body { display: block; margin-top: 8rpx; font-size: 24rpx; line-height: 1.7; color: #334155; }
.static-bullets { margin-top: 12rpx; display: flex; flex-direction: column; gap: 8rpx; }
.static-bullet { display: block; font-size: 23rpx; line-height: 1.65; color: #475569; }
.capital-bars { display: flex; flex-direction: column; gap: 10rpx; }
.capital-bar { min-height: 56rpx; border-radius: 12rpx; display: flex; align-items: center; padding: 0 16rpx; color: #fff; font-size: 22rpx; font-weight: 700; max-width: 100%; }
.capital-bar--return { background: #16a34a; }
.capital-bar--cost { background: #dc2626; }
.budget-row { margin-bottom: 8rpx; }
.budget-warn { display: block; font-size: 20rpx; color: #b45309; margin-top: 4rpx; }
.tag-layout { display: flex; flex-direction: column; gap: 16rpx; }
.tag-grid { display: flex; flex-wrap: wrap; gap: 12rpx; }
.tag-chip { padding: 12rpx 20rpx; border-radius: 999rpx; background: #f1f5f9; border: 2rpx solid #e2e8f0; font-size: 22rpx; color: #334155; }
.tag-chip--active { color: #fff; }
.position-field { margin-bottom: 16rpx; }
.position-label { display: block; font-size: 22rpx; font-weight: 700; color: #64748b; margin-bottom: 8rpx; }
.position-options { white-space: nowrap; }
.position-opt { display: inline-block; margin-right: 12rpx; padding: 10rpx 18rpx; border-radius: 999rpx; background: #f1f5f9; font-size: 22rpx; color: #334155; }
.position-opt--active { background: #1d1d1f; color: #fff; }
</style>
