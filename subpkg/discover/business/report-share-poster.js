import { downloadRemoteImage } from '../utils/remote-image'

export const REPORT_SHARE_POSTER_WIDTH = 500
export const REPORT_SHARE_POSTER_HEIGHT = 400

const COLORS = {
  background: '#D9EFFF',
  header: '#3B7FD4',
  tagline: '#5A96D6',
  personalityDark: '#1C2130',
  personalityAccent: '#9AE34B',
  cta: '#5A96D6',
  placeholder: '#B8D4EF',
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function truncateText(ctx, text, maxWidth) {
  const normalized = normalizeText(text)
  if (!normalized) return ''
  if (ctx.measureText(normalized).width <= maxWidth) return normalized
  let truncated = normalized
  while (truncated.length > 1 && ctx.measureText(`${truncated}…`).width > maxWidth) {
    truncated = truncated.slice(0, -1)
  }
  return `${truncated}…`
}

function loadCanvasImage(canvas, src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null)
      return
    }
    const image = canvas.createImage()
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function drawCoverPlaceholder(ctx, x, y, width, height) {
  drawRoundedRect(ctx, x, y, width, height, 18)
  ctx.fillStyle = COLORS.placeholder
  ctx.fill()
}

function drawCoverImage(ctx, image, x, y, boxWidth, boxHeight) {
  if (!image) {
    drawCoverPlaceholder(ctx, x, y, boxWidth, boxHeight)
    return
  }

  const sourceWidth = image.width || boxWidth
  const sourceHeight = image.height || boxHeight
  const scale = Math.max(boxWidth / sourceWidth, boxHeight / sourceHeight)
  const cropWidth = boxWidth / scale
  const cropHeight = boxHeight / scale
  const cropX = (sourceWidth - cropWidth) / 2
  const cropY = (sourceHeight - cropHeight) / 2

  drawRoundedRect(ctx, x, y, boxWidth, boxHeight, 18)
  ctx.save()
  ctx.clip()
  ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, x, y, boxWidth, boxHeight)
  ctx.restore()
}

function drawPosterContent(ctx, model, coverImage, width, height) {
  const paddingX = 18
  const topY = 14
  const codeTag = normalizeText(model.codeTag) || 'RA型'
  const tagline = normalizeText(model.taglineText)
  const taglineDisplay = tagline ? `[ ${tagline} ]` : ''
  const personalityTypeName = normalizeText(model.personalityTypeName) || '未知'
  const personalitySuffix = normalizeText(model.personalitySuffix) || '人格'
  const ctaText = normalizeText(model.ctaText) || '快来体验我们的测试吧，看看你的推荐职业有哪些！'

  ctx.fillStyle = COLORS.background
  ctx.fillRect(0, 0, width, height)

  ctx.textBaseline = 'top'
  ctx.fillStyle = COLORS.header
  ctx.font = 'bold 14px sans-serif'
  const headerLeft = `他的兴趣类型是：${codeTag}`
  ctx.fillText(headerLeft, paddingX, topY)
  const headerLeftWidth = ctx.measureText(headerLeft).width

  if (taglineDisplay) {
    ctx.fillStyle = COLORS.tagline
    ctx.font = '11px sans-serif'
    const taglineMaxWidth = Math.max(72, width - paddingX * 2 - headerLeftWidth - 10)
    const fittedTagline = truncateText(ctx, taglineDisplay, taglineMaxWidth)
    const taglineWidth = ctx.measureText(fittedTagline).width
    ctx.fillText(fittedTagline, width - paddingX - taglineWidth, topY + 2)
  }

  const imageWidth = 184
  const imageHeight = 238
  const imageX = (width - imageWidth) / 2
  const imageY = 44
  drawCoverImage(ctx, coverImage, imageX, imageY, imageWidth, imageHeight)

  const personalityY = imageY + imageHeight + 12
  ctx.textBaseline = 'alphabetic'
  ctx.font = 'bold 24px sans-serif'
  const typeWidth = ctx.measureText(personalityTypeName).width
  const suffixWidth = ctx.measureText(personalitySuffix).width
  const personalityX = width - paddingX - typeWidth - suffixWidth
  ctx.fillStyle = COLORS.personalityDark
  ctx.fillText(personalityTypeName, personalityX, personalityY)
  ctx.fillStyle = COLORS.personalityAccent
  ctx.fillText(personalitySuffix, personalityX + typeWidth, personalityY)

  ctx.textBaseline = 'top'
  ctx.fillStyle = COLORS.cta
  ctx.font = '11px sans-serif'
  const ctaY = height - 30
  const fittedCta = truncateText(ctx, ctaText, width - paddingX * 2)
  const ctaWidth = ctx.measureText(fittedCta).width
  ctx.fillText(fittedCta, (width - ctaWidth) / 2, ctaY)
}

function createPosterCanvas(width, height, dpr) {
  if (typeof wx !== 'undefined' && wx.createOffscreenCanvas) {
    return {
      canvas: wx.createOffscreenCanvas({
        type: '2d',
        width: Math.round(width * dpr),
        height: Math.round(height * dpr),
      }),
      offscreen: true,
    }
  }
  return { canvas: null, offscreen: false }
}

function preparePosterContext(canvas, width, height, dpr, offscreen) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  if (offscreen) {
    ctx.scale(dpr, dpr)
  } else {
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.scale(dpr, dpr)
  }

  return ctx
}

function exportCanvasToTempFile(canvas, options = {}, componentInstance) {
  const width = options.width || REPORT_SHARE_POSTER_WIDTH
  const height = options.height || REPORT_SHARE_POSTER_HEIGHT
  const dpr = options.devicePixelRatio || 2
  const pixelWidth = Math.round(width * dpr)
  const pixelHeight = Math.round(height * dpr)

  return new Promise((resolve) => {
    setTimeout(() => {
      const success = (res) => resolve((res && res.tempFilePath) || '')
      const fail = () => resolve('')

      const params = options.offscreen
        ? { canvas, success, fail }
        : {
          canvas,
          x: 0,
          y: 0,
          width: pixelWidth,
          height: pixelHeight,
          destWidth: pixelWidth,
          destHeight: pixelHeight,
          fileType: 'png',
          quality: 1,
          success,
          fail,
        }

      if (typeof wx !== 'undefined' && wx.canvasToTempFilePath) {
        wx.canvasToTempFilePath(params, componentInstance)
        return
      }

      uni.canvasToTempFilePath(params, componentInstance)
    }, 220)
  })
}

export async function renderReportSharePosterToTempFile(model, options = {}) {
  if (!model) return ''

  const width = options.width || REPORT_SHARE_POSTER_WIDTH
  const height = options.height || REPORT_SHARE_POSTER_HEIGHT
  const systemInfo = typeof uni !== 'undefined' && uni.getSystemInfoSync ? uni.getSystemInfoSync() : {}
  const dpr = options.devicePixelRatio || systemInfo.pixelRatio || 2

  let canvas = options.domCanvas || null
  let offscreen = false

  if (!canvas) {
    const created = createPosterCanvas(width, height, dpr)
    canvas = created.canvas
    offscreen = created.offscreen
  }

  if (!canvas) return ''

  const ctx = preparePosterContext(canvas, width, height, dpr, offscreen)
  if (!ctx) return ''

  const coverSrc = normalizeText(options.coverSrc)
  const localCoverSrc = coverSrc ? await downloadRemoteImage(coverSrc) : ''
  const coverImage = await loadCanvasImage(canvas, localCoverSrc)
  drawPosterContent(ctx, model, coverImage, width, height)

  return exportCanvasToTempFile(canvas, {
    width,
    height,
    devicePixelRatio: dpr,
    offscreen,
  }, options.componentInstance)
}

export async function drawReportSharePoster(canvas, model, options = {}) {
  if (!canvas || !model) return ''

  const width = options.width || REPORT_SHARE_POSTER_WIDTH
  const height = options.height || REPORT_SHARE_POSTER_HEIGHT
  const dpr = options.devicePixelRatio || 1
  const ctx = preparePosterContext(canvas, width, height, dpr, false)
  if (!ctx) return ''

  const coverSrc = normalizeText(options.coverSrc)
  const localCoverSrc = coverSrc ? await downloadRemoteImage(coverSrc) : ''
  const coverImage = await loadCanvasImage(canvas, localCoverSrc)
  drawPosterContent(ctx, model, coverImage, width, height)
  return canvas
}

export function exportReportSharePoster(canvas, options = {}, componentInstance) {
  return exportCanvasToTempFile(canvas, options, componentInstance)
}
