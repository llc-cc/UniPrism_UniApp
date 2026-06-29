<template>
  <view v-if="page" class="professional-page">
    <view class="professional-head">
      <text v-if="page.subtitle" class="professional-kicker">{{ page.subtitle }}</text>
      <text class="professional-title">{{ page.title }}</text>
    </view>

    <view v-for="(section, index) in page.sections" :key="`${page.pageId}-${index}`" class="professional-section">
      <view v-if="section.type === 'prose'" class="prose-block">
        <text
          v-for="(paragraph, pIndex) in section.paragraphs"
          :key="`${index}-p-${pIndex}`"
          class="prose-paragraph"
        >
          {{ paragraph }}
        </text>
      </view>

      <view v-else-if="section.type === 'figure'" class="figure-block">
        <image class="figure-image" :src="resolveAsset(section.src)" mode="widthFix" />
        <text v-if="section.alt" class="figure-caption">{{ section.alt }}</text>
      </view>

      <view v-else-if="section.type === 'formula'" class="formula-block">
        <text class="formula-title">{{ section.title }}</text>
        <text class="formula-description">{{ section.description }}</text>
        <text class="formula-math">{{ section.math }}</text>
      </view>

      <view v-else-if="section.type === 'character-interaction'" class="character-row">
        <image
          class="character-image"
          :src="resolveAsset(section.characterImage)"
          mode="aspectFit"
        />
        <view class="character-interaction">
          <ProInteractionHost :type="section.interaction" />
        </view>
      </view>

      <ProInteractionHost v-else-if="section.type === 'interaction'" :type="section.interaction" />
    </view>
  </view>

  <view v-else class="professional-empty">
    <text class="professional-empty-title">互动内容加载中</text>
    <text class="professional-empty-body">未找到页面 {{ pageId }} 的原生内容配置。</text>
  </view>
</template>

<script>
import { getProfessionalPage, loadProfessionalPage } from '../business/math-professional-pages'
import { resolveAsset } from '../../../utils/asset-map'
import ProInteractionHost from './professional/ProInteractionHost.vue'

export default {
  name: 'MathProfessionalPage',
  components: { ProInteractionHost },
  props: {
    pageId: { type: String, required: true },
  },
  data() {
    return {
      remotePage: null,
    }
  },
  computed: {
    page() {
      return this.remotePage || getProfessionalPage(this.pageId)
    },
  },
  watch: {
    pageId: {
      immediate: true,
      handler() {
        this.loadPageContent()
      },
    },
  },
  methods: {
    resolveAsset,
    async loadPageContent() {
      this.remotePage = null
      const page = await loadProfessionalPage(this.pageId)
      if (page) this.remotePage = page
    },
  },
}
</script>

<style scoped>
.professional-page {
  padding-bottom: 32rpx;
}
.professional-head {
  margin-bottom: 24rpx;
  text-align: center;
}
.professional-kicker {
  display: block;
  font-size: 24rpx;
  font-weight: 800;
  color: #007a66;
}
.professional-title {
  display: block;
  margin-top: 12rpx;
  font-size: 44rpx;
  line-height: 1.3;
  font-weight: 600;
  color: #102033;
}
.professional-section {
  margin-top: 24rpx;
}
.prose-block {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.prose-paragraph {
  font-size: 30rpx;
  line-height: 1.86;
  color: #263241;
}
.figure-block {
  margin: 16rpx 0;
}
.figure-image {
  width: 100%;
  border-radius: 12rpx;
}
.figure-caption {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: #64748b;
  text-align: center;
}
.formula-block {
  margin: 16rpx 0;
  padding: 24rpx;
  border-radius: 12rpx;
  border: 2rpx solid #dbe7ef;
  background: #fbfdff;
}
.formula-title {
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: #102033;
}
.formula-description {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: #52657a;
}
.formula-math {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: #087f7a;
  font-weight: 700;
}
.character-row {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.character-image {
  width: 100%;
  height: 420rpx;
}
.character-interaction {
  width: 100%;
}
.professional-empty {
  padding: 32rpx 0;
}
.professional-empty-title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: #102033;
}
.professional-empty-body {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #64748b;
}
</style>
