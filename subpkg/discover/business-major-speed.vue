<template>
  <view v-if="meta" class="page">
    <view class="topbar" :style="{ background: meta.accent }">
      <view class="topbar-row">
        <text class="topbar-title">{{ meta.labelLong }}</text>
        <text class="topbar-en">{{ meta.en }}</text>
      </view>
      <text class="page-indicator">{{ pageIndex + 1 }} / {{ pages.length }} · {{ currentPage.label }}</text>

      <view class="stage-row">
        <view
          v-for="(stage, idx) in meta.stages"
          :key="stage.title"
          class="stage-pill"
          :class="{
            'stage-pill--active': activeStageIndex === idx,
            'stage-pill--done': idx < activeStageIndex,
          }"
          @tap="jumpToStage(idx)"
        >
          <text class="stage-pill-text">{{ stage.title }}</text>
        </view>
      </view>

      <scroll-view v-if="activeStageIndex === 0" scroll-x class="section-nav" :show-scrollbar="false" enable-flex>
        <view class="section-nav-row">
          <view
            v-for="(section, idx) in contentSections"
            :key="section.id"
            class="section-pill"
            :class="{ 'section-pill--active': pageIndex === idx }"
            @tap="jumpToPage(idx)"
          >
            <text class="section-pill-text">{{ section.title }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view class="body" scroll-y :scroll-top="scrollTop">
      <view v-if="currentPage.type === 'section'" class="stage">
        <view class="section-header">
          <text class="section-role">{{ currentPage.role }}</text>
          <text class="section-title">{{ currentPage.title }}</text>
        </view>
        <BusinessContentRenderer :items="currentPage.content" :accent="meta.accent" />
      </view>

      <view v-else-if="currentPage.type === 'quiz'" class="stage">
        <view class="section-header">
          <text class="section-role">选择题测验 / 自动批改 / 互动复盘</text>
          <text class="section-title">{{ meta.labelLong }}章末测验</text>
        </view>
        <BusinessQuizPanel
          :questions="quizQuestions"
          :accent="meta.accent"
          @completed="onQuizCompleted"
        />
      </view>

      <view v-else-if="currentPage.type === 'complete'" class="stage stage-complete">
        <text class="complete-badge">体验完成</text>
        <text class="complete-title">{{ meta.labelLong }}章末测验已完成</text>
        <text class="complete-desc">你已经完成商学院 {{ meta.labelLong }} 的专业内容阅读与章末测验。可以返回专业列表继续探索其他学院。</text>
      </view>
    </scroll-view>

    <view class="footer">
      <button class="footer-btn footer-btn-ghost" :disabled="pageIndex <= 0" @tap="prevPage">上一页</button>
      <button class="footer-btn" :style="{ background: meta.accent }" @tap="nextPage">{{ nextLabel }}</button>
    </view>
  </view>

  <view v-else class="empty-page">
    <text class="empty-title">暂未接入该商学院内容</text>
    <text class="empty-desc">该专业内容正在按 Web 端同步中。</text>
    <button class="footer-btn footer-btn-ghost" @tap="goBack">返回</button>
  </view>
</template>

<script>
import { markMajorExplored } from '../../business/explore-progress'
import { BUSINESS_COLLEGE_META } from './business/business-college-meta'
import { getBusinessSections } from './business/business-college-sections'
import { getBusinessQuiz } from './business/business-college-quiz'
import BusinessContentRenderer from './components/business/BusinessContentRenderer.vue'
import BusinessQuizPanel from './components/business/BusinessQuizPanel.vue'

const SNAPSHOT_PREFIX = 'business-major-speed:'

export default {
  components: { BusinessContentRenderer, BusinessQuizPanel },
  data() {
    return {
      majorId: '',
      meta: null,
      contentSections: [],
      quizQuestions: [],
      pageIndex: 0,
      scrollTop: 0,
      quizDone: false,
    }
  },
  computed: {
    pages() {
      const sectionPages = this.contentSections.map((section) => ({
        type: 'section',
        id: section.id,
        title: section.title,
        role: section.role,
        label: section.title,
        content: section.content,
        stageIndex: 0,
      }))
      return [
        ...sectionPages,
        {
          type: 'quiz',
          id: 'chapter-quiz',
          title: '章末测验',
          label: '章末测验',
          stageIndex: 1,
        },
        {
          type: 'complete',
          id: 'complete',
          title: '体验完成',
          label: '体验完成',
          stageIndex: 1,
        },
      ]
    },
    currentPage() {
      return this.pages[this.pageIndex] || { type: 'section', label: '', content: [] }
    },
    activeStageIndex() {
      return this.currentPage.stageIndex || 0
    },
    nextLabel() {
      if (this.currentPage.type === 'quiz') return this.quizDone ? '查看完成页' : '请先提交测验'
      if (this.pageIndex >= this.pages.length - 1) return '完成并返回'
      return '下一页'
    },
  },
  onLoad(query) {
    this.majorId = query?.id || ''
    this.meta = BUSINESS_COLLEGE_META[this.majorId] || null
    this.contentSections = getBusinessSections(this.majorId) || []
    this.quizQuestions = getBusinessQuiz(this.majorId) || []
    if (!this.meta || !this.contentSections.length) return
    this.restoreSnapshot()
    uni.setNavigationBarTitle({ title: this.meta.labelLong })
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    jumpToPage(index) {
      if (index < 0 || index >= this.pages.length) return
      this.pageIndex = index
      this.scrollTop = this.scrollTop === 0 ? 1 : 0
      this.saveSnapshot()
    },
    jumpToStage(stageIndex) {
      if (stageIndex === 0) {
        this.jumpToPage(0)
        return
      }
      const quizIndex = this.pages.findIndex((page) => page.type === 'quiz')
      if (quizIndex >= 0) this.jumpToPage(quizIndex)
    },
    prevPage() {
      if (this.pageIndex <= 0) return
      this.pageIndex -= 1
      this.scrollTop = this.scrollTop === 0 ? 1 : 0
      this.saveSnapshot()
    },
    nextPage() {
      if (this.currentPage.type === 'quiz' && !this.quizDone) {
        uni.showToast({ title: '请先提交章末测验', icon: 'none' })
        return
      }
      if (this.pageIndex >= this.pages.length - 1) {
        markMajorExplored(this.majorId)
        this.saveSnapshot()
        uni.navigateBack()
        return
      }
      this.pageIndex += 1
      this.scrollTop = this.scrollTop === 0 ? 1 : 0
      this.saveSnapshot()
    },
    onQuizCompleted() {
      this.quizDone = true
      markMajorExplored(this.majorId)
      this.saveSnapshot()
    },
    saveSnapshot() {
      if (!this.majorId) return
      uni.setStorageSync(`${SNAPSHOT_PREFIX}${this.majorId}`, {
        pageIndex: this.pageIndex,
        quizDone: this.quizDone,
        updatedAt: Date.now(),
      })
    },
    restoreSnapshot() {
      const stored = uni.getStorageSync(`${SNAPSHOT_PREFIX}${this.majorId}`)
      if (!stored || typeof stored !== 'object') return
      const maxIndex = this.pages.length - 1
      this.pageIndex = Math.min(Math.max(0, Number(stored.pageIndex) || 0), maxIndex)
      this.quizDone = Boolean(stored.quizDone)
    },
  },
}
</script>

<style>
page { background: #f5f6fa; }
</style>

<style scoped>
.page { min-height: 100vh; display: flex; flex-direction: column; background: #f5f6fa; }
.topbar { padding: 24rpx 24rpx 20rpx; color: #fff; }
.topbar-row { display: flex; align-items: baseline; gap: 16rpx; }
.topbar-title { font-size: 36rpx; font-weight: 800; }
.topbar-en { font-size: 24rpx; opacity: 0.88; }
.page-indicator { display: block; margin-top: 12rpx; font-size: 22rpx; opacity: 0.92; }
.stage-row { display: flex; gap: 12rpx; margin-top: 18rpx; }
.stage-pill { padding: 10rpx 22rpx; border-radius: 999rpx; background: rgba(255,255,255,0.18); }
.stage-pill--active { background: rgba(255,255,255,0.95); }
.stage-pill--done { background: rgba(255,255,255,0.42); }
.stage-pill-text { font-size: 22rpx; font-weight: 700; color: #fff; }
.stage-pill--active .stage-pill-text { color: #1d1d1f; }
.section-nav { margin-top: 16rpx; white-space: nowrap; }
.section-nav-row { display: flex; gap: 10rpx; padding-bottom: 4rpx; }
.section-pill { padding: 8rpx 18rpx; border-radius: 999rpx; background: rgba(255,255,255,0.16); flex-shrink: 0; }
.section-pill--active { background: rgba(255,255,255,0.95); }
.section-pill-text { font-size: 20rpx; font-weight: 600; color: #fff; }
.section-pill--active .section-pill-text { color: #1d1d1f; }
.body { flex: 1; height: 0; padding: 24rpx; box-sizing: border-box; }
.stage { background: #fff; border-radius: 28rpx; padding: 28rpx; box-shadow: 0 8rpx 28rpx rgba(15,23,42,0.05); }
.section-header { margin-bottom: 24rpx; padding-bottom: 16rpx; border-bottom: 1rpx solid #eef2f7; }
.section-role { display: block; font-size: 22rpx; color: #64748b; margin-bottom: 8rpx; }
.section-title { display: block; font-size: 34rpx; font-weight: 800; color: #1d1d1f; }
.stage-complete { text-align: center; padding: 48rpx 28rpx; }
.complete-badge { display: inline-block; padding: 8rpx 18rpx; border-radius: 999rpx; background: #ecfdf5; color: #047857; font-size: 22rpx; font-weight: 700; }
.complete-title { display: block; margin-top: 20rpx; font-size: 34rpx; font-weight: 800; color: #1d1d1f; }
.complete-desc { display: block; margin-top: 16rpx; font-size: 26rpx; line-height: 1.8; color: #475569; }
.footer { display: flex; gap: 16rpx; padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom)); background: #fff; border-top: 1rpx solid #e8edf3; }
.footer-btn { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; color: #fff; font-size: 28rpx; font-weight: 700; border: none; }
.footer-btn-ghost { background: #f1f5f9 !important; color: #334155 !important; }
.empty-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48rpx; gap: 16rpx; }
.empty-title { font-size: 32rpx; font-weight: 700; color: #1d1d1f; }
.empty-desc { font-size: 26rpx; color: #64748b; text-align: center; }
</style>
