<template>
  <view class="page">
    <view class="section-title">我的账号</view>
    <view class="card">
      <view class="row" @tap="editPhone">
        <text class="row-label">手机号</text>
        <view class="row-right">
          <text class="row-value">{{ maskedPhone }}</text>
          <text class="row-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="section-title">三方账号绑定</view>
    <view class="card">
      <view class="row">
        <view class="row-left">
          <view class="wechat-icon">
            <text class="wechat-text">微</text>
          </view>
          <text class="row-label">微信</text>
        </view>
        <view class="row-right">
          <text class="row-arrow">›</text>
        </view>
      </view>
    </view>

    <view class="footer">
      <button class="btn-logout" @tap="logout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { api } from '../../utils/api'
import { clearPostLoginFlowState } from '../../business/auth-guard'
import { clearPendingReportGeneration } from '../../business/report-auth-flow'

function maskPhone(phone) {
  const value = String(phone || '').trim()
  if (!value) return '未绑定'
  if (value.length >= 7) return value.slice(0, 3) + '****' + value.slice(-4)
  return value
}

export default {
  data() {
    return { maskedPhone: '' }
  },
  onShow() {
    if (!api.isLoggedIn()) {
      uni.navigateBack({
        fail: () => {
          uni.reLaunch({ url: '/pages/profile/index' })
        },
      })
      return
    }
    this.refreshPhone()
  },
  methods: {
    applyPhone(phone) {
      this.maskedPhone = maskPhone(phone)
    },
    async refreshPhone() {
      const localUser = api.getUser()
      this.applyPhone(localUser && localUser.phone)
      if (!api.getToken()) return
      try {
        const res = await api.getCurrentUser()
        const user = (res && res.data && res.data.user) || null
        if (!user) return
        const token = api.getToken()
        api.setAuthSession(token, {
          ...(localUser || {}),
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          wechatNickname: user.wechatNickname || '',
          avatarUrl: user.avatarUrl || '',
          loginAt: (localUser && localUser.loginAt) || Date.now(),
        })
        this.applyPhone(user.phone)
      } catch {
        // 离线时沿用本地缓存
      }
    },
    editPhone() {
      uni.showToast({ title: '功能开发中', icon: 'none' })
    },
    logout() {
      uni.showModal({
        title: '退出登录',
        content: '确认退出？',
        success: (res) => {
          if (res.confirm) {
            api.clearAuthSession()
            clearPostLoginFlowState()
            clearPendingReportGeneration()
            uni.reLaunch({ url: '/pages/discover/index' })
          }
        },
      })
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom));
}
.section-title {
  font-size: 26rpx;
  color: #9ca3af;
  padding: 32rpx 28rpx 12rpx;
}
.card {
  background: #fff;
  margin: 0 0 20rpx;
  padding: 0 28rpx;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 104rpx;
}
.row-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.row-label {
  font-size: 30rpx;
  color: #1c1c3a;
}
.row-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.row-value {
  font-size: 28rpx;
  color: #9ca3af;
}
.row-arrow {
  font-size: 36rpx;
  color: #d1d5db;
}
.wechat-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  background: #07c160;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wechat-text {
  color: #fff;
  font-size: 26rpx;
  font-weight: 700;
}
.footer {
  padding: 48rpx 28rpx 0;
}
.btn-logout {
  width: 100%;
  height: 96rpx;
  background: #f3f4f6;
  color: #9ca3af;
  border: none;
  border-radius: 16rpx;
  font-size: 30rpx;
  line-height: 96rpx;
}
</style>
