<template>
  <scroll-view class="page" scroll-y>
    <view v-if="subjects.length === 0" class="empty">
      <text class="empty-text">该学院内容暂未开放</text>
    </view>
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

const COLLEGE_SUBJECTS = {
  science: [
    { id: 'math-u',    cn: '数学',   en: 'Mathematics',  icon: '📐' },
    { id: 'physics-u', cn: '物理',   en: 'Physics',       icon: '⚛️' },
    { id: 'chem-u',    cn: '化学',   en: 'Chemistry',     icon: '🧪' },
  ],
  engineering: [
    { id: 'mech-u', cn: '机械工程',     en: 'Mechanical Engineering',          icon: '⚙️' },
    { id: 'ee-u',   cn: '电子电气工程', en: 'Electrical Engineering',           icon: '⚡' },
    { id: 'ic-u',   cn: '集成电路',     en: 'Integrated Circuit Engineering',   icon: '🔌' },
  ],
  computer: [
    { id: 'cs-u', cn: '计算机科学', en: 'Computer Science',       icon: '💻' },
    { id: 'ai-u', cn: '人工智能',   en: 'Artificial Intelligence', icon: '🤖' },
  ],
  business: [
    { id: 'finance-u',   cn: '金融',   en: 'Finance',           icon: '📈' },
    { id: 'econ-u',      cn: '经济学', en: 'Economics',          icon: '🏦' },
    { id: 'actuarial-u', cn: '精算学', en: 'Actuarial Science',  icon: '📊' },
  ],
}

export default {
  data() {
    return { subjects: [], collegeLabel: '' }
  },
  onLoad(options) {
    const id = options.id || ''
    this.collegeLabel = decodeURIComponent(options.label || '')
    this.subjects = COLLEGE_SUBJECTS[id] || []
    if (this.collegeLabel) {
      uni.setNavigationBarTitle({ title: this.collegeLabel })
    }
  },
  methods: {
    explore(subject) {
      navigateToMajor(subject.id)
    },
  },
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f5f5;
}
.list {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
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
