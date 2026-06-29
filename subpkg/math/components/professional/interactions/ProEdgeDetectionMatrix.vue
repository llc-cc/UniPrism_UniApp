<template>
  <ProInteractionShell title="边缘检测模板" hint="拖动阈值，看哪些像素变化被认作边缘">
    <view class="pixel-board">
      <view v-for="(row, rowIndex) in board" :key="`row-${rowIndex}`" class="pixel-row">
        <view
          v-for="(value, colIndex) in row"
          :key="`cell-${rowIndex}-${colIndex}`"
          class="pixel-cell"
          :class="{ edge: edgeMask[rowIndex][colIndex] }"
          :style="{ opacity: 0.35 + value * 0.65 }"
        />
      </view>
    </view>
    <slider :value="threshold" :min="1" :max="8" :step="1" activeColor="#087f7a" block-size="18" show-value @change="onThresholdChange" @changing="onThresholdChange" />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'

const BOARD = [
  [0.1, 0.1, 0.1, 0.9, 0.9, 0.1],
  [0.1, 0.1, 0.9, 0.9, 0.1, 0.1],
  [0.1, 0.9, 0.9, 0.1, 0.1, 0.1],
  [0.1, 0.9, 0.9, 0.1, 0.1, 0.1],
  [0.1, 0.1, 0.9, 0.9, 0.1, 0.1],
  [0.1, 0.1, 0.1, 0.9, 0.9, 0.1],
]

export default {
  name: 'ProEdgeDetectionMatrix',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      board: BOARD,
      threshold: 4,
    }
  },
  computed: {
    edgeMask() {
      const t = this.threshold / 10
      return this.board.map((row, r) =>
        row.map((value, c) => {
          const neighbors = [
            row[c - 1],
            row[c + 1],
            this.board[r - 1]?.[c],
            this.board[r + 1]?.[c],
          ].filter((n) => typeof n === 'number')
          if (!neighbors.length) return false
          const maxDiff = Math.max(...neighbors.map((n) => Math.abs(n - value)))
          return maxDiff >= t
        }),
      )
    },
    edgeCount() {
      return this.edgeMask.flat().filter(Boolean).length
    },
    metrics() {
      return [
        { label: '阈值', value: (this.threshold / 10).toFixed(1) },
        { label: '边缘像素', value: String(this.edgeCount) },
        { label: '矩阵尺寸', value: '6 × 6' },
        { label: '规则', value: '邻域差超过阈值' },
      ]
    },
  },
  methods: {
    onThresholdChange(e) {
      this.threshold = Number(e.detail.value)
    },
  },
}
</script>

<style scoped>
.pixel-board { display: flex; flex-direction: column; gap: 6rpx; align-items: center; margin-bottom: 12rpx; }
.pixel-row { display: flex; gap: 6rpx; }
.pixel-cell { width: 44rpx; height: 44rpx; border-radius: 6rpx; background: #102033; border: 2rpx solid #dbe7ef; }
.pixel-cell.edge { box-shadow: 0 0 0 3rpx #f97316 inset; border-color: #f97316; }
</style>
