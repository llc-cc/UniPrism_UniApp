<template>
  <view class="page">
    <view class="header">
      <text class="title">成就</text>
      <text class="subtitle">记录你在生涯规划里的探索足迹</text>
    </view>

    <view class="stat-row">
      <view class="stat-card">
        <text class="stat-value">{{ majorsExplored }}</text>
        <text class="stat-label">已体验专业</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ hasProfile ? 1 : 0 }}</text>
        <text class="stat-label">兴趣画像</text>
      </view>
    </view>

    <view class="panel">
      <text class="panel-title">当前已解锁</text>
      <view class="badge-list">
        <view class="badge-card" :class="{ 'badge-card--active': hasProfile }">
          <text class="badge-name">兴趣画像</text>
          <text class="badge-desc">{{ hasProfile ? '已完成基础测评并生成画像' : '完成兴趣探索后点亮' }}</text>
        </view>
        <view class="badge-card" :class="{ 'badge-card--active': majorsExplored > 0 }">
          <text class="badge-name">专业探索</text>
          <text class="badge-desc">{{ majorsExplored > 0 ? `已体验 ${majorsExplored} 个专业` : '进入专业体验后点亮' }}</text>
        </view>
      </view>
    </view>

    <view class="empty">
      <text class="coming-soon">更多成就体系即将上线</text>
      <text class="desc">完成兴趣探索、专业体验与职业模拟，这里会逐步点亮你的成就徽章。</text>
      <button class="btn-primary" @tap="goPlan">去生涯规划</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { loadDiscoverSession } from '../../business/discover-session-storage'
import { loadExploreProgress } from '../../business/explore-progress'

const majorsExplored = ref(0)
const hasProfile = ref(false)

onShow(() => {
  const session = loadDiscoverSession()
  const progress = loadExploreProgress()
  hasProfile.value = Boolean(session && session.profile)
  majorsExplored.value = (progress.majorsExplored || []).length
})

function goPlan() {
  uni.reLaunch({ url: '/pages/discover/index' })
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding: 48rpx 32rpx; box-sizing: border-box; }
.header { margin-bottom: 32rpx; }
.title { display: block; font-size: 44rpx; font-weight: 700; color: #1a2e2b; }
.subtitle { display: block; margin-top: 12rpx; font-size: 26rpx; color: #6b7280; }
.stat-row { display: flex; gap: 20rpx; margin-bottom: 40rpx; }
.stat-card { flex: 1; background: #fff; border-radius: 24rpx; padding: 32rpx; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.05); }
.stat-value { display: block; font-size: 48rpx; font-weight: 800; color: #007a66; }
.stat-label { display: block; margin-top: 10rpx; font-size: 24rpx; color: #6b7280; }
.panel { background: #fff; border-radius: 28rpx; padding: 32rpx; margin-bottom: 32rpx; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.05); }
.panel-title { display: block; font-size: 30rpx; color: #1a2e2b; font-weight: 700; margin-bottom: 24rpx; }
.badge-list { display: flex; flex-direction: column; gap: 20rpx; }
.badge-card { border-radius: 24rpx; padding: 28rpx; background: #f3f6f9; border: 2rpx solid transparent; }
.badge-card--active { background: rgba(0, 122, 102, 0.08); border-color: rgba(0, 122, 102, 0.18); }
.badge-name { display: block; font-size: 28rpx; color: #1a2e2b; font-weight: 700; }
.badge-desc { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.65; color: #6b7280; }
.empty { background: #fff; border-radius: 28rpx; padding: 56rpx 40rpx; text-align: center; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.05); }
.coming-soon { font-size: 30rpx; color: #007a66; font-weight: 700; display: block; margin-bottom: 16rpx; }
.desc { font-size: 26rpx; color: #6b7280; line-height: 1.7; display: block; margin-bottom: 40rpx; }
.btn-primary { background: #007a66; color: #fff; border: none; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; font-weight: 600; padding: 0 64rpx; }
</style>
