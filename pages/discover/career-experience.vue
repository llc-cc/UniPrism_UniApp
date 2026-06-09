<template>
  <view v-if="ready && experience" class="page">
    <view class="topbar" :style="{ background: experience.accentGradient }">
      <view class="topbar-row">
        <text class="topbar-title">{{ navTitle }}</text>
        <text class="topbar-en">{{ navEn }}</text>
      </view>
      <text class="page-indicator">{{ pageIndex + 1 }} / {{ pages.length }} · {{ currentPage.title }}</text>
      <view v-if="experienceKind === 'live'" class="steps">
        <view
          v-for="(stage, idx) in stages"
          :key="stage.key"
          class="step-dot"
          :class="{
            'step-dot-active': idx === activeStageIndex,
            'step-dot-done': unlockedStageIndexes.includes(idx) && idx < activeStageIndex,
            'step-dot-locked': !unlockedStageIndexes.includes(idx),
          }"
          @tap="jumpToStage(idx)"
        >
          <text class="step-index">{{ idx + 1 }}</text>
          <text class="step-label">{{ stage.label }}</text>
        </view>
      </view>
      <text v-if="majorLabel" class="major-context">基于专业：{{ majorLabel }}</text>
    </view>

    <scroll-view class="body" scroll-y :scroll-top="scrollTop">
      <view class="stage">
        <text v-if="experienceKind === 'preview' && pageIndex === 0" class="preview-badge">预览占位 · 完整模拟筹备中</text>
        <text class="page-title">{{ currentPage.pageTitle }}</text>
        <text v-if="currentPage.pageSubtitle" class="page-subtitle">{{ currentPage.pageSubtitle }}</text>

        <view v-if="currentPage.lead && currentPage.lead.length" class="lead-block">
          <text v-for="(line, idx) in currentPage.lead" :key="idx" class="lead-line">{{ line }}</text>
        </view>

        <template v-if="currentPage.type === 'article'">
          <view
            v-for="card in currentPage.cards"
            :key="card.title"
            class="intro-card"
          >
          <view class="intro-copy">
            <view class="intro-head">
              <text class="intro-index" :style="{ background: card.toneStyle.bg, color: card.toneStyle.color }">{{ card.index }}</text>
              <text class="intro-title">{{ card.title }}</text>
            </view>
            <text class="intro-body">{{ card.body }}</text>
          </view>
          <image class="intro-image" :src="resolveAsset(card.imageSrc)" mode="widthFix" />
          </view>
        </template>

        <!-- 情境简报 -->
        <template v-else-if="currentPage.type === 'scenario-brief'">
          <view class="intro-card intro-card-single">
            <view class="intro-copy">
              <view class="intro-head">
                <text
                  class="intro-index"
                  :style="{ background: currentPage.briefCard.toneStyle.bg, color: currentPage.briefCard.toneStyle.color }"
                >{{ currentPage.briefCard.index }}</text>
                <text class="intro-title">{{ currentPage.briefCard.title }}</text>
              </view>
              <text class="intro-body">{{ currentPage.briefCard.body }}</text>
            </view>
            <image class="intro-image" :src="resolveAsset(currentPage.briefCard.imageSrc)" mode="widthFix" />
          </view>
          <view class="tag-grid">
            <text v-for="tag in currentPage.briefTags" :key="tag" class="tag-chip">{{ tag }}</text>
          </view>
        </template>

        <!-- 情境任务：路线选择 -->
        <template v-else-if="currentPage.type === 'scenario-task'">
          <view
            v-for="(option, idx) in currentPage.routeOptions"
            :key="option.id"
            class="route-card"
            :class="{ 'route-card-active': selectedPath === option.id }"
            @tap="selectPath(option.id)"
          >
            <view class="route-head">
              <text class="route-index">{{ formatCardIndex(idx) }}</text>
              <text class="route-badge">{{ option.badge }}</text>
            </view>
            <text class="route-title">{{ option.title }}</text>
            <text class="route-body">{{ option.body }}</text>
            <text class="route-action">{{ selectedPath === option.id ? '已选择' : '选择路线' }}</text>
          </view>

          <view class="feedback-panel">
            <text class="feedback-label">研究记录</text>
            <text class="feedback-title">{{ feedbackTitle }}</text>
            <text class="feedback-body">{{ feedbackBody }}</text>
          </view>
        </template>

        <template v-else-if="currentPage.type === 'preview-welcome'">
          <image v-if="currentPage.heroImage" class="preview-hero" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        </template>

        <template v-else-if="currentPage.type === 'preview-step'">
          <text class="preview-step-body">{{ currentPage.body }}</text>
          <image v-if="currentPage.image" class="preview-step-image" :src="resolveAsset(currentPage.image)" mode="widthFix" />
        </template>

        <template v-else-if="currentPage.type === 'preview-final'">
          <view class="placeholder-panel">
            <text class="placeholder-title">该职业完整模拟尚未接入</text>
            <text class="placeholder-body">当前为占位预览流程，不会记录为已完成职业体验。数学家职业已提供完整模拟，可先完成数学家体验后再回来比较。</text>
          </view>
        </template>
      </view>
    </scroll-view>

    <view class="footer">
      <button v-if="pageIndex > 0" class="btn-ghost" @tap="prevPage">上一页</button>
      <button class="btn-primary" :style="{ background: experience.accentGradient }" @tap="nextPage">
        {{ nextLabel }}
      </button>
    </view>
  </view>

  <view v-else-if="ready" class="empty-page">
    <text class="empty-title">暂未接入该职业模拟</text>
    <text class="empty-desc">当前职业尚未接入体验流程。</text>
    <button class="btn-ghost" @tap="goBack">返回</button>
  </view>
</template>

<script>
import {
  CAREER_MATHEMATICIAN_PAGES,
  CAREER_MATHEMATICIAN_STAGES,
  CAREER_MATHEMATICIAN_STORAGE_KEY,
  CAREER_MATHEMATICIAN_ACCENT,
  CAREER_MATHEMATICIAN_GRADIENT,
  SCENARIO_ROUTE_OPTIONS,
} from '../../business/career-mathematician-data'
import { getCareerExperienceKind } from '../../business/career-config'
import { getCareerPreviewExperience } from '../../business/career-preview-data'
import { getCareerById, getMajorById } from '../../business/explore-data'
import { markCareerExplored, setCareerWorkspaceSelection } from '../../business/explore-progress'
import { resolveAsset } from '../../utils/asset-map'

const LIVE_EXPERIENCE_BY_ID = {
  mathematician: {
    kind: 'live',
    accent: CAREER_MATHEMATICIAN_ACCENT,
    accentGradient: CAREER_MATHEMATICIAN_GRADIENT,
    pages: CAREER_MATHEMATICIAN_PAGES,
    stages: CAREER_MATHEMATICIAN_STAGES,
    storageKey: CAREER_MATHEMATICIAN_STORAGE_KEY,
  },
}

export default {
  data() {
    return {
      careerId: '',
      majorId: '',
      experienceKind: 'none',
      ready: false,
      experience: null,
      careerMeta: null,
      pageIndex: 0,
      scrollTop: 0,
      unlockedStageIndexes: [0],
      selectedPath: '',
      completed: false,
    }
  },
  computed: {
    navTitle() {
      return this.careerMeta ? `${this.careerMeta.title}职业模拟` : '职业模拟'
    },
    navEn() {
      if (!this.careerMeta) return 'Career'
      if (this.careerId === 'mathematician') return 'Mathematician'
      if (this.careerId === 'algorithm-researcher') return 'Algorithm Research'
      if (this.careerId === 'software-engineer') return 'Software Engineer'
      return 'Career'
    },
    majorLabel() {
      if (!this.majorId) return ''
      const major = getMajorById(this.majorId)
      return major ? (major.shortTitle || major.title) : ''
    },
    pages() {
      return (this.experience && this.experience.pages) || []
    },
    stages() {
      return (this.experience && this.experience.stages) || []
    },
    currentPage() {
      return this.pages[this.pageIndex] || {}
    },
    activeStageIndex() {
      return this.currentPage.stageIndex || 0
    },
    selectedOption() {
      return SCENARIO_ROUTE_OPTIONS.find((item) => item.id === this.selectedPath) || null
    },
    feedbackTitle() {
      return this.selectedOption ? `${this.selectedOption.title}：路线反馈` : '等待选择第一条路线'
    },
    feedbackBody() {
      return this.selectedOption
        ? this.selectedOption.feedback
        : '请选择一条研究路线，模拟器会在这里显示对应反馈。'
    },
    nextLabel() {
      if (this.currentPage.isFinal) {
        return this.experienceKind === 'live' ? '完成并返回' : '返回职业列表'
      }
      if (this.currentPage.nextStageOnLeave) return '进入下一阶段'
      if (this.pageIndex < this.pages.length - 1) return '下一页'
      return this.experienceKind === 'live' ? '完成并返回' : '返回职业列表'
    },
  },
  onLoad(query) {
    const pageQuery = query || {}
    this.careerId = pageQuery.id || ''
    this.majorId = pageQuery.majorId || ''
    this.careerMeta = getCareerById(this.careerId)

    const kind = getCareerExperienceKind(this.careerId)
    this.experienceKind = kind
    if (kind === 'live') {
      this.experience = LIVE_EXPERIENCE_BY_ID[this.careerId]
    } else if (kind === 'preview') {
      const preview = getCareerPreviewExperience(this.careerId)
      if (preview) {
        this.experience = { ...preview, kind: 'preview', stages: [] }
      }
    }

    if (this.majorId) {
      setCareerWorkspaceSelection({ selectedMajorId: this.majorId, selectedCareerId: this.careerId })
    }

    this.restoreSnapshot()
    this.ready = true
    if (this.careerMeta) {
      uni.setNavigationBarTitle({ title: `${this.careerMeta.title}职业模拟` })
    }
  },
  methods: {
    resolveAsset,
    goBack() {
      uni.navigateBack()
    },
    formatCardIndex(idx) {
      const value = Number(idx) + 1
      return value < 10 ? `0${value}` : String(value)
    },
    selectPath(pathId) {
      this.selectedPath = pathId
      this.saveSnapshot()
    },
    scrollToTop() {
      this.scrollTop = this.scrollTop === 0 ? 1 : 0
    },
    unlockStage(stageIndex) {
      if (!this.unlockedStageIndexes.includes(stageIndex)) {
        this.unlockedStageIndexes = [...this.unlockedStageIndexes, stageIndex].sort((a, b) => a - b)
      }
    },
    jumpToStage(stageIndex) {
      if (this.experienceKind !== 'live') return
      if (!this.unlockedStageIndexes.includes(stageIndex)) {
        uni.showToast({ title: '请先完成上一阶段', icon: 'none' })
        return
      }
      const target = this.pages.findIndex((page) => page.stageIndex === stageIndex)
      if (target >= 0) {
        this.pageIndex = target
        this.scrollToTop()
        this.saveSnapshot()
      }
    },
    prevPage() {
      if (this.pageIndex <= 0) return
      this.pageIndex -= 1
      this.scrollToTop()
      this.saveSnapshot()
    },
    nextPage() {
      if (this.pageIndex < this.pages.length - 1) {
        const nextIndex = this.pageIndex + 1
        if (this.experienceKind === 'live') {
          const nextStage = this.pages[nextIndex].stageIndex
          if (nextStage !== this.activeStageIndex) {
            this.unlockStage(nextStage)
          }
        }
        this.pageIndex = nextIndex
        this.scrollToTop()
        this.saveSnapshot()
        return
      }
      this.finishExperience()
    },
    finishExperience() {
      if (this.experienceKind === 'live') {
        markCareerExplored(this.careerId)
        this.completed = true
        this.saveSnapshot()
        uni.showToast({ title: '职业体验已记录', icon: 'success' })
      } else {
        uni.showToast({ title: '占位预览已浏览', icon: 'none' })
      }
      setTimeout(() => {
        uni.navigateBack()
      }, 600)
    },
    restoreSnapshot() {
      if (!this.experience) return
      try {
        const raw = uni.getStorageSync(this.experience.storageKey)
        if (!raw) return
        const snapshot = typeof raw === 'string' ? JSON.parse(raw) : raw
        if (!snapshot || snapshot.progressVersion !== 1) return
        const pageIndex = this.pages.findIndex((page) => page.id === snapshot.currentPageId)
        if (pageIndex >= 0) this.pageIndex = pageIndex
        if (Array.isArray(snapshot.unlocked)) {
          this.unlockedStageIndexes = snapshot.unlocked.filter((idx) => Number.isInteger(idx))
        }
        if (typeof snapshot.selectedPath === 'string') {
          this.selectedPath = snapshot.selectedPath
        }
        this.completed = Boolean(snapshot.completed)
      } catch (error) {
        console.error('[career-experience] restore failed', error)
      }
    },
    saveSnapshot() {
      if (!this.experience) return
      try {
        uni.setStorageSync(this.experience.storageKey, {
          progressVersion: 1,
          currentPageId: this.currentPage.id,
          currentPageIndex: this.pageIndex,
          currentStageIndex: this.activeStageIndex,
          unlocked: this.unlockedStageIndexes,
          selectedPath: this.selectedPath,
          completed: this.completed,
        })
      } catch (error) {
        console.error('[career-experience] save failed', error)
      }
    },
  },
}
</script>

<style scoped>
.page { min-height: 100vh; display: flex; flex-direction: column; background: #fff; }
.topbar { padding: 24rpx 28rpx 20rpx; color: #fff; }
.topbar-row { display: flex; justify-content: space-between; align-items: baseline; gap: 16rpx; }
.topbar-title { font-size: 34rpx; font-weight: 800; }
.topbar-en { font-size: 22rpx; opacity: 0.88; }
.page-indicator { display: block; margin-top: 12rpx; font-size: 22rpx; opacity: 0.92; }
.major-context { display: block; margin-top: 10rpx; font-size: 20rpx; opacity: 0.9; }
.steps { display: flex; gap: 10rpx; margin-top: 18rpx; overflow-x: auto; }
.preview-badge { display: inline-block; margin-bottom: 16rpx; padding: 8rpx 18rpx; border-radius: 999rpx; background: #fff7ed; color: #c2410c; font-size: 20rpx; font-weight: 700; }
.preview-hero { width: 100%; margin-top: 20rpx; border-radius: 20rpx; }
.preview-step-body { display: block; margin-top: 20rpx; font-size: 26rpx; line-height: 1.82; color: #263241; }
.preview-step-image { width: 100%; margin-top: 20rpx; border-radius: 20rpx; }
.placeholder-panel { margin-top: 24rpx; padding: 28rpx; border-radius: 24rpx; border: 1rpx solid #fde68a; background: #fffbeb; }
.placeholder-title { display: block; font-size: 28rpx; font-weight: 700; color: #92400e; }
.placeholder-body { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.75; color: #78350f; }
.step-dot { flex: 1; min-width: 120rpx; padding: 14rpx 10rpx; border-radius: 18rpx; background: rgba(255,255,255,0.16); text-align: center; }
.step-dot-active { background: rgba(255,255,255,0.95); }
.step-dot-active .step-index, .step-dot-active .step-label { color: #087a64; }
.step-dot-done { background: rgba(255,255,255,0.28); }
.step-dot-locked { opacity: 0.45; }
.step-index { display: block; font-size: 22rpx; font-weight: 800; }
.step-label { display: block; margin-top: 4rpx; font-size: 18rpx; line-height: 1.3; }

.body { flex: 1; height: 0; }
.stage { padding: 28rpx 28rpx 40rpx; }
.page-title { display: block; text-align: center; font-size: 36rpx; font-weight: 800; color: #102033; line-height: 1.35; }
.page-subtitle { display: block; margin-top: 12rpx; text-align: center; font-size: 24rpx; line-height: 1.7; color: #64748b; }
.lead-block { margin-top: 24rpx; }
.lead-line { display: block; margin-bottom: 16rpx; font-size: 26rpx; line-height: 1.82; color: #263241; }

.intro-card { margin-top: 24rpx; border-radius: 24rpx; border: 1rpx solid #e3ebf3; overflow: hidden; background: #fff; box-shadow: 0 16rpx 32rpx rgba(15,23,42,0.05); }
.intro-copy { padding: 26rpx; }
.intro-head { display: flex; align-items: center; gap: 16rpx; }
.intro-index { width: 56rpx; height: 56rpx; line-height: 56rpx; text-align: center; border-radius: 999rpx; font-size: 22rpx; font-weight: 700; flex-shrink: 0; }
.intro-title { flex: 1; font-size: 28rpx; font-weight: 700; color: #102033; line-height: 1.4; }
.intro-body { display: block; margin-top: 16rpx; font-size: 24rpx; line-height: 1.74; color: #394657; }
.intro-image { width: 100%; background: #f8fafc; }

.tag-grid { display: flex; flex-wrap: wrap; gap: 14rpx; margin-top: 20rpx; }
.tag-chip { padding: 18rpx 22rpx; border-radius: 18rpx; border: 1rpx solid #e3ebf3; background: #fff; font-size: 24rpx; font-weight: 600; color: #41536a; }

.route-card { margin-top: 20rpx; padding: 26rpx; border-radius: 24rpx; border: 1rpx solid #e2eaf3; background: #fff; box-shadow: 0 16rpx 32rpx rgba(15,23,42,0.05); }
.route-card-active { border-color: #9adfd5; background: linear-gradient(180deg, #effdf9 0%, #f8fffd 100%); }
.route-head { display: flex; justify-content: space-between; align-items: center; }
.route-index { width: 56rpx; height: 56rpx; line-height: 56rpx; text-align: center; border-radius: 999rpx; background: #e8f3ff; color: #2f6bff; font-size: 22rpx; font-weight: 700; }
.route-card-active .route-index { background: #00a889; color: #fff; }
.route-badge { width: 56rpx; height: 56rpx; line-height: 56rpx; text-align: center; border-radius: 16rpx; background: #fff; color: #1b75d0; font-size: 24rpx; font-weight: 800; box-shadow: 0 14rpx 26rpx rgba(27,117,208,0.12); }
.route-title { display: block; margin-top: 18rpx; font-size: 30rpx; font-weight: 700; color: #102033; }
.route-body { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.7; color: #394657; }
.route-action { display: inline-block; margin-top: 20rpx; padding: 10rpx 24rpx; border-radius: 999rpx; border: 1rpx solid #d6e4f2; font-size: 22rpx; font-weight: 700; color: #3d6fb8; }
.route-card-active .route-action { border-color: #00a889; background: #00a889; color: #fff; }

.feedback-panel { margin-top: 24rpx; padding: 28rpx; border-radius: 24rpx; border: 1rpx solid #d8f1e9; background: linear-gradient(180deg, #f7fffd 0%, #ffffff 100%); }
.feedback-label { display: block; font-size: 22rpx; font-weight: 800; color: #00a889; }
.feedback-title { display: block; margin-top: 8rpx; font-size: 28rpx; font-weight: 700; color: #102033; }
.feedback-body { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.75; color: #64748b; }

.footer { display: flex; gap: 16rpx; padding: 20rpx 24rpx calc(20rpx + env(safe-area-inset-bottom)); border-top: 1rpx solid #edf2f7; background: #fff; }
.btn-ghost, .btn-primary { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; font-size: 28rpx; font-weight: 700; }
.btn-ghost { background: #eef2f7; color: #475569; }
.btn-primary { color: #fff; }

.empty-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48rpx; background: #f8fafc; }
.empty-title { font-size: 32rpx; font-weight: 700; color: #162033; }
.empty-desc { margin-top: 16rpx; font-size: 24rpx; color: #64748b; text-align: center; line-height: 1.7; }
.empty-page .btn-ghost { margin-top: 32rpx; width: 100%; }
</style>
