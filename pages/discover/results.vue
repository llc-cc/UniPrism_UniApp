<template>
  <view class="page">
    <ReportGenerating
      v-if="phase === 'generating'"
      :progress="reportProgress"
      :error="reportError"
      @retry="retryGeneration"
      @restart="restart"
    />

    <view v-else-if="!profile" class="empty-state">
      <text class="empty-icon">🧭</text>
      <text class="empty-title">还没有报告</text>
      <text class="empty-desc">完成兴趣问卷后，这里将显示你的综合报告。</text>
      <button class="btn-primary" @tap="goChat">开始问卷</button>
    </view>

    <DiscoverReportView
      v-else
      :profile="profile"
      :majors="majors"
      :report="report"
      :nickname="nickname"
      @major-click="openMajor"
      @restart="restart"
      @go-major="goMajorExperience"
    />
  </view>
</template>

<script>
import { loadDiscoverSession, resetDiscoverSession } from '../../business/discover-session'
import { navigateToMajor } from '../../business/major-routes'
import {
  clearDiscoverReportCache,
  clearExploreBackendSession,
  clearProfileUploadFlag,
  readDiscoverReportCache,
  syncDiscoverProfileToBackend,
  writeDiscoverReportCache,
} from '../../business/profile-sync'
import { INITIAL_REPORT_PROGRESS, runReportGenerationChain } from '../../business/report-generation'
import { api } from '../../utils/api'
import ReportGenerating from '../../components/ReportGenerating/ReportGenerating.vue'
import DiscoverReportView from '../../components/DiscoverReportView/DiscoverReportView.vue'

function extractNickname(session) {
  const answers = (session && session.answers) || []
  const basic = answers.find((item) => item.questionId === 'basic-profile')
  const fields = basic && basic.value && basic.value.fields
  const name = fields && fields.name
  return typeof name === 'string' && name.trim() ? name.trim() : '同学'
}

export default {
  components: { ReportGenerating, DiscoverReportView },
  data() {
    return {
      phase: 'loading',
      profile: null,
      majors: [],
      report: null,
      nickname: '同学',
      discoverSession: null,
      reportProgress: { ...INITIAL_REPORT_PROGRESS },
      reportError: '',
      generationStarted: false,
      shouldGenerate: false,
    }
  },
  onLoad(options) {
    this.shouldGenerate = options && (options.generate === '1' || options.generate === 'true')
  },
  onShow() {
    this.bootstrap()
  },
  methods: {
    goChat() {
      uni.navigateTo({ url: '/pages/discover/chat' })
    },
    bootstrap() {
      const session = loadDiscoverSession()
      this.discoverSession = session
      this.profile = session.profile || null
      this.majors = session.recommendedMajors || []
      this.nickname = extractNickname(session)

      if (!this.profile) {
        this.phase = 'empty'
        return
      }

      const cachedReport = readDiscoverReportCache(session)
      if (cachedReport && !this.shouldGenerate) {
        this.report = cachedReport
        this.phase = 'ready'
        this.generationStarted = true
        return
      }

      this.startGeneration()
    },
    async startGeneration(forceRegenerate) {
      if (this.phase === 'generating' && !this.reportError) return
      const session = this.discoverSession || loadDiscoverSession()
      if (!session.profile) {
        this.phase = 'empty'
        return
      }

      this.generationStarted = true
      this.shouldGenerate = false
      this.phase = 'generating'
      this.reportError = ''
      this.report = null
      clearDiscoverReportCache(session)
      this.reportProgress = { ...INITIAL_REPORT_PROGRESS }

      try {
        const report = await runReportGenerationChain({
          session,
          syncDiscoverProfileToBackend,
          api,
          forceRegenerate: Boolean(forceRegenerate),
          onProgress: (progress) => {
            this.reportProgress = progress
          },
        })
        this.report = report
        const latestSession = loadDiscoverSession()
        writeDiscoverReportCache(latestSession, report)
        this.phase = 'ready'
      } catch (error) {
        this.reportError = (error && error.message) || '报告生成失败，请稍后重试'
      }
    },
    retryGeneration() {
      this.startGeneration(true)
    },
    openMajor(majorId) {
      navigateToMajor(majorId)
    },
    goMajorExperience() {
      uni.navigateTo({ url: '/pages/discover/major' })
    },
    restart() {
      resetDiscoverSession()
      clearExploreBackendSession()
      clearProfileUploadFlag()
      clearDiscoverReportCache()
      uni.reLaunch({ url: '/pages/discover/index' })
    },
  },
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f7f8fb; }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 40rpx;
  gap: 24rpx;
}
.empty-icon { font-size: 96rpx; }
.empty-title { font-size: 36rpx; font-weight: 700; color: #283248; }
.empty-desc { font-size: 26rpx; color: #6b7280; text-align: center; line-height: 1.6; }
.btn-primary {
  margin-top: 16rpx;
  background: linear-gradient(90deg, #6b23ff, #9762ff);
  color: #fff;
  border: none;
  border-radius: 48rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 28rpx;
  font-weight: 600;
  padding: 0 48rpx;
}
</style>
