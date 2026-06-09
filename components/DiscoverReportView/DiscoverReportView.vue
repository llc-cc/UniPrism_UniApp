<template>
  <scroll-view class="report-page" scroll-y>
    <view class="report-header-card">
      <text class="report-brand">RIASEC 兴潮罗盘</text>
      <text class="report-greeting">Hi，{{ nickname }} ~</text>
      <text class="report-subtitle">您的兴趣营结果</text>
      <view class="report-tags">
        <text v-for="(tag, idx) in topTags" :key="tag.dim" class="report-tag" :class="idx === 0 ? 'report-tag--a' : 'report-tag--b'">
          {{ tag.label }}
        </text>
      </view>
      <text class="report-intro">{{ introText }}</text>
    </view>

    <view class="report-section">
      <view class="section-head">
        <text class="section-icon">📊</text>
        <text class="section-title">能力维度</text>
      </view>
      <text class="section-text">{{ abilityText }}</text>
    </view>

    <view class="report-section">
      <view class="section-head">
        <text class="section-icon">🎯</text>
        <text class="section-title">职业倾向</text>
      </view>
      <text class="section-text">{{ tendencyText }}</text>
    </view>

    <view class="report-section">
      <view class="section-head">
        <text class="section-icon">🏅</text>
        <text class="section-title">推荐专业</text>
        <text class="section-badge">TOP3</text>
      </view>
      <view v-for="(major, idx) in majorRows" :key="major.id" class="rank-card" @tap="$emit('major-click', major.id)">
        <view class="rank-head">
          <text class="rank-name">{{ idx + 1 }}. {{ major.name }}</text>
          <text class="rank-score">匹配度 {{ major.score }}%</text>
        </view>
        <view class="rank-bar-track">
          <view class="rank-bar-fill" :style="{ width: major.score + '%' }" />
        </view>
        <text v-if="major.description" class="rank-desc">{{ major.description }}</text>
      </view>
    </view>

    <view class="report-section">
      <view class="section-head">
        <text class="section-icon">💼</text>
        <text class="section-title">推荐职业</text>
        <text class="section-badge">TOP5</text>
      </view>
      <view v-for="(career, idx) in careerRows" :key="career.id" class="rank-card">
        <view class="rank-head">
          <text class="rank-name">{{ idx + 1 }}. {{ career.name }}</text>
          <text class="rank-score">匹配度 {{ career.score }}%</text>
        </view>
        <view class="rank-bar-track">
          <view class="rank-bar-fill rank-bar-fill--career" :style="{ width: career.score + '%' }" />
        </view>
        <text v-if="career.description" class="rank-desc">{{ career.description }}</text>
      </view>
    </view>

    <view class="report-section report-section--summary">
      <text class="section-title">综合建议</text>
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
      <button class="btn-primary" @tap="$emit('go-major')">体验推荐专业 →</button>
    </view>
  </scroll-view>
</template>

<script>
import { DIMENSION_DESCRIPTIONS } from '../../business/riasecEngine'

function clampScore(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(60, Math.min(99, Math.round(n)))
}

export default {
  name: 'DiscoverReportView',
  props: {
    profile: { type: Object, required: true },
    majors: { type: Array, default: () => [] },
    report: { type: Object, default: null },
    nickname: { type: String, default: '同学' },
  },
  emits: ['major-click', 'restart', 'go-major'],
  computed: {
    topTags() {
      const dims = (this.profile && this.profile.topDimensions) || []
      return dims.slice(0, 2).map((dim) => ({
        dim,
        label: (DIMENSION_DESCRIPTIONS[dim] && DIMENSION_DESCRIPTIONS[dim].label) || dim,
      }))
    },
    introText() {
      if (this.report && this.report.summary) return this.report.summary
      return (this.profile && this.profile.description) || ''
    },
    abilityText() {
      const items = this.report && Array.isArray(this.report.personality) ? this.report.personality.slice(0, 3) : []
      if (items.length) {
        return items.map((item) => `${item.trait}：${item.evidence}`).join('；')
      }
      const dims = (this.profile && this.profile.topDimensions) || []
      const first = DIMENSION_DESCRIPTIONS[dims[0]]
      const second = DIMENSION_DESCRIPTIONS[dims[1]]
      if (!first || !second) return this.profile.description || ''
      return `你在${first.label}和${second.label}上表现更突出。${first.description}；同时${second.description}。`
    },
    tendencyText() {
      if (this.report && this.report.riasec && this.report.riasec.interpretation) {
        return this.report.riasec.interpretation
      }
      return (this.profile && this.profile.description) || ''
    },
    majorRows() {
      const reportById = new Map(
        ((this.report && this.report.recommendedMajors) || []).map((item) => [item.majorId, item]),
      )
      return (this.majors || []).slice(0, 3).map((major, index) => {
        const fromReport = reportById.get(major.majorId)
        return {
          id: major.majorId,
          name: major.name,
          score: clampScore(major.matchScore, 90 - index * 4),
          description: (fromReport && fromReport.reason) || major.description || '',
        }
      })
    },
    careerRows() {
      const generated = ((this.report && this.report.recommendedCareers) || []).slice(0, 5).map((career, index) => ({
        id: career.careerId || `career-${index}`,
        name: career.name,
        score: clampScore(career.matchScore, 91 - index * 2),
        description: career.reason || '',
      }))
      if (generated.length >= 3) return generated.slice(0, 3)
      return generated
    },
    growthList() {
      return Array.isArray(this.report && this.report.growthPlan) ? this.report.growthPlan.slice(0, 4) : []
    },
    summaryText() {
      if (this.growthList.length) {
        const tasks = this.growthList.map((item) => `第 ${item.week} 周：${item.task}`).join('；')
        return `${this.report.summary || ''} 接下来可以按小步验证推进：${tasks}。`.trim()
      }
      const majorText = this.majorRows.map((item) => item.name).join('、')
      return `${this.profile.description || ''} 当前推荐优先从${majorText || '匹配专业'}开始探索。`
    },
    disclaimer() {
      return (this.report && this.report.disclaimer) || ''
    },
  },
}
</script>

<style scoped>
.report-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #efe6ff 0%, #f7f8fb 38%, #f7f8fb 100%);
  padding: 24rpx 24rpx 48rpx;
  box-sizing: border-box;
}
.report-header-card,
.report-section {
  background: #fff;
  border-radius: 50rpx;
  box-shadow: 0 8rpx 64rpx rgba(0, 0, 0, 0.05);
  padding: 36rpx 32rpx;
  margin-bottom: 24rpx;
}
.report-brand { display: block; font-size: 24rpx; color: #6b23ff; font-weight: 700; }
.report-greeting { display: block; margin-top: 20rpx; font-size: 52rpx; color: #283248; font-weight: 700; }
.report-subtitle { display: block; margin-top: 8rpx; font-size: 28rpx; color: #687184; }
.report-tags { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 28rpx; }
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
.rank-card {
  margin-top: 20rpx;
  padding: 24rpx;
  border-radius: 28rpx;
  background: #f8fafc;
  border: 2rpx solid #eef2f7;
}
.rank-head { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
.rank-name { flex: 1; font-size: 30rpx; font-weight: 700; color: #283248; }
.rank-score { font-size: 26rpx; font-weight: 700; color: #6b23ff; }
.rank-bar-track {
  margin-top: 16rpx;
  height: 12rpx;
  border-radius: 999rpx;
  background: #e5e7eb;
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
.report-section--summary { background: #f8fafc; }
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
  border: 2rpx solid #e5e7eb;
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
