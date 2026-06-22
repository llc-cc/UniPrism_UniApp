<template>
  <scroll-view class="login-page" scroll-y>
    <view class="login-page-bg">
      <view class="bg-glow bg-glow-top" />
      <view class="bg-glow bg-glow-bottom" />
      <view class="bg-orbit orbit-one" />
      <view class="bg-orbit orbit-two" />
      <view class="bg-orbit orbit-three" />
    </view>

    <view class="login-shell" :style="shellStyle">
      <!-- 落地页 -->
      <view v-if="screen === 'landing'" class="landing-view">
        <view class="brand-hero">
          <image class="brand-logo" src="/static/prism-logo.svg" mode="aspectFit" />
          <text class="brand-title">万有棱镜</text>
          <text class="brand-subtitle">告别专业迷茫，从容规划职业</text>
        </view>

        <view class="entry-button-row">
          <button class="entry-pill" @tap="openPhone">
            <image class="entry-icon" src="/static/assets/auth/login-icon-phone.svg" mode="aspectFit" />
            <text class="entry-label">手机号登录</text>
          </button>

          <!-- #ifdef MP-WEIXIN -->
          <button
            v-if="wechatLoginEnabled"
            class="entry-pill"
            :disabled="wechatLoading"
            @tap="openWechat"
          >
            <image class="entry-icon" src="/static/assets/auth/login-icon-wechat.svg" mode="aspectFit" />
            <text class="entry-label">{{ wechatLoading ? '登录中...' : '微信登录' }}</text>
          </button>
          <!-- #endif -->

          <button class="entry-pill" @tap="openInviteCode">
            <image class="entry-icon" src="/static/assets/auth/login-icon-ticket.svg" mode="aspectFit" />
            <text class="entry-label">内测资格码</text>
          </button>
        </view>

        <view class="landing-links">
          <text class="landing-link" @tap="openInviteLoginFromLanding">已有账号？立即登录</text>
        </view>

        <text v-if="displayError" class="error error--landing">{{ displayError }}</text>
      </view>

      <!-- 子页面：手机号 / 邀请码 / 邀请表单 -->
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

        <!-- 微信登录（原生头像 / 昵称 / 手机号授权） -->
        <!-- #ifdef MP-WEIXIN -->
        <view v-else-if="screen === 'wechat'" class="sub-content">
          <text class="sub-title">微信登录</text>
          <text class="sub-desc">选择头像、填写昵称，并授权手机号。报告中的称呼请在基本信息里单独填写。</text>

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
            {{ wechatLoading ? '登录中...' : '授权手机号并登录' }}
          </button>
        </view>
        <!-- #endif -->

        <!-- 邀请码（内测） -->
        <view v-else-if="screen === 'invite-code'" class="sub-content">
          <text class="sub-title">邀请码用于内测</text>
          <text class="sub-desc">如未获得邀请码请联系咨询顾问。</text>

          <view class="pill-field">
            <input
              class="pill-input"
              v-model="inviteCode"
              placeholder="请输入机构邀请码"
              placeholder-class="pill-placeholder"
              maxlength="96"
            />
          </view>
          <text v-if="inviteCodeIssue" class="field-issue">{{ inviteCodeIssue }}</text>

          <text v-if="displayError" class="error">{{ displayError }}</text>

          <button
            class="pill-submit"
            :class="{ 'pill-submit--active': inviteCode.trim() }"
            :disabled="loading || !inviteCode.trim()"
            @tap="handleInviteCodeSubmit"
          >
            {{ loading ? '处理中...' : '登录' }}
          </button>
        </view>

        <!-- 邀请码账号表单 -->
        <view v-else-if="screen === 'invite-form'" class="sub-content">
          <text class="sub-title">{{ inviteFormTitle }}</text>
          <text class="sub-desc">{{ inviteFormDesc }}</text>

          <view v-if="inviteMode === 'register' && inviteStep === 'details'" class="invite-chip">
            <view class="invite-chip-copy">
              <text class="invite-chip-label">当前邀请码</text>
              <text class="invite-chip-text">{{ inviteCode }}</text>
            </view>
            <text class="invite-change" @tap="resetInviteRegister">更换</text>
          </view>

          <view v-if="inviteMode === 'reset'" class="pill-field">
            <input
              class="pill-input"
              v-model="inviteCode"
              placeholder="输入初始邀请码"
              placeholder-class="pill-placeholder"
              maxlength="96"
            />
          </view>
          <text v-if="inviteCodeIssue" class="field-issue">{{ inviteCodeIssue }}</text>

          <view class="pill-field">
            <input
              class="pill-input"
              v-model="loginId"
              :placeholder="inviteMode === 'register' ? '设置用户 ID' : '输入用户 ID'"
              placeholder-class="pill-placeholder"
              maxlength="32"
            />
          </view>
          <text v-if="loginIdIssue" class="field-issue">{{ loginIdIssue }}</text>

          <view class="pill-field">
            <input
              class="pill-input"
              v-model="password"
              type="password"
              :placeholder="passwordPlaceholder"
              placeholder-class="pill-placeholder"
              maxlength="32"
            />
          </view>
          <text v-if="passwordIssue" class="field-issue">{{ passwordIssue }}</text>

          <view v-if="inviteMode === 'reset'" class="pill-field">
            <input
              class="pill-input"
              v-model="confirmPassword"
              type="password"
              placeholder="确认新密码"
              placeholder-class="pill-placeholder"
              maxlength="32"
            />
          </view>
          <text v-if="confirmPasswordIssue" class="field-issue">{{ confirmPasswordIssue }}</text>

          <text v-if="displayError" class="error">{{ displayError }}</text>

          <button
            class="pill-submit pill-submit--active"
            :disabled="loading"
            @tap="handleSubmit"
          >
            {{ loading ? '处理中...' : primaryButtonText }}
          </button>

          <view class="sub-links">
            <template v-if="inviteMode === 'register'">
              <text class="sub-link" @tap="openInviteLogin">已有账号？立即登录</text>
            </template>
            <template v-else-if="inviteMode === 'login'">
              <text class="sub-link" @tap="openInviteReset">忘记密码</text>
            </template>
            <template v-else>
              <text class="sub-link" @tap="openInviteLogin">立即登录</text>
            </template>
          </view>
        </view>
      </view>

      <view class="legal-row" @tap="toggleAgreement">
        <view class="legal-check" :class="{ 'legal-check--on': agreedToTerms }">
          <text v-if="agreedToTerms" class="legal-check-mark">✓</text>
        </view>
        <text class="legal-text">我已阅读并同意《用户服务条款》及《隐私政策》</text>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { api } from '../../utils/api'
import { completeAuthLogin } from '../../business/explore-session-merge'
import { hasAppAccess, goAppHome, routeAfterLogin, POST_LOGIN_FLOW_FLAG } from '../../business/auth-guard'
import {
  getInviteLoginIdIssue,
  getInvitePinIssue,
  getPhoneIssue,
  getSmsCodeIssue,
  normalizePhone,
} from '../../business/auth-credential-rules'
import { WECHAT_LOGIN_ENABLED } from '../../business/wechat-login-config'

const POST_LOGIN_LAUNCH_URL = '/pages/auth/launch'
const POST_LOGIN_BASIC_INFO_URL = '/pages/discover/chat?start=1'

export default {
  data() {
    return {
      screen: 'landing',
      agreedToTerms: false,
      shellStyle: '',
      inviteMode: 'register',
      inviteStep: 'invite',
      inviteCode: '',
      loginId: '',
      password: '',
      confirmPassword: '',
      phone: '',
      smsCode: '',
      error: '',
      loading: false,
      showFieldValidation: false,
      showPhoneValidation: false,
      smsSending: false,
      smsCooldown: 0,
      cooldownTimer: null,
      wechatLoading: false,
      wechatLoginEnabled: WECHAT_LOGIN_ENABLED,
      wechatAvatarTemp: '',
      wechatNickname: '',
      wechatProfileIssue: '',
      inviteLoginFromLanding: false,
      redirectUrl: '',
    }
  },
  computed: {
    canSendSms() {
      return Boolean(normalizePhone(this.phone))
    },
    canSubmitPhone() {
      return Boolean(normalizePhone(this.phone) && !getSmsCodeIssue(this.smsCode))
    },
    primaryButtonText() {
      if (this.inviteMode === 'register') return '注册并登录'
      if (this.inviteMode === 'reset') return '重置并登录'
      return '立即登录'
    },
    inviteFormTitle() {
      if (this.inviteMode === 'register') return '创建你的账号'
      if (this.inviteMode === 'reset') return '重置登录密码'
      return '账号登录'
    },
    inviteFormDesc() {
      if (this.inviteMode === 'register') return '设置全站唯一用户 ID 与登录密码'
      if (this.inviteMode === 'reset') return '通过初始邀请码重设密码并继续登录'
      return '输入用户 ID 与密码继续使用'
    },
    passwordPlaceholder() {
      if (this.inviteMode === 'register') return '设置密码'
      if (this.inviteMode === 'reset') return '设置新密码'
      return '输入密码'
    },
    inviteCodeIssue() {
      if (!this.showFieldValidation) return ''
      if (this.screen === 'invite-code' || this.inviteMode === 'reset') {
        return this.inviteCode.trim() ? '' : '请填写邀请码'
      }
      return ''
    },
    loginIdIssue() {
      if (!this.showFieldValidation) return ''
      if (!this.loginId.trim()) return '请填写用户 ID'
      return getInviteLoginIdIssue(this.loginId) || ''
    },
    passwordIssue() {
      if (!this.showFieldValidation) return ''
      if (!this.password.trim()) return '请填写密码'
      return getInvitePinIssue(this.password) || ''
    },
    confirmPasswordIssue() {
      if (this.inviteMode !== 'reset' || !this.showFieldValidation) return ''
      if (!this.confirmPassword.trim()) return '请确认新密码'
      if (this.password === this.confirmPassword) return ''
      return '两次输入的密码不一致。'
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
        this.inviteCodeIssue,
        this.loginIdIssue,
        this.passwordIssue,
        this.confirmPasswordIssue,
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
      if (uni.getStorageSync(POST_LOGIN_FLOW_FLAG)) {
        uni.removeStorageSync(POST_LOGIN_FLOW_FLAG)
        uni.reLaunch({
          url: `${POST_LOGIN_LAUNCH_URL}?next=${encodeURIComponent(POST_LOGIN_BASIC_INFO_URL)}`,
        })
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
    ensureAgreement() {
      if (this.agreedToTerms) return true
      uni.showToast({ title: '请先阅读并同意用户条款', icon: 'none' })
      return false
    },
    openPhone() {
      if (!this.ensureAgreement()) return
      this.error = ''
      this.showFieldValidation = false
      this.showPhoneValidation = false
      this.screen = 'phone'
    },
    openInviteCode() {
      if (!this.ensureAgreement()) return
      this.error = ''
      this.showFieldValidation = false
      this.inviteMode = 'register'
      this.inviteStep = 'invite'
      this.screen = 'invite-code'
    },
    openInviteLogin(fromLanding = false) {
      this.error = ''
      this.showFieldValidation = false
      this.inviteMode = 'login'
      this.inviteStep = 'details'
      this.loginId = ''
      this.password = ''
      this.confirmPassword = ''
      this.inviteLoginFromLanding = fromLanding
      this.screen = 'invite-form'
    },
    openInviteLoginFromLanding() {
      if (!this.ensureAgreement()) return
      this.openInviteLogin(true)
    },
    openInviteReset() {
      this.error = ''
      this.showFieldValidation = false
      this.inviteMode = 'reset'
      this.inviteStep = 'details'
      this.loginId = ''
      this.password = ''
      this.confirmPassword = ''
      this.screen = 'invite-form'
    },
    goBack() {
      this.error = ''
      this.wechatProfileIssue = ''
      this.showFieldValidation = false
      if (this.screen === 'phone' || this.screen === 'invite-code' || this.screen === 'wechat') {
        this.screen = 'landing'
        return
      }
      if (this.screen === 'invite-form') {
        if (this.inviteLoginFromLanding && this.inviteMode === 'login') {
          this.inviteLoginFromLanding = false
          this.screen = 'landing'
          return
        }
        if (this.inviteMode === 'register' && this.inviteStep === 'details') {
          this.screen = 'invite-code'
          this.inviteStep = 'invite'
          return
        }
        this.screen = 'invite-code'
      }
    },
    resetInviteRegister() {
      this.inviteMode = 'register'
      this.inviteStep = 'invite'
      this.loginId = ''
      this.password = ''
      this.confirmPassword = ''
      this.error = ''
      this.showFieldValidation = false
      this.screen = 'invite-code'
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
    validateInviteCredentials(requireConfirm) {
      const loginIdIssue = getInviteLoginIdIssue(this.loginId)
      if (loginIdIssue) return loginIdIssue
      const pinIssue = getInvitePinIssue(this.password)
      if (pinIssue) return pinIssue
      if (requireConfirm && this.password !== this.confirmPassword) {
        return '两次输入的密码不一致。'
      }
      return ''
    },
    goAuthorizedFallback() {
      const redirectUrl = String(this.redirectUrl || '').trim()
      if (redirectUrl && !redirectUrl.includes('/pages/auth/login') && !redirectUrl.includes('/pages/auth/launch')) {
        uni.reLaunch({
          url: redirectUrl,
          fail: () => {
            goAppHome()
          },
        })
        return
      }
      goAppHome()
    },
    async finishAuth(res, fallbackName) {
      await completeAuthLogin(res, fallbackName)
      routeAfterLogin(res)
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
          this.wechatProfileIssue = '需要授权手机号才能完成微信登录'
        } else if (detail.errMsg) {
          this.wechatProfileIssue = '微信授权失败，请重试'
        }
        return
      }

      const phoneCode = detail.code
      if (!phoneCode) {
        this.wechatProfileIssue = '未获取到手机号授权，请升级微信后重试'
        return
      }

      this.error = ''
      this.wechatProfileIssue = ''
      this.wechatLoading = true
      try {
        const loginRes = await this.wxLogin()
        if (!loginRes || !loginRes.code) {
          throw new Error('微信登录失败，请重试')
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
        await this.finishAuth(res, user.wechatNickname || user.phone || user.name)
      } catch (err) {
        this.wechatProfileIssue = (err && err.message) || '微信登录失败'
      } finally {
        this.wechatLoading = false
      }
    },
    async handleSendCode() {
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
        await api.sendSmsCode(phone)
        this.startCooldown(60)
      } catch (e) {
        this.error = e.message || '验证码发送失败'
      } finally {
        this.smsSending = false
      }
    },
    async handleInviteCodeSubmit() {
      this.error = ''
      this.loading = true
      this.showFieldValidation = true
      try {
        if (this.inviteCodeIssue) return
        await api.checkInviteStatus(this.inviteCode.trim())
        this.loginId = ''
        this.password = ''
        this.inviteStep = 'details'
        this.showFieldValidation = false
        this.screen = 'invite-form'
      } catch (e) {
        this.error = e.message || '邀请码无效'
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
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
          await this.finishAuth(res, res.data.user.name || res.data.user.phone)
          return
        }

        if (this.inviteMode === 'register') {
          this.showFieldValidation = true
          const issue = this.validateInviteCredentials(false)
          if (issue) return
          const res = await api.registerWithInvite(
            this.inviteCode.trim(),
            this.loginId.trim(),
            this.password,
          )
          await this.finishAuth(res, res.data.user.name || res.data.user.email)
          return
        }

        if (this.inviteMode === 'reset') {
          this.showFieldValidation = true
          if (this.inviteCodeIssue) return
          const issue = this.validateInviteCredentials(true)
          if (issue) return
          const res = await api.resetInvitePassword(
            this.inviteCode.trim(),
            this.loginId.trim(),
            this.password,
          )
          await this.finishAuth(res, res.data.user.name || res.data.user.email)
          return
        }

        this.showFieldValidation = true
        const issue = this.validateInviteCredentials(false)
        if (issue) return
        const res = await api.loginWithLoginId(this.loginId.trim(), this.password)
        await this.finishAuth(res, res.data.user.name || res.data.user.email)
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
  background: linear-gradient(180deg, #e4a99d 0%, #b38cf4 38%, #7e63ff 100%);
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

.bg-orbit {
  position: absolute;
  border: 26rpx solid rgba(255, 255, 255, 0.08);
  border-radius: 280rpx;
  transform: rotate(12deg);
}

.orbit-one {
  left: -150rpx;
  top: 520rpx;
  width: 980rpx;
  height: 980rpx;
}

.orbit-two {
  left: 40rpx;
  top: 760rpx;
  width: 760rpx;
  height: 760rpx;
  opacity: 0.55;
}

.orbit-three {
  right: -360rpx;
  bottom: -120rpx;
  width: 820rpx;
  height: 820rpx;
  opacity: 0.4;
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
}

.brand-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80rpx 0 64rpx;
}

.brand-logo {
  width: 200rpx;
  height: 200rpx;
}

.brand-title {
  display: block;
  margin-top: 36rpx;
  font-size: 72rpx;
  line-height: 1.2;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 4rpx;
}

.brand-subtitle {
  display: block;
  margin-top: 20rpx;
  font-size: 28rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.92);
}

.entry-button-row {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.entry-pill {
  width: 100%;
  height: 104rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #1d1d1f;
  font-size: 32rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 16rpx 40rpx rgba(67, 39, 172, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 0 40rpx;
  box-sizing: border-box;
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
  padding-top: 32rpx;
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

.legal-text {
  flex: 1;
  max-width: 560rpx;
  font-size: 22rpx;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.92);
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
