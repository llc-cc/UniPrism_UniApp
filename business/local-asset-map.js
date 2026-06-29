/**
 * 本地 SVG 兜底映射。
 * resolveAsset() 会先查此表，有本地文件则直接用，避免 OSS 缺文件导致空缺。
 * 没有本地兜底的路径仍走 OSS CDN。
 */
export const LOCAL_ASSET_MAP = {
  // ── 专业图标（报告页核心，本地 SVG 保底）──────────────────────────────
  '/images/explore/discover/icons/generated/discover-major-economics-20260610-v2-flat2d.png':
    '/static/assets/majors/major-economics.svg',
  '/images/explore/discover/icons/generated/discover-major-artificial-intelligence-20260610-v2-flat2d.png':
    '/static/assets/majors/major-ai.svg',
  '/images/explore/discover/icons/generated/discover-major-computer-science-technology-20260610-v2-flat2d.png':
    '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/discover-major-finance-20260608-v1.png':
    '/static/assets/majors/major-finance.svg',
  '/images/explore/discover/icons/generated/discover-major-data-science-big-data-technology-20260610-v2-flat2d.png':
    '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/discover-major-mathematics-applied-mathematics-20260608-v1.png':
    '/static/assets/majors/major-math.svg',
  '/images/explore/discover/icons/generated/discover-major-statistics-20260608-v1.png':
    '/static/assets/majors/major-math.svg',
  '/images/explore/discover/icons/generated/discover-major-physics-20260608-v1.png':
    '/static/assets/majors/major-physics.svg',
  '/images/explore/discover/icons/generated/discover-major-applied-physics-20260610-v2-flat2d.png':
    '/static/assets/majors/major-physics.svg',
  '/images/explore/discover/icons/generated/discover-major-cyberspace-security-20260610-v2-flat2d.png':
    '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/discover-major-information-security-20260608-v1.png':
    '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/discover-major-software-engineering-20260608-v1.png':
    '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/discover-major-electronic-information-engineering-20260610-v2-flat2d.png':
    '/static/assets/majors/major-ee.svg',
  '/images/explore/discover/icons/generated/discover-major-robotics-engineering-20260608-v1.png':
    '/static/assets/majors/major-mechanical.svg',
  '/images/explore/discover/icons/generated/discover-major-intelligent-manufacturing-engineering-20260608-v1.png':
    '/static/assets/majors/major-mechanical.svg',
  '/images/explore/discover/icons/generated/discover-major-automation-20260610-v2-flat2d.png':
    '/static/assets/majors/major-mechanical.svg',
  '/images/explore/discover/icons/generated/discover-major-information-computing-science-20260608-v1.png':
    '/static/assets/majors/major-math.svg',
  '/images/explore/discover/icons/generated/discover-major-digital-media-technology-20260610-v2-flat2d.png':
    '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/discover-major-geographic-information-science-20260608-v1.png':
    '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/discover-major-biomedical-engineering-20260610-v2-flat2d.png':
    '/static/assets/majors/major-bio.svg',
  '/images/explore/discover/icons/generated/discover-major-industrial-design-20260608-v1.png':
    '/static/assets/majors/major-mechanical.svg',
  '/images/explore/discover/icons/generated/discover-major-materials-science-engineering-20260608-v1.png':
    '/static/assets/majors/major-mechanical.svg',
  '/images/explore/discover/icons/generated/discover-major-accounting-20260610-v2-flat2d.png':
    '/static/assets/majors/major-finance.svg',
  '/images/explore/discover/icons/generated/discover-major-financial-engineering-20260608-v1.png':
    '/static/assets/majors/major-finance.svg',
  '/images/explore/discover/icons/generated/discover-major-economic-statistics-20260610-v2-flat2d.png':
    '/static/assets/majors/major-economics.svg',
  '/images/explore/discover/icons/generated/discover-major-clinical-medicine-20260610-v2-flat2d.png':
    '/static/assets/majors/major-bio.svg',

  // ── 旧版路径别名 ────────────────────────────────────────────────────────
  '/images/explore/discover/icons/generated/majors/major-math.png':
    '/static/assets/majors/major-math.svg',
  '/images/explore/discover/icons/generated/majors/major-physics.png':
    '/static/assets/majors/major-physics.svg',
  '/images/explore/discover/icons/generated/majors/major-cs.png':
    '/static/assets/majors/major-cs.svg',
  '/images/explore/discover/icons/generated/majors/major-ai.png':
    '/static/assets/majors/major-ai.svg',
  '/images/explore/discover/icons/generated/majors/major-finance.svg':
    '/static/assets/majors/major-finance.svg',
  '/images/explore/discover/icons/generated/majors/major-economics.svg':
    '/static/assets/majors/major-economics.svg',
  '/images/explore/discover/icons/generated/majors/major-actuarial.svg':
    '/static/assets/majors/major-actuarial.svg',
  '/images/explore/discover/icons/generated/majors/major-chemistry.svg':
    '/static/assets/majors/major-chemistry.svg',
  '/images/explore/discover/icons/generated/majors/major-mechanical.svg':
    '/static/assets/majors/major-mechanical.svg',
  '/images/explore/discover/icons/generated/majors/major-ee.svg':
    '/static/assets/majors/major-ee.svg',
  '/images/explore/discover/icons/generated/majors/major-ic.svg':
    '/static/assets/majors/major-ic.svg',
  '/images/explore/discover/icons/generated/majors/major-bio.svg':
    '/static/assets/majors/major-bio.svg',

  // ── 报告/首页关键图 ─────────────────────────────────────────────────────
  '/explore-static/discover/figma/report/report-v4-top-rank-corner.png':
    '/static/assets/discover/major-ribbon-left.svg',
  '/images/explore/discover/figma/report/major-ribbon-left.svg':
    '/static/assets/discover/major-ribbon-left.svg',
  '/images/explore/discover/figma/report/major-ribbon-right.svg':
    '/static/assets/discover/major-ribbon-right.svg',

  // ── 通用 UI SVG ─────────────────────────────────────────────────────────
  '/images/explore/discover/figma/profile-clipboard-figma-1-6962.svg':
    '/static/assets/discover/profile-clipboard-figma.svg',
  '/images/explore/discover/figma/profile-clipboard-figma-1-6962-white-2x.png':
    '/static/assets/discover/profile-clipboard-figma.svg',
  '/explore-static/discover/figma/profile-clipboard-figma-1-6962-white-2x.png':
    '/static/assets/discover/profile-clipboard-figma.svg',

  // ── launch 页卡片 ────────────────────────────────────────────────────────
  '/images/explore/home/card-interest.svg': '/static/assets/auth/card-interest.svg',
  '/images/explore/home/card-personality.svg': '/static/assets/auth/card-personality.svg',
  '/images/explore/home/card-career.svg': '/static/assets/auth/card-career.svg',
  '/images/explore/home/card-ability.svg': '/static/assets/auth/card-ability.svg',
  '/images/explore/home/background-curves.svg': '/static/assets/auth/background-curves.svg',
  '/images/explore/home/card-interest@4x.png': '/static/assets/auth/card-interest.svg',
  '/images/explore/home/card-personality@4x.png': '/static/assets/auth/card-personality.svg',
  '/images/explore/home/card-career@4x.png': '/static/assets/auth/card-career.svg',
  '/images/explore/home/card-ability@4x.png': '/static/assets/auth/card-ability.svg',
}

export function getLocalAsset(path) {
  return LOCAL_ASSET_MAP[path] || null
}
