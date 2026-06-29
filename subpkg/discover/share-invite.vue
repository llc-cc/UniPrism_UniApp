<template>
  <view class="share-invite-page">
    <view v-if="phase === 'loading'" class="state-block">
      <text class="state-title">正在打开分享报告...</text>
    </view>

    <view v-else-if="phase === 'error'" class="state-block">
      <text class="state-title">分享报告暂时无法打开</text>
      <text class="state-desc">{{ errorMessage || '请稍后重试' }}</text>
      <button class="state-button" @tap="reload">重试</button>
    </view>

    <scroll-view v-else class="share-invite-scroll" scroll-y>
      <view class="hero">
        <image v-if="coverUrl" class="cover" :src="coverUrl" mode="aspectFill" />
        <view v-else class="cover cover--placeholder" />
        <text class="greeting">Hi，{{ viewModel.nickname }}</text>
        <view class="tagline-pill">
          <view class="tagline-accent" />
          <text class="tagline-code">{{ viewModel.codeTag }}</text>
          <text class="tagline-text">{{ viewModel.taglineText }}</text>
        </view>
      </view>

      <view class="content-card">
        <view class="section-block">
          <text class="section-title">他的特点</text>
          <text class="section-body">{{ viewModel.traitText }}</text>
          <view class="pill-row">
            <view v-if="personalityPillParts.value" class="info-pill info-pill--personality">
              <view class="info-pill-inner">
                <image class="info-pill-icon" src="/static/assets/discover/profile-clipboard-figma.svg" mode="aspectFit" />
                <text class="info-pill-label">{{ personalityPillParts.label }}</text>
                <text class="info-pill-value">{{ personalityPillParts.value }}</text>
              </view>
            </view>
            <view v-if="personaPillParts.value" class="info-pill info-pill--persona">
              <view class="info-pill-inner">
                <image class="info-pill-icon" src="/static/assets/discover/profile-clipboard-figma.svg" mode="aspectFit" />
                <text class="info-pill-label">{{ personaPillParts.label }}</text>
                <text class="info-pill-value">{{ personaPillParts.value }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="section-block">
          <text class="section-title">专业推荐</text>
          <view v-for="item in viewModel.majorSamples" :key="item.rank" class="major-sample">
            <text class="major-sample-name">{{ item.rank }}.{{ item.name }}</text>
            <view class="major-sample-rating">
              <text class="major-sample-label">推荐指数:</text>
              <view class="major-sample-stars">
                <text
                  v-for="starIndex in 5"
                  :key="item.rank + '-' + starIndex"
                  class="major-sample-star"
                  :class="{ 'major-sample-star--on': starIndex <= item.stars }"
                >
                  ★
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="section-block section-block--last">
          <text class="section-title">综合建议</text>
          <text class="section-body">{{ viewModel.adviceText }}</text>
        </view>
      </view>

      <view class="share-card">
        <text class="share-card-title">你也觉得有趣？</text>
        <text class="share-card-desc">快来体验我们的测试吧，看看你的推荐职业有哪些！</text>
        <button class="share-card-button" @tap="handleJoin">
          <image class="share-card-button-icon" src="/static/assets/discover/share-join-globe.svg" mode="aspectFit" />
          <text class="share-card-button-label">加入我们</text>
        </button>
      </view>

      <view class="bottom-safe" />
    </scroll-view>
  </view>
</template>

<script>
import {
  buildLoginUrl,
  hasAppAccess,
  hasCompletedLaunchForUser,
  needsPendingLaunchFlow,
  resumePostLoginFlow,
} from '../../business/auth-guard'
import { ensureExploreSessionId } from '../../business/profile-sync'
import { buildShareInviteViewModel } from './business/report-share-view'
import { loadDiscoverSession } from '../../business/discover-session-storage'
import { getBasicProfileGenderFromSession } from '../../business/user-avatar'
import { api } from '../../utils/api'
import { resolveAsset } from '../../utils/asset-map'

const START_URL = '/subpkg/discover/chat?screen=stage-personality-intro'
const LAUNCH_URL = `/pages/auth/launch?next=${encodeURIComponent(START_URL)}`

function extractNickname(session) {
  const answers = (session && session.answers) || []
  const basic = answers.find((item) => item.questionId === 'basic-profile')
  const fields = basic && basic.value && basic.value.fields
  const name = fields && fields.name
  return typeof name === 'string' && name.trim() ? name.trim() : ''
}

function splitPillText(value, fallbackLabel) {
  const text = String(value || '').trim()
  if (!text) {
    return {
      label: `${fallbackLabel}---`,
      value: '',
    }
  }

  const parts = text.split('---')
  if (parts.length < 2) {
    return {
      label: `${fallbackLabel}---`,
      value: text,
    }
  }

  const label = String(parts.shift() || fallbackLabel).trim() || fallbackLabel
  const suffix = parts.join('---').trim()
  return {
    label: `${label}---`,
    value: suffix,
  }
}

const EMPTY_VIEW_MODEL = {
  nickname: '同学',
  codeTag: 'RA型',
  taglineText: '兴趣画像已生成',
  coverImagePath: '',
  traitText: '完成兴趣探索后，这里会展示 TA 的特点与推荐方向。',
  personalityPill: '',
  personaPill: '',
  adviceText: '完成兴趣探索后，这里会展示综合建议。',
  majorSamples: [],
}

export default {
  data() {
    return {
      phase: 'loading',
      errorMessage: '',
      sessionId: '',
      reportId: '',
      viewModel: { ...EMPTY_VIEW_MODEL },
    }
  },
  computed: {
    coverUrl() {
      const path = this.viewModel && this.viewModel.coverImagePath
      return path ? resolveAsset(path) : ''
    },
    personalityPillParts() {
      return splitPillText(this.viewModel && this.viewModel.personalityPill, '性格测试结果')
    },
    personaPillParts() {
      return splitPillText(this.viewModel && this.viewModel.personaPill, '综合人格画像')
    },
  },
  onLoad(options) {
    this.sessionId = (options && options.sessionId) || ''
    this.reportId = (options && options.reportId) || ''
    this.loadSharedReport()
  },
  methods: {
    reload() {
      this.loadSharedReport()
    },
    async loadSharedReport() {
      if (!this.sessionId || !this.reportId) {
        this.phase = 'error'
        this.errorMessage = '分享链接缺少报告参数，请让朋友重新转发。'
        return
      }

      this.phase = 'loading'
      this.errorMessage = ''

      try {
        const res = await api.getSharedReport(this.sessionId, this.reportId)
        const payload = (res && res.data) || null
        if (!payload || !payload.report) {
          throw new Error('分享报告内容不可用')
        }
        const session = loadDiscoverSession()
        this.viewModel = buildShareInviteViewModel(payload, {
          sessionId: this.sessionId,
          reportId: this.reportId,
          localProfile: session && session.profile,
          genderOptionId: getBasicProfileGenderFromSession(session),
          nickname: extractNickname(session) || payload.nickname,
        })
        this.phase = 'ready'
      } catch (error) {
        this.phase = 'error'
        this.errorMessage = (error && error.message) || '分享报告读取失败，请稍后重试'
      }
    },
    async handleJoin() {
      if (!hasAppAccess()) {
        uni.reLaunch({ url: buildLoginUrl() })
        return
      }

      if (needsPendingLaunchFlow()) {
        resumePostLoginFlow(START_URL)
        return
      }

      const user = api.getUser()
      if (user && user.id && !hasCompletedLaunchForUser(user.id)) {
        uni.reLaunch({ url: LAUNCH_URL })
        return
      }

      uni.showLoading({ title: '准备探索...' })
      try {
        await ensureExploreSessionId()
        uni.reLaunch({ url: START_URL })
      } catch (error) {
        uni.showToast({
          title: (error && error.message) || '后端会话初始化失败',
          icon: 'none',
        })
      } finally {
        uni.hideLoading()
      }
    },
  },
}
</script>

<style scoped>
.share-invite-page {
  min-height: 100vh;
  background: #f2f0f8;
}

.share-invite-scroll {
  min-height: 100vh;
  padding: 0 28rpx 40rpx;
  box-sizing: border-box;
}

.state-block {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  box-sizing: border-box;
  gap: 20rpx;
}

.state-title {
  font-size: 32rpx;
  line-height: 1.5;
  font-weight: 700;
  color: #1c2130;
  text-align: center;
}

.state-desc {
  font-size: 26rpx;
  line-height: 1.65;
  color: #676e80;
  text-align: center;
}

.state-button {
  margin-top: 12rpx;
  min-width: 220rpx;
  height: 80rpx;
  line-height: 80rpx;
  border: none;
  border-radius: 999rpx;
  background: #f9d54a;
  color: #1c2130;
  font-size: 28rpx;
  font-weight: 700;
}

.state-button::after {
  border: none;
}

.hero {
  padding-top: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cover {
  width: 278rpx;
  height: 352rpx;
  border-radius: 14rpx;
  box-shadow: 0 16rpx 28rpx rgba(0, 0, 0, 0.18);
}

.cover--placeholder {
  background: #d9d9d9;
}

.greeting {
  margin-top: 30rpx;
  font-size: 42rpx;
  line-height: 1.2;
  font-weight: 700;
  color: #1c2130;
  text-align: center;
}

.tagline-pill {
  margin-top: 28rpx;
  display: inline-flex;
  align-self: center;
  max-width: calc(100% - 8rpx);
  border-radius: 5rpx;
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(252, 250, 255, 1) 100%);
  box-shadow: 0 10rpx 44rpx rgba(91, 91, 110, 0.21);
  position: relative;
  overflow: hidden;
  align-items: center;
  padding: 16rpx 22rpx 16rpx 26rpx;
  gap: 8rpx;
  box-sizing: border-box;
}

.tagline-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10rpx;
  background: #000000;
  border-radius: 0 0 5rpx 5rpx;
}

.tagline-code {
  flex-shrink: 0;
  font-size: 30rpx;
  line-height: 1.2;
  font-weight: 700;
  color: #424651;
}

.tagline-text {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 28rpx;
  line-height: 1.2;
  color: #424651;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-card {
  margin-top: 28rpx;
  width: 100%;
  border-radius: 24rpx;
  background: #ffffff;
  padding: 32rpx 28rpx;
  box-sizing: border-box;
  box-shadow: 0 8rpx 24rpx rgba(40, 50, 72, 0.06);
}

.section-block + .section-block {
  margin-top: 36rpx;
  padding-top: 36rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.08);
}

.section-title {
  display: block;
  font-size: 36rpx;
  line-height: 1.5;
  font-weight: 700;
  color: #1c2130;
}

.section-body {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  line-height: 1.75;
  color: #676e80;
}

.pill-row {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.info-pill {
  display: flex;
  align-self: center;
  justify-content: center;
  width: 510rpx;
  max-width: 100%;
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: #92ba38;
  box-sizing: border-box;
}

.info-pill-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 360rpx;
  max-width: 100%;
  gap: 12rpx;
}

.info-pill-icon {
  display: block;
  width: 32rpx;
  height: 32rpx;
  flex: 0 0 32rpx;
}

.info-pill-label,
.info-pill-value {
  min-width: 0;
  font-size: 26rpx;
  line-height: 1.3;
  font-weight: 600;
  color: #ffffff;
  text-align: left;
  white-space: nowrap;
}

.info-pill-label {
  flex: 0 0 176rpx;
}

.info-pill-value {
  flex: 1 1 auto;
}

.major-sample {
  margin-top: 16rpx;
  min-height: 72rpx;
  border-radius: 16rpx;
  background: #fff4c8;
  padding: 16rpx 20rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.major-sample-name {
  flex-shrink: 0;
  font-size: 26rpx;
  line-height: 1.4;
  font-weight: 600;
  color: #1c2130;
}

.major-sample-rating {
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}

.major-sample-label {
  font-size: 22rpx;
  line-height: 1.4;
  color: #676e80;
  white-space: nowrap;
}

.major-sample-stars {
  display: flex;
  align-items: center;
  gap: 2rpx;
}

.major-sample-star {
  font-size: 22rpx;
  line-height: 1;
  color: #d1d5db;
}

.major-sample-star--on {
  color: #f5b800;
}

.share-card {
  margin-top: 28rpx;
  width: 100%;
  border-radius: 48rpx;
  padding: 36rpx 32rpx 32rpx;
  box-sizing: border-box;
  background: linear-gradient(90deg, #faebab 0%, #fffffc 100%);
  border: 2rpx solid #f6e08a;
  box-shadow: 0 8rpx 24rpx rgba(214, 170, 36, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.share-card-title {
  display: block;
  font-size: 34rpx;
  line-height: 1.4;
  font-weight: 700;
  color: #1c2130;
}

.share-card-desc {
  display: block;
  margin-top: 16rpx;
  max-width: 560rpx;
  font-size: 26rpx;
  line-height: 1.65;
  color: #4b5565;
}

.share-card-button {
  margin-top: 28rpx;
  width: 100%;
  height: 88rpx;
  border: none;
  border-radius: 999rpx;
  background: #f9d54a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 0 #d9b52f;
}

.share-card-button-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}

.share-card-button-label {
  font-size: 30rpx;
  line-height: 1;
  font-weight: 700;
  color: #1c2130;
}

.share-card-button::after {
  border: none;
}

.bottom-safe {
  height: calc(24rpx + env(safe-area-inset-bottom));
}
</style>
