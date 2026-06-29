<template>
  <scroll-view class="page" scroll-y>
    <view class="workspace-head">
      <view class="workspace-title-row">
        <text class="workspace-title">职业模拟任务（至少完成一个职业情境）</text>
        <text class="workspace-badge">当前阶段</text>
      </view>
      <text class="workspace-desc">从角色、情境与选择反馈出发，完成真实职业模拟，判断你更适合的职业方向。</text>
    </view>

    <view class="workspace-panel">
      <text class="section-title">已体验的专业</text>
      <text class="section-meta">先选择你已完成或正在关注的专业，再进入对应职业模拟</text>

      <view class="major-grid">
        <view
          v-for="entry in majorEntries"
          :key="entry.id"
          class="major-chip"
          :class="{ 'major-chip-active': entry.id === selectedMajorId }"
          @tap="selectMajor(entry.id)"
        >
          <image
            class="major-icon"
            :class="{ 'major-icon-dim': !entry.visited && entry.id !== selectedMajorId }"
            :src="resolveAsset(entry.icon)"
            mode="aspectFit"
          />
          <text class="major-label">{{ entry.label }}</text>
          <text class="major-flag" :class="entry.visited ? 'major-flag-done' : 'major-flag-rec'">
            {{ entry.visited ? '已体验' : '推荐' }}
          </text>
        </view>
      </view>

      <view v-if="activeMajor" class="major-focus">
        <image class="major-focus-icon" :src="resolveAsset(activeMajor.icon)" mode="aspectFit" />
        <text class="major-focus-title">{{ activeMajor.label }}</text>
        <text class="major-focus-category" :style="{ color: activeMajor.accent }">{{ activeMajor.category }}</text>
        <text class="major-focus-desc">{{ activeMajor.description }}</text>
        <button class="btn-major" @tap="continueMajor">继续体验专业</button>
      </view>

      <view class="career-section">
        <text class="section-title">基于所选专业的职业模拟</text>
        <text class="section-meta">当前专业：{{ activeMajor ? activeMajor.label : '未选择' }}</text>

        <view
          v-for="(career, idx) in displayCareers"
          :key="career.id"
          class="career-role-card"
          :class="{ 'career-role-card-active': career.id === selectedCareerId }"
          @tap="selectCareer(career.id)"
        >
          <image class="career-role-icon" :src="resolveAsset(career.icon)" mode="aspectFit" />
          <text class="career-role-title">{{ career.title }}</text>
          <text class="career-role-badge">{{ formatCareerIndex(idx) }} / {{ career.badge }}</text>
          <view class="career-role-tags">
            <text class="career-role-track">{{ career.track }}</text>
            <text
              v-for="dim in (career.dimensions || []).slice(0, 2)"
              :key="`${career.id}-${dim}`"
              class="career-role-dim"
            >{{ dimensionLabel(dim) }}</text>
          </view>
          <text class="career-role-summary">{{ career.recommendationText || career.summary }}</text>
          <view class="career-role-foot">
            <text v-if="getExperienceKind(career.id) === 'live'" class="career-role-flag career-role-flag-live">完整模拟</text>
            <text v-else-if="getExperienceKind(career.id) === 'preview'" class="career-role-flag career-role-flag-preview">预览占位</text>
            <text v-if="isExplored(career.id)" class="career-role-flag career-role-flag-done">已体验</text>
          </view>
          <button class="btn-career" @tap.stop="enterCareer(career.id)">
            {{ getExperienceKind(career.id) === 'none' ? '查看预览' : '进入模拟' }}
          </button>
        </view>
      </view>
    </view>

    <view class="panel guides-panel">
      <text class="section-title">职业模拟怎么进行</text>
      <view class="guide-list">
        <view v-for="guide in guides" :key="guide.id" class="guide-card">
          <image class="guide-image" :src="resolveAsset(guide.image)" mode="aspectFill" />
          <view class="guide-copy">
            <text class="guide-title">{{ guide.title }}</text>
            <text class="guide-desc">{{ guide.description }}</text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import { loadDiscoverSession } from './business/discover-session'
import { loadExploreProgress, setCareerWorkspaceSelection } from '../../business/explore-progress'
import {
  CAREER_SIMULATION_GUIDES,
  getCareerExperienceKind,
  openCareerSimulation,
} from '../../business/career-config'
import {
  buildCareerStageMajorEntries,
  resolveActiveMajorEntry,
  rankCareersForWorkspace,
  CAREER_DIMENSION_LABELS,
} from './business/career-stage-majors'
import { navigateToMajor } from '../../business/major-routes'
import { buildCareerWorkspaceRecommendations, getPreferredMajorIds } from './business/report-recommendations'
import { resolveAsset } from '../../utils/asset-map'

export default {
  data() {
    return {
      rankedCareers: [],
      exploredCareers: [],
      majorEntries: [],
      selectedMajorId: '',
      selectedCareerId: '',
      recommendedMajorIds: [],
      topDimensions: [],
      guides: CAREER_SIMULATION_GUIDES,
    }
  },
  computed: {
    activeMajor() {
      return resolveActiveMajorEntry(this.majorEntries, this.selectedMajorId)
    },
    displayCareers() {
      return rankCareersForWorkspace(this.rankedCareers, {
        topDimensions: this.topDimensions,
        majorIds: this.recommendedMajorIds,
        selectedMajorId: this.selectedMajorId,
      }).slice(0, 3)
    },
  },
  onShow() {
    const session = loadDiscoverSession()
    const progress = loadExploreProgress()
    const profile = session.profile
    const recommendedMajors = session.recommendedMajors || []
    this.recommendedMajorIds = getPreferredMajorIds(
      session,
      recommendedMajors.map((item) => item && item.majorId),
    )
    this.topDimensions = profile ? profile.topDimensions : []
    this.rankedCareers = buildCareerWorkspaceRecommendations({
      ...session,
      recommendedMajors: this.recommendedMajorIds.map((majorId) => ({ majorId })),
    })
    this.exploredCareers = progress.careersExplored || []

    this.majorEntries = buildCareerStageMajorEntries({
      majorsExplored: progress.majorsExplored || [],
      recommendedMajorIds: this.recommendedMajorIds,
      selectedMajorId: progress.selectedMajorId || '',
    })

    const activeMajor = resolveActiveMajorEntry(this.majorEntries, progress.selectedMajorId || '')
    this.selectedMajorId = activeMajor ? activeMajor.id : (this.majorEntries[0] && this.majorEntries[0].id) || ''

    const rankedForMajor = rankCareersForWorkspace(this.rankedCareers, {
      topDimensions: this.topDimensions,
      majorIds: this.recommendedMajorIds,
      selectedMajorId: this.selectedMajorId,
    })
    const savedCareer = progress.selectedCareerId
    const defaultCareer = rankedForMajor[0] && rankedForMajor[0].id
    this.selectedCareerId =
      (savedCareer && rankedForMajor.some((item) => item.id === savedCareer) && savedCareer)
      || defaultCareer
      || ''

    this.persistSelection()
  },
  methods: {
    resolveAsset,
    getExperienceKind(careerId) {
      return getCareerExperienceKind(careerId)
    },
    dimensionLabel(dim) {
      return CAREER_DIMENSION_LABELS[dim] || dim
    },
    isExplored(careerId) {
      return this.exploredCareers.includes(careerId)
    },
    formatCareerIndex(idx) {
      const value = Number(idx) + 1
      return value < 10 ? `0${value}` : String(value)
    },
    persistSelection() {
      setCareerWorkspaceSelection({
        selectedMajorId: this.selectedMajorId,
        selectedCareerId: this.selectedCareerId,
      })
    },
    selectMajor(majorId) {
      this.selectedMajorId = majorId
      const rankedForMajor = rankCareersForWorkspace(this.rankedCareers, {
        topDimensions: this.topDimensions,
        majorIds: this.recommendedMajorIds,
        selectedMajorId: majorId,
      })
      this.selectedCareerId = rankedForMajor[0] ? rankedForMajor[0].id : ''
      this.persistSelection()
    },
    selectCareer(careerId) {
      this.selectedCareerId = careerId
      this.persistSelection()
    },
    continueMajor() {
      if (!this.selectedMajorId) return
      navigateToMajor(this.selectedMajorId)
    },
    enterCareer(careerId) {
      this.selectedCareerId = careerId
      this.persistSelection()
      openCareerSimulation(careerId, this.selectedMajorId)
    },
  },
}
</script>

<style scoped>
.page { background: #f4f7fb; padding-bottom: 32rpx; }

.workspace-head { padding: 28rpx 28rpx 8rpx; text-align: center; }
.workspace-title-row { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 12rpx; }
.workspace-title { font-size: 34rpx; font-weight: 800; color: #0f172a; line-height: 1.35; }
.workspace-badge { padding: 8rpx 18rpx; border-radius: 999rpx; background: #fff1f3; font-size: 20rpx; font-weight: 700; color: #d65b63; }
.workspace-desc { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.7; color: #64748b; }

.workspace-panel, .panel { margin: 20rpx 24rpx 0; padding: 28rpx; border-radius: 28rpx; background: #fff; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.06); border: 2rpx solid #dedede; }
.section-title { display: block; text-align: center; font-size: 32rpx; font-weight: 800; color: #0b1220; }
.section-meta { display: block; margin-top: 10rpx; text-align: center; font-size: 22rpx; color: #64748b; line-height: 1.6; }

.major-grid { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 24rpx; justify-content: center; }
.major-chip { width: calc(20% - 10rpx); min-width: 120rpx; box-sizing: border-box; padding: 14rpx 8rpx 16rpx; border-radius: 18rpx; text-align: center; background: #fff; }
.major-chip-active { background: #f7fdff; box-shadow: inset 0 0 0 2rpx #2BA8BC; }
.major-icon { width: 76rpx; height: 76rpx; margin: 0 auto; }
.major-icon-dim { opacity: 0.72; }
.major-label { display: block; margin-top: 8rpx; font-size: 22rpx; font-weight: 800; color: #0b1220; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.major-flag { display: inline-block; margin-top: 8rpx; padding: 4rpx 12rpx; border-radius: 999rpx; font-size: 18rpx; font-weight: 700; border: 1rpx solid #e6edf5; }
.major-flag-done { background: #eefbff; color: #16859A; border-color: #cdeef6; }
.major-flag-rec { background: #f8fafc; color: #8190a5; }

.major-focus { margin-top: 28rpx; padding-top: 28rpx; border-top: 1rpx solid #edf2f7; display: flex; flex-direction: column; align-items: center; text-align: center; }
.major-focus-icon { width: 158rpx; height: 158rpx; }
.major-focus-title { margin-top: 16rpx; font-size: 36rpx; font-weight: 800; color: #0b1220; }
.major-focus-category { margin-top: 8rpx; font-size: 20rpx; font-weight: 800; letter-spacing: 0.12em; }
.major-focus-desc { margin-top: 14rpx; max-width: 620rpx; font-size: 22rpx; line-height: 1.7; color: #64748b; }
.btn-major { margin-top: 18rpx; height: 68rpx; line-height: 68rpx; padding: 0 36rpx; border-radius: 999rpx; border: 1rpx solid #2BA8BC; background: #fff; color: #16859A; font-size: 24rpx; font-weight: 700; }

.career-section { margin-top: 36rpx; padding-top: 28rpx; border-top: 1rpx solid #edf2f7; }
.career-role-card { margin-top: 20rpx; padding: 28rpx 24rpx; border-radius: 26rpx; border: 1rpx solid #e6edf5; background: #fff; text-align: center; box-shadow: 0 20rpx 46rpx rgba(15,23,42,0.05); }
.career-role-card-active { border-color: #d7d2ff; background: #fbf9ff; box-shadow: 0 20rpx 46rpx rgba(109,89,196,0.08); }
.career-role-icon { width: 126rpx; height: 126rpx; margin: 0 auto; }
.career-role-title { display: block; margin-top: 16rpx; font-size: 34rpx; font-weight: 800; color: #0b1220; }
.career-role-badge { display: block; margin-top: 8rpx; font-size: 20rpx; font-weight: 800; color: #94a3b8; }
.career-role-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 10rpx; margin-top: 14rpx; }
.career-role-track, .career-role-dim { padding: 6rpx 14rpx; border-radius: 999rpx; background: #f6f9fc; font-size: 18rpx; font-weight: 700; color: #68809a; }
.career-role-track { border: 1rpx solid #e6edf5; background: #f5f2ff; color: #6d59c4; }
.career-role-summary { display: block; margin-top: 16rpx; font-size: 22rpx; line-height: 1.7; color: #566070; }
.career-role-foot { display: flex; flex-wrap: wrap; justify-content: center; gap: 10rpx; margin-top: 14rpx; }
.career-role-flag { padding: 6rpx 14rpx; border-radius: 999rpx; font-size: 18rpx; font-weight: 700; }
.career-role-flag-live { background: #ede9fe; color: #6d28d9; }
.career-role-flag-preview { background: #fff7ed; color: #c2410c; }
.career-role-flag-done { background: #ecfdf5; color: #047857; }
.btn-career { margin-top: 18rpx; height: 68rpx; line-height: 68rpx; padding: 0 32rpx; border-radius: 999rpx; border: 1rpx solid #d7d2ff; background: #f5f2ff; color: #6d59c4; font-size: 24rpx; font-weight: 700; }

.guides-panel { border: none; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.06); }
.guide-list { margin-top: 20rpx; display: flex; flex-direction: column; gap: 16rpx; }
.guide-card { display: flex; gap: 18rpx; padding: 18rpx; border-radius: 22rpx; background: #f8fafc; }
.guide-image { width: 160rpx; height: 120rpx; border-radius: 18rpx; flex-shrink: 0; background: #fff; }
.guide-copy { flex: 1; min-width: 0; }
.guide-title { display: block; font-size: 26rpx; font-weight: 700; color: #162033; }
.guide-desc { display: block; margin-top: 8rpx; font-size: 22rpx; line-height: 1.65; color: #64748b; }
</style>
