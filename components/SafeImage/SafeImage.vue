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
import { downloadRemoteImage } from '../../utils/remote-image'

export default {
  name: 'SafeImage',
  props: {
    src: { type: String, default: '' },
    mode: { type: String, default: 'aspectFill' },
    imageClass: { type: String, default: '' },
  },
  data() {
    return {
      candidateIndex: 0,
      currentSrc: '',
      resolveToken: 0,
    }
  },
  computed: {
    candidates() {
      return resolveAssetCandidates(this.src)
    },
    activeCandidate() {
      return this.candidates[this.candidateIndex] || ''
    },
  },
  watch: {
    src() {
      this.candidateIndex = 0
      this.syncCurrentSrc()
    },
    candidateIndex() {
      this.syncCurrentSrc()
    },
    candidates: {
      handler() {
        this.candidateIndex = Math.min(this.candidateIndex, Math.max(this.candidates.length - 1, 0))
        this.syncCurrentSrc()
      },
      immediate: true,
    },
  },
  methods: {
    async syncCurrentSrc() {
      const token = ++this.resolveToken
      const url = this.activeCandidate
      if (!url) {
        this.currentSrc = ''
        return
      }
      const resolved = await downloadRemoteImage(url)
      if (token !== this.resolveToken) return
      this.currentSrc = resolved || url
    },
    onError() {
      if (this.candidateIndex < this.candidates.length - 1) {
        this.candidateIndex += 1
      }
    },
  },
}
</script>
