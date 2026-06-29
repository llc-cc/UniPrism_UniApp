<template>
  <view class="page">
    <view class="header">
      <text class="title">更多</text>
      <text class="subtitle">当前提供帮助说明、反馈入口和后续功能占位</text>
    </view>

    <view class="quick-grid">
      <view class="quick-card" @tap="goPlan">
        <text class="quick-title">重新开始探索</text>
        <text class="quick-desc">返回兴趣探索主页，继续测评与查看报告。</text>
      </view>
      <view class="quick-card" @tap="goFeedback">
        <text class="quick-title">意见反馈</text>
        <text class="quick-desc">把你遇到的问题和想优化的点告诉我们。</text>
      </view>
    </view>

    <view class="card">
      <text class="section-title">常见问题</text>
      <view v-for="(item, idx) in faqs" :key="idx" class="faq" @tap="toggle(idx)">
        <view class="faq-head">
          <text class="faq-q">{{ item.q }}</text>
          <text class="faq-arrow">{{ openIndex === idx ? '−' : '+' }}</text>
        </view>
        <text v-if="openIndex === idx" class="faq-a">{{ item.a }}</text>
      </view>
    </view>

    <view class="contact">
      <text class="contact-title">后续会继续补充</text>
      <text class="contact-desc">这里后面会逐步补充版本说明、使用指南、隐私与帮助文档等内容。当前先作为“更多”页面占位使用。</text>
      <button class="btn-primary" @tap="goFeedback">去反馈</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(0)

const faqs = ref([
  { q: '生涯规划怎么开始？', a: '点击底部「生涯规划」后，按顺序完成性格测试、职业测评、深度测评，最后即可生成报告。' },
  { q: '报告里会显示什么？', a: '报告会汇总你的测评结果，展示画像分析、推荐专业和发展建议。' },
  { q: '可以重新测试吗？', a: '可以。在报告页面点击「重新测试」即可清空当前结果并重新开始四步测评流程。' },
  { q: '成就有什么用？', a: '成就用于记录你完成的探索环节，例如已体验的专业数量，后续会逐步开放更多徽章。' },
])

function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx
}

function goPlan() {
  uni.reLaunch({ url: '/pages/discover/index' })
}

function goFeedback() {
  uni.navigateTo({ url: '/pages/profile/feedback' })
}
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding: 48rpx 32rpx; box-sizing: border-box; }
.header { margin-bottom: 32rpx; }
.title { display: block; font-size: 44rpx; font-weight: 700; color: #1a2e2b; }
.subtitle { display: block; margin-top: 12rpx; font-size: 26rpx; color: #6b7280; }
.quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20rpx; margin-bottom: 32rpx; }
.quick-card { background: #fff; border-radius: 24rpx; padding: 28rpx; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.05); }
.quick-title { display: block; font-size: 28rpx; font-weight: 700; color: #1a2e2b; }
.quick-desc { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.65; color: #6b7280; }
.card { background: #fff; border-radius: 28rpx; padding: 12rpx 28rpx; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.05); }
.section-title { display: block; padding: 24rpx 0 8rpx; font-size: 30rpx; font-weight: 700; color: #1a2e2b; }
.faq { padding: 28rpx 0; border-bottom: 1rpx solid #eef2f7; }
.faq:last-child { border-bottom: none; }
.faq-head { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
.faq-q { flex: 1; font-size: 28rpx; font-weight: 600; color: #1a2e2b; }
.faq-arrow { font-size: 36rpx; color: #007a66; }
.faq-a { display: block; margin-top: 16rpx; font-size: 26rpx; line-height: 1.7; color: #6b7280; }
.contact { margin-top: 32rpx; background: #fff; border-radius: 28rpx; padding: 40rpx; text-align: center; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.05); }
.contact-title { display: block; font-size: 30rpx; font-weight: 700; color: #1a2e2b; }
.contact-desc { display: block; margin: 16rpx 0 32rpx; font-size: 26rpx; line-height: 1.7; color: #6b7280; }
.btn-primary { background: #007a66; color: #fff; border: none; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; font-weight: 600; padding: 0 64rpx; }
</style>
