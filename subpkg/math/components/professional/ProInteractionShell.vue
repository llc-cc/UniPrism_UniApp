<template>
  <view class="interaction-shell">
    <view class="interaction-head">
      <text class="interaction-title">{{ title }}</text>
      <text v-if="formula" class="interaction-formula">{{ formula }}</text>
    </view>
    <text v-if="hint" class="interaction-hint">{{ hint }}</text>
    <slot />
  </view>
</template>

<script>
export default {
  name: 'ProInteractionShell',
  props: {
    title: { type: String, default: '' },
    formula: { type: String, default: '' },
    hint: { type: String, default: '' },
  },
}
</script>

<style scoped>
.interaction-shell {
  margin: 24rpx 0;
  padding: 24rpx 0;
  border-top: 2rpx solid #e4edf1;
  border-bottom: 2rpx solid #e4edf1;
}
.interaction-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 12rpx 24rpx;
}
.interaction-title {
  font-size: 40rpx;
  font-weight: 600;
  color: #102033;
}
.interaction-formula {
  font-size: 28rpx;
  color: #087f7a;
}
.interaction-hint {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #5a6675;
}
</style>
