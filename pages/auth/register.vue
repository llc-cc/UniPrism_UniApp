<template>
  <view class="reg-page">
    <view class="form-card">
      <text class="form-title">注册</text>

      <view class="field">
        <text class="field-label">昵称（可选）</text>
        <input class="input" v-model="name" placeholder="请输入昵称" />
      </view>

      <view class="field">
        <text class="field-label">邮箱</text>
        <input class="input" v-model="email" type="text" placeholder="请输入邮箱" />
      </view>

      <view class="field">
        <text class="field-label">密码</text>
        <input class="input" v-model="password" type="password" placeholder="至少 6 位" />
      </view>

      <view class="field">
        <text class="field-label">确认密码</text>
        <input class="input" v-model="confirm" type="password" placeholder="请再次输入密码" />
      </view>

      <text v-if="error" class="error">{{ error }}</text>

      <button class="btn-primary" :disabled="loading" @tap="handleRegister">
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <view class="link-row">
        <text class="link" @tap="goBack">已有账号？返回登录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { api } from '../../utils/api'
import { completeAuthLogin } from '../../business/explore-session-merge'
import { routeAfterLogin } from '../../business/auth-guard'

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirm: '',
      error: '',
      loading: false,
    }
  },
  methods: {
    async handleRegister() {
      if (!this.email.trim()) {
        this.error = '请输入邮箱'
        return
      }
      if (this.password.length < 6) {
        this.error = '密码至少 6 位'
        return
      }
      if (this.password !== this.confirm) {
        this.error = '两次输入的密码不一致'
        return
      }

      this.loading = true
      this.error = ''

      try {
        const res = await api.register(this.name.trim() || null, this.email.trim(), this.password)
        await completeAuthLogin(res, res.data.user.name || res.data.user.email)
        routeAfterLogin(res, { loginMethod: 'email-register' })
      } catch (e) {
        this.error = e.message || '注册失败'
      } finally {
        this.loading = false
      }
    },
    goBack() {
      uni.navigateBack()
    },
  },
}
</script>

<style scoped>
.reg-page {
  min-height: 100vh;
  padding: 80rpx 32rpx;
  background: #f8fafc;
}

.form-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
}

.form-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1a2e2b;
  display: block;
  margin-bottom: 40rpx;
}

.field {
  margin-bottom: 32rpx;
}

.field-label {
  font-size: 26rpx;
  color: #6b7280;
  display: block;
  margin-bottom: 12rpx;
}

.input {
  width: 100%;
  height: 88rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  background: #f8fafc;
}

.error {
  font-size: 24rpx;
  color: #ef4444;
  display: block;
  margin-bottom: 20rpx;
}

.btn-primary {
  width: 100%;
  background: #007a66;
  color: #fff;
  border-radius: 48rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 30rpx;
  font-weight: 600;
  border: none;
}

.link-row {
  text-align: center;
  margin-top: 32rpx;
}

.link {
  font-size: 26rpx;
  color: #007a66;
}
</style>
