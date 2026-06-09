import { api } from '../utils/api'

const AUTH_PAGE = '/pages/auth/login'
const HOME_PAGE = '/pages/discover/index'

let redirecting = false

/** 是否已登录（必须有 JWT）。 */
export function hasAppAccess() {
  return api.isLoggedIn()
}

/** 清除历史测试数据（跳过登录残留）。 */
export function cleanupStaleAuthState() {
  if (api.isLoggedIn()) return
  uni.removeStorageSync('uniprism.token')
  uni.removeStorageSync('uniprism.user')
}

function getCurrentRoute() {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  return current && current.route ? '/' + current.route : ''
}

function isAuthPage(route) {
  return route === AUTH_PAGE || route.endsWith('auth/login')
}

function isHomePage(route) {
  return route === HOME_PAGE || route.endsWith('discover/index')
}

function safeReLaunch(url) {
  const route = getCurrentRoute()
  if (route === url || route.endsWith(url.replace(/^\//, ''))) return
  if (redirecting) return

  redirecting = true
  uni.reLaunch({
    url,
    complete: () => {
      redirecting = false
    },
    fail: () => {
      redirecting = false
    },
  })
}

/** 未登录时跳转登录页（登录页本身豁免；启动瞬间 page 栈未就绪时不跳转）。 */
export function ensureAppAccess() {
  if (hasAppAccess()) return

  const route = getCurrentRoute()
  if (!route || isAuthPage(route)) return

  safeReLaunch(AUTH_PAGE)
}

/** 登录成功后进入首页。 */
export function goAppHome() {
  if (!hasAppAccess()) {
    safeReLaunch(AUTH_PAGE)
    return
  }

  const route = getCurrentRoute()
  if (isHomePage(route)) return

  safeReLaunch(HOME_PAGE)
}

/** 拦截未登录时的页面跳转（Tab 切换不会触发 App.onShow）。 */
export function setupAuthNavigationGuard() {
  function guard(options) {
    if (hasAppAccess()) return options

    const url = (options && options.url) || ''
    if (url.includes('auth/login')) return options

    safeReLaunch(AUTH_PAGE)
    return false
  }

  ;['navigateTo', 'redirectTo', 'switchTab'].forEach((name) => {
    uni.addInterceptor(name, { invoke: guard })
  })

  uni.addInterceptor('reLaunch', {
    invoke(options) {
      const url = (options && options.url) || ''
      if (url.includes('auth/login') || url.includes('discover/index')) {
        return options
      }
      return guard(options)
    },
  })
}
