<template>
  <scroll-view v-if="major" class="page" scroll-y>
    <view class="hero-shell" :style="{ background: heroGradient }">
      <image class="hero-image" :src="resolveAsset(major.heroImage)" mode="aspectFill" />
      <view class="hero-copy">
        <view class="hero-top">
          <view class="hero-title-block">
            <view class="hero-kicker-row">
              <text v-if="reportBadgeText" class="hero-kicker">{{ reportBadgeText }}</text>
              <text v-if="reportScoreLabel" class="hero-kicker hero-kicker-soft">{{ reportScoreLabel }}</text>
            </view>
            <text class="hero-title">{{ major.title }}</text>
            <text class="hero-en">{{ major.en }}</text>
          </view>
          <text class="hero-status" :class="{ 'hero-status-done': explored }">
            {{ explored ? '已体验' : '待体验' }}
          </text>
        </view>
        <text class="hero-summary">{{ major.summary }}</text>
        <view class="hero-stats">
          <view v-for="item in analysisStats" :key="item.label" class="hero-stat">
            <text class="hero-stat-value">{{ item.value }}</text>
            <text class="hero-stat-label">{{ item.label }}</text>
            <text class="hero-stat-desc">{{ item.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 专业介绍：与 Web 保持一致，intro 段落优先呈现 -->
    <view v-if="introParagraphs.length" class="panel">
      <text class="section-title">专业介绍</text>
      <view class="paragraph-group">
        <text v-for="(line, index) in introParagraphs" :key="`${line}-${index}`" class="paragraph-line">{{ line }}</text>
      </view>
    </view>

    <!-- 推荐分析：仅在来自兴趣报告时展示 -->
    <view v-if="hasReportContext" class="panel panel-highlight">
      <view class="section-head">
        <text class="section-title">推荐分析</text>
        <text class="section-meta">来自兴趣报告</text>
      </view>
      <text class="analysis-lead">{{ analysisLead }}</text>
      <view v-if="reportInsight" class="insight-grid insight-grid-compact">
        <view class="insight-card">
          <text class="insight-title">为何推荐你看这个专业</text>
          <text class="insight-body">{{ reportInsight }}</text>
        </view>
      </view>
    </view>

    <!-- 专业概览：全部 4 张卡片，带编号徽章，对齐 Web IntroCardList -->
    <view v-if="overviewCardsList.length" class="panel">
      <view class="section-head">
        <text class="section-title">专业概览</text>
        <text class="section-meta">{{ overviewCardsList.length }} 个维度</text>
      </view>
      <view class="overview-card-list">
        <view
          v-for="(card, idx) in overviewCardsList"
          :key="card.title"
          class="overview-card"
        >
          <text class="overview-card-badge">{{ idx < 9 ? '0' + (idx + 1) : idx + 1 }}</text>
          <view class="overview-card-content">
            <text class="overview-card-title">{{ card.title }}</text>
            <text class="overview-card-body">{{ card.body }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="foundationCourseDetails.length || coreCourseDetails.length" class="panel">
      <view class="section-head">
        <text class="section-title">课程地图</text>
        <text class="section-meta">{{ courseMapMeta }}</text>
      </view>

      <view v-if="foundationCourseDetails.length" class="detail-block">
        <text class="detail-block-title">基础课程</text>
        <text v-if="foundationIntroText" class="detail-block-intro">{{ foundationIntroText }}</text>
        <view class="detail-grid">
          <view v-for="course in foundationCourseDetails" :key="course.id || course.title" class="detail-card">
            <text class="detail-card-title">{{ course.title }}</text>
            <text v-if="course.subtitle" class="detail-card-subtitle">{{ course.subtitle }}</text>
            <text v-if="course.intro" class="detail-card-body">{{ course.intro }}</text>
            <view v-if="course.topics && course.topics.length" class="tag-row detail-tag-row">
              <text v-for="topic in course.topics" :key="topic" class="tag tag-soft">{{ topic }}</text>
            </view>
            <view v-if="course.task" class="task-box">
              <text class="task-box-label">典型任务</text>
              <text class="task-box-body">{{ course.task }}</text>
            </view>
            <!-- Chess Lab 主题文章（对齐 Web CourseTopicArticlePage，仅 ai-introduction 有此字段） -->
            <view v-if="course.chessLabTopics && course.chessLabTopics.length" class="chess-lab-topics">
              <view class="chess-lab-header">
                <text class="chess-lab-header-label">AI 棋类实验室</text>
                <text class="chess-lab-header-sub">从博弈视角理解 AI 发展历程</text>
              </view>
              <view
                v-for="(topic, topicIdx) in course.chessLabTopics"
                :key="topic.id"
                class="chess-lab-topic"
              >
                <view class="chess-lab-topic-head">
                  <text class="chess-lab-topic-num">{{ topicIdx < 9 ? '0' + (topicIdx + 1) : topicIdx + 1 }}</text>
                  <text class="chess-lab-topic-title">{{ topic.title }}</text>
                </view>
                <view class="chess-lab-topic-body">
                  <text
                    v-for="(para, paraIdx) in topic.paragraphs"
                    :key="`${topic.id}-p${paraIdx}`"
                    class="chess-lab-para"
                  >{{ para }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="coreCourseDetails.length" class="detail-block">
        <text class="detail-block-title">核心课程</text>
        <text v-if="coreIntroText" class="detail-block-intro">{{ coreIntroText }}</text>
        <view class="detail-grid">
          <view v-for="course in coreCourseDetails" :key="course.id || course.title" class="detail-card detail-card-accent">
            <text class="detail-card-title">{{ course.title }}</text>
            <text v-if="course.subtitle" class="detail-card-subtitle">{{ course.subtitle }}</text>
            <text v-if="course.intro" class="detail-card-body">{{ course.intro }}</text>
            <view v-if="course.topics && course.topics.length" class="tag-row detail-tag-row">
              <text v-for="topic in course.topics" :key="topic" class="tag tag-course">{{ topic }}</text>
            </view>
            <view v-if="course.task" class="task-box">
              <text class="task-box-label">典型任务</text>
              <text class="task-box-body">{{ course.task }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="branchDetails.length" class="panel">
      <view class="section-head">
        <text class="section-title">方向分流</text>
        <text class="section-meta">{{ branchDetails.length }} 个方向</text>
      </view>
      <view class="direction-grid">
        <view v-for="branch in branchDetails" :key="branch.id || branch.title" class="direction-card">
          <text class="direction-title">{{ branch.title }}</text>
          <text v-if="branch.fit" class="direction-fit">{{ branch.fit }}</text>
          <view v-if="branch.topics && branch.topics.length" class="direction-section">
            <text class="direction-label">核心主题</text>
            <view class="tag-row detail-tag-row">
              <text v-for="topic in branch.topics" :key="topic" class="tag tag-direction">{{ topic }}</text>
            </view>
          </view>
          <view v-if="branch.frontier" class="direction-section">
            <text class="direction-label">前沿线索</text>
            <text class="direction-copy">{{ branch.frontier }}</text>
          </view>
          <view v-if="branch.project" class="direction-section">
            <text class="direction-label">示例项目</text>
            <text class="direction-copy">{{ branch.project }}</text>
          </view>
          <view v-if="branch.roles && branch.roles.length" class="direction-section">
            <text class="direction-label">对应角色</text>
            <view class="tag-row detail-tag-row">
              <text v-for="role in branch.roles" :key="role" class="tag">{{ role }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="careerTags.length" class="panel">
      <text class="section-title">毕业去向</text>
      <view class="tag-row career-row">
        <text v-for="career in careerTags" :key="career" class="tag tag-career">{{ career }}</text>
      </view>
    </view>

    <view class="panel">
      <text class="section-title">一句话判断</text>
      <text class="analysis-lead action-lead">{{ actionLead }}</text>
    </view>

    <view class="footer-actions">
      <button class="btn-primary btn-primary-full" @tap="openNext">{{ primaryActionLabel }}</button>
    </view>
  </scroll-view>
</template>

<script>
import { getMajorById } from '../../business/explore-data'
import { loadExploreProgress } from '../../business/explore-progress'
import { getReportMajorContext } from '../../business/major-routes'
import { guardMajorExperienceNavigation } from '../../business/disabled-miniapp-routes'
import { getMajorLabelById } from '../../business/riasecEngine'
import { resolveAsset } from '../../utils/asset-map'

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function clampPercent(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return ''
  return `${Math.max(60, Math.min(99, Math.round(num)))}%`
}


function buildFallbackMajor(majorId, reportContext, speedTemplate) {
  const reportName = normalizeText(reportContext && reportContext.name)
  const labelName = normalizeText(getMajorLabelById(majorId))
  const title = reportName || labelName || '专业分析'
  const foundationCourses = (speedTemplate && speedTemplate.foundationCourses) || []
  const coreCourses = (speedTemplate && speedTemplate.coreCourses) || []
  const branches = (speedTemplate && speedTemplate.branches) || []
  const careers = (speedTemplate && speedTemplate.careers) || []
  const intro = (speedTemplate && speedTemplate.intro) || []
  const firstIntro = normalizeText(intro[0])
  const description = normalizeText(reportContext && reportContext.description)
  const coreCourseTitles = foundationCourses.concat(coreCourses).map((item) => item.title).filter(Boolean).slice(0, 5)

  return {
    id: majorId,
    title,
    shortTitle: title,
    en: (speedTemplate && speedTemplate.en) || '',
    accent: (speedTemplate && speedTemplate.accent) || '#2563eb',
    heroImage: '/images/explore/discover/stage-hero-major-clean.png',
    summary:
      description ||
      firstIntro ||
      `${title}的详细专业体验内容正在逐步接入，当前可以先查看推荐原因、课程方向和后续体验入口。`,
    fit: [
      description || `如果你想理解“${title}”为什么会出现在推荐列表里，可以先从推荐分析开始。`,
      '适合愿意先建立专业整体认知，再逐步判断课程与职业路径的人。',
      '可以先把它当作方向判断页，确认是否值得继续深入体验。',
    ],
    coreCourses: coreCourseTitles.length ? coreCourseTitles : ['专业基础课', '核心方法课', '方向应用课'],
    directions:
      branches.map((item) => item.title).filter(Boolean).slice(0, 5).length
        ? branches.map((item) => item.title).filter(Boolean).slice(0, 5)
        : ['专业认知', '课程理解', '方向判断'],
    careers: careers.length ? careers.slice(0, 5) : ['相关岗位信息待补充'],
    tasks: [
      '先理解这个专业的推荐原因与整体定位。',
      '再查看课程结构、方向分流和关联职业。',
      '最后判断自己是否要继续进入完整专业体验。',
    ],
    media: [],
    route: '',
  }
}

export default {
  data() {
    return {
      major: null,
      speedTemplate: null,
      explored: false,
      reportContext: null,
    }
  },
  computed: {
    hasReportContext() {
      return Boolean(
        this.reportContext &&
        (this.reportContext.source === 'report' || this.reportContext.description || this.reportContext.score || this.reportContext.rankLabel),
      )
    },
    heroGradient() {
      const accent = (this.major && this.major.accent) || '#2563eb'
      return `linear-gradient(135deg, ${accent} 0%, #0f172a 100%)`
    },
    reportBadgeText() {
      if (this.hasReportContext && this.reportContext.rankLabel) {
        return `报告推荐 TOP ${this.reportContext.rankLabel}`
      }
      if (this.hasReportContext) return '报告推荐专业'
      return '专业分析页'
    },
    reportScoreLabel() {
      return this.hasReportContext ? `匹配度 ${clampPercent(this.reportContext.score)}` : ''
    },
    analysisLead() {
      const majorIntro = this.major && Array.isArray(this.major.intro) ? normalizeText(this.major.intro[0]) : ''
      return normalizeText(
        (this.reportContext && this.reportContext.description) ||
        majorIntro ||
        (this.major && this.major.summary) ||
        '这个专业会结合课程、方向和职业去向，帮助你快速判断是否值得继续深入体验。',
      )
    },
    analysisStats() {
      if (!this.major) return []
      return [
        {
          label: '匹配指数',
          value: clampPercent(this.reportContext && this.reportContext.score) || `${this.major.coreCourses.length}门`,
          desc: this.hasReportContext ? '基于兴趣报告推荐' : '核心课程数量',
        },
        {
          label: '发展方向',
          value: String((this.major.directions || []).length),
          desc: '可继续延展的分流方向',
        },
        {
          label: '关联职业',
          value: String((this.major.careers || []).length),
          desc: '可连接的典型岗位',
        },
      ]
    },
    overviewCardsList() {
      const cards = Array.isArray(this.major && this.major.overviewCards) ? this.major.overviewCards : []
      if (cards.length) return cards
      // 无 overviewCards 时用 fit/directions 生成兜底卡片
      if (!this.major) return []
      const fallback = []
      const fit = Array.isArray(this.major.fit) ? this.major.fit : []
      if (fit.length) {
        fallback.push({ title: '适合信号', body: fit.slice(0, 2).map(normalizeText).join('；') })
      }
      const dirs = Array.isArray(this.major.directions) ? this.major.directions : []
      if (dirs.length) {
        fallback.push({ title: '发展方向', body: dirs.slice(0, 4).join('、') })
      }
      return fallback
    },
    reportInsight() {
      if (!this.hasReportContext) return ''
      return normalizeText(this.reportContext && this.reportContext.description)
    },
    courseMapMeta() {
      const f = this.foundationCourseDetails.length
      const c = this.coreCourseDetails.length
      if (f && c) return `基础 ${f} 门 · 核心 ${c} 门`
      if (f) return `${f} 门基础课程`
      if (c) return `${c} 门核心课程`
      return ''
    },
    introParagraphs() {
      return (Array.isArray(this.major && this.major.intro) ? this.major.intro : [])
        .map((item) => normalizeText(item))
        .filter(Boolean)
    },
    foundationIntroText() {
      return normalizeText(this.major && this.major.foundationIntro)
    },
    coreIntroText() {
      return normalizeText(this.major && this.major.coreIntro)
    },
    foundationCourseDetails() {
      return Array.isArray(this.major && this.major.foundationCoursesDetail) ? this.major.foundationCoursesDetail : []
    },
    coreCourseDetails() {
      return Array.isArray(this.major && this.major.coreCoursesDetail) ? this.major.coreCoursesDetail : []
    },
    branchDetails() {
      return Array.isArray(this.major && this.major.branchDirectionsDetail) ? this.major.branchDirectionsDetail : []
    },
    careerTags() {
      return Array.isArray(this.major && this.major.careers) ? this.major.careers : []
    },
    actionLead() {
      if (this.speedTemplate) {
        return '如果你对这个方向有感觉，可以继续进入速体验，快速看课程、方向和真实任务。'
      }
      return '如果这个专业和你的兴趣匹配，可以先把它加入重点关注名单，后续再继续深入了解。'
    },
    primaryActionLabel() {
      if (!this.major) return '开始体验'
      if (this.speedTemplate) return this.explored ? '继续速体验' : '开始速体验'
      return '知道了'
    },
  },
  onLoad(query) {
    if (guardMajorExperienceNavigation()) {
      setTimeout(() => uni.navigateBack(), 300)
      return
    }
    const pageQuery = query || {}
    const majorId = normalizeText(pageQuery.id)
    const progress = loadExploreProgress()
    this.reportContext = majorId ? getReportMajorContext(majorId) : null
    this.speedTemplate = null
    this.major = getMajorById(majorId) || buildFallbackMajor(majorId, this.reportContext, this.speedTemplate)
    this.explored = Boolean(this.major && (progress.majorsExplored || []).includes(this.major.id))
    if (this.major) {
      uni.setNavigationBarTitle({ title: this.major.shortTitle || this.major.title })
    }
  },
  methods: {
    resolveAsset,
    openNext() {
      if (!this.major) return
      if (this.major.route) {
        uni.navigateTo({ url: this.major.route })
        return
      }
      uni.navigateBack()
    },
  },
}
</script>

<style scoped>
.page {
  background: #f4f7fb;
  padding-bottom: 16rpx;
}

.hero-shell {
  margin: 0 0 24rpx;
  padding-bottom: 28rpx;
  border-bottom-left-radius: 36rpx;
  border-bottom-right-radius: 36rpx;
  overflow: hidden;
}

.hero-image {
  width: calc(100% - 48rpx);
  height: 360rpx;
  margin: 24rpx 24rpx 0;
  border-radius: 28rpx;
}

.hero-copy {
  margin: -44rpx 24rpx 0;
  border-radius: 28rpx;
  background: #fff;
  padding: 28rpx;
  position: relative;
  z-index: 2;
  box-shadow: 0 18rpx 48rpx rgba(15, 23, 42, 0.12);
}

.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18rpx;
}

.hero-title-block {
  flex: 1;
}

.hero-kicker-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 14rpx;
}

.hero-kicker {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(37, 99, 235, 0.12);
  color: #1d4ed8;
  font-size: 20rpx;
  font-weight: 700;
}

.hero-kicker-soft {
  background: rgba(15, 118, 110, 0.12);
  color: #0f766e;
}

.hero-title {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #162033;
}

.hero-en {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #64748b;
}

.hero-status {
  padding: 10rpx 18rpx;
  border-radius: 999rpx;
  background: #f1f5f9;
  font-size: 20rpx;
  font-weight: 700;
  color: #64748b;
}

.hero-status-done {
  background: #ecfdf5;
  color: #047857;
}

.hero-summary {
  display: block;
  margin-top: 18rpx;
  font-size: 25rpx;
  line-height: 1.75;
  color: #566070;
}

.hero-stats {
  display: flex;
  gap: 16rpx;
  margin-top: 22rpx;
}

.hero-stat {
  flex: 1;
  border-radius: 22rpx;
  background: #f8fafc;
  padding: 18rpx 20rpx;
}

.hero-stat-value {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #162033;
}

.hero-stat-label {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #475569;
  font-weight: 700;
}

.hero-stat-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 20rpx;
  line-height: 1.5;
  color: #7b8697;
}

.panel {
  margin: 24rpx;
  border-radius: 28rpx;
  background: #fff;
  padding: 28rpx;
  box-shadow: 0 14rpx 38rpx rgba(15, 23, 42, 0.05);
}

.panel-highlight {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18rpx;
}

.section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #162033;
}

.section-meta {
  font-size: 22rpx;
  color: #7b8697;
}

.analysis-lead {
  display: block;
  margin-top: 20rpx;
  font-size: 25rpx;
  line-height: 1.8;
  color: #374151;
}

.insight-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 20rpx;
}

.insight-grid-compact {
  gap: 14rpx;
}

.insight-card {
  border-radius: 22rpx;
  background: #ffffff;
  padding: 22rpx;
  border: 1rpx solid rgba(148, 163, 184, 0.16);
}

.insight-title {
  display: block;
  font-size: 24rpx;
  font-weight: 700;
  color: #16233a;
}

.insight-body {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.7;
  color: #5d6776;
}

/* ── 专业概览卡片（对齐 Web IntroDetailCard 编号徽章布局）── */
.overview-card-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 20rpx;
}

.overview-card {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  border-radius: 22rpx;
  background: #f9fbff;
  border: 1rpx solid rgba(148, 163, 184, 0.14);
  padding: 22rpx 24rpx;
}

.overview-card-badge {
  min-width: 52rpx;
  font-size: 32rpx;
  font-weight: 800;
  color: #14b8a6;
  line-height: 1;
  padding-top: 4rpx;
}

.overview-card-content {
  flex: 1;
}

.overview-card-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #16233a;
}

.overview-card-body {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.72;
  color: #64748b;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 20rpx;
}

.paragraph-group {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-top: 20rpx;
}

.paragraph-line {
  display: block;
  font-size: 25rpx;
  line-height: 1.82;
  color: #3b4758;
}

.tag {
  padding: 14rpx 22rpx;
  border-radius: 999rpx;
  background: #f3f7fb;
  font-size: 22rpx;
  color: #334155;
}

.tag-course {
  background: #edf6ff;
  color: #2563eb;
}

.tag-direction {
  background: #ecfdf5;
  color: #059669;
}

.tag-soft {
  background: #eef2ff;
  color: #4f46e5;
}

.tag-career {
  background: #fff7ed;
  color: #c2410c;
}

.detail-block {
  margin-top: 24rpx;
}

.detail-block:first-of-type {
  margin-top: 20rpx;
}

.detail-block-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #16233a;
}

.detail-block-intro {
  display: block;
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.7;
  color: #64748b;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-top: 18rpx;
}

.detail-card {
  border-radius: 24rpx;
  border: 1rpx solid rgba(148, 163, 184, 0.16);
  background: #f9fbff;
  padding: 24rpx;
}

.detail-card-accent {
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
}

.detail-card-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #16233a;
}

.detail-card-subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  color: #14b8a6;
  font-weight: 700;
}

.detail-card-body {
  display: block;
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.72;
  color: #556171;
}

.detail-tag-row {
  margin-top: 18rpx;
}

.task-box {
  margin-top: 18rpx;
  border-radius: 20rpx;
  background: rgba(20, 184, 166, 0.08);
  padding: 18rpx 20rpx;
}

.task-box-label {
  display: block;
  font-size: 20rpx;
  font-weight: 700;
  color: #0f766e;
}

.task-box-body {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: #34515a;
}

/* ── AI 棋类实验室主题（对齐 Web CourseTopicArticlePage 布局）── */
.chess-lab-topics {
  margin-top: 24rpx;
  border-top: 2rpx solid rgba(20, 184, 166, 0.18);
  padding-top: 24rpx;
}

.chess-lab-header {
  margin-bottom: 24rpx;
}

.chess-lab-header-label {
  display: block;
  font-size: 24rpx;
  font-weight: 800;
  color: #0f766e;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.chess-lab-header-sub {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: #64748b;
}

.chess-lab-topic {
  margin-bottom: 32rpx;
}

.chess-lab-topic:last-child {
  margin-bottom: 0;
}

.chess-lab-topic-head {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.chess-lab-topic-num {
  min-width: 48rpx;
  height: 48rpx;
  line-height: 48rpx;
  border-radius: 50%;
  background: rgba(20, 184, 166, 0.12);
  color: #0f766e;
  font-size: 22rpx;
  font-weight: 800;
  text-align: center;
}

.chess-lab-topic-title {
  font-size: 26rpx;
  font-weight: 700;
  color: #16233a;
  flex: 1;
}

.chess-lab-topic-body {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  padding-left: 64rpx;
}

.chess-lab-para {
  display: block;
  font-size: 23rpx;
  line-height: 1.85;
  color: #3b4758;
}

.direction-grid {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-top: 20rpx;
}

.direction-card {
  border-radius: 24rpx;
  background: #f8fbff;
  padding: 24rpx;
  border: 1rpx solid rgba(148, 163, 184, 0.12);
}

.direction-title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #102033;
}

.direction-fit {
  display: block;
  margin-top: 12rpx;
  font-size: 22rpx;
  line-height: 1.66;
  color: #4b5563;
}

.direction-section {
  margin-top: 18rpx;
}

.direction-label {
  display: block;
  font-size: 20rpx;
  font-weight: 700;
  color: #64748b;
}

.direction-copy {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  line-height: 1.68;
  color: #475569;
}

.career-row {
  margin-top: 20rpx;
}

.action-lead {
  margin-top: 12rpx;
}

.footer-actions {
  padding: 0 24rpx 36rpx;
}

.btn-primary {
  width: 100%;
  height: 84rpx;
  line-height: 84rpx;
  border-radius: 999rpx;
  border: none;
  font-size: 28rpx;
  font-weight: 700;
}

.btn-primary {
  background: linear-gradient(90deg, #14b8a6, #2563eb);
  color: #fff;
}

.btn-primary-full {
  display: block;
}

</style>
