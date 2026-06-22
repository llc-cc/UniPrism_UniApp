/** 暂未开放的小程序页面（成就、更多）。 */
export const DISABLED_MINIAPP_ROUTES = [
  '/pages/achievement/index',
  '/pages/help/index',
]

const DISABLED_ROUTE_LABELS = {
  '/pages/achievement/index': '成就',
  '/pages/help/index': '更多',
}

export function normalizeMiniAppRoute(url) {
  const raw = String(url || '').trim()
  if (!raw) return ''
  const path = raw.split('?')[0]
  if (path.startsWith('/')) return path
  return `/${path}`
}

export function isDisabledMiniAppRoute(url) {
  return DISABLED_MINIAPP_ROUTES.includes(normalizeMiniAppRoute(url))
}

export function getDisabledMiniAppRouteLabel(url) {
  return DISABLED_ROUTE_LABELS[normalizeMiniAppRoute(url)] || '该功能'
}

export function showDisabledMiniAppRouteTip(label) {
  uni.showToast({
    title: `${label}功能暂未开放`,
    icon: 'none',
  })
}

/** 拦截跳转；返回 true 表示已拦截。 */
export function guardDisabledMiniAppRoute(url) {
  if (!isDisabledMiniAppRoute(url)) return false
  showDisabledMiniAppRouteTip(getDisabledMiniAppRouteLabel(url))
  return true
}

/** 底部 Tab 切换：禁用页只提示，不跳转。 */
export function navigateHomeTab(url) {
  if (guardDisabledMiniAppRoute(url)) return
  uni.reLaunch({ url })
}

/** 页面 onLoad：若直接打开禁用页则退回兴趣探索。 */
export function blockDisabledMiniAppPageEntry() {
  showDisabledMiniAppRouteTip(getDisabledMiniAppRouteLabel(getCurrentPageRoute()))
  uni.reLaunch({ url: '/pages/discover/index' })
}

function getCurrentPageRoute() {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  return current && current.route ? `/${current.route}` : ''
}
