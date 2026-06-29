<template>
  <ProInteractionShell title="矩阵乘法顺序" formula="AB ≠ BA" hint="切换两种动作顺序，看最终朝向是否相同">
    <view class="order-panel">
      <view class="order-col">
        <text class="order-label">先 A 后 B</text>
        <text class="order-result">{{ resultAB }}</text>
      </view>
      <view class="order-col">
        <text class="order-label">先 B 后 A</text>
        <text class="order-result">{{ resultBA }}</text>
      </view>
    </view>
    <view class="mode-row">
      <view class="mode-chip" :class="{ active: order === 'ab' }" @tap="order = 'ab'">A → B</view>
      <view class="mode-chip" :class="{ active: order === 'ba' }" @tap="order = 'ba'">B → A</view>
    </view>
    <canvas :id="canvasId" :canvas-id="canvasId" type="2d" class="scene-canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { applyMatrix2 } from '../../../business/math-professional-utils'
import { clearCanvas, drawLine, drawText, queryCanvasNode, setupCanvas2d } from '../../../business/professional-canvas'

const A = [[1, 0.6], [0, 1]]
const B = [[0.866, -0.5], [0.5, 0.866]]
const CANVAS_W = 340
const CANVAS_H = 160
const ORIGIN = { x: 60, y: 120 }
const SCALE = 36

export default {
  name: 'ProMatrixOrderCube',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `matrix-order-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      order: 'ab',
    }
  },
  computed: {
    matrixAB() {
      return this.multiply(B, A)
    },
    matrixBA() {
      return this.multiply(A, B)
    },
    activeMatrix() {
      return this.order === 'ab' ? this.matrixAB : this.matrixBA
    },
    resultAB() {
      const v = applyMatrix2(this.matrixAB, [1, 0.4])
      return `(${v[0].toFixed(2)}, ${v[1].toFixed(2)})`
    },
    resultBA() {
      const v = applyMatrix2(this.matrixBA, [1, 0.4])
      return `(${v[0].toFixed(2)}, ${v[1].toFixed(2)})`
    },
    metrics() {
      return [
        { label: '当前顺序', value: this.order === 'ab' ? '先 A 后 B' : '先 B 后 A' },
        { label: 'AB 结果', value: this.resultAB },
        { label: 'BA 结果', value: this.resultBA },
        { label: '是否相同', value: this.resultAB === this.resultBA ? '相同' : '不同' },
      ]
    },
  },
  watch: {
    order() {
      this.drawScene()
    },
  },
  mounted() {
    this.$nextTick(() => this.drawScene())
  },
  methods: {
    multiply(m1, m2) {
      return [
        [
          m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0],
          m1[0][0] * m2[0][1] + m1[0][1] * m2[1][1],
        ],
        [
          m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0],
          m1[1][0] * m2[0][1] + m1[1][1] * m2[1][1],
        ],
      ]
    },
    toScreen(vec) {
      const t = applyMatrix2(this.activeMatrix, vec)
      return { x: ORIGIN.x + t[0] * SCALE, y: ORIGIN.y - t[1] * SCALE }
    },
    async drawScene() {
      try {
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H, '#fbfdff')
        const start = ORIGIN
        const end = this.toScreen([1, 0.4])
        drawLine(ctx, start.x, start.y, end.x, end.y, '#087f7a', 4)
        drawText(ctx, 'v', end.x + 8, end.y, { size: 12, bold: true, color: '#087f7a' })
      } catch (error) {
        console.warn('[ProMatrixOrderCube] draw failed', error)
      }
    },
  },
}
</script>

<style scoped>
.order-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 16rpx; margin-bottom: 12rpx; }
.order-col { background: #fbfdff; border: 2rpx solid #dbe7ef; border-radius: 12rpx; padding: 16rpx; }
.order-label { display: block; font-size: 24rpx; color: #64748b; }
.order-result { display: block; margin-top: 8rpx; font-size: 28rpx; font-weight: 700; color: #102033; }
.scene-canvas { display: block; width: 100%; margin: 16rpx 0; background: #fbfdff; border-radius: 12rpx; }
.mode-row { display: flex; gap: 12rpx; margin-bottom: 12rpx; }
.mode-chip { padding: 10rpx 20rpx; border-radius: 999rpx; border: 2rpx solid #dbe7ef; font-size: 24rpx; color: #52657a; }
.mode-chip.active { border-color: #087f7a; background: #ecfeff; color: #087f7a; font-weight: 700; }
</style>
