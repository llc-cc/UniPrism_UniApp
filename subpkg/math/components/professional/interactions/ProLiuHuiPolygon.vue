<template>
  <ProInteractionShell title="刘徽割圆" hint="拖动边数索引，看多边形面积怎样逼近圆">
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      type="2d"
      class="scene-canvas"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    />
    <slider
      :value="polygonIndex"
      :min="0"
      :max="6"
      :step="1"
      activeColor="#087f7a"
      block-size="20"
      show-value
      @change="onIndexChange"
      @changing="onIndexChanging"
    />
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { getLiuHuiPolygonState } from '../../../business/math-professional-utils'
import { getRegularPolygonPoints } from '../../../business/math-professional-utils'
import {
  clearCanvas,
  drawCircle,
  drawPolygon,
  drawText,
  queryCanvasNode,
  setupCanvas2d,
} from '../../../business/professional-canvas'

const CANVAS_W = 340
const CANVAS_H = 220
const CX = 170
const CY = 110
const R = 80

export default {
  name: 'ProLiuHuiPolygon',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `liu-hui-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      polygonIndex: 3,
    }
  },
  computed: {
    polygonState() {
      return getLiuHuiPolygonState(this.polygonIndex)
    },
    metrics() {
      const s = this.polygonState
      return [
        { label: '边数', value: `${s.polygonSides}` },
        { label: '多边形面积', value: s.polygonArea.toFixed(4) },
        { label: '圆面积 π', value: s.circleArea.toFixed(4) },
        { label: '与圆面积差', value: s.areaGap.toFixed(4) },
      ]
    },
  },
  mounted() {
    this.$nextTick(() => this.drawScene())
  },
  methods: {
    onIndexChange(e) {
      this.polygonIndex = Number(e.detail.value)
      this.drawScene()
    },
    onIndexChanging(e) {
      this.polygonIndex = Number(e.detail.value)
      this.drawScene()
    },
    async drawScene() {
      try {
        const { polygonSides } = this.polygonState
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H)
        drawCircle(ctx, CX, CY, R, 'rgba(20,184,166,0.12)', '#087f7a', 3)
        const points = getRegularPolygonPoints(polygonSides, CX, CY, R)
        drawPolygon(ctx, points, 'rgba(20,184,166,0.14)', '#087f7a', 3)
        points.forEach((point) => drawCircle(ctx, point.x, point.y, 3, '#087f7a', null))
        drawText(ctx, `正 ${polygonSides} 边形内接圆`, CANVAS_W / 2, 24, {
          align: 'center',
          size: 13,
          bold: true,
        })
        drawText(ctx, `面积差 ${this.polygonState.areaGap.toFixed(4)}`, CANVAS_W / 2, CANVAS_H - 14, {
          align: 'center',
          size: 11,
          color: '#9a5b00',
        })
      } catch (error) {
        console.warn('[ProLiuHuiPolygon] draw failed', error)
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
