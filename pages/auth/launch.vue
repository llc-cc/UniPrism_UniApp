<template>
  <view class="launch-page">
    <swiper
      class="launch-swiper"
      :current="currentSlide"
      :indicator-dots="false"
      :autoplay="false"
      :circular="false"
      @change="handleSlideChange"
    >
      <swiper-item v-for="slide in slides" :key="slide.id">
        <view class="launch-slide" :class="slide.pageClass">
          <image
            class="launch-stage-curve"
            :class="slide.curveClass"
            :src="'/static/assets/auth/background-curves.svg'"
            mode="scaleToFill"
          />
          <view class="launch-glow launch-glow-top" />
          <view class="launch-glow launch-glow-bottom" />

          <view class="launch-art-wrap" :class="slide.artWrapClass">
            <view class="launch-art-shell" :class="slide.artShellClass">
              <view class="launch-art-backdrop" :class="slide.backdropClass" />
              <view class="launch-art-media" :class="slide.mediaClass">
                <view v-if="slide.shadowClass" class="launch-image-shadow" :class="slide.shadowClass" />
                <image class="launch-art-image" :class="slide.imageClass" :src="slide.image" mode="aspectFit" />
              </view>
            </view>
          </view>

          <view class="launch-copy" :class="slide.copyClass">
            <text class="launch-title">{{ slide.title }}</text>
            <text class="launch-subtitle">{{ slide.subtitle }}</text>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view v-if="!isLastSlide" class="launch-topbar" :style="skipStyle">
      <button class="launch-skip" @tap="finishLaunch">跳过</button>
    </view>

    <view class="launch-footer">
      <view v-if="!isLastSlide" class="launch-pagination">
        <view
          v-for="(slide, index) in slides"
          :key="slide.id + '-dot'"
          class="launch-dot"
          :class="{ active: index === currentSlide }"
        />
      </view>

      <button v-if="isLastSlide" class="launch-primary" @tap="handlePrimary">
        {{ primaryButtonText }}
      </button>
    </view>
  </view>
</template>

<script>
import { buildLoginUrl, hasAppAccess, goAppHome } from '../../business/auth-guard'
import { ensureExploreSessionId } from '../../business/profile-sync'

const DEFAULT_NEXT_URL = '/pages/discover/chat?start=1'

export default {
  data() {
    return {
      currentSlide: 0,
      skipStyle: '',
      nextUrl: '',
      slides: [
        {
          id: 'interest',
          title: '兴趣探索',
          subtitle: '发现你天然感兴趣的领域',
          image: '/static/assets/auth/card-interest.svg',
          pageClass: 'launch-slide--interest',
          curveClass: 'launch-stage-curve--interest',
          artWrapClass: 'launch-art-wrap--interest',
          artShellClass: 'launch-art-shell--interest',
          backdropClass: 'launch-art-backdrop--interest',
          mediaClass: 'launch-art-media--interest',
          shadowClass: '',
          imageClass: 'launch-art-image--interest',
          copyClass: 'launch-copy--interest',
        },
        {
          id: 'personality',
          title: '性格测试',
          subtitle: '了解你的行为风格与适配环境',
          image: '/static/assets/auth/card-personality.svg',
          pageClass: 'launch-slide--personality',
          curveClass: 'launch-stage-curve--personality',
          artWrapClass: 'launch-art-wrap--personality',
          artShellClass: 'launch-art-shell--personality',
          backdropClass: 'launch-art-backdrop--personality',
          mediaClass: 'launch-art-media--personality',
          shadowClass: '',
          imageClass: 'launch-art-image--personality',
          copyClass: 'launch-copy--personality',
        },
        {
          id: 'career',
          title: '职业倾向',
          subtitle: '匹配更适合你的职业方向',
          image: '/static/assets/auth/card-career.svg',
          pageClass: 'launch-slide--career',
          curveClass: 'launch-stage-curve--career',
          artWrapClass: 'launch-art-wrap--career',
          artShellClass: 'launch-art-shell--career',
          backdropClass: 'launch-art-backdrop--career',
          mediaClass: 'launch-art-media--career',
          shadowClass: '',
          imageClass: 'launch-art-image--career',
          copyClass: 'launch-copy--career',
        },
        {
          id: 'assessment',
          title: '深度测评',
          subtitle: '分析您的价值观和人格底色',
          image: '/static/assets/auth/card-ability.svg',
          pageClass: 'launch-slide--assessment',
          curveClass: 'launch-stage-curve--assessment',
          artWrapClass: 'launch-art-wrap--assessment',
          artShellClass: 'launch-art-shell--assessment',
          backdropClass: 'launch-art-backdrop--assessment',
          mediaClass: 'launch-art-media--assessment',
          shadowClass: '',
          imageClass: 'launch-art-image--assessment',
          copyClass: 'launch-copy--assessment',
        },
      ],
    }
  },
  computed: {
    isLastSlide() {
      return this.currentSlide >= this.slides.length - 1
    },
    primaryButtonText() {
      return this.isLastSlide ? '开始探索' : '下一步'
    },
  },
  onLoad(options) {
    if (!hasAppAccess()) {
      const launchPath = options && options.next
        ? `/pages/auth/launch?next=${encodeURIComponent(options.next)}`
        : '/pages/auth/launch'
      uni.reLaunch({ url: buildLoginUrl(launchPath) })
      return
    }
    if (options && options.next) {
      try {
        this.nextUrl = decodeURIComponent(options.next)
      } catch {
        this.nextUrl = options.next
      }
    }
    this.updateSkipOffset()
  },
  methods: {
    updateSkipOffset() {
      let top = 92
      let right = 24

      // #ifdef MP-WEIXIN
      try {
        const systemInfo = uni.getSystemInfoSync()
        const menuButton = wx.getMenuButtonBoundingClientRect()
        if (menuButton && menuButton.top) {
          top = menuButton.bottom + 10
          right = Math.max(systemInfo.windowWidth - menuButton.right, 16)
        }
      } catch (error) {
        const systemInfo = uni.getSystemInfoSync()
        top = (systemInfo && systemInfo.statusBarHeight ? systemInfo.statusBarHeight + 52 : 92)
      }
      // #endif

      this.skipStyle = `top:${top}px;right:${right}px;`
    },
    handleSlideChange(event) {
      this.currentSlide = (event && event.detail && event.detail.current) || 0
    },
    handlePrimary() {
      if (this.isLastSlide) {
        this.finishLaunch()
        return
      }
      this.currentSlide += 1
    },
    async finishLaunch() {
      const nextUrl = String(this.nextUrl || DEFAULT_NEXT_URL).trim()
      if (nextUrl) {
        uni.showLoading({ title: '准备探索...' })
        try {
          await ensureExploreSessionId()
          uni.reLaunch({ url: nextUrl })
          return
        } catch (error) {
          uni.showToast({
            title: (error && error.message) || '后端会话初始化失败',
            icon: 'none',
          })
          return
        } finally {
          uni.hideLoading()
        }
      }
      goAppHome()
    },
  },
}
</script>

<style scoped>
.launch-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(180deg, #e0c9fe 0%, #f4f6f8 38%, #f4f6f8 100%);
  overflow: hidden;
}

.launch-stage-curve {
  position: absolute;
  width: 2950rpx;
  height: 1492rpx;
  pointer-events: none;
}

.launch-stage-curve--interest {
  top: -206rpx;
  left: -300rpx;
}

.launch-stage-curve--personality {
  top: -212rpx;
  left: -1058rpx;
}

.launch-stage-curve--career {
  top: -206rpx;
  left: -1790rpx;
}

.launch-stage-curve--assessment {
  top: -168rpx;
  left: -2576rpx;
}

.launch-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(18rpx);
  pointer-events: none;
}

.launch-glow-top {
  top: -60rpx;
  left: -40rpx;
  width: 380rpx;
  height: 240rpx;
  background: rgba(255,255,255,0.24);
}

.launch-glow-bottom {
  right: -120rpx;
  bottom: 170rpx;
  width: 320rpx;
  height: 320rpx;
  background: rgba(255,255,255,0.12);
}

.launch-swiper {
  width: 100%;
  height: 100vh;
}

.launch-slide {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.launch-art-wrap {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.launch-art-wrap--interest {
  top: calc(392rpx + env(safe-area-inset-top));
}

.launch-art-wrap--personality {
  top: calc(392rpx + env(safe-area-inset-top));
}

.launch-art-wrap--career {
  top: calc(392rpx + env(safe-area-inset-top));
}

.launch-art-wrap--assessment {
  top: calc(392rpx + env(safe-area-inset-top));
}

.launch-art-shell {
  position: relative;
  width: 432rpx;
  height: 352rpx;
}

.launch-art-backdrop {
  position: absolute;
  left: 50%;
  top: 57%;
  background: #e0e2f1;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.launch-art-backdrop--interest {
  width: 384rpx;
  height: 208rpx;
  transform: translate(-50%, -50%) rotate(-11deg);
  border-radius: 34% 66% 42% 58% / 58% 28% 72% 42%;
}

.launch-art-backdrop--personality {
  top: 56%;
  width: 430rpx;
  height: 246rpx;
  transform: translate(-50%, -50%) rotate(8deg);
  border-radius: 46% 54% 55% 45% / 52% 34% 66% 48%;
}

.launch-art-backdrop--career {
  top: 58%;
  width: 416rpx;
  height: 234rpx;
  transform: translate(-50%, -50%) rotate(-17deg);
  border-radius: 40% 60% 48% 52% / 62% 30% 70% 38%;
}

.launch-art-backdrop--assessment {
  top: 56%;
  width: 404rpx;
  height: 214rpx;
  transform: translate(-50%, -50%) rotate(-6deg);
  border-radius: 42% 58% 54% 46% / 56% 32% 68% 44%;
}

.launch-art-media {
  position: absolute;
  left: 50%;
  top: 44%;
  width: 340rpx;
  height: 340rpx;
  z-index: 1;
  transform: translate(-50%, -50%);
}

.launch-image-shadow {
  position: absolute;
  left: 50%;
  top: 79%;
  transform: translateX(-50%);
  pointer-events: none;
}

.launch-art-image {
  width: 100%;
  height: 100%;
}

.launch-art-image--interest {
  width: 100%;
  height: 100%;
}

.launch-art-image--personality {
  width: 100%;
  height: 100%;
}

.launch-art-image--career {
  width: 100%;
  height: 100%;
}

.launch-art-image--assessment {
  width: 100%;
  height: 100%;
}

.launch-copy {
  position: absolute;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  text-align: center;
  padding: 0 56rpx;
  box-sizing: border-box;
}

.launch-copy--interest {
  top: calc(894rpx + env(safe-area-inset-top));
}

.launch-copy--personality {
  top: calc(894rpx + env(safe-area-inset-top));
}

.launch-copy--career {
  top: calc(894rpx + env(safe-area-inset-top));
}

.launch-copy--assessment {
  top: calc(894rpx + env(safe-area-inset-top));
}

.launch-title {
  display: block;
  font-size: 52rpx;
  line-height: 1.9;
  color: #6b23ff;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.launch-subtitle {
  display: block;
  margin-top: 6rpx;
  font-size: 32rpx;
  line-height: 1.9;
  color: #4b4b4b;
}

.launch-topbar {
  position: absolute;
  top: calc(108rpx + env(safe-area-inset-top));
  right: 34rpx;
  z-index: 2;
}

.launch-skip {
  min-width: 112rpx;
  height: 54rpx;
  line-height: 54rpx;
  padding: 0 22rpx;
  border-radius: 24rpx;
  border: 2rpx solid rgba(178, 140, 255, 0.14);
  background: rgba(255, 255, 255, 0.72);
  color: #b38cf4;
  font-size: 24rpx;
  font-weight: 600;
}

.launch-skip::after,
.launch-primary::after {
  border: none;
}

.launch-footer {
  position: absolute;
  left: 32rpx;
  right: 32rpx;
  bottom: calc(116rpx + env(safe-area-inset-bottom));
  z-index: 2;
}

.launch-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18rpx;
}

.launch-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.14);
}

.launch-dot.active {
  background: #8b5cf6;
}

.launch-primary {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 999rpx;
  background: linear-gradient(180deg, #7b2dff 0%, #6322ef 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 700;
  border: none;
  box-shadow: 0 10rpx 0 #4410b3;
}
</style>
