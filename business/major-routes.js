export function getMajorRoute(majorId) {
  if (!majorId) return '/pages/discover/major'
  return `/pages/discover/major-detail?id=${encodeURIComponent(majorId)}`
}

export function navigateToMajor(majorId) {
  if (!majorId) return
  uni.navigateTo({ url: getMajorRoute(majorId) })
}
