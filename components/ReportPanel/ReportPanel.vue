<template>
  <view class="report-panel">
    <text class="panel-title">AI 综合报告</text>

    <view v-if="!hasSession" class="hint-card">
      <text class="hint-text">完成兴趣问卷并成功同步后，可在此生成 AI 综合报告。</text>
    </view>

    <view v-else-if="loading" class="loading-card">
      <text class="loading-title">正在生成报告...</text>
      <text class="loading-step">{{ loadingStep }}</text>
    </view>

    <view v-else-if="error" class="error-card">
      <text class="error-text">{{ error }}</text>
      <button class="btn-retry" @tap="$emit('retry')">重试</button>
    </view>

    <view v-else-if="report" class="report-body">
      <text class="report-title">{{ report.title }}</text>
      <text class="report-summary">{{ report.summary }}</text>

      <view v-if="report.riasec && report.riasec.interpretation" class="section">
        <text class="section-label">兴趣解读</text>
        <text class="section-text">{{ report.riasec.interpretation }}</text>
      </view>

      <view v-if="personalityList.length" class="section">
        <text class="section-label">性格证据</text>
        <view v-for="(item, idx) in personalityList" :key="idx" class="list-card">
          <text class="list-title">{{ item.trait }}</text>
          <text class="list-body">{{ item.evidence }}</text>
        </view>
      </view>

      <view v-if="majorList.length" class="section">
        <text class="section-label">报告推荐专业</text>
        <view v-for="(item, idx) in majorList" :key="idx" class="list-card">
          <text class="list-title">{{ item.name }}</text>
          <text class="list-body">{{ item.reason }}</text>
          <text v-if="item.nextAction" class="list-action">{{ item.nextAction }}</text>
        </view>
      </view>

      <view v-if="careerList.length" class="section">
        <text class="section-label">报告推荐职业</text>
        <view v-for="(item, idx) in careerList" :key="idx" class="list-card">
          <text class="list-title">{{ item.name }} · {{ item.matchScore }}%</text>
          <text class="list-body">{{ item.reason }}</text>
        </view>
      </view>

      <view v-if="growthList.length" class="section">
        <text class="section-label">成长计划</text>
        <view v-for="(item, idx) in growthList" :key="idx" class="growth-item">
          <text class="growth-week">第 {{ item.week }} 周</text>
          <text class="growth-task">{{ item.task }}</text>
        </view>
      </view>

      <text v-if="report.disclaimer" class="disclaimer">{{ report.disclaimer }}</text>
    </view>

    <view v-else class="hint-card">
      <text class="hint-text">报告尚未生成，请稍后重试。</text>
      <button class="btn-retry" @tap="$emit('retry')">生成报告</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ReportPanel',
  props: {
    report: { type: Object, default: null },
    loading: { type: Boolean, default: false },
    error: { type: String, default: '' },
    hasSession: { type: Boolean, default: false },
    loadingStep: { type: String, default: '读取画像并生成报告' },
  },
  emits: ['retry'],
  computed: {
    personalityList() {
      return Array.isArray(this.report && this.report.personality) ? this.report.personality : []
    },
    majorList() {
      return Array.isArray(this.report && this.report.recommendedMajors) ? this.report.recommendedMajors : []
    },
    careerList() {
      return Array.isArray(this.report && this.report.recommendedCareers) ? this.report.recommendedCareers : []
    },
    growthList() {
      return Array.isArray(this.report && this.report.growthPlan) ? this.report.growthPlan : []
    },
  },
}
</script>

<style scoped>
.report-panel { margin-top: 32rpx; padding-top: 16rpx; border-top: 2rpx solid #eef2f7; }
.panel-title { display: block; font-size: 36rpx; font-weight: 700; color: #1f2937; margin-bottom: 24rpx; }
.hint-card, .loading-card, .error-card { background: #f9fafb; border: 1rpx solid #eef2f7; border-radius: 24rpx; padding: 32rpx; }
.hint-text, .loading-step, .error-text { font-size: 26rpx; color: #6b7280; line-height: 1.7; display: block; }
.loading-title { display: block; font-size: 28rpx; font-weight: 600; color: #0891b2; margin-bottom: 12rpx; }
.report-body { display: flex; flex-direction: column; gap: 24rpx; }
.report-title { font-size: 32rpx; font-weight: 700; color: #1f2937; display: block; }
.report-summary { font-size: 26rpx; color: #374151; line-height: 1.8; display: block; }
.section { background: #fff; border: 1rpx solid #e5e7eb; border-radius: 20rpx; padding: 24rpx; }
.section-label { display: block; font-size: 28rpx; font-weight: 600; color: #111827; margin-bottom: 16rpx; }
.section-text { font-size: 26rpx; color: #4b5563; line-height: 1.7; display: block; }
.list-card { background: #f8fafc; border-radius: 16rpx; padding: 20rpx; margin-bottom: 12rpx; }
.list-card:last-child { margin-bottom: 0; }
.list-title { display: block; font-size: 26rpx; font-weight: 600; color: #1f2937; margin-bottom: 8rpx; }
.list-body { display: block; font-size: 24rpx; color: #6b7280; line-height: 1.6; }
.list-action { display: block; font-size: 22rpx; color: #0891b2; margin-top: 8rpx; }
.growth-item { display: flex; gap: 16rpx; margin-bottom: 12rpx; }
.growth-week { font-size: 24rpx; color: #0891b2; min-width: 120rpx; }
.growth-task { font-size: 24rpx; color: #4b5563; line-height: 1.6; flex: 1; }
.disclaimer { display: block; font-size: 22rpx; color: #9ca3af; line-height: 1.6; margin-top: 8rpx; }
.btn-retry { margin-top: 20rpx; background: #007a66; color: #fff; border: none; border-radius: 40rpx; height: 72rpx; line-height: 72rpx; font-size: 26rpx; }
</style>
