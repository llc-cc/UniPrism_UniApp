<template>
  <view class="page">
    <view v-if="!course || !topic" class="article-head">
      <text class="eyebrow">加载中...</text>
    </view>
    <view v-else>
    <view class="article-head">
      <text class="eyebrow">{{ course.title }} · {{ pageIndex + 1 }}/{{ course.pages.length }}</text>
      <text class="title">{{ topic.title }}</text>
      <text class="role">{{ topic.role }}</text>
    </view>
    <scroll-view class="article-body" scroll-y>
      <view class="content-area">
        <view v-for="(item, idx) in topic.content" :key="idx">
          <text v-if="item.type === 'paragraph'" class="paragraph">{{ item.text }}</text>
          <view v-else-if="item.type === 'blockFormula'" class="formula-card">
            <text class="formula">{{ item.latex }}</text>
            <text class="formula-note">{{ item.explanation }}</text>
          </view>
          <view v-else-if="item.type === 'figure'" class="figure-card">
            <image v-if="item.imageSrc" class="figure-img" :src="resolveAsset(item.imageSrc)" mode="aspectFit" />
            <text class="figure-title">{{ item.imageAlt }}</text>
            <text class="figure-note">{{ item.caption }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="bottom-bar">
      <button class="btn-ghost" @tap="goPrev">{{ pageIndex <= 0 ? '返回目录' : '上一页' }}</button>
      <button class="btn-primary" @tap="goNext">{{ pageIndex >= course.pages.length - 1 ? '完成' : '下一页' }}</button>
    </view>
    </view>
  </view>
</template>

<script>
import { resolveAsset } from '../../utils/asset-map'

export default {
  data() {
    return { courseId: 'analysis', pageIndex: 0, course: null }
  },
  onLoad(options) {
    if (options && options.course) this.courseId = options.course
    const { getMathCourse } = require('../../business/math-catalog')
    this.course = getMathCourse(this.courseId)
  },
  computed: {
    topic() {
      if (!this.course) return null
      const pages = this.course.pages
      return pages[Math.max(0, Math.min(this.pageIndex, pages.length - 1))] || pages[0]
    }
  },
  methods: {
    resolveAsset,
    goPrev() {
      if (this.pageIndex <= 0) { uni.navigateBack(); return }
      this.pageIndex--
    },
    goNext() {
      if (!this.course || this.pageIndex >= this.course.pages.length - 1) {
        try {
          const { markMathCourseVisited } = require('../../business/math-progress')
          markMathCourseVisited(this.courseId)
        } catch (error) {
          console.error('[math-course] mark visited failed', error)
        }
        uni.navigateBack()
        return
      }
      this.pageIndex++
    }
  }
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100vh; background: #f8fafc; }
.article-head { background: #fff; padding: 32rpx 40rpx 24rpx; border-bottom: 2rpx solid #f0f0f0; }
.eyebrow { font-size: 22rpx; color: #007a66; display: block; margin-bottom: 8rpx; }
.title { font-size: 36rpx; font-weight: 700; color: #1a2e2b; display: block; margin-bottom: 8rpx; }
.role { font-size: 24rpx; color: #6b7280; display: block; }
.article-body { flex: 1; }
.content-area { padding: 32rpx 32rpx 40rpx; }
.paragraph { font-size: 28rpx; color: #374151; line-height: 1.8; display: block; margin-bottom: 24rpx; }
.formula-card { background: #f8fafc; border-left: 6rpx solid #007a66; border-radius: 12rpx; padding: 24rpx; margin-bottom: 24rpx; }
.formula { font-size: 28rpx; color: #1a2e2b; font-family: monospace; display: block; margin-bottom: 12rpx; }
.formula-note { font-size: 24rpx; color: #6b7280; display: block; }
.figure-card { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 24rpx; border: 2rpx solid #e5e7eb; }
.figure-img { width: 100%; height: 300rpx; display: block; margin-bottom: 16rpx; }
.figure-title { font-size: 26rpx; font-weight: 600; color: #1a2e2b; display: block; margin-bottom: 8rpx; }
.figure-note { font-size: 22rpx; color: #6b7280; line-height: 1.5; display: block; }
.bottom-bar { display: flex; gap: 16rpx; padding: 24rpx 32rpx; background: #fff; border-top: 2rpx solid #f0f0f0; }
.btn-ghost { flex: 1; background: transparent; color: #007a66; border: 2rpx solid #007a66; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; }
.btn-primary { flex: 1; background: #007a66; color: #fff; border: none; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; font-weight: 600; }
</style>
