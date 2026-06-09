<template>
  <view class="page">
    <view class="icon-area">
      <text class="icon">...</text>
    </view>
    <text class="feature-name">{{ featureName }}</text>
    <text class="coming-soon">即将上线</text>
    <text class="desc">我们正在准备更完整的探索体验，请稍后再来查看。</text>
    <button class="btn-primary" @tap="goHome">返回首页</button>
  </view>
</template>

<script>
export default {
  data() {
    return { featureName: '该功能' }
  },
  onLoad(options) {
    if (options && options.name) this.featureName = decodeURIComponent(options.name)
  },
  methods: {
    goHome() {
      uni.reLaunch({ url: '/pages/discover/index' })
    },
  },
}
</script>

<style scoped>
.page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60rpx 48rpx; background: #f8fafc; text-align: center; }
.icon { font-size: 96rpx; display: block; margin-bottom: 32rpx; }
.feature-name { font-size: 36rpx; font-weight: 700; color: #1a2e2b; display: block; margin-bottom: 12rpx; }
.coming-soon { font-size: 28rpx; color: #007a66; font-weight: 600; display: block; margin-bottom: 20rpx; }
.desc { font-size: 26rpx; color: #6b7280; line-height: 1.7; display: block; margin-bottom: 48rpx; }
.btn-primary { background: #007a66; color: #fff; border: none; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; font-weight: 600; padding: 0 64rpx; }
</style>
