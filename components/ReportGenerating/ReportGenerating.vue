<template>
  <scroll-view class="generating-page" scroll-y>
    <!-- Page header -->
    <view class="gen-header">
      <text class="gen-header-title">正在生成你的专属生涯报告</text>
      <text class="gen-header-desc">系统正在根据你的答题记录、职业倾向和专业匹配等为你生成一份可执行的成长路径。</text>
    </view>

    <!-- Main card -->
    <view class="gen-card">
      <!-- Report artwork -->
      <view class="glyph-wrap">
        <view class="glyph-circle" aria-hidden="true">
          <view class="glyph-card">
            <view class="glyph-bar glyph-bar--purple" />
            <view class="glyph-bar glyph-bar--green" />
            <view class="glyph-bar glyph-bar--orange" />
          </view>
        </view>
      </view>

      <!-- Card title + status -->
      <text class="gen-card-title">综合报告生成中</text>
      <text v-if="progressDescription" class="gen-card-status">{{ progressLabel }}{{ progressDescription ? '，' + progressDescription : '' }}</text>

      <!-- Steps -->
      <view class="step-list">
        <view
          v-for="(step, index) in steps"
          :key="step.id"
          class="step-row"
        >
          <!-- icon -->
          <view class="step-dot" :class="'step-dot--' + stepStatus(index)">
            <text v-if="stepStatus(index) === 'complete'" class="step-check">✓</text>
            <view v-else-if="stepStatus(index) === 'active'" class="step-active-dot" />
            <text v-else-if="stepStatus(index) === 'error'" class="step-check">!</text>
          </view>
          <!-- title -->
          <view class="step-copy">
            <text class="step-title" :class="'step-title--' + stepStatus(index)">{{ stepTitle(step, index) }}</text>
            <text v-if="stepDescription(index)" class="step-desc">{{ stepDescription(index) }}</text>
          </view>
          <!-- status label -->
          <text class="step-label" :class="'step-label--' + stepStatus(index)">{{ stepStatusLabel(index) }}</text>
        </view>
      </view>

      <!-- Progress bar -->
      <view class="progress-row">
        <view class="progress-track">
          <view
            class="progress-fill"
            :class="{ 'progress-fill--error': progress.failedStep }"
            :style="{ width: visualProgress + '%' }"
          />
        </view>
        <text class="progress-pct" :class="{ 'progress-pct--error': progress.failedStep }">{{ Math.round(visualProgress) }}%</text>
      </view>
      <text v-if="progressLabel" class="progress-label">{{ progressLabel }}</text>

      <!-- Error block -->
      <view v-if="error" class="gen-error">
        <text class="gen-error-text">{{ error }}</text>
        <text class="gen-error-hint">重新生成只会再次生成报告；重新测试会从题目阶段重新开始。</text>
        <view class="gen-error-actions">
          <button class="gen-btn-regen" @tap="$emit('retry')">重新生成</button>
          <button class="gen-btn-retry" @tap="$emit('restart')">重新测试</button>
        </view>
      </view>
    </view>

    <!-- Bottom notice -->
    <view class="notice-card">
      <text class="notice-icon">ℹ</text>
      <text class="notice-text">报告生成完成后，在当前页面会自动进入解读页面；你也可以返回首页在点击查看报告进行查看结果。</text>
    </view>
  </scroll-view>
</template>

<script>
import {
  REPORT_GENERATION_VISUAL_STEPS,
  getProgressDescription,
  getProgressLabel,
  getVisualProgress,
  getVisualStepStatus,
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
    return {
      steps: REPORT_GENERATION_VISUAL_STEPS,
      elapsedSeconds: 0,
      tickTimer: null,
    }
  },
  computed: {
    visualProgress() {
      return getVisualProgress(this.liveProgress)
    },
    progressLabel() {
      return getProgressLabel(this.liveProgress)
    },
    progressDescription() {
      return getProgressDescription(this.liveProgress)
    },
    liveProgress() {
      if (this.progress.activeStep !== 'generate_report' || this.progress.backendStage) {
        return this.progress
      }
      return Object.assign({}, this.progress, {
        timerStartedAt: this.effectiveTimerStartedAt,
      })
    },
    effectiveTimerStartedAt() {
      if (typeof this.progress.timerStartedAt === 'number') {
        return this.progress.timerStartedAt
      }
      if (this.progress.activeStep === 'generate_report') {
        return Date.now() - this.elapsedSeconds * 1000
      }
      return null
    },
  },
  watch: {
    'progress.activeStep': {
      immediate: true,
      handler(value) {
        this.syncElapsedTimer(value === 'generate_report' && !this.progress.backendStage)
      },
    },
    'progress.backendStage': {
      handler(value) {
        if (value) {
          this.stopElapsedTimer()
        } else if (this.progress.activeStep === 'generate_report') {
          this.syncElapsedTimer(true)
        }
      },
    },
  },
  beforeUnmount() {
    this.stopElapsedTimer()
  },
  methods: {
    syncElapsedTimer(enabled) {
      this.stopElapsedTimer()
      if (!enabled) return
      const startedAt = typeof this.progress.timerStartedAt === 'number'
        ? this.progress.timerStartedAt
        : Date.now()
      this.elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
      this.tickTimer = setInterval(() => {
        this.elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
      }, 1000)
    },
    stopElapsedTimer() {
      if (this.tickTimer) {
        clearInterval(this.tickTimer)
        this.tickTimer = null
      }
    },
    stepStatus(index) {
      return getVisualStepStatus(index, this.liveProgress)
    },
    stepTitle(step, index) {
      if (this.stepStatus(index) === 'active' && this.progressLabel) {
        return this.progressLabel
      }
      return step.title
    },
    stepDescription(index) {
      if (this.stepStatus(index) === 'active' && this.progressDescription) {
        return this.progressDescription
      }
      return ''
    },
    stepStatusLabel(index) {
      const status = this.stepStatus(index)
      if (status === 'complete') return '已完成'
      if (status === 'active') return '进行中'
      if (status === 'error') return '未完成'
      return '等待中'
    },
  },
}
</script>

<style>
.generating-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f1e8fb 0%, #f7f3fb 42%, #eff1f5 100%);
  padding: 24rpx 32rpx 80rpx;
  box-sizing: border-box;
}

/* Page header */
.gen-header {
  padding: 18rpx 24rpx 28rpx;
  text-align: center;
}
.gen-header-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.45;
  color: #1c1c3a;
}
.gen-header-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.7;
  color: #687184;
}

/* Main card */
.gen-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 36rpx 32rpx 36rpx;
  box-shadow: 0 8rpx 32rpx rgba(100, 80, 160, 0.08);
}

/* Report artwork */
.glyph-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 20rpx;
}
.glyph-circle {
  width: 132rpx;
  height: 132rpx;
  border-radius: 50%;
  background: #eaf4ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.glyph-card {
  width: 66rpx;
  height: 78rpx;
  border-radius: 12rpx;
  background: #fff;
  box-shadow: 0 8rpx 18rpx rgba(36, 63, 110, 0.12);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8rpx;
  padding: 14rpx 10rpx;
  box-sizing: border-box;
}
.glyph-bar {
  width: 8rpx;
  border-radius: 999rpx;
}
.glyph-bar--purple {
  height: 24rpx;
  background: #7b4dff;
}
.glyph-bar--green {
  height: 34rpx;
  background: #82d928;
}
.glyph-bar--orange {
  height: 48rpx;
  background: #ffb53d;
}

/* Card title & status */
.gen-card-title {
  display: block;
  text-align: center;
  font-size: 30rpx;
  font-weight: 700;
  color: #1c1c3a;
  line-height: 1.45;
}
.gen-card-status {
  display: block;
  text-align: center;
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #687184;
}

/* Step list */
.step-list {
  margin-top: 36rpx;
}
.step-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 2rpx solid #f3f4f8;
}
.step-row:first-child {
  border-top: 2rpx solid #f3f4f8;
}

/* Step dot */
.step-dot {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-dot--complete { background: #52c41a; }
.step-dot--active   { background: #6b23ff; }
.step-dot--waiting  { background: #d4d4e0; }
.step-dot--error    { background: #ef4444; }
.step-check {
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
  line-height: 1;
}
.step-active-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #fff;
}

/* Step text */
.step-copy {
  flex: 1;
  min-width: 0;
}
.step-title {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #1c1c3a;
  line-height: 1.45;
}
.step-title--waiting { color: #8a8fa8; }
.step-desc {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  line-height: 1.45;
  color: #687184;
}
.step-label {
  flex-shrink: 0;
  font-size: 26rpx;
  font-weight: 600;
}
.step-label--complete { color: #52c41a; }
.step-label--active   { color: #6b23ff; }
.step-label--waiting  { color: #a6afbf; }
.step-label--error    { color: #ef4444; }

/* Progress bar */
.progress-row {
  margin-top: 32rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.progress-track {
  flex: 1;
  height: 14rpx;
  border-radius: 999rpx;
  background: #ece8f8;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 999rpx;
  background: #6b23ff;
  transition: width 0.5s ease;
}
.progress-fill--error { background: #ef4444; }
.progress-pct {
  flex-shrink: 0;
  font-size: 24rpx;
  font-weight: 600;
  color: #6b23ff;
}
.progress-pct--error { color: #ef4444; }
.progress-label {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #687184;
  line-height: 1.6;
}

/* Error block */
.gen-error {
  margin-top: 28rpx;
  padding: 24rpx;
  border-radius: 20rpx;
  border: 2rpx solid #fecaca;
  background: #fef2f2;
}
.gen-error-text {
  display: block;
  font-size: 28rpx;
  line-height: 1.6;
  color: #b91c1c;
  font-weight: 700;
}
.gen-error-hint {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #7f1d1d;
}
.gen-error-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}
.gen-btn-regen,
.gen-btn-retry {
  flex: 1;
  border-radius: 999rpx;
  height: 72rpx;
  line-height: 72rpx;
  font-size: 28rpx;
  font-weight: 700;
}
.gen-btn-regen {
  background: #fff;
  color: #6b23ff;
  border: 2rpx solid #d9cbff;
}
.gen-btn-retry {
  background: #6b23ff;
  color: #fff;
  border: none;
}

/* Bottom notice */
.notice-card {
  margin-top: 28rpx;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 24rpx 28rpx;
  border-radius: 20rpx;
  background: #e3dcf5;
}
.notice-icon {
  flex-shrink: 0;
  font-size: 28rpx;
  color: #6b23ff;
  line-height: 1.6;
  font-style: normal;
}
.notice-text {
  flex: 1;
  font-size: 24rpx;
  line-height: 1.8;
  color: #4b3d7a;
}
</style>
