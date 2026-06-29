/**
 * 兴趣报告专业推荐区静态资源路径（OSS catalog）。
 * 与 Web ReportPanel MAJOR_ICON_FALLBACKS / REPORT_ASSETS 对齐。
 */
const GENERATED_ICON_BASE = '/images/explore/discover/icons/generated/'

/** TOP 排名两侧麦穗（report-v4；右侧在 UI 中水平镜像） */
export const REPORT_MAJOR_WHEAT = '/explore-static/discover/figma/report/report-v4-top-rank-corner.png'
export const REPORT_MAJOR_RIBBON_LEFT = REPORT_MAJOR_WHEAT
export const REPORT_MAJOR_RIBBON_RIGHT = REPORT_MAJOR_WHEAT

/** 报告专业卡片 iconPath 兜底（majorId → OSS 路径） */
export const REPORT_MAJOR_ICON_PATHS = {
  // AI & 计算机
  'ai-u': `${GENERATED_ICON_BASE}discover-major-artificial-intelligence-20260610-v2-flat2d.png`,
  'artificial-intelligence': `${GENERATED_ICON_BASE}discover-major-artificial-intelligence-20260610-v2-flat2d.png`,
  ai: `${GENERATED_ICON_BASE}discover-major-artificial-intelligence-20260610-v2-flat2d.png`,
  'cs-u': `${GENERATED_ICON_BASE}discover-major-computer-science-technology-20260610-v2-flat2d.png`,
  'computer-science-technology': `${GENERATED_ICON_BASE}discover-major-computer-science-technology-20260610-v2-flat2d.png`,
  'computer-science': `${GENERATED_ICON_BASE}discover-major-computer-science-technology-20260610-v2-flat2d.png`,
  'se-u': `${GENERATED_ICON_BASE}discover-major-software-engineering-20260608-v1.png`,
  'software-engineering': `${GENERATED_ICON_BASE}discover-major-software-engineering-20260608-v1.png`,
  'cyberspace-security': `${GENERATED_ICON_BASE}discover-major-cyberspace-security-20260610-v2-flat2d.png`,
  'information-security': `${GENERATED_ICON_BASE}discover-major-information-security-20260608-v1.png`,
  'data-science-big-data-technology': `${GENERATED_ICON_BASE}discover-major-data-science-big-data-technology-20260610-v2-flat2d.png`,
  'data-science': `${GENERATED_ICON_BASE}discover-major-data-science-big-data-technology-20260610-v2-flat2d.png`,
  'information-computing-science': `${GENERATED_ICON_BASE}discover-major-information-computing-science-20260608-v1.png`,
  'digital-media-technology': `${GENERATED_ICON_BASE}discover-major-digital-media-technology-20260610-v2-flat2d.png`,
  'geographic-information-science': `${GENERATED_ICON_BASE}discover-major-geographic-information-science-20260608-v1.png`,
  // 电子电气
  'ee-u': `${GENERATED_ICON_BASE}discover-major-electronic-information-engineering-20260610-v2-flat2d.png`,
  'electronic-information-engineering': `${GENERATED_ICON_BASE}discover-major-electronic-information-engineering-20260610-v2-flat2d.png`,
  'ic-u': `${GENERATED_ICON_BASE}discover-major-electronic-information-engineering-20260610-v2-flat2d.png`,
  'comm-u': `${GENERATED_ICON_BASE}discover-major-electronic-information-engineering-20260610-v2-flat2d.png`,
  // 工程
  'robotics-engineering': `${GENERATED_ICON_BASE}discover-major-robotics-engineering-20260608-v1.png`,
  'intelligent-manufacturing-engineering': `${GENERATED_ICON_BASE}discover-major-intelligent-manufacturing-engineering-20260608-v1.png`,
  automation: `${GENERATED_ICON_BASE}discover-major-automation-20260610-v2-flat2d.png`,
  'biomedical-engineering': `${GENERATED_ICON_BASE}discover-major-biomedical-engineering-20260610-v2-flat2d.png`,
  'mech-u': `${GENERATED_ICON_BASE}discover-major-intelligent-manufacturing-engineering-20260608-v1.png`,
  'materials-science-engineering': `${GENERATED_ICON_BASE}discover-major-materials-science-engineering-20260608-v1.png`,
  'industrial-design': `${GENERATED_ICON_BASE}discover-major-industrial-design-20260608-v1.png`,
  'design-u': `${GENERATED_ICON_BASE}discover-major-industrial-design-20260608-v1.png`,
  'aerospace-u': `${GENERATED_ICON_BASE}discover-major-intelligent-manufacturing-engineering-20260608-v1.png`,
  'civil-u': `${GENERATED_ICON_BASE}discover-major-intelligent-manufacturing-engineering-20260608-v1.png`,
  'arch-u': `${GENERATED_ICON_BASE}discover-major-industrial-design-20260608-v1.png`,
  // 数理
  'math-u': `${GENERATED_ICON_BASE}discover-major-mathematics-applied-mathematics-20260608-v1.png`,
  'mathematics-applied-mathematics': `${GENERATED_ICON_BASE}discover-major-mathematics-applied-mathematics-20260608-v1.png`,
  mathematics: `${GENERATED_ICON_BASE}discover-major-mathematics-applied-mathematics-20260608-v1.png`,
  math: `${GENERATED_ICON_BASE}discover-major-mathematics-applied-mathematics-20260608-v1.png`,
  'statistics-u': `${GENERATED_ICON_BASE}discover-major-statistics-20260608-v1.png`,
  statistics: `${GENERATED_ICON_BASE}discover-major-statistics-20260608-v1.png`,
  'physics-u': `${GENERATED_ICON_BASE}discover-major-physics-20260608-v1.png`,
  physics: `${GENERATED_ICON_BASE}discover-major-physics-20260608-v1.png`,
  'applied-physics': `${GENERATED_ICON_BASE}discover-major-applied-physics-20260610-v2-flat2d.png`,
  'astronomy-u': `${GENERATED_ICON_BASE}discover-major-physics-20260608-v1.png`,
  // 化学与生物
  'chem-u': `${GENERATED_ICON_BASE}discover-major-biomedical-engineering-20260610-v2-flat2d.png`,
  'bio-u': `${GENERATED_ICON_BASE}discover-major-biomedical-engineering-20260610-v2-flat2d.png`,
  'bioeng-u': `${GENERATED_ICON_BASE}discover-major-biomedical-engineering-20260610-v2-flat2d.png`,
  'pharma-u': `${GENERATED_ICON_BASE}discover-major-biomedical-engineering-20260610-v2-flat2d.png`,
  // 社会人文
  'edu-u': `${GENERATED_ICON_BASE}discover-major-education-20260610-v2-flat2d.png`,
  education: `${GENERATED_ICON_BASE}discover-major-education-20260610-v2-flat2d.png`,
  'psych-u': `${GENERATED_ICON_BASE}discover-major-psychology-20260608-v1.png`,
  psychology: `${GENERATED_ICON_BASE}discover-major-psychology-20260608-v1.png`,
  'chinese-u': `${GENERATED_ICON_BASE}discover-major-education-20260610-v2-flat2d.png`,
  'history-u': `${GENERATED_ICON_BASE}discover-major-education-20260610-v2-flat2d.png`,
  // 经管法
  'finance-u': `${GENERATED_ICON_BASE}discover-major-finance-20260608-v1.png`,
  finance: `${GENERATED_ICON_BASE}discover-major-finance-20260608-v1.png`,
  'financial-engineering': `${GENERATED_ICON_BASE}discover-major-financial-engineering-20260608-v1.png`,
  'marketing-u': `${GENERATED_ICON_BASE}discover-major-marketing-20260608-v1.png`,
  marketing: `${GENERATED_ICON_BASE}discover-major-marketing-20260608-v1.png`,
  'econ-u': `${GENERATED_ICON_BASE}discover-major-economics-20260610-v2-flat2d.png`,
  economics: `${GENERATED_ICON_BASE}discover-major-economics-20260610-v2-flat2d.png`,
  'economic-statistics': `${GENERATED_ICON_BASE}discover-major-economic-statistics-20260610-v2-flat2d.png`,
  'acct-u': `${GENERATED_ICON_BASE}discover-major-accounting-20260610-v2-flat2d.png`,
  accounting: `${GENERATED_ICON_BASE}discover-major-accounting-20260610-v2-flat2d.png`,
  'biz-u': `${GENERATED_ICON_BASE}discover-major-economics-20260610-v2-flat2d.png`,
  'business-administration': `${GENERATED_ICON_BASE}discover-major-economics-20260610-v2-flat2d.png`,
  'law-u': `${GENERATED_ICON_BASE}discover-major-law-20260608-v1.png`,
  law: `${GENERATED_ICON_BASE}discover-major-law-20260608-v1.png`,
  // 医学
  'med-u': `${GENERATED_ICON_BASE}discover-major-clinical-medicine-20260610-v2-flat2d.png`,
  'clinical-medicine': `${GENERATED_ICON_BASE}discover-major-clinical-medicine-20260610-v2-flat2d.png`,
  medicine: `${GENERATED_ICON_BASE}discover-major-clinical-medicine-20260610-v2-flat2d.png`,
  // 旧版/特殊 ID
  'major-e7949fe789a9e4bfa1e681af': `${GENERATED_ICON_BASE}discover-major-major-e7949fe789a9e4bfa1e681af-20260608-v1.png`,
  'major-e7b2bee7ae97e5ada6': `${GENERATED_ICON_BASE}discover-major-major-e7b2bee7ae97e5ada6-20260608-v1.png`,
}

/** 按中文专业名关键词匹配 MD 文档中的 generated 图标（与 Web ReportPanel 对齐）。 */
function resolveMajorIconByName(name) {
  const label = String(name || '').trim()
  if (!label) return ''

  const rules = [
    ['人工智能', 'ai-u'],
    ['计算机', 'cs-u'],
    ['网络空间安全', 'cyberspace-security'],
    ['信息安全', 'information-security'],
    ['软件工程', 'software-engineering'],
    ['数据科学', 'data-science-big-data-technology'],
    ['电子信息', 'electronic-information-engineering'],
    ['机器人工程', 'robotics-engineering'],
    ['智能制造', 'intelligent-manufacturing-engineering'],
    ['自动化', 'automation'],
    ['信息与计算', 'information-computing-science'],
    ['数字媒体技术', 'digital-media-technology'],
    ['地理信息', 'geographic-information-science'],
    ['生物医学', 'biomedical-engineering'],
    ['工业设计', 'industrial-design'],
    ['数学', 'math-u'],
    ['统计', 'statistics-u'],
    ['应用物理', 'applied-physics'],
    ['物理', 'physics-u'],
    ['设计', 'design-u'],
    ['教育', 'edu-u'],
    ['心理', 'psych-u'],
    ['金融工程', 'financial-engineering'],
    ['金融', 'finance-u'],
    ['经济统计', 'economic-statistics'],
    ['营销', 'marketing-u'],
    ['经济', 'econ-u'],
    ['会计', 'acct-u'],
    ['法学', 'law-u'],
    ['临床医学', 'clinical-medicine'],
    ['医学', 'med-u'],
    ['生物信息', 'major-e7949fe789a9e4bfa1e681af'],
    ['精算', 'major-e7b2bee7ae97e5ada6'],
    ['材料', 'materials-science-engineering'],
  ]

  for (let i = 0; i < rules.length; i += 1) {
    const [keyword, majorKey] = rules[i]
    if (label.includes(keyword)) {
      return REPORT_MAJOR_ICON_PATHS[majorKey] || ''
    }
  }

  return ''
}

function normalizeCatalogPath(path) {
  if (!path || typeof path !== 'string') return ''
  const trimmed = path.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/explore-static/')) {
    return trimmed.replace(/^\/explore-static\//, '/images/explore/')
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
}

function findReportMajorEntry(reportMajors, id, name) {
  const list = optionsList(reportMajors)
  if (id) {
    const byId = list.find((item) => item.majorId === id)
    if (byId) return byId
  }
  if (name) {
    return list.find((item) => String(item.name || '').trim() === name) || null
  }
  return null
}

function optionsList(reportMajors) {
  return Array.isArray(reportMajors) ? reportMajors : []
}

export function resolveReportMajorIconPath(majorId, options = {}) {
  const id = String(majorId || '').trim()
  const name = String(options.name || '').trim()
  const reportMajors = optionsList(options.reportMajors)

  if (id && REPORT_MAJOR_ICON_PATHS[id]) {
    return REPORT_MAJOR_ICON_PATHS[id]
  }

  const reportEntry = findReportMajorEntry(reportMajors, id, name)
  const fromReport = normalizeCatalogPath(reportEntry && reportEntry.iconPath)
  if (fromReport) return fromReport

  const byName = resolveMajorIconByName(name)
  if (byName) return byName

  const localIcon = options.localIcon
  if (localIcon) return normalizeCatalogPath(localIcon) || localIcon

  return ''
}
