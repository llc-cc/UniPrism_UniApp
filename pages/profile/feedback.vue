<template>
  <view class="page">
    <view class="section">
      <text class="section-label">反馈内容</text>
      <textarea class="textarea" v-model="content" placeholder="请输入内容" maxlength="500" />
    </view>
    <view class="footer">
      <button class="btn-submit" @tap="submit">提交</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return { content: '' }
  },
  methods: {
    submit() {
      if (!this.content.trim()) {
        uni.showToast({ title: '请输入反馈内容', icon: 'none' })
        return
      }
      uni.showToast({ title: '提交成功', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 1500)
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 32rpx 24rpx;
  box-sizing: border-box;
}
.section { flex: 1; }
.section-label {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #1c1c3a;
  margin-bottom: 20rpx;
}
.textarea {
  width: 100%;
  height: 280rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #1c1c3a;
  box-sizing: border-box;
}
.footer {
  padding: 32rpx 0 calc(32rpx + env(safe-area-inset-bottom));
}
.btn-submit {
  width: 100%;
  height: 96rpx;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 96rpx;
}
</style>
