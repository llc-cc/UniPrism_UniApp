<template>
  <ProInteractionShell title="阿基琉斯追龟" hint="拖动步数，看剩余距离怎样缩小但始终为正">
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      type="2d"
      class="scene-canvas"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    />
    <slider
      :value="step"
      :min="0"
      :max="10"
      :step="1"
      activeColor="#087f7a"
      block-size="20"
      show-value
      @change="onStepChange"
      @changing="onStepChanging"
    />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { MATH_PROFESSIONAL_ASSETS } from '../../../business/math-professional-assets'
import {
  formatLimitNumber,
  formatZenoCoordinate,
  getZenoChaseState,
  getZenoSceneX,
} from '../../../business/math-professional-utils'
import {
  clearCanvas,
  drawCircle,
  drawDashedLine,
  drawLine,
  drawText,
  queryCanvasNode,
  setupCanvas2d,
} from '../../../business/professional-canvas'
import { resolveAsset } from '../../../../../utils/asset-map'

const CANVAS_W = 340
const CANVAS_H = 200
const AXIS_Y = 150

export default {
  name: 'ProZenoChase',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `zeno-chase-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      step: 3,
      runnerIcon: '',
      turtleIcon: '',
    }
  },
  computed: {
    chaseState() {
      return getZenoChaseState(this.step)
    },
    metrics() {
      const s = this.chaseState
      return [
        { label: '时间轴', value: `第 ${this.step} 步` },
        { label: '累计时间', value: `${formatLimitNumber(s.elapsedSeconds)} 秒` },
        { label: '阿基琉斯位置', value: `${formatZenoCoordinate(s.achillesPosition)} 米` },
        { label: '乌龟位置', value: `${formatZenoCoordinate(s.turtlePosition)} 米` },
        { label: '剩余距离', value: `${formatLimitNumber(s.chaseGap)} 米 > 0` },
      ]
    },
  },
  mounted() {
    this.runnerIcon = resolveAsset(MATH_PROFESSIONAL_ASSETS.zenoRunner)
    this.turtleIcon = resolveAsset(MATH_PROFESSIONAL_ASSETS.zenoTurtle)
    this.$nextTick(() => this.drawScene())
  },
  methods: {
    onStepChange(e) {
      this.step = Number(e.detail.value)
      this.drawScene()
    },
    onStepChanging(e) {
      this.step = Number(e.detail.value)
      this.drawScene()
    },
    async drawScene() {
      try {
        const selector = `#${this.canvasId}`
        const entry = await queryCanvasNode(this, selector)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H)
        const { achillesPosition, turtlePosition, chaseGap } = this.chaseState
        const achillesX = getZenoSceneX(achillesPosition, 260, 40)
        const turtleX = getZenoSceneX(turtlePosition, 260, 40)
        drawLine(ctx, 30, AXIS_Y, 310, AXIS_Y, '#102033', 3)
        ;[0, 5, 10, 15, 20].forEach((tick) => {
          const x = getZenoSceneX(tick, 260, 40)
          drawLine(ctx, x, AXIS_Y - 4, x, AXIS_Y + 10, '#334155', 2)
          drawText(ctx, `${tick}m`, x, AXIS_Y + 24, { align: 'center', size: 10, color: '#64748b' })
        })
        drawDashedLine(ctx, achillesX, AXIS_Y, turtleX, AXIS_Y)
        drawCircle(ctx, achillesX, AXIS_Y, 5, '#c46d00', null)
        drawCircle(ctx, turtleX, AXIS_Y, 5, '#c46d00', null)
        drawText(ctx, `阿 ${formatZenoCoordinate(achillesPosition)}m`, achillesX - 8, AXIS_Y - 14, {
          align: 'right',
          size: 10,
          color: '#8a4b00',
          bold: true,
        })
        drawText(ctx, `龟 ${formatZenoCoordinate(turtlePosition)}m`, turtleX + 8, AXIS_Y - 14, {
          size: 10,
          color: '#8a4b00',
          bold: true,
        })
        drawText(ctx, `第 ${this.step} 次追赶后，距离仍为正`, CANVAS_W / 2, 24, {
          align: 'center',
          size: 13,
          bold: true,
        })
        drawText(ctx, `此刻距离：还有 ${formatLimitNumber(chaseGap)} 米`, CANVAS_W / 2, CANVAS_H - 16, {
          align: 'center',
          size: 12,
          color: '#9a5b00',
          bold: true,
        })
      } catch (error) {
        console.warn('[ProZenoChase] draw failed', error)
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
</style>
