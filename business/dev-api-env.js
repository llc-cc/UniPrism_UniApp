/**
 * 开发 / 真机 / 上线 API 配置
 *
 * 自动规则（MANUAL_DEV_API_MODE = null 时）：
 * - 微信开发者工具模拟器 → 127.0.0.1:3000
 * - 手机真机 / 预览 / 真机调试 → DEVICE_LAN_HOST:3000（连热点时用 ipconfig 查 WLAN IPv4）
 *
 * 只需维护 DEVICE_LAN_HOST（电脑 WiFi 的 IPv4）。
 */

/** 强制指定：'local' | 'device' | null（null = 自动识别） */
export const MANUAL_DEV_API_MODE = null

/** 真机调试：电脑 WiFi 的 IPv4 */

export const DEVICE_LAN_HOST = '192.168.1.20'

export const DEV_API_PORT = 3000

export const DEV_API_MODE_KEY = 'uniprism.devApiMode'
export const DEV_API_BUILD_MODE_KEY = 'uniprism.devApiBuildMode'

export const DEV_API_MODES = {
  local: 'local',
  device: 'device',
}

export const DEV_API_PRESETS = {
  local: `http://127.0.0.1:${DEV_API_PORT}`,
  device: `http://${DEVICE_LAN_HOST}:${DEV_API_PORT}`,
}

/** 是否在微信开发者工具模拟器里运行 */
export function isWechatDevtools() {
  try {
    if (typeof uni !== 'undefined' && typeof uni.getSystemInfoSync === 'function') {
      return uni.getSystemInfoSync().platform === 'devtools'
    }
  } catch {
    // ignore
  }
  return false
}

export function getBuildDevApiMode() {
  if (MANUAL_DEV_API_MODE === DEV_API_MODES.device || MANUAL_DEV_API_MODE === DEV_API_MODES.local) {
    return MANUAL_DEV_API_MODE
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env.VUE_APP_DEV_API_MODE) {
      return process.env.VUE_APP_DEV_API_MODE === DEV_API_MODES.device
        ? DEV_API_MODES.device
        : DEV_API_MODES.local
    }
  } catch {
    // ignore
  }
  return DEV_API_MODES.local
}

/**
 * 运行时实际使用的模式：模拟器走 local，手机走 device。
 */
export function resolveRuntimeDevApiMode() {
  if (MANUAL_DEV_API_MODE === DEV_API_MODES.device || MANUAL_DEV_API_MODE === DEV_API_MODES.local) {
    return MANUAL_DEV_API_MODE
  }
  if (isWechatDevtools()) return DEV_API_MODES.local
  if (typeof wx !== 'undefined' || typeof uni !== 'undefined') {
    return DEV_API_MODES.device
  }
  return getBuildDevApiMode()
}

export function resolveDevApiBaseUrl(mode) {
  if (mode === DEV_API_MODES.device) return DEV_API_PRESETS.device
  return DEV_API_PRESETS.local
}

export function getDevApiModeLabel(mode) {
  if (mode === DEV_API_MODES.device) return '真机调试'
  return '本地模拟器'
}
