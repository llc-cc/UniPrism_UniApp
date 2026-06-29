<template>
  <view class="page">
    <view v-for="item in stageItems" :key="item.idx" class="card">
      <text class="stage-label">{{ item.label }}</text>
      <view class="bar-wrap">
        <view class="bar-fill" :style="{ width: item.pct + '%' }" />
        <text class="bar-text">{{ item.count }}</text>
      </view>
    </view>
    <view class="card">
      <text class="stage-label">体验完成</text>
      <view class="bar-wrap bar-wrap--done" @tap="goDone">
        <text class="bar-text" :class="{ 'bar-text--active': isDone }">点击查看</text>
      </view>
    </view>
  </view>
</template>

<script>
import { loadMathProgress } from './business/math-progress'
import { MATH_ROADMAP_STAGES } from './business/math-roadmap-config'

export default {
  data() {
    return { unlockedStageIndexes: [0], isDone: false }
  },
  computed: {
    stageItems() {
      const labels = MATH_ROADMAP_STAGES.slice(0, 4).map(
        (stage) => `${stage.phase}：${stage.experienceLabel || stage.label}`,
      )
      const max = Math.max(...this.unlockedStageIndexes)
      return labels.map((label, idx) => ({
        idx,
        label,
        pct: idx < max ? 100 : idx === max ? 50 : 0,
        count: idx < max ? '已完成' : idx === max ? '进行中' : '未开始',
      }))
    },
  },
  onShow() {
    const p = loadMathProgress()
    this.unlockedStageIndexes = p.unlockedStageIndexes || [0]
    this.isDone = Boolean(p.completed)
  },
  onLoad() {
    uni.setNavigationBarTitle({ title: '学习进度' })
  },
  methods: {
    goDone() {
      if (this.isDone) {
        uni.navigateTo({ url: '/subpkg/math/index?stageIndex=4' })
      } else {
        uni.showToast({ title: '完成所有阶段后解锁', icon: 'none' })
      }
    },
  },
}
</script>

<style scoped>
.page { padding: 24rpx; background: #f8f8f8; min-height: 100vh; }
.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx 28rpx 24rpx;
  margin-bottom: 20rpx;
}
.stage-label { display: block; font-size: 28rpx; font-weight: 700; color: #1a1a1a; margin-bottom: 18rpx; }
.bar-wrap {
  height: 44rpx;
  border-radius: 999rpx;
  background: #f0f0f0;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 999rpx;
  background: #4cc8c1;
  transition: width 0.3s ease;
}
.bar-text { position: relative; z-index: 1; font-size: 22rpx; color: #999; padding-left: 16rpx; }
.bar-text--active { color: #4cc8c1; font-weight: 700; }
.bar-wrap--done { justify-content: center; }
.bar-wrap--done .bar-text { padding-left: 0; }
</style>
