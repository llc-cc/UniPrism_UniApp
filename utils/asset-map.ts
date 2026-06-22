import { getLocalAsset } from '../business/local-asset-map'
import { getImageFallback } from '../business/image-fallback-map'
import { getDownloadedRemoteAsset } from '../business/remote-asset-registry'
import { isMdCatalogAsset } from '../business/md-asset-catalog'

/** 生产 OSS CDN，与 uniprism.cn 307 跳转目标一致 */
export const DEFAULT_ASSET_HOST = 'https://assets.uniprism.cn'
export const LEGACY_ASSET_HOST = 'https://uniprism.cn'

const REMOTE_CATALOG_PREFIXES = ['/images/', '/explore-static/', '/design/', '/videos/']

/** 静态资源域名与 API 分离，避免开发态回落到 127.0.0.1 导致图片失效 */
export function getAssetHost(): string {
  if (typeof process !== 'undefined' && process.env) {
    const configured = (process.env.VUE_APP_ASSET_HOST || process.env.VITE_APP_ASSET_HOST || '').trim()
    if (configured) return configured.replace(/\/$/, '')
  }
  return DEFAULT_ASSET_HOST
}

/** @deprecated 请使用 getAssetHost() */
export const ASSET_HOST = DEFAULT_ASSET_HOST

function isDevBuild(): boolean {
  try {
    return typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development'
  } catch {
    return false
  }
}

function getEnvApiBase(): string {
  if (typeof process === 'undefined' || !process.env) return ''
  return (process.env.VUE_APP_API_BASE_URL || process.env.VITE_APP_API_BASE_URL || '').replace(/\/$/, '')
}

function getRuntimeDevApiBase(): string {
  if (!isDevBuild()) return ''
  try {
    const uniApi = (globalThis as { uni?: { getStorageSync?: (key: string) => unknown } }).uni
    const stored = uniApi?.getStorageSync?.('uniprism.apiBaseUrl')
    if (typeof stored === 'string' && stored.trim()) {
      return stored.trim().replace(/\/$/, '')
    }
  } catch {
    // ignore storage access errors
  }
  return getEnvApiBase() || 'http://127.0.0.1:3000'
}

function isCatalogPath(objectPath: string): boolean {
  return REMOTE_CATALOG_PREFIXES.some((prefix) => objectPath.startsWith(prefix)) || isMdCatalogAsset(objectPath)
}

function normalizePath(src: string): string | null {
  if (/^https?:\/\//i.test(src)) {
    try {
      const url = new URL(src)
      const host = url.hostname
      const path = url.pathname.startsWith('/') ? url.pathname : `/${url.pathname}`

      if (host === '127.0.0.1' || host === 'localhost') {
        return isCatalogPath(path) ? path : null
      }

      const allowedHosts = new Set([
        new URL(getAssetHost()).host,
        new URL(DEFAULT_ASSET_HOST).host,
        new URL(LEGACY_ASSET_HOST).host,
        'assets.uniprism.cn',
        'uniprism.cn',
      ])
      if (!allowedHosts.has(host)) {
        return isCatalogPath(path) ? path : null
      }
      return path
    } catch {
      return null
    }
  }
  return src.startsWith('/') ? src : `/${src}`
}

function buildDirectUrl(host: string, objectPath: string): string {
  return `${host.replace(/\/$/, '')}${objectPath}`
}

function isRemoteCatalogPath(objectPath: string): boolean {
  return isCatalogPath(objectPath)
}

function buildRemoteAssetUrlCandidates(objectPath: string): string[] {
  const candidates: string[] = []
  const assetHost = getAssetHost().replace(/\/$/, '')

  if (assetHost) {
    candidates.push(buildDirectUrl(assetHost, objectPath))
  }
  if (assetHost !== DEFAULT_ASSET_HOST) {
    candidates.push(buildDirectUrl(DEFAULT_ASSET_HOST, objectPath))
  }
  candidates.push(buildDirectUrl(LEGACY_ASSET_HOST, objectPath))
  candidates.push(buildDirectUrl(LEGACY_ASSET_HOST, `/api/oss-assets${objectPath}`))

  const devApiBase = getRuntimeDevApiBase()
  if (devApiBase) {
    candidates.push(buildDirectUrl(devApiBase, objectPath))
    candidates.push(buildDirectUrl(devApiBase, `/api/oss-assets${objectPath}`))
  }

  return candidates
}

function appendLocalCandidates(objectPath: string, candidates: string[]): string[] {
  const local = getLocalAsset(objectPath)
  if (local) candidates.push(local)

  const downloaded = getDownloadedRemoteAsset(objectPath)
  if (downloaded) candidates.push(downloaded)

  const fallback = getImageFallback(objectPath)
  if (fallback) candidates.push(fallback)

  if (objectPath.startsWith('/images/') || objectPath.startsWith('/explore-static/')) {
    candidates.push('/static/assets/discover/icon-generic.svg')
  }

  return [...new Set(candidates.filter(Boolean))]
}

/**
 * 将相对或站内绝对路径转为可加载 URL。
 * 1. /static/* 等小程序内置资源 → 原样使用
 * 2. OSS 收录路径 → CDN direct URL（上线默认）
 * 3. local-asset-map / remote-asset-registry → 仅作离线兜底
 * 4. /images/* SVG fallback → 最后兜底
 */
export function resolveAsset(src: string | undefined): string {
  if (!src) return ''

  if (src.startsWith('/static/')) return src

  const objectPath = normalizePath(src)
  if (!objectPath) return ''

  if (isRemoteCatalogPath(objectPath)) {
    return buildRemoteAssetUrlCandidates(objectPath)[0] || ''
  }

  const local = getLocalAsset(objectPath)
  if (local) return local

  const downloaded = getDownloadedRemoteAsset(objectPath)
  if (downloaded) return downloaded

  const fallback = getImageFallback(objectPath)
  if (fallback) return fallback

  return ''
}

/** 返回候选 URL（CDN → 本地 API → local → SVG fallback） */
export function resolveAssetCandidates(src: string | undefined): string[] {
  if (!src) return []

  if (src.startsWith('/static/')) return [src]

  const objectPath = normalizePath(src)
  if (!objectPath) return []

  const candidates: string[] = []

  if (isRemoteCatalogPath(objectPath)) {
    candidates.push(...buildRemoteAssetUrlCandidates(objectPath))
  }

  return appendLocalCandidates(objectPath, candidates)
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
