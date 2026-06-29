/**
 * 小程序远程图片下载缓存。
 * 微信渲染层直接加载 https 图片时容易出现 ERR_CACHE_READ_FAILURE，
 * 先 downloadFile 到临时路径再展示更稳定。
 */

/** @type {Map<string, Promise<string>>} */
const downloadCache = new Map()

function isNetworkUrl(src) {
  return typeof src === 'string' && /^https?:\/\//i.test(src)
}

/**
 * @param {string} url
 * @returns {Promise<string>}
 */
export function downloadRemoteImage(url) {
  if (!isNetworkUrl(url)) {
    return Promise.resolve(url || '')
  }

  const cached = downloadCache.get(url)
  if (cached) return cached

  const task = new Promise((resolve) => {
    uni.downloadFile({
      url,
      success(res) {
        if (res.statusCode === 200 && res.tempFilePath) {
          resolve(res.tempFilePath)
          return
        }
        resolve(url)
      },
      fail() {
        resolve(url)
      },
    })
  })

  downloadCache.set(url, task)
  return task
}

export function clearRemoteImageCache() {
  downloadCache.clear()
}
