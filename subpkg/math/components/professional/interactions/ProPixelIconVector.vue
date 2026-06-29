<template>
  <ProInteractionShell title="像素也是向量" hint="切换图标模板，看 3×3 像素网格如何写成数字向量">
    <view class="pixel-grid">
      <view v-for="(row, rowIndex) in activePattern" :key="`row-${rowIndex}`" class="pixel-row">
        <view v-for="(value, colIndex) in row" :key="`cell-${rowIndex}-${colIndex}`" class="pixel-cell" :class="{ on: value }" />
      </view>
    </view>
    <view class="mode-row">
      <view v-for="item in patterns" :key="item.id" class="mode-chip" :class="{ active: patternId === item.id }" @tap="patternId = item.id">{{ item.label }}</view>
    </view>
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'

const PATTERNS = {
  smile: { label: '笑脸', grid: [[0, 1, 0], [1, 0, 1], [0, 1, 0]] },
  arrow: { label: '箭头', grid: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
  block: { label: '方块', grid: [[1, 1, 1], [1, 0, 1], [1, 1, 1]] },
}

export default {
  name: 'ProPixelIconVector',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      patternId: 'smile',
      patterns: Object.entries(PATTERNS).map(([id, item]) => ({ id, label: item.label })),
    }
  },
  computed: {
    activePattern() {
      return PATTERNS[this.patternId].grid
    },
    vectorText() {
      return `[${this.activePattern.flat().join(', ')}]`
    },
    metrics() {
      const ones = this.activePattern.flat().filter(Boolean).length
      return [
        { label: '维度', value: '9' },
        { label: '亮像素数', value: String(ones) },
        { label: '向量', value: this.vectorText },
        { label: '对象', value: PATTERNS[this.patternId].label },
      ]
    },
  },
}
</script>

<style scoped>
.pixel-grid { display: flex; flex-direction: column; gap: 8rpx; align-items: center; margin: 16rpx 0; }
.pixel-row { display: flex; gap: 8rpx; }
.pixel-cell { width: 56rpx; height: 56rpx; border-radius: 8rpx; background: #eef2f7; border: 2rpx solid #dbe7ef; }
.pixel-cell.on { background: #102033; border-color: #102033; }
.mode-row { display: flex; flex-wrap: wrap; gap: 12rpx; }
.mode-chip { padding: 10rpx 20rpx; border-radius: 999rpx; border: 2rpx solid #dbe7ef; font-size: 24rpx; color: #52657a; }
.mode-chip.active { border-color: #087f7a; background: #ecfeff; color: #087f7a; font-weight: 700; }
</style>
