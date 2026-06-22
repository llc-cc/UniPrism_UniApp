<template>
  <view class="page">
    <view class="header">
      <text class="title">学习</text>
      <text class="subtitle">系统化的学习模块正在建设中</text>
    </view>

    <view class="empty">
      <text class="empty-icon">📚</text>
      <text class="coming-soon">敬请期待</text>
      <text class="desc">课程学习与训练内容即将上线，你可以先在生涯规划中完成兴趣探索与专业体验。</text>
      <button class="btn-primary" @tap="goPlan">去生涯规划</button>
    </view>
  </view>
</template>

<script setup>
function goPlan() {
  uni.reLaunch({ url: '/pages/discover/index' })
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding: 48rpx 32rpx; box-sizing: border-box; }
.header { margin-bottom: 32rpx; }
.title { display: block; font-size: 44rpx; font-weight: 700; color: #1a2e2b; }
.subtitle { display: block; margin-top: 12rpx; font-size: 26rpx; color: #6b7280; }
.empty { background: #fff; border-radius: 28rpx; padding: 72rpx 40rpx; text-align: center; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.05); }
.empty-icon { font-size: 88rpx; display: block; margin-bottom: 24rpx; }
.coming-soon { font-size: 30rpx; color: #007a66; font-weight: 700; display: block; margin-bottom: 16rpx; }
.desc { font-size: 26rpx; color: #6b7280; line-height: 1.7; display: block; margin-bottom: 40rpx; }
.btn-primary { background: #007a66; color: #fff; border: none; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; font-weight: 600; padding: 0 64rpx; }
</style>
