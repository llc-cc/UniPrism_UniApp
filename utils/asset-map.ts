import { getLocalAsset } from '../business/local-asset-map'
import { getImageFallback } from '../business/image-fallback-map'
import { getDownloadedRemoteAsset, isVerifiedRemoteAsset, VERIFIED_REMOTE_ASSET_PATHS } from '../business/remote-asset-registry'
import { isMdCatalogAsset } from '../business/md-asset-catalog'
import { api } from './api'

/** 生产环境默认域名，与 mini-program-asset-urls.md 一致 */
export const DEFAULT_ASSET_HOST = 'https://uniprism.cn'

/** 与 API 基地址共用配置（本地调试可改 uniprism.apiBaseUrl） */
export function getAssetHost(): string {
  try {
    return api.getBaseUrl() || DEFAULT_ASSET_HOST
  } catch {
    return DEFAULT_ASSET_HOST
  }
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

function buildRemoteUrl(objectPath: string): string {
  const host = getAssetHost().replace(/\/$/, '')
  // 优先走 OSS 代理；小程序不依赖 Next.js rewrite
  return `${host}/api/oss-assets${objectPath}`
}

function buildDirectUrl(objectPath: string): string {
  const host = getAssetHost().replace(/\/$/, '')
  return `${host}${objectPath}`
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
      if (objectPath.startsWith('/design/') || objectPath.startsWith('/videos/')) {
        return buildRemoteUrl(objectPath)
      }
      return buildDirectUrl(objectPath)
    }
  }

  if (objectPath.startsWith('/images/')) {
    const fallback = getImageFallback(objectPath)
    if (fallback) return fallback
    return buildDirectUrl(objectPath)
  }

  return ''
}

/** 返回候选 URL（local → direct → oss 代理 → /images fallback） */
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
    if (objectPath.startsWith('/design/') || objectPath.startsWith('/videos/')) {
      candidates.push(buildRemoteUrl(objectPath))
      candidates.push(buildDirectUrl(objectPath))
    } else {
      candidates.push(buildDirectUrl(objectPath))
      candidates.push(buildRemoteUrl(objectPath))
    }
  }

  if (objectPath.startsWith('/images/')) {
    const fallback = getImageFallback(objectPath)
    if (fallback) candidates.push(fallback)
    candidates.push(buildDirectUrl(objectPath))
    candidates.push(buildRemoteUrl(objectPath))
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
