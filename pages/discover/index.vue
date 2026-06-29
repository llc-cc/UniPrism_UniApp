<template>
  <view class="page">

    <!-- ── 当前阶段卡片 ── -->
    <view class="stage-card" @tap="handlePrimary">
      <view class="card-body">
        <text class="card-title">{{ heroEyebrow }}</text>
        <text class="card-desc">{{ heroMeta }}</text>
      </view>
      <view class="card-divider" />
      <view class="card-doc" @tap.stop="goProgress">
        <view class="card-doc-paper">
          <view class="card-doc-line" />
          <view class="card-doc-line card-doc-line--short" />
          <view class="card-doc-line" />
        </view>
      </view>
    </view>

    <view class="roadmap">
      <image class="road-img" src="/static/assets/discover/interest-road.svg" mode="scaleToFill" />
      <image
        v-if="progressRoadSrc"
        class="road-img road-progress"
        :src="progressRoadSrc"
        mode="scaleToFill"
      />

      <view class="map-connector connector-personality" :class="connectorClass(1)" />
      <view class="map-connector connector-career" :class="connectorClass(2)" />
      <view class="map-connector connector-deep" :class="connectorClass(3)" />
      <view class="map-connector connector-report" :class="connectorClass(4)" />

      <view class="map-arrow arrow-personality" @tap="goStageIntro('personality')">
        <image class="map-arrow-bg" :src="resolveAsset(arrowAsset('personality'))" mode="scaleToFill" />
        <text class="map-arrow-text">性格测试</text>
      </view>
      <image
        class="map-icon icon-personality"
        :src="resolveAsset(assetPaths.stagePersonality)"
        mode="aspectFit"
      />

      <view class="lock-badge" :class="{ 'lock-badge--unlocked': isRoadLockUnlocked }" @tap="handleLockBadgeTap">
        <view class="lock-glyph" aria-hidden="true">
          <image class="lock-glyph-top" :src="assetPaths.roadLockTop" mode="aspectFit" />
          <image class="lock-glyph-body" :src="assetPaths.roadLockBody" mode="aspectFit" />
        </view>
      </view>

      <view
        v-if="isReportCtaCompleted"
        class="map-cta map-cta--report map-cta--report-completed"
        :style="ctaStyle"
      >
        <text class="map-cta-report-copy">{{ reportBubbleCopy }}</text>
        <button class="map-cta-report-btn map-cta-report-btn--secondary" @tap.stop="handleRestartAssessment">重做</button>
        <button class="map-cta-report-btn map-cta-report-btn--primary" @tap.stop="goViewReport">查看报告</button>
      </view>

      <view
        v-else-if="isReportCta"
        class="map-cta map-cta--report"
        :class="{ 'map-cta--report-generating': isReportCtaGenerating }"
        :style="ctaStyle"
        @tap="handleMapCta"
      >
        <text class="map-cta-report-copy">{{ reportBubbleCopy }}</text>
        <text class="map-cta-report-action">{{ roadView.cta.label }}</text>
      </view>

      <button
        v-else
        class="map-cta map-cta--continue action-btn"
        :style="ctaStyle"
        @tap="handleMapCta"
      >
        <image class="action-bg" :src="assetPaths.continueBubble" mode="scaleToFill" />
        <text class="action-text">{{ ctaLabel }}</text>
      </button>

      <view class="map-arrow arrow-career" @tap="goStageIntro('holland')">
        <image class="map-arrow-bg" :src="resolveAsset(arrowAsset('holland'))" mode="scaleToFill" />
        <text class="map-arrow-text">职业测试</text>
      </view>
      <image
        class="map-icon icon-career"
        :src="resolveAsset(assetPaths.stageCareer)"
        mode="aspectFit"
      />

      <view class="map-arrow map-arrow--mirror arrow-deep" @tap="goStageIntro('deep')">
        <image class="map-arrow-bg" :src="resolveAsset(arrowAsset('deep'))" mode="scaleToFill" />
        <text class="map-arrow-text">深度测评</text>
      </view>
      <image
        class="map-icon icon-deep"
        :src="resolveAsset(assetPaths.stageDeep)"
        mode="aspectFit"
      />

      <view class="map-arrow arrow-report" @tap="goStageIntro('report')">
        <image class="map-arrow-bg" :src="resolveAsset(arrowAsset('report'))" mode="scaleToFill" />
        <text class="map-arrow-text">生成报告</text>
      </view>
      <image
        class="map-icon icon-report"
        :src="resolveAsset(assetPaths.stageReport)"
        mode="aspectFit"
      />
    </view>

    <view class="home-tabbar">
      <view class="tab-item tab-item--active" @tap="switchHomeTab('/pages/discover/index')">
        <view class="tab-icon tab-icon--prism">
          <image class="tab-icon-img" :src="assetPaths.tabInterest" mode="aspectFit" />
        </view>
        <text class="tab-text">兴趣探索</text>
      </view>
      <view class="tab-item" @tap="switchHomeTab('/pages/discover/major')">
        <view class="tab-icon">
          <image class="tab-icon-img" :src="assetPaths.tabMajor" mode="aspectFit" />
        </view>
        <text class="tab-text">专业体验</text>
      </view>
      <view class="tab-item" @tap="switchHomeTab('/pages/profile/index')">
        <view class="tab-icon">
          <image class="tab-icon-img" :src="assetPaths.tabProfile" mode="aspectFit" />
        </view>
        <text class="tab-text">个人中心</text>
      </view>
    </view>

    <view v-if="lockPromptVisible" class="lock-prompt-mask" @tap="closeLockPrompt">
      <view class="lock-prompt" @tap.stop>
        <text class="lock-prompt-title">请先完成前置阶段</text>
        <view class="lock-prompt-card">
          <view class="lock-prompt-icon-wrap">
            <view class="lock-glyph lock-glyph--prompt" aria-hidden="true">
              <image class="lock-glyph-top" :src="assetPaths.roadLockTop" mode="aspectFit" />
              <image class="lock-glyph-body" :src="assetPaths.roadLockBody" mode="aspectFit" />
            </view>
          </view>
          <view class="lock-prompt-copy">
            <text class="lock-prompt-stage">{{ lockPromptStageLabel }}</text>
            <text class="lock-prompt-hint">{{ lockPromptHint }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="progressVisible" class="progress-mask" @tap="closeProgress">
      <view class="progress-sheet" @tap.stop>
        <view class="progress-sheet-head">
          <text class="progress-sheet-title">学习进度</text>
          <text class="progress-sheet-close" @tap="closeProgress">关闭</text>
        </view>
        <ProgressPanel :active="progressVisible" @go-report="goProgressReport" />
      </view>
    </view>
  </view>
</template>

<script>
import { loadDiscoverSession, resetDiscoverSession } from '../../business/discover-session-storage'
import { DISCOVER_ACTIVE_QUESTION_COUNT, SCREEN_QUESTION_IDS } from '../../business/discover-chat-screens'
import { FINAL_CAREER_CALIBRATION_QUESTION_IDS, MBTI_KNOWN_QUESTION_ID, computePreCareerRiasecTopDimensions, getHollandFineQuestionIdsForDimensions } from '../../business/discover-progress-helpers'
import { getRecommendedCareers } from '../../business/explore-data'
import { loadExploreProgress } from '../../business/explore-progress'
import {
  buildHomeInterestRoadView,
  getRoadProgressAsset,
  getStageIntroUrl,
  INTEREST_MAP_CTA_LAYOUT,
  INTEREST_REPORT_GENERATING_COPY,
  INTEREST_REPORT_PENDING_COPY,
  INTEREST_REPORT_READY_COPY,
} from '../../business/home-interest-road-progress'
import {
  getHomeReportState,
  getInterestLockPromptCopy,
  getInterestProgressSnapshot,
  isDiscoveryCompleted,
  isInterestNodeUnlocked,
} from '../../business/interest-progress-snapshot'
import { navigateToMajor } from '../../business/major-routes'
import { openCareerSimulation } from '../../business/career-config'
import { clearDiscoverReportCache, clearExploreBackendSession, clearProfileUploadFlag, ensureExploreSessionId } from '../../business/profile-sync'
import { api } from '../../utils/api'
import { resolveAsset } from '../../utils/asset-map'
import { navigateHomeTab } from '../../business/disabled-miniapp-routes'
import {
  EXPLORATION_START_URL,
  promptLoginForReport,
} from '../../business/report-auth-flow'
import ProgressPanel from '../../components/ProgressPanel/ProgressPanel.vue'

const ASSET_PATHS = {
  arrowPurple: '/images/explore/discover/figma/home-interest-assets/arrow-purple-517-16508.svg',
  arrowGray: '/images/explore/discover/figma/home-interest-assets/arrow-gray-517-16508.svg',
  continueBubble: '/static/assets/discover/continue-bubble-down.svg',
  roadLockTop: '/static/assets/discover/road-lock-top.svg',
  roadLockBody: '/static/assets/discover/road-lock-body.svg',
  stagePersonality: '/images/explore/discover/figma/stage-personality-icon-transparent-20260615.png',
  stageCareer: '/images/explore/discover/figma/stage-career-icon-transparent-20260615.png',
  stageDeep: '/images/explore/discover/figma/stage-deep-icon-transparent-20260615.png',
  stageReport: '/explore-static/discover/figma/report-ready-clipboard-figma-205-12203.png',
  tabInterest: '/static/assets/discover/tabbar/icon-interest.svg',
  tabMajor: '/static/assets/discover/tabbar/icon-major.svg',
  tabAchievement: '/static/assets/discover/tabbar/icon-achievement.svg',
  tabProfile: '/static/assets/discover/tabbar/icon-profile.svg',
  tabMoreLineLong: '/static/assets/discover/tabbar/system-line-long.svg',
  tabMoreLineShort: '/static/assets/discover/tabbar/system-line-short.svg',
  tabLock: '/static/assets/discover/tabbar/icon-lock.svg',
}

const unique = (items) => [...new Set(items.filter(Boolean))]
const PERSONALITY_STAGE_QUESTION_IDS = unique([
  ...(SCREEN_QUESTION_IDS['personality-1'] || []),
  ...(SCREEN_QUESTION_IDS['personality-2'] || []),
  ...(SCREEN_QUESTION_IDS['personality-3'] || []),
  ...(SCREEN_QUESTION_IDS['personality-4'] || []),
])
const CAREER_STAGE_QUESTION_IDS = unique([
  ...(SCREEN_QUESTION_IDS['personality-holland-1'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-2'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-3'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-4'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-5'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-6'] || []),
])
function getDeepStageQuestionIds(answers) {
  const topDimensions = computePreCareerRiasecTopDimensions(Array.isArray(answers) ? answers : [], 2)
  const hollandFineIds = topDimensions.length > 0
    ? getHollandFineQuestionIdsForDimensions(topDimensions)
    : []
  return unique([...hollandFineIds, ...(FINAL_CAREER_CALIBRATION_QUESTION_IDS || [])])
}

function hasNonEmptyAnswer(answer) {
  if (!answer || !answer.questionId) return false
  const value = answer.value
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') return Object.keys(value).length > 0
  return value !== undefined && value !== null
}

function hasAllAnswers(answeredIdSet, questionIds) {
  return questionIds.length > 0 && questionIds.every((id) => answeredIdSet.has(id))
}

export default {
  components: { ProgressPanel },
  data() {
    return {
      assetPaths: ASSET_PATHS,
      answers: [],
      totalCount: DISCOVER_ACTIVE_QUESTION_COUNT,
      hasProfile: false,
      recommendedMajors: [],
      rankedCareers: [],
      majorsExplored: [],
      careersExplored: [],
      roadView: null,
      interestStages: [],
      discoveryCompleted: false,
      restartPending: false,
      lockPromptVisible: false,
      lockPromptStageLabel: '',
      lockPromptHint: '',
      progressVisible: false,
    }
  },
  computed: {
    activeNodeIdSet() {
      return new Set((this.roadView && this.roadView.activeNodeIds) || [])
    },
    isReportCta() {
      return this.roadView && this.roadView.cta && this.roadView.cta.anchorNodeId === 'report'
    },
    isReportCtaCompleted() {
      return this.isReportCta && this.roadView.cta.kind === 'view-report'
    },
    isReportCtaGenerating() {
      return this.isReportCta && this.roadView.cta.kind === 'report-progress'
    },
    reportBubbleCopy() {
      if (!this.roadView || !this.roadView.cta) return ''
      if (this.roadView.cta.kind === 'view-report') return INTEREST_REPORT_READY_COPY
      if (this.roadView.cta.kind === 'report-progress') return INTEREST_REPORT_GENERATING_COPY
      return INTEREST_REPORT_PENDING_COPY
    },
    ctaStyle() {
      const nodeId = (this.roadView && this.roadView.cta && this.roadView.cta.anchorNodeId)
        || (this.roadView && this.roadView.activeNodeId)
        || 'personality'
      const layout = INTEREST_MAP_CTA_LAYOUT[nodeId] || INTEREST_MAP_CTA_LAYOUT.personality
      return `left:${layout.left}rpx;top:${layout.top}rpx;width:${layout.width}rpx;height:${layout.height}rpx;`
    },
    answeredIdSet() {
      return new Set((this.answers || [])
        .filter(hasNonEmptyAnswer)
        .map((answer) => answer.questionId)
        .filter(Boolean))
    },
    hasAnyAnswers() {
      return this.answeredIdSet.size > 0
    },
    hasPersonalityComplete() {
      return this.answeredIdSet.has(MBTI_KNOWN_QUESTION_ID)
        || hasAllAnswers(this.answeredIdSet, PERSONALITY_STAGE_QUESTION_IDS)
    },
    hasCareerComplete() {
      return hasAllAnswers(this.answeredIdSet, CAREER_STAGE_QUESTION_IDS)
    },
    hasDeepComplete() {
      return hasAllAnswers(this.answeredIdSet, getDeepStageQuestionIds(this.answers))
    },
    heroEyebrow() {
      if (!this.roadView) return '阶段一 · 性格测试'
      if (this.roadView.cta.kind === 'view-report') return '探索完成！查看画像报告'
      if (this.roadView.activeNodeId === 'report') return '阶段四 · 生成报告'
      if (this.roadView.activeNodeId === 'deep') return '阶段三 · 深度测评'
      if (this.roadView.activeNodeId === 'holland') return '阶段二 · 职业测试'
      return '阶段一 · 性格测试'
    },
    heroMeta() {
      if (!this.roadView) return '约5分钟 共20题'
      if (this.roadView.cta.kind === 'view-report') return '所有测评已完成'
      if (this.roadView.activeNodeId === 'report') {
        return this.roadView.statusText === '生成中' ? '报告生成中' : '即将生成画像报告'
      }
      if (this.roadView.activeNodeId === 'deep') return '约8分钟 共31题'
      if (this.roadView.activeNodeId === 'holland') return '约5分钟 共20题'
      return '约5分钟 共20题'
    },
    primaryLabel() {
      return this.ctaLabel
    },
    ctaLabel() {
      if (!this.roadView || !this.roadView.cta) return '开始探索'
      if (this.roadView.cta.kind === 'continue' && !this.hasAnyAnswers) return '开始探索'
      return this.roadView.cta.label
    },
    progressRoadSrc() {
      const percent = (this.roadView && this.roadView.roadProgressPercent) || 10
      return getRoadProgressAsset(percent)
    },
    isRoadLockUnlocked() {
      return this.discoveryCompleted
    },
  },
  onShow() {
    this.refreshRoadView()
    this.refreshReportStateFromBackend()
  },
  methods: {
    refreshRoadView() {
      const session = loadDiscoverSession()
      const progress = loadExploreProgress()
      const answers = session.answers || []
      const recommendedMajors = session.recommendedMajors || []
      const profile = session.profile
      this.answers = answers
      this.hasProfile = Boolean(profile)
      this.recommendedMajors = recommendedMajors
      this.majorsExplored = progress.majorsExplored || []
      this.careersExplored = progress.careersExplored || []
      this.interestStages = getInterestProgressSnapshot(session)
      this.discoveryCompleted = isDiscoveryCompleted(session)
      this.roadView = buildHomeInterestRoadView({
        stages: this.interestStages,
        discoveryCompleted: this.discoveryCompleted,
        report: getHomeReportState(session),
        session,
      })
      this.rankedCareers = getRecommendedCareers(
        profile ? profile.topDimensions : [],
        recommendedMajors.map((item) => item.majorId),
      )
    },
    async refreshReportStateFromBackend() {
      if (!this.discoveryCompleted) return
      try {
        const sessionId = await ensureExploreSessionId()
        if (!sessionId) return
        const res = await api.getLatestReport(sessionId, 'full_explore')
        const session = loadDiscoverSession()
        const nextRoadView = buildHomeInterestRoadView({
          stages: this.interestStages,
          discoveryCompleted: this.discoveryCompleted,
          report: getHomeReportState(session, res && res.data),
          session,
        })
        this.roadView = nextRoadView
      } catch {
        // 保留本地快照；网络失败时不阻断首页展示
      }
    },
    resolveAsset,
    arrowAsset(nodeId) {
      const active = this.activeNodeIdSet.has(nodeId)
      return active ? ASSET_PATHS.arrowPurple : ASSET_PATHS.arrowGray
    },
    connectorClass(stageIndex) {
      const order = ['personality', 'holland', 'deep', 'report']
      if (this.roadView && this.roadView.cta && this.roadView.cta.kind === 'view-report') {
        return 'map-connector--completed'
      }
      const completedIdx = Math.max(
        0,
        ...order.map((id, index) => (this.activeNodeIdSet.has(id) ? index + 1 : 0)),
      )
      return stageIndex <= completedIdx ? 'map-connector--completed' : 'map-connector--pending'
    },
    async openChatUrl(url) {
      uni.showLoading({ title: '准备探索...' })
      try {
        await ensureExploreSessionId()
        uni.navigateTo({ url })
      } catch (error) {
        uni.showToast({
          title: (error && error.message) || '后端会话初始化失败',
          icon: 'none',
        })
      } finally {
        uni.hideLoading()
      }
    },
    goStageIntro(nodeId) {
      if (!this.isNodeUnlocked(nodeId)) {
        this.showLockPrompt(nodeId)
        return
      }
      if (nodeId === 'report') {
        if (this.roadView && this.roadView.cta) {
          if (this.roadView.cta.kind === 'view-report') {
            this.goViewReport()
            return
          }
          if (this.roadView.cta.kind === 'report-progress') {
            this.openChatUrl('/subpkg/discover/results')
            return
          }
        }
        this.openChatUrl((this.roadView && this.roadView.cta && this.roadView.cta.url) || getStageIntroUrl('report'))
        return
      }
      this.openChatUrl(getStageIntroUrl(nodeId))
    },
    isNodeUnlocked(nodeId) {
      return isInterestNodeUnlocked(nodeId, this.interestStages, this.discoveryCompleted)
    },
    getLockBadgeTargetNodeId() {
      if (!this.isNodeUnlocked('holland')) return 'holland'
      if (!this.isNodeUnlocked('deep')) return 'deep'
      if (!this.isNodeUnlocked('report')) return 'report'
      return 'report'
    },
    handleLockBadgeTap() {
      if (this.isRoadLockUnlocked) return
      this.showLockPrompt(this.getLockBadgeTargetNodeId())
    },
    showLockPrompt(targetNodeId) {
      const copy = getInterestLockPromptCopy(targetNodeId, this.interestStages)
      this.lockPromptStageLabel = copy.stageLabel
      this.lockPromptHint = copy.hint
      this.lockPromptVisible = true
    },
    closeLockPrompt() {
      this.lockPromptVisible = false
    },
    async handleMapCta() {
      if (!this.roadView || !this.roadView.cta) return
      const { kind, url } = this.roadView.cta
      if (kind === 'view-report') {
        this.goViewReport()
        return
      }
      if (kind === 'generate-report') {
        const canProceed = await promptLoginForReport(url || '/subpkg/discover/chat?screen=complete')
        if (!canProceed) return
      }
      if (kind === 'continue' && !this.hasAnyAnswers) {
        this.openChatUrl(EXPLORATION_START_URL)
        return
      }
      this.openChatUrl(url)
    },
    goViewReport() {
      uni.navigateTo({ url: '/subpkg/discover/results' })
    },
    handleRestartAssessment() {
      if (this.restartPending) return
      uni.showModal({
        title: '重新测评',
        content: '重新测评会清除当前结果，是否继续？',
        confirmText: '重做',
        cancelText: '取消',
        success: async (res) => {
          if (!res.confirm) return
          this.restartPending = true
          try {
            resetDiscoverSession()
            clearDiscoverReportCache({})
            clearExploreBackendSession()
            clearProfileUploadFlag()
            await this.openChatUrl('/subpkg/discover/chat?retake=1')
          } finally {
            this.restartPending = false
          }
        },
      })
    },
    switchHomeTab(url) {
      navigateHomeTab(url)
    },
    async handlePrimary() {
      this.handleMapCta()
    },
    goProgress() {
      uni.navigateTo({ url: '/pages/progress/index' })
    },
    closeProgress() {
      this.progressVisible = false
    },
    goProgressReport() {
      this.progressVisible = false
      uni.navigateTo({ url: '/subpkg/discover/results' })
    },
    goMajors() { uni.navigateTo({ url: '/pages/discover/major' }) },
    goMajorDetail(majorId) { navigateToMajor(majorId) },
    goCareers() { uni.navigateTo({ url: '/subpkg/discover/career' }) },
    goCareerDetail(careerId) { openCareerSimulation(careerId, '') },
    goInterest() {
      if (this.hasProfile) {
        uni.showModal({
          title: '重新探索',
          content: '已有测评结果。重新答题会清除当前结果，是否继续？',
          confirmText: '重新答题',
          cancelText: '查看报告',
          success: (res) => {
            if (res.confirm) uni.navigateTo({ url: '/subpkg/discover/chat?retake=1' })
            else if (res.cancel) uni.navigateTo({ url: '/subpkg/discover/results' })
          },
        })
        return
      }
      uni.navigateTo({
        url: this.answers && this.answers.length > 0
          ? '/subpkg/discover/chat'
          : EXPLORATION_START_URL,
      })
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
  padding: 0 28rpx 150rpx;
  box-sizing: border-box;
  overflow-x: hidden;
}

.stage-card {
  display: flex;
  align-items: center;
  width: 660rpx;
  max-width: 100%;
  height: 142rpx;
  margin: 18rpx auto 0;
  border-radius: 28rpx;
  overflow: hidden;
  background: #9661ff;
}
.card-body {
  flex: 1;
  padding: 0 30rpx;
}
.card-title {
  display: block;
  color: #fff;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 1.35;
}
.card-desc {
  display: block;
  margin-top: 6rpx;
  color: rgba(255, 255, 255, 0.86);
  font-size: 22rpx;
  font-weight: 600;
}
.card-divider {
  width: 4rpx;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
}
.card-doc {
  width: 78rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card-doc-paper {
  width: 28rpx;
  height: 34rpx;
  border: 4rpx solid #ffffff;
  border-radius: 4rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4rpx;
  padding: 0 4rpx;
}
.card-doc-line {
  width: 14rpx;
  height: 3rpx;
  border-radius: 999rpx;
  background: #ffffff;
}
.card-doc-line--short {
  width: 10rpx;
}

.roadmap {
  position: relative;
  width: 750rpx;
  margin-top: 12rpx;
  /* 顶部 stage-card 右缘：28rpx 页边距 + (694-660)/2 */
  --road-right-bound: 45rpx;
  /* 锁/图标安全边距（与左侧 arrow-personality 的 52rpx 对称） */
  --road-right-gutter: 58rpx;
  /* 职业箭头 SVG 尖端 + 阴影会超出容器，额外内收 */
  --road-arrow-right: 78rpx;
  --career-icon-shift-y: -32rpx;
  --career-icon-extra-shift-x: -6rpx;
  --career-icon-extra-shift-y: -55rpx;
  --career-arrow-extra-shift-y: -80rpx;
  --career-connector-extra-shift-y: -240rpx;
  --career-arrow-shift-y: 38rpx;
  --career-connector-shift-x: 20rpx;
  /* 职业测试参考：箭头→连接块 +76rpx，连接块高 126rpx；图标下移以露出连接块 */
  --stage-arrow-height: 102rpx;
  --stage-connector-from-arrow-y: 76rpx;
  --stage-connector-height: 126rpx;
  /* 箭头底边到图标顶边的可见连接块高度（对齐职业测试约 46~50rpx） */
  --stage-visible-connector-gap: 50rpx;
  --stage-icon-from-arrow-y: calc(var(--stage-arrow-height) + var(--stage-visible-connector-gap));
  --stage-personality-icon-extra-shift-y: -30rpx;
  --stage-deep-icon-extra-shift-y: -24rpx;
  --stage-report-icon-extra-shift-y: -24rpx;
  --stage-deep-shift-x: 39rpx;
  --stage-deep-shift-y: -10rpx;
  --stage-report-shift-x: -32rpx;
  --stage-report-shift-y: 84rpx;
  --stage-personality-arrow-left: 52rpx;
  --stage-personality-connector-left: 120rpx;
  --stage-personality-icon-left: 86rpx;
  --stage-deep-arrow-left: calc(228rpx + var(--stage-deep-shift-x));
  --stage-deep-arrow-top: calc(532rpx + var(--stage-deep-shift-y));
  --stage-deep-connector-left: calc(312rpx + var(--stage-deep-shift-x));
  --stage-deep-icon-left: calc(248rpx + var(--stage-deep-shift-x));
  --stage-report-arrow-left: calc(82rpx + var(--stage-report-shift-x));
  --stage-report-arrow-top: calc(812rpx + var(--stage-report-shift-y));
  --stage-report-connector-left: calc(150rpx + var(--stage-report-shift-x));
  --stage-report-icon-left: calc(124rpx + var(--stage-report-shift-x));
}
.road-img {
  position: absolute;
  left: 0;
  top: 0;
  width: 750rpx;
  height: 1080rpx;
  pointer-events: none;
  z-index: 1;
}
.road-progress {
  z-index: 2;
}

.map-connector {
  position: absolute;
  width: 35rpx;
  height: var(--stage-connector-height);
  background: #cfcfd1;
  z-index: 4;
}

.map-connector--completed {
  background: #b0b0fa;
}

.map-connector--pending {
  background: #cfcfd1;
}

.connector-personality {
  left: var(--stage-personality-connector-left);
  top: var(--stage-connector-from-arrow-y);
}

.connector-career {
  left: calc(528rpx + var(--career-connector-shift-x));
  top: calc(604rpx + var(--career-icon-shift-y) + var(--career-connector-extra-shift-y));
}

.connector-deep {
  left: var(--stage-deep-connector-left);
  top: calc(var(--stage-deep-arrow-top) + var(--stage-connector-from-arrow-y));
}

.connector-report {
  left: var(--stage-report-connector-left);
  top: calc(var(--stage-report-arrow-top) + var(--stage-connector-from-arrow-y));
}

.map-arrow {
  position: absolute;
  width: 206rpx;
  height: 102rpx;
  z-index: 6;
}
.map-arrow-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.map-arrow--mirror .map-arrow-bg {
  transform: scaleX(-1);
}
.map-arrow-text {
  position: absolute;
  left: 0;
  right: 0;
  top: 24rpx;
  color: #ffffff;
  font-size: 26rpx;
  font-weight: 800;
  line-height: 1.8;
  text-align: center;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.16);
  z-index: 3;
}
.arrow-personality {
  left: var(--stage-personality-arrow-left);
  top: 0;
}
.arrow-career {
  right: var(--road-arrow-right);
  top: calc(330rpx + var(--career-arrow-shift-y) + var(--career-icon-shift-y) + var(--career-arrow-extra-shift-y));
}
.arrow-deep {
  left: var(--stage-deep-arrow-left);
  top: var(--stage-deep-arrow-top);
}
.arrow-report {
  left: var(--stage-report-arrow-left);
  top: var(--stage-report-arrow-top);
}

.map-icon {
  position: absolute;
  width: 158rpx;
  height: 158rpx;
  z-index: 5;
}
.icon-personality {
  left: var(--stage-personality-icon-left);
  top: calc(var(--stage-icon-from-arrow-y) + var(--stage-personality-icon-extra-shift-y));
}
.icon-career {
  right: calc(var(--road-arrow-right) + 48rpx + var(--career-icon-extra-shift-x));
  top: calc(436rpx + var(--career-icon-shift-y) + var(--career-icon-extra-shift-y));
}
.icon-deep {
  left: var(--stage-deep-icon-left);
  top: calc(var(--stage-deep-arrow-top) + var(--stage-icon-from-arrow-y) + var(--stage-deep-icon-extra-shift-y));
}
.icon-report {
  left: var(--stage-report-icon-left);
  top: calc(var(--stage-report-arrow-top) + var(--stage-icon-from-arrow-y) + var(--stage-report-icon-extra-shift-y));
  width: 158rpx;
  height: 158rpx;
}

.lock-badge {
  position: absolute;
  right: var(--road-right-gutter);
  top: 24rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #eef8ff;
  border: 4rpx solid #bfe7ff;
  box-shadow: 0 6rpx 16rpx rgba(80, 160, 220, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8;
  box-sizing: border-box;
}
.lock-badge--unlocked {
  background: #f3efff;
  border-color: #c9b8ff;
  box-shadow: 0 6rpx 16rpx rgba(118, 88, 210, 0.18);
}
.lock-glyph {
  position: relative;
  width: 34rpx;
  height: 34rpx;
}
.lock-glyph-top,
.lock-glyph-body {
  position: absolute;
  display: block;
}
.lock-glyph-top {
  left: 10rpx;
  top: 0;
  width: 14rpx;
  height: 12rpx;
  transform-origin: 2rpx 100%;
}
.lock-glyph-body {
  left: 3rpx;
  top: 9rpx;
  width: 28rpx;
  height: 24rpx;
}
.lock-badge--unlocked .lock-glyph-top {
  transform: rotate(-52deg);
}
.lock-glyph--prompt {
  width: 44rpx;
  height: 44rpx;
}
.lock-glyph--prompt .lock-glyph-top {
  left: 13rpx;
  top: 2rpx;
  width: 18rpx;
  height: 16rpx;
}
.lock-glyph--prompt .lock-glyph-body {
  left: 4rpx;
  top: 12rpx;
  width: 36rpx;
  height: 30rpx;
}

.action-btn {
  position: absolute;
  border: 0;
  padding: 0;
  background: transparent;
  z-index: 9;
}
.action-btn::after {
  border: 0;
}
.map-cta {
  position: absolute;
  z-index: 9;
  box-sizing: border-box;
}
.map-cta--continue {
  border: 0;
  padding: 0;
  background: transparent;
}
.map-cta--continue::after {
  border: 0;
}
.map-cta--report {
  border-radius: 24rpx;
  background: linear-gradient(180deg, #9d63ff 0%, #8652f0 100%);
  box-shadow: 0 10rpx 0 #6f42d8, 0 20rpx 36rpx rgba(105, 63, 206, 0.18);
  overflow: visible;
}
.map-cta--report::before {
  content: '';
  position: absolute;
  left: -18rpx;
  bottom: 54rpx;
  width: 0;
  height: 0;
  border-top: 14rpx solid transparent;
  border-bottom: 14rpx solid transparent;
  border-right: 18rpx solid #8652f0;
}
.map-cta-report-copy {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  top: 22rpx;
  color: #ffffff;
  font-size: 24rpx;
  line-height: 1.45;
  font-weight: 500;
}
.map-cta-report-action {
  position: absolute;
  left: 50%;
  bottom: 22rpx;
  transform: translateX(-50%);
  min-width: 220rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 12rpx;
  background: #ffffff;
  color: #9762ff;
  font-size: 28rpx;
  font-weight: 800;
  text-align: center;
}
.map-cta--report-completed .map-cta-report-copy {
  top: 16rpx;
  left: 28rpx;
  right: 28rpx;
  font-size: 26rpx;
  line-height: 1.36;
}
.map-cta-report-btn {
  position: absolute;
  bottom: 20rpx;
  width: 164rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 800;
  text-align: center;
  padding: 0;
  background: #ffffff;
  color: #9762ff;
  border: none;
}
.map-cta-report-btn::after {
  border: 0;
}
.map-cta-report-btn--primary {
  right: 24rpx;
}
.map-cta-report-btn--secondary {
  left: 24rpx;
}
.action-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.action-text {
  position: absolute;
  left: 0;
  right: 0;
  top: 6rpx;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 900;
  line-height: 1.8;
  text-align: center;
  z-index: 2;
  /* 模拟图一“粗描边” */
  text-shadow:
    0 3rpx 0 rgba(53, 35, 120, 0.62),
    0 -3rpx 0 rgba(53, 35, 120, 0.62),
    3rpx 0 0 rgba(53, 35, 120, 0.62),
    -3rpx 0 0 rgba(53, 35, 120, 0.62),
    3rpx 3rpx 0 rgba(53, 35, 120, 0.62),
    -3rpx 3rpx 0 rgba(53, 35, 120, 0.62),
    3rpx -3rpx 0 rgba(53, 35, 120, 0.62),
    -3rpx -3rpx 0 rgba(53, 35, 120, 0.62);
}

.home-tabbar {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: calc(18rpx + env(safe-area-inset-bottom));
  height: 104rpx;
  border: 2rpx solid #9762ff;
  border-radius: 26rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8rpx 24rpx rgba(107, 35, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 30;
}
.tab-item {
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: #9a79ff;
}
.tab-item--disabled {
  color: #9a79ff;
}
.tab-icon {
  width: 48rpx;
  height: 48rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-icon-img {
  width: 36rpx;
  height: 36rpx;
  display: block;
}
.tab-item--active .tab-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(151, 98, 255, 0.14);
}
.tab-item--active .tab-icon-img {
  width: 40rpx;
  height: 40rpx;
}
.tab-icon--locked {
  overflow: visible;
}
.tab-lock-badge {
  position: absolute;
  right: -4rpx;
  top: -4rpx;
  width: 18rpx;
  height: 18rpx;
  opacity: 0.86;
}
.tab-more-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
}
.tab-more-tile {
  position: absolute;
  width: 11rpx;
  height: 11rpx;
  border: 1.5rpx solid #c797ff;
  border-radius: 4rpx;
  box-sizing: border-box;
  background: linear-gradient(90deg, #e7c2ff 0%, #9762ff 100%);
}
.tab-more-tile--top-left {
  left: 4rpx;
  top: 4rpx;
}
.tab-more-tile--bottom-left {
  left: 4rpx;
  top: 19rpx;
}
.tab-more-tile--top-right {
  left: 19rpx;
  top: 4rpx;
}
.tab-more-line {
  position: absolute;
  display: block;
  height: 2rpx;
}
.tab-more-line--middle {
  left: 19rpx;
  top: 19rpx;
  width: 13rpx;
}
.tab-more-line--short {
  left: 24rpx;
  top: 23rpx;
  width: 8rpx;
}
.tab-more-line--bottom {
  left: 19rpx;
  top: 28rpx;
  width: 13rpx;
}
.tab-text {
  font-size: 18rpx;
  line-height: 1;
  white-space: nowrap;
}

.lock-prompt-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(15, 23, 42, 0.28);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: calc(130rpx + env(safe-area-inset-top)) 40rpx 48rpx;
  box-sizing: border-box;
}
.lock-prompt {
  width: 100%;
  max-width: 620rpx;
  padding: 36rpx 32rpx 32rpx;
  border-radius: 28rpx;
  background: #ffffff;
  box-shadow: 0 24rpx 64rpx rgba(15, 23, 42, 0.14);
}
.lock-prompt-title {
  display: block;
  font-size: 34rpx;
  line-height: 1.5;
  color: #1c1c3a;
  font-weight: 700;
}
.lock-prompt-card {
  margin-top: 28rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx 24rpx;
  border-radius: 20rpx;
  background: #f3f4f6;
}
.lock-prompt-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #d8dbe3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lock-prompt-copy {
  flex: 1;
  min-width: 0;
}
.lock-prompt-stage {
  display: block;
  font-size: 32rpx;
  line-height: 1.45;
  color: #4b5565;
  font-weight: 700;
}
.lock-prompt-hint {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #8b93a3;
}

.progress-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(15, 23, 42, 0.28);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
}
.progress-sheet {
  width: 100%;
  max-height: 78vh;
  padding: 28rpx 28rpx calc(28rpx + env(safe-area-inset-bottom));
  border-radius: 28rpx 28rpx 0 0;
  background: #f5f5f5;
  box-shadow: 0 -12rpx 48rpx rgba(15, 23, 42, 0.12);
  box-sizing: border-box;
  overflow-y: auto;
}
.progress-sheet-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.progress-sheet-title {
  font-size: 34rpx;
  line-height: 1.4;
  color: #1c1c3a;
  font-weight: 700;
}
.progress-sheet-close {
  font-size: 26rpx;
  line-height: 1.4;
  color: #9762ff;
  font-weight: 600;
}
</style>
