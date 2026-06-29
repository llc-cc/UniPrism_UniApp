<template>
  <view class="page">
    <!-- calculation 挑战 -->
    <view v-if="taskId === 'calculation' && calcModules.length">
      <view class="header">
        <text class="seq">{{ currentModule.badge }}</text>
        <text class="title">{{ currentModule.shortTitle }}</text>
        <text class="progress-text">{{ moduleIndex + 1 }}/{{ calcModules.length }} · {{ stageLabel }}</text>
      </view>
      <scroll-view class="content" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation>
        <!-- principle 原理 -->
        <view v-if="stage === 'principle' || stage === 'principle-rules'" class="card">
          <text class="section-title">{{ currentModule.principleTitle }}</text>
          <text class="section-sub">{{ currentModule.principleSubtitle }}</text>
          <view v-for="(line, i) in currentModule.intuition" :key="i" class="intuition-line">
            <text class="bullet">·</text>
            <text class="intuition-text">{{ line }}</text>
          </view>
          <view v-if="stage === 'principle-rules'" class="formula-list">
            <view v-for="(f, i) in currentModule.formulae" :key="i" class="formula-card">
              <text class="formula-label">{{ f.label }}</text>
              <text class="formula-math">{{ f.math }}</text>
              <text class="formula-note">{{ f.note }}</text>
            </view>
          </view>
        </view>

        <!-- example 例题 -->
        <view v-else-if="stage === 'example'" class="card">
          <text class="section-title">{{ currentModule.example.title }}</text>
          <text class="section-sub">{{ currentModule.example.subtitle }}</text>
          <text class="problem-math">{{ currentModule.example.problem }}</text>
          <view v-for="(step, i) in currentModule.example.steps" :key="i" class="step-card">
            <text class="step-num">步骤 {{ i + 1 }}</text>
            <text class="step-title">{{ step.title }}</text>
            <text class="step-body">{{ step.body }}</text>
            <text class="step-math">{{ step.math }}</text>
          </view>
          <view class="answer-box">
            <text class="answer-label">答案</text>
            <text class="answer-math">{{ currentModule.example.answer }}</text>
          </view>
        </view>

        <!-- practice 练习 -->
        <view v-else-if="stage === 'practice'" class="card">
          <text class="section-title">{{ currentModule.practice.title }}</text>
          <text class="section-sub">{{ currentModule.practice.subtitle }}</text>
          <view id="anchor-practice" class="question-area">
            <text v-if="currentQuestion.intro" class="q-intro">{{ currentQuestion.intro }}</text>
            <text class="q-prompt">{{ currentQuestion.prompt }}</text>
            <text class="q-hint">提示：{{ currentQuestion.hint }}</text>
            <view v-for="(opt, i) in currentQuestion.options" :key="i"
              :class="'opt-card' + (selectedOpt === i ? (opt.correct ? ' opt-correct' : ' opt-wrong') : '') + (!selectedOpt && selectedOpt !== 0 ? '' : ' opt-locked')"
              @tap="selectOption(i, opt)">
              <text class="opt-prefix">{{ optPrefix(i) }}</text>
              <text class="opt-label">{{ opt.label }}</text>
              <text v-if="selectedOpt === i && opt.correct" class="opt-mark">✓</text>
              <text v-if="selectedOpt === i && !opt.correct" class="opt-mark">✕</text>
            </view>
            <view v-if="selectedOpt !== null && selectedOpt !== undefined" class="solution-box">
              <text class="solution-title">解析</text>
              <text class="solution-seg">{{ currentQuestion.solutionText }}</text>
            </view>
            <view v-if="practiceValidationError" class="inline-validation">
              <text class="inline-validation__text">请先选择一个答案。</text>
            </view>
          </view>
        </view>
      </scroll-view>
      <view class="bottom-bar">
        <button class="btn-ghost" @tap="prevStep">{{ isFirstStep ? '返回目录' : '上一步' }}</button>
        <button class="btn-primary" @tap="nextStep">
          {{ isLastStep ? '完成' : '下一步' }}
        </button>
      </view>
    </view>

    <!-- proof-sort 证明排序 -->
    <view v-else-if="taskId === 'proof-sort' && sortModules.length">
      <view class="header">
        <text class="seq">{{ sortModule.badge }}</text>
        <text class="title">{{ sortModule.shortTitle }}</text>
        <text class="progress-text">{{ sortModuleIndex + 1 }}/{{ sortModules.length }}</text>
      </view>
      <scroll-view class="content" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation>
        <view class="card">
          <text class="section-title">{{ sortModule.challenge.title }}</text>
          <text class="copy">{{ sortModule.challenge.prompt }}</text>
          <text class="problem-math">{{ sortModule.challenge.promptMath }}</text>
          <view class="conditions">
            <text class="conditions-title">已知条件</text>
            <text v-for="(c, i) in sortModule.challenge.knownConditions" :key="i" class="condition-item">· {{ c }}</text>
          </view>
        </view>
        <view class="card">
          <text class="section-title">排列证明步骤</text>
          <text class="sort-hint">点击步骤卡片依次选择正确顺序</text>
          <!-- 已选区域 -->
          <view id="anchor-sort" class="sort-zone">
            <view v-for="(stepId, i) in sortSelected" :key="stepId" class="sort-placed" @tap="removeStep(i)">
              <text class="sort-idx">{{ i + 1 }}</text>
              <view class="sort-step-body">
                <text class="sort-step-title">{{ getStep(stepId).title }}</text>
                <text class="sort-step-math">{{ getStep(stepId).math }}</text>
              </view>
            </view>
            <view v-if="sortSelected.length === 0" class="sort-empty"><text class="sort-empty-text">点击下方步骤加入</text></view>
          </view>
          <!-- 待选步骤 -->
          <view class="sort-pool">
            <view v-for="stepId in sortRemaining" :key="stepId"
              class="sort-chip" @tap="addStep(stepId)">
              <text class="sort-chip-title">{{ getStep(stepId).title }}</text>
            </view>
          </view>
          <view v-if="sortValidationError" class="inline-validation">
            <text class="inline-validation__text">请先完成全部步骤排序。</text>
          </view>
          <view v-if="sortResult !== null" :class="'sort-feedback ' + (sortResult ? 'fb-ok' : 'fb-bad')">
            <text>{{ sortResult ? sortModule.challenge.successMessage : '顺序有误，请重新排列。' }}</text>
          </view>
        </view>
      </scroll-view>
      <view class="bottom-bar">
        <button class="btn-ghost" @tap="prevSortModule">{{ sortModuleIndex === 0 ? '返回目录' : '上一个' }}</button>
        <button v-if="!sortResult" class="btn-primary" @tap="checkSort">检查顺序</button>
        <button v-else class="btn-primary" @tap="nextSortModule">{{ sortModuleIndex >= sortModules.length - 1 ? '完成' : '下一个' }}</button>
      </view>
    </view>

    <!-- proof-interactive 证明交互 -->
    <view v-else-if="taskId === 'proof-interactive' && interModules.length">
      <view class="header">
        <text class="seq">{{ interModule.badge }}</text>
        <text class="title">{{ interModule.shortTitle }}</text>
        <text class="progress-text">{{ interModuleIndex + 1 }}/{{ interModules.length }}</text>
      </view>
      <scroll-view class="content" scroll-y>
        <view class="card">
          <text class="section-title">{{ interModule.title }}</text>
          <text class="copy">{{ interModule.prompt }}</text>
          <text class="problem-math">{{ interModule.promptMath }}</text>
        </view>
        <view class="card">
          <text class="section-title">条件库</text>
          <view v-for="fact in derivedFacts" :key="fact.id"
            :class="'fact-chip' + (selectedFacts.includes(fact.id) ? ' fact-selected' : '')"
            @tap="toggleFact(fact.id)">
            <text class="fact-source">{{ fact.source === 'given' ? '已知' : '已推出' }}</text>
            <text class="fact-label">{{ fact.label }}</text>
          </view>
        </view>
        <view class="card">
          <text class="section-title">定理库</text>
          <view v-for="rule in interModule.rules" :key="rule.id"
            :class="'rule-card' + (canApply(rule) ? ' rule-active' : '')"
            @tap="applyRule(rule)">
            <text class="rule-title">{{ rule.title }}</text>
            <text class="rule-math">{{ rule.math }}</text>
            <text class="rule-note">{{ rule.note }}</text>
          </view>
        </view>
        <view v-if="interResult" class="card fb-ok">
          <text class="section-title">🎉 {{ interModule.successMessage }}</text>
        </view>
        <view v-if="interError" class="card fb-bad">
          <text>{{ interError }}</text>
        </view>
      </scroll-view>
      <view class="bottom-bar">
        <button class="btn-ghost" @tap="prevInterModule">{{ interModuleIndex === 0 ? '返回目录' : '上一个' }}</button>
        <button class="btn-primary" :disabled="!interResult" @tap="nextInterModule">
          {{ interResult && interModuleIndex >= interModules.length - 1 ? '完成' : (interResult ? '下一个' : '继续') }}
        </button>
      </view>
    </view>

    <!-- 未知任务兜底 -->
    <view v-else class="empty-state">
      <text class="empty-title">挑战内容加载失败</text>
      <text class="empty-desc">请重新编译项目后再试。任务：{{ taskId }}</text>
      <button class="btn-primary" @tap="goBack">返回</button>
    </view>
  </view>
</template>

<script>
import { calculationModules, proofSortModules, proofInteractiveModules } from './business/challenge-content'
import {
  isAnalysisChallengeTaskLocked,
  readAnalysisChallengeProgress,
  markAnalysisChallengeTaskCompleted,
} from './business/analysis-challenge-progress'
import { markMathChallengeVisited } from './business/math-progress'

const CALC_STAGES = { 'limits-lhopital': ['principle', 'principle-rules', 'example', 'practice'], 'integration-by-parts': ['principle', 'principle-rules', 'example', 'practice'], 'series-summation': ['principle', 'principle-rules', 'example', 'practice'] }
const DEFAULT_STAGES = ['principle', 'example', 'practice']

export default {
  data() {
    return {
      taskId: 'calculation',
      // calculation
      calcModules: calculationModules || [],
      moduleIndex: 0,
      stageIndex: 0,
      practiceIndex: 0,
      selectedOpt: null,
      // proof-sort
      sortModules: proofSortModules || [],
      sortModuleIndex: 0,
      sortSelected: [],
      sortResult: null,
      // proof-interactive
      interModules: proofInteractiveModules || [],
      interModuleIndex: 0,
      derivedFacts: [],
      selectedFacts: [],
      interResult: false,
      interError: '',
      scrollIntoView: '',
      practiceValidationError: false,
      sortValidationError: false,
    }
  },
  onLoad(options) {
    if (options && options.task) this.taskId = options.task
    if (isAnalysisChallengeTaskLocked(this.taskId, readAnalysisChallengeProgress())) {
      uni.showToast({ title: '请先完成上一关挑战', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 700)
      return
    }
    if (this.taskId === 'proof-interactive') this.resetInterFacts()
  },
  computed: {
    // calculation
    currentModule() { return this.calcModules[this.moduleIndex] || this.calcModules[0] },
    stages() { return CALC_STAGES[this.currentModule.id] || DEFAULT_STAGES },
    stage() { return this.stages[this.stageIndex] || this.stages[0] },
    stageLabel() { return { principle: '原理', 'principle-rules': '公式', example: '例题', practice: '练习' }[this.stage] || '' },
    currentQuestion() {
      const q = (this.currentModule.practice.questions || [])[this.practiceIndex]
      if (!q) return {}
      return { ...q, solutionText: (q.solution || []).map(s => typeof s === 'string' ? s : s.math).join('') }
    },
    isFirstStep() { return this.moduleIndex === 0 && this.stageIndex === 0 && this.practiceIndex === 0 },
    isLastStep() {
      const lastModule = this.moduleIndex >= this.calcModules.length - 1
      const lastStage = this.stageIndex >= this.stages.length - 1
      const lastPractice = this.stage !== 'practice' || this.practiceIndex >= (this.currentModule.practice.questions.length - 1)
      return lastModule && lastStage && lastPractice
    },
    // proof-sort
    sortModule() { return this.sortModules[this.sortModuleIndex] || this.sortModules[0] },
    sortRemaining() { return (this.sortModule.challenge.shuffledStepIds || []).filter(id => !this.sortSelected.includes(id)) },
    // proof-interactive
    interModule() { return this.interModules[this.interModuleIndex] || this.interModules[0] },
  },
  methods: {
    goBack() { uni.navigateBack() },
    scrollToAnchor(anchorId) {
      this.scrollIntoView = ''
      this.$nextTick(() => {
        this.scrollIntoView = anchorId
      })
    },
    finishChallenge() {
      markAnalysisChallengeTaskCompleted(this.taskId)
      markMathChallengeVisited(this.taskId)
      uni.navigateBack()
    },
    optPrefix(i) { return String.fromCharCode(65 + i) },

    // calculation
    selectOption(i, opt) {
      if (this.selectedOpt !== null) return
      this.selectedOpt = i
      this.practiceValidationError = false
    },
    nextStep() {
      const stages = this.stages
      if (this.stage === 'practice') {
        if (this.selectedOpt === null) {
          this.practiceValidationError = true
          this.scrollToAnchor('anchor-practice')
          return
        }
        const opt = (this.currentQuestion.options || [])[this.selectedOpt]
        if (opt && !opt.correct) {
          uni.showToast({ title: '答案不正确，请再试', icon: 'none' })
          return
        }
        const questions = this.currentModule.practice.questions
        if (this.practiceIndex < questions.length - 1) {
          this.practiceIndex++; this.selectedOpt = null; this.practiceValidationError = false; return
        }
      }
      if (this.stageIndex < stages.length - 1) {
        this.stageIndex++; this.selectedOpt = null; this.practiceIndex = 0; this.practiceValidationError = false; return
      }
      if (this.moduleIndex < this.calcModules.length - 1) {
        this.moduleIndex++; this.stageIndex = 0; this.practiceIndex = 0; this.selectedOpt = null; this.practiceValidationError = false; return
      }
      this.finishChallenge()
    },
    prevStep() {
      if (this.isFirstStep) { this.goBack(); return }
      if (this.stage === 'practice' && this.practiceIndex > 0) {
        this.practiceIndex--; this.selectedOpt = null; this.practiceValidationError = false; return
      }
      if (this.stageIndex > 0) {
        this.stageIndex--; this.selectedOpt = null; this.practiceValidationError = false
        if (this.stage === 'practice') this.practiceIndex = (this.currentModule.practice.questions.length - 1)
        return
      }
      if (this.moduleIndex > 0) {
        this.moduleIndex--
        const stages = CALC_STAGES[this.currentModule.id] || DEFAULT_STAGES
        this.stageIndex = stages.length - 1
        this.practiceIndex = this.currentModule.practice.questions.length - 1
        this.selectedOpt = null
        this.practiceValidationError = false
      }
    },

    // proof-sort
    getStep(id) { return (this.sortModule.challenge.steps || []).find(s => s.id === id) || {} },
    addStep(id) { if (!this.sortSelected.includes(id)) this.sortSelected.push(id); this.sortResult = null; this.sortValidationError = false },
    removeStep(i) { this.sortSelected.splice(i, 1); this.sortResult = null; this.sortValidationError = false },
    checkSort() {
      if (this.sortSelected.length < this.sortModule.challenge.steps.length) {
        this.sortValidationError = true
        this.scrollToAnchor('anchor-sort')
        return
      }
      this.sortValidationError = false
      const correct = this.sortModule.challenge.steps.map(s => s.id)
      this.sortResult = JSON.stringify(this.sortSelected) === JSON.stringify(correct)
    },
    prevSortModule() { if (this.sortModuleIndex === 0) { this.goBack(); return } this.sortModuleIndex--; this.resetSort() },
    nextSortModule() {
      if (this.sortModuleIndex < this.sortModules.length - 1) { this.sortModuleIndex++; this.resetSort() }
      else this.finishChallenge()
    },
    resetSort() { this.sortSelected = []; this.sortResult = null; this.sortValidationError = false },

    // proof-interactive
    resetInterFacts() {
      this.derivedFacts = [...(this.interModule.initialFacts || [])]
      this.selectedFacts = []; this.interResult = false; this.interError = ''
    },
    toggleFact(id) {
      const idx = this.selectedFacts.indexOf(id)
      if (idx >= 0) this.selectedFacts.splice(idx, 1)
      else this.selectedFacts.push(id)
      this.interError = ''
    },
    canApply(rule) {
      return rule.needs.every(id => this.derivedFacts.some(f => f.id === id))
    },
    applyRule(rule) {
      if (!this.canApply(rule)) { this.interError = '条件不足，请先选中所有前提事实。'; return }
      if (this.derivedFacts.some(f => f.id === rule.gives.id)) { this.interError = '该结论已推出。'; return }
      this.derivedFacts.push(rule.gives)
      this.selectedFacts = []
      this.interError = ''
      if (rule.gives.id === this.interModule.targetFactId) this.interResult = true
    },
    prevInterModule() { if (this.interModuleIndex === 0) { this.goBack(); return } this.interModuleIndex--; this.resetInterFacts() },
    nextInterModule() {
      if (!this.interResult) {
        uni.showToast({ title: '请先推出目标结论', icon: 'none' })
        return
      }
      if (this.interModuleIndex < this.interModules.length - 1) {
        this.interModuleIndex++
        this.resetInterFacts()
        return
      }
      this.finishChallenge()
    },
  }
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100vh; background: #f8fafc; }
.header { background: linear-gradient(135deg, #007a66, #00a88d); padding: 48rpx 40rpx 36rpx; }
.seq { font-size: 22rpx; color: rgba(255,255,255,0.7); display: block; margin-bottom: 6rpx; }
.title { font-size: 36rpx; font-weight: 700; color: #fff; display: block; margin-bottom: 6rpx; }
.progress-text { font-size: 22rpx; color: rgba(255,255,255,0.7); display: block; }
.content { flex: 1; }
.card { background: #fff; border-radius: 24rpx; padding: 32rpx; margin: 20rpx 24rpx 0; }
.section-title { font-size: 30rpx; font-weight: 700; color: #1a2e2b; display: block; margin-bottom: 12rpx; }
.section-sub { font-size: 24rpx; color: #6b7280; display: block; margin-bottom: 24rpx; line-height: 1.6; }
.copy { font-size: 26rpx; color: #374151; line-height: 1.8; display: block; margin-bottom: 16rpx; }

/* principle */
.intuition-line { display: flex; gap: 12rpx; margin-bottom: 16rpx; }
.bullet { color: #007a66; font-size: 28rpx; flex-shrink: 0; }
.intuition-text { font-size: 26rpx; color: #374151; line-height: 1.7; }
.formula-list { margin-top: 24rpx; }
.formula-card { background: #f8fafc; border-left: 6rpx solid #007a66; border-radius: 12rpx; padding: 20rpx 24rpx; margin-bottom: 16rpx; }
.formula-label { font-size: 22rpx; color: #6b7280; display: block; margin-bottom: 8rpx; }
.formula-math { font-size: 26rpx; color: #1a2e2b; font-family: monospace; display: block; margin-bottom: 8rpx; }
.formula-note { font-size: 22rpx; color: #6b7280; display: block; }

/* example */
.problem-math { font-size: 28rpx; color: #007a66; font-family: monospace; display: block; margin: 20rpx 0; padding: 20rpx; background: #f0faf8; border-radius: 12rpx; }
.step-card { border: 2rpx solid #e5e7eb; border-radius: 12rpx; padding: 20rpx; margin-bottom: 16rpx; }
.step-num { font-size: 20rpx; color: #9ca3af; display: block; margin-bottom: 6rpx; }
.step-title { font-size: 26rpx; font-weight: 600; color: #1a2e2b; display: block; margin-bottom: 8rpx; }
.step-body { font-size: 24rpx; color: #6b7280; display: block; margin-bottom: 8rpx; }
.step-math { font-size: 24rpx; color: #007a66; font-family: monospace; display: block; }
.answer-box { background: #e6f3f1; border-radius: 12rpx; padding: 20rpx 24rpx; margin-top: 16rpx; display: flex; align-items: center; gap: 16rpx; }
.answer-label { font-size: 22rpx; color: #007a66; font-weight: 700; }
.answer-math { font-size: 28rpx; color: #007a66; font-family: monospace; }

/* practice */
.question-area { }
.q-intro { font-size: 24rpx; color: #6b7280; display: block; margin-bottom: 12rpx; }
.q-prompt { font-size: 28rpx; color: #1a2e2b; font-family: monospace; display: block; margin-bottom: 12rpx; padding: 16rpx; background: #f8fafc; border-radius: 10rpx; }
.q-hint { font-size: 22rpx; color: #9ca3af; display: block; margin-bottom: 24rpx; }
.opt-card { display: flex; align-items: center; gap: 16rpx; border: 2rpx solid #e5e7eb; border-radius: 12rpx; padding: 20rpx; margin-bottom: 12rpx; }
.opt-card.opt-correct { border-color: #007a66; background: #e6f3f1; }
.opt-card.opt-wrong { border-color: #ef4444; background: #fef2f2; }
.opt-prefix { font-size: 24rpx; font-weight: 700; color: #007a66; width: 36rpx; flex-shrink: 0; }
.opt-label { flex: 1; font-size: 26rpx; color: #1a2e2b; font-family: monospace; }
.opt-mark { font-size: 28rpx; font-weight: 700; }
.opt-correct .opt-mark { color: #007a66; }
.opt-wrong .opt-mark { color: #ef4444; }
.solution-box { background: #f8fafc; border-radius: 12rpx; padding: 20rpx; margin-top: 16rpx; }
.solution-title { font-size: 22rpx; color: #007a66; font-weight: 700; display: block; margin-bottom: 8rpx; }
.solution-seg { font-size: 24rpx; color: #374151; font-family: monospace; }

/* proof-sort */
.sort-hint { font-size: 22rpx; color: #9ca3af; display: block; margin-bottom: 16rpx; }
.sort-zone { min-height: 80rpx; background: #f8fafc; border-radius: 12rpx; padding: 16rpx; margin-bottom: 16rpx; }
.sort-empty { display: flex; align-items: center; justify-content: center; height: 80rpx; }
.sort-empty-text { font-size: 24rpx; color: #d1d5db; }
.sort-placed { display: flex; align-items: flex-start; gap: 16rpx; padding: 16rpx; background: #fff; border: 2rpx solid #007a66; border-radius: 10rpx; margin-bottom: 10rpx; }
.sort-idx { font-size: 22rpx; color: #007a66; font-weight: 700; width: 32rpx; flex-shrink: 0; padding-top: 4rpx; }
.sort-step-body { flex: 1; }
.sort-step-title { font-size: 24rpx; font-weight: 600; color: #1a2e2b; display: block; }
.sort-step-math { font-size: 20rpx; color: #6b7280; font-family: monospace; display: block; margin-top: 4rpx; }
.sort-pool { display: flex; flex-wrap: wrap; gap: 12rpx; }
.sort-chip { background: #e6f3f1; border-radius: 10rpx; padding: 14rpx 20rpx; }
.sort-chip-title { font-size: 24rpx; color: #007a66; }
.sort-feedback { border-radius: 12rpx; padding: 20rpx; margin-top: 16rpx; }
.conditions { margin-top: 20rpx; }
.conditions-title { font-size: 22rpx; color: #9ca3af; display: block; margin-bottom: 12rpx; }
.condition-item { font-size: 24rpx; color: #374151; display: block; line-height: 1.8; }

/* proof-interactive */
.fact-chip { display: flex; align-items: center; gap: 16rpx; border: 2rpx solid #e5e7eb; border-radius: 10rpx; padding: 16rpx 20rpx; margin-bottom: 10rpx; }
.fact-chip.fact-selected { border-color: #007a66; background: #e6f3f1; }
.fact-source { font-size: 18rpx; color: #9ca3af; background: #f3f4f6; border-radius: 6rpx; padding: 2rpx 10rpx; flex-shrink: 0; }
.fact-selected .fact-source { background: #007a66; color: #fff; }
.fact-label { font-size: 24rpx; color: #1a2e2b; flex: 1; }
.rule-card { border: 2rpx solid #e5e7eb; border-radius: 12rpx; padding: 20rpx; margin-bottom: 12rpx; }
.rule-card.rule-active { border-color: #007a66; background: #f0faf8; }
.rule-title { font-size: 26rpx; font-weight: 600; color: #1a2e2b; display: block; margin-bottom: 8rpx; }
.rule-math { font-size: 22rpx; color: #007a66; font-family: monospace; display: block; margin-bottom: 6rpx; }
.rule-note { font-size: 20rpx; color: #9ca3af; display: block; }

/* feedback */
.fb-ok { background: #e6f3f1; border: 2rpx solid #007a66; }
.fb-bad { background: #fef2f2; border: 2rpx solid #ef4444; }
.inline-validation { margin-top: 16rpx; padding: 16rpx 18rpx; border-radius: 12rpx; background: #fff5f5; border: 2rpx solid #ff4d4f; }
.inline-validation__text { font-size: 22rpx; line-height: 1.5; color: #ff4d4f; font-weight: 700; }

/* bottom */
.bottom-bar { display: flex; gap: 16rpx; padding: 24rpx 32rpx; background: #fff; border-top: 2rpx solid #f0f0f0; }
.btn-ghost { flex: 1; background: transparent; color: #007a66; border: 2rpx solid #007a66; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; }
.btn-primary { flex: 2; background: #007a66; color: #fff; border: none; border-radius: 48rpx; height: 88rpx; line-height: 88rpx; font-size: 28rpx; font-weight: 600; }

/* empty */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 120rpx 40rpx; gap: 24rpx; }
.empty-title { font-size: 32rpx; color: #1a2e2b; }
.empty-desc { font-size: 24rpx; color: #64748b; text-align: center; line-height: 1.6; }
</style>
