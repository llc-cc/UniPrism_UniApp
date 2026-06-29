<template>
  <ProInteractionShell title="模拟计算器运算" formula="sin(0.5)" hint="拖动误差阈值，看有限项计算应该停在哪里">
    <view class="calc-panel">
      <view class="calc-display">
        <text class="calc-formula">sin(0.5)</text>
        <text class="calc-result">{{ trueValue.toFixed(5) }}</text>
      </view>
      <view class="calc-grid">
        <view class="calc-key">P₁</view>
        <view class="calc-key">P₃</view>
        <view class="calc-key">P₅</view>
        <view class="calc-key highlight">{{ degreeLabel }}</view>
        <view class="calc-key">err</view>
        <view class="calc-key" :class="{ ok: passes }">{{ passes ? 'ok' : '…' }}</view>
      </view>
    </view>
    <slider :value="epsilonSlider" :min="1" :max="200" :step="1" activeColor="#087f7a" block-size="20" show-value @change="onEpsilonChange" @changing="onEpsilonChanging" />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import {
  getSinCalculatorTermCount,
  sinTaylorNextTermBound,
  sinTaylorPartialByTermCount,
} from '../../../business/math-professional-utils'

export default {
  name: 'ProCalculatorPrecision',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      epsilonSlider: 100,
      x: 0.5,
    }
  },
  computed: {
    epsilon() {
      const min = 0.0001
      const max = 0.02
      const ratio = (this.epsilonSlider - 1) / 199
      return Number((min + ratio * (max - min)).toFixed(4))
    },
    termCount() {
      return getSinCalculatorTermCount(this.x, this.epsilon)
    },
    degree() {
      return this.termCount * 2 - 1
    },
    degreeLabel() {
      return `P${this.degree}`
    },
    approx() {
      return sinTaylorPartialByTermCount(this.x, this.termCount)
    },
    trueValue() {
      return Math.sin(this.x)
    },
    bound() {
      return sinTaylorNextTermBound(this.x, this.termCount)
    },
    passes() {
      return this.bound < this.epsilon
    },
    metrics() {
      return [
        { label: '目标误差 ε', value: this.epsilon.toFixed(4) },
        { label: '使用项数', value: String(this.termCount) },
        { label: '近似值', value: this.approx.toFixed(5) },
        { label: '余项上界', value: this.bound.toExponential(2) },
      ]
    },
  },
  methods: {
    onEpsilonChange(e) {
      this.epsilonSlider = Number(e.detail.value)
    },
    onEpsilonChanging(e) {
      this.epsilonSlider = Number(e.detail.value)
    },
  },
}
</script>

<style scoped>
.calc-panel {
  background: #17323a;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}
.calc-display {
  background: #dcece7;
  border-radius: 12rpx;
  padding: 20rpx 24rpx;
}
.calc-formula {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  color: #17323a;
}
.calc-result {
  display: block;
  margin-top: 8rpx;
  text-align: right;
  font-size: 30rpx;
  font-weight: 800;
  color: #147c83;
}
.calc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-top: 24rpx;
}
.calc-key {
  background: #fff;
  border-radius: 12rpx;
  text-align: center;
  padding: 16rpx 0;
  font-size: 26rpx;
  font-weight: 800;
  color: #17323a;
}
.calc-key.highlight {
  background: #ecfeff;
  color: #087f7a;
}
.calc-key.ok {
  background: #f2bc45;
}
</style>
