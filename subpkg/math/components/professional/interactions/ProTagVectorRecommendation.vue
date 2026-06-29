<template>
  <ProInteractionShell title="标签向量推荐" hint="拖动兴趣标签，看课程排序怎样变化">
    <view class="tag-row">
      <view v-for="tag in tags" :key="tag.key" class="tag-block">
        <text class="tag-label">{{ tag.label }}</text>
        <slider :value="userVector[tag.key]" :min="0" :max="10" :step="1" activeColor="#087f7a" block-size="16" @change="(e) => onTagChange(tag.key, e)" @changing="(e) => onTagChange(tag.key, e)" />
      </view>
    </view>
    <view class="course-list">
      <view v-for="course in rankedCourses" :key="course.id" class="course-item">
        <text class="course-title">{{ course.title }}</text>
        <text class="course-score">匹配 {{ course.score.toFixed(1) }}</text>
      </view>
    </view>
    <ProSceneMetrics :items="metrics" />
  </ProInteractionShell>
</template>

<script>
import ProInteractionShell from '../ProInteractionShell.vue'
import ProSceneMetrics from '../ProSceneMetrics.vue'

const COURSES = [
  { id: 'analysis', title: '数学分析', vector: { math: 10, code: 2, music: 0 } },
  { id: 'linear', title: '线性代数', vector: { math: 9, code: 6, music: 0 } },
  { id: 'logic', title: '数理逻辑', vector: { math: 8, code: 7, music: 0 } },
  { id: 'music-theory', title: '音乐理论', vector: { math: 2, code: 1, music: 10 } },
]

export default {
  name: 'ProTagVectorRecommendation',
  components: { ProInteractionShell, ProSceneMetrics },
  data() {
    return {
      tags: [
        { key: 'math', label: '数学' },
        { key: 'code', label: '编程' },
        { key: 'music', label: '音乐' },
      ],
      userVector: { math: 8, code: 5, music: 1 },
    }
  },
  computed: {
    rankedCourses() {
      return [...COURSES]
        .map((course) => ({
          ...course,
          score: this.dot(course.vector, this.userVector),
        }))
        .sort((a, b) => b.score - a.score)
    },
    metrics() {
      return [
        { label: '用户向量', value: `(${this.userVector.math}, ${this.userVector.code}, ${this.userVector.music})` },
        { label: 'Top 1', value: this.rankedCourses[0]?.title || '-' },
        { label: 'Top 2', value: this.rankedCourses[1]?.title || '-' },
        { label: '规则', value: '标签向量点积' },
      ]
    },
  },
  methods: {
    dot(a, b) {
      return a.math * b.math + a.code * b.code + a.music * b.music
    },
    onTagChange(key, e) {
      this.userVector[key] = Number(e.detail.value)
    },
  },
}
</script>

<style scoped>
.tag-row { display: flex; flex-direction: column; gap: 12rpx; margin-bottom: 16rpx; }
.tag-block { background: #fbfdff; border: 2rpx solid #dbe7ef; border-radius: 12rpx; padding: 12rpx 16rpx; }
.tag-label { display: block; font-size: 24rpx; font-weight: 700; color: #102033; margin-bottom: 4rpx; }
.course-list { display: flex; flex-direction: column; gap: 12rpx; margin-bottom: 8rpx; }
.course-item { display: flex; justify-content: space-between; align-items: center; padding: 16rpx 20rpx; border-radius: 12rpx; background: #f8fafc; border: 2rpx solid #e2e8f0; }
.course-title { font-size: 26rpx; color: #102033; font-weight: 600; }
.course-score { font-size: 24rpx; color: #087f7a; font-weight: 700; }
</style>
