<template>
  <view class="page">
    <view v-if="!course" class="empty">
      <text class="empty-title">课程加载失败</text>
      <button class="btn-ghost" @tap="goBack">返回</button>
    </view>
    <view v-else class="main">
      <view class="head">
        <text class="eyebrow">{{ course.title }} · {{ pageIndex + 1 }}/{{ course.pages.length }}</text>
        <text class="title">{{ currentPage.title }}</text>
        <text class="role">{{ currentPage.role }}</text>
      </view>
      <scroll-view class="body" scroll-y>
        <view v-for="(item, idx) in currentPage.content" :key="idx">
          <text v-if="item.type === 'paragraph'" class="paragraph">{{ item.text }}</text>
          <view v-else-if="item.type === 'figure'" class="figure-card">
            <image v-if="item.imageSrc" class="figure-img" :src="resolveAsset(item.imageSrc)" mode="widthFix" />
            <text v-if="item.caption" class="figure-caption">{{ item.caption }}</text>
          </view>
        </view>
      </scroll-view>
      <view class="footer">
        <button class="btn-ghost" @tap="goPrev">{{ pageIndex <= 0 ? '返回目录' : '上一页' }}</button>
        <button class="btn-primary" @tap="goNext">{{ pageIndex >= course.pages.length - 1 ? '完成阅读' : '下一页' }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import { resolveAsset } from '../../utils/asset-map'
import { getMajorCourseReader } from './business/major-course-reader'
import { markMajorCourseVisited } from './business/major-progress'

export default {
  data() {
    return {
      majorId: '',
      courseId: '',
      level: 'foundation',
      pageIndex: 0,
      course: null,
    }
  },
  computed: {
    currentPage() {
      if (!this.course) return { title: '', role: '', content: [] }
      const pages = this.course.pages
      return pages[Math.max(0, Math.min(this.pageIndex, pages.length - 1))] || pages[0]
    },
  },
  onLoad(options) {
    this.majorId = (options && options.majorId) || ''
    this.courseId = (options && options.courseId) || ''
    this.level = (options && options.level) || 'foundation'
    if (options && options.page) this.pageIndex = Number(options.page) || 0
    this.course = getMajorCourseReader(this.majorId, this.courseId, this.level)
    if (!this.course) {
      uni.showToast({ title: '未找到课程内容', icon: 'none' })
    }
  },
  methods: {
    resolveAsset,
    goBack() {
      uni.navigateBack()
    },
    goPrev() {
      if (this.pageIndex <= 0) {
        uni.navigateBack()
        return
      }
      this.pageIndex -= 1
    },
    goNext() {
      if (!this.course || this.pageIndex >= this.course.pages.length - 1) {
        markMajorCourseVisited(this.majorId, this.courseId)
        uni.navigateBack()
        return
      }
      this.pageIndex += 1
    },
  },
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100vh; background: #f8fafc; }
.main { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.head { background: #fff; padding: 32rpx 40rpx 24rpx; border-bottom: 2rpx solid #f0f0f0; }
.eyebrow { display: block; font-size: 22rpx; color: #64748b; }
.title { display: block; margin-top: 10rpx; font-size: 34rpx; font-weight: 700; color: #162033; }
.role { display: block; margin-top: 8rpx; font-size: 22rpx; color: #94a3b8; }
.body { flex: 1; padding: 24rpx 32rpx; box-sizing: border-box; }
.paragraph { display: block; margin-bottom: 20rpx; font-size: 26rpx; line-height: 1.85; color: #374151; }
.figure-card { margin-bottom: 24rpx; }
.figure-img { width: 100%; border-radius: 18rpx; background: #eef2f7; }
.figure-caption { display: block; margin-top: 10rpx; font-size: 22rpx; color: #64748b; }
.footer { display: flex; gap: 16rpx; padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom)); background: #fff; }
.btn-ghost, .btn-primary { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; font-size: 28rpx; font-weight: 700; }
.btn-ghost { background: #eef2f7; color: #475569; }
.btn-primary { background: #007a66; color: #fff; }
.empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24rpx; }
.empty-title { font-size: 30rpx; color: #162033; }
</style>
