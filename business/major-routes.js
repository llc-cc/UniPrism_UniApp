export function getMajorRoute(majorId) {
  if (!majorId) return '/pages/discover/major'
  if (majorId === 'math-u') return '/pages/math/deep-explore'
  return `/pages/discover/major-detail?id=${encodeURIComponent(majorId)}`
}

export function navigateToMajor(majorId) {
  if (!majorId) return
  if (majorId === 'math-u') {
    uni.navigateTo({ url: '/pages/math/deep-explore' })
    return
  }
  uni.navigateTo({ url: getMajorRoute(majorId) })
}
