import { getLocalAsset } from '../business/local-asset-map'
import { getImageFallback } from '../business/image-fallback-map'
import { getDownloadedRemoteAsset, isVerifiedRemoteAsset, VERIFIED_REMOTE_ASSET_PATHS } from '../business/remote-asset-registry'
import { isMdCatalogAsset } from '../business/md-asset-catalog'
/** 生产环境默认域名，与 mini-program-asset-urls.md 一致 */
export const DEFAULT_ASSET_HOST = 'https://uniprism.cn'

/** 静态资源域名与 API 分离，避免开发态回落到 127.0.0.1 导致图片失效 */
export function getAssetHost(): string {
  return DEFAULT_ASSET_HOST
}

/** @deprecated 请使用 getAssetHost() */
export const ASSET_HOST = DEFAULT_ASSET_HOST

function normalizePath(src: string): string | null {
  if (/^https?:\/\//i.test(src)) {
    try {
      const url = new URL(src)
      const configuredHost = new URL(getAssetHost()).host
      const defaultHost = new URL(DEFAULT_ASSET_HOST).host
      if (url.host !== defaultHost && url.host !== configuredHost) {
        return null
      }
      return url.pathname
    } catch {
      return null
    }
  }
  return src.startsWith('/') ? src : `/${src}`
}

function buildDirectUrl(objectPath: string): string {
  const host = getAssetHost().replace(/\/$/, '')
  return `${host}${objectPath}`
}

function isInterestChoiceIcon(objectPath: string): boolean {
  return objectPath.includes('/images/explore/discover/icons/generated/discover-choice-icon-interest-')
}

/**
 * 将相对或站内绝对路径转为可加载 URL。
 * 1. static/ 手工映射（local-asset-map）
 * 2. sync 脚本下载到本地的 PNG/JPG（remote-asset-registry）
 * 3. MD 收录且（未跑 sync 或已校验通过）→ 远程 direct URL
 * 4. sync 后仍失效的 /images/* → 本地 SVG fallback
 */
export function resolveAsset(src: string | undefined): string {
  if (!src) return ''

  const objectPath = normalizePath(src)
  if (!objectPath) return src

  const local = getLocalAsset(objectPath)
  if (local) return local

  const downloaded = getDownloadedRemoteAsset(objectPath)
  if (downloaded) return downloaded

  const registryReady = VERIFIED_REMOTE_ASSET_PATHS.size > 0

  if (isMdCatalogAsset(objectPath)) {
    if (!registryReady || isVerifiedRemoteAsset(objectPath)) {
      return buildDirectUrl(objectPath)
    }
  }

  if (objectPath.startsWith('/explore-static/')) {
    return buildDirectUrl(objectPath)
  }

  if (objectPath.startsWith('/design/')) {
    return buildDirectUrl(objectPath)
  }

  if (objectPath.startsWith('/images/')) {
    if (isInterestChoiceIcon(objectPath)) {
      return buildDirectUrl(objectPath)
    }
    const fallback = getImageFallback(objectPath)
    if (fallback) return fallback
    return buildDirectUrl(objectPath)
  }

  return ''
}

/** 返回候选 URL（local → direct → /images fallback） */
export function resolveAssetCandidates(src: string | undefined): string[] {
  if (!src) return []

  const objectPath = normalizePath(src)
  if (!objectPath) return [src]

  const local = getLocalAsset(objectPath)
  if (local) return [local]

  const downloaded = getDownloadedRemoteAsset(objectPath)
  if (downloaded) return [downloaded]

  const candidates: string[] = []
  const registryReady = VERIFIED_REMOTE_ASSET_PATHS.size > 0
  const allowRemote = isMdCatalogAsset(objectPath) && (!registryReady || isVerifiedRemoteAsset(objectPath))

  if (allowRemote) {
    candidates.push(buildDirectUrl(objectPath))
  }

  if (objectPath.startsWith('/explore-static/')) {
    candidates.push(buildDirectUrl(objectPath))
    candidates.push('/static/assets/discover/icon-generic.svg')
    return [...new Set(candidates.filter(Boolean))]
  }

  if (objectPath.startsWith('/design/')) {
    candidates.push(buildDirectUrl(objectPath))
    return [...new Set(candidates.filter(Boolean))]
  }

  if (objectPath.startsWith('/images/')) {
    if (isInterestChoiceIcon(objectPath)) {
      candidates.push(buildDirectUrl(objectPath))
      const fallback = getImageFallback(objectPath)
      if (fallback) candidates.push(fallback)
      candidates.push('/static/assets/discover/icon-generic.svg')
      return [...new Set(candidates.filter(Boolean))]
    }
    const fallback = getImageFallback(objectPath)
    if (fallback) candidates.push(fallback)
    candidates.push(buildDirectUrl(objectPath))
    if (objectPath.includes('/icons/generated/discover-choice-icon-')) {
      candidates.push('/static/assets/discover/icon-generic.svg')
    }
  }

  return [...new Set(candidates.filter(Boolean))]
}

/** resolveAsset 的别名 */
export const asset = resolveAsset

export function hasLocalAsset(src: string | undefined): src is string {
  if (!src) return false
  const objectPath = normalizePath(src)
  return Boolean(
    objectPath &&
      (getLocalAsset(objectPath) ||
        getDownloadedRemoteAsset(objectPath) ||
        getImageFallback(objectPath)),
  )
}
