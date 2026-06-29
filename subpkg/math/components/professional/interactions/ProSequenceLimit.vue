<template>
  <ProInteractionShell
    title="数列极限 ε-N 体验"
    formula="aₙ = 1 + 1/n"
    hint="拖动 ε，看稳定门槛 N 怎样后移"
  >
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      type="2d"
      class="scene-canvas"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    />
    <view class="slider-row">
      <text class="slider-label">ε 允许误差：{{ epsilonText }}</text>
      <slider
        :value="epsilonSlider"
        :min="1"
        :max="50"
        :step="1"
        activeColor="#087f7a"
        block-size="20"
        @change="onEpsilonChange"
        @changing="onEpsilonChanging"
      />
    </view>
    <text class="status-text">{{ statusText }}</text>
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import {
  formatSubscriptNumber,
  getClampedRatio,
  getSequenceLimitThreshold,
  getSequenceValue,
} from '../../../business/math-professional-utils'
import {
  clearCanvas,
  drawCircle,
  drawLine,
  drawRect,
  drawText,
  queryCanvasNode,
  setupCanvas2d,
} from '../../../business/professional-canvas'

const CANVAS_W = 340
const CANVAS_H = 160
const EPSILON_MIN = 0.01
const EPSILON_MAX = 0.5

export default {
  name: 'ProSequenceLimit',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `seq-limit-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      epsilonSlider: 9,
    }
  },
  computed: {
    epsilon() {
      const ratio = (this.epsilonSlider - 1) / 49
      return Number((EPSILON_MIN + ratio * (EPSILON_MAX - EPSILON_MIN)).toFixed(4))
    },
    epsilonText() {
      return this.epsilon < 0.1 ? this.epsilon.toFixed(3) : this.epsilon.toFixed(2)
    },
    threshold() {
      return getSequenceLimitThreshold(this.epsilon)
    },
    rangeLow() {
      return 1 - this.epsilon
    },
    rangeHigh() {
      return 1 + this.epsilon
    },
    statusText() {
      const inv = (1 / this.epsilon).toFixed(1).replace(/\.0$/, '')
      return `当前 ε=${this.epsilonText} 时，项数超过 ${inv} 之后进入误差带；从第 ${this.threshold} 项起尾部留在 1±ε 内。`
    },
    metrics() {
      return [
        { label: '门槛 N', value: String(this.threshold) },
        { label: '误差带', value: `[${this.rangeLow.toFixed(3)}, ${this.rangeHigh.toFixed(3)}]` },
        { label: 'a_N', value: getSequenceValue(this.threshold).toFixed(4) },
        { label: '目标 L', value: '1' },
      ]
    },
  },
  mounted() {
    this.$nextTick(() => this.drawScene())
  },
  methods: {
    onEpsilonChange(e) {
      this.epsilonSlider = Number(e.detail.value)
      this.drawScene()
    },
    onEpsilonChanging(e) {
      this.epsilonSlider = Number(e.detail.value)
      this.drawScene()
    },
    async drawScene() {
      try {
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H)
        const axis = { min: 0.94, max: 1.22, x: 28, y: 100, width: 284 }
        const xAxis = (value) => axis.x + getClampedRatio(value, axis.min, axis.max) * axis.width
        const bandLeft = xAxis(this.rangeLow)
        const bandRight = xAxis(this.rangeHigh)
        const targetX = xAxis(1)
        drawRect(ctx, bandLeft, 36, bandRight - bandLeft, 48, 'rgba(35,165,153,0.12)', '#168f87', 1.4, [4, 5])
        drawLine(ctx, axis.x, axis.y, axis.x + axis.width, axis.y, '#17212f', 2)
        drawLine(ctx, targetX, 32, targetX, axis.y + 12, '#087f7a', 2)
        drawText(ctx, 'L = 1', targetX, 28, { align: 'center', size: 11, color: '#087f7a', bold: true })
        drawText(ctx, '1 ± ε', (bandLeft + bandRight) / 2, 32, {
          align: 'center',
          size: 10,
          color: '#087f7a',
        })
        const ns = [5, 8, 12, 20, 30, 50, 80, this.threshold].filter((n, i, arr) => arr.indexOf(n) === i)
        ns.forEach((n) => {
          const value = getSequenceValue(n)
          if (value < axis.min || value > axis.max) return
          const dotX = xAxis(value)
          const accepted = n >= this.threshold
          drawCircle(ctx, dotX, axis.y, accepted ? 5 : 3.5, accepted ? '#f49a21' : '#8b9299', accepted ? '#a95306' : '#535a61', 1.2)
          if (n === 5 || n === this.threshold) {
            drawText(ctx, `a${formatSubscriptNumber(n)}`, dotX, axis.y - 12, {
              align: 'center',
              size: 9,
              color: accepted ? '#c26207' : '#17212f',
            })
          }
        })
        drawText(ctx, `N = ${this.threshold}`, xAxis(getSequenceValue(this.threshold)), 24, {
          align: 'center',
          size: 10,
          color: '#c26207',
          bold: true,
        })
      } catch (error) {
        console.warn('[ProSequenceLimit] draw failed', error)
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
  background: #fff;
  border-radius: 12rpx;
}
.slider-row {
  margin-top: 8rpx;
}
.slider-label {
  display: block;
  font-size: 26rpx;
  color: #17212f;
  font-weight: 600;
  margin-bottom: 8rpx;
}
.status-text {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #52606f;
}
</style>
