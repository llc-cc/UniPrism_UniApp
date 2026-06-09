/**
 * 小程序内置静态资源映射。
 * 当 uniprism.cn 远程 OSS 代理不可用时，优先使用 /static 下的本地文件。
 * 路径 key 与 mini-program-asset-urls.md 中的站内路径一致。
 */
export const LOCAL_ASSET_MAP = {
  '/images/explore/discover/icons/atlas/university.png': '/static/assets/atlas/university.svg',
  '/images/explore/discover/icons/atlas/college-science-alpha-v2.png': '/static/assets/atlas/college-science.svg',
  '/images/explore/discover/icons/atlas/college-engineering.png': '/static/assets/atlas/college-engineering.svg',
  '/images/explore/discover/icons/atlas/college-computer-alpha-v2.png': '/static/assets/atlas/college-computer.svg',
  '/images/explore/discover/icons/atlas/college-literature.png': '/static/assets/atlas/college-literature.svg',
  '/images/explore/discover/icons/atlas/college-business.png': '/static/assets/atlas/college-business.svg',
  '/images/explore/discover/icons/atlas/college-arts.png': '/static/assets/atlas/college-arts.svg',
  '/images/explore/discover/generated/stage-major-experience-crop.png': '/static/assets/discover/stage-major-experience.svg',
  '/images/explore/discover/stage-hero-major-clean.png': '/static/assets/discover/stage-major-experience.svg',
  '/images/explore/discover/icons/generated/majors/major-math.png': '/static/assets/majors/major-math.svg',
  '/images/explore/discover/icons/generated/majors/major-physics.png': '/static/assets/majors/major-physics.svg',
  '/images/explore/discover/icons/generated/majors/major-cs.png': '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/majors/major-ai.png': '/static/assets/majors/major-ai.svg',
  '/images/explore/discover/icons/generated/majors/major-finance.svg': '/static/assets/majors/major-finance.svg',
  '/images/explore/discover/icons/generated/majors/major-economics.svg': '/static/assets/majors/major-economics.svg',
  '/images/explore/discover/icons/generated/majors/major-actuarial.svg': '/static/assets/majors/major-actuarial.svg',
  '/images/explore/discover/icons/generated/majors/major-chemistry.svg': '/static/assets/majors/major-chemistry.svg',
  '/images/explore/discover/icons/generated/majors/major-mechanical.svg': '/static/assets/majors/major-mechanical.svg',
  '/images/explore/discover/icons/generated/majors/major-ee.svg': '/static/assets/majors/major-ee.svg',
  '/images/explore/discover/icons/generated/majors/major-ic.svg': '/static/assets/majors/major-ic.svg',
}

export function getLocalAsset(path) {
  return LOCAL_ASSET_MAP[path] || null
}
