<template>
  <ProInteractionShell title="Taylor 多项式贴曲线" formula="sin(x)" hint="提高阶数，看有限多项式在 0 附近怎样贴近 sin(x)">
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      type="2d"
      class="scene-canvas"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    />
    <slider :value="termCount" :min="1" :max="5" :step="1" activeColor="#087f7a" block-size="20" show-value @change="onTermChange" @changing="onTermChanging" />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { sinTaylorPartialByTermCount } from '../../../business/math-professional-utils'
import { getClampedRatio } from '../../../business/math-professional-utils'
import { clearCanvas, drawLine, drawText, queryCanvasNode, setupCanvas2d } from '../../../business/professional-canvas'

const CANVAS_W = 340
const CANVAS_H = 180

export default {
  name: 'ProPolynomialDegree',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `poly-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      termCount: 3,
      observeX: 1.2,
    }
  },
  computed: {
    degree() {
      return this.termCount * 2 - 1
    },
    approxAtObserve() {
      return sinTaylorPartialByTermCount(this.observeX, this.termCount)
    },
    trueAtObserve() {
      return Math.sin(this.observeX)
    },
    errorAtObserve() {
      return Math.abs(this.trueAtObserve - this.approxAtObserve)
    },
    metrics() {
      return [
        { label: '多项式阶数', value: String(this.degree) },
        { label: '观察点 x', value: this.observeX.toFixed(2) },
        { label: '近似值', value: this.approxAtObserve.toFixed(4) },
        { label: '误差', value: this.errorAtObserve.toFixed(4) },
      ]
    },
  },
  mounted() {
    this.$nextTick(() => this.drawScene())
  },
  methods: {
    onTermChange(e) {
      this.termCount = Number(e.detail.value)
      this.drawScene()
    },
    onTermChanging(e) {
      this.termCount = Number(e.detail.value)
      this.drawScene()
    },
    async drawScene() {
      try {
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H, '#fbfdff')
        const frame = { x: 28, y: 20, width: 284, height: 120 }
        const minX = -0.2
        const maxX = 1.6
        const minY = -0.3
        const maxY = 1.1
        const plotX = (x) => frame.x + getClampedRatio(x, minX, maxX) * frame.width
        const plotY = (y) => frame.y + (1 - getClampedRatio(y, minY, maxY)) * frame.height
        const sinPoints = []
        const approxPoints = []
        for (let i = 0; i <= 80; i += 1) {
          const x = minX + (i / 80) * (maxX - minX)
          sinPoints.push({ x: plotX(x), y: plotY(Math.sin(x)) })
          approxPoints.push({ x: plotX(x), y: plotY(sinTaylorPartialByTermCount(x, this.termCount)) })
        }
        const drawPath = (points, color, width) => {
          ctx.strokeStyle = color
          ctx.lineWidth = width
          ctx.beginPath()
          points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
          ctx.stroke()
        }
        drawPath(sinPoints, '#102033', 2.5)
        drawPath(approxPoints, '#087f7a', 2)
        drawLine(ctx, plotX(0), frame.y, plotX(0), frame.y + frame.height, '#e2e8f0', 1)
        drawText(ctx, `P${this.degree}(x)`, 12, 16, { size: 11, color: '#087f7a', bold: true })
        drawText(ctx, 'sin(x)', 12, 32, { size: 11, color: '#102033', bold: true })
      } catch (error) {
        console.warn('[ProPolynomialDegree] draw failed', error)
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
</style>
