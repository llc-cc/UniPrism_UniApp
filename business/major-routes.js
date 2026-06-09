import { getMajorById } from './explore-data'
import { hasMajorSpeedTemplate } from './major-speed-data'

/** 与 Web getMajorRoute 一致：math-u 直达数学模拟器，其余专业走速体验或导览页 */
export function getMajorRoute(majorId) {
  if (!majorId) return '/pages/discover/major'
  const major = getMajorById(majorId)
  if (major?.route) return major.route
  if (hasMajorSpeedTemplate(majorId)) {
    return `/pages/discover/major-speed?id=${encodeURIComponent(majorId)}`
  }
  return `/pages/discover/major-detail?id=${encodeURIComponent(majorId)}`
}

export function navigateToMajor(majorId) {
  if (!majorId) return
  uni.navigateTo({ url: getMajorRoute(majorId) })
}
