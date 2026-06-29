<template>
  <ProInteractionShell
    title="连续性的局部窗口检查"
    formula="|x-x₀| < δ"
    hint="切换函数类型并拖动 ε，看输入窗口能否压住输出"
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
    <slider
      :value="epsilonSlider"
      :min="5"
      :max="30"
      :step="1"
      activeColor="#087f7a"
      block-size="20"
      show-value
      @change="onEpsilonChange"
      @changing="onEpsilonChanging"
    />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { getClampedRatio } from '../../../business/math-professional-utils'
import {
  clearCanvas,
  drawLine,
  drawRect,
  drawText,
  queryCanvasNode,
  setupCanvas2d,
} from '../../../business/professional-canvas'

const CANVAS_W = 340
const CANVAS_H = 180

export default {
  name: 'ProContinuityWindow',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `continuity-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      mode: 'smooth',
      epsilonSlider: 10,
      modes: [
        { value: 'smooth', label: 'f(x)=x² 在 x₀=2' },
        { value: 'jump', label: '跳跃函数' },
      ],
    }
  },
  computed: {
    epsilon() {
      return this.epsilonSlider / 100
    },
    graph() {
      return this.mode === 'smooth'
        ? { minX: 1.72, maxX: 2.28, minY: 3.3, maxY: 4.75, x0: 2, y0: 4 }
        : { minX: 1.72, maxX: 2.28, minY: 3.25, maxY: 4.85, x0: 2, y0: 4 }
    },
    delta() {
      if (this.mode !== 'smooth') return 0.035
      const e = this.epsilon
      const limit = Math.min(0.5, Math.sqrt(4 + e) - 2, 2 - Math.sqrt(Math.max(0, 4 - e)))
      return Math.max(0.001, limit * 0.92)
    },
    passes() {
      if (this.mode !== 'smooth') return false
      const e = this.epsilon
      const maxErr = Math.max(
        Math.abs((this.graph.x0 - this.delta) ** 2 - this.graph.y0),
        Math.abs((this.graph.x0 + this.delta) ** 2 - this.graph.y0),
      )
      return maxErr < e
    },
    metrics() {
      return [
        { label: 'ε 输出误差', value: this.epsilon.toFixed(2) },
        { label: 'δ 输入窗口', value: this.delta.toFixed(3) },
        { label: '检查结果', value: this.passes ? '通过窗口检查' : this.mode === 'smooth' ? '需要更窄窗口' : '窗口再窄也跳开' },
        { label: 'x₀', value: String(this.graph.x0) },
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
    onEpsilonChange(e) {
      this.epsilonSlider = Number(e.detail.value)
      this.drawScene()
    },
    onEpsilonChanging(e) {
      this.epsilonSlider = Number(e.detail.value)
      this.drawScene()
    },
    f(x) {
      return this.mode === 'smooth' ? x * x : x < this.graph.x0 ? 3.35 : 4.65
    },
    async drawScene() {
      try {
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H, '#fbfdff')
        const frame = { x: 36, y: 24, width: 268, height: 120 }
        const plotX = (x) => frame.x + getClampedRatio(x, this.graph.minX, this.graph.maxX) * frame.width
        const plotY = (y) => frame.y + (1 - getClampedRatio(y, this.graph.minY, this.graph.maxY)) * frame.height
        const deltaLeft = plotX(this.graph.x0 - this.delta)
        const deltaRight = plotX(this.graph.x0 + this.delta)
        const epsTop = plotY(this.graph.y0 + this.epsilon)
        const epsBottom = plotY(this.graph.y0 - this.epsilon)
        drawRect(ctx, deltaLeft, frame.y, Math.max(8, deltaRight - deltaLeft), frame.height, '#dcfdf6', '#5eead4', 1, [6, 6])
        drawRect(ctx, frame.x, epsTop, frame.width, Math.max(8, epsBottom - epsTop), '#fff7ed', '#fdba74', 1, [6, 6])
        const points = []
        for (let i = 0; i <= 80; i += 1) {
          const x = this.graph.minX + (i / 80) * (this.graph.maxX - this.graph.minX)
          points.push({ x: plotX(x), y: plotY(this.f(x)) })
        }
        ctx.strokeStyle = '#0f766e'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.stroke()
        drawText(ctx, this.passes ? '通过' : '未通过', CANVAS_W - 16, 18, {
          align: 'right',
          size: 12,
          color: this.passes ? '#087f7a' : '#c26207',
          bold: true,
        })
      } catch (error) {
        console.warn('[ProContinuityWindow] draw failed', error)
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
