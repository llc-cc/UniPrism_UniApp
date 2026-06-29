<template>
  <scroll-view class="page" :class="{ 'page--science': isScienceCollege, 'page--business': isBusinessCollege }" scroll-y>
    <view v-if="subjects.length === 0" class="empty">
      <text class="empty-text">该学院内容暂未开放</text>
    </view>

    <!-- Figma 506:9919 / 600:5792 理学院四专业列表 -->
    <view v-else-if="isScienceCollege" class="science-list">
      <view
        v-for="subject in subjects"
        :key="subject.id"
        class="science-row"
        :class="{ 'science-row--locked': !isUnlocked(subject.id) }"
        @tap="explore(subject)"
      >
        <view class="science-row-fallback" :style="{ background: scienceGradient }" />
        <image
          class="science-row-bg"
          :class="{ 'science-row-bg--loaded': bgReady }"
          :src="resolveAsset(scienceAssets.rowBg)"
          mode="aspectFill"
          @load="markBgReady"
          @error="markBgFailed"
        />
        <image
          class="science-row-wave"
          :src="resolveAsset(scienceAssets.rowWave)"
          mode="scaleToFill"
        />
        <image
          class="science-row-icon"
          :src="resolveAsset(subject.icon)"
          mode="aspectFit"
        />
        <view class="science-row-text">
          <text class="science-row-cn">{{ subject.cn }}</text>
          <text class="science-row-en">{{ subject.en }}</text>
        </view>
        <view class="science-row-action" :class="{ 'science-row-action--locked': !isUnlocked(subject.id) }">
          <text class="science-row-action-text">{{ isUnlocked(subject.id) ? '深入探索' : '未开放' }}</text>
        </view>
      </view>
    </view>

    <!-- Figma 529:18565 商学院专业列表 -->
    <view v-else-if="isBusinessCollege" class="science-list business-list">
      <view
        v-for="subject in subjects"
        :key="subject.id"
        class="science-row business-row"
        :class="{ 'science-row--locked': !isUnlocked(subject.id) }"
        @tap="explore(subject)"
      >
        <view class="science-row-fallback" :style="{ background: businessGradient }" />
        <image
          class="science-row-bg"
          :class="{ 'science-row-bg--loaded': bgReady }"
          :src="resolveAsset(businessAssets.rowBg)"
          mode="aspectFill"
          @load="markBgReady"
          @error="markBgFailed"
        />
        <image
          class="science-row-wave"
          :src="resolveAsset(businessAssets.rowWave)"
          mode="scaleToFill"
        />
        <image
          class="science-row-icon"
          :src="resolveAsset(subject.icon)"
          mode="aspectFit"
        />
        <view class="science-row-text">
          <text class="science-row-cn">{{ subject.cn }}</text>
          <text class="science-row-en">{{ subject.en }}</text>
        </view>
        <view class="science-row-action" :class="{ 'science-row-action--locked': !isUnlocked(subject.id) }">
          <text class="science-row-action-text">{{ isUnlocked(subject.id) ? '深入探索' : '敬请期待' }}</text>
        </view>
      </view>
    </view>

    <!-- 其他学院沿用通用列表 -->
    <view v-else class="list">
      <view v-for="s in subjects" :key="s.id" class="subject-card" @tap="explore(s)">
        <view class="subject-icon-wrap">
          <text class="subject-icon">{{ s.icon }}</text>
        </view>
        <view class="subject-info">
          <text class="subject-cn">{{ s.cn }}</text>
          <text class="subject-en">{{ s.en }}</text>
        </view>
        <view class="explore-btn">
          <text class="explore-btn-text">深入探索</text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { navigateToMajor } from '../../business/major-routes'
import {
  guardMajorExperienceCollegeNavigation,
  guardMajorExperienceNavigation,
} from '../../business/disabled-miniapp-routes'
import {
  isScienceMajorUnlocked,
  SCIENCE_COLLEGE_ASSETS,
  SCIENCE_COLLEGE_SUBJECTS,
  SCIENCE_ROW_GRADIENT,
} from './business/science-college-config'
import {
  isBusinessMajorUnlocked,
  BUSINESS_COLLEGE_ASSETS,
  BUSINESS_COLLEGE_SUBJECTS,
  BUSINESS_ROW_GRADIENT,
} from './business/business-college-config'
import { resolveAsset } from '../../utils/asset-map'

const COLLEGE_SUBJECTS = {
  science: SCIENCE_COLLEGE_SUBJECTS,
  engineering: [
    { id: 'mech-u', cn: '机械工程', en: 'Mechanical Engineering', icon: '⚙️' },
    { id: 'ee-u', cn: '电子电气工程', en: 'Electrical Engineering', icon: '⚡' },
    { id: 'ic-u', cn: '集成电路', en: 'Integrated Circuit Engineering', icon: '🔌' },
  ],
  computer: [
    { id: 'cs-u', cn: '计算机科学', en: 'Computer Science', icon: '💻' },
    { id: 'ai-u', cn: '人工智能', en: 'Artificial Intelligence', icon: '🤖' },
  ],
  business: BUSINESS_COLLEGE_SUBJECTS,
}

export default {
  data() {
    return {
      collegeId: '',
      collegeLabel: '',
      subjects: [],
      scienceAssets: SCIENCE_COLLEGE_ASSETS,
      scienceGradient: SCIENCE_ROW_GRADIENT,
      businessAssets: BUSINESS_COLLEGE_ASSETS,
      businessGradient: BUSINESS_ROW_GRADIENT,
      bgReady: false,
    }
  },
  computed: {
    isScienceCollege() {
      return this.collegeId === 'science'
    },
    isBusinessCollege() {
      return this.collegeId === 'business'
    },
  },
  onLoad(options) {
    if (guardMajorExperienceNavigation()) {
      setTimeout(() => uni.navigateBack(), 300)
      return
    }
    this.collegeId = options.id || ''
    if (guardMajorExperienceCollegeNavigation(this.collegeId)) {
      setTimeout(() => uni.navigateBack(), 300)
      return
    }
    this.collegeLabel = decodeURIComponent(options.label || '')
    this.subjects = COLLEGE_SUBJECTS[this.collegeId] || []
    if (this.collegeLabel) {
      uni.setNavigationBarTitle({ title: this.collegeLabel })
    }
  },
  methods: {
    resolveAsset,
    markBgReady() {
      this.bgReady = true
    },
    markBgFailed() {
      this.bgReady = false
    },
    isUnlocked(majorId) {
      if (this.isScienceCollege) return isScienceMajorUnlocked(majorId)
      if (this.isBusinessCollege) return isBusinessMajorUnlocked(majorId)
      return true
    },
    explore(subject) {
      if (!subject?.id) return
      if ((this.isScienceCollege || this.isBusinessCollege) && !this.isUnlocked(subject.id)) {
        uni.showToast({ title: '该专业暂未开放', icon: 'none' })
        return
      }
      navigateToMajor(subject.id)
    },
  },
}
</script>

<style>
page {
  background-color: #ffffff;
}
</style>

<style scoped>
.page {
  min-height: 100vh;
  background: #ffffff;
}

.page--science,
.page--business {
  background: #ffffff;
}

.business-list {
  padding-top: 36rpx;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #9ca3af;
}

/* —— Figma 理学院专业行 —— */
.science-list {
  padding: 36rpx 32rpx 48rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.science-row {
  position: relative;
  min-height: 240rpx;
  border-radius: 44rpx;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.16);
  display: flex;
  align-items: center;
  padding: 28rpx 224rpx 28rpx 30rpx;
  box-sizing: border-box;
}

.science-row-fallback {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.science-row-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
}

.science-row-bg--loaded {
  opacity: 0.47;
}

.science-row-wave {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.72;
  z-index: 1;
  pointer-events: none;
}

.science-row-icon {
  position: relative;
  z-index: 2;
  width: 124rpx;
  height: 124rpx;
  flex: 0 0 auto;
}

.science-row-text {
  position: relative;
  z-index: 2;
  min-width: 0;
  margin-left: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8rpx;
}

.science-row-cn {
  color: #000000;
  font-size: 44rpx;
  font-weight: 700;
  line-height: 1.25;
}

.science-row-en {
  color: rgba(0, 0, 0, 0.58);
  font-size: 28rpx;
  font-weight: 400;
  line-height: 1.25;
}

.science-row-action {
  position: absolute;
  z-index: 2;
  right: 28rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 176rpx;
  height: 68rpx;
  border-radius: 92rpx;
  background: #1d1d1f;
  display: flex;
  align-items: center;
  justify-content: center;
}

.science-row-action--locked {
  background: rgba(29, 29, 31, 0.58);
}

.science-row-action-text {
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.4;
  white-space: nowrap;
}

.science-row--locked .science-row-bg--loaded {
  opacity: 0.28;
  filter: grayscale(0.45);
}

.science-row--locked .science-row-wave {
  opacity: 0.36;
}

.science-row--locked .science-row-icon,
.science-row--locked .science-row-text {
  opacity: 0.62;
  filter: grayscale(0.75);
}

/* —— 其他学院通用列表 —— */
.list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  background: #f5f5f5;
}

.subject-card {
  display: flex;
  align-items: center;
  height: 120rpx;
  border-radius: 28rpx;
  padding: 0 28rpx;
  background: linear-gradient(135deg, #6ec6c2 0%, #a8e6e2 100%);
  box-sizing: border-box;
}

.subject-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.subject-icon {
  font-size: 36rpx;
}

.subject-info {
  flex: 1;
  padding: 0 20rpx;
}

.subject-cn {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: #1c3c3b;
}

.subject-en {
  display: block;
  font-size: 22rpx;
  color: rgba(28, 60, 59, 0.7);
  margin-top: 4rpx;
}

.explore-btn {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 40rpx;
  padding: 12rpx 28rpx;
  flex-shrink: 0;
}

.explore-btn-text {
  font-size: 24rpx;
  font-weight: 700;
  color: #1c3c3b;
}
</style>
