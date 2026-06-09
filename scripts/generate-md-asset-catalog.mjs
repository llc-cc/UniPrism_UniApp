/**
 * 从 mini-program-asset-urls.md 生成 business/md-asset-catalog.js（无需联网）
 * 用法: node scripts/generate-md-asset-catalog.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const mdPath = path.resolve(root, '..', 'mini-program-asset-urls.md')
const outPath = path.join(root, 'business', 'md-asset-catalog.js')

function parsePathsFromMd(content) {
  const re = /https:\/\/uniprism\.cn(\/(?:design|images|videos)\/[^\s)]+)/g
  const seen = new Set()
  const paths = []
  for (const match of content.matchAll(re)) {
    const objectPath = match[1]
    if (!seen.has(objectPath)) {
      seen.add(objectPath)
      paths.push(objectPath)
    }
  }
  paths.sort()
  return paths
}

const md = fs.readFileSync(mdPath, 'utf8')
const paths = parsePathsFromMd(md)

const content = `/**
 * AUTO-GENERATED from mini-program-asset-urls.md — do not edit manually.
 * Run: node scripts/generate-md-asset-catalog.mjs
 * Total paths: ${paths.length}
 */
export const MD_ASSET_PATHS = new Set(${JSON.stringify(paths, null, 2)})

export function isMdCatalogAsset(path) {
  return MD_ASSET_PATHS.has(path)
}
`

fs.writeFileSync(outPath, content, 'utf8')
console.log(`Wrote ${paths.length} paths to ${outPath}`)
