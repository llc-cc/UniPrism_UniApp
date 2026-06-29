const FIGMA_BASE = '/images/explore/discover/figma/business-school-list-assets'

export const BUSINESS_COLLEGE_ASSETS = {
  rowBg: `${FIGMA_BASE}/raw/row-bg-529-18565.png`,
  rowWave: `${FIGMA_BASE}/raw/row-wave-529-18565.svg`,
  iconEconomics: `${FIGMA_BASE}/transparent/icon-economics-529-18565.png`,
  iconFinance: `${FIGMA_BASE}/transparent/icon-finance-529-18565.png`,
  iconMarketing: `${FIGMA_BASE}/transparent/icon-marketing-529-18565.png`,
  iconAccounting: `${FIGMA_BASE}/transparent/icon-accounting-529-18565.png`,
  iconManagement: `${FIGMA_BASE}/transparent/icon-management-529-18565.png`,
}

/** Figma 529:18565 — card gradient fallback when row bg image is loading */
export const BUSINESS_ROW_GRADIENT = 'linear-gradient(155deg, #fef3e2 0%, #fde8c8 42%, #f8e8ec 100%)'

export const OPEN_BUSINESS_MAJOR_IDS = new Set(['econ-u', 'finance-u', 'marketing-u'])

export const BUSINESS_COLLEGE_SUBJECTS = [
  {
    id: 'econ-u',
    cn: '经济学院',
    en: 'Economics',
    icon: BUSINESS_COLLEGE_ASSETS.iconEconomics,
    tone: '#f3a43b',
  },
  {
    id: 'finance-u',
    cn: '金融学院',
    en: 'Finance',
    icon: BUSINESS_COLLEGE_ASSETS.iconFinance,
    tone: '#4477ff',
  },
  {
    id: 'marketing-u',
    cn: '营销学院',
    en: 'Marketing',
    icon: BUSINESS_COLLEGE_ASSETS.iconMarketing,
    tone: '#d86975',
  },
  {
    id: 'acct-u',
    cn: '会计学院',
    en: 'Accounting',
    icon: BUSINESS_COLLEGE_ASSETS.iconAccounting,
    tone: '#6b7280',
  },
  {
    id: 'management-u',
    cn: '管理学院',
    en: 'Management',
    icon: BUSINESS_COLLEGE_ASSETS.iconManagement,
    tone: '#6b7280',
  },
]

export function isBusinessMajorUnlocked(majorId) {
  return OPEN_BUSINESS_MAJOR_IDS.has(majorId)
}

export function isBusinessCollegeMajor(majorId) {
  return OPEN_BUSINESS_MAJOR_IDS.has(majorId)
}
