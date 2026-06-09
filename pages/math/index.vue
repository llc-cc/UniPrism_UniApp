<template>
  <view class="page">
    <view class="topbar">
      <view class="topbar-row">
        <text class="topbar-title">数学与应用数学</text>
        <text class="topbar-en">Mathematics</text>
      </view>
      <text class="page-indicator">{{ pageIndex + 1 }} / {{ pages.length }} · {{ currentPage.title }}</text>
      <view class="steps">
        <view
          v-for="(stage, idx) in stageMeta"
          :key="stage.key"
          class="step-dot"
          :class="{
            'step-dot-active': idx === activeStageIndex,
            'step-dot-done': unlockedStageIndexes.includes(idx) && idx < activeStageIndex,
            'step-dot-locked': !unlockedStageIndexes.includes(idx),
          }"
          @tap="jumpToStage(idx)"
        >
          <text class="step-index">{{ idx + 1 }}</text>
          <text class="step-label">{{ stage.label }}</text>
        </view>
      </view>
    </view>

    <scroll-view class="body" scroll-y :scroll-top="scrollTop">
      <!-- 概览 -->
      <view v-if="currentPage.type === 'catalog'" class="stage">
        <image class="hero-image" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        <text class="stage-intro">建立整体印象，了解数学专业能做什么。</text>
        <view v-for="card in currentPage.cards" :key="card.index" class="catalog-card">
          <image class="catalog-image" :src="resolveAsset(card.image)" mode="widthFix" />
          <view class="catalog-copy">
            <text class="catalog-index">{{ card.index }}</text>
            <text class="catalog-title">{{ card.title }}</text>
            <text class="catalog-body">{{ card.body }}</text>
          </view>
        </view>
      </view>

      <!-- 阶段完成 -->
      <view v-else-if="currentPage.type === 'stage-complete'" class="stage">
        <view class="completion-card">
          <text class="completion-badge">阶段完成</text>
          <text class="completion-title">{{ currentPage.completionTitle }}</text>
          <text class="completion-desc">{{ currentPage.completionDescription }}</text>
          <view class="next-stage-card">
            <text class="next-stage-label">下一阶段</text>
            <text class="next-stage-title">{{ currentPage.nextStageTitle }}</text>
            <text class="next-stage-desc">{{ currentPage.nextStageDescription }}</text>
          </view>
        </view>
      </view>

      <!-- 专业介绍首页 -->
      <view v-else-if="currentPage.type === 'intro-home'" class="stage">
        <image class="hero-image" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        <text class="stage-intro">了解课程体系、发展方向与案例体验。</text>
        <view v-for="card in currentPage.cards" :key="card.index" class="catalog-card">
          <image class="catalog-image" :src="resolveAsset(card.image)" mode="widthFix" />
          <view class="catalog-copy">
            <text class="catalog-index">{{ card.index }}</text>
            <text class="catalog-title">{{ card.title }}</text>
            <text class="catalog-body">{{ card.body }}</text>
          </view>
        </view>
      </view>

      <!-- 数学分析：内联正文 + 底部挑战 -->
      <view v-else-if="currentPage.type === 'math-analysis-inline'" class="stage">
        <view class="article-panel article-panel-flat">
          <text class="inline-course-title">数学分析</text>
          <text class="inline-course-sub">理解连续世界的基础语言</text>
          <view v-for="(section, sIdx) in analysisSections" :key="`${section.title}-${sIdx}`" class="article-section">
            <text v-if="section.role" class="section-role">{{ section.role }}</text>
            <text class="article-section-title">{{ section.title }}</text>
            <view v-if="section.content && section.content.length">
              <view v-for="(item, idx) in section.content" :key="idx">
                <text v-if="item.type === 'paragraph'" class="article-paragraph">{{ item.text }}</text>
                <view v-else-if="item.type === 'blockFormula'" class="formula-card">
                  <text class="formula-math">{{ item.latex }}</text>
                  <text v-if="item.explanation" class="formula-note">{{ item.explanation }}</text>
                </view>
                <view v-else-if="item.type === 'figure'" class="figure-card">
                  <image v-if="item.imageSrc" class="section-image" :src="resolveAsset(item.imageSrc)" mode="widthFix" />
                  <text v-if="item.caption" class="figure-caption">{{ item.caption }}</text>
                </view>
              </view>
            </view>
            <template v-else>
              <text v-for="(paragraph, pIdx) in section.paragraphs" :key="pIdx" class="article-paragraph">{{ paragraph }}</text>
              <text v-if="section.formula" class="formula-math">{{ section.formula }}</text>
              <image v-if="section.imageSrc" class="section-image" :src="resolveAsset(section.imageSrc)" mode="widthFix" />
            </template>
          </view>
        </view>

        <view class="challenge-section">
          <text class="challenge-section-title">挑战任务（建议按顺序解锁）</text>
          <view
            v-for="(card, idx) in analysisChallengeCards"
            :key="card.id"
            class="challenge-entry-card"
            :class="{
              'challenge-entry-locked': card.locked,
              'challenge-entry-done': card.completed,
            }"
            @tap="startAnalysisChallenge(card)"
          >
            <image class="challenge-entry-image" :src="resolveAsset(card.imageSrc)" mode="widthFix" />
            <view class="challenge-entry-copy">
              <view class="challenge-entry-head">
                <text class="challenge-entry-seq">{{ card.sequenceLabel }}</text>
                <text v-if="card.completed" class="challenge-entry-status">已完成</text>
                <text v-else-if="card.locked" class="challenge-entry-status challenge-entry-status-lock">未解锁</text>
              </view>
              <text class="challenge-entry-title">{{ card.title }}</text>
              <text class="challenge-entry-body">{{ card.body }}</text>
              <text v-if="card.locked" class="challenge-entry-hint">{{ card.unlockHint }}</text>
              <text v-else class="challenge-entry-action">{{ card.completed ? '再次挑战' : '开始挑战' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 课程页（基础/深入） -->
      <view v-else-if="currentPage.type === 'math-course'" class="stage">
        <view class="course-panel">
          <view class="course-head">
            <text class="course-flag">{{ currentPage.level === 'foundation' ? '基础课' : '核心课' }}</text>
            <text class="course-title">{{ currentPage.course.title }}</text>
            <text class="course-sub">{{ currentPage.course.subtitle }}</text>
          </view>
          <text class="course-preview">{{ currentPage.course.preview }}</text>
          <text class="course-meta">共 {{ currentPage.course.pagesCount }} 页 · 建议逐页阅读后再继续</text>
          <view class="action-row">
            <button class="btn-inline" @tap="goReadCourse(currentPage.course.id)">阅读课程</button>
          </view>
          <view v-if="visitedCourses.includes(currentPage.course.id)" class="visited-tag">已阅读</view>
        </view>
      </view>

      <!-- 深入开始 -->
      <view v-else-if="currentPage.type === 'deep-start'" class="stage">
        <image class="hero-image" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        <text class="stage-intro">{{ currentPage.intro }}</text>
        <view v-for="course in currentPage.courses" :key="course.id" class="course-card">
          <text class="course-title">{{ course.title }}</text>
          <text class="course-sub">{{ course.subtitle }}</text>
          <text class="course-meta-inline">{{ course.pagesCount }} 页</text>
        </view>
      </view>

      <!-- 分流 -->
      <view v-else-if="currentPage.type === 'branching'" class="stage">
        <image class="hero-image" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        <text class="stage-intro">探索不同方向，获得个性化建议。请选择一个你更想长期投入的训练方向。</text>
        <view
          v-for="branch in currentPage.branches"
          :key="branch.id"
          class="branch-card"
          :class="{ 'branch-card-active': selectedBranchId === branch.id }"
          @tap="selectBranch(branch)"
        >
          <view class="branch-head">
            <text class="branch-title">{{ branch.title }}</text>
            <text v-if="selectedBranchId === branch.id" class="branch-check">已选</text>
          </view>
          <text class="branch-subtitle">{{ branch.subtitle }}</text>
          <text class="branch-body">{{ branch.body }}</text>
          <view class="branch-tags">
            <text v-for="module in branch.modules" :key="module" class="branch-tag">{{ module }}</text>
          </view>
          <text class="branch-fit">{{ branch.fit }}</text>
        </view>
      </view>

      <!-- 方向概览 -->
      <view v-else-if="currentPage.type === 'branch-overview'" class="stage">
        <image
          v-if="currentPage.heroImage"
          class="hero-image"
          :src="resolveAsset(currentPage.heroImage)"
          mode="widthFix"
        />
        <view class="article-panel">
          <text class="article-title">{{ currentPage.branch.title }}</text>
          <text class="article-sub">{{ currentPage.branch.subtitle }}</text>
          <text class="article-paragraph">{{ currentPage.branch.body }}</text>
          <view class="branch-tags">
            <text v-for="module in currentPage.branch.modules" :key="module" class="branch-tag">{{ module }}</text>
          </view>
        </view>
      </view>

      <!-- 方向专题 -->
      <view v-else-if="currentPage.type === 'branch-topic'" class="stage">
        <view class="article-panel">
          <text class="article-title">{{ currentPage.topic.title }}</text>
          <text class="article-sub">{{ currentPage.topic.subtitle }}</text>
          <text class="article-paragraph">{{ currentPage.topic.summary }}</text>
          <view class="interaction-panel">
            <text class="interaction-title">{{ currentPage.topic.interaction.title }}</text>
            <text class="interaction-goal">{{ currentPage.topic.interaction.goal }}</text>
            <text class="task-line">输出：{{ currentPage.topic.interaction.output }}</text>
          </view>
        </view>
      </view>

      <!-- 职业路径 -->
      <view v-else-if="currentPage.type === 'branch-rolemap'" class="stage">
        <view class="article-panel">
          <text class="article-title">{{ currentPage.branch.title }} · 职业路径</text>
          <text class="article-sub">结合方向训练重点，这些岗位通常需要类似的数学能力结构。</text>
          <view v-for="role in rolemapRoles" :key="role" class="role-row">
            <text class="role-dot">·</text>
            <text class="role-text">{{ role }}</text>
          </view>
        </view>
      </view>

      <!-- 完成 -->
      <view v-else-if="currentPage.type === 'done'" class="stage">
        <view class="completion-card">
          <text class="completion-badge">体验完成</text>
          <text class="completion-title">{{ currentPage.completionTitle }}</text>
          <text class="completion-desc">{{ currentPage.completionDescription }}</text>
        </view>
        <view class="finish-card">
          <text class="finish-title">适配判断</text>
          <text class="finish-desc">结合你刚体验的方向与专题，判断自己是否愿意长期投入这类问题。</text>
          <view class="summary-card">
            <text class="summary-line">方向：{{ selectedBranchTitle || '未选择' }}</text>
            <text class="summary-line">已阅读课程：{{ visitedCourses.length }} 门</text>
          </view>
          <view
            v-for="option in fitOptions"
            :key="option.value"
            class="fit-option"
            :class="{ 'fit-option-active': fitChoice === option.value }"
            @tap="selectFit(option.value)"
          >
            <text class="fit-option-text">{{ option.label }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="footer">
      <button v-if="pageIndex > 0" class="btn-ghost" @tap="prevPage">上一页</button>
      <button
        v-if="pageIndex < pages.length - 1"
        class="btn-primary"
        :disabled="!canNext"
        @tap="nextPage"
      >
        {{ nextLabel }}
      </button>
      <button v-else class="btn-primary" @tap="finishExperience">
        {{ completed ? '完成并返回' : '完成体验' }}
      </button>
    </view>
  </view>
</template>

<script>
import { markMajorExplored } from '../../business/explore-progress'
import { loadMathProgress, markMathCourseVisited, saveMathProgress } from '../../business/math-progress'
import { MATH_BRANCH_ROLEMAPS } from '../../business/math-config'
import {
  buildMathSpeedPages,
  findMathBranchOverviewPageIndex,
  MATH_STAGE_META,
} from '../../business/math-speed-pages'
import { analysisArticleSections } from '../../business/math-content'
import { challengeTaskCards } from '../../business/challenge-task-cards'
import {
  readAnalysisChallengeProgress,
  isAnalysisChallengeTaskLocked,
  getAnalysisChallengeUnlockHint,
} from '../../business/analysis-challenge-progress'
import { resolveAsset } from '../../utils/asset-map'

export default {
  data() {
    return {
      pageIndex: 0,
      scrollTop: 0,
      selectedBranchId: 'basic',
      selectedBranchTitle: '基础数学',
      fitChoice: '',
      completed: false,
      visitedCourses: [],
      unlockedStageIndexes: [0],
      stageMeta: MATH_STAGE_META,
      fitOptions: [
        { value: 'fit', label: '我愿意长期处理抽象推理与证明问题' },
        { value: 'maybe', label: '有兴趣，但还想体验其他专业' },
        { value: 'unfit', label: '不太适合我，想换个方向' },
      ],
      analysisSections: analysisArticleSections,
      analysisChallengeProgress: readAnalysisChallengeProgress(),
    }
  },
  computed: {
    pages() {
      return buildMathSpeedPages(this.selectedBranchId)
    },
    currentPage() {
      return this.pages[this.pageIndex] || { type: 'catalog', title: '', stageIndex: 0 }
    },
    activeStageIndex() {
      return this.currentPage.stageIndex || 0
    },
    rolemapRoles() {
      return MATH_BRANCH_ROLEMAPS[this.selectedBranchId] || []
    },
    canNext() {
      if (this.currentPage.type === 'branching') return Boolean(this.selectedBranchId)
      return true
    },
    nextLabel() {
      if (this.currentPage.type === 'branching') {
        return this.selectedBranchId ? '进入所选方向' : '请先选择方向'
      }
      if (this.currentPage.type === 'stage-complete') return '进入下一阶段'
      return '下一页'
    },
    analysisChallengeCards() {
      const progress = this.analysisChallengeProgress
      return challengeTaskCards.map((card) => ({
        ...card,
        locked: isAnalysisChallengeTaskLocked(card.id, progress),
        completed: Boolean(progress[card.id]?.completed),
        unlockHint: getAnalysisChallengeUnlockHint(card.id),
      }))
    },
  },
  watch: {
    selectedBranchId() {
      this.saveSnapshot()
    },
  },
  onShow() {
    this.restoreSnapshot()
    this.analysisChallengeProgress = readAnalysisChallengeProgress()
  },
  onLoad() {
    uni.setNavigationBarTitle({ title: '数学专业体验' })
    this.restoreSnapshot()
  },
  methods: {
    resolveAsset,
    restoreSnapshot() {
      const snapshot = loadMathProgress()
      this.selectedBranchId = snapshot.selectedBranchId || this.selectedBranchId
      this.selectedBranchTitle = snapshot.selectedBranchTitle || this.selectedBranchTitle
      this.fitChoice = snapshot.fitChoice || ''
      this.completed = Boolean(snapshot.completed)
      this.visitedCourses = snapshot.visitedCourses || []
      this.unlockedStageIndexes = snapshot.unlockedStageIndexes || [0]
      const maxIndex = Math.max(0, buildMathSpeedPages(this.selectedBranchId).length - 1)
      this.pageIndex = Math.min(snapshot.pageIndex || 0, maxIndex)
    },
    saveSnapshot() {
      saveMathProgress({
        pageIndex: this.pageIndex,
        selectedBranchId: this.selectedBranchId,
        selectedBranchTitle: this.selectedBranchTitle,
        fitChoice: this.fitChoice,
        completed: this.completed,
        visitedCourses: this.visitedCourses,
        unlockedStageIndexes: this.unlockedStageIndexes,
      })
    },
    scrollToTop() {
      this.scrollTop = this.scrollTop === 0 ? 1 : 0
    },
    unlockStage(stageIndex) {
      if (!this.unlockedStageIndexes.includes(stageIndex)) {
        this.unlockedStageIndexes = [...this.unlockedStageIndexes, stageIndex].sort((a, b) => a - b)
      }
    },
    jumpToStage(stageIndex) {
      if (!this.unlockedStageIndexes.includes(stageIndex)) {
        uni.showToast({ title: '请先完成上一阶段', icon: 'none' })
        return
      }
      const target = this.pages.findIndex((page) => page.stageIndex === stageIndex)
      if (target >= 0) {
        this.pageIndex = target
        this.scrollToTop()
        this.saveSnapshot()
      }
    },
    prevPage() {
      if (this.pageIndex > 0) {
        this.pageIndex -= 1
        this.scrollToTop()
        this.saveSnapshot()
      }
    },
    nextPage() {
      if (!this.canNext) {
        uni.showToast({ title: '请先选择一个方向', icon: 'none' })
        return
      }
      if (this.currentPage.type === 'branching' && this.selectedBranchId) {
        const branchOverviewIndex = findMathBranchOverviewPageIndex(
          buildMathSpeedPages(this.selectedBranchId),
        )
        if (branchOverviewIndex >= 0) {
          this.unlockStage(4)
          this.pageIndex = branchOverviewIndex
          this.scrollToTop()
          this.saveSnapshot()
          return
        }
      }
      if (this.pageIndex < this.pages.length - 1) {
        if (this.currentPage.type === 'math-analysis-inline') {
          this.markAnalysisCourseVisited()
        }
        const nextPage = this.pages[this.pageIndex + 1]
        this.unlockStage(nextPage.stageIndex)
        this.pageIndex += 1
        this.scrollToTop()
        this.saveSnapshot()
      }
    },
    markAnalysisCourseVisited() {
      if (!this.visitedCourses.includes('analysis')) {
        this.visitedCourses = [...this.visitedCourses, 'analysis']
        markMathCourseVisited('analysis')
        this.saveSnapshot()
      }
    },
    startAnalysisChallenge(card) {
      if (card.locked) {
        uni.showToast({ title: card.unlockHint || '请先完成上一关', icon: 'none' })
        return
      }
      this.markAnalysisCourseVisited()
      uni.navigateTo({ url: `/pages/math/challenge?task=${card.id}` })
    },
    selectBranch(branch) {
      this.selectedBranchId = branch.id
      this.selectedBranchTitle = branch.title
      this.saveSnapshot()
    },
    selectFit(value) {
      this.fitChoice = value
      this.saveSnapshot()
    },
    goReadCourse(courseId) {
      if (!this.visitedCourses.includes(courseId)) {
        this.visitedCourses = [...this.visitedCourses, courseId]
        markMathCourseVisited(courseId)
        this.saveSnapshot()
      }
      uni.navigateTo({ url: `/subpkg/math/course?course=${courseId}` })
    },
    finishExperience() {
      if (!this.selectedBranchId) {
        uni.showToast({ title: '请先选择方向', icon: 'none' })
        return
      }
      if (!this.fitChoice) {
        uni.showToast({ title: '请先完成适配判断', icon: 'none' })
        return
      }
      if (this.completed) {
        uni.navigateBack()
        return
      }
      markMajorExplored('math-u')
      this.completed = true
      this.saveSnapshot()
      uni.showToast({ title: '数学专业体验完成', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 800)
    },
  },
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100vh; background: #f4f7fb; }
.topbar { background: linear-gradient(135deg, #007a66, #00a88d); padding: 40rpx 28rpx 24rpx; }
.topbar-row { display: flex; align-items: baseline; gap: 16rpx; }
.topbar-title { font-size: 34rpx; font-weight: 700; color: #fff; }
.topbar-en { font-size: 22rpx; color: rgba(255,255,255,0.82); }
.page-indicator { display: block; margin-top: 12rpx; font-size: 22rpx; color: rgba(255,255,255,0.9); }
.steps { display: flex; justify-content: space-between; margin-top: 20rpx; gap: 8rpx; }
.step-dot { display: flex; flex-direction: column; align-items: center; gap: 8rpx; flex: 1; }
.step-index { width: 38rpx; height: 38rpx; line-height: 38rpx; text-align: center; border-radius: 50%; font-size: 18rpx; font-weight: 700; background: rgba(255,255,255,0.28); color: #fff; }
.step-dot-active .step-index { background: #fff; color: #007a66; }
.step-dot-done .step-index { background: rgba(255,255,255,0.88); color: #007a66; }
.step-dot-locked .step-index { opacity: 0.45; }
.step-label { font-size: 18rpx; color: rgba(255,255,255,0.92); text-align: center; }
.body { flex: 1; padding: 24rpx; box-sizing: border-box; }
.stage { padding-bottom: 24rpx; }
.hero-image { width: 100%; border-radius: 18rpx; margin-bottom: 20rpx; background: #eef2f7; }
.stage-intro { display: block; font-size: 24rpx; line-height: 1.75; color: #4b5563; margin-bottom: 20rpx; }
.catalog-card { border: 2rpx solid #e5e7eb; border-radius: 18rpx; overflow: hidden; margin-bottom: 18rpx; background: #fff; }
.catalog-image { width: 100%; background: #f8fafc; }
.catalog-copy { padding: 22rpx; }
.catalog-index { display: block; font-size: 20rpx; font-weight: 700; color: #007a66; margin-bottom: 8rpx; }
.catalog-title { display: block; font-size: 28rpx; font-weight: 700; color: #1a2e2b; }
.catalog-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #6b7280; }
.completion-card, .finish-card { background: #fff; border-radius: 24rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 14rpx 38rpx rgba(15,23,42,0.05); }
.completion-badge { display: inline-block; padding: 8rpx 16rpx; border-radius: 999rpx; background: #ecfdf5; color: #047857; font-size: 20rpx; font-weight: 700; }
.completion-title { display: block; margin-top: 16rpx; font-size: 32rpx; font-weight: 700; color: #162033; }
.completion-desc { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.75; color: #566070; }
.next-stage-card { margin-top: 22rpx; padding: 22rpx; border-radius: 18rpx; background: #f8fbff; }
.next-stage-label { display: block; font-size: 20rpx; color: #64748b; }
.next-stage-title { display: block; margin-top: 8rpx; font-size: 28rpx; font-weight: 700; color: #007a66; }
.next-stage-desc { display: block; margin-top: 10rpx; font-size: 22rpx; line-height: 1.65; color: #64748b; }
.course-panel, .article-panel { background: #fff; border-radius: 24rpx; padding: 28rpx; box-shadow: 0 14rpx 38rpx rgba(15,23,42,0.05); }
.course-head { margin-bottom: 16rpx; }
.course-flag { display: inline-block; padding: 6rpx 14rpx; border-radius: 999rpx; background: #ecfdf5; color: #047857; font-size: 20rpx; font-weight: 700; margin-bottom: 12rpx; }
.course-title { display: block; font-size: 32rpx; font-weight: 700; color: #162033; }
.course-sub { display: block; margin-top: 8rpx; font-size: 24rpx; color: #64748b; }
.course-preview { display: block; margin-top: 18rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }
.course-meta, .course-meta-inline { display: block; margin-top: 12rpx; font-size: 22rpx; color: #94a3b8; }
.action-row { display: flex; gap: 16rpx; margin-top: 24rpx; }
.btn-inline { flex: 1; height: 72rpx; line-height: 72rpx; border-radius: 999rpx; background: #eef2f7; color: #007a66; font-size: 24rpx; font-weight: 700; border: none; }
.btn-inline-accent { background: #007a66; color: #fff; }
.visited-tag { display: inline-block; margin-top: 16rpx; font-size: 20rpx; font-weight: 700; color: #007a66; }
.course-card { background: #fff; border-radius: 18rpx; padding: 22rpx; margin-bottom: 14rpx; border: 2rpx solid #e5e7eb; }
.branch-card { background: #fff; border-radius: 18rpx; padding: 22rpx; margin-bottom: 16rpx; border: 2rpx solid #e5e7eb; }
.branch-card-active { border-color: #007a66; background: #f0faf8; }
.branch-head { display: flex; justify-content: space-between; align-items: center; }
.branch-title { font-size: 28rpx; font-weight: 700; color: #162033; }
.branch-check { font-size: 20rpx; color: #007a66; font-weight: 700; }
.branch-subtitle { display: block; margin-top: 8rpx; font-size: 22rpx; color: #007a66; }
.branch-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }
.branch-tags { display: flex; flex-wrap: wrap; gap: 10rpx; margin-top: 14rpx; }
.branch-tag { padding: 8rpx 16rpx; border-radius: 999rpx; background: #ecfdf5; font-size: 20rpx; color: #047857; }
.branch-fit { display: block; margin-top: 12rpx; font-size: 21rpx; color: #475569; font-weight: 600; }
.article-title { display: block; font-size: 32rpx; font-weight: 700; color: #162033; }
.article-sub { display: block; margin-top: 10rpx; font-size: 24rpx; color: #64748b; }
.article-paragraph { display: block; margin-top: 18rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }
.interaction-panel { margin-top: 24rpx; padding: 22rpx; border-radius: 18rpx; background: #f8fbff; }
.interaction-title { display: block; font-size: 26rpx; font-weight: 700; color: #162033; }
.interaction-goal { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }
.task-line { display: block; margin-top: 12rpx; font-size: 22rpx; color: #007a66; font-weight: 600; }
.role-row { display: flex; gap: 10rpx; margin-top: 14rpx; }
.role-dot { color: #007a66; font-size: 28rpx; }
.role-text { flex: 1; font-size: 24rpx; line-height: 1.65; color: #475569; }
.finish-title { display: block; font-size: 30rpx; font-weight: 700; color: #162033; }
.finish-desc { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }
.summary-card { margin-top: 18rpx; padding: 18rpx; border-radius: 16rpx; background: #f8fafc; }
.summary-line { display: block; font-size: 23rpx; color: #475569; line-height: 1.6; }
.fit-option { margin-top: 16rpx; padding: 20rpx; border-radius: 18rpx; background: #f5f8fc; border: 2rpx solid transparent; }
.fit-option-active { border-color: #007a66; background: #ecfdf5; }
.fit-option-text { font-size: 24rpx; color: #334155; font-weight: 600; line-height: 1.6; }
.footer { display: flex; gap: 16rpx; padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -8rpx 28rpx rgba(15,23,42,0.06); }
.btn-ghost, .btn-primary { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; font-size: 28rpx; font-weight: 700; }
.btn-ghost { background: #eef2f7; color: #007a66; }
.btn-primary { background: #007a66; color: #fff; }
.btn-primary[disabled] { opacity: 0.45; }
.article-panel-flat { box-shadow: none; padding: 0; }
.inline-course-title { display: block; text-align: center; font-size: 36rpx; font-weight: 700; color: #102033; }
.inline-course-sub { display: block; text-align: center; margin-top: 12rpx; font-size: 24rpx; color: #64748b; margin-bottom: 28rpx; }
.article-section { margin-top: 36rpx; padding-top: 28rpx; border-top: 2rpx solid #eef2f7; }
.section-role { display: block; font-size: 20rpx; color: #007a66; font-weight: 700; margin-bottom: 10rpx; }
.article-section-title { display: block; font-size: 30rpx; font-weight: 700; color: #162033; line-height: 1.5; }
.formula-card { margin-top: 18rpx; padding: 20rpx; border-radius: 16rpx; background: #f0faf8; }
.formula-math { display: block; font-size: 24rpx; color: #007a66; line-height: 1.6; font-family: monospace; }
.formula-note { display: block; margin-top: 10rpx; font-size: 22rpx; color: #64748b; line-height: 1.6; }
.section-image { width: 100%; margin-top: 18rpx; border-radius: 16rpx; background: #f8fafc; }
.figure-caption { display: block; margin-top: 10rpx; font-size: 22rpx; color: #94a3b8; text-align: center; }
.challenge-section { margin-top: 48rpx; padding-top: 32rpx; border-top: 4rpx solid #007a66; }
.challenge-section-title { display: block; font-size: 30rpx; font-weight: 700; color: #162033; margin-bottom: 24rpx; }
.challenge-entry-card { display: flex; flex-direction: column; background: #fff; border-radius: 20rpx; overflow: hidden; margin-bottom: 20rpx; border: 2rpx solid #e5e7eb; }
.challenge-entry-locked { opacity: 0.72; background: #f8fafc; }
.challenge-entry-done { border-color: #007a66; }
.challenge-entry-image { width: 100%; background: #f8fafc; }
.challenge-entry-copy { padding: 22rpx; }
.challenge-entry-head { display: flex; align-items: center; gap: 12rpx; margin-bottom: 10rpx; }
.challenge-entry-seq { font-size: 20rpx; font-weight: 700; color: #007a66; }
.challenge-entry-status { font-size: 20rpx; font-weight: 700; color: #047857; }
.challenge-entry-status-lock { color: #94a3b8; }
.challenge-entry-title { display: block; font-size: 28rpx; font-weight: 700; color: #162033; }
.challenge-entry-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }
.challenge-entry-hint { display: block; margin-top: 12rpx; font-size: 22rpx; color: #ef4444; }
.challenge-entry-action { display: block; margin-top: 14rpx; font-size: 22rpx; font-weight: 700; color: #007a66; }
</style>
