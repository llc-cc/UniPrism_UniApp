<template>
  <view class="page">
    <view class="header">
      <view class="avatar-wrap">
        <image v-if="avatarUrl" class="avatar-img" :src="avatarUrl" mode="aspectFill" />
        <text v-else class="avatar-text">{{ userInitial }}</text>
      </view>
      <text class="user-id">{{ displayNickname }}</text>
    </view>

    <view class="card">
      <text class="card-title">探索进度</text>
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-num">{{ totalCount }}</text>
          <text class="stat-label">总题数</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num">{{ answeredCount }}</text>
          <text class="stat-label">已答题数</text>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <text class="stat-num">{{ reportCount }}</text>
          <text class="stat-label">探索报告</text>
        </view>
      </view>
    </view>

    <view class="card menu-card">
      <view class="menu-item" @tap="showDisabledTabTip('成就')">
        <view class="menu-left">
          <view class="menu-icon menu-icon--gold">
            <image class="menu-icon-img" src="/static/assets/discover/tabbar/icon-achievement.svg" mode="aspectFit" />
          </view>
          <text class="menu-label">成就</text>
        </view>
        <view class="menu-right">
          <view class="menu-lock">
            <image class="menu-lock-badge" src="/static/assets/discover/tabbar/icon-lock.svg" mode="aspectFit" />
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
      <view class="menu-divider" />
      <view class="menu-item" @tap="goFeedback">
        <view class="menu-left">
          <view class="menu-icon menu-icon--blue">
            <text class="menu-icon-text">i</text>
          </view>
          <text class="menu-label">意见反馈</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item" @tap="goPersonalInfo">
        <view class="menu-left">
          <view class="menu-icon menu-icon--red">
            <image class="menu-icon-img" src="/static/assets/discover/tabbar/icon-profile.svg" mode="aspectFit" />
          </view>
          <text class="menu-label">个人信息</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="home-tabbar">
      <view class="tab-item" @tap="switchTab('/pages/discover/index')">
        <view class="tab-icon">
          <image class="tab-icon-img" src="/static/assets/discover/tabbar/icon-interest.svg" mode="aspectFit" />
        </view>
        <text class="tab-text">兴趣探索</text>
      </view>
      <view class="tab-item" @tap="switchTab('/pages/discover/major')">
        <view class="tab-icon">
          <image class="tab-icon-img" src="/static/assets/discover/tabbar/icon-major.svg" mode="aspectFit" />
        </view>
        <text class="tab-text">专业体验</text>
      </view>
      <view class="tab-item" @tap="showDisabledTabTip('成就')">
        <view class="tab-icon tab-icon--locked">
          <image class="tab-icon-img" src="/static/assets/discover/tabbar/icon-achievement.svg" mode="aspectFit" />
          <image class="tab-lock-badge" src="/static/assets/discover/tabbar/icon-lock.svg" mode="aspectFit" />
        </view>
        <text class="tab-text">成就</text>
      </view>
      <view class="tab-item" @tap="showDisabledTabTip('更多')">
        <view class="tab-icon tab-icon--locked">
          <view class="tab-more-icon">
            <view class="tab-more-tile tab-more-tile--top-left" />
            <view class="tab-more-tile tab-more-tile--bottom-left" />
            <view class="tab-more-tile tab-more-tile--top-right" />
            <image class="tab-more-line tab-more-line--middle" src="/static/assets/discover/tabbar/system-line-long.svg" mode="scaleToFill" />
            <image class="tab-more-line tab-more-line--short" src="/static/assets/discover/tabbar/system-line-short.svg" mode="scaleToFill" />
            <image class="tab-more-line tab-more-line--bottom" src="/static/assets/discover/tabbar/system-line-long.svg" mode="scaleToFill" />
          </view>
          <image class="tab-lock-badge" src="/static/assets/discover/tabbar/icon-lock.svg" mode="aspectFit" />
        </view>
        <text class="tab-text">更多</text>
      </view>
      <view class="tab-item tab-item--active">
        <view class="tab-icon">
          <image class="tab-icon-img" src="/static/assets/discover/tabbar/icon-profile.svg" mode="aspectFit" />
        </view>
        <text class="tab-text">个人中心</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ALL_QUESTIONS } from '../../business/discover-questions'
import { loadDiscoverSession } from '../../business/discover-session'
import { navigateHomeTab, showDisabledMiniAppRouteTip } from '../../business/disabled-miniapp-routes'
import { api } from '../../utils/api'

export default {
  data() {
    return {
      userInitial: 'U',
      displayNickname: '同学',
      avatarUrl: '',
      answeredCount: 0,
      reportCount: 0,
      totalCount: (ALL_QUESTIONS || []).length,
    }
  },
  onShow() {
    this.refreshProfile()
    const session = loadDiscoverSession()
    this.answeredCount = (session.answers || []).length
    this.reportCount = session.profile ? 1 : 0
  },
  methods: {
    applyUserProfile(user) {
      if (!user) return
      const nickname = user.wechatNickname || user.name || user.phone || user.email || '同学'
      this.displayNickname = nickname
      this.userInitial = nickname.charAt(0).toUpperCase()
      this.avatarUrl = user.avatarUrl ? api.resolveUserAvatarUrl(user.avatarUrl) : ''
    },
    async refreshProfile() {
      const localUser = api.getUser()
      if (localUser) this.applyUserProfile(localUser)
      if (!api.getToken()) return
      try {
        const res = await api.getCurrentUser()
        const user = (res && res.data && res.data.user) || null
        if (user) {
          const token = api.getToken()
          api.setAuthSession(token, {
            ...localUser,
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            wechatNickname: user.wechatNickname || '',
            avatarUrl: user.avatarUrl || '',
            loginAt: (localUser && localUser.loginAt) || Date.now(),
          })
          this.applyUserProfile(user)
        }
      } catch {
        // 离线或 token 失效时沿用本地缓存
      }
    },
    switchTab(url) { navigateHomeTab(url) },
    showDisabledTabTip(label) { showDisabledMiniAppRouteTip(label) },
    goFeedback() { uni.navigateTo({ url: '/pages/profile/feedback' }) },
    goPersonalInfo() { uni.navigateTo({ url: '/pages/profile/personal-info' }) },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f2f0f8;
  padding-bottom: 140rpx;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 48rpx;
}
.avatar-wrap {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #c4b5fd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.avatar-text {
  font-size: 64rpx;
  font-weight: 700;
  color: #fff;
}
.avatar-img {
  width: 100%;
  height: 100%;
}
.user-id {
  margin-top: 20rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #374151;
}
.card {
  background: #fff;
  border-radius: 24rpx;
  margin: 0 24rpx 20rpx;
  padding: 32rpx 28rpx;
}
.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #1c1c3a;
  margin-bottom: 28rpx;
}
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.stat-num {
  font-size: 48rpx;
  font-weight: 800;
  color: #9762ff;
}
.stat-label {
  font-size: 22rpx;
  color: #9ca3af;
}
.stat-divider {
  width: 2rpx;
  height: 64rpx;
  background: #f0f0f0;
}
.menu-card {
  padding: 0 28rpx;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 108rpx;
}
.menu-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}
.menu-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-icon--gold { background: #fef3c7; }
.menu-icon--blue { background: #dbeafe; }
.menu-icon--red  { background: #fce7f3; }
.menu-icon-img {
  width: 32rpx;
  height: 32rpx;
}
.menu-icon-text {
  font-size: 26rpx;
  font-weight: 700;
  color: #3b82f6;
  font-style: italic;
}
.menu-label {
  font-size: 30rpx;
  color: #1c1c3a;
}
.menu-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.menu-lock {
  width: 18rpx;
  height: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-lock-badge {
  width: 18rpx;
  height: 18rpx;
  display: block;
  opacity: 1;
}
.menu-arrow {
  font-size: 36rpx;
  color: #d1d5db;
}
.menu-divider {
  height: 2rpx;
  background: #f5f5f5;
}
.home-tabbar {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: calc(18rpx + env(safe-area-inset-bottom));
  height: 104rpx;
  border: 2rpx solid #9762ff;
  border-radius: 26rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8rpx 24rpx rgba(107, 35, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 30;
}
.tab-item {
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: #9a79ff;
}
.tab-icon {
  width: 48rpx;
  height: 48rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-icon-img {
  width: 36rpx;
  height: 36rpx;
  display: block;
}
.tab-item--active .tab-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(151, 98, 255, 0.14);
}
.tab-item--active .tab-icon-img {
  width: 40rpx;
  height: 40rpx;
}
.tab-icon--locked {
  overflow: visible;
}
.tab-lock-badge {
  position: absolute;
  right: -4rpx;
  top: -4rpx;
  width: 18rpx;
  height: 18rpx;
  opacity: 0.86;
}
.tab-more-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
}
.tab-more-tile {
  position: absolute;
  width: 11rpx;
  height: 11rpx;
  border: 1.5rpx solid #c797ff;
  border-radius: 4rpx;
  box-sizing: border-box;
  background: linear-gradient(90deg, #e7c2ff 0%, #9762ff 100%);
}
.tab-more-tile--top-left {
  left: 4rpx;
  top: 4rpx;
}
.tab-more-tile--bottom-left {
  left: 4rpx;
  top: 19rpx;
}
.tab-more-tile--top-right {
  left: 19rpx;
  top: 4rpx;
}
.tab-more-line {
  position: absolute;
  display: block;
  height: 2rpx;
}
.tab-more-line--middle {
  left: 19rpx;
  top: 19rpx;
  width: 13rpx;
}
.tab-more-line--short {
  left: 24rpx;
  top: 23rpx;
  width: 8rpx;
}
.tab-more-line--bottom {
  left: 19rpx;
  top: 28rpx;
  width: 13rpx;
}
.tab-text {
  font-size: 18rpx;
  line-height: 1;
  color: #9a79ff;
  white-space: nowrap;
}
</style>
