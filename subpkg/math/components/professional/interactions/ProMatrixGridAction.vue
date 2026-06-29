<template>
  <ProInteractionShell title="矩阵怎样推动坐标格" hint="切换矩阵动作，看基向量怎样被变形">
    <canvas :id="canvasId" :canvas-id="canvasId" type="2d" class="scene-canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
    <view class="mode-row">
      <view v-for="item in presets" :key="item.id" class="mode-chip" :class="{ active: presetId === item.id }" @tap="setPreset(item.id)">{{ item.label }}</view>
    </view>
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { applyMatrix2, matrixDeterminant2 } from '../../../business/math-professional-utils'
import { clearCanvas, drawLine, drawText, queryCanvasNode, setupCanvas2d } from '../../../business/professional-canvas'

const PRESETS = {
  identity: { label: '恒等', matrix: [[1, 0], [0, 1]] },
  stretch: { label: '拉伸', matrix: [[1.6, 0], [0, 0.7]] },
  shear: { label: '剪切', matrix: [[1, 0.8], [0, 1]] },
  rotate: { label: '旋转', matrix: [[0.866, -0.5], [0.5, 0.866]] },
}

const CANVAS_W = 340
const CANVAS_H = 200
const ORIGIN = { x: 70, y: 150 }
const SCALE = 42

export default {
  name: 'ProMatrixGridAction',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `matrix-grid-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      presetId: 'stretch',
      presets: Object.entries(PRESETS).map(([id, item]) => ({ id, label: item.label })),
    }
  },
  computed: {
    matrix() {
      return PRESETS[this.presetId].matrix
    },
    metrics() {
      const e1 = applyMatrix2(this.matrix, [1, 0])
      const e2 = applyMatrix2(this.matrix, [0, 1])
      return [
        { label: 'det(A)', value: matrixDeterminant2(this.matrix).toFixed(2) },
        { label: 'Ae₁', value: `(${e1[0].toFixed(2)}, ${e1[1].toFixed(2)})` },
        { label: 'Ae₂', value: `(${e2[0].toFixed(2)}, ${e2[1].toFixed(2)})` },
        { label: '动作', value: PRESETS[this.presetId].label },
      ]
    },
  },
  mounted() {
    this.$nextTick(() => this.drawScene())
  },
  methods: {
    setPreset(id) {
      this.presetId = id
      this.drawScene()
    },
    toScreen(vec) {
      const transformed = applyMatrix2(this.matrix, vec)
      return { x: ORIGIN.x + transformed[0] * SCALE, y: ORIGIN.y - transformed[1] * SCALE }
    },
    async drawScene() {
      try {
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H, '#fbfdff')
        for (let i = -1; i <= 4; i += 1) {
          const a = this.toScreen([i, -1])
          const b = this.toScreen([i, 4])
          drawLine(ctx, a.x, a.y, b.x, b.y, '#e2e8f0', 1)
          const c = this.toScreen([-1, i])
          const d = this.toScreen([4, i])
          drawLine(ctx, c.x, c.y, d.x, d.y, '#e2e8f0', 1)
        }
        const e1 = this.toScreen([1, 0])
        const e2 = this.toScreen([0, 1])
        drawLine(ctx, ORIGIN.x, ORIGIN.y, e1.x, e1.y, '#0ea5e9', 3)
        drawLine(ctx, ORIGIN.x, ORIGIN.y, e2.x, e2.y, '#f97316', 3)
        drawText(ctx, 'e₁', e1.x + 6, e1.y - 4, { size: 11, color: '#0ea5e9', bold: true })
        drawText(ctx, 'e₂', e2.x + 6, e2.y - 4, { size: 11, color: '#f97316', bold: true })
      } catch (error) {
        console.warn('[ProMatrixGridAction] draw failed', error)
      }
    },
  },
}
</script>

<style scoped>
.scene-canvas { display: block; width: 100%; margin: 16rpx 0; background: #fbfdff; border-radius: 12rpx; }
.mode-row { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 12rpx; }
.mode-chip { padding: 10rpx 20rpx; border-radius: 999rpx; border: 2rpx solid #dbe7ef; font-size: 24rpx; color: #52657a; }
.mode-chip.active { border-color: #087f7a; background: #ecfeff; color: #087f7a; font-weight: 700; }
</style>
