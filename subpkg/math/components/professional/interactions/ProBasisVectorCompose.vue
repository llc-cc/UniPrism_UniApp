<template>
  <ProInteractionShell title="用基向量拼出目标点" hint="调整两个基方向的分量，看能否到达目标">
    <canvas :id="canvasId" :canvas-id="canvasId" type="2d" class="scene-canvas" :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />
    <view class="slider-block">
      <text class="slider-label">沿 e₁ 分量</text>
      <slider :value="a" :min="-20" :max="40" :step="1" activeColor="#0ea5e9" block-size="18" @change="(e) => onAChange(e)" @changing="(e) => onAChange(e)" />
    </view>
    <view class="slider-block">
      <text class="slider-label">沿 e₂ 分量</text>
      <slider :value="b" :min="-20" :max="40" :step="1" activeColor="#f97316" block-size="18" @change="(e) => onBChange(e)" @changing="(e) => onBChange(e)" />
    </view>
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'
import { clearCanvas, drawCircle, drawLine, drawText, queryCanvasNode, setupCanvas2d } from '../../../business/professional-canvas'

const CANVAS_W = 340
const CANVAS_H = 200
const ORIGIN = { x: 50, y: 160 }
const TARGET = { x: 250, y: 60 }
const E1 = { x: 70, y: -20 }
const E2 = { x: 20, y: 50 }

export default {
  name: 'ProBasisVectorCompose',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      canvasId: `basis-compose-${Math.random().toString(36).slice(2, 8)}`,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      a: 18,
      b: 12,
    }
  },
  computed: {
    composed() {
      return {
        x: ORIGIN.x + (this.a / 10) * E1.x + (this.b / 10) * E2.x,
        y: ORIGIN.y + (this.a / 10) * E1.y + (this.b / 10) * E2.y,
      }
    },
    distanceToTarget() {
      const dx = this.composed.x - TARGET.x
      const dy = this.composed.y - TARGET.y
      return Math.hypot(dx, dy)
    },
    metrics() {
      return [
        { label: '分量 a', value: (this.a / 10).toFixed(1) },
        { label: '分量 b', value: (this.b / 10).toFixed(1) },
        { label: '合成点', value: `(${this.composed.x.toFixed(0)}, ${this.composed.y.toFixed(0)})` },
        { label: '距目标', value: this.distanceToTarget.toFixed(1) },
      ]
    },
  },
  mounted() {
    this.$nextTick(() => this.drawScene())
  },
  methods: {
    onAChange(e) {
      this.a = Number(e.detail.value)
      this.drawScene()
    },
    onBChange(e) {
      this.b = Number(e.detail.value)
      this.drawScene()
    },
    async drawScene() {
      try {
        const entry = await queryCanvasNode(this, `#${this.canvasId}`)
        const { ctx } = setupCanvas2d(entry, CANVAS_W, CANVAS_H)
        clearCanvas(ctx, CANVAS_W, CANVAS_H, '#fbfdff')
        drawLine(ctx, ORIGIN.x, ORIGIN.y, ORIGIN.x + E1.x, ORIGIN.y + E1.y, '#0ea5e9', 3)
        drawLine(ctx, ORIGIN.x, ORIGIN.y, ORIGIN.x + E2.x, ORIGIN.y + E2.y, '#f97316', 3)
        drawLine(ctx, ORIGIN.x, ORIGIN.y, this.composed.x, this.composed.y, '#087f7a', 3)
        drawCircle(ctx, TARGET.x, TARGET.y, 6, '#f59e0b', '#b45309', 2)
        drawCircle(ctx, this.composed.x, this.composed.y, 5, '#087f7a', null)
        drawText(ctx, '目标', TARGET.x + 8, TARGET.y - 8, { size: 10, color: '#b45309' })
      } catch (error) {
        console.warn('[ProBasisVectorCompose] draw failed', error)
      }
    },
  },
}
</script>

<style scoped>
.scene-canvas { display: block; width: 100%; margin: 16rpx 0; background: #fbfdff; border-radius: 12rpx; }
.slider-block { margin-bottom: 8rpx; }
.slider-label { display: block; font-size: 24rpx; color: #52657a; margin-bottom: 4rpx; }
</style>
