<template>
  <scroll-view class="generating-page" scroll-y>
    <view class="generating-card">
      <view class="generating-left">
        <text class="generating-badge">报告生成中</text>
        <text class="generating-title">正在生成你的综合报告</text>
        <text class="generating-desc">我们正在把你的答题记录、职业倾向和专业匹配整理成一份可读报告。</text>
        <view v-if="progress.backendTitle" class="generating-backend">
          <text class="generating-backend-title">{{ progress.backendTitle }}</text>
          <text v-if="progress.backendDescription" class="generating-backend-desc">{{ progress.backendDescription }}</text>
        </view>
        <view class="generating-bar-track">
          <view
            class="generating-bar-fill"
            :class="{ 'generating-bar-fill--error': progress.failedStep }"
            :style="{ width: visualProgress + '%' }"
          />
        </view>
        <view v-if="error" class="generating-error">
          <text class="generating-error-text">{{ error }}</text>
          <text class="generating-error-hint">重新生成只会再次生成报告；重新测试会从题目阶段重新开始。</text>
          <view class="generating-actions">
            <button class="generating-regenerate" @tap="$emit('retry')">重新生成</button>
            <button class="generating-retry" @tap="$emit('restart')">重新测试</button>
          </view>
        </view>
      </view>

      <view class="step-list">
        <view
          v-for="(step, index) in steps"
          :key="step.id"
          class="step-item"
          :class="'step-item--' + stepStatus(step.id)"
        >
          <view class="step-icon" :class="'step-icon--' + stepStatus(step.id)">
            <text class="step-icon-text">{{ stepIconText(step.id, index) }}</text>
          </view>
          <view class="step-body">
            <text class="step-title">{{ step.title }}</text>
            <text class="step-desc">{{ step.description }}</text>
          </view>
          <text class="step-status" :class="'step-status--' + stepStatus(step.id)">{{ stepStatusLabel(step.id) }}</text>
        </view>
      </view>
    </view>

    <view v-for="n in 3" :key="'sk-' + n" class="skeleton-card" />
  </scroll-view>
</template>

<script>
import {
  REPORT_GENERATION_STEPS,
  getStepStatus,
  getVisualProgress,
} from '../../business/report-generation'

export default {
  name: 'ReportGenerating',
  props: {
    progress: {
      type: Object,
      default: () => ({ activeStep: 'read_answers', completedSteps: [] }),
    },
    error: { type: String, default: '' },
  },
  emits: ['retry', 'restart'],
  data() {
    return { steps: REPORT_GENERATION_STEPS }
  },
  computed: {
    visualProgress() {
      return getVisualProgress(this.progress)
    },
  },
  methods: {
    stepStatus(stepId) {
      return getStepStatus(stepId, this.progress)
    },
    stepStatusLabel(stepId) {
      const status = this.stepStatus(stepId)
      if (status === 'complete') return '已完成'
      if (status === 'active') return '进行中'
      if (status === 'error') return '未完成'
      return '等待中'
    },
    stepIconText(stepId, index) {
      const status = this.stepStatus(stepId)
      if (status === 'complete') return '✓'
      if (status === 'error') return '!'
      return String(index + 1)
    },
  },
}
</script>

<style scoped>
.generating-page {
  min-height: 100vh;
  background: linear-gradient(184deg, #8c86ff 0%, #d8d4ff 20%, #f4f6f8 58%, #f4f6f8 100%);
  padding: 32rpx 24rpx 48rpx;
  box-sizing: border-box;
}
.generating-card {
  background: #fff;
  border-radius: 50rpx;
  box-shadow: 0 8rpx 64rpx rgba(0, 0, 0, 0.06);
  padding: 40rpx 32rpx;
}
.generating-left { margin-bottom: 40rpx; }
.generating-badge {
  display: inline-block;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  background: #f3edff;
  color: #6b23ff;
  font-size: 26rpx;
  font-weight: 700;
}
.generating-title {
  display: block;
  margin-top: 32rpx;
  font-size: 56rpx;
  line-height: 1.35;
  color: #283248;
  font-weight: 700;
}
.generating-desc {
  display: block;
  margin-top: 24rpx;
  font-size: 30rpx;
  line-height: 1.9;
  color: #596275;
}
.generating-backend {
  margin-top: 28rpx;
  padding: 20rpx 24rpx;
  border-radius: 28rpx;
  background: #f6f3ff;
}
.generating-backend-title {
  display: block;
  font-size: 28rpx;
  line-height: 1.5;
  color: #4f2db8;
  font-weight: 700;
}
.generating-backend-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #6b5fa7;
}
.generating-bar-track {
  margin-top: 40rpx;
  height: 24rpx;
  border-radius: 999rpx;
  background: #e6e2ff;
  overflow: hidden;
}
.generating-bar-fill {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #6b23ff, #9762ff, #ffde3e);
  transition: width 0.5s ease;
}
.generating-bar-fill--error { background: #ef4444; }
.generating-error {
  margin-top: 32rpx;
  padding: 24rpx;
  border-radius: 32rpx;
  border: 2rpx solid #fecaca;
  background: #fef2f2;
}
.generating-error-text {
  display: block;
  font-size: 28rpx;
  line-height: 1.6;
  color: #b91c1c;
  font-weight: 700;
}
.generating-error-hint {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #7f1d1d;
}
.generating-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}
.generating-regenerate,
.generating-retry {
  flex: 1;
  border-radius: 22rpx;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  font-weight: 700;
}
.generating-regenerate {
  background: #fff;
  color: #6b23ff;
  border: 2rpx solid #c4b5fd;
}
.generating-retry {
  background: #6b23ff;
  color: #fff;
  border: none;
}
.step-list { display: flex; flex-direction: column; gap: 16rpx; }
.step-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  border-radius: 36rpx;
  border: 2rpx solid #e4e7f0;
  background: #fff;
}
.step-item--complete { border-color: #c8bbff; background: #fbf9ff; }
.step-item--active {
  border-color: #9762ff;
  background: #f5f1ff;
  box-shadow: 0 12rpx 36rpx rgba(107, 35, 255, 0.12);
}
.step-item--error { border-color: #fecaca; background: #fef2f2; }
.step-icon {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-icon--complete { background: #6b23ff; }
.step-icon--active { background: #ffde3e; }
.step-icon--waiting { background: #eef1f7; }
.step-icon--error { background: #ef4444; }
.step-icon-text { font-size: 28rpx; font-weight: 700; }
.step-icon--complete .step-icon-text,
.step-icon--error .step-icon-text { color: #fff; }
.step-icon--active .step-icon-text { color: #4f2db8; }
.step-icon--waiting .step-icon-text { color: #8e97a8; }
.step-body { flex: 1; min-width: 0; }
.step-title {
  display: block;
  font-size: 30rpx;
  line-height: 1.45;
  color: #283248;
  font-weight: 700;
}
.step-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.55;
  color: #687184;
}
.step-status {
  flex-shrink: 0;
  font-size: 24rpx;
  font-weight: 700;
}
.step-status--complete { color: #6b23ff; }
.step-status--active { color: #4f2db8; }
.step-status--waiting { color: #9aa3b4; }
.step-status--error { color: #dc2626; }
.skeleton-card {
  margin-top: 24rpx;
  height: 360rpx;
  border-radius: 50rpx;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 8rpx 64rpx rgba(0, 0, 0, 0.04);
}
</style>
