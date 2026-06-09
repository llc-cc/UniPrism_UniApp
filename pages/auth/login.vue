<template>
  <view class="login-page">
    <view class="bg-glow" />

    <view class="brand-row">
      <image class="brand-logo" src="/static/prism-logo.svg" mode="aspectFit" />
      <text class="brand-name">万有棱镜</text>
    </view>

    <view class="form-card">
      <view class="head-block">
        <text class="form-title">欢迎登录</text>
        <text class="form-sub">告别专业迷茫，从容规划职业</text>
      </view>

      <view class="method-row">
        <text
          v-for="item in methods"
          :key="item.id"
          class="method-tab"
          :class="{ active: method === item.id }"
          @tap="switchMethod(item.id)"
        >
          {{ item.label }}
        </text>
      </view>

      <!-- 邀请码 -->
      <view v-if="method !== 'phone'">
        <view v-if="inviteMode === 'register' && inviteStep === 'invite'" class="field input-row">
          <text class="input-icon">🎫</text>
          <input
            class="input flex-input"
            v-model="inviteCode"
            placeholder="请输入邀请码"
            maxlength="96"
          />
        </view>

        <template v-else>
          <view v-if="inviteMode === 'register' && inviteStep === 'details'" class="invite-chip">
            <text class="invite-chip-text">{{ inviteCode }}</text>
            <text class="invite-change" @tap="resetInviteRegister">更换</text>
          </view>

          <view v-if="inviteMode === 'reset'" class="field input-row">
            <text class="input-icon">🎫</text>
            <input
              class="input flex-input"
              v-model="inviteCode"
              placeholder="输入初始邀请码"
              maxlength="96"
            />
          </view>

          <text v-if="inviteHint" class="hint-purple">{{ inviteHint }}</text>

          <view class="field input-row">
            <text class="input-icon">👤</text>
            <input
              class="input flex-input"
              v-model="loginId"
              :placeholder="inviteMode === 'register' ? '设置用户 ID' : '输入用户 ID'"
              maxlength="32"
            />
          </view>
          <text v-if="showLoginIdRule" class="rule-text">{{ loginIdRuleText }}</text>

          <view class="field input-row">
            <text class="input-icon">🔒</text>
            <input
              class="input flex-input"
              v-model="password"
              type="password"
              :placeholder="passwordPlaceholder"
              maxlength="32"
            />
          </view>
          <text v-if="showPasswordRule" class="rule-text">{{ passwordRuleText }}</text>

          <view v-if="inviteMode === 'reset'" class="field input-row">
            <text class="input-icon">🔒</text>
            <input
              class="input flex-input"
              v-model="confirmPassword"
              type="password"
              placeholder="确认新密码"
              maxlength="32"
            />
          </view>
        </template>
      </view>

      <!-- 手机号 -->
      <view v-else>
        <view class="sms-banner">
          <text class="sms-banner-text">短信 Key 配置前可使用接口返回的 devCode 联调；接入阿里云后将自动发送真实验证码。</text>
        </view>
        <view class="field input-row">
          <text class="input-icon">📱</text>
          <input class="input flex-input" v-model="phone" type="number" maxlength="11" placeholder="请输入手机号" />
        </view>
        <view class="field code-row">
          <view class="code-input-wrap input-row">
            <text class="input-icon">🔢</text>
            <input class="input flex-input" v-model="smsCode" type="number" maxlength="6" placeholder="6 位验证码" />
          </view>
          <button class="btn-code" :disabled="smsSending || smsCooldown > 0" @tap="handleSendCode">
            {{ smsCooldown > 0 ? smsCooldown + 's' : (smsSending ? '发送中...' : '获取验证码') }}
          </button>
        </view>
        <text v-if="devCodeHint" class="dev-hint">开发验证码：{{ devCodeHint }}</text>
      </view>

      <text v-if="error" class="error">{{ error }}</text>

      <button class="btn-primary" :disabled="loading" @tap="handleSubmit">
        {{ loading ? '处理中...' : primaryButtonText }}
      </button>

      <!-- #ifdef MP-WEIXIN -->
      <view v-if="wechatLoginEnabled" class="wechat-divider">
        <view class="wechat-divider-line" />
        <text class="wechat-divider-text">或</text>
        <view class="wechat-divider-line" />
      </view>
      <button
        v-if="wechatLoginEnabled"
        class="btn-wechat"
        open-type="getPhoneNumber|agreePrivacyAuthorization"
        :disabled="loading || wechatLoading"
        @getphonenumber="handleWechatLogin"
      >
        {{ wechatLoading ? '登录中...' : '微信一键登录' }}
      </button>
      <!-- #endif -->

      <view v-if="method !== 'phone'" class="link-row">
        <template v-if="inviteMode === 'register'">
          <text class="link-muted">已有账号？</text>
          <text class="link" @tap="switchInviteMode('login')">请登录</text>
        </template>
        <template v-else-if="inviteMode === 'login'">
          <text class="link-muted">还没有账号？</text>
          <text class="link" @tap="switchInviteMode('register')">输入邀请码注册</text>
          <text class="link-divider">|</text>
          <text class="link" @tap="switchInviteMode('reset')">忘记密码？</text>
        </template>
        <template v-else>
          <text class="link-muted">想起密码了？</text>
          <text class="link" @tap="switchInviteMode('login')">请登录</text>
          <text class="link-divider">|</text>
          <text class="link" @tap="switchInviteMode('register')">输入邀请码注册</text>
        </template>
      </view>

      <text v-if="devApiHint" class="dev-hint">{{ devApiHint }}</text>

      <text class="legal-text">*登录即代表您已阅读并同意《用户服务条款》及《隐私政策》</text>
    </view>
  </view>
</template>

<script>
import { api } from '../../utils/api'
import { completeAuthLogin } from '../../business/explore-session-merge'
import { hasAppAccess, goAppHome } from '../../business/auth-guard'
import {
  INVITE_LOGIN_ID_RULE_TEXT,
  INVITE_PIN_RULE_TEXT,
  getInviteLoginIdIssue,
  getInvitePinIssue,
} from '../../business/auth-credential-rules'
import { WECHAT_LOGIN_ENABLED } from '../../business/wechat-login-config'

export default {
  data() {
    return {
      methods: [
        { id: 'invite', label: '邀请码' },
        { id: 'phone', label: '手机' },
      ],
      method: 'invite',
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
      smsSending: false,
      smsCooldown: 0,
      devCodeHint: '',
      devApiHint: '',
      cooldownTimer: null,
      wechatLoading: false,
      wechatLoginEnabled: WECHAT_LOGIN_ENABLED,
      loginIdRuleText: INVITE_LOGIN_ID_RULE_TEXT,
      passwordRuleText: INVITE_PIN_RULE_TEXT,
    }
  },
  computed: {
    primaryButtonText() {
      if (this.method === 'phone') return '登录'
      if (this.inviteMode === 'register' && this.inviteStep === 'invite') return '继续注册'
      if (this.inviteMode === 'register') return '注册并登录'
      if (this.inviteMode === 'reset') return '重置并登录'
      return '登录'
    },
    inviteHint() {
      if (this.method === 'phone') return ''
      if (this.inviteMode === 'register' && this.inviteStep === 'details') {
        return '首次使用，请设置全站唯一用户 ID 和密码'
      }
      if (this.inviteMode === 'reset') return '输入初始邀请码、用户 ID 和新密码'
      if (this.inviteMode === 'login') return '输入用户 ID 和密码登录'
      return ''
    },
    showLoginIdRule() {
      return this.method !== 'phone' && !(this.inviteMode === 'register' && this.inviteStep === 'invite')
    },
    showPasswordRule() {
      return this.method !== 'phone' && (this.inviteMode === 'register' || this.inviteMode === 'reset')
    },
    passwordPlaceholder() {
      if (this.inviteMode === 'register') return '设置密码'
      if (this.inviteMode === 'reset') return '设置新密码'
      return '输入密码'
    },
  },
  onLoad() {
    if (api.isDevBuild()) {
      this.devApiHint = `开发 API：${api.getBaseUrl()}`
    }
    if (hasAppAccess()) {
      goAppHome()
    }
  },
  onUnload() {
    if (this.cooldownTimer) clearInterval(this.cooldownTimer)
  },
  methods: {
    switchMethod(next) {
      this.method = next
      this.error = ''
      this.password = ''
      this.confirmPassword = ''
    },
    switchInviteMode(next) {
      this.inviteMode = next
      this.inviteStep = 'invite'
      this.loginId = ''
      this.password = ''
      this.confirmPassword = ''
      this.error = ''
    },
    resetInviteRegister() {
      this.inviteMode = 'register'
      this.inviteStep = 'invite'
      this.loginId = ''
      this.password = ''
      this.confirmPassword = ''
      this.error = ''
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
    async finishAuth(res, fallbackName) {
      await completeAuthLogin(res, fallbackName)
      goAppHome()
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
    async handleWechatLogin(e) {
      if (!this.wechatLoginEnabled) return

      const detail = (e && e.detail) || {}
      if (detail.errMsg !== 'getPhoneNumber:ok') {
        if (detail.errMsg && detail.errMsg.includes('deny')) {
          this.error = '需要授权手机号才能完成微信登录'
        } else if (detail.errMsg) {
          this.error = '微信授权失败，请重试'
        }
        return
      }

      const phoneCode = detail.code
      if (!phoneCode) {
        this.error = '未获取到手机号授权，请升级微信后重试'
        return
      }

      this.error = ''
      this.wechatLoading = true
      try {
        const loginRes = await this.wxLogin()
        if (!loginRes || !loginRes.code) {
          throw new Error('微信登录失败，请重试')
        }
        const res = await api.loginWithWechat(loginRes.code, phoneCode)
        const user = (res && res.data && res.data.user) || {}
        await this.finishAuth(res, user.phone || user.name)
      } catch (err) {
        this.error = (err && err.message) || '微信登录失败'
      } finally {
        this.wechatLoading = false
      }
    },
    async handleSendCode() {
      if (!this.phone.trim()) {
        this.error = '请输入手机号'
        return
      }
      this.error = ''
      this.devCodeHint = ''
      this.smsSending = true
      try {
        const res = await api.sendSmsCode(this.phone.trim())
        if (res.data && res.data.devCode) {
          this.devCodeHint = res.data.devCode
        }
        this.startCooldown(60)
      } catch (e) {
        this.error = e.message || '验证码发送失败'
      } finally {
        this.smsSending = false
      }
    },
    async handleSubmit() {
      this.error = ''
      this.loading = true
      try {
        if (this.method === 'phone') {
          if (!this.phone.trim() || !this.smsCode.trim()) {
            this.error = '请填写手机号和验证码'
            return
          }
          const res = await api.loginWithPhone(this.phone.trim(), this.smsCode.trim())
          await this.finishAuth(res, res.data.user.name || res.data.user.phone)
          return
        }

        if (this.inviteMode === 'register' && this.inviteStep === 'invite') {
          if (!this.inviteCode.trim()) {
            this.error = '请输入邀请码'
            return
          }
          await api.checkInviteStatus(this.inviteCode.trim())
          this.loginId = ''
          this.password = ''
          this.inviteStep = 'details'
          return
        }

        if (this.inviteMode === 'register') {
          const issue = this.validateInviteCredentials(false)
          if (issue) {
            this.error = issue
            return
          }
          const res = await api.registerWithInvite(
            this.inviteCode.trim(),
            this.loginId.trim(),
            this.password,
          )
          await this.finishAuth(res, res.data.user.name || res.data.user.email)
          return
        }

        if (this.inviteMode === 'reset') {
          if (!this.inviteCode.trim()) {
            this.error = '请输入初始邀请码'
            return
          }
          const issue = this.validateInviteCredentials(true)
          if (issue) {
            this.error = issue
            return
          }
          const res = await api.resetInvitePassword(
            this.inviteCode.trim(),
            this.loginId.trim(),
            this.password,
          )
          await this.finishAuth(res, res.data.user.name || res.data.user.email)
          return
        }

        const issue = this.validateInviteCredentials(false)
        if (issue) {
          this.error = issue
          return
        }
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
  padding: 48rpx 32rpx 64rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, #b69cff 0%, #8b6bff 42%, #6b23ff 100%);
  position: relative;
  overflow: hidden;
}
.bg-glow {
  position: absolute;
  left: 50%;
  top: -200rpx;
  width: 900rpx;
  height: 900rpx;
  margin-left: -450rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%);
  pointer-events: none;
}
.brand-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin: 24rpx 0 40rpx;
}
.brand-logo { width: 72rpx; height: 72rpx; }
.brand-name { font-size: 40rpx; font-weight: 700; color: #fff; letter-spacing: 2rpx; }
.form-card {
  position: relative;
  z-index: 1;
  background: #fff;
  border-radius: 50rpx;
  padding: 48rpx 40rpx 36rpx;
  box-shadow: 0 24rpx 80rpx rgba(62, 10, 169, 0.18);
}
.head-block { text-align: center; margin-bottom: 36rpx; }
.form-title { display: block; font-size: 56rpx; font-weight: 700; color: #252525; line-height: 1.4; }
.form-sub { display: block; margin-top: 8rpx; font-size: 28rpx; color: #666; }
.method-row {
  display: flex;
  gap: 12rpx;
  margin-bottom: 32rpx;
  background: #f8f7ff;
  border-radius: 999rpx;
  padding: 8rpx;
}
.method-tab {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  color: #666;
  padding: 16rpx 0;
  border-radius: 999rpx;
}
.method-tab.active {
  background: #6b23ff;
  color: #fff;
  font-weight: 600;
}
.field { margin-bottom: 24rpx; }
.input-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 100rpx;
  border: 2rpx solid rgba(153,153,153,0.3);
  border-radius: 20rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
  background: #fff;
}
.input-icon { font-size: 30rpx; width: 40rpx; text-align: center; flex-shrink: 0; }
.flex-input { flex: 1; min-width: 0; height: 88rpx; font-size: 28rpx; background: transparent; border: none; }
.invite-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100rpx;
  margin-bottom: 24rpx;
  padding: 0 20rpx;
  border-radius: 20rpx;
  background: #f8f7ff;
  border: 2rpx solid rgba(143,120,255,0.35);
}
.invite-chip-text { flex: 1; font-size: 28rpx; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.invite-change { font-size: 24rpx; color: #6b23ff; font-weight: 600; margin-left: 16rpx; }
.hint-purple { display: block; text-align: center; font-size: 26rpx; color: #6b23ff; font-weight: 600; margin: -8rpx 0 20rpx; line-height: 1.6; }
.rule-text { display: block; margin: -12rpx 0 20rpx 4rpx; font-size: 22rpx; color: #666; line-height: 1.55; }
.sms-banner {
  margin-bottom: 24rpx;
  padding: 20rpx 24rpx;
  border-radius: 16rpx;
  background: #fff7ed;
  border: 1rpx solid #fed7aa;
}
.sms-banner-text { font-size: 22rpx; color: #9a3412; line-height: 1.6; }
.code-row { display: flex; align-items: stretch; gap: 16rpx; }
.code-input-wrap { flex: 1; margin-bottom: 0; }
.btn-code {
  flex-shrink: 0;
  align-self: center;
  height: 100rpx;
  line-height: 100rpx;
  padding: 0 24rpx;
  font-size: 24rpx;
  color: #6b23ff;
  background: #f8f7ff;
  border: 2rpx solid rgba(107,35,255,0.25);
  border-radius: 20rpx;
}
.btn-code[disabled] { color: #9ca3af; background: #f3f4f6; border-color: #e5e7eb; }
.dev-hint { display: block; font-size: 22rpx; color: #6b23ff; margin: -8rpx 0 16rpx; }
.error { display: block; font-size: 24rpx; color: #d14343; margin-bottom: 16rpx; line-height: 1.6; }
.btn-primary {
  width: 100%;
  background: #6b23ff;
  color: #fff;
  border-radius: 26rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 34rpx;
  font-weight: 700;
  border: none;
  box-shadow: 0 12rpx 0 #3e0aa9;
}
.btn-primary[disabled] { opacity: 0.7; box-shadow: none; }
.wechat-divider {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin: 28rpx 0 24rpx;
}
.wechat-divider-line {
  flex: 1;
  height: 2rpx;
  background: rgba(153, 153, 153, 0.25);
}
.wechat-divider-text {
  font-size: 24rpx;
  color: #999;
}
.btn-wechat {
  width: 100%;
  background: #07c160;
  color: #fff;
  border-radius: 26rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 34rpx;
  font-weight: 700;
  border: none;
  box-shadow: 0 12rpx 0 #059c4b;
}
.btn-wechat[disabled] { opacity: 0.7; box-shadow: none; }
.link-row { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8rpx; margin-top: 28rpx; }
.link-muted { font-size: 26rpx; color: #666; }
.link { font-size: 26rpx; color: #6b23ff; font-weight: 600; }
.link-divider { font-size: 26rpx; color: #ccc; margin: 0 4rpx; }
.legal-text {
  display: block;
  margin-top: 28rpx;
  text-align: center;
  font-size: 20rpx;
  color: #999;
  line-height: 1.6;
}
</style>
