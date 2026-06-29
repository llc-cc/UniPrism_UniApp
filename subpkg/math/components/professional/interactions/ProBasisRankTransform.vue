<template>
  <ProInteractionShell title="秩 = 还剩几个独立方向" hint="切换矩阵，看空间被压扁后还剩几维">
    <view class="mode-row">
      <view v-for="item in presets" :key="item.id" class="mode-chip" :class="{ active: presetId === item.id }" @tap="setPreset(item.id)">{{ item.label }}</view>
    </view>
    <canvas :id="canvasId" :canvas-id="canvasId" type="2d" class="scene-canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { applyMatrix2, matrixDeterminant2 } from '../../../business/math-professional-utils'
import { clearCanvas, drawCircle, drawLine, drawText, queryCanvasNode, setupCanvas2d } from '../../../business/professional-canvas'

const PRESETS = {
  full: { label: '秩 2', matrix: [[1, 0.2], [0.1, 0.9]], rank: 2 },
  line: { label: '秩 1', matrix: [[1, 1], [1, 1]], rank: 1 },
  zero: { label: '秩 0', matrix: [[0, 0], [0, 0]], rank: 0 },
}
const CANVAS_W = 340
const CANVAS_H = 180
const ORIGIN = { x: 70, y: 130 }
const SCALE = 36

export default {
  name: 'ProBasisRankTransform',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `basis-rank-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      presetId: 'full',
      presets: Object.entries(PRESETS).map(([id, item]) => ({ id, label: item.label })),
    }
  },
  computed: {
    matrix() {
      return PRESETS[this.presetId].matrix
    },
    rank() {
      return PRESETS[this.presetId].rank
    },
    metrics() {
      return [
        { label: '秩', value: String(this.rank) },
        { label: 'det(A)', value: matrixDeterminant2(this.matrix).toFixed(2) },
        { label: '独立方向', value: this.rank === 2 ? '2 个' : this.rank === 1 ? '1 个' : '0 个' },
        { label: '解释', value: this.rank === 2 ? '信息完整' : this.rank === 1 ? '压成一条线' : '压成一个点' },
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
      const t = applyMatrix2(this.matrix, vec)
      return { x: ORIGIN.x + t[0] * SCALE, y: ORIGIN.y - t[1] * SCALE }
    },
    async drawScene() {
      try {
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H, '#fbfdff')
        const unitCircle = Array.from({ length: 24 }, (_, i) => {
          const angle = (i / 24) * Math.PI * 2
          return [Math.cos(angle), Math.sin(angle)]
        })
        const transformed = unitCircle.map((v) => this.toScreen(v))
        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 2
        ctx.beginPath()
        unitCircle.forEach((v, i) => {
          const p = { x: ORIGIN.x + v[0] * SCALE, y: ORIGIN.y - v[1] * SCALE }
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })
        ctx.closePath()
        ctx.stroke()
        ctx.strokeStyle = '#087f7a'
        ctx.lineWidth = 3
        ctx.beginPath()
        transformed.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.closePath()
        ctx.stroke()
        drawText(ctx, `秩 = ${this.rank}`, CANVAS_W - 12, 20, { align: 'right', size: 12, bold: true, color: '#087f7a' })
        drawCircle(ctx, ORIGIN.x, ORIGIN.y, 4, '#64748b', null)
      } catch (error) {
        console.warn('[ProBasisRankTransform] draw failed', error)
      }
    },
  },
}
</script>

<style scoped>
.scene-canvas { display: block; width: 100%; margin: 16rpx 0; background: #fbfdff; border-radius: 12rpx; }
.mode-row { display: flex; flex-wrap: wrap; gap: 12rpx; margin-bottom: 12rpx; }
.mode-chip { padding: 10rpx 20rpx; border-radius: 999rpx; border: 2rpx solid #dbe7ef; font-size: 24rpx; color: #52657a; }
.mode-chip.active { border-color: #087f7a; background: #ecfeff; color: #087f7a; font-weight: 700; }
</style>
