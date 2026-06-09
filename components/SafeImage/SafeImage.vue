<template>
  <image
    v-if="currentSrc"
    :class="imageClass"
    :src="currentSrc"
    :mode="mode"
    @error="onError"
  />
</template>

<script>
import { resolveAssetCandidates } from '../../utils/asset-map'

export default {
  name: 'SafeImage',
  props: {
    src: { type: String, default: '' },
    mode: { type: String, default: 'aspectFill' },
    imageClass: { type: String, default: '' },
  },
  data() {
    return { candidateIndex: 0 }
  },
  computed: {
    candidates() {
      return resolveAssetCandidates(this.src)
    },
    currentSrc() {
      return this.candidates[this.candidateIndex] || ''
    },
  },
  watch: {
    src() {
      this.candidateIndex = 0
    },
  },
  methods: {
    onError() {
      if (this.candidateIndex < this.candidates.length - 1) {
        this.candidateIndex += 1
      }
    },
  },
}
</script>
