<template>
  <view class="page">
    <view class="header">
      <text class="title">帮助</text>
      <text class="subtitle">了解如何使用 UniPrism 的生涯探索功能</text>
    </view>

    <view class="card">
      <view v-for="(item, idx) in faqs" :key="idx" class="faq" @tap="toggle(idx)">
        <view class="faq-head">
          <text class="faq-q">{{ item.q }}</text>
          <text class="faq-arrow">{{ openIndex === idx ? '−' : '+' }}</text>
        </view>
        <text v-if="openIndex === idx" class="faq-a">{{ item.a }}</text>
      </view>
    </view>

    <view class="contact">
      <text class="contact-title">还有问题？</text>
      <text class="contact-desc">你可以在生涯规划中重新开始四步测评流程，或稍后联系我们获取帮助。</text>
      <button class="btn-primary" @tap="goPlan">去生涯规划</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { blockDisabledMiniAppPageEntry } from '../../business/disabled-miniapp-routes'

const openIndex = ref(0)

onLoad(() => {
  blockDisabledMiniAppPageEntry()
})

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
</script>

<style scoped>
.page { min-height: 100vh; background: #f8fafc; padding: 48rpx 32rpx; box-sizing: border-box; }
.header { margin-bottom: 32rpx; }
.title { display: block; font-size: 44rpx; font-weight: 700; color: #1a2e2b; }
.subtitle { display: block; margin-top: 12rpx; font-size: 26rpx; color: #6b7280; }
.card { background: #fff; border-radius: 28rpx; padding: 12rpx 28rpx; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.05); }
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
