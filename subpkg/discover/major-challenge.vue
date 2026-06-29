<template>
  <view class="page" :style="{ '--accent': accent }">
    <view class="header">
      <text class="seq">{{ taskLabel }} · {{ module.source }}</text>
      <text class="title">{{ module.title }}</text>
      <text class="subtitle">{{ module.subtitle }}</text>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: `${submitted ? progress : 12}%` }" />
      </view>
    </view>

    <scroll-view class="body" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation>
      <view class="card">
        <text class="card-label">任务：形成一条可复核判断链</text>
        <text class="card-goal">{{ interaction.goal }}</text>

        <view id="anchor-input" class="field">
          <text class="field-label">先确认哪个输入对象？</text>
          <picker :range="interaction.inputs" :value="inputIndex" @change="onInputChange">
            <view class="picker-value" :class="{ 'picker-value--err': fieldErrors.input }">{{ selectedInput || '请选择' }}</view>
          </picker>
        </view>

        <view id="anchor-action" class="field">
          <text class="field-label">下一步专业动作？</text>
          <picker :range="interaction.actions" :value="actionIndex" @change="onActionChange">
            <view class="picker-value" :class="{ 'picker-value--err': fieldErrors.action }">{{ selectedAction || '请选择' }}</view>
          </picker>
        </view>

        <view id="anchor-feedback" class="field">
          <text class="field-label">最可能的错误来源？</text>
          <picker :range="interaction.feedback" :value="feedbackIndex" @change="onFeedbackChange">
            <view class="picker-value" :class="{ 'picker-value--err': fieldErrors.feedback }">{{ selectedFeedback || '请选择' }}</view>
          </picker>
        </view>

        <view class="field">
          <view class="slider-head">
            <text class="field-label">证据可信度</text>
            <text class="slider-value">{{ evidenceStrength }}%</text>
          </view>
          <slider
            :value="evidenceStrength"
            min="20"
            max="100"
            activeColor="#007a66"
            block-size="18"
            @changing="onEvidenceChanging"
            @change="onEvidenceChange"
          />
        </view>

        <button class="btn-submit" @tap="submit">提交诊断</button>
        <view v-if="validationMessage" class="validation-banner">
          <text class="validation-banner__text">{{ validationMessage }}</text>
        </view>
      </view>

      <view class="card feedback-card">
        <text class="card-label">系统反馈</text>
        <text class="score">{{ submitted ? stars : 0 }}/4</text>
        <view v-for="item in scoreItems" :key="item.label" class="score-row">
          <text class="score-mark">{{ submitted ? (item.ok ? '✓' : '✕') : '·' }}</text>
          <text class="score-text">{{ item.label }}</text>
        </view>
        <text :class="'result-text ' + (submitted && complete ? 'result-ok' : '')">
          {{ resultMessage }}
        </text>
      </view>
    </scroll-view>

    <view class="footer">
      <button class="btn-ghost" @tap="goBack">返回体验</button>
      <button class="btn-primary" :disabled="!submitted || !complete" @tap="finish">完成并返回</button>
    </view>
  </view>
</template>

<script>
import { getMajorChallengeModule, normalizeMajorChallengeTask, getMajorChallengeKey } from './business/major-challenge-utils'
import { markMajorChallengeCompleted } from './business/major-challenge-progress'
import { markMajorChallengeVisited } from './business/major-progress'
import { MAJOR_CHALLENGE_TASK_LABELS } from './business/major-config'

export default {
  data() {
    return {
      majorId: '',
      moduleId: '',
      task: 'model',
      module: null,
      interaction: { inputs: [], actions: [], feedback: [], goal: '', output: '' },
      selectedInput: '',
      selectedAction: '',
      selectedFeedback: '',
      evidenceStrength: 64,
      submitted: false,
      accent: '#007a66',
      fieldErrors: {},
      validationMessage: '',
      scrollIntoView: '',
    }
  },
  computed: {
    taskLabel() {
      return MAJOR_CHALLENGE_TASK_LABELS[this.task] || '专业挑战'
    },
    inputIndex() {
      const index = this.interaction.inputs.indexOf(this.selectedInput)
      return index >= 0 ? index : 0
    },
    actionIndex() {
      const index = this.interaction.actions.indexOf(this.selectedAction)
      return index >= 0 ? index : 0
    },
    feedbackIndex() {
      const index = this.interaction.feedback.indexOf(this.selectedFeedback)
      return index >= 0 ? index : 0
    },
    inputOk() {
      return this.selectedInput === this.interaction.inputs[0]
    },
    actionOk() {
      return this.selectedAction === this.interaction.actions[0]
    },
    feedbackOk() {
      return this.selectedFeedback === this.interaction.feedback[0]
    },
    evidenceOk() {
      return this.evidenceStrength >= 55 && this.evidenceStrength <= 88
    },
    stars() {
      return [this.inputOk, this.actionOk, this.feedbackOk, this.evidenceOk].filter(Boolean).length
    },
    progress() {
      return Math.round((this.stars / 4) * 100)
    },
    complete() {
      return this.stars >= 3
    },
    scoreItems() {
      return [
        { label: '输入对象', ok: this.inputOk },
        { label: '专业动作', ok: this.actionOk },
        { label: '错误定位', ok: this.feedbackOk },
        { label: '可信度范围', ok: this.evidenceOk },
      ]
    },
    resultMessage() {
      if (!this.submitted) return '提交后会检查你的判断链，而不是只判断单个答案。'
      if (this.complete) return `挑战通过。可以产出：${this.interaction.output}`
      return '还没有形成稳定判断链。请回到输入对象、动作顺序和错误反馈重新匹配。'
    },
  },
  onLoad(options) {
    this.majorId = (options && options.majorId) || ''
    this.moduleId = (options && options.moduleId) || ''
    this.task = normalizeMajorChallengeTask((options && options.task) || 'model')
    this.module = getMajorChallengeModule(this.majorId, this.moduleId, this.task)
    if (!this.module) {
      uni.showToast({ title: '挑战内容不存在', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 700)
      return
    }
    this.interaction = this.module.interaction || this.interaction
    this.selectedInput = ''
    this.selectedAction = ''
    this.selectedFeedback = ''
    this.evidenceStrength = this.task === 'report' ? 74 : 64
    uni.setNavigationBarTitle({ title: this.taskLabel })
  },
  methods: {
    clearFieldError(fieldKey) {
      if (!this.fieldErrors[fieldKey]) return
      const next = { ...this.fieldErrors }
      delete next[fieldKey]
      this.fieldErrors = next
      if (!Object.keys(next).length) this.validationMessage = ''
    },
    scrollToAnchor(anchorId) {
      this.scrollIntoView = ''
      this.$nextTick(() => {
        this.scrollIntoView = anchorId
      })
    },
    validateBeforeSubmit() {
      const nextErrors = {}
      if (!this.selectedInput) nextErrors.input = true
      if (!this.selectedAction) nextErrors.action = true
      if (!this.selectedFeedback) nextErrors.feedback = true
      this.fieldErrors = nextErrors
      if (!Object.keys(nextErrors).length) {
        this.validationMessage = ''
        return true
      }
      this.validationMessage = '请先完成标红题目。'
      const firstErrorKey = ['input', 'action', 'feedback'].find((key) => nextErrors[key])
      if (firstErrorKey) this.scrollToAnchor(`anchor-${firstErrorKey}`)
      return false
    },
    onInputChange(e) {
      const idx = Number(e.detail.value)
      this.selectedInput = this.interaction.inputs[idx] || ''
      this.submitted = false
      this.clearFieldError('input')
    },
    onActionChange(e) {
      const idx = Number(e.detail.value)
      this.selectedAction = this.interaction.actions[idx] || ''
      this.submitted = false
      this.clearFieldError('action')
    },
    onFeedbackChange(e) {
      const idx = Number(e.detail.value)
      this.selectedFeedback = this.interaction.feedback[idx] || ''
      this.submitted = false
      this.clearFieldError('feedback')
    },
    onEvidenceChanging(e) {
      this.evidenceStrength = Number(e.detail.value)
      this.submitted = false
    },
    onEvidenceChange(e) {
      this.evidenceStrength = Number(e.detail.value)
      this.submitted = false
    },
    submit() {
      if (!this.validateBeforeSubmit()) return
      this.submitted = true
      markMajorChallengeCompleted(this.majorId, this.module.id, this.task, this.stars, this.progress)
    },
    finish() {
      markMajorChallengeVisited(this.majorId, getMajorChallengeKey(this.module.id, this.task))
      uni.navigateBack()
    },
    goBack() {
      uni.navigateBack()
    },
  },
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100vh; background: #f7fbff; --accent: #007a66; }
.header { padding: 40rpx 32rpx 28rpx; background: linear-gradient(135deg, var(--accent), #00a88d); }
.seq { display: block; font-size: 22rpx; color: rgba(255,255,255,0.82); }
.title { display: block; margin-top: 8rpx; font-size: 34rpx; font-weight: 700; color: #fff; }
.subtitle { display: block; margin-top: 8rpx; font-size: 24rpx; line-height: 1.6; color: rgba(255,255,255,0.88); }
.progress-bar { margin-top: 20rpx; height: 12rpx; border-radius: 999rpx; background: rgba(255,255,255,0.28); overflow: hidden; }
.progress-fill { height: 100%; border-radius: 999rpx; background: #fff; transition: width 0.3s; }
.body { flex: 1; padding: 24rpx; box-sizing: border-box; }
.card { background: #fff; border-radius: 24rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 16rpx 40rpx rgba(15,23,42,0.06); }
.card-label { display: block; font-size: 22rpx; font-weight: 700; color: #64748b; }
.card-goal { display: block; margin-top: 12rpx; font-size: 26rpx; line-height: 1.7; color: #334155; }
.field { margin-top: 24rpx; }
.field-label { display: block; font-size: 24rpx; font-weight: 700; color: #162033; }
.picker-value { margin-top: 12rpx; padding: 20rpx 24rpx; border-radius: 16rpx; border: 2rpx solid #e3ebf3; background: #fbfdff; font-size: 24rpx; color: #334155; }
.picker-value--err { border-color: #ff4d4f; background: #fff5f5; }
.slider-head { display: flex; justify-content: space-between; align-items: center; }
.slider-value { font-size: 24rpx; font-weight: 700; color: var(--accent); }
.btn-submit { margin-top: 28rpx; background: var(--accent); color: #fff; border: none; border-radius: 999rpx; height: 84rpx; line-height: 84rpx; font-size: 28rpx; font-weight: 700; }
.validation-banner { margin-top: 20rpx; padding: 18rpx 20rpx; border-radius: 16rpx; background: #fff5f5; border: 2rpx solid #ff4d4f; }
.validation-banner__text { font-size: 24rpx; line-height: 1.6; color: #ff4d4f; font-weight: 700; }
.feedback-card { margin-bottom: 40rpx; }
.score { display: block; margin-top: 12rpx; font-size: 56rpx; font-weight: 700; color: var(--accent); }
.score-row { display: flex; align-items: center; gap: 12rpx; margin-top: 14rpx; }
.score-mark { width: 36rpx; font-size: 28rpx; font-weight: 700; color: var(--accent); }
.score-text { font-size: 24rpx; color: #475569; font-weight: 600; }
.result-text { display: block; margin-top: 20rpx; padding: 20rpx; border-radius: 16rpx; background: #fbfdff; font-size: 24rpx; line-height: 1.7; color: #64748b; }
.result-ok { background: #f2fffb; color: #0f766e; border: 2rpx solid #c8efe5; }
.footer { display: flex; gap: 16rpx; padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom)); background: #fff; }
.btn-ghost, .btn-primary { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; font-size: 28rpx; font-weight: 700; }
.btn-ghost { background: #eef2f7; color: #475569; }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary[disabled] { opacity: 0.55; }
</style>
