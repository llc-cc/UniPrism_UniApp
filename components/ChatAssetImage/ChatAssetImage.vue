<template>
  <view class="chat-asset-wrap" :class="wrapClass" :style="wrapStyle">
    <image
      v-if="renderSrc && !failedAll"
      class="chat-asset-image"
      :class="imageClass"
      :src="renderSrc"
      :mode="mode"
      @error="handleError"
      @load="handleLoad"
    />
    <view v-if="showPlaceholder" class="chat-asset-placeholder">
      <text class="chat-asset-placeholder-label">{{ placeholderLabel }}</text>
      <text v-if="path && Number(showPathHint) !== 0" class="chat-asset-path">{{ path }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { resolveAssetCandidates } from '../../utils/asset-map'
import { downloadRemoteImage } from '../../utils/remote-image'

const props = defineProps({
  path: { type: String, default: '' },
  mode: { type: String, default: 'aspectFit' },
  imageClass: { type: String, default: '' },
  wrapClass: { type: String, default: '' },
  wrapStyle: { type: String, default: '' },
  label: { type: String, default: '配图' },
  showPathHint: { type: [Boolean, Number], default: true },
})

const candidateIndex = ref(0)
const hasLoaded = ref(false)
const failedAll = ref(false)
const renderSrc = ref('')
let resolveToken = 0

const candidates = computed(() => resolveAssetCandidates(props.path))

const activeCandidate = computed(() => {
  if (!props.path || failedAll.value) return ''
  const list = candidates.value
  if (!list.length) return ''
  return list[candidateIndex.value] || list[0] || ''
})

const showPlaceholder = computed(() => {
  if (!props.path) return true
  if (failedAll.value) return true
  return !hasLoaded.value
})

const placeholderLabel = computed(() => {
  if (!props.path) return '暂无图片'
  if (failedAll.value) return `${props.label}未能加载`
  return props.label
})

async function resolveRenderSrc(url) {
  const token = ++resolveToken
  if (!url) {
    renderSrc.value = ''
    return
  }

  const resolved = await downloadRemoteImage(url)
  if (token !== resolveToken) return
  renderSrc.value = resolved || url
}

watch(
  () => props.path,
  () => {
    candidateIndex.value = 0
    hasLoaded.value = false
    failedAll.value = false
  },
)

watch(
  () => [props.path, candidateIndex.value, candidates.value.join('|')],
  () => {
    candidateIndex.value = Math.min(candidateIndex.value, Math.max(candidates.value.length - 1, 0))
    void resolveRenderSrc(activeCandidate.value)
  },
  { immediate: true },
)

function handleError() {
  const list = candidates.value
  if (candidateIndex.value < list.length - 1) {
    candidateIndex.value += 1
    return
  }
  failedAll.value = true
}

function handleLoad() {
  hasLoaded.value = true
  failedAll.value = false
}
</script>

<style scoped>
.chat-asset-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.chat-asset-image {
  position: relative;
  z-index: 1;
}
.chat-asset-placeholder {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx;
  box-sizing: border-box;
  border-radius: 20rpx;
  background: linear-gradient(180deg, #f8f5ff 0%, #f1f5f9 100%);
  border: 2rpx dashed #d5bdff;
}
.chat-asset-placeholder-label {
  font-size: 24rpx;
  color: #6b23ff;
  font-weight: 600;
}
.chat-asset-path {
  font-size: 20rpx;
  line-height: 1.5;
  color: #94a3b8;
  text-align: center;
  word-break: break-all;
}
</style>
