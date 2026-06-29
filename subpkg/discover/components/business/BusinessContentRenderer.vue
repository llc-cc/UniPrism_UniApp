<template>
  <view class="content-root">
    <view v-for="(item, index) in items" :key="`${index}-${item.type}`" class="content-item">
      <view v-if="item.type === 'heading'" class="content-heading">
        <text v-if="item.eyebrow" class="content-eyebrow">{{ item.eyebrow }}</text>
        <text class="content-heading-title">{{ item.title }}</text>
      </view>

      <text v-else-if="item.type === 'paragraph'" class="content-paragraph">{{ item.text }}</text>

      <view v-else-if="item.type === 'quote'" class="content-quote" :style="{ borderColor: accent }">
        <text class="content-quote-text">{{ item.text }}</text>
      </view>

      <view v-else-if="item.type === 'block'" class="content-block" :class="`content-block--${item.kind || 'example'}`">
        <text class="content-block-title">{{ item.title }}</text>
        <text class="content-block-body">{{ item.body }}</text>
        <view v-if="item.rows && item.rows.length" class="content-rows">
          <view v-for="(row, rIdx) in item.rows" :key="rIdx" class="content-row">
            <text class="content-row-label">{{ row.label }}</text>
            <text class="content-row-value">{{ row.value }}</text>
          </view>
        </view>
      </view>

      <view v-else-if="item.type === 'formulaCards'" class="formula-grid">
        <view v-for="card in item.cards" :key="card.name" class="formula-card">
          <text class="formula-name">{{ card.name }}</text>
          <text class="formula-math">{{ card.math }}</text>
          <text class="formula-body">{{ card.body }}</text>
        </view>
      </view>

      <view v-else-if="item.type === 'compareCards'" class="compare-grid">
        <view v-for="card in item.cards" :key="card.title" class="compare-card">
          <text class="compare-title">{{ card.title }}</text>
          <text class="compare-body">{{ card.body }}</text>
        </view>
      </view>

      <BusinessInteractionHost
        v-else-if="item.type === 'interaction'"
        :interaction-id="item.id"
        :accent="accent"
      />
    </view>
  </view>
</template>

<script>
import BusinessInteractionHost from './BusinessInteractionHost.vue'

export default {
  name: 'BusinessContentRenderer',
  components: { BusinessInteractionHost },
  props: {
    items: { type: Array, default: () => [] },
    accent: { type: String, default: '#f3a43b' },
  },
}
</script>

<style scoped>
.content-root { display: flex; flex-direction: column; gap: 20rpx; }
.content-heading { padding-bottom: 8rpx; border-bottom: 1rpx solid rgba(0,0,0,0.06); }
.content-eyebrow { display: block; font-size: 22rpx; color: rgba(0,0,0,0.45); margin-bottom: 8rpx; }
.content-heading-title { display: block; font-size: 32rpx; font-weight: 700; color: #1d1d1f; line-height: 1.45; }
.content-paragraph { display: block; font-size: 26rpx; line-height: 1.85; color: #475569; }
.content-quote { padding: 20rpx 24rpx; border-left: 6rpx solid; background: #f8fafc; border-radius: 12rpx; }
.content-quote-text { font-size: 26rpx; line-height: 1.75; color: #334155; font-weight: 600; }
.content-block { padding: 24rpx; border-radius: 20rpx; background: #fffbf5; border: 1rpx solid rgba(243,164,59,0.18); }
.content-block--definition { background: #f0f9ff; border-color: rgba(68,119,255,0.18); }
.content-block--table { background: #fdf2f8; border-color: rgba(216,105,117,0.18); }
.content-block-title { display: block; font-size: 28rpx; font-weight: 700; color: #1d1d1f; margin-bottom: 10rpx; }
.content-block-body { display: block; font-size: 25rpx; line-height: 1.8; color: #475569; }
.content-rows { margin-top: 16rpx; display: flex; flex-direction: column; gap: 12rpx; }
.content-row { display: flex; flex-direction: column; gap: 4rpx; padding: 12rpx 0; border-top: 1rpx solid rgba(0,0,0,0.06); }
.content-row-label { font-size: 22rpx; font-weight: 700; color: #64748b; }
.content-row-value { font-size: 24rpx; line-height: 1.7; color: #334155; }
.formula-grid, .compare-grid { display: flex; flex-direction: column; gap: 16rpx; }
.formula-card, .compare-card { padding: 20rpx; border-radius: 16rpx; background: #f8fafc; border: 1rpx solid #e2e8f0; }
.formula-name, .compare-title { display: block; font-size: 24rpx; font-weight: 700; color: #1d1d1f; }
.formula-math { display: block; margin-top: 8rpx; font-size: 28rpx; font-weight: 700; color: #2563eb; }
.formula-body, .compare-body { display: block; margin-top: 8rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }
</style>
