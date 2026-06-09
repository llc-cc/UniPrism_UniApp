<template>
  <scroll-view v-if="major" class="page" scroll-y>
    <image class="hero-image" :src="resolveAsset(major.heroImage)" mode="aspectFill" />
    <view class="hero-copy">
      <view class="hero-top">
        <view>
          <text class="hero-title">{{ major.title }}</text>
          <text class="hero-en">{{ major.en }}</text>
        </view>
        <text class="hero-status" :class="{ 'hero-status-done': explored }">
          {{ explored ? '已体验' : '待体验' }}
        </text>
      </view>
      <text class="hero-summary">{{ major.summary }}</text>
      <view class="hero-stats">
        <view class="hero-stat">
          <text class="hero-stat-value">{{ major.coreCourses.length }}</text>
          <text class="hero-stat-label">核心课程</text>
        </view>
        <view class="hero-stat">
          <text class="hero-stat-value">{{ major.directions.length }}</text>
          <text class="hero-stat-label">发展方向</text>
        </view>
        <view class="hero-stat">
          <text class="hero-stat-value">{{ isMathMajor ? 5 : speedTemplate ? 5 : 1 }}</text>
          <text class="hero-stat-label">{{ isMathMajor || speedTemplate ? '体验步骤' : '导览入口' }}</text>
        </view>
      </view>
    </view>

    <view class="panel">
      <view class="section-head">
        <text class="section-title">体验路径</text>
        <text class="section-meta">{{ isMathMajor || speedTemplate ? '按 Web 端节奏同步' : '专业导览模式' }}</text>
      </view>
      <view class="path-row">
        <text v-for="(item, idx) in experiencePath" :key="item" class="path-chip">
          <text class="path-index">{{ idx + 1 }}</text>
          <text class="path-text">{{ item }}</text>
        </text>
      </view>
    </view>

    <view v-if="speedTemplate && speedTemplate.taskSummary" class="panel">
      <text class="section-title">体验层级结构</text>
      <view class="overview-grid">
        <view class="overview-card">
          <text class="overview-title">基础课层</text>
          <text class="overview-body">{{ speedTemplate.taskSummary.foundationCount }} 门，进入课程文章与任务台。</text>
        </view>
        <view class="overview-card">
          <text class="overview-title">进阶挑战层</text>
          <text class="overview-body">{{ speedTemplate.taskSummary.coreCount }} 门，对应核心/进阶课程挑战。</text>
        </view>
        <view class="overview-card">
          <text class="overview-title">方向分流层</text>
          <text class="overview-body">{{ speedTemplate.taskSummary.branchCount }} 个方向，用来选择长期训练路线。</text>
        </view>
        <view class="overview-card">
          <text class="overview-title">专题任务层</text>
          <text class="overview-body">{{ speedTemplate.taskSummary.topicCount }} 个专题，收束到项目/职业任务判断。</text>
        </view>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">你会体验到什么</text>
      <view class="bullet-list">
        <text v-for="item in major.tasks" :key="item" class="bullet-item">· {{ item }}</text>
      </view>
    </view>

    <view v-if="isMathMajor && mathOverviewCards.length" class="panel">
      <text class="section-title">专业认知速览</text>
      <view class="overview-grid">
        <view v-for="card in mathOverviewCards" :key="card.index" class="overview-card">
          <text class="overview-title">{{ card.index }} · {{ card.title }}</text>
          <text class="overview-body">{{ card.body }}</text>
        </view>
      </view>
    </view>

    <view v-if="speedTemplate && speedTemplate.overviewCards && speedTemplate.overviewCards.length" class="panel">
      <text class="section-title">专业认知速览</text>
      <view class="overview-grid">
        <view v-for="card in speedTemplate.overviewCards" :key="card.title" class="overview-card">
          <text class="overview-title">{{ card.title }}</text>
          <text class="overview-body">{{ card.body }}</text>
        </view>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">适合这类专业的信号</text>
      <view class="tag-row">
        <text v-for="item in major.fit" :key="item" class="tag">{{ item }}</text>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">核心课程</text>
      <view class="tag-row">
        <text v-for="item in major.coreCourses" :key="item" class="tag tag-course">{{ item }}</text>
      </view>
    </view>

    <view v-if="speedTemplate && speedTemplate.foundationCourses && speedTemplate.foundationCourses.length" class="panel">
      <text class="section-title">基础课程预览</text>
      <view v-for="course in speedTemplate.foundationCourses" :key="course.id" class="course-card">
        <view class="course-head">
          <text class="course-title">{{ course.title }}</text>
          <text class="course-sub">{{ course.subtitle }}</text>
        </view>
        <text class="course-intro">{{ course.intro }}</text>
      </view>
    </view>

    <view v-if="speedTemplate && speedTemplate.coreCourses && speedTemplate.coreCourses.length" class="panel">
      <text class="section-title">进阶专业内容</text>
      <view v-for="course in speedTemplate.coreCourses" :key="course.id" class="course-card course-card-core">
        <view class="course-head">
          <text class="course-title">{{ course.title }}</text>
          <text class="course-sub">{{ course.subtitle }}</text>
        </view>
        <text class="course-intro">{{ course.intro }}</text>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">常见发展方向</text>
      <view class="tag-row">
        <text v-for="item in major.directions" :key="item" class="tag tag-direction">{{ item }}</text>
      </view>
    </view>

    <view v-if="isMathMajor" class="panel">
      <text class="section-title">方向分流</text>
      <view v-for="branch in mathBranches" :key="branch.id" class="branch-card">
        <view class="branch-head">
          <text class="branch-title">{{ branch.title }}</text>
          <text class="branch-fit">{{ branch.fit }}</text>
        </view>
        <view class="tag-row tag-row-tight">
          <text v-for="topic in branch.modules" :key="topic" class="tag tag-branch">{{ topic }}</text>
        </view>
        <text class="branch-meta">{{ branch.subtitle }} · {{ branch.body }}</text>
      </view>
    </view>

    <view v-if="speedTemplate && speedTemplate.branches && speedTemplate.branches.length" class="panel">
      <text class="section-title">方向分流</text>
      <view v-for="branch in speedTemplate.branches" :key="branch.id" class="branch-card">
        <view class="branch-head">
          <text class="branch-title">{{ branch.title }}</text>
          <text class="branch-fit">{{ branch.fit }}</text>
        </view>
        <view class="tag-row tag-row-tight">
          <text v-for="topic in branch.topics" :key="topic" class="tag tag-branch">{{ topic }}</text>
        </view>
        <text class="branch-meta">代表项目：{{ branch.project }}</text>
        <text class="branch-meta">去向：{{ branch.roles.join(' / ') }}</text>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">相关职业</text>
      <view class="tag-row">
        <text v-for="item in major.careers" :key="item" class="tag tag-career">{{ item }}</text>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">图文资料</text>
      <view v-for="(item, idx) in major.media" :key="idx" class="media-card">
        <text class="media-title">{{ item.title }}</text>
        <image v-if="item.type === 'image'" class="media-image" :src="resolveAsset(item.url)" mode="widthFix" />
        <video v-else class="media-video" :src="resolveAsset(item.url)" controls />
      </view>
    </view>

    <view class="footer-actions">
      <button class="btn-ghost" @tap="goBack">返回专业列表</button>
      <button class="btn-primary" @tap="openNext">{{ primaryActionLabel }}</button>
    </view>
  </scroll-view>
</template>

<script>
import { getMajorById } from '../../business/explore-data'
import { loadExploreProgress } from '../../business/explore-progress'
import { getMajorSpeedTemplate, hasMajorSpeedTemplate } from '../../business/major-speed-data'
import { MATH_CATALOG_OVERVIEW_CARDS, MATH_BRANCH_DIRECTIONS, MATH_EXPERIENCE_PATH } from '../../business/math-config'
import { resolveAsset } from '../../utils/asset-map'

export default {
  data() {
    return {
      major: null,
      speedTemplate: null,
      explored: false,
    }
  },
  computed: {
    isMathMajor() {
      return this.major?.id === 'math-u'
    },
    mathOverviewCards() {
      return this.isMathMajor ? MATH_CATALOG_OVERVIEW_CARDS : []
    },
    mathBranches() {
      return this.isMathMajor ? MATH_BRANCH_DIRECTIONS : []
    },
    experiencePath() {
      if (this.isMathMajor) return MATH_EXPERIENCE_PATH
      if (this.speedTemplate && this.speedTemplate.methodLoop && this.speedTemplate.methodLoop.length) {
        return this.speedTemplate.methodLoop
      }
      if (this.speedTemplate) {
        return ['专业认知', '基础内容', '专业内容', '方向分流', '适配判断']
      }
      return ['专业导览', '查看图文资料', '进入后续体验']
    },
    primaryActionLabel() {
      if (!this.major) return '开始体验'
      if (this.major.route === '/pages/math/index') return this.explored ? '继续数学体验' : '进入数学体验'
      if (this.speedTemplate) return this.explored ? '继续速体验' : '开始速体验'
      return '进入专业导览'
    },
  },
  onLoad(query) {
    const pageQuery = query || {}
    const progress = loadExploreProgress()
    this.major = getMajorById(pageQuery.id)
    this.speedTemplate = this.major ? getMajorSpeedTemplate(this.major.id) : null
    this.explored = Boolean(this.major && (progress.majorsExplored || []).includes(this.major.id))
    if (this.major) {
      uni.setNavigationBarTitle({ title: this.major.shortTitle || this.major.title })
    }
  },
  methods: {
    resolveAsset,
    goBack() {
      uni.navigateBack()
    },
    openNext() {
      if (!this.major) return
      if (this.major.route) {
        if (this.major.route === '/pages/math/index') {
          uni.navigateTo({ url: this.major.route })
          return
        }
        uni.navigateTo({ url: this.major.route })
        return
      }
      if (hasMajorSpeedTemplate(this.major.id)) {
        uni.navigateTo({ url: `/pages/discover/major-speed?id=${encodeURIComponent(this.major.id)}` })
        return
      }
      uni.showToast({ title: '该专业速体验正在接入中', icon: 'none' })
    },
  },
}
</script>

<style scoped>
.page { background: #f4f7fb; padding-bottom: 16rpx; }
.hero-image { width: 100%; height: 360rpx; }
.hero-copy { margin: -44rpx 24rpx 0; border-radius: 28rpx; background: #fff; padding: 28rpx; position: relative; z-index: 2; box-shadow: 0 18rpx 48rpx rgba(15,23,42,0.08); }
.hero-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 18rpx; }
.hero-title { display: block; font-size: 38rpx; font-weight: 700; color: #162033; }
.hero-en { display: block; margin-top: 10rpx; font-size: 22rpx; color: #64748b; }
.hero-status { padding: 10rpx 18rpx; border-radius: 999rpx; background: #f1f5f9; font-size: 20rpx; font-weight: 700; color: #64748b; }
.hero-status-done { background: #ecfdf5; color: #047857; }
.hero-summary { display: block; margin-top: 18rpx; font-size: 25rpx; line-height: 1.75; color: #566070; }
.hero-stats { display: flex; gap: 16rpx; margin-top: 22rpx; }
.hero-stat { flex: 1; border-radius: 20rpx; background: #f8fafc; padding: 18rpx 20rpx; }
.hero-stat-value { display: block; font-size: 30rpx; font-weight: 700; color: #162033; }
.hero-stat-label { display: block; margin-top: 8rpx; font-size: 22rpx; color: #7b8697; }

.panel { margin: 24rpx; border-radius: 28rpx; background: #fff; padding: 28rpx; box-shadow: 0 14rpx 38rpx rgba(15,23,42,0.05); }
.section-head { display: flex; justify-content: space-between; align-items: center; gap: 18rpx; }
.section-title { display: block; font-size: 30rpx; font-weight: 700; color: #162033; }
.section-meta { font-size: 22rpx; color: #7b8697; }

.path-row { display: flex; flex-wrap: wrap; gap: 14rpx; margin-top: 20rpx; }
.path-chip { display: inline-flex; align-items: center; gap: 10rpx; padding: 14rpx 18rpx; border-radius: 999rpx; background: #edf6ff; }
.path-index { width: 34rpx; height: 34rpx; line-height: 34rpx; text-align: center; border-radius: 50%; background: #2563eb; color: #fff; font-size: 18rpx; font-weight: 700; }
.path-text { font-size: 22rpx; color: #1f4f8d; font-weight: 700; }

.bullet-list { margin-top: 18rpx; }
.bullet-item { display: block; font-size: 24rpx; line-height: 1.8; color: #566070; margin-bottom: 8rpx; }

.overview-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 22rpx; }
.overview-card { width: calc(50% - 8rpx); box-sizing: border-box; border-radius: 22rpx; background: #f8fbff; padding: 22rpx; }
.overview-title { display: block; font-size: 26rpx; font-weight: 700; color: #16233a; }
.overview-body { display: block; margin-top: 10rpx; font-size: 22rpx; line-height: 1.65; color: #5d6776; }

.tag-row { display: flex; flex-wrap: wrap; gap: 14rpx; margin-top: 20rpx; }
.tag-row-tight { margin-top: 14rpx; }
.tag { padding: 14rpx 22rpx; border-radius: 999rpx; background: #f3f7fb; font-size: 22rpx; color: #334155; }
.tag-course { background: #edf6ff; color: #2563eb; }
.tag-direction { background: #ecfdf5; color: #059669; }
.tag-career { background: #f5f3ff; color: #7c3aed; }
.tag-branch { background: #eefdf7; color: #0f766e; }

.course-card { background: #f8fbff; border-radius: 22rpx; padding: 22rpx; margin-top: 18rpx; }
.course-card-core { border-left: 6rpx solid #2563eb; }
.course-head { display: flex; flex-direction: column; gap: 6rpx; }
.course-title { font-size: 28rpx; font-weight: 700; color: #16233a; }
.course-sub { font-size: 22rpx; color: #7b8697; }
.course-intro { display: block; margin-top: 12rpx; font-size: 23rpx; line-height: 1.7; color: #4a5564; }

.branch-card { background: #f8fbff; border-radius: 22rpx; padding: 22rpx; margin-top: 18rpx; }
.branch-head { display: flex; flex-direction: column; gap: 10rpx; }
.branch-title { font-size: 28rpx; font-weight: 700; color: #16233a; }
.branch-fit { font-size: 22rpx; color: #0f766e; }
.branch-meta { display: block; margin-top: 12rpx; font-size: 22rpx; color: #566070; line-height: 1.6; }

.media-card { margin-top: 22rpx; }
.media-title { display: block; font-size: 25rpx; font-weight: 700; color: #1f2937; margin-bottom: 14rpx; }
.media-image, .media-video { width: 100%; border-radius: 22rpx; background: #f8fafc; }

.footer-actions { display: flex; gap: 16rpx; padding: 0 24rpx 36rpx; }
.btn-ghost, .btn-primary { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; font-size: 28rpx; font-weight: 700; }
.btn-ghost { background: #eef2f7; color: #475569; }
.btn-primary { background: linear-gradient(90deg, #14b8a6, #2563eb); color: #fff; }
</style>
