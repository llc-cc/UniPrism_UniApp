/**
 * 小程序远程视频下载。
 * 微信 `<video>` 直接播放 https 远程地址在开发者工具/真机下容易 net::ERR_FAILED，
 * 先 uni.downloadFile 到临时路径再播放更稳定（与 remote-image.js 策略一致）。
 */
import { resolveVideoAssetCandidates } from './asset-map'

/** @type {Map<string, Promise<string>>} */
const downloadCache = new Map()

function isRemoteUrl(src) {
  return typeof src === 'string' && /^https?:\/\//i.test(src)
}

function tryDownload(url) {
  return new Promise((resolve) => {
    uni.downloadFile({
      url,
      timeout: 120000,
      success(res) {
        if (res.statusCode === 200 && res.tempFilePath) {
          resolve(res.tempFilePath)
          return
        }
        resolve('')
      },
      fail() {
        resolve('')
      },
    })
  })
}

/**
 * 将视频 catalog 路径或 https URL 解析为可播放地址。
 * 远程视频会依次尝试 CDN / 主站 / 开发 API，downloadFile 成功后返回 tempFilePath。
 * @param {string | undefined} src
 * @returns {Promise<string>}
 */
export async function downloadRemoteVideo(src) {
  if (!src) return ''

  const candidates = resolveVideoAssetCandidates(src)
  if (!candidates.length) return ''

  const first = candidates[0]
  if (!isRemoteUrl(first)) return first

  const cacheKey = candidates.join('|')
  const cached = downloadCache.get(cacheKey)
  if (cached) return cached

  const task = (async () => {
    for (const url of candidates) {
      if (!isRemoteUrl(url)) return url
      const tempPath = await tryDownload(url)
      if (tempPath) return tempPath
    }
    // All download attempts failed — return empty string rather than a
    // remote URL that will fail again and trigger a rendering-layer crash.
    return ''
  })()

  downloadCache.set(cacheKey, task)
  return task
}

export function clearRemoteVideoCache() {
  downloadCache.clear()
}
