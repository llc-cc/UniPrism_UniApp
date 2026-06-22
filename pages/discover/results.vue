<template>
  <view class="page">
    <ReportGenerating
      v-if="phase === 'generating'"
      :progress="reportProgress"
      :error="reportError"
      @retry="retryGeneration"
      @restart="restart"
    />

    <view v-else-if="phase === 'loading'" class="loading-state">
      <text class="loading-title">正在打开报告...</text>
    </view>

    <view v-else-if="phase === 'load-error'" class="empty-state">
      <text class="empty-icon">📄</text>
      <text class="empty-title">报告暂时无法打开</text>
      <text class="empty-desc">{{ reportError || '请稍后重试' }}</text>
      <button class="btn-primary" @tap="bootstrap">重试</button>
      <button class="btn-secondary" @tap="goHome">返回首页</button>
    </view>

    <view v-else-if="!profile" class="empty-state">
      <text class="empty-icon">🧭</text>
      <text class="empty-title">还没有报告</text>
      <text class="empty-desc">完成性格测试、职业测评和深度测评后，这里将显示你的综合报告。</text>
      <button class="btn-primary" @tap="goChat">开始问卷</button>
    </view>

    <DiscoverReportView
      v-else
      :profile="profile"
      :majors="majors"
      :report="report"
      :nickname="nickname"
      @restart="restart"
      @go-home="goHome"
    />
  </view>
</template>

<script>
import { loadDiscoverSession, resetDiscoverSession } from '../../business/discover-session'
import {
  clearDiscoverReportCache,
  clearExploreBackendSession,
  clearProfileUploadFlag,
  ensureExploreSessionId,
  isDiscoverReportComplete,
  markDiscoverReportComplete,
  readDiscoverReportCache,
  syncDiscoverProfileToBackend,
  writeDiscoverReportCache,
} from '../../business/profile-sync'
import { INITIAL_REPORT_PROGRESS, loadLatestCompletedReport, runReportGenerationChain } from '../../business/report-generation'
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

function getLatestReportStatus(data) {
  return String((data && data.status) || '').toLowerCase()
}

function isReportInProgress(data) {
  const status = getLatestReportStatus(data)
  return data && (data.queued === true || status === 'pending' || status === 'generating')
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
      shouldGenerate: false,
      bootstrapToken: 0,
    }
  },
  onLoad(options) {
    this.shouldGenerate = options && (options.generate === '1' || options.generate === 'true')
    if (this.shouldGenerate) {
      this.syncNavigationBar('generating')
    }
  },
  onShow() {
    this.bootstrap()
  },
  watch: {
    phase: {
      immediate: true,
      handler(value) {
        this.syncNavigationBar(value)
      },
    },
  },
  methods: {
    syncNavigationBar(phase) {
      const isGenerating = phase === 'generating'
      uni.setNavigationBarTitle({ title: isGenerating ? '生成报告' : '我的报告' })
      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: isGenerating ? '#f1e8fb' : '#ffffff',
      })
    },
    goChat() {
      const session = loadDiscoverSession()
      uni.navigateTo({
        url: session && session.answers && session.answers.length > 0
          ? '/pages/discover/chat'
          : '/pages/discover/chat?start=1',
      })
    },
    showReadyReport(session, report) {
      this.report = report
      writeDiscoverReportCache(session, report)
      markDiscoverReportComplete(session)
      this.phase = 'ready'
    },
    async loadCompletedReport(session) {
      const sessionId = await ensureExploreSessionId()
      if (!sessionId) {
        throw new Error('无法读取报告会话，请稍后重试')
      }
      const report = await loadLatestCompletedReport(sessionId, api)
      if (!report) {
        throw new Error('报告读取失败，请稍后重试')
      }
      this.showReadyReport(session, report)
    },
    async bootstrap() {
      const token = this.bootstrapToken + 1
      this.bootstrapToken = token

      const session = loadDiscoverSession()
      this.discoverSession = session
      this.profile = session.profile || null
      this.majors = session.recommendedMajors || []
      this.nickname = extractNickname(session)
      this.reportError = ''

      if (!this.profile) {
        this.phase = 'empty'
        return
      }

      const cachedReport = readDiscoverReportCache(session)
      if (cachedReport && !this.shouldGenerate) {
        if (token !== this.bootstrapToken) return
        this.report = cachedReport
        this.phase = 'ready'
        return
      }

      if (this.shouldGenerate) {
        this.startGeneration()
        return
      }

      this.phase = 'loading'

      try {
        if (isDiscoverReportComplete(session)) {
          await this.loadCompletedReport(session)
          if (token !== this.bootstrapToken) return
          return
        }

        const sessionId = await ensureExploreSessionId()
        if (!sessionId) {
          throw new Error('无法读取报告会话，请稍后重试')
        }

        const latestRes = await api.getLatestReport(sessionId, 'full_explore')
        const latest = (latestRes && latestRes.data) || {}

        if (token !== this.bootstrapToken) return

        if (getLatestReportStatus(latest) === 'completed') {
          await this.loadCompletedReport(session)
          return
        }

        if (isReportInProgress(latest)) {
          this.startGeneration()
          return
        }

        this.phase = 'empty'
      } catch (error) {
        if (token !== this.bootstrapToken) return
        this.reportError = (error && error.message) || '报告读取失败，请稍后重试'
        this.phase = 'load-error'
      }
    },
    async startGeneration(forceRegenerate) {
      if (this.phase === 'generating' && !this.reportError && !forceRegenerate) return
      const session = this.discoverSession || loadDiscoverSession()
      if (!session.profile) {
        this.phase = 'empty'
        return
      }

      this.shouldGenerate = false
      this.phase = 'generating'
      this.reportError = ''
      this.report = null
      if (forceRegenerate) {
        clearDiscoverReportCache(session)
      }
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
        markDiscoverReportComplete(latestSession)
        this.phase = 'ready'
      } catch (error) {
        this.reportError = (error && error.message) || '报告生成失败，请稍后重试'
      }
    },
    retryGeneration() {
      this.startGeneration(true)
    },
    goHome() {
      uni.reLaunch({ url: '/pages/discover/index' })
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
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f1e8fb 0%, #f7f3fb 42%, #eff1f5 100%);
}
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.loading-title {
  font-size: 30rpx;
  color: #283248;
  font-weight: 600;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 140rpx 40rpx;
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
  box-shadow: 0 8rpx 0 rgba(79,45,184,0.22);
}
.btn-secondary {
  background: #ffffff;
  color: #6b23ff;
  border: 2rpx solid #d8c7ff;
  border-radius: 48rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  font-weight: 600;
  padding: 0 40rpx;
}
</style>
