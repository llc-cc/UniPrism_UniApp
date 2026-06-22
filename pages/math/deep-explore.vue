<template>
  <view class="page">
    <view class="stage-card" @tap="handleContinue">
      <view class="card-body">
        <text class="card-title">{{ currentStageLabel }}</text>
        <text class="card-desc">{{ currentStageMeta }}</text>
      </view>
      <view class="card-divider" />
      <view class="card-doc" @tap.stop="navigateToProgress">
        <view class="card-doc-paper">
          <view class="card-doc-line" />
          <view class="card-doc-line card-doc-line--short" />
          <view class="card-doc-line" />
        </view>
      </view>
    </view>

    <view class="roadmap">
      <image class="road-img" src="/static/assets/math/math-road.svg" mode="scaleToFill" />
      <image
        v-if="progressRoadSrc"
        class="road-img road-progress"
        :src="progressRoadSrc"
        mode="scaleToFill"
      />

      <view class="map-connector connector-intro" :class="connectorClass('intro')" />
      <view class="map-connector connector-foundation" :class="connectorClass('foundation')" />
      <view class="map-connector connector-advanced" :class="connectorClass('advanced')" />
      <view class="map-connector connector-branch" :class="connectorClass('branch')" />

      <view class="lock-badge" @tap="handleLockBadgeTap">
        <view class="lock-glyph" aria-hidden="true">
          <image class="lock-glyph-top" src="/static/assets/discover/road-lock-top.svg" mode="aspectFit" />
          <image class="lock-glyph-body" src="/static/assets/discover/road-lock-body.svg" mode="aspectFit" />
        </view>
      </view>

      <view class="map-arrow arrow-intro" :class="isRoadNodeActive('intro') ? 'arrow--teal' : 'arrow--gray'" @tap="openStage('intro')">
        <image class="map-arrow-bg" :src="arrowAsset('intro')" mode="scaleToFill" />
        <text class="map-arrow-text">数学专业介绍</text>
      </view>
      <view class="map-icon icon-intro">
        <image
          class="map-icon-sprite"
          :src="resolveAsset(roadmapAssets.stageSprite)"
          :style="spriteCropStyle('intro')"
          mode="scaleToFill"
        />
      </view>

      <button class="map-cta map-cta--continue action-btn" @tap="handleContinue">
        <image class="action-bg" src="/static/assets/math/continue-bubble-down-cyan.svg" mode="scaleToFill" />
        <text class="action-text">继续探索</text>
      </button>

      <view class="map-arrow arrow-foundation" :class="isRoadNodeActive('foundation') ? 'arrow--teal' : 'arrow--gray'" @tap="openStage('foundation')">
        <image class="map-arrow-bg" :src="arrowAsset('foundation')" mode="scaleToFill" />
        <text class="map-arrow-text">三门基础课程</text>
      </view>
      <view class="map-icon icon-foundation">
        <image
          class="map-icon-sprite"
          :src="resolveAsset(roadmapAssets.stageSprite)"
          :style="spriteCropStyle('foundation')"
          mode="scaleToFill"
        />
      </view>

      <view class="map-arrow arrow-advanced map-arrow--mirror" :class="isRoadNodeActive('advanced') ? 'arrow--teal' : 'arrow--gray'" @tap="openStage('advanced')">
        <image class="map-arrow-bg" :src="arrowAsset('advanced')" mode="scaleToFill" />
        <text class="map-arrow-text">三门进阶课程</text>
      </view>
      <view class="map-icon icon-advanced">
        <image
          class="map-icon-sprite"
          :src="resolveAsset(roadmapAssets.stageSprite)"
          :style="spriteCropStyle('advanced')"
          mode="scaleToFill"
        />
      </view>

      <view class="map-arrow arrow-branch" :class="isRoadNodeActive('branch') ? 'arrow--teal' : 'arrow--gray'" @tap="openStage('branch')">
        <image class="map-arrow-bg" :src="arrowAsset('branch')" mode="scaleToFill" />
        <text class="map-arrow-text">数学专业分流</text>
      </view>
      <view class="map-icon icon-branch">
        <image
          class="map-icon-sprite"
          :src="resolveAsset(roadmapAssets.stageSprite)"
          :style="spriteCropStyle('branch')"
          mode="scaleToFill"
        />
      </view>

      <view class="map-icon icon-finish">
        <image
          class="map-icon-checklist"
          :src="resolveAsset(roadmapAssets.completeChecklist)"
          mode="aspectFit"
        />
      </view>

      <view class="map-arrow arrow-finish map-arrow--mirror" :class="isRoadNodeActive('finish') ? 'arrow--teal' : 'arrow--gray'" @tap="openStage('finish')">
        <image class="map-arrow-bg" :src="arrowAsset('finish')" mode="scaleToFill" />
        <text class="map-arrow-text">体验完成</text>
      </view>
    </view>

    <view class="page-bottom-fill" aria-hidden="true" />
    <view class="page-safe-cover" aria-hidden="true" />

    <!-- 未解锁提示顶部浮层 -->
    <view v-if="lockPromptVisible" class="lock-prompt-mask" @tap="closeLockPrompt">
      <view class="lock-prompt" @tap.stop>
        <text class="lock-prompt-title">请先完成前置阶段</text>
        <view class="lock-prompt-card">
          <view class="lock-prompt-icon-wrap">
            <view class="lock-glyph lock-glyph--prompt" aria-hidden="true">
              <image class="lock-glyph-top" src="/static/assets/discover/road-lock-top.svg" mode="aspectFit" />
              <image class="lock-glyph-body" src="/static/assets/discover/road-lock-body.svg" mode="aspectFit" />
            </view>
          </view>
          <view class="lock-prompt-copy">
            <text class="lock-prompt-stage">{{ lockPromptStageLabel }}</text>
            <text class="lock-prompt-hint">{{ lockPromptHint }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { markMajorExplored } from '../../business/explore-progress'
import { loadMathProgress } from '../../business/math-progress'
import {
  MATH_ROADMAP_ASSETS,
  MATH_ROADMAP_STAGES,
  buildSpriteCropStyle,
} from '../../business/math-roadmap-config'
import { buildMathSpeedPages } from '../../business/math-speed-pages'
import { resolveAsset } from '../../utils/asset-map'

const STAGE_INDEX = { intro: 0, foundation: 1, advanced: 2, branch: 3, finish: 4 }
const STAGE_LABELS = MATH_ROADMAP_STAGES.map((stage) => stage.label)
export default {
  data() {
    return {
      unlockedStageIndexes: [0],
      unlockedPageIndex: 0,
      pageIndex: 0,
      selectedBranchId: 'basic',
      completed: false,
      lockPromptVisible: false,
      lockPromptStageLabel: '',
      lockPromptHint: '',
    }
  },
  computed: {
    currentStageIndex() {
      if (this.completed) return 4
      const pages = buildMathSpeedPages(this.selectedBranchId)
      const safeIndex = Math.max(0, Math.min(this.pageIndex, pages.length - 1))
      return pages[safeIndex]?.stageIndex ?? 0
    },
    currentStageLabel() {
      const stage = MATH_ROADMAP_STAGES[this.currentStageIndex] || MATH_ROADMAP_STAGES[0]
      const label = stage.experienceLabel || stage.label
      return `${stage.phase}：${label}`
    },
    currentStageMeta() {
      const stage = MATH_ROADMAP_STAGES[this.currentStageIndex] || MATH_ROADMAP_STAGES[0]
      const pageCount = this.currentStagePageCount
      return pageCount > 0 ? `${stage.durationHint} · ${pageCount}步` : stage.durationHint
    },
    currentStagePageCount() {
      const range = this.stageRanges.find((item) => item.stageIndex === this.currentStageIndex)
      return range ? range.endIndex - range.startIndex + 1 : 0
    },
    roadmapAssets() {
      return MATH_ROADMAP_ASSETS
    },
    progressRoadSrc() {
      const stageIndex = Math.max(0, Math.min(this.currentStageIndex, 4))
      return `/static/assets/math/math-road-progress-${stageIndex + 1}.svg`
    },
    stageRanges() {
      const ranges = []
      buildMathSpeedPages(this.selectedBranchId).forEach((page, index) => {
        const stageIndex = page.stageIndex || 0
        const last = ranges[ranges.length - 1]
        if (last && last.stageIndex === stageIndex) {
          last.endIndex = index
        } else {
          ranges.push({ stageIndex, startIndex: index, endIndex: index })
        }
      })
      return ranges
    },
  },
  onShow() {
    const p = loadMathProgress()
    this.unlockedStageIndexes = p.unlockedStageIndexes || [0]
    this.unlockedPageIndex = typeof p.unlockedPageIndex === 'number' ? p.unlockedPageIndex : 0
    this.pageIndex = typeof p.pageIndex === 'number' ? p.pageIndex : 0
    this.selectedBranchId = p.selectedBranchId || 'basic'
    this.completed = Boolean(p.completed)
  },
  onLoad() {
    uni.setNavigationBarTitle({ title: '数学' })
  },
  methods: {
    resolveAsset,
    arrowAsset(stage) {
      return this.isRoadNodeActive(stage)
        ? '/static/assets/math/math-stage-arrow-active.svg'
        : '/static/assets/math/math-stage-arrow-locked.svg'
    },
    spriteCropStyle(stageKey) {
      return buildSpriteCropStyle(stageKey)
    },
    isStageUnlocked(stageIndex) {
      const range = this.stageRanges.find((item) => item.stageIndex === stageIndex)
      return Boolean(range && range.startIndex <= this.unlockedPageIndex)
    },
    connectorClass(stage) {
      return this.isRoadNodeActive(stage) ? 'map-connector--completed' : 'map-connector--pending'
    },
    isRoadNodeActive(stage) {
      const stageIndex = STAGE_INDEX[stage] ?? 0
      return stageIndex <= this.currentStageIndex
    },
    isStageCompleted(stageIndex) {
      const range = this.stageRanges.find((item) => item.stageIndex === stageIndex)
      return Boolean(range && this.unlockedPageIndex > range.endIndex)
    },
    getLockedPromptCopy(targetStageIndex) {
      const blockedLabels = STAGE_LABELS
        .slice(0, Math.max(0, targetStageIndex))
        .filter((_, index) => !this.isStageCompleted(index))

      if (blockedLabels.length > 0) {
        return {
          stageLabel: blockedLabels.join('、'),
          hint: blockedLabels.length > 1 ? '请先完成以上阶段，完成后即可进入当前阶段' : '请先完成该阶段，完成后即可进入当前阶段',
        }
      }

      return {
        stageLabel: STAGE_LABELS[targetStageIndex] || '当前阶段',
        hint: '请先按顺序完成当前阶段内容',
      }
    },
    showLockPrompt(targetStageIndex) {
      const copy = this.getLockedPromptCopy(targetStageIndex)
      this.lockPromptStageLabel = copy.stageLabel
      this.lockPromptHint = copy.hint
      this.lockPromptVisible = true
    },
    closeLockPrompt() {
      this.lockPromptVisible = false
    },
    isUnlocked(stage) {
      const idx = STAGE_INDEX[stage] ?? 0
      return this.isStageUnlocked(idx)
    },
    handleContinue() {
      const pageIndex = Math.max(0, this.pageIndex)
      uni.navigateTo({ url: `/pages/math/index?pageIndex=${pageIndex}` })
    },
    navigateToProgress() {
      uni.navigateTo({ url: '/pages/math/progress' })
    },
    getLockBadgeTargetStageIndex() {
      for (let stageIndex = 1; stageIndex < STAGE_LABELS.length; stageIndex += 1) {
        if (!this.isStageUnlocked(stageIndex)) return stageIndex
      }
      return null
    },
    handleLockBadgeTap() {
      const targetStageIndex = this.getLockBadgeTargetStageIndex()
      if (targetStageIndex === null) return
      this.showLockPrompt(targetStageIndex)
    },
    openStage(stage) {
      const idx = STAGE_INDEX[stage] ?? 0
      if (!this.isStageUnlocked(idx)) {
        this.showLockPrompt(idx)
        return
      }
      const range = this.stageRanges.find((item) => item.stageIndex === idx)
      const pageIndex = range?.startIndex ?? 0
      uni.navigateTo({ url: `/pages/math/index?pageIndex=${pageIndex}` })
    },
    completeExplore() {
      markMajorExplored('math-u')
      uni.showToast({ title: '已完成数学体验', icon: 'success' })
    },
  },
}
</script>

<style>
page {
  background-color: #f8fafc;
  height: 100%;
}
</style>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 0 28rpx 0;
  box-sizing: border-box;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.stage-card {
  display: flex;
  align-items: center;
  height: 118rpx;
  margin-top: 18rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: #4dc7c2;
}

.card-body {
  flex: 1;
  padding: 0 30rpx;
}

.card-title {
  display: block;
  color: #ffffff;
  font-size: 29rpx;
  font-weight: 800;
  line-height: 1.35;
}

.card-desc {
  display: block;
  margin-top: 6rpx;
  color: rgba(255, 255, 255, 0.88);
  font-size: 22rpx;
  font-weight: 600;
}

.card-divider {
  width: 4rpx;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
}

.card-doc {
  width: 78rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.card-doc-paper {
  width: 28rpx;
  height: 34rpx;
  border: 4rpx solid #ffffff;
  border-radius: 4rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4rpx;
  padding: 0 4rpx;
}

.card-doc-line {
  width: 14rpx;
  height: 3rpx;
  border-radius: 999rpx;
  background: #ffffff;
}

.card-doc-line--short {
  width: 10rpx;
}

.roadmap {
  position: relative;
  width: 750rpx;
  height: 1200rpx;
  margin-left: -28rpx;
  margin-top: 4rpx;
  overflow: hidden;
  flex-shrink: 0;
}

.page-bottom-fill {
  flex: 1;
  min-height: 0;
  margin-left: -28rpx;
  width: 750rpx;
  background: #f8fafc;
}

.page-safe-cover {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: constant(safe-area-inset-bottom);
  height: env(safe-area-inset-bottom);
  background: #f8fafc;
  pointer-events: none;
  z-index: 5;
}

.road-img {
  position: absolute;
  left: 0;
  top: -10rpx;
  width: 750rpx;
  height: 1220rpx;
  pointer-events: none;
  z-index: 1;
}

.road-progress {
  z-index: 2;
}

.map-connector {
  position: absolute;
  width: 35rpx;
  height: 126rpx;
  background: #cfcfd1;
  z-index: 4;
}

.map-connector--completed {
  background: #d6eded;
}

.map-connector--pending {
  background: #cfcfd1;
}

.connector-intro {
  left: 118rpx;
  top: 78rpx;
}

.connector-foundation {
  left: 572rpx;
  top: 392rpx;
}

.connector-advanced {
  left: 304rpx;
  top: 626rpx;
}

.connector-branch {
  left: 140rpx;
  top: 908rpx;
}

.map-arrow {
  position: absolute;
  width: 206rpx;
  height: 102rpx;
  z-index: 6;
}

.map-arrow-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.map-arrow--mirror .map-arrow-bg {
  transform: scaleX(-1);
}

.map-arrow-text {
  position: absolute;
  left: 0;
  right: 0;
  top: 24rpx;
  color: #ffffff;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 1.8;
  text-align: center;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.18);
  z-index: 3;
}

.arrow--gray .map-arrow-text {
  font-size: 24rpx;
}

.arrow-intro {
  left: 54rpx;
  top: 12rpx;
}

.arrow-foundation {
  right: 34rpx;
  top: 320rpx;
}

.arrow-advanced {
  left: 262rpx;
  top: 530rpx;
}

.arrow-branch {
  left: 54rpx;
  top: 812rpx;
}

.arrow-finish {
  right: 58rpx;
  top: 942rpx;
}

.map-icon {
  position: absolute;
  z-index: 5;
  overflow: hidden;
  filter: drop-shadow(0 8rpx 10rpx rgba(65, 147, 139, 0.14));
}

.map-icon-sprite,
.map-icon-checklist {
  display: block;
}

.map-icon-checklist {
  width: 100%;
  height: 100%;
}

.icon-intro {
  left: 70rpx;
  top: 116rpx;
  width: 166rpx;
  height: 166rpx;
}

.icon-foundation {
  right: 74rpx;
  top: 428rpx;
  width: 184rpx;
  height: 150rpx;
}

.icon-advanced {
  left: 224rpx;
  top: 642rpx;
  width: 194rpx;
  height: 154rpx;
}

.icon-branch {
  left: 80rpx;
  top: 936rpx;
  width: 178rpx;
  height: 146rpx;
}

.icon-finish {
  right: 96rpx;
  top: 958rpx;
  width: 132rpx;
  height: 132rpx;
  overflow: visible;
}

.lock-badge {
  position: absolute;
  right: 34rpx;
  top: 16rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #eef8ff;
  border: 4rpx solid #bfe7ff;
  box-shadow: 0 6rpx 16rpx rgba(80, 160, 220, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 8;
}

.lock-glyph {
  position: relative;
  width: 34rpx;
  height: 34rpx;
}

.lock-glyph-top,
.lock-glyph-body {
  position: absolute;
  display: block;
}

.lock-glyph-top {
  left: 10rpx;
  top: 0;
  width: 14rpx;
  height: 12rpx;
}

.lock-glyph-body {
  left: 3rpx;
  top: 9rpx;
  width: 28rpx;
  height: 24rpx;
}

.action-btn {
  position: absolute;
  border: 0;
  padding: 0;
  background: transparent;
  z-index: 9;
}

.action-btn::after {
  border: 0;
}

.map-cta {
  position: absolute;
  box-sizing: border-box;
}

.map-cta--continue {
  left: 292rpx;
  top: 258rpx;
  width: 190rpx;
  height: 78rpx;
  border: 0;
  padding: 0;
  background: transparent;
}

.map-cta--continue::after {
  border: 0;
}

.action-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.action-text {
  position: absolute;
  left: 0;
  right: 0;
  top: 4rpx;
  color: #ffffff;
  font-size: 25rpx;
  font-weight: 900;
  line-height: 1.8;
  text-align: center;
  z-index: 2;
  text-shadow:
    0 3rpx 0 rgba(28, 132, 126, 0.58),
    0 -3rpx 0 rgba(28, 132, 126, 0.58),
    3rpx 0 0 rgba(28, 132, 126, 0.58),
    -3rpx 0 0 rgba(28, 132, 126, 0.58);
}

/* lock prompt */
.lock-prompt-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.28);
  z-index: 40;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: calc(130rpx + env(safe-area-inset-top)) 24rpx 48rpx;
  box-sizing: border-box;
}
.lock-prompt {
  width: 100%;
  max-width: 680rpx;
  background: #ffffff;
  border-radius: 28rpx;
  padding: 36rpx 32rpx 32rpx;
  box-sizing: border-box;
  box-shadow: 0 24rpx 64rpx rgba(15, 23, 42, 0.14);
}
.lock-prompt-title {
  display: block;
  font-size: 34rpx;
  line-height: 1.5;
  color: #1c1c3a;
  font-weight: 700;
}
.lock-prompt-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx 24rpx;
  border-radius: 20rpx;
  background: #f3f4f6;
  margin-top: 28rpx;
  box-sizing: border-box;
}
.lock-prompt-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #d8dbe3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.lock-glyph {
  position: relative;
  width: 34rpx;
  height: 34rpx;
}
.lock-glyph-top,
.lock-glyph-body {
  position: absolute;
  display: block;
}
.lock-glyph-top {
  left: 10rpx;
  top: 0;
  width: 14rpx;
  height: 12rpx;
  transform-origin: 2rpx 100%;
}
.lock-glyph-body {
  left: 3rpx;
  top: 9rpx;
  width: 28rpx;
  height: 24rpx;
}
.lock-glyph--prompt {
  width: 44rpx;
  height: 44rpx;
}
.lock-glyph--prompt .lock-glyph-top {
  position: absolute;
  left: 13rpx;
  top: 2rpx;
  width: 18rpx;
  height: 16rpx;
}
.lock-glyph--prompt .lock-glyph-body {
  left: 4rpx;
  top: 12rpx;
  width: 36rpx;
  height: 30rpx;
}
.lock-prompt-copy { flex: 1; min-width: 0; }
.lock-prompt-stage { display: block; font-size: 32rpx; line-height: 1.45; font-weight: 700; color: #4b5565; }
.lock-prompt-hint { display: block; margin-top: 8rpx; font-size: 24rpx; line-height: 1.6; color: #8b93a3; }
</style>
