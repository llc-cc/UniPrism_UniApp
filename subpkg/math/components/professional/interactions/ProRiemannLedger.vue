<template>
  <ProInteractionShell
    title="切块累加总账检验"
    formula="S_L ≤ ∫₀⁵ 2t dt ≤ S_R"
    hint="拖动切分数，看左右两本账怎样夹向同一笔里程"
  >
    <view class="mode-row">
      <view
        v-for="item in modes"
        :key="item.value"
        class="mode-chip"
        :class="{ active: mode === item.value }"
        @tap="setMode(item.value)"
      >
        {{ item.label }}
      </view>
    </view>
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      type="2d"
      class="scene-canvas"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    />
    <slider :value="partitionCount" :min="5" :max="40" :step="1" activeColor="#087f7a" block-size="20" show-value @change="onPartitionChange" @changing="onPartitionChanging" />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { getClampedRatio } from '../../../business/math-professional-utils'
import { clearCanvas, drawLine, drawRect, drawText, queryCanvasNode, setupCanvas2d } from '../../../business/professional-canvas'

const CANVAS_W = 340
const CANVAS_H = 180

export default {
  name: 'ProRiemannLedger',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `riemann-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      partitionCount: 20,
      mode: 'both',
      modes: [
        { value: 'left', label: '左端取样' },
        { value: 'right', label: '右端取样' },
        { value: 'both', label: '两侧夹逼' },
      ],
    }
  },
  computed: {
    n() {
      return Math.max(5, Math.min(80, Math.round(this.partitionCount)))
    },
    exactIntegral() {
      return 25
    },
    leftEstimate() {
      return this.exactIntegral - 25 / this.n
    },
    rightEstimate() {
      return this.exactIntegral + 25 / this.n
    },
    gap() {
      return this.rightEstimate - this.leftEstimate
    },
    metrics() {
      return [
        { label: '切分数 n', value: String(this.n) },
        { label: '左和 S_L', value: this.leftEstimate.toFixed(2) },
        { label: '右和 S_R', value: this.rightEstimate.toFixed(2) },
        { label: '夹逼差', value: this.gap.toFixed(2) },
      ]
    },
  },
  mounted() {
    this.$nextTick(() => this.drawScene())
  },
  methods: {
    setMode(mode) {
      this.mode = mode
      this.drawScene()
    },
    onPartitionChange(e) {
      this.partitionCount = Number(e.detail.value)
      this.drawScene()
    },
    onPartitionChanging(e) {
      this.partitionCount = Number(e.detail.value)
      this.drawScene()
    },
    async drawScene() {
      try {
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H, '#fbfdff')
        const graph = { x: 32, y: 24, width: 276, height: 110 }
        const plotX = (t) => graph.x + (t / 5) * graph.width
        const plotY = (v) => graph.y + (1 - getClampedRatio(v, 0, 10)) * graph.height
        drawLine(ctx, graph.x, graph.y + graph.height, graph.x + graph.width, graph.y + graph.height, '#cbd5e1', 2)
        drawLine(ctx, graph.x, graph.y + graph.height, graph.x, graph.y, '#cbd5e1', 2)
        const deltaT = 5 / this.n
        for (let i = 0; i < this.n; i += 1) {
          const start = i * deltaT
          const end = start + deltaT
          const x = plotX(start)
          const w = Math.max(1, plotX(end) - x)
          if (this.mode === 'left' || this.mode === 'both') {
            const h = graph.y + graph.height - plotY(2 * start)
            drawRect(ctx, x, plotY(2 * start), w, h, 'rgba(14,116,144,0.18)', '#0e7490', 1)
          }
          if (this.mode === 'right' || this.mode === 'both') {
            const h = graph.y + graph.height - plotY(2 * end)
            drawRect(ctx, x, plotY(2 * end), w, h, 'rgba(245,158,11,0.16)', '#d97706', 1)
          }
        }
        const curve = []
        for (let i = 0; i <= 60; i += 1) {
          const t = (i / 60) * 5
          curve.push({ x: plotX(t), y: plotY(2 * t) })
        }
        ctx.strokeStyle = '#102033'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        curve.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.stroke()
        drawText(ctx, `差 ${this.gap.toFixed(2)}`, CANVAS_W - 12, 16, { align: 'right', size: 11, bold: true })
      } catch (error) {
        console.warn('[ProRiemannLedger] draw failed', error)
      }
    },
  },
}
</script>

<style scoped>
.scene-canvas {
  display: block;
  width: 100%;
  margin: 16rpx 0;
  background: #fbfdff;
  border-radius: 12rpx;
}
.mode-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 12rpx;
}
.mode-chip {
  padding: 10rpx 20rpx;
  border-radius: 999rpx;
  border: 2rpx solid #dbe7ef;
  font-size: 24rpx;
  color: #52657a;
}
.mode-chip.active {
  border-color: #087f7a;
  background: #ecfeff;
  color: #087f7a;
  font-weight: 700;
}
</style>
