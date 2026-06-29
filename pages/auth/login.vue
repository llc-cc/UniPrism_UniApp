<template>
  <scroll-view class="login-page" scroll-y>
    <view class="login-page-bg">
      <view class="bg-glow bg-glow-top" />
      <view class="bg-glow bg-glow-bottom" />
      <view class="bg-waves">
        <image
          class="bg-waves-img"
          src="/static/assets/auth/login-background-waves.svg?v=5"
          mode="widthFix"
        />
      </view>
    </view>

    <view class="login-shell" :style="shellStyle">
      <!-- 落地页 -->
      <view v-if="screen === 'landing'" class="landing-view">
        <view class="landing-brand">
          <image class="brand-logo" src="/static/assets/auth/login-brand-mark.svg" mode="aspectFit" />
          <text class="brand-title">万有棱镜</text>
          <text class="brand-subtitle">告别专业迷茫，从容规划职业</text>
        </view>

        <view class="landing-spacer" />

        <view class="landing-actions">
          <view class="entry-button-row">
            <!-- #ifdef MP-WEIXIN -->
            <button
              v-if="wechatLoginEnabled"
              class="entry-pill entry-pill--primary"
              plain
              hover-class="none"
              :disabled="wechatLoading"
              @tap="openWechat"
            >
              <image class="entry-icon" src="/static/assets/auth/login-icon-wechat.svg" mode="aspectFit" />
              <text class="entry-label">{{ wechatLoading ? '登录中...' : '一键登录' }}</text>
            </button>
            <!-- #endif -->

            <button class="entry-pill entry-pill--primary" plain hover-class="none" @tap="openPhone">
              <image class="entry-icon" src="/static/assets/auth/login-icon-phone.svg" mode="aspectFit" />
              <text class="entry-label">手机号登录</text>
            </button>
          </view>

          <text v-if="displayError" class="error error--landing">{{ displayError }}</text>
        </view>
      </view>

      <!-- 子页面：手机号 / 微信 -->
      <view v-else class="sub-view">
        <view class="sub-nav">
          <view class="back-btn" @tap="goBack">
            <image class="back-icon" src="/static/assets/auth/login-icon-back.svg" mode="aspectFit" />
          </view>
        </view>

        <!-- 手机号登录 -->
        <view v-if="screen === 'phone'" class="sub-content">
          <text class="sub-title">手机号登录</text>
          <text class="sub-desc">验证码登录，首次使用将自动创建账号</text>

          <view class="pill-field">
            <input
              class="pill-input"
              v-model="phone"
              type="number"
              maxlength="11"
              placeholder="请输入手机号"
              placeholder-class="pill-placeholder"
            />
          </view>
          <text v-if="phoneIssue" class="field-issue">{{ phoneIssue }}</text>

          <view class="pill-field pill-field--code">
            <input
              class="pill-input pill-input--code"
              v-model="smsCode"
              type="number"
              maxlength="6"
              placeholder="6 位验证码"
              placeholder-class="pill-placeholder"
            />
            <button
              class="code-chip"
              :disabled="smsSending || smsCooldown > 0 || !canSendSms"
              @tap="handleSendCode"
            >
              {{ smsCooldown > 0 ? smsCooldown + 's' : (smsSending ? '发送中' : '获取验证码') }}
            </button>
          </view>
          <text v-if="smsCodeIssue" class="field-issue">{{ smsCodeIssue }}</text>

          <view v-if="smsDevHint || smsDevCode" class="dev-sms-hint">
            <text v-if="smsDevHint" class="dev-sms-hint-text">{{ smsDevHint }}</text>
            <text v-if="smsDevCode" class="dev-sms-code">开发验证码：{{ smsDevCode }}</text>
          </view>

          <text v-if="displayError" class="error">{{ displayError }}</text>

          <button
            class="pill-submit"
            :class="{ 'pill-submit--active': canSubmitPhone }"
            :disabled="loading || !canSubmitPhone"
            @tap="handleSubmit"
          >
            {{ loading ? '处理中...' : '登录' }}
          </button>
        </view>

        <!-- 一键登录（原生头像 / 昵称 / 手机号） -->
        <!-- #ifdef MP-WEIXIN -->
        <view v-else-if="screen === 'wechat'" class="sub-content">
          <text class="sub-title">一键登录</text>
          <text class="sub-desc">完善头像与昵称，并完成手机号验证。报告中的称呼请在基本信息里单独填写。</text>

          <button class="wechat-native-avatar" open-type="chooseAvatar" @chooseavatar="onChooseWechatAvatar">
            <image
              v-if="wechatAvatarTemp"
              class="wechat-native-avatar-img"
              :src="wechatAvatarTemp"
              mode="aspectFill"
            />
            <text v-else class="wechat-native-avatar-text">选择头像</text>
          </button>

          <view class="pill-field">
            <input
              class="pill-input"
              type="nickname"
              :value="wechatNickname"
              placeholder="填写昵称"
              placeholder-class="pill-placeholder"
              maxlength="32"
              @input="onWechatNicknameInput"
              @blur="onWechatNicknameInput"
            />
          </view>

          <text v-if="wechatProfileIssue" class="field-issue">{{ wechatProfileIssue }}</text>

          <button
            class="pill-submit pill-submit--active"
            open-type="getPhoneNumber"
            :loading="wechatLoading"
            @getphonenumber="handleWechatLogin"
          >
            {{ wechatLoading ? '登录中...' : '确认登录' }}
          </button>
        </view>
        <!-- #endif -->
      </view>

      <view class="legal-row" @tap="toggleAgreement">
        <view class="legal-check" :class="{ 'legal-check--on': agreedToTerms }">
          <text v-if="agreedToTerms" class="legal-check-mark">✓</text>
        </view>
        <view class="legal-copy">
          <text class="legal-text">我已阅读并同意</text>
          <text class="legal-link" @tap.stop="openBetaNotice">《用户服务条款》</text>
          <text class="legal-text">及</text>
          <text class="legal-link" @tap.stop="openBetaNotice">《隐私政策》</text>
        </view>
      </view>
    </view>

    <view v-if="showBetaNotice" class="beta-notice-mask" @tap="closeBetaNotice">
      <view class="beta-notice-dialog" @tap.stop>
        <text class="beta-notice-title-en">Beta Notice</text>
        <text class="beta-notice-title">内测期间声明</text>
        <scroll-view class="beta-notice-scroll" scroll-y>
          <text class="beta-notice-body">UniPrism 当前处于内测阶段，页面、功能、数据结构、服务内容和体验路径可能根据测试反馈、技术条件或合规要求调整、暂停或终止。</text>
          <text class="beta-notice-body">邀请码登录用于识别内测账号、恢复探索记录、保存同意状态、改进体验质量和保障系统安全。平台只在提供当前服务所必需的范围内处理相关信息。</text>
          <text class="beta-notice-body">专业探索、真实任务样本、测评结果、AI 提示和推荐内容仅用于兴趣验证与自我了解，不构成升学、就业、心理、医疗、法律、财务或其他专业意见。</text>
          <text class="beta-notice-body">点击登录即代表您已知悉当前内测性质，并同意在内测范围内使用 UniPrism。若不同意上述声明，请暂时不要登录或继续使用会产生探索记录的功能。</text>
        </scroll-view>
        <button class="beta-notice-btn" @tap="closeBetaNotice">我已知悉</button>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { api } from '../../utils/api'
import { completeAuthLogin } from '../../business/explore-session-merge'
import { hasAppAccess, goAppHome, routeAfterLogin, needsPendingLaunchFlow, resumePostLoginFlow } from '../../business/auth-guard'
import {
  getPhoneIssue,
  getSmsCodeIssue,
  normalizePhone,
} from '../../business/auth-credential-rules'
import { WECHAT_LOGIN_ENABLED } from '../../business/wechat-login-config'


export default {
  data() {
    return {
      screen: 'landing',
      agreedToTerms: false,
      shellStyle: '',
      phone: '',
      smsCode: '',
      error: '',
      loading: false,
      showFieldValidation: false,
      showPhoneValidation: false,
      smsSending: false,
      smsCooldown: 0,
      cooldownTimer: null,
      smsDevHint: '',
      smsDevCode: '',
      wechatLoading: false,
      wechatLoginEnabled: WECHAT_LOGIN_ENABLED,
      wechatAvatarTemp: '',
      wechatNickname: '',
      wechatProfileIssue: '',
      redirectUrl: '',
      showBetaNotice: false,
    }
  },
  computed: {
    canSendSms() {
      return Boolean(normalizePhone(this.phone))
    },
    canSubmitPhone() {
      return Boolean(normalizePhone(this.phone) && !getSmsCodeIssue(this.smsCode))
    },
    phoneIssue() {
      if (this.screen !== 'phone') return ''
      if (!this.showFieldValidation && !this.showPhoneValidation) return ''
      return getPhoneIssue(this.phone) || ''
    },
    smsCodeIssue() {
      if (this.screen !== 'phone') return ''
      if (!this.showFieldValidation) return ''
      return getSmsCodeIssue(this.smsCode) || ''
    },
    displayError() {
      if (!this.error) return ''
      const fieldErrors = [
        this.phoneIssue,
        this.smsCodeIssue,
      ]
      if (fieldErrors.includes(this.error)) return ''
      return this.error
    },
  },
  onLoad(options) {
    try {
      const sys = uni.getSystemInfoSync()
      const top = (sys.statusBarHeight || 0) + 8
      this.shellStyle = `padding-top: ${top}px`
    } catch {
      this.shellStyle = ''
    }

    if (options && options.redirect) {
      try {
        this.redirectUrl = decodeURIComponent(options.redirect)
      } catch {
        this.redirectUrl = options.redirect
      }
    }
    this.loadWechatLoginStatus()
    if (hasAppAccess()) {
      if (needsPendingLaunchFlow()) {
        resumePostLoginFlow()
      } else {
        goAppHome()
      }
    }
  },
  onUnload() {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer)
  },
  methods: {
    async loadWechatLoginStatus() {
      // #ifdef MP-WEIXIN
      try {
        const res = await api.getWechatLoginStatus()
        const data = (res && res.data) || {}
        this.wechatLoginEnabled = Boolean(data.enabled && data.ready)
      } catch {
        this.wechatLoginEnabled = WECHAT_LOGIN_ENABLED
      }
      // #endif
    },
    toggleAgreement() {
      this.agreedToTerms = !this.agreedToTerms
    },
    openBetaNotice() {
      this.showBetaNotice = true
    },
    closeBetaNotice() {
      this.showBetaNotice = false
    },
    ensureAgreement() {
      if (this.agreedToTerms) return true
      uni.showToast({ title: '请先阅读并同意用户条款', icon: 'none' })
      return false
    },
    openPhone() {
      if (!this.ensureAgreement()) return
      this.error = ''
      this.smsDevCode = ''
      this.showFieldValidation = false
      this.showPhoneValidation = false
      this.screen = 'phone'
      this.loadSmsLoginStatus()
    },
    async loadSmsLoginStatus() {
      try {
        const res = await api.getSmsLoginStatus()
        const data = (res && res.data) || {}
        this.smsDevHint = data.mode === 'dev' ? (data.hint || '当前为开发验证码模式，请使用下方验证码完成联调。') : ''
      } catch {
        this.smsDevHint = ''
      }
    },
    goBack() {
      this.error = ''
      this.smsDevCode = ''
      this.wechatProfileIssue = ''
      this.showFieldValidation = false
      if (this.screen === 'phone' || this.screen === 'wechat') {
        this.screen = 'landing'
        return
      }
    },
    startCooldown(seconds) {
      this.smsCooldown = seconds
      if (this.cooldownTimer) clearInterval(this.cooldownTimer)
      this.cooldownTimer = setInterval(() => {
        if (this.smsCooldown <= 1) {
          this.smsCooldown = 0
          clearInterval(this.cooldownTimer)
          this.cooldownTimer = null
        } else {
          this.smsCooldown -= 1
        }
      }, 1000)
    },
    async finishAuth(res, fallbackName, loginMethod) {
      await completeAuthLogin(res, fallbackName)
      routeAfterLogin(res, { loginMethod, redirectUrl: this.redirectUrl })
    },
    wxLogin() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          success: resolve,
          fail: reject,
        })
      })
    },
    openWechat() {
      if (!this.wechatLoginEnabled) return
      if (!this.ensureAgreement()) return
      this.error = ''
      this.wechatProfileIssue = ''
      this.wechatAvatarTemp = ''
      this.wechatNickname = ''
      this.screen = 'wechat'
    },
    onChooseWechatAvatar(e) {
      const avatarUrl = e && e.detail && e.detail.avatarUrl
      if (avatarUrl) {
        this.wechatAvatarTemp = avatarUrl
        this.wechatProfileIssue = ''
      }
    },
    onWechatNicknameInput(e) {
      this.wechatNickname = (e && e.detail && e.detail.value) || ''
      if (this.wechatNickname.trim()) this.wechatProfileIssue = ''
    },
    readAvatarBase64(filePath) {
      return new Promise((resolve, reject) => {
        uni.getFileSystemManager().readFile({
          filePath,
          encoding: 'base64',
          success: (res) => resolve(res.data || ''),
          fail: reject,
        })
      })
    },
    async handleWechatLogin(e) {
      if (!this.wechatLoginEnabled) return
      if (!this.ensureAgreement()) return

      const nickName = this.wechatNickname.trim()
      if (!nickName) {
        this.wechatProfileIssue = '请填写昵称'
        uni.showToast({ title: '请填写昵称', icon: 'none' })
        return
      }
      if (!this.wechatAvatarTemp) {
        this.wechatProfileIssue = '请选择头像'
        uni.showToast({ title: '请选择头像', icon: 'none' })
        return
      }

      const detail = (e && e.detail) || {}
      if (detail.errMsg !== 'getPhoneNumber:ok') {
        if (detail.errMsg && detail.errMsg.includes('deny')) {
          this.wechatProfileIssue = '需要手机号才能完成登录'
        } else if (detail.errMsg) {
          this.wechatProfileIssue = '登录失败，请重试'
        }
        return
      }

      const phoneCode = detail.code
      if (!phoneCode) {
        this.wechatProfileIssue = '未获取到手机号，请重试'
        return
      }

      this.error = ''
      this.wechatProfileIssue = ''
      this.wechatLoading = true
      try {
        const loginRes = await this.wxLogin()
        if (!loginRes || !loginRes.code) {
          throw new Error('登录失败，请重试')
        }
        const avatarBase64 = await this.readAvatarBase64(this.wechatAvatarTemp)
        if (!avatarBase64) {
          throw new Error('头像读取失败，请重新选择')
        }
        const res = await api.loginWithWechat(loginRes.code, phoneCode, {
          nickName,
          avatarBase64,
        })
        const user = (res && res.data && res.data.user) || {}
        await this.finishAuth(res, user.wechatNickname || user.phone || user.name, 'wechat')
      } catch (err) {
        this.wechatProfileIssue = (err && err.message) || '登录失败'
      } finally {
        this.wechatLoading = false
      }
    },
    async handleSendCode() {
      if (!this.ensureAgreement()) return
      this.showPhoneValidation = true
      if (this.phoneIssue) return
      const phone = normalizePhone(this.phone)
      if (!phone) {
        this.error = '请输入有效的中国大陆手机号'
        return
      }
      this.error = ''
      this.smsSending = true
      try {
        const res = await api.sendSmsCode(phone)
        const data = (res && res.data) || {}
        if (data.devCode) {
          this.smsDevCode = data.devCode
          this.smsCode = data.devCode
          uni.showToast({ title: '验证码已生成', icon: 'none' })
        } else {
          this.smsDevCode = ''
          uni.showToast({ title: '验证码已发送', icon: 'none' })
        }
        this.startCooldown(60)
      } catch (e) {
        this.error = e.message || '验证码发送失败'
      } finally {
        this.smsSending = false
      }
    },
    async handleSubmit() {
      if (!this.ensureAgreement()) return
      this.error = ''
      this.loading = true
      try {
        if (this.screen === 'phone') {
          this.showFieldValidation = true
          if (this.phoneIssue || this.smsCodeIssue) return
          const phone = normalizePhone(this.phone)
          if (!phone) {
            this.error = '请输入有效的中国大陆手机号'
            return
          }
          const res = await api.loginWithPhone(phone, this.smsCode.trim())
          const user = (res && res.data && res.data.user) || {}
          await this.finishAuth(res, user.name || user.phone, 'phone')
          return
        }
      } catch (e) {
        this.error = e.message || '操作失败'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #d5a6bd 0%, #b898e8 38%, #9478f5 68%, #8e78ff 100%);
}

.login-page-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(10rpx);
}

.bg-glow-top {
  top: -180rpx;
  left: -80rpx;
  width: 680rpx;
  height: 680rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.04) 56%, rgba(255, 255, 255, 0) 80%);
}

.bg-glow-bottom {
  right: -180rpx;
  bottom: -260rpx;
  width: 860rpx;
  height: 860rpx;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 72%);
}

.bg-waves {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  pointer-events: none;
  overflow: hidden;
}

.bg-waves-img {
  display: block;
  width: 100%;
  min-height: 68vh;
  opacity: 0.96;
}

.login-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 24rpx 40rpx 48rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.landing-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
}

.landing-brand {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 260rpx;
}

.landing-spacer {
  flex: 1;
  min-height: 80rpx;
}

.landing-actions {
  flex-shrink: 0;
  padding-bottom: 18rpx;
  transform: translateY(-170rpx);
}

.brand-logo {
  margin-top: 20rpx;
  width: 218rpx;
  height: 208rpx;
  filter: drop-shadow(0 8rpx 20rpx rgba(43, 24, 110, 0.22));
}

.brand-title {
  display: block;
  margin-top: 28rpx;
  font-size: 56rpx;
  line-height: 1.25;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2rpx;
}

.brand-subtitle {
  display: block;
  margin-top: 30rpx;
  font-size: 26rpx;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.88);
}

.entry-button-row {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.entry-pill {
  width: 100%;
  height: 104rpx;
  border-radius: 999rpx;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.entry-pill--primary {
  background: #ffffff !important;
  color: #1d1d1f;
  box-shadow: 0 16rpx 40rpx rgba(67, 39, 172, 0.12);
}

.entry-pill--primary[disabled] {
  opacity: 0.72;
}

.entry-pill::after,
.pill-submit::after,
.code-chip::after {
  border: none;
}

.entry-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.entry-label {
  font-size: 32rpx;
  font-weight: 600;
  color: #1d1d1f;
}

.landing-links {
  display: flex;
  justify-content: center;
  margin-top: 28rpx;
}

.landing-link {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: underline;
}

.sub-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sub-nav {
  height: 72rpx;
  display: flex;
  align-items: center;
  margin-bottom: 48rpx;
}

.back-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 40rpx;
  height: 40rpx;
}

.sub-content {
  flex: 1;
}

.sub-title {
  display: block;
  font-size: 48rpx;
  line-height: 1.35;
  font-weight: 700;
  color: #ffffff;
}

.sub-desc {
  display: block;
  margin-top: 16rpx;
  margin-bottom: 48rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.88);
}

.pill-field {
  min-height: 104rpx;
  border-radius: 999rpx;
  background: #ffffff;
  padding: 0 36rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.pill-field--code {
  padding-right: 12rpx;
}

.pill-input {
  flex: 1;
  min-width: 0;
  height: 96rpx;
  font-size: 30rpx;
  color: #1d1d1f;
  background: transparent;
}

.pill-input--code {
  padding-right: 12rpx;
}

.pill-placeholder {
  color: #b0b4be;
  font-size: 30rpx;
}

.code-chip {
  flex-shrink: 0;
  height: 72rpx;
  line-height: 72rpx;
  padding: 0 24rpx;
  border-radius: 999rpx;
  background: rgba(107, 35, 255, 0.1);
  color: #6b23ff;
  font-size: 24rpx;
  font-weight: 600;
  border: none;
}

.code-chip[disabled] {
  color: #9ca3af;
  background: #f3f4f6;
}

.pill-submit {
  width: 100%;
  height: 104rpx;
  line-height: 104rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #1d1d1f;
  font-size: 34rpx;
  font-weight: 700;
  border: none;
  margin-top: 16rpx;
}

.pill-submit--active {
  background: #6b23ff;
  color: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(67, 39, 172, 0.28);
}

.pill-submit[disabled] {
  opacity: 0.72;
}

.field-issue {
  display: block;
  margin: -12rpx 0 16rpx 20rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: #ffe4e4;
}

.dev-sms-hint {
  margin: -8rpx 0 20rpx;
  padding: 18rpx 22rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.2);
}

.dev-sms-hint-text {
  display: block;
  font-size: 22rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.92);
}

.dev-sms-code {
  display: block;
  margin-top: 8rpx;
  font-size: 28rpx;
  line-height: 1.5;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2rpx;
}

.error {
  display: block;
  margin: 0 0 20rpx;
  padding: 18rpx 22rpx;
  border-radius: 22rpx;
  background: rgba(255, 255, 255, 0.16);
  color: #fff5f5;
  font-size: 24rpx;
  line-height: 1.7;
}

.error--landing {
  text-align: center;
  margin-top: 8rpx;
}

.sub-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  margin-top: 32rpx;
}

.sub-link {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: underline;
}

.invite-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  padding: 22rpx 28rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
  border: 2rpx solid rgba(255, 255, 255, 0.28);
}

.invite-chip-copy {
  flex: 1;
  min-width: 0;
}

.invite-chip-label {
  display: block;
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
}

.invite-chip-text {
  display: block;
  margin-top: 6rpx;
  font-size: 28rpx;
  color: #ffffff;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.invite-change {
  margin-left: 18rpx;
  font-size: 26rpx;
  color: #ffffff;
  font-weight: 700;
  text-decoration: underline;
}

.legal-row {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 12rpx;
  margin-top: auto;
  padding-top: 24rpx;
  padding-bottom: 8rpx;
  transform: translateY(-40rpx);
}

.legal-check {
  width: 32rpx;
  height: 32rpx;
  margin-top: 4rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.85);
  background: transparent;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.legal-check--on {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(255, 255, 255, 0.95);
}

.legal-check-mark {
  font-size: 20rpx;
  color: #6b23ff;
  font-weight: 700;
  line-height: 1;
}

.legal-copy {
  flex: 1;
  max-width: 560rpx;
  display: flex;
  flex-wrap: wrap;
}

.legal-text {
  font-size: 22rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.92);
}

.legal-link {
  font-size: 22rpx;
  line-height: 1.7;
  color: #ffffff;
  font-weight: 700;
  text-decoration: underline;
}

.beta-notice-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  background: rgba(30, 20, 68, 0.52);
  box-sizing: border-box;
}

.beta-notice-dialog {
  width: 100%;
  max-width: 640rpx;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 40rpx 34rpx 34rpx;
  border-radius: 36rpx;
  background: rgba(255, 255, 255, 0.98);
  box-sizing: border-box;
  box-shadow: 0 18rpx 48rpx rgba(43, 24, 110, 0.22);
}

.beta-notice-scroll {
  flex: 1;
  min-height: 0;
  margin-top: 10rpx;
}

.beta-notice-title-en {
  display: block;
  font-size: 24rpx;
  line-height: 1.5;
  color: #6b23ff;
  font-weight: 700;
}

.beta-notice-title {
  display: block;
  margin-top: 8rpx;
  font-size: 34rpx;
  line-height: 1.4;
  color: #1d1d1f;
  font-weight: 700;
}

.beta-notice-body {
  display: block;
  margin-top: 22rpx;
  font-size: 24rpx;
  line-height: 1.8;
  color: #4b5563;
}

.beta-notice-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  margin-top: 32rpx;
  border-radius: 999rpx;
  border: none;
  background: #6b23ff;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 700;
  box-shadow: 0 12rpx 32rpx rgba(67, 39, 172, 0.28);
}

.beta-notice-btn::after {
  border: none;
}

.wechat-native-avatar {
  width: 160rpx;
  height: 160rpx;
  margin: 0 auto 32rpx;
  padding: 0;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.wechat-native-avatar::after {
  border: none;
}

.wechat-native-avatar-img {
  width: 160rpx;
  height: 160rpx;
}

.wechat-native-avatar-text {
  font-size: 26rpx;
  color: #374151;
}
</style>
