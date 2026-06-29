<template>
  <scroll-view class="page" scroll-y>
    <view class="page-shell">
      <view class="college-grid">
        <view
          v-for="college in collegeCards"
          :key="college.id"
          class="college-card"
          :class="{
            'college-card--last-odd': college.isLastOdd,
            'college-card--disabled': college.disabled,
          }"
          @tap="openCollege(college)"
        >
          <view v-if="!bgReady[college.id]" class="college-card-fallback" :style="{ background: college.gradient }" />
          <image
            class="college-card-bg"
            :class="{ 'college-card-bg--loaded': bgReady[college.id] }"
            :src="resolveAsset(college.bg)"
            mode="aspectFill"
            @load="markBgReady(college.id)"
            @error="markBgFailed(college.id)"
          />
          <view class="college-card-texture" />
          <text class="college-card-en">{{ college.enLabel }}</text>

          <view v-if="college.iconKind === 'science'" class="college-icon college-icon--science">
            <image class="sci-base" :src="resolveAsset(assets.iconScienceBase)" mode="aspectFit" />
            <image class="sci-book" :src="resolveAsset(assets.iconScienceBook)" mode="aspectFit" />
            <image class="sci-paper" :src="resolveAsset(assets.iconSciencePaper)" mode="aspectFit" />
            <image class="sci-flask" :src="resolveAsset(assets.iconScienceFlask)" mode="aspectFit" />
          </view>

          <view v-else-if="college.iconKind === 'business'" class="college-icon college-icon--business">
            <view class="biz-device">
              <view class="biz-speaker" />
              <view class="biz-bar biz-bar--short" />
              <view class="biz-bar biz-bar--mid" />
              <view class="biz-bar biz-bar--tall" />
              <view class="biz-line" />
            </view>
            <text class="biz-coin biz-coin--primary">¥</text>
            <text class="biz-coin biz-coin--secondary">¥</text>
          </view>

          <view v-else class="college-icon" :class="`college-icon--${college.iconKind}`">
            <image class="college-icon-img" :src="resolveAsset(college.icon)" mode="aspectFit" />
          </view>

          <text class="college-card-cn">{{ college.label }}</text>
        </view>
      </view>
    </view>

    <view class="home-tabbar">
      <view class="tab-item" @tap="switchHomeTab('/pages/discover/index')">
        <view class="tab-icon tab-icon--prism">
          <image class="tab-icon-img" :src="assetPaths.tabInterest" mode="aspectFit" />
        </view>
        <text class="tab-text">兴趣探索</text>
      </view>
      <view class="tab-item tab-item--active" @tap="switchHomeTab('/pages/discover/major')">
        <view class="tab-icon">
          <image class="tab-icon-img" :src="assetPaths.tabMajor" mode="aspectFit" />
        </view>
        <text class="tab-text">专业体验</text>
      </view>
      <view class="tab-item" @tap="switchHomeTab('/pages/profile/index')">
        <view class="tab-icon">
          <image class="tab-icon-img" :src="assetPaths.tabProfile" mode="aspectFit" />
        </view>
        <text class="tab-text">个人中心</text>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { resolveAsset } from '../../utils/asset-map'
import {
  guardMajorExperienceNavigation,
  guardMajorExperienceCollegeNavigation,
  isMajorExperienceCollegeDisabled,
  navigateHomeTab,
} from '../../business/disabled-miniapp-routes'

const ICON_BASE = '/images/explore/discover/figma/home-professional-assets'
const BG_BASE = '/images/explore/discover/figma/home-professional-assets'

const ASSETS = {
  bgScience: `${BG_BASE}/card-bg-science-494-3607.png`,
  bgEngineering: `${BG_BASE}/card-bg-engineering-494-3607.png`,
  bgComputer: `${BG_BASE}/card-bg-computer-494-3607.png`,
  bgBusiness: `${BG_BASE}/card-bg-business-494-3607.png`,
  bgLaw: `${BG_BASE}/card-bg-law-494-3607.png`,
  bgMedical: `${BG_BASE}/card-bg-medical-494-3607.png`,
  bgLiterature: `${BG_BASE}/card-bg-literature-494-3607.png`,
  iconEngineering: `${ICON_BASE}/icon-engineering-494-3715.svg`,
  iconComputer: `${ICON_BASE}/icon-computer-494-3820.svg`,
  iconLaw: `${ICON_BASE}/icon-law-494-3935.svg`,
  iconMedical: `${ICON_BASE}/icon-medical-494-3924.svg`,
  iconLiterature: `${ICON_BASE}/icon-literature-494-3911.svg`,
  iconScienceBase: `${ICON_BASE}/icon-science-base-494-3752.svg`,
  iconScienceBook: `${BG_BASE}/icon-science-book-494-3795.png`,
  iconSciencePaper: `${ICON_BASE}/icon-science-paper-494-3796.svg`,
  iconScienceFlask: `${ICON_BASE}/icon-science-flask-494-3817.svg`,
}

const ASSET_PATHS = {
  tabInterest: '/static/assets/discover/tabbar/icon-interest.svg',
  tabMajor: '/static/assets/discover/tabbar/icon-major.svg',
  tabAchievement: '/static/assets/discover/tabbar/icon-achievement.svg',
  tabProfile: '/static/assets/discover/tabbar/icon-profile.svg',
  tabMoreLineLong: '/static/assets/discover/tabbar/system-line-long.svg',
  tabMoreLineShort: '/static/assets/discover/tabbar/system-line-short.svg',
  tabLock: '/static/assets/discover/tabbar/icon-lock.svg',
}

const COLLEGES = [
  {
    id: 'science',
    label: '理学院',
    enLabel: 'College of Science',
    bg: ASSETS.bgScience,
    iconKind: 'science',
    gradient: 'linear-gradient(155deg, #d2f3ef 0%, #b8e8e4 40%, #b0ddf0 100%)',
  },
  {
    id: 'engineering',
    label: '工程学院',
    enLabel: 'College of Engineering',
    bg: ASSETS.bgEngineering,
    iconKind: 'engineering',
    icon: ASSETS.iconEngineering,
    gradient: 'linear-gradient(155deg, #c8dcfa 0%, #d0cef8 55%, #ddd0fa 100%)',
  },
  {
    id: 'computer',
    label: '计算机学院',
    enLabel: 'College of Computer Science',
    bg: ASSETS.bgComputer,
    iconKind: 'computer',
    icon: ASSETS.iconComputer,
    gradient: 'linear-gradient(155deg, #c0daf8 0%, #d0e8fa 100%)',
  },
  {
    id: 'business',
    label: '商学院',
    enLabel: 'Business School',
    bg: ASSETS.bgBusiness,
    iconKind: 'business',
    gradient: 'linear-gradient(155deg, #f8f2c8 0%, #e4f0cc 55%, #d8ecc0 100%)',
  },
  {
    id: 'law',
    label: '法学院',
    enLabel: 'Law School',
    bg: ASSETS.bgLaw,
    iconKind: 'law',
    icon: ASSETS.iconLaw,
    gradient: 'linear-gradient(155deg, #f8d8ea 0%, #e8d4f4 100%)',
  },
  {
    id: 'medical',
    label: '医学院',
    enLabel: 'Medical School',
    bg: ASSETS.bgMedical,
    iconKind: 'medical',
    icon: ASSETS.iconMedical,
    gradient: 'linear-gradient(155deg, #c0e8f2 0%, #b0dce8 50%, #c8e4f6 100%)',
  },
  {
    id: 'literature',
    label: '文学院',
    enLabel: 'College of Literature',
    bg: ASSETS.bgLiterature,
    iconKind: 'literature',
    icon: ASSETS.iconLiterature,
    gradient: 'linear-gradient(155deg, #f4d0e0 0%, #e4ccea 100%)',
  },
]

export default {
  data() {
    return {
      assets: ASSETS,
      assetPaths: ASSET_PATHS,
      colleges: COLLEGES,
      bgReady: {},
    }
  },
  computed: {
    collegeCards() {
      const total = this.colleges.length
      return this.colleges.map((college, index) => ({
        ...college,
        disabled: isMajorExperienceCollegeDisabled(college.id),
        isLastOdd: total % 2 === 1 && index === total - 1,
      }))
    },
  },
  methods: {
    resolveAsset,
    markBgReady(id) {
      this.bgReady = { ...this.bgReady, [id]: true }
    },
    markBgFailed(id) {
      this.bgReady = { ...this.bgReady, [id]: false }
    },
    openCollege(college) {
      if (!college) return
      if (guardMajorExperienceNavigation()) return
      if (guardMajorExperienceCollegeNavigation(college.id)) return
      uni.navigateTo({ url: `/subpkg/discover/college-subjects?id=${college.id}&label=${encodeURIComponent(college.label)}` })
    },
    switchHomeTab(url) {
      navigateHomeTab(url)
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f2f2f7;
}

.page-shell {
  padding: 16rpx 28rpx 160rpx;
  box-sizing: border-box;
}

.college-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}

.college-card {
  position: relative;
  height: 245rpx;
  border-radius: 39rpx;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2rpx 2rpx rgba(0, 0, 0, 0.16);
}

.college-card--disabled {
  opacity: 0.78;
}

.college-card--last-odd {
  grid-column: 1 / -1;
  max-width: calc(50% - 12rpx);
}

.college-card-fallback {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.college-card-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
}

.college-card-bg--loaded {
  opacity: 0.47;
}

.college-card-texture {
  position: absolute;
  inset: 0;
  border-radius: 39rpx;
  z-index: 1;
  pointer-events: none;
  background: repeating-linear-gradient(
    77deg,
    rgba(255, 255, 255, 0.13) 0,
    rgba(255, 255, 255, 0.13) 36rpx,
    rgba(255, 255, 255, 0.04) 36rpx,
    rgba(255, 255, 255, 0.04) 74rpx
  );
  mix-blend-mode: screen;
}

.college-card-en {
  position: absolute;
  left: 20rpx;
  top: 18rpx;
  max-width: calc(100% - 40rpx);
  height: 37rpx;
  line-height: 37rpx;
  padding: 0 18rpx;
  border-radius: 40rpx;
  border: 1.2rpx solid #333333;
  background: rgba(255, 255, 255, 0.4);
  color: #000000;
  font-size: 20rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 2;
  box-sizing: border-box;
}

.college-card-cn {
  position: absolute;
  left: 20rpx;
  bottom: 18rpx;
  height: 46rpx;
  line-height: 46rpx;
  padding: 0 28rpx;
  border-radius: 80rpx;
  background: #1d1d1f;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
  white-space: nowrap;
  z-index: 3;
  box-sizing: border-box;
}


.college-icon {
  position: absolute;
  width: 122rpx;
  height: 122rpx;
  right: 10rpx;
  top: 58rpx;
  z-index: 2;
  overflow: hidden;
}

.college-icon-img {
  width: 100%;
  height: 100%;
  display: block;
}

/* Science — scaled to Figma 122.47px card */
.college-icon--science .sci-base {
  position: absolute;
  left: 5rpx;
  top: 0;
  width: 109rpx;
  height: 109rpx;
}

.college-icon--science .sci-book {
  position: absolute;
  left: 66rpx;
  top: 68rpx;
  width: 44rpx;
  height: 52rpx;
  transform: scaleY(-1) rotate(180deg);
}

.college-icon--science .sci-paper {
  position: absolute;
  left: 30rpx;
  top: 94rpx;
  width: 32rpx;
  height: 24rpx;
  transform: rotate(5deg) skewX(-2deg);
}

.college-icon--science .sci-flask {
  position: absolute;
  left: 62rpx;
  top: 88rpx;
  width: 22rpx;
  height: 32rpx;
}

/* Computer */
.college-icon--computer .college-icon-img {
  position: absolute;
  left: -11rpx;
  top: -3rpx;
  width: 145rpx;
  height: 129rpx;
  transform: rotate(-11.7deg);
}

/* Law */
.college-icon--law .college-icon-img {
  position: absolute;
  left: 5rpx;
  top: 0;
  width: 115rpx;
  height: 122rpx;
}

/* Medical */
.college-icon--medical .college-icon-img {
  position: absolute;
  left: 5rpx;
  top: 5rpx;
  width: 113rpx;
  height: 115rpx;
}

/* Literature */
.college-icon--literature .college-icon-img {
  position: absolute;
  left: -22rpx;
  top: -28rpx;
  width: 157rpx;
  height: 157rpx;
}

/* Business */
.college-icon--business {
  overflow: visible;
}

.biz-device {
  position: absolute;
  left: 28rpx;
  top: 3rpx;
  width: 76rpx;
  height: 95rpx;
  border: 6rpx solid #446977;
  border-radius: 12rpx;
  background: #f9fbff;
  box-sizing: border-box;
}

.biz-speaker {
  position: absolute;
  left: 28rpx;
  top: 9rpx;
  width: 20rpx;
  height: 5rpx;
  border-radius: 10rpx;
  background: #1d1d1f;
}

.biz-bar {
  position: absolute;
  bottom: 18rpx;
  width: 11rpx;
  border-radius: 11rpx 11rpx 0 0;
  background: #ffb13b;
}

.biz-bar--short {
  left: 17rpx;
  height: 23rpx;
}

.biz-bar--mid {
  left: 34rpx;
  height: 34rpx;
  background: #6aa8ff;
}

.biz-bar--tall {
  left: 51rpx;
  height: 46rpx;
  background: #4cc8c1;
}

.biz-line {
  position: absolute;
  left: 17rpx;
  top: 18rpx;
  width: 43rpx;
  height: 2rpx;
  border-radius: 4rpx;
  background: rgba(29, 29, 31, 0.2);
}

.biz-coin {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: 700;
  color: #ffffff;
}

.biz-coin--primary {
  background: #ffb13b;
  right: 6rpx;
  bottom: 3rpx;
}

.biz-coin--secondary {
  background: #f0930a;
  right: 24rpx;
  bottom: -6rpx;
  opacity: 0.8;
}

.home-tabbar {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: calc(18rpx + env(safe-area-inset-bottom));
  height: 104rpx;
  border: 2rpx solid #9762ff;
  border-radius: 26rpx;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8rpx 24rpx rgba(107, 35, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 30;
}

.tab-item {
  width: 20%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: #9a79ff;
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon-img {
  width: 36rpx;
  height: 36rpx;
  display: block;
}

.tab-item--active .tab-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 20rpx;
  background: rgba(151, 98, 255, 0.14);
}

.tab-item--active .tab-icon-img {
  width: 40rpx;
  height: 40rpx;
}

.tab-icon--locked {
  overflow: visible;
}

.tab-lock-badge {
  position: absolute;
  right: -4rpx;
  top: -4rpx;
  width: 18rpx;
  height: 18rpx;
  opacity: 0.86;
}

.tab-more-icon {
  position: relative;
  width: 36rpx;
  height: 36rpx;
}

.tab-more-tile {
  position: absolute;
  width: 11rpx;
  height: 11rpx;
  border: 1.5rpx solid #c797ff;
  border-radius: 4rpx;
  box-sizing: border-box;
  background: linear-gradient(90deg, #e7c2ff 0%, #9762ff 100%);
}

.tab-more-tile--top-left {
  left: 4rpx;
  top: 4rpx;
}

.tab-more-tile--bottom-left {
  left: 4rpx;
  top: 19rpx;
}

.tab-more-tile--top-right {
  left: 19rpx;
  top: 4rpx;
}

.tab-more-line {
  position: absolute;
  display: block;
  height: 2rpx;
}

.tab-more-line--middle {
  left: 19rpx;
  top: 19rpx;
  width: 13rpx;
}

.tab-more-line--short {
  left: 24rpx;
  top: 23rpx;
  width: 8rpx;
}

.tab-more-line--bottom {
  left: 19rpx;
  top: 28rpx;
  width: 13rpx;
}

.tab-text {
  font-size: 18rpx;
  line-height: 1;
  white-space: nowrap;
}
</style>
