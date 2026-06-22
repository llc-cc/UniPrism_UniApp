<template>
  <view class="progress-panel">
    <view v-for="s in stages" :key="s.id" class="card">
      <text class="stage-label">{{ s.label }}</text>
      <view class="bar-wrap">
        <view class="bar-fill" :style="{ width: s.pct + '%' }" />
        <text class="bar-text">{{ s.answered }}/{{ s.total }}</text>
      </view>
    </view>
    <view class="card">
      <text class="stage-label">生成报告</text>
      <view class="bar-wrap bar-wrap--report" @tap="canReport && goReport()">
        <text class="bar-text bar-text--report" :class="{ 'bar-text--active': canReport }">点击查看</text>
      </view>
    </view>
  </view>
</template>

<script>
import { loadDiscoverSession } from '../../business/discover-session'
import { SCREEN_QUESTION_IDS } from '../../business/discover-chat-screens'
import {
  FINAL_CAREER_CALIBRATION_QUESTION_IDS,
  MBTI_KNOWN_QUESTION_ID,
  computePreCareerRiasecTopDimensions,
  getHollandFineQuestionIdsForDimensions,
} from '../../business/discover-questions'
import { isDiscoveryCompleted } from '../../business/interest-progress-snapshot'

const unique = (items) => [...new Set(items.filter(Boolean))]

const PERSONALITY_IDS = unique([
  ...(SCREEN_QUESTION_IDS['personality-1'] || []),
  ...(SCREEN_QUESTION_IDS['personality-2'] || []),
  ...(SCREEN_QUESTION_IDS['personality-3'] || []),
  ...(SCREEN_QUESTION_IDS['personality-4'] || []),
])
const CAREER_IDS = unique([
  ...(SCREEN_QUESTION_IDS['personality-holland-1'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-2'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-3'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-4'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-5'] || []),
  ...(SCREEN_QUESTION_IDS['personality-holland-6'] || []),
])

function hasAnswer(answer) {
  if (!answer || !answer.questionId) return false
  const v = answer.value
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  if (v && typeof v === 'object') return Object.keys(v).length > 0
  return v !== undefined && v !== null
}

export default {
  name: 'ProgressPanel',
  props: {
    active: { type: Boolean, default: false },
  },
  emits: ['go-report'],
  data() {
    return { stages: [], canReport: false }
  },
  watch: {
    active: {
      immediate: true,
      handler(value) {
        if (value) this.refresh()
      },
    },
  },
  methods: {
    refresh() {
      const session = loadDiscoverSession()
      const answers = session.answers || []
      const answered = new Set(answers.filter(hasAnswer).map((a) => a.questionId).filter(Boolean))

      const personalityAnswered = answered.has(MBTI_KNOWN_QUESTION_ID)
        ? PERSONALITY_IDS.length
        : PERSONALITY_IDS.filter((id) => answered.has(id)).length
      const personalityTotal = PERSONALITY_IDS.length || 20

      const careerAnswered = CAREER_IDS.filter((id) => answered.has(id)).length
      const careerTotal = CAREER_IDS.length || 20

      const topDims = computePreCareerRiasecTopDimensions(answers, 2)
      const deepIds = unique([
        ...(topDims.length > 0 ? getHollandFineQuestionIdsForDimensions(topDims) : []),
        ...(FINAL_CAREER_CALIBRATION_QUESTION_IDS || []),
      ])
      const deepAnswered = deepIds.filter((id) => answered.has(id)).length
      const deepTotal = deepIds.length || 20

      this.stages = [
        { id: 'personality', label: '阶段一：性格测试', answered: personalityAnswered, total: personalityTotal, pct: Math.round((personalityAnswered / personalityTotal) * 100) },
        { id: 'career', label: '阶段二：职业测试', answered: careerAnswered, total: careerTotal, pct: Math.round((careerAnswered / careerTotal) * 100) },
        { id: 'deep', label: '阶段三：深度测评', answered: deepAnswered, total: deepTotal, pct: Math.round((deepAnswered / deepTotal) * 100) },
      ]
      this.canReport = isDiscoveryCompleted(session)
    },
    goReport() {
      this.$emit('go-report')
    },
  },
}
</script>

<style scoped>
.progress-panel {
  width: 100%;
}
.card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 32rpx 28rpx 28rpx;
  margin-bottom: 20rpx;
}
.card:last-child {
  margin-bottom: 0;
}
.stage-label {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #1c1c3a;
  margin-bottom: 20rpx;
}
.bar-wrap {
  position: relative;
  height: 52rpx;
  border-radius: 12rpx;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #d0c4ff;
  border-radius: 12rpx;
  transition: width 0.3s;
}
.bar-text {
  position: relative;
  font-size: 24rpx;
  color: #8b93a3;
  z-index: 1;
}
.bar-wrap--report {
  background: #f0f0f0;
}
.bar-text--report {
  font-size: 26rpx;
}
.bar-text--active {
  color: #9762ff;
  font-weight: 700;
}
</style>
