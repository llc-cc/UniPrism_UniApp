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
      ref="reportView"
      :profile="profile"
      :majors="majors"
      :report="report"
      :nickname="nickname"
      :session-id="shareSessionId"
      :report-id="shareReportId"
      @restart="restart"
      @go-home="goHome"
      @prepare-share="handlePrepareShare"
    />

    <ReportSharePosterCanvas
      v-if="phase === 'ready' && sharePreviewModel"
      ref="sharePosterCanvas"
      :model="sharePreviewModel"
      :cover-src="shareCoverUrl"
      @ready="handleSharePosterReady"
    />
  </view>
</template>

<script>
import { loadDiscoverSession, prepareDiscoverSessionForReport, resetDiscoverSession } from './business/discover-session'
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
import { INITIAL_REPORT_PROGRESS, loadLatestCompletedReport, runReportGenerationChain } from './business/report-generation'
import { buildReportHeroModel } from '../../business/report-display-model'
import {
  buildReportSharePreviewModel,
  buildShareAppMessagePayload,
  REPORT_SHARE_FALLBACK_TITLE,
} from './business/report-share-view'
import { getBasicProfileGenderFromSession } from '../../business/user-avatar'
import { resolveAsset } from '../../utils/asset-map'
import { renderReportSharePosterToTempFile } from './business/report-share-poster'
import { api } from '../../utils/api'
import {
  EXPLORATION_START_URL,
  isLoggedInForReport,
  promptLoginForReport,
} from '../../business/report-auth-flow'
import ReportGenerating from './components/ReportGenerating/ReportGenerating.vue'
import DiscoverReportView from './components/DiscoverReportView/DiscoverReportView.vue'
import ReportSharePosterCanvas from './components/ReportSharePosterCanvas/ReportSharePosterCanvas.vue'

const REPORT_SHARE_TIMELINE_TITLE = REPORT_SHARE_FALLBACK_TITLE
const REPORT_SHARE_TARGET = '/subpkg/discover/share-invite'

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
  components: { ReportGenerating, DiscoverReportView, ReportSharePosterCanvas },
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
      shareSessionId: '',
      shareReportId: '',
      sharePosterPath: '',
      sharePosterToken: 0,
    }
  },
  computed: {
    shareCoverUrl() {
      if (!this.report || !this.profile) return ''
      const session = loadDiscoverSession()
      const hero = buildReportHeroModel({
        report: this.report,
        profile: this.profile,
        genderOptionId: getBasicProfileGenderFromSession(session),
      })
      return hero.coverImagePath ? resolveAsset(hero.coverImagePath) : ''
    },
    sharePreviewModel() {
      if (!this.report || this.phase !== 'ready') return null
      const session = loadDiscoverSession()
      return buildReportSharePreviewModel({
        sessionId: this.shareSessionId || 'preview',
        reportId: this.shareReportId || 'preview',
        report: this.report,
        profile: this.profile,
        nickname: this.nickname,
        genderOptionId: getBasicProfileGenderFromSession(session),
      })
    },
  },
  onLoad(options) {
    if (options && options.shared === '1') {
      const query = []
      if (options.sessionId) query.push(`sessionId=${encodeURIComponent(options.sessionId)}`)
      if (options.reportId) query.push(`reportId=${encodeURIComponent(options.reportId)}`)
      const suffix = query.length ? `?${query.join('&')}` : ''
      uni.redirectTo({ url: `${REPORT_SHARE_TARGET}${suffix}` })
      return
    }
    this.shouldGenerate = options && (options.generate === '1' || options.generate === 'true')
    if (this.shouldGenerate) {
      this.syncNavigationBar('generating')
    }
    this.enableShareMenu()
  },
  onShow() {
    this.bootstrap()
  },
  onShareAppMessage() {
    return this.buildSharePayload()
  },
  onShareTimeline() {
    const payload = this.buildSharePayload()
    const query = this.buildShareQuery()
    return {
      title: payload.title || REPORT_SHARE_TIMELINE_TITLE,
      query: query || 'shared=1',
      imageUrl: payload.imageUrl || '',
    }
  },
  watch: {
    phase: {
      immediate: true,
      handler(value) {
        this.syncNavigationBar(value)
      },
    },
    sharePreviewModel: {
      deep: true,
      handler(value) {
        if (value) this.queueSharePosterGeneration()
      },
    },
    shareCoverUrl(value) {
      if (value && this.sharePreviewModel) {
        this.queueSharePosterGeneration()
      }
    },
  },
  methods: {
    enableShareMenu() {
      if (typeof uni.showShareMenu !== 'function') return
      try {
        uni.showShareMenu({
          menus: ['shareAppMessage', 'shareTimeline'],
        })
      } catch (error) {
        // Ignore unsupported clients.
      }
    },
    buildShareQuery() {
      const parts = ['shared=1']
      if (this.shareSessionId) parts.push(`sessionId=${encodeURIComponent(this.shareSessionId)}`)
      if (this.shareReportId) parts.push(`reportId=${encodeURIComponent(this.shareReportId)}`)
      return parts.join('&')
    },
    buildSharePayload() {
      const canvasRef = this.$refs.sharePosterCanvas
      const canvasPath = canvasRef && typeof canvasRef.getPosterPath === 'function'
        ? canvasRef.getPosterPath()
        : ''
      return buildShareAppMessagePayload({
        sessionId: this.shareSessionId,
        reportId: this.shareReportId,
        previewModel: this.sharePreviewModel,
        shareImageUrl: this.sharePosterPath || canvasPath || '',
      })
    },
    handleSharePosterReady(tempFilePath) {
      if (tempFilePath) {
        this.sharePosterPath = tempFilePath
      }
    },
    handlePrepareShare() {
      if (!this.sharePosterPath) {
        uni.showToast({ title: '正在生成分享预览...', icon: 'none', duration: 1200 })
      }
      this.generateSharePosterDirect()
      const canvasRef = this.$refs.sharePosterCanvas
      if (canvasRef && typeof canvasRef.renderPoster === 'function') {
        canvasRef.renderPoster()
      }
    },
    queueSharePosterGeneration() {
      if (this.sharePosterTimer) {
        clearTimeout(this.sharePosterTimer)
      }
      this.sharePosterTimer = setTimeout(() => {
        this.generateSharePosterDirect()
      }, 320)
    },
    async generateSharePosterDirect() {
      if (!this.sharePreviewModel) return
      const token = this.sharePosterToken + 1
      this.sharePosterToken = token
      const path = await renderReportSharePosterToTempFile(this.sharePreviewModel, {
        coverSrc: this.shareCoverUrl,
      })
      if (token !== this.sharePosterToken) return
      if (path) {
        this.sharePosterPath = path
      }
    },
    async prepareShareContext() {
      try {
        const sessionId = await ensureExploreSessionId()
        if (!sessionId) return
        this.shareSessionId = sessionId
        const latestRes = await api.getLatestReport(sessionId)
        const latest = (latestRes && latestRes.data) || {}
        if (latest.reportId) {
          this.shareReportId = latest.reportId
        }
      } catch (error) {
        // Share can still open landing page without ids; friend view will show fallback.
      }
    },
    syncNavigationBar(phase) {
      const isGenerating = phase === 'generating'
      uni.setNavigationBarTitle({ title: isGenerating ? '生成报告' : '兴趣报告' })
      uni.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
      })
    },
    goChat() {
      const session = loadDiscoverSession()
      uni.navigateTo({
        url: session && session.answers && session.answers.length > 0
          ? '/subpkg/discover/chat'
          : EXPLORATION_START_URL,
      })
    },
    showReadyReport(session, report) {
      this.report = report
      writeDiscoverReportCache(session, report)
      markDiscoverReportComplete(session)
      this.phase = 'ready'
      this.prepareShareContext()
    },
    async loadCompletedReport(session) {
      const sessionId = await ensureExploreSessionId()
      if (!sessionId) {
        throw new Error('无法读取报告会话，请稍后重试')
      }
      const latestRes = await api.getLatestReport(sessionId, 'full_explore')
      const latest = (latestRes && latestRes.data) || {}
      if (latest.reportId) {
        this.shareSessionId = sessionId
        this.shareReportId = latest.reportId
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
        try {
          const sessionId = await ensureExploreSessionId()
          if (sessionId) {
            this.shareSessionId = sessionId
            const latestRes = await api.getLatestReport(sessionId, 'full_explore')
            const latest = (latestRes && latestRes.data) || {}
            if (latest.reportId) this.shareReportId = latest.reportId
          }
        } catch (error) {
          // share ids are optional for viewing cached report
        }
        this.report = cachedReport
        this.phase = 'ready'
        this.prepareShareContext()
        return
      }

      if (this.shouldGenerate) {
        if (!isLoggedInForReport()) {
          const canProceed = await promptLoginForReport('/subpkg/discover/results?generate=1')
          if (!canProceed) {
            this.shouldGenerate = false
            uni.navigateBack({
              fail: () => {
                uni.reLaunch({ url: '/pages/discover/index' })
              },
            })
            return
          }
        }
        prepareDiscoverSessionForReport()
        this.discoverSession = loadDiscoverSession()
        this.profile = this.discoverSession.profile || null
        this.startGeneration(true)
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
      if (!isLoggedInForReport()) {
        const canProceed = await promptLoginForReport('/subpkg/discover/results?generate=1')
        if (!canProceed) return
      }
      if (this.phase === 'generating' && !this.reportError && !forceRegenerate) return
      const session = prepareDiscoverSessionForReport()
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
        const sessionId = await ensureExploreSessionId()
        if (sessionId) {
          this.shareSessionId = sessionId
          const latestRes = await api.getLatestReport(sessionId, 'full_explore')
          const latest = (latestRes && latestRes.data) || {}
          if (latest.reportId) this.shareReportId = latest.reportId
        }
        const latestSession = loadDiscoverSession()
        writeDiscoverReportCache(latestSession, report)
        markDiscoverReportComplete(latestSession)
        this.phase = 'ready'
        this.prepareShareContext()
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
  background: #ffffff;
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
