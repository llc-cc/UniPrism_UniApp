<template>
  <ProInteractionShell title="RGB 向量混合" hint="拖动三个通道，看颜色向量怎样叠加">
    <view class="rgb-preview" :style="{ backgroundColor: previewHex }" />
    <view class="channel-row" v-for="channel in channels" :key="channel.key">
      <text class="channel-label">{{ channel.label }}</text>
      <slider :value="color[channel.key]" :min="0" :max="255" :step="1" :activeColor="channel.color" block-size="18" @change="(e) => onChannelChange(channel.key, e)" @changing="(e) => onChannelChange(channel.key, e)" />
      <text class="channel-value">{{ color[channel.key] }}</text>
    </view>
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'

export default {
  name: 'ProRgbVectorBlend',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      color: { r: 180, g: 64, b: 220 },
      channels: [
        { key: 'r', label: 'R', color: '#ef4444' },
        { key: 'g', label: 'G', color: '#22c55e' },
        { key: 'b', label: 'B', color: '#3b82f6' },
      ],
    }
  },
  computed: {
    previewHex() {
      const { r, g, b } = this.color
      const toHex = (v) => v.toString(16).padStart(2, '0')
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    },
    metrics() {
      return [
        { label: '向量', value: `(${this.color.r}, ${this.color.g}, ${this.color.b})` },
        { label: '混合结果', value: this.previewHex.toUpperCase() },
        { label: '0.5 倍', value: `(${Math.round(this.color.r * 0.5)}, ${Math.round(this.color.g * 0.5)}, ${Math.round(this.color.b * 0.5)})` },
        { label: '封闭性', value: '仍是 RGB 颜色' },
      ]
    },
  },
  methods: {
    onChannelChange(key, e) {
      this.color[key] = Number(e.detail.value)
    },
  },
}
</script>

<style scoped>
.rgb-preview { width: 100%; height: 160rpx; border-radius: 16rpx; border: 2rpx solid #dbe7ef; margin-bottom: 16rpx; }
.channel-row { display: grid; grid-template-columns: 48rpx 1fr 72rpx; align-items: center; gap: 12rpx; margin-bottom: 8rpx; }
.channel-label { font-size: 26rpx; font-weight: 800; color: #102033; }
.channel-value { text-align: right; font-size: 24rpx; color: #64748b; }
</style>
