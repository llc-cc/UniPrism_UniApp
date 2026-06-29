<template>
  <canvas
    type="2d"
    id="reportSharePosterCanvas"
    class="report-share-poster-canvas"
    :style="canvasStyle"
  />
</template>

<script>
import {
  drawReportSharePoster,
  exportReportSharePoster,
  renderReportSharePosterToTempFile,
  REPORT_SHARE_POSTER_HEIGHT,
  REPORT_SHARE_POSTER_WIDTH,
} from '../../business/report-share-poster'

export default {
  name: 'ReportSharePosterCanvas',
  props: {
    model: { type: Object, default: null },
    coverSrc: { type: String, default: '' },
  },
  emits: ['ready', 'error'],
  data() {
    return {
      posterPath: '',
      renderToken: 0,
    }
  },
  computed: {
    canvasStyle() {
      return {
        width: `${REPORT_SHARE_POSTER_WIDTH}px`,
        height: `${REPORT_SHARE_POSTER_HEIGHT}px`,
      }
    },
  },
  watch: {
    model: {
      deep: true,
      handler(value) {
        if (value) this.renderPoster()
      },
    },
    coverSrc() {
      if (this.model) this.renderPoster()
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.model) this.renderPoster()
    })
  },
  methods: {
    getPosterPath() {
      return this.posterPath || ''
    },
    renderPoster() {
      const token = this.renderToken + 1
      this.renderToken = token
      return this.drawPoster(token)
    },
    async drawPoster(token) {
      if (!this.model) return ''

      try {
        let tempFilePath = await renderReportSharePosterToTempFile(this.model, {
          coverSrc: this.coverSrc,
        })

        if (!tempFilePath) {
          const canvas = await this.getCanvasNode()
          if (!canvas || token !== this.renderToken) return ''

          const systemInfo = uni.getSystemInfoSync()
          await drawReportSharePoster(canvas, this.model, {
            width: REPORT_SHARE_POSTER_WIDTH,
            height: REPORT_SHARE_POSTER_HEIGHT,
            devicePixelRatio: systemInfo.pixelRatio || 2,
            coverSrc: this.coverSrc,
          })

          if (token !== this.renderToken) return ''

          tempFilePath = await exportReportSharePoster(canvas, {
            width: REPORT_SHARE_POSTER_WIDTH,
            height: REPORT_SHARE_POSTER_HEIGHT,
            devicePixelRatio: systemInfo.pixelRatio || 2,
          }, this)
        }

        if (token !== this.renderToken) return ''

        this.posterPath = tempFilePath || ''
        if (tempFilePath) {
          this.$emit('ready', tempFilePath)
        } else {
          this.$emit('error')
        }
        return tempFilePath
      } catch (error) {
        if (token === this.renderToken) {
          this.$emit('error')
        }
        return ''
      }
    },
    getCanvasNode() {
      return new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this)
        query
          .select('#reportSharePosterCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            resolve((res && res[0] && res[0].node) || null)
          })
      })
    },
  },
}
</script>

<style scoped>
.report-share-poster-canvas {
  position: fixed;
  left: 0;
  top: -9999px;
  z-index: -1;
  pointer-events: none;
}
</style>
