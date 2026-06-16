<template>
  <scroll-view class="page" scroll-y>
    <view class="stage-card" :style="{ background: currentStage.accent }">
      <view class="stage-copy">
        <text class="stage-title">{{ currentStage.stageTitle }}</text>
        <text v-for="line in currentStage.lines" :key="line" class="stage-line">{{ line }}</text>
        <view class="stage-progress-head">
          <text class="stage-progress-label">{{ currentStage.progressLabel }}</text>
          <text class="stage-progress-value">{{ stageProgress }}%</text>
        </view>
        <view class="stage-progress-track" :style="{ background: currentStage.track }">
          <view class="stage-progress-fill" :style="{ width: stageProgress + '%', background: currentStage.fill }">
            <view class="stage-progress-knob" :style="{ background: currentStage.knob }" />
          </view>
        </view>
        <button class="stage-button" @tap="handleStageAction">{{ stageActionLabel }}</button>
      </view>
      <image v-if="currentStage.artwork" class="stage-image" :src="resolveAsset(currentStage.artwork)" mode="aspectFill" />
      <view v-else class="stage-image-placeholder">
        <text class="stage-image-number">{{ currentStage.number }}</text>
        <text class="stage-image-text">探索流程</text>
      </view>
    </view>

    <view class="task-head">
      <view class="task-head-row">
        <text class="task-title">{{ majorTask.title }}</text>
        <text class="task-badge">{{ majorTask.badge }}</text>
      </view>
      <text class="task-desc">{{ majorTask.description }}</text>
    </view>

    <view class="task-layout">
      <view class="task-visual-card">
        <image v-if="majorTask.visualBefore" class="task-visual-image" :src="resolveAsset(majorTask.visualBefore)" mode="aspectFill" />
        <view v-else class="task-visual-placeholder">
          <text class="task-visual-title">开始探索</text>
          <text class="task-visual-subtitle">先完成兴趣问卷，再解锁后续内容</text>
        </view>
        <view class="task-visual-copy">
          <text v-for="line in majorTask.footerLines" :key="line" class="task-visual-line">{{ line }}</text>
        </view>
        <button class="task-visual-button" @tap="goInterest">开始探索</button>
      </view>

      <view class="shortcut-card">
        <view class="shortcut-head">
          <text class="shortcut-title">兴趣探索</text>
          <text class="shortcut-link">显示全部</text>
        </view>
        <view v-for="task in shortcuts" :key="task.id" class="shortcut-item">
          <image v-if="task.icon" class="shortcut-icon" :src="resolveAsset(task.icon)" mode="aspectFit" />
          <view v-else class="shortcut-icon-placeholder">
            <text class="shortcut-icon-text">{{ shortcutPrefix(task.id) }}</text>
          </view>
          <view class="shortcut-copy">
            <text class="shortcut-item-title">{{ task.title }}</text>
            <button class="shortcut-button" :disabled="task.lockUntilProfile && !hasProfile" @tap="handleShortcut(task.id)">
              {{ task.subtitle }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card">
      <view class="section-head">
        <text class="section-title">推荐专业方向</text>
        <text class="section-meta">{{ recommendedMajors.length ? '基于当前画像' : '完成问卷后解锁' }}</text>
      </view>
      <view v-if="recommendedMajors.length" class="recommend-grid">
        <view v-for="major in recommendedMajors" :key="major.majorId" class="recommend-chip" @tap="goMajorDetail(major.majorId)">
          <text class="recommend-name">{{ major.name }}</text>
          <text class="recommend-score">{{ major.matchScore }}%</text>
        </view>
      </view>
      <text v-else class="empty-text">完成兴趣问卷后，系统会优先推荐适合你的专业方向。</text>
      <button class="section-button" @tap="goMajors">进入专业体验</button>
    </view>

    <view class="section-card">
      <view class="section-head">
        <text class="section-title">推荐职业模拟</text>
        <text class="section-meta">{{ rankedCareers.length ? '结合专业方向' : '完成问卷后解锁' }}</text>
      </view>
      <view class="career-list">
        <view v-for="career in rankedCareers.slice(0, 3)" :key="career.id" class="career-item" @tap="goCareerDetail(career.id)">
          <view class="career-icon-placeholder">
            <text class="career-icon-text">{{ career.title.slice(0, 2) }}</text>
          </view>
          <view class="career-copy">
            <text class="career-title">{{ career.title }}</text>
            <text class="career-badge">{{ career.badge }}</text>
            <text class="career-desc">{{ career.summary }}</text>
          </view>
        </view>
      </view>
      <button class="section-button" @tap="goCareers">进入职业模拟</button>
    </view>
  </scroll-view>
</template>

<script>
import { loadDiscoverSession } from '../../business/discover-session'
import { DISCOVER_ACTIVE_QUESTION_COUNT } from '../../business/discover-chat-screens'
import {
  INTEREST_SHORTCUTS,
  MAJOR_TASK_OVERVIEW,
  getRecommendedCareers,
} from '../../business/explore-data'
import { loadExploreProgress } from '../../business/explore-progress'
import { navigateToMajor } from '../../business/major-routes'
import { openCareerSimulation } from '../../business/career-config'
import {
  getDefaultStageId,
  getStageActionLabel,
  getStageById,
  getStageProgress,
} from '../../business/explore-stage'
import { resolveAsset } from '../../utils/asset-map'

export default {
  data() {
    return {
      answeredCount: 0,
      totalCount: DISCOVER_ACTIVE_QUESTION_COUNT,
      hasProfile: false,
      recommendedMajors: [],
      rankedCareers: [],
      majorsExplored: [],
      careersExplored: [],
      activeStageId: 'interest',
      shortcuts: INTEREST_SHORTCUTS,
      majorTask: MAJOR_TASK_OVERVIEW,
    }
  },
  computed: {
    stageContext() {
      return {
        hasProfile: this.hasProfile,
        answeredCount: this.answeredCount,
        totalCount: this.totalCount,
        majorsExplored: this.majorsExplored,
        careersExplored: this.careersExplored,
      }
    },
    stageProgress() {
      return getStageProgress(this.activeStageId, this.stageContext)
    },
    currentStage() {
      return getStageById(this.activeStageId)
    },
    stageActionLabel() {
      return getStageActionLabel(this.activeStageId, this.stageContext)
    },
  },
  onShow() {
    const session = loadDiscoverSession()
    const progress = loadExploreProgress()
    const answers = session.answers || []
    const recommendedMajors = session.recommendedMajors || []
    const profile = session.profile
    this.answeredCount = answers.length
    this.hasProfile = Boolean(profile)
    this.recommendedMajors = recommendedMajors
    this.majorsExplored = progress.majorsExplored || []
    this.careersExplored = progress.careersExplored || []
    this.rankedCareers = getRecommendedCareers(profile ? profile.topDimensions : [], recommendedMajors.map((item) => item.majorId))
    this.activeStageId = getDefaultStageId({
      hasProfile: this.hasProfile,
      majorsExplored: this.majorsExplored,
      careersExplored: this.careersExplored,
    })
  },
  methods: {
    resolveAsset,
    handleStageAction() {
      if (this.activeStageId === 'interest') return this.goInterest()
      if (this.activeStageId === 'major') return this.goMajors()
      if (this.activeStageId === 'career') return this.goCareers()
      if (this.activeStageId === 'report') {
        uni.navigateTo({ url: '/pages/discover/results' })
      }
    },
    shortcutPrefix(taskId) {
      if (taskId === 'profile') return '画像'
      if (taskId === 'major') return '专业'
      if (taskId === 'career') return '职业'
      return '探索'
    },
    goInterest() {
      if (this.hasProfile) {
        uni.showModal({
          title: '重新探索',
          content: '已有测评结果。重新答题会清除当前结果并生成新报告，是否继续？',
          confirmText: '重新答题',
          cancelText: '查看报告',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({ url: '/pages/discover/chat?retake=1' })
            } else if (res.cancel) {
              uni.navigateTo({ url: '/pages/discover/results' })
            }
          },
        })
        return
      }
      uni.navigateTo({ url: '/pages/discover/chat' })
    },
    handleShortcut(taskId) {
      if (taskId === 'profile') {
        if (!this.hasProfile) {
          uni.showToast({ title: '需要先完成兴趣探索', icon: 'none' })
          return
        }
        uni.navigateTo({ url: '/pages/discover/results' })
        return
      }
      if (taskId === 'major') return this.goMajors()
      if (taskId === 'career') return this.goCareers()
    },
    goMajors() {
      uni.navigateTo({ url: '/pages/discover/major' })
    },
    goMajorDetail(majorId) {
      navigateToMajor(majorId)
    },
    goCareers() {
      uni.navigateTo({ url: '/pages/discover/career' })
    },
    goCareerDetail(careerId) {
      openCareerSimulation(careerId, '')
    },
  },
}
</script>

<style scoped>
.page { background: #ffffff; padding-bottom: 36rpx; }
.stage-card { margin: 24rpx; border-radius: 28rpx; min-height: 310rpx; overflow: hidden; position: relative; padding: 30rpx 30rpx 24rpx; display: flex; }
.stage-copy { width: 58%; position: relative; z-index: 2; }
.stage-title { display: block; font-size: 44rpx; font-weight: 700; color: #fff; line-height: 1.2; }
.stage-line { display: block; margin-top: 10rpx; font-size: 28rpx; font-weight: 600; color: rgba(255,255,255,0.96); }
.stage-progress-head { margin-top: 36rpx; display: flex; justify-content: space-between; align-items: center; }
.stage-progress-label, .stage-progress-value { font-size: 24rpx; font-weight: 700; color: #fff; }
.stage-progress-track { margin-top: 12rpx; height: 20rpx; border-radius: 999rpx; overflow: hidden; }
.stage-progress-fill { height: 100%; border-radius: 999rpx; position: relative; min-width: 24rpx; }
.stage-progress-knob { position: absolute; right: 0; top: 50%; width: 28rpx; height: 28rpx; border-radius: 50%; transform: translate(35%, -50%); }
.stage-button { margin-top: 26rpx; width: 240rpx; height: 84rpx; line-height: 84rpx; border-radius: 26rpx; border: none; background: #fff; color: #08af8b; font-size: 30rpx; font-weight: 700; }
.stage-image { position: absolute; right: 26rpx; bottom: 24rpx; width: 220rpx; height: 220rpx; border-radius: 32rpx; }
.stage-image-placeholder { position: absolute; right: 26rpx; bottom: 24rpx; width: 220rpx; height: 220rpx; border-radius: 32rpx; background: rgba(255,255,255,0.18); display: flex; flex-direction: column; align-items: center; justify-content: center; }
.stage-image-number { font-size: 56rpx; font-weight: 700; color: rgba(255,255,255,0.92); line-height: 1; }
.stage-image-text { margin-top: 14rpx; font-size: 24rpx; color: rgba(255,255,255,0.92); }
.task-head { padding: 0 24rpx; margin-top: 18rpx; }
.task-head-row { display: flex; align-items: center; gap: 16rpx; flex-wrap: wrap; }
.task-title { font-size: 36rpx; font-weight: 700; color: #0f172a; }
.task-badge { padding: 8rpx 20rpx; border-radius: 999rpx; background: #ebf3ff; color: #4b81eb; font-size: 22rpx; font-weight: 700; }
.task-desc { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.7; color: #64748b; }
.task-layout { padding: 24rpx; }
.task-visual-card { background: #fff; border-radius: 28rpx; overflow: hidden; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.06); }
.task-visual-image { width: 100%; height: 430rpx; display: block; background: #edf4fb; }
.task-visual-placeholder { width: 100%; height: 430rpx; background: linear-gradient(180deg, #f8fbff, #edf4fb); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 36rpx; box-sizing: border-box; }
.task-visual-title { font-size: 42rpx; font-weight: 700; color: #102033; }
.task-visual-subtitle { margin-top: 18rpx; font-size: 24rpx; line-height: 1.7; color: #5f6b7b; text-align: center; }
.task-visual-copy { padding: 0 24rpx; margin-top: -4rpx; }
.task-visual-line { display: block; text-align: center; font-size: 24rpx; line-height: 1.7; color: #405166; }
.task-visual-button { display: block; width: 220rpx; margin: 22rpx auto 28rpx; height: 82rpx; line-height: 82rpx; border-radius: 22rpx; border: 1rpx solid #d8e4ee; background: #fff; color: #102033; font-size: 28rpx; font-weight: 700; }
.shortcut-card { margin-top: 24rpx; border-radius: 28rpx; border: 2rpx solid #dedede; background: #fff; padding: 26rpx 22rpx; }
.shortcut-head { display: flex; justify-content: space-between; align-items: center; }
.shortcut-title { font-size: 34rpx; font-weight: 700; color: #3f3f46; }
.shortcut-link { font-size: 24rpx; font-weight: 700; color: #1cb0f6; }
.shortcut-item { display: grid; grid-template-columns: 88rpx 1fr; gap: 18rpx; align-items: center; margin-top: 30rpx; }
.shortcut-icon { width: 76rpx; height: 76rpx; justify-self: center; border-radius: 22rpx; background: #eef4ff; }
.shortcut-icon-placeholder { width: 76rpx; height: 76rpx; justify-self: center; border-radius: 22rpx; background: #eef4ff; display: flex; align-items: center; justify-content: center; }
.shortcut-icon-text { font-size: 22rpx; font-weight: 700; color: #4767a8; }
.shortcut-item-title { display: block; font-size: 28rpx; font-weight: 700; color: #4b4b50; }
.shortcut-button { margin-top: 14rpx; height: 60rpx; line-height: 60rpx; padding: 0 28rpx; border-radius: 18rpx; border: none; background: #f4f4f5; color: #5f6b7a; font-size: 22rpx; font-weight: 700; }
.shortcut-button[disabled] { color: #a1a1aa; }
.section-card { margin: 0 24rpx 24rpx; border-radius: 28rpx; background: #fff; padding: 28rpx; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.06); }
.section-head { display: flex; justify-content: space-between; gap: 18rpx; align-items: center; }
.section-title { font-size: 32rpx; font-weight: 700; color: #162033; }
.section-meta { font-size: 22rpx; color: #7b8697; }
.recommend-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 22rpx; }
.recommend-chip { min-width: 200rpx; padding: 20rpx 24rpx; border-radius: 20rpx; background: #eff6ff; }
.recommend-name { display: block; font-size: 26rpx; font-weight: 700; color: #1e3a8a; }
.recommend-score { display: block; margin-top: 8rpx; font-size: 22rpx; color: #2563eb; }
.empty-text { display: block; margin-top: 20rpx; font-size: 24rpx; line-height: 1.7; color: #667085; }
.section-button { margin-top: 24rpx; width: 100%; height: 82rpx; line-height: 82rpx; border-radius: 20rpx; border: none; background: #f5f8fc; color: #1f4f8d; font-size: 28rpx; font-weight: 700; }
.career-list { margin-top: 18rpx; }
.career-item { display: flex; gap: 20rpx; padding: 20rpx 0; border-bottom: 1rpx solid #edf2f7; }
.career-item:last-child { border-bottom: none; }
.career-icon-placeholder { width: 92rpx; height: 92rpx; border-radius: 24rpx; background: #f7f9fc; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.career-icon-text { font-size: 22rpx; font-weight: 700; color: #53657d; }
.career-copy { flex: 1; }
.career-title { display: block; font-size: 28rpx; font-weight: 700; color: #162033; }
.career-badge { display: block; margin-top: 6rpx; font-size: 22rpx; color: #7c3aed; }
.career-desc { display: block; margin-top: 10rpx; font-size: 24rpx; line-height: 1.7; color: #5f6b7b; }
</style>
