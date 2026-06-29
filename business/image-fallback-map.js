/**
 * 生产环境配图走 OSS（resolveAsset）；本地 fallback 已关闭以控制代码包体积。
 * 开发态如需恢复完整映射：node scripts/generate-image-fallback-map.mjs
 */
export const IMAGE_FALLBACK_MAP = {}

export function getImageFallback() {
  return null
}
