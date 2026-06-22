<template>
  <scroll-view class="report-page" scroll-y>
    <view class="report-header-card">
      <text class="report-brand">RIASEC 兴潮罗盘</text>
      <text class="report-greeting">Hi，{{ nickname }} ~</text>
      <text class="report-subtitle">您的兴趣营结果</text>
      <ChatAssetImage
        :path="headerImagePath"
        mode="aspectFit"
        image-class="report-hero-image"
        wrap-class="report-hero-wrap"
        label="报告主视觉"
        :show-path-hint="0"
      />
      <view class="report-tags">
        <text v-for="(tag, idx) in topTags" :key="tag.dim" class="report-tag" :class="idx === 0 ? 'report-tag--a' : 'report-tag--b'">
          {{ tag.label }}
        </text>
      </view>
      <text class="report-code">兴趣代码：{{ reportCodeLabel }}</text>
      <text class="report-intro">{{ introText }}</text>
    </view>

    <view class="report-section report-section--compass">
      <view class="section-head">
        <text class="section-icon">🧭</text>
        <text class="section-title">兴趣罗盘</text>
      </view>
      <ChatAssetImage
        :path="compassImagePath"
        mode="aspectFit"
        image-class="compass-image"
        wrap-class="compass-image-wrap"
        label="兴趣罗盘"
        :show-path-hint="0"
      />
      <text class="section-text">{{ compassIntro }}</text>
    </view>

    <view class="report-section">
      <view class="section-head">
        <text class="section-icon">📊</text>
        <text class="section-title">{{ analysisTitle }}</text>
      </view>
      <view v-for="block in analysisBlocks" :key="block.eyebrow + block.title" class="analysis-card">
        <text class="analysis-eyebrow">{{ block.eyebrow }}</text>
        <text class="analysis-title">{{ block.title }}</text>
        <text class="section-text">{{ block.body }}</text>
      </view>
    </view>

    <view class="report-section">
      <view class="section-head">
        <text class="section-icon">🏅</text>
        <text class="section-title">推荐专业</text>
        <text class="section-badge">TOP3</text>
      </view>
      <view v-for="(major, idx) in majorRows" :key="major.id" class="rank-card">
        <view class="rank-visual-row">
          <ChatAssetImage
            :path="major.iconPath || defaultMajorImagePath"
            mode="aspectFit"
            image-class="rank-icon-image"
            wrap-class="rank-icon-wrap"
            :label="major.name"
            :show-path-hint="0"
          />
          <view class="rank-main">
            <view class="rank-head">
              <text class="rank-name">{{ idx + 1 }}. {{ major.name }}</text>
              <text class="rank-score">匹配度 {{ major.score }}%</text>
            </view>
            <view class="rank-bar-track">
              <view class="rank-bar-fill" :style="{ width: major.score + '%' }" />
            </view>
          </view>
        </view>
        <text v-if="major.description" class="rank-desc">{{ major.description }}</text>
      </view>
    </view>

    <view class="report-section">
      <view class="section-head">
        <text class="section-icon">💼</text>
        <text class="section-title">推荐职业</text>
        <text class="section-badge">TOP3</text>
      </view>
      <view v-for="(career, idx) in careerRows" :key="career.id" class="rank-card">
        <view class="rank-visual-row">
          <ChatAssetImage
            :path="career.iconPath || defaultCareerImagePath"
            mode="aspectFit"
            image-class="rank-icon-image"
            wrap-class="rank-icon-wrap rank-icon-wrap--career"
            :label="career.name"
            :show-path-hint="0"
          />
          <view class="rank-main">
            <view class="rank-head">
              <text class="rank-name">{{ idx + 1 }}. {{ career.name }}</text>
              <text class="rank-score">匹配度 {{ career.score }}%</text>
            </view>
            <view class="rank-bar-track">
              <view class="rank-bar-fill rank-bar-fill--career" :style="{ width: career.score + '%' }" />
            </view>
          </view>
        </view>
        <text v-if="career.description" class="rank-desc">{{ career.description }}</text>
      </view>
    </view>

    <view class="report-section report-section--summary">
      <text class="section-title">{{ summaryTitle }}</text>
      <text class="section-text">{{ summaryText }}</text>
      <view v-if="growthList.length" class="growth-list">
        <view v-for="item in growthList" :key="item.week" class="growth-item">
          <text class="growth-week">第 {{ item.week }} 周</text>
          <text class="growth-task">{{ item.task }}</text>
        </view>
      </view>
      <text v-if="disclaimer" class="disclaimer">{{ disclaimer }}</text>
    </view>

    <view class="action-row">
      <button class="btn-ghost" @tap="$emit('restart')">重新测试</button>
      <button class="btn-primary" @tap="$emit('go-home')">返回首页</button>
    </view>
  </scroll-view>
</template>

<script>
import { DIMENSION_DESCRIPTIONS } from '../../business/riasecEngine'
import ChatAssetImage from '../ChatAssetImage/ChatAssetImage.vue'

const REPORT_HEADER_IMAGE = '/explore-static/discover/figma/report/report-v2-summary-image-69.png'
const REPORT_COMPASS_IMAGE = '/explore-static/discover/figma/report/report-v2-compass-image-63.png'
const REPORT_DEFAULT_MAJOR_IMAGE = '/explore-static/discover/figma/report/major-check-circle.svg'
const REPORT_DEFAULT_CAREER_IMAGE = '/explore-static/discover/figma/report/career-icon.svg'

function clampScore(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(60, Math.min(99, Math.round(n)))
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function joinReadableParts(parts) {
  return parts.map(normalizeText).filter(Boolean).join(' ')
}

function formatProfileSummaryLongText(items) {
  return joinReadableParts((items || []).map((item) => {
    if (!item || !item.title || !item.detail) return ''
    return `${item.title}：${item.detail}`
  }))
}

function dimensionsFromReportCode(code) {
  return String(code || '')
    .toUpperCase()
    .split('')
    .filter((item, index, list) => DIMENSION_DESCRIPTIONS[item] && list.indexOf(item) === index)
    .slice(0, 2)
}

function buildExpandedReportDetailModel(report) {
  if (!report) return null

  const structuredAnalysis = report.personalityAndCareerAnalysis
  if (structuredAnalysis && report.majorRecommendations && report.careerRecommendations && report.comprehensiveAdvice) {
    return {
      analysisTitle: structuredAnalysis.title || '人格与职业倾向分析',
      analysisBlocks: [
        {
          eyebrow: '职业倾向分析',
          title: structuredAnalysis.careerTendencyAnalysis && structuredAnalysis.careerTendencyAnalysis.title,
          body: structuredAnalysis.careerTendencyAnalysis && structuredAnalysis.careerTendencyAnalysis.body,
        },
        {
          eyebrow: '性格测试结果',
          title: structuredAnalysis.personalityTestResult && structuredAnalysis.personalityTestResult.title,
          body: structuredAnalysis.personalityTestResult && structuredAnalysis.personalityTestResult.body,
        },
        {
          eyebrow: '综合人格画像',
          title: structuredAnalysis.integratedPersona && structuredAnalysis.integratedPersona.title,
          body: structuredAnalysis.integratedPersona && structuredAnalysis.integratedPersona.body,
        },
      ].filter((item) => normalizeText(item.title) || normalizeText(item.body)),
      profilePortrait: structuredAnalysis.integratedPersona || null,
      majorExperience: (report.majorRecommendations.majors || []).map((item) => ({
        id: item.majorId,
        name: item.name,
        body: item.personalizedReason,
      })),
      careerRecommendations: (report.careerRecommendations.careers || []).map((item) => ({
        id: item.careerId,
        name: item.name,
        body: item.personalizedReason,
      })),
      comprehensiveAdvice: {
        title: report.comprehensiveAdvice.title || '综合建议',
        body: report.comprehensiveAdvice.developmentAdvice || '',
        disclaimer: report.comprehensiveAdvice.disclaimer || '',
      },
    }
  }

  const expanded = report.expandedReport
  if (expanded) {
    return {
      analysisTitle: '人格与职业倾向分析',
      analysisBlocks: [
        {
          eyebrow: '人物画像',
          title: expanded.profilePortrait && expanded.profilePortrait.title,
          body: expanded.profilePortrait && expanded.profilePortrait.body,
        },
        {
          eyebrow: '个性化建议',
          title: expanded.personalityAdvice && expanded.personalityAdvice.title,
          body: expanded.personalityAdvice && expanded.personalityAdvice.body,
        },
      ].filter((item) => normalizeText(item.title) || normalizeText(item.body)),
      profilePortrait: expanded.profilePortrait || null,
      majorExperience: (expanded.majorExperience || []).map((item) => ({
        id: item.majorId,
        name: item.name,
        body: item.body,
        nextAction: item.nextAction,
      })),
      careerRecommendations: (expanded.careerRecommendations || []).map((item) => ({
        id: item.careerId,
        name: item.name,
        body: item.body,
        nextAction: item.nextAction,
      })),
      comprehensiveAdvice: {
        title: (expanded.growthPath && expanded.growthPath.title) || '综合建议',
        body: (expanded.growthPath && expanded.growthPath.body) || '',
        disclaimer: report.disclaimer || '',
      },
    }
  }

  return {
    analysisTitle: '人格与职业倾向分析',
    analysisBlocks: [
      {
        eyebrow: '人物画像',
        title: '人物画像',
        body: joinReadableParts([
          report.summary,
          formatProfileSummaryLongText(report.profileSummary && report.profileSummary.personalityTraits),
        ]),
      },
      {
        eyebrow: '个性化建议',
        title: '个性化建议',
        body: joinReadableParts([
          report.riasec && report.riasec.interpretation,
          formatProfileSummaryLongText(report.profileSummary && report.profileSummary.growthEdges),
        ]),
      },
    ].filter((item) => normalizeText(item.body)),
    profilePortrait: {
      title: '人物画像',
      body: joinReadableParts([
        report.summary,
        formatProfileSummaryLongText(report.profileSummary && report.profileSummary.personalityTraits),
      ]),
    },
    majorExperience: (report.recommendedMajors || []).slice(0, 3).map((item) => ({
      id: item.majorId,
      name: item.name,
      body: joinReadableParts([item.reason, item.knowledgeReason]),
      nextAction: item.nextAction,
    })),
    careerRecommendations: (report.recommendedCareers || []).slice(0, 3).map((item) => ({
      id: item.careerId,
      name: item.name,
      body: joinReadableParts([item.reason, item.knowledgeReason]),
      nextAction: item.nextAction,
    })),
    comprehensiveAdvice: {
      title: '综合建议',
      body: joinReadableParts([
        (report.growthPlan || []).map((item) => `第${item.week}周：${item.task}`).join(' '),
        report.disclaimer,
      ]),
      disclaimer: report.disclaimer || '',
    },
  }
}

export default {
  name: 'DiscoverReportView',
  components: { ChatAssetImage },
  props: {
    profile: { type: Object, required: true },
    majors: { type: Array, default: () => [] },
    report: { type: Object, default: null },
    nickname: { type: String, default: '同学' },
  },
  emits: ['restart', 'go-home'],
  computed: {
    displayTopDimensions() {
      const reportDims = dimensionsFromReportCode(this.report && this.report.riasec && this.report.riasec.code)
      if (reportDims.length) return reportDims
      return (this.profile && this.profile.topDimensions) || []
    },
    topTags() {
      const dims = this.displayTopDimensions
      return dims.slice(0, 2).map((dim) => ({
        dim,
        label: (DIMENSION_DESCRIPTIONS[dim] && DIMENSION_DESCRIPTIONS[dim].label) || dim,
      }))
    },
    reportCodeLabel() {
      const code = (this.report && this.report.riasec && this.report.riasec.code) || this.displayTopDimensions.join('')
      return code || 'IC'
    },
    headerImagePath() {
      return REPORT_HEADER_IMAGE
    },
    compassImagePath() {
      return REPORT_COMPASS_IMAGE
    },
    defaultMajorImagePath() {
      return REPORT_DEFAULT_MAJOR_IMAGE
    },
    defaultCareerImagePath() {
      return REPORT_DEFAULT_CAREER_IMAGE
    },
    detailModel() {
      return buildExpandedReportDetailModel(this.report)
    },
    compassIntro() {
      const labels = this.topTags.map((item) => item.label)
      const primary = labels[0] || '研究型'
      const secondary = labels[1] || '常规型'
      const interpretation = normalizeText(this.report && this.report.riasec && this.report.riasec.interpretation)
      return `${primary} 与 ${secondary} 是你当前最突出的兴趣方向。${interpretation || '它们共同构成了你当前的探索主轴。'}`
    },
    introText() {
      const portrait = this.detailModel && this.detailModel.profilePortrait
      if (portrait && portrait.body) return portrait.body
      if (this.report && this.report.summary) return this.report.summary
      return ''
    },
    analysisTitle() {
      return (this.detailModel && this.detailModel.analysisTitle) || '人格与职业倾向分析'
    },
    analysisBlocks() {
      const blocks = (this.detailModel && this.detailModel.analysisBlocks) || []
      if (blocks.length) return blocks
      if (this.report && this.report.riasec && this.report.riasec.interpretation) {
        return [{
          eyebrow: '职业倾向分析',
          title: '职业倾向',
          body: this.report.riasec.interpretation,
        }]
      }
      return []
    },
    majorRows() {
      const reportMajors = (this.report && this.report.recommendedMajors) || []
      const scoreById = new Map(
        reportMajors.map((item, index) => [item.majorId, clampScore(item.matchScore, 90 - index * 4)]),
      )
      const structured = ((this.detailModel && this.detailModel.majorExperience) || []).slice(0, 3).map((item, index) => ({
        id: item.id,
        name: item.name,
        score: scoreById.get(item.id) || (90 - index * 4),
        description: item.body || item.nextAction || '',
        iconPath: (reportMajors.find((major) => major.majorId === item.id) || {}).iconPath || '',
      }))
      if (structured.length) return structured
      return reportMajors.slice(0, 3).map((major, index) => ({
        id: major.majorId,
        name: major.name,
        score: clampScore(major.matchScore, 90 - index * 4),
        description: major.reason || '',
        iconPath: major.iconPath || '',
      }))
    },
    careerRows() {
      const structured = ((this.detailModel && this.detailModel.careerRecommendations) || []).slice(0, 3).map((career, index) => ({
        id: career.id || `career-${index}`,
        name: career.name,
        score: clampScore(
          (((this.report && this.report.recommendedCareers) || []).find((item) => item.careerId === career.id) || {}).matchScore,
          91 - index * 2,
        ),
        description: career.body || career.nextAction || '',
        iconPath: (((this.report && this.report.recommendedCareers) || []).find((item) => item.careerId === career.id) || {}).iconPath || '',
      }))
      if (structured.length) return structured

      const generated = ((this.report && this.report.recommendedCareers) || []).slice(0, 5).map((career, index) => ({
        id: career.careerId || `career-${index}`,
        name: career.name,
        score: clampScore(career.matchScore, 91 - index * 2),
        description: career.reason || '',
        iconPath: career.iconPath || '',
      }))
      if (generated.length >= 3) return generated.slice(0, 3)
      return generated
    },
    growthList() {
      return Array.isArray(this.report && this.report.growthPlan) ? this.report.growthPlan.slice(0, 4) : []
    },
    summaryTitle() {
      return (this.detailModel && this.detailModel.comprehensiveAdvice && this.detailModel.comprehensiveAdvice.title) || '综合建议'
    },
    summaryText() {
      const detailed = this.detailModel && this.detailModel.comprehensiveAdvice && this.detailModel.comprehensiveAdvice.body
      if (detailed) return detailed
      if (this.growthList.length) {
        const tasks = this.growthList.map((item) => `第 ${item.week} 周：${item.task}`).join('；')
        return `${this.report.summary || ''} 接下来可以按小步验证推进：${tasks}。`.trim()
      }
      return (this.report && this.report.summary) || ''
    },
    disclaimer() {
      const detailed = this.detailModel && this.detailModel.comprehensiveAdvice && this.detailModel.comprehensiveAdvice.disclaimer
      return detailed || (this.report && this.report.disclaimer) || ''
    },
  },
}
</script>

<style scoped>
.report-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #efe6ff 0%, #f7f3ff 22%, #f7f8fb 44%, #f7f8fb 100%);
  padding: 24rpx 24rpx 48rpx;
  box-sizing: border-box;
}
.report-header-card,
.report-section {
  background: #fff;
  border-radius: 40rpx;
  box-shadow: 0 16rpx 56rpx rgba(15, 23, 42, 0.08);
  padding: 36rpx 32rpx;
  margin-bottom: 24rpx;
}
.report-brand { display: block; font-size: 24rpx; color: #6b23ff; font-weight: 700; }
.report-greeting { display: block; margin-top: 20rpx; font-size: 52rpx; color: #283248; font-weight: 700; }
.report-subtitle { display: block; margin-top: 8rpx; font-size: 28rpx; color: #687184; }
.report-hero-wrap { margin-top: 28rpx; min-height: 260rpx; border-radius: 28rpx; overflow: hidden; background: linear-gradient(180deg, #f6f0ff 0%, #ffffff 100%); }
.report-hero-image { width: 100%; height: 260rpx; display: block; }
.report-tags { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 28rpx; }
.report-code { display: block; margin-top: 20rpx; font-size: 24rpx; color: #6b23ff; font-weight: 700; }
.report-tag {
  padding: 10rpx 24rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 700;
}
.report-tag--a { background: #ffde3e; color: #4f2db8; }
.report-tag--b { background: #ffb347; color: #7c3a00; }
.report-intro {
  display: block;
  margin-top: 28rpx;
  font-size: 28rpx;
  line-height: 1.85;
  color: #4b5563;
}
.report-section--compass { overflow: hidden; }
.compass-image-wrap { margin-top: 16rpx; min-height: 320rpx; border-radius: 28rpx; overflow: hidden; background: linear-gradient(180deg, #f9f6ff 0%, #ffffff 100%); }
.compass-image { width: 100%; height: 320rpx; display: block; }
.section-head { display: flex; align-items: center; gap: 12rpx; margin-bottom: 20rpx; }
.section-icon { font-size: 36rpx; }
.section-title { font-size: 36rpx; font-weight: 700; color: #283248; flex: 1; }
.section-badge {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: #6b23ff;
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
}
.section-text {
  display: block;
  font-size: 28rpx;
  line-height: 1.85;
  color: #4b5563;
}
.analysis-card {
  margin-top: 20rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #fbfaff 0%, #ffffff 100%);
  border: 2rpx solid #efe8ff;
}
.analysis-eyebrow {
  display: block;
  font-size: 22rpx;
  line-height: 1.5;
  color: #007a66;
  font-weight: 700;
}
.analysis-title {
  display: block;
  margin-top: 10rpx;
  font-size: 30rpx;
  line-height: 1.45;
  color: #283248;
  font-weight: 700;
}
.rank-card {
  margin-top: 20rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #fbfaff 0%, #ffffff 100%);
  border: 2rpx solid #efe8ff;
}
.rank-visual-row { display: flex; align-items: center; gap: 20rpx; }
.rank-icon-wrap { width: 112rpx; min-width: 112rpx; height: 112rpx; min-height: 112rpx; border-radius: 24rpx; overflow: hidden; background: linear-gradient(180deg, #f2ebff 0%, #ffffff 100%); }
.rank-icon-wrap--career { background: linear-gradient(180deg, #fff6dd 0%, #ffffff 100%); }
.rank-icon-image { width: 112rpx; height: 112rpx; display: block; }
.rank-main { flex: 1; min-width: 0; }
.rank-head { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
.rank-name { flex: 1; font-size: 30rpx; font-weight: 700; color: #283248; }
.rank-score { font-size: 26rpx; font-weight: 700; color: #6b23ff; }
.rank-bar-track {
  margin-top: 16rpx;
  height: 12rpx;
  border-radius: 999rpx;
  background: #ece8f8;
  overflow: hidden;
}
.rank-bar-fill {
  height: 100%;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #6b23ff, #9762ff);
}
.rank-bar-fill--career { background: linear-gradient(90deg, #ffde3e, #ffb347); }
.rank-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  line-height: 1.7;
  color: #687184;
}
.report-section--summary { background: linear-gradient(180deg, #faf7ff 0%, #ffffff 100%); }
.growth-list { margin-top: 24rpx; display: flex; flex-direction: column; gap: 16rpx; }
.growth-item { display: flex; gap: 16rpx; }
.growth-week { width: 120rpx; font-size: 24rpx; color: #6b23ff; font-weight: 700; flex-shrink: 0; }
.growth-task { flex: 1; font-size: 24rpx; line-height: 1.7; color: #4b5563; }
.disclaimer {
  display: block;
  margin-top: 24rpx;
  font-size: 22rpx;
  line-height: 1.6;
  color: #9ca3af;
}
.action-row { display: flex; gap: 16rpx; padding-top: 8rpx; }
.btn-ghost {
  flex: 1;
  background: #fff;
  color: #6b7280;
  border: 2rpx solid #ece8f8;
  border-radius: 48rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 26rpx;
}
.btn-primary {
  flex: 2;
  background: linear-gradient(90deg, #6b23ff, #9762ff);
  color: #fff;
  border: none;
  border-radius: 48rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 26rpx;
  font-weight: 600;
}
</style>
