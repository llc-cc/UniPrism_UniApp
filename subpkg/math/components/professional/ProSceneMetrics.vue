<template>
  <view class="metric-grid">
    <view v-for="item in items" :key="item.label" class="metric-item">
      <text class="metric-label">{{ item.label }}</text>
      <text class="metric-value">{{ item.value }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ProSceneMetrics',
  props: {
    items: { type: Array, default: () => [] },
  },
}
</script>

<style scoped>
.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 20rpx;
}
.metric-item {
  border-top: 2rpx solid #e3ebf3;
  padding-top: 12rpx;
}
.metric-label {
  display: block;
  font-size: 22rpx;
  color: #64748b;
  font-weight: 700;
}
.metric-value {
  display: block;
  margin-top: 4rpx;
  font-size: 28rpx;
  color: #102033;
  font-weight: 600;
  word-break: break-all;
}
</style>
