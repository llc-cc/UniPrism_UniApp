<template>
  <view class="remote-video-wrap">
    <video
      v-if="playbackSrc && !failed"
      class="remote-video"
      :class="videoClass"
      :src="playbackSrc"
      :poster="resolvedPoster"
      :controls="controls"
      :object-fit="objectFit"
      :show-center-play-btn="showCenterPlayBtn"
      @error="onVideoError"
    />
    <view v-else-if="loading" class="remote-video-placeholder">
      <text class="remote-video-status">{{ loadingText }}</text>
      <text v-if="hint" class="remote-video-hint">{{ hint }}</text>
    </view>
    <view v-else class="remote-video-placeholder remote-video-placeholder-error">
      <text class="remote-video-status">视频暂时无法播放</text>
      <text v-if="hint" class="remote-video-hint">{{ hint }}</text>
      <view v-if="canRetry" class="remote-video-retry" @tap="reload">重试</view>
    </view>
  </view>
</template>

<script>
import { resolveAsset, resolveVideoAssetCandidates } from '../utils/asset-map'
import { downloadRemoteVideo } from '../utils/remote-video'

function isDevBuild() {
  try {
    return typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development'
  } catch {
    return false
  }
}

export default {
  name: 'RemoteVideo',
  props: {
    src: { type: String, default: '' },
    poster: { type: String, default: '' },
    controls: { type: Boolean, default: true },
    objectFit: { type: String, default: 'contain' },
    showCenterPlayBtn: { type: Boolean, default: true },
    videoClass: { type: String, default: '' },
    hint: { type: String, default: '' },
  },
  data() {
    return {
      playbackSrc: '',
      loading: false,
      loadingText: '视频加载中…',
      failed: false,
      canRetry: true,
      requestToken: 0,
      usedDownloadFallback: false,
    }
  },
  computed: {
    resolvedPoster() {
      return resolveAsset(this.poster)
    },
  },
  watch: {
    src: {
      immediate: true,
      handler() {
        this.reload()
      },
    },
  },
  beforeDestroy() {
    // Increment the token so any in-flight reload/onVideoError callbacks become
    // no-ops. Also clear the src immediately so WeChat's native <video> component
    // stops its current network request before being removed from the DOM.
    // Without this, a pending load failure fires a rendering-layer network error
    // (code 2) that blanks the entire page — even though the component is gone.
    this.requestToken++
    this.playbackSrc = ''
  },
  methods: {
    async reload() {
      const token = ++this.requestToken
      this.playbackSrc = ''
      this.failed = false
      this.usedDownloadFallback = false
      this.loadingText = '视频加载中…'

      if (!this.src) {
        this.loading = false
        return
      }

      const candidates = resolveVideoAssetCandidates(this.src)
      if (!candidates.length) {
        this.loading = false
        this.failed = true
        return
      }

      const first = candidates[0]
      const isRemote = /^https?:\/\//i.test(first)

      if (!isRemote) {
        this.playbackSrc = first
        this.loading = false
        return
      }

      // 开发者工具里直接播放远程 https 常报 ERR_FAILED，开发态先 downloadFile
      if (isDevBuild()) {
        await this.loadViaDownload(token)
        return
      }

      // 生产环境先尝试流式播放，失败再 downloadFile 兜底
      this.playbackSrc = first
      this.loading = false
    },
    async loadViaDownload(token) {
      this.loading = true
      this.loadingText = '正在缓存视频…'
      try {
        const playable = await downloadRemoteVideo(this.src)
        if (token !== this.requestToken) return
        if (playable) {
          this.playbackSrc = playable
          this.failed = false
        } else {
          this.failed = true
        }
      } catch (error) {
        console.warn('[RemoteVideo] download failed', error)
        if (token === this.requestToken) this.failed = true
      } finally {
        if (token === this.requestToken) this.loading = false
      }
    },
    async onVideoError(event) {
      if (this.usedDownloadFallback || !this.src) {
        console.warn('[RemoteVideo] playback error', event)
        this.failed = true
        this.playbackSrc = ''
        return
      }

      const token = this.requestToken
      this.usedDownloadFallback = true
      this.loading = true
      this.loadingText = '正在缓存视频…'
      this.playbackSrc = ''

      try {
        const playable = await downloadRemoteVideo(this.src)
        if (token !== this.requestToken) return
        if (playable) {
          this.playbackSrc = playable
          this.failed = false
        } else {
          this.failed = true
        }
      } catch (error) {
        console.warn('[RemoteVideo] download fallback failed', error)
        if (token === this.requestToken) this.failed = true
      } finally {
        if (token === this.requestToken) this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.remote-video-wrap {
  width: 100%;
}
.remote-video {
  width: 100%;
}
.remote-video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420rpx;
  border-radius: 18rpx;
  background: #0f172a;
  padding: 32rpx;
}
.remote-video-placeholder-error {
  background: #1e293b;
}
.remote-video-status {
  font-size: 28rpx;
  color: #e2e8f0;
  font-weight: 600;
}
.remote-video-hint {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #94a3b8;
  text-align: center;
  line-height: 1.5;
}
.remote-video-retry {
  margin-top: 20rpx;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  background: #4cc8c1;
  color: #0f172a;
  font-size: 24rpx;
  font-weight: 700;
}
</style>
