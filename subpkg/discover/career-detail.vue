<template>
  <scroll-view v-if="career" class="page" scroll-y>
    <image class="hero-image" :src="resolveAsset(career.heroImage)" mode="aspectFill" />
    <view class="hero-copy">
      <view class="hero-top">
        <view>
          <text class="hero-title">{{ career.title }}</text>
          <text class="hero-badge">{{ career.badge }}</text>
          <text v-if="career.track" class="hero-track">{{ career.track }}</text>
        </view>
        <text class="hero-status" :class="{ 'hero-status-done': explored }">
          {{ explored ? '已体验' : '待体验' }}
        </text>
      </view>
      <text class="hero-summary">{{ career.summary }}</text>
      <view class="hero-tags">
        <text class="hero-tag" :class="careerAvailable ? 'hero-tag-live' : (careerPreviewAvailable ? 'hero-tag-preview' : 'hero-tag-soon')">
          {{ careerAvailable ? '已接入完整模拟' : (careerPreviewAvailable ? '预览占位已接入' : '当前仍为占位入口') }}
        </text>
      </view>
    </view>

    <view v-if="canEnterExperience" class="panel panel-live">
      <text class="section-title">{{ careerAvailable ? '完整职业模拟' : '职业模拟预览' }}</text>
      <text class="live-desc">{{ careerAvailable ? '与 Web 端一致，包含职业概览、研究任务、情境模拟、成长路径和体验记录共 7 页内容。' : 'Web 端正文尚未接入。小程序已预留占位流程，可先浏览任务结构。' }}</text>
      <button class="btn-start" @tap="startExperience">{{ careerAvailable ? '开始职业模拟' : '进入预览流程' }}</button>
    </view>

    <view class="panel">
      <text class="section-title">体验流程预览</text>
      <view v-for="(step, idx) in career.steps" :key="idx" class="step-card">
        <view class="step-head">
          <text class="step-index">{{ formatStepIndex(idx) }}</text>
          <text class="step-title">{{ step.title }}</text>
        </view>
        <text class="step-body">{{ step.body }}</text>
        <image v-if="canEnterExperience" class="step-image" :src="resolveAsset(step.image)" mode="widthFix" />
      </view>
    </view>

    <view class="panel">
      <text class="section-title">相关专业</text>
      <view class="tag-row">
        <text v-for="item in relatedMajorLabels" :key="item" class="tag">{{ item }}</text>
      </view>
    </view>

    <view v-if="!careerAvailable" class="panel panel-placeholder">
      <text class="section-title">当前接入状态</text>
      <text class="placeholder-text">Web 端当前只有「数学家」接入了完整职业模拟，其余职业仍保留为占位入口。</text>
      <text class="placeholder-text">小程序端已同步数学家完整体验；其他职业可先看预览，不会记录为已完成体验。</text>
    </view>

    <view class="footer-actions">
      <button class="btn-ghost" @tap="goBack">返回职业列表</button>
      <button
        v-if="canEnterExperience"
        class="btn-primary"
        @tap="startExperience"
      >
        {{ careerAvailable ? (explored ? '再次体验' : '进入完整模拟') : '进入预览流程' }}
      </button>
      <button
        v-else
        class="btn-primary btn-primary-disabled"
        disabled
      >
        完整模拟待接入
      </button>
    </view>
  </scroll-view>
</template>

<script>
import { getCareerById, getMajorById } from '../../business/explore-data'
import { loadExploreProgress } from '../../business/explore-progress'
import { getCareerExperienceKind, openCareerSimulation } from '../../business/career-config'
import { resolveAsset } from '../../utils/asset-map'

export default {
  data() {
    return {
      career: null,
      explored: false,
      majorId: '',
    }
  },
  computed: {
    careerAvailable() {
      return this.career && getCareerExperienceKind(this.career.id) === 'live'
    },
    careerPreviewAvailable() {
      return this.career && getCareerExperienceKind(this.career.id) === 'preview'
    },
    canEnterExperience() {
      return this.career && getCareerExperienceKind(this.career.id) !== 'none'
    },
    relatedMajorLabels() {
      if (!this.career) return []
      return (this.career.relatedMajors || []).map((majorId) => {
        const major = getMajorById(majorId)
        return (major && (major.shortTitle || major.title)) || majorId
      })
    },
  },
  onLoad(query) {
    const pageQuery = query || {}
    const progress = loadExploreProgress()
    this.career = getCareerById(pageQuery.id)
    this.majorId = pageQuery.majorId || ''
    this.explored = Boolean(this.career && (progress.careersExplored || []).includes(this.career.id))
    if (this.career) {
      uni.setNavigationBarTitle({ title: this.career.title })
    }
  },
  methods: {
    resolveAsset,
    formatStepIndex(idx) {
      const value = Number(idx) + 1
      return value < 10 ? `0${value}` : String(value)
    },
    goBack() {
      uni.navigateBack()
    },
    startExperience() {
      if (!this.canEnterExperience || !this.career) return
      openCareerSimulation(this.career.id, this.majorId)
    },
  },
}
</script>

<style scoped>
.page { background: #f4f7fb; padding-bottom: 16rpx; }
.hero-image { width: 100%; height: 360rpx; }
.hero-copy { margin: -44rpx 24rpx 0; border-radius: 28rpx; background: #fff; padding: 28rpx; position: relative; z-index: 2; box-shadow: 0 18rpx 48rpx rgba(15,23,42,0.08); }
.hero-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 18rpx; }
.hero-title { display: block; font-size: 38rpx; font-weight: 700; color: #162033; }
.hero-badge { display: block; margin-top: 10rpx; font-size: 22rpx; color: #7c3aed; }
.hero-track { display: inline-block; margin-top: 10rpx; margin-left: 0; padding: 6rpx 14rpx; border-radius: 999rpx; background: #f1f5f9; font-size: 20rpx; color: #64748b; }
.hero-status { padding: 10rpx 18rpx; border-radius: 999rpx; background: #f1f5f9; font-size: 20rpx; font-weight: 700; color: #64748b; }
.hero-status-done { background: #ecfdf5; color: #047857; }
.hero-summary { display: block; margin-top: 16rpx; font-size: 25rpx; line-height: 1.75; color: #566070; }
.hero-tags { margin-top: 18rpx; }
.hero-tag { display: inline-block; padding: 10rpx 18rpx; border-radius: 999rpx; font-size: 20rpx; font-weight: 700; }
.hero-tag-live { background: #ede9fe; color: #6d28d9; }
.hero-tag-preview { background: #fff7ed; color: #c2410c; }
.hero-tag-soon { background: #f1f5f9; color: #64748b; }

.panel { margin: 24rpx; border-radius: 28rpx; background: #fff; padding: 28rpx; box-shadow: 0 14rpx 38rpx rgba(15,23,42,0.05); }
.panel-live { background: linear-gradient(180deg, #f7fffd 0%, #ffffff 100%); border: 1rpx solid #d8f1e9; }
.panel-placeholder { background: #fffaf5; }
.section-title { display: block; font-size: 30rpx; font-weight: 700; color: #162033; }
.live-desc { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.75; color: #566070; }
.btn-start { margin-top: 22rpx; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; background: linear-gradient(90deg, #00a889 0%, #1cb0f6 100%); color: #fff; font-size: 28rpx; font-weight: 700; }
.step-card { margin-top: 22rpx; padding: 24rpx; border-radius: 24rpx; background: #f8fafc; }
.step-head { display: flex; align-items: center; gap: 16rpx; }
.step-index { display: inline-block; padding: 8rpx 18rpx; border-radius: 999rpx; background: #ede9fe; color: #6d28d9; font-size: 20rpx; font-weight: 700; }
.step-title { font-size: 28rpx; font-weight: 700; color: #162033; }
.step-body { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.75; color: #566070; }
.step-image { width: 100%; margin-top: 18rpx; border-radius: 20rpx; }
.tag-row { display: flex; flex-wrap: wrap; gap: 14rpx; margin-top: 20rpx; }
.tag { padding: 14rpx 22rpx; border-radius: 999rpx; background: #f3f4f6; font-size: 22rpx; color: #334155; }
.placeholder-text { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.75; color: #6b7280; }
.footer-actions { display: flex; gap: 16rpx; padding: 0 24rpx 36rpx; }
.btn-ghost, .btn-primary { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; font-size: 28rpx; font-weight: 700; }
.btn-ghost { background: #eef2f7; color: #475569; }
.btn-primary { background: linear-gradient(90deg, #00a889 0%, #1cb0f6 100%); color: #fff; }
.btn-primary-disabled { opacity: 0.5; }
</style>
