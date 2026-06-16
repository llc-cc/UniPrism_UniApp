<template>
  <scroll-view class="page" scroll-y>
    <!-- 阶段 Hero -->
    <view class="hero">
      <image class="hero-image" :src="resolveAsset('/images/explore/discover/generated/stage-major-experience-crop.png')" mode="aspectFit" />
      <view class="hero-copy">
        <view class="hero-head">
          <text class="hero-title">第二阶段 专业体验</text>
          <text class="hero-badge">Web 端同步版</text>
        </view>
        <text class="hero-line">进入专业任务场景</text>
        <text class="hero-line">了解真实学习内容</text>
        <button class="hero-start" @tap="startExperience">开始体验</button>
      </view>
    </view>

    <!-- 任务说明 -->
    <view class="task">
      <text class="overview-title">大学院系</text>
      <view class="task-head">
        <text class="task-title">专业体验任务（至少体验三个专业内容）</text>
        <text class="task-badge">当前阶段</text>
      </view>
      <text class="task-desc">从问题、任务与能力线索出发，至少完成三个专业内容体验，找到更适合你的专业方向。</text>
      <text v-if="exploredMajors.length" class="task-progress">已完成 {{ exploredMajors.length }} / 3 个专业体验</text>
      <view class="task-cta" @tap="openMajor(primarySuggestedMajorId)">
        <text class="task-cta-text">{{ primarySuggestedMajorLabel }} · 继续体验</text>
        <text class="task-cta-arrow">→</text>
      </view>
      <view v-if="suggestedMajors.length" class="recommendation-strip">
        <view
          v-for="major in suggestedMajors"
          :key="major.id"
          class="recommendation-chip"
          @tap="openMajor(major.id)"
        >
          <text class="recommendation-rank">{{ major.rank }}</text>
          <text class="recommendation-name">{{ major.name }}</text>
        </view>
      </view>
      <view class="daily-suggestion">
        <text class="daily-title">今日建议</text>
        <view class="daily-card" @tap="openMajor(primarySuggestedMajorId)">
          <text class="daily-main">继续完成 —— {{ primarySuggestedMajorLabel }}</text>
          <text class="daily-sub">完成后可继续进入职业模拟</text>
        </view>
      </view>
    </view>

    <!-- 学院地图 -->
    <view class="atlas">
      <!-- 学院模式 -->
      <block v-if="atlasMode === 'colleges'">
        <view class="atlas-center">
          <image class="uni-icon" :src="resolveAsset('/images/explore/discover/icons/atlas/university.png')" mode="aspectFit" />
          <text class="atlas-center-label">大学院系</text>
        </view>
        <view class="atlas-branch">
          <text class="atlas-branch-tip">选择一个学院深入探索</text>
        </view>
        <view class="college-grid">
          <view
            v-for="college in colleges"
            :key="college.id"
            class="college-node"
            :class="{ 'college-node-disabled': !college.majorIds.length, 'college-node-active': college.id === selectedCollegeId }"
            @tap="selectCollege(college)"
          >
            <image
              v-if="!collegeIconFullyFailed[college.id]"
              class="college-icon"
              :src="resolveAsset(getCollegeIconPath(college))"
              mode="aspectFit"
              @error="onCollegeIconError(college.id)"
            />
            <view v-else class="college-icon-fallback" :style="{ background: college.accent }">
              <text class="college-icon-fallback-text">{{ college.label.slice(0, 1) }}</text>
            </view>
            <text class="college-label">{{ college.label }}</text>
            <text class="college-meta">{{ college.cat }} · {{ college.majorIds.length }} 个专业方向</text>
            <view class="college-btn" :class="{ 'college-btn-disabled': !college.majorIds.length }">
              {{ college.majorIds.length ? '深入探索' : '筹备中' }}
            </view>
          </view>
        </view>
      </block>

      <!-- 专业模式 -->
      <block v-else>
        <view class="atlas-center">
          <image class="uni-icon" :src="resolveAsset(getCollegeIconPath(activeCollege))" mode="aspectFit" />
          <text class="atlas-center-label">{{ activeCollege.label }}</text>
          <text class="atlas-major-tip">选择一个专业继续进入对应体验内容</text>
          <view class="atlas-back" @tap="backToColleges">返回学院地图</view>
        </view>
        <view class="major-grid">
          <view
            v-for="major in activeMajors"
            :key="major.id"
            class="major-node"
            :class="{ 'major-node-recommended': !!major.recommendRank }"
            @tap="openMajor(major.id)"
          >
            <view class="major-node-top">
              <text class="major-node-cat" :style="{ color: activeCollege.accent }">{{ activeCollege.cat }}</text>
              <text v-if="major.recommendRank" class="major-node-recommend">推荐 {{ major.recommendRank }}</text>
            </view>
            <image class="major-node-icon" :src="resolveAsset(major.icon)" mode="aspectFit" />
            <text class="major-node-name">{{ major.name }}</text>
            <view class="major-node-foot">
              <text v-if="major.explored" class="major-node-done">已体验</text>
              <view class="major-node-btn">{{ major.explored ? '继续探索' : '体验专业' }}</view>
            </view>
          </view>
        </view>
      </block>
    </view>
  </scroll-view>
</template>

<script>
import { MAJOR_EXPERIENCES, getMajorById } from '../../business/explore-data'
import { loadDiscoverSession } from '../../business/discover-session'
import { loadExploreProgress } from '../../business/explore-progress'
import { navigateToMajor } from '../../business/major-routes'
import { resolveAsset } from '../../utils/asset-map'

const atlasPath = (name) => `/images/explore/discover/icons/atlas/${name}`
const webCollegePath = (name) => `/images/explore/discover/figma/${name}`

const COLLEGES = [
  {
    id: 'science',
    label: '理学院',
    cat: '理学',
    accent: '#2BA8BC',
    webIconPath: webCollegePath('college-science-345-31484.png'),
    fallbackIconPath: atlasPath('college-science-alpha-v2.png'),
    majorIds: ['math-u', 'physics-u', 'chem-u', 'bio-u'],
  },
  {
    id: 'engineering',
    label: '工程学院',
    cat: '工学',
    accent: '#4F7DF3',
    webIconPath: webCollegePath('college-engineering-345-31479.png'),
    fallbackIconPath: atlasPath('college-engineering.png'),
    majorIds: ['cs-u', 'ai-u', 'mech-u', 'ee-u'],
  },
  {
    id: 'computer',
    label: '计算机学院',
    cat: '工学',
    accent: '#5B6CFF',
    webIconPath: webCollegePath('college-computer-345-31474.png'),
    fallbackIconPath: atlasPath('college-computer-alpha-v2.png'),
    majorIds: ['cs-u', 'ai-u', 'ic-u'],
  },
  {
    id: 'business',
    label: '商学院',
    cat: '经管',
    accent: '#00A889',
    webIconPath: webCollegePath('college-business-345-31469.png'),
    fallbackIconPath: atlasPath('college-business.png'),
    majorIds: ['finance-u', 'econ-u', 'actuarial-u'],
  },
]

export default {
  data() {
    return {
      colleges: COLLEGES,
      atlasMode: 'colleges',
      selectedCollegeId: 'science',
      exploredMajors: [],
      recommendedIds: [],
      collegeIconState: {},
    }
  },
  computed: {
    activeCollege() {
      return this.colleges.find((item) => item.id === this.selectedCollegeId) || this.colleges[0]
    },
    activeMajors() {
      return this.activeCollege.majorIds
        .map((id) => {
          const mj = getMajorById(id)
          if (!mj) return null
          return {
            id,
            name: mj.shortTitle || mj.title || id,
            icon: mj.icon,
            explored: this.exploredMajors.includes(id),
            recommendRank: this.suggestedMajorIds.indexOf(id) >= 0 ? this.suggestedMajorIds.indexOf(id) + 1 : 0,
          }
        })
        .filter(Boolean)
    },
    suggestedMajorIds() {
      const fallback = ['math-u', 'ai-u', 'physics-u', 'cs-u']
      return [...this.recommendedIds, ...fallback]
        .filter((id, index, list) => list.indexOf(id) === index)
        .filter((id) => MAJOR_EXPERIENCES.some((item) => item.id === id))
        .slice(0, 3)
    },
    suggestedMajors() {
      return this.suggestedMajorIds
        .map((id, index) => {
          const major = getMajorById(id)
          if (!major) return null
          return {
            id,
            name: major.shortTitle || major.title || id,
            rank: index + 1,
          }
        })
        .filter(Boolean)
    },
    primarySuggestedMajorId() {
      return this.suggestedMajorIds[0] || 'math-u'
    },
    primarySuggestedMajorLabel() {
      const major = getMajorById(this.primarySuggestedMajorId)
      return major?.shortTitle || major?.title || '数学'
    },
    collegeIconFullyFailed() {
      const result = {}
      this.colleges.forEach((college) => {
        result[college.id] = this.collegeIconState[college.id] === 'fallback-failed'
      })
      return result
    },
  },
  onShow() {
    const session = loadDiscoverSession()
    const progress = loadExploreProgress()
    this.recommendedIds = (session.recommendedMajors || []).map((item) => item.majorId)
    this.exploredMajors = progress.majorsExplored || []
    // 优先把推荐专业所属学院作为默认展开学院
    const recCollege = this.colleges.find((c) => c.majorIds.some((id) => this.recommendedIds.includes(id)))
    if (recCollege && this.atlasMode === 'colleges') {
      this.selectedCollegeId = recCollege.id
    }
  },
  methods: {
    resolveAsset,
    getCollegeIconPath(college) {
      if (!college) return ''
      const state = this.collegeIconState[college.id]
      return state === 'web-failed' || state === 'fallback-failed'
        ? college.fallbackIconPath
        : college.webIconPath
    },
    onCollegeIconError(collegeId) {
      const current = this.collegeIconState[collegeId]
      this.collegeIconState = {
        ...this.collegeIconState,
        [collegeId]: current === 'web-failed' ? 'fallback-failed' : 'web-failed',
      }
    },
    startExperience() {
      // 默认进入推荐/首个可用学院的第一个专业
      const target = this.recommendedIds.find((id) => MAJOR_EXPERIENCES.some((m) => m.id === id))
      if (target) {
        this.openMajor(target)
        return
      }
      const college = this.colleges.find((c) => c.majorIds.length)
      this.selectCollege(college)
    },
    selectCollege(college) {
      if (!college || !college.majorIds.length) {
        uni.showToast({ title: '该学院内容筹备中', icon: 'none' })
        return
      }
      this.selectedCollegeId = college.id
      this.atlasMode = 'majors'
    },
    backToColleges() {
      this.atlasMode = 'colleges'
    },
    openMajor(majorId) {
      navigateToMajor(majorId)
    },
  },
}
</script>

<style scoped>
.page { background: #f4f7fb; padding-bottom: 48rpx; }

/* Hero */
.hero { margin: 24rpx; border-radius: 32rpx; overflow: hidden; background: linear-gradient(135deg, #e8f7ff, #f7fcff); box-shadow: 0 18rpx 52rpx rgba(15,23,42,0.08); }
.hero-image { width: 100%; height: 260rpx; }
.hero-copy { padding: 26rpx 28rpx 30rpx; }
.hero-head { display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
.hero-title { font-size: 40rpx; font-weight: 700; color: #0f172a; }
.hero-badge { padding: 8rpx 18rpx; border-radius: 999rpx; background: rgba(37,99,235,0.1); font-size: 20rpx; font-weight: 700; color: #1d4ed8; }
.hero-line { display: block; margin-top: 8rpx; font-size: 26rpx; font-weight: 600; color: #2563eb; }
.hero-start { margin-top: 22rpx; background: linear-gradient(90deg, #2BA8BC, #4F7DF3); color: #fff; border: none; border-radius: 999rpx; height: 80rpx; line-height: 80rpx; font-size: 28rpx; font-weight: 700; }

/* 任务说明 */
.task { margin: 0 24rpx; padding: 8rpx 4rpx 0; text-align: center; }
.overview-title { display: block; margin-bottom: 18rpx; font-size: 44rpx; font-weight: 800; color: #0f172a; letter-spacing: -2rpx; }
.task-head { display: flex; align-items: center; justify-content: center; gap: 14rpx; flex-wrap: wrap; }
.task-title { font-size: 34rpx; font-weight: 800; color: #0f172a; }
.task-badge { padding: 6rpx 16rpx; border-radius: 999rpx; background: #ebf3ff; font-size: 20rpx; font-weight: 700; color: #4b81eb; }
.task-desc { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.7; color: #64748b; }
.task-progress { display: block; margin-top: 10rpx; font-size: 22rpx; font-weight: 700; color: #16859A; }
.task-cta { display: inline-flex; align-items: center; gap: 10rpx; margin-top: 22rpx; padding: 0 32rpx; height: 76rpx; border-radius: 999rpx; border: 2rpx solid #b7dcf6; background: #f2f9ff; }
.task-cta-text { font-size: 26rpx; font-weight: 700; color: #1769E0; }
.task-cta-arrow { font-size: 28rpx; font-weight: 700; color: #1769E0; }
.recommendation-strip { display: flex; justify-content: center; gap: 12rpx; margin-top: 22rpx; flex-wrap: wrap; }
.recommendation-chip { display: inline-flex; align-items: center; gap: 8rpx; padding: 10rpx 18rpx; border-radius: 999rpx; background: #eef5ff; }
.recommendation-rank { width: 34rpx; height: 34rpx; line-height: 34rpx; border-radius: 50%; background: #1769E0; color: #fff; font-size: 20rpx; font-weight: 700; text-align: center; }
.recommendation-name { font-size: 22rpx; font-weight: 700; color: #1769E0; }
.daily-suggestion { margin-top: 22rpx; padding: 22rpx 24rpx; border-radius: 24rpx; background: #fff; box-shadow: 0 12rpx 30rpx rgba(15,23,42,0.05); text-align: left; }
.daily-title { display: block; font-size: 24rpx; font-weight: 700; color: #64748b; }
.daily-card { margin-top: 14rpx; padding: 20rpx 22rpx; border-radius: 20rpx; background: linear-gradient(135deg, #f1f8ff, #edfdfb); border: 2rpx solid #d8ecff; }
.daily-main { display: block; font-size: 28rpx; font-weight: 800; color: #0f172a; }
.daily-sub { display: block; margin-top: 8rpx; font-size: 22rpx; color: #64748b; }

/* 学院地图 */
.atlas { margin: 28rpx 24rpx 0; padding: 36rpx 24rpx 40rpx; background: #fff; border-radius: 32rpx; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.06); }
.atlas-center { display: flex; flex-direction: column; align-items: center; }
.uni-icon { width: 220rpx; height: 220rpx; }
.atlas-center-label { margin-top: 8rpx; font-size: 40rpx; font-weight: 800; letter-spacing: -2rpx; color: #0f172a; }
.atlas-major-tip { margin-top: 8rpx; font-size: 22rpx; color: #94a3b8; }
.atlas-branch { display: flex; flex-direction: column; align-items: center; margin: 16rpx 0 24rpx; }
.atlas-branch-tip { font-size: 22rpx; color: #94a3b8; }

.college-grid { display: flex; flex-wrap: wrap; gap: 20rpx; }
.college-node { width: calc(50% - 10rpx); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; padding: 28rpx 16rpx 24rpx; border-radius: 28rpx; background: #f8fbff; border: 2rpx solid transparent; box-shadow: 0 10rpx 28rpx rgba(15,23,42,0.04); }
.college-node-active { border-color: #2BA8BC; background: #f0fcff; box-shadow: 0 14rpx 30rpx rgba(43,168,188,0.12); }
.college-node-disabled { opacity: 0.62; }
.college-icon { width: 176rpx; height: 176rpx; }
.college-icon-fallback { width: 176rpx; height: 176rpx; border-radius: 28rpx; display: flex; align-items: center; justify-content: center; }
.college-icon-fallback-text { font-size: 52rpx; font-weight: 800; color: #fff; }
.college-label { margin-top: 10rpx; font-size: 30rpx; font-weight: 800; letter-spacing: -1rpx; color: #26364d; }
.college-meta { margin-top: 8rpx; font-size: 20rpx; color: #7b8ba1; }
.college-btn { margin-top: 16rpx; min-width: 168rpx; height: 60rpx; line-height: 60rpx; text-align: center; border-radius: 999rpx; border: 2rpx solid #2BA8BC; background: #fff; color: #16859A; font-size: 24rpx; font-weight: 700; }
.college-btn-disabled { border-color: #d8e2eb; color: #a4b2c1; }

/* 专业模式 */
.atlas-back { margin-top: 16rpx; padding: 0 28rpx; height: 62rpx; line-height: 62rpx; border-radius: 999rpx; border: 2rpx solid #d8e2eb; background: #fff; color: #64748b; font-size: 24rpx; font-weight: 700; }
.major-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 28rpx 20rpx; margin-top: 40rpx; }
.major-node { width: calc(50% - 10rpx); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; padding: 26rpx 16rpx 24rpx; border-radius: 24rpx; background: #f8fbff; box-shadow: 0 10rpx 24rpx rgba(15,23,42,0.04); }
.major-node-recommended { background: linear-gradient(180deg, #f8fbff, #f0f8ff); box-shadow: 0 14rpx 30rpx rgba(23,105,224,0.08); }
.major-node-top { width: 100%; display: flex; align-items: center; justify-content: space-between; min-height: 34rpx; }
.major-node-icon { width: 160rpx; height: 160rpx; }
.major-node-name { margin-top: 12rpx; font-size: 30rpx; font-weight: 800; letter-spacing: -1rpx; color: #0b1220; text-align: center; }
.major-node-cat { font-size: 20rpx; font-weight: 700; letter-spacing: 3rpx; }
.major-node-recommend { padding: 4rpx 12rpx; border-radius: 999rpx; background: rgba(23,105,224,0.12); color: #1769E0; font-size: 18rpx; font-weight: 700; }
.major-node-foot { display: flex; align-items: center; gap: 12rpx; margin-top: 16rpx; }
.major-node-done { font-size: 20rpx; font-weight: 700; color: #16859A; }
.major-node-btn { min-width: 160rpx; height: 60rpx; line-height: 60rpx; text-align: center; border-radius: 999rpx; border: 2rpx solid #2BA8BC; background: #fff; color: #16859A; font-size: 24rpx; font-weight: 700; }
</style>
