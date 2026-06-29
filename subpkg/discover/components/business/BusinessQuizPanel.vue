<template>
  <view class="quiz-panel">
    <view class="quiz-head">
      <text class="quiz-title">章末测验</text>
      <text class="quiz-desc">提交后自动批改，并显示错题解析。</text>
    </view>

    <view v-for="(item, index) in questions" :key="item.key" class="quiz-item">
      <text class="quiz-index">第 {{ index + 1 }} 题 · {{ item.key }}</text>
      <text class="quiz-question">{{ item.question }}</text>
      <view class="quiz-options">
        <view
          v-for="(opt, optIdx) in item.options"
          :key="opt"
          class="quiz-option"
          :class="optionClass(index, optIdx, item)"
          @tap="selectAnswer(index, optIdx)"
        >
          <text class="quiz-option-label">{{ String.fromCharCode(65 + optIdx) }}</text>
          <text class="quiz-option-text">{{ opt }}</text>
        </view>
      </view>
      <view v-if="submitted && answers[index] !== item.answer" class="quiz-explain">
        <text class="quiz-explain-title">解析</text>
        <text class="quiz-explain-body">{{ item.explanation }}</text>
      </view>
    </view>

    <view class="quiz-footer">
      <text class="quiz-score">得分：{{ submitted ? `${score}/${questions.length}` : '--' }}</text>
      <button class="quiz-submit" :style="{ background: accent }" @tap="submitQuiz">
        {{ submitted ? '重新作答' : '提交批改' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'BusinessQuizPanel',
  props: {
    questions: { type: Array, default: () => [] },
    accent: { type: String, default: '#f3a43b' },
  },
  data() {
    return {
      answers: [],
      submitted: false,
    }
  },
  computed: {
    score() {
      if (!this.submitted) return 0
      return this.questions.reduce((sum, item, index) => sum + (this.answers[index] === item.answer ? 1 : 0), 0)
    },
  },
  watch: {
    questions: {
      immediate: true,
      handler(list) {
        this.resetAnswers(list.length)
      },
    },
  },
  methods: {
    resetAnswers(length) {
      this.answers = Array(length).fill(null)
      this.submitted = false
    },
    selectAnswer(index, optIdx) {
      if (this.submitted) return
      this.answers[index] = optIdx
    },
    optionClass(index, optIdx, item) {
      if (!this.submitted) {
        return this.answers[index] === optIdx ? 'quiz-option--selected' : ''
      }
      if (optIdx === item.answer) return 'quiz-option--correct'
      if (this.answers[index] === optIdx) return 'quiz-option--wrong'
      return ''
    },
    submitQuiz() {
      if (this.submitted) {
        this.resetAnswers(this.questions.length)
        return
      }
      const unanswered = this.answers.some((value) => value === null)
      if (unanswered) {
        uni.showToast({ title: '请先完成全部题目', icon: 'none' })
        return
      }
      this.submitted = true
      this.$emit('completed', { score: this.score, total: this.questions.length })
    },
  },
}
</script>

<style scoped>
.quiz-panel { display: flex; flex-direction: column; gap: 24rpx; }
.quiz-head { padding-bottom: 12rpx; border-bottom: 1rpx solid #e8edf3; }
.quiz-title { display: block; font-size: 32rpx; font-weight: 700; color: #1d1d1f; }
.quiz-desc { display: block; margin-top: 8rpx; font-size: 24rpx; color: #64748b; }
.quiz-item { padding: 20rpx 0; border-bottom: 1rpx solid #eef2f7; }
.quiz-index { display: block; font-size: 20rpx; color: #94a3b8; margin-bottom: 8rpx; }
.quiz-question { display: block; font-size: 28rpx; font-weight: 700; color: #16233a; line-height: 1.5; }
.quiz-options { margin-top: 16rpx; display: flex; flex-direction: column; gap: 12rpx; }
.quiz-option { display: flex; gap: 12rpx; padding: 18rpx; border-radius: 16rpx; background: #f8fafc; border: 2rpx solid transparent; }
.quiz-option--selected { border-color: #1d1d1f; background: #fff; }
.quiz-option--correct { border-color: #16a34a; background: #f0fdf4; }
.quiz-option--wrong { border-color: #dc2626; background: #fef2f2; }
.quiz-option-label { width: 40rpx; height: 40rpx; border-radius: 50%; background: #e2e8f0; color: #334155; font-size: 22rpx; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.quiz-option-text { flex: 1; font-size: 24rpx; line-height: 1.65; color: #334155; }
.quiz-explain { margin-top: 12rpx; padding: 16rpx; border-radius: 12rpx; background: #fff7ed; }
.quiz-explain-title { display: block; font-size: 22rpx; font-weight: 700; color: #b45309; }
.quiz-explain-body { display: block; margin-top: 6rpx; font-size: 23rpx; line-height: 1.7; color: #78350f; }
.quiz-footer { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; padding-top: 8rpx; }
.quiz-score { font-size: 28rpx; font-weight: 700; color: #1d1d1f; }
.quiz-submit { flex: 1; height: 80rpx; line-height: 80rpx; border-radius: 999rpx; color: #fff; font-size: 28rpx; font-weight: 700; border: none; }
</style>
