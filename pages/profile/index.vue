<template>
  <scroll-view class="page" scroll-y>
    <view class="header">
      <text class="avatar">{{ userInitial }}</text>
      <text class="user-name">{{ userName }}</text>
      <text v-if="isAuthenticated" class="user-meta">登录于 {{ loginDate }}</text>
      <text v-else class="user-meta">尚未登录</text>
    </view>
    <view class="card">
      <text class="section-title">探索进度</text>
      <view class="stat-row">
        <view class="stat-item">
          <text class="stat-num">{{ answeredCount }}</text>
          <text class="stat-label">已答题数</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ totalCount }}</text>
          <text class="stat-label">总题数</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ hasProfile ? '✓' : '—' }}</text>
          <text class="stat-label">兴趣报告</text>
        </view>
      </view>
    </view>
    <view class="card">
      <text class="section-title">功能入口</text>
      <view class="menu-item" @tap="goPlaceholder('成就')">
        <text class="menu-label">🏆 成就</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goPlaceholder('个人档案')">
        <text class="menu-label">📋 个人档案</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @tap="goPlaceholder('帮助')">
        <text class="menu-label">❓ 帮助</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
    <view style="padding: 16rpx 24rpx 48rpx;">
      <button v-if="isAuthenticated" class="btn-logout" @tap="logout">退出登录</button>
      <view v-else class="auth-actions">
        <button class="btn-login" @tap="goLogin">登录 / 注册</button>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { ALL_QUESTIONS } from '../../business/discover-questions'
import { loadDiscoverSession } from '../../business/discover-session'
import { api } from '../../utils/api'

export default {
  data() {
    return {
      userName: '同学',
      userInitial: 'U',
      loginDate: '',
      isAuthenticated: false,
      answeredCount: 0,
      hasProfile: false,
      totalCount: (ALL_QUESTIONS || []).length,
    }
  },
  onShow() {
    const user = uni.getStorageSync('uniprism.user')
    this.isAuthenticated = api.isLoggedIn()
    if (user && user.name && this.isAuthenticated) {
      this.userName = user.name
      this.userInitial = user.name.charAt(0).toUpperCase()
      if (user.loginAt) {
        this.loginDate = new Date(user.loginAt).toLocaleDateString('zh-CN')
      }
    } else if (!this.isAuthenticated) {
      this.userName = '未登录'
      this.userInitial = '?'
    }
    const session = loadDiscoverSession()
    this.answeredCount = session.answers.length
    this.hasProfile = Boolean(session.profile)
  },
  methods: {
    goLogin() {
      uni.reLaunch({ url: '/pages/auth/login' })
    },
    goPlaceholder(name) { uni.navigateTo({ url: '/pages/placeholder/index?name=' + encodeURIComponent(name) }) },
    logout() {
      uni.showModal({ title: '退出登录', content: '确认退出？', success: res => {
        if (res.confirm) {
          api.clearAuthSession()
          uni.reLaunch({ url: '/pages/auth/login' })
        }
      }})
    }
  }
}
</script>

<style scoped>
.page { background: #f8fafc; }
.header { background: linear-gradient(135deg, #007a66, #00a88d); padding: 60rpx 40rpx 48rpx; display: flex; flex-direction: column; align-items: center; }
.avatar { width: 120rpx; height: 120rpx; background: rgba(255,255,255,0.2); border-radius: 60rpx; font-size: 52rpx; color: #fff; line-height: 120rpx; text-align: center; display: block; }
.user-name { font-size: 36rpx; font-weight: 700; color: #fff; margin-top: 16rpx; display: block; }
.user-meta { font-size: 22rpx; color: rgba(255,255,255,0.7); margin-top: 8rpx; display: block; }
.card { background: #fff; border-radius: 24rpx; padding: 32rpx; margin: 24rpx 24rpx 0; }
.section-title { font-size: 30rpx; font-weight: 700; color: #1a2e2b; display: block; margin-bottom: 24rpx; }
.stat-row { display: flex; justify-content: space-around; }
.stat-item { display: flex; flex-direction: column; align-items: center; gap: 8rpx; }
.stat-num { font-size: 44rpx; font-weight: 700; color: #007a66; display: block; }
.stat-label { font-size: 22rpx; color: #6b7280; display: block; }
.menu-item { display: flex; justify-content: space-between; align-items: center; padding: 28rpx 0; border-bottom: 2rpx solid #f0f0f0; }
.menu-item:last-child { border-bottom: none; }
.menu-label { font-size: 28rpx; color: #1a2e2b; }
.menu-arrow { font-size: 36rpx; color: #6b7280; }
.btn-logout { width: 100%; background: transparent; color: #ef4444; border: 2rpx solid #ef4444; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; }
.auth-actions { display: flex; flex-direction: column; align-items: center; gap: 16rpx; }
.btn-login { width: 100%; background: #007a66; color: #fff; border: none; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; font-weight: 600; }
</style>
