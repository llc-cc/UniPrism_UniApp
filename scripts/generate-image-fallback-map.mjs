/**
 * 开发态离线映射生成器（默认写入空 stub，避免增大代码包）。
 * 完整映射（仅本地调试）：node scripts/generate-image-fallback-map.mjs --full
 * 用法: node scripts/generate-image-fallback-map.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const mdPath = path.resolve(root, '..', 'mini-program-asset-urls.md')
const outPath = path.join(root, 'business', 'image-fallback-map.js')

const md = fs.readFileSync(mdPath, 'utf8')
const paths = [...md.matchAll(/https:\/\/uniprism\.cn(\/images\/[^\s)]+)/g)].map((m) => m[1])

const STAGE_MAJOR = '/static/assets/discover/stage-major-experience.svg'
const STAGE_INTEREST = '/static/assets/discover/stage-interest.svg'
const STAGE_CAREER = '/static/assets/discover/stage-career.svg'
const STAGE_REPORT = '/static/assets/discover/stage-report.svg'
const TASK = '/static/assets/discover/task-card.svg'
const ICON = '/static/assets/discover/icon-generic.svg'
const QUESTION = '/static/assets/discover/interest-question.svg'
const CAREER = '/static/assets/careers/career-generic.svg'

const majorSvg = {
  'major-math.png': '/static/assets/majors/major-math.svg',
  'major-physics.png': '/static/assets/majors/major-physics.svg',
  'major-cs.png': '/static/assets/majors/major-cs.svg',
  'major-ai.png': '/static/assets/majors/major-ai.svg',
  'major-actuarial.svg': '/static/assets/majors/major-actuarial.svg',
  'major-economics.svg': '/static/assets/majors/major-economics.svg',
  'major-finance.svg': '/static/assets/majors/major-finance.svg',
  'major-chemistry.svg': '/static/assets/majors/major-chemistry.svg',
  'major-mechanical.svg': '/static/assets/majors/major-mechanical.svg',
  'major-ee.svg': '/static/assets/majors/major-ee.svg',
  'major-ic.svg': '/static/assets/majors/major-ic.svg',
  'major-bio.svg': '/static/assets/majors/major-bio.svg',
}

const atlasSvg = {
  'university.png': '/static/assets/atlas/university.svg',
  'college-science-alpha-v2.png': '/static/assets/atlas/college-science.svg',
  'college-engineering.png': '/static/assets/atlas/college-engineering.svg',
  'college-computer-alpha-v2.png': '/static/assets/atlas/college-computer.svg',
  'college-literature.png': '/static/assets/atlas/college-literature.svg',
  'college-business.png': '/static/assets/atlas/college-business.svg',
  'college-arts.png': '/static/assets/atlas/college-arts.svg',
}

function fallbackFor(objectPath) {
  const file = objectPath.split('/').pop() || ''

  if (objectPath.includes('/icons/generated/majors/') && majorSvg[file]) {
    return majorSvg[file]
  }
  if (objectPath.includes('/icons/atlas/') && atlasSvg[file]) {
    return atlasSvg[file]
  }
  if (objectPath.includes('/icons/recommendations/majors/cutout/') && majorSvg[file]) {
    return majorSvg[file]
  }
  if (objectPath.includes('/icons/generated/careers/') || objectPath.startsWith('/images/careers/')) {
    return CAREER
  }
  if (objectPath.includes('/generated/interest-q-')) return QUESTION
  if (objectPath.includes('stage-major-experience') || objectPath.includes('stage-hero-major')) return STAGE_MAJOR
  if (objectPath.includes('stage-career-simulation') || objectPath.includes('stage-hero-career')) return STAGE_CAREER
  if (objectPath.includes('interest-stage') || objectPath.includes('stage-hero-interest')) return STAGE_INTEREST
  if (objectPath.includes('step-report-bg') || objectPath.includes('report-ref') || objectPath.includes('generated-report')) {
    return STAGE_REPORT
  }
  if (objectPath.includes('/career-simulation/') || objectPath.includes('learn-careers')) return STAGE_CAREER
  if (objectPath.includes('learn-majors')) return STAGE_MAJOR
  if (objectPath.includes('/major-choice/') || objectPath.includes('task-')) return TASK
  if (objectPath.includes('/sidebar/') || objectPath.includes('/icons/ui/') || objectPath.includes('/icons/stagecards/')) {
    return ICON
  }
  if (objectPath.includes('/icons/academic/')) return ICON
  if (objectPath.includes('major-reveal') || objectPath.includes('nav-major-cap')) return STAGE_MAJOR
  return ICON
}

const writeStub = !process.argv.includes('--full')

if (writeStub) {
  const stub = `/**
 * 生产环境配图走 OSS（resolveAsset）；本地 fallback 已关闭以控制代码包体积。
 * 开发态完整映射：node scripts/generate-image-fallback-map.mjs --full
 */
export const IMAGE_FALLBACK_MAP = {}

export function getImageFallback() {
  return null
}
`
  fs.writeFileSync(outPath, stub, 'utf8')
  console.log(`Wrote OSS-only stub to ${outPath} (use --full for dev fallbacks)`)
  process.exit(0)
}

const map = {}
for (const objectPath of paths) {
  map[objectPath] = fallbackFor(objectPath)
}

const content = `/**
 * AUTO-GENERATED from mini-program-asset-urls.md — local SVG fallbacks for /images/*
 * Run: node scripts/generate-image-fallback-map.mjs --full
 * Total: ${Object.keys(map).length}
 */
export const IMAGE_FALLBACK_MAP = ${JSON.stringify(map, null, 2)}

export function getImageFallback(path) {
  return IMAGE_FALLBACK_MAP[path] || null
}
`

fs.writeFileSync(outPath, content, 'utf8')
console.log(`Wrote ${Object.keys(map).length} fallbacks to ${outPath}`)
