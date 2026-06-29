const FIGMA_BASE = '/images/explore/discover/figma/home-science-assets'

export const SCIENCE_COLLEGE_ASSETS = {
  rowBg: `${FIGMA_BASE}/major-row-bg-506-9919.png`,
  rowWave: `${FIGMA_BASE}/major-row-wave-506-9919.svg`,
  iconMath: `${FIGMA_BASE}/icon-math-506-9919.png`,
  iconPhysics: `${FIGMA_BASE}/icon-physics-506-9919.png`,
  iconChemistry: `${FIGMA_BASE}/icon-chemistry-506-9919.png`,
  iconBiology: `${FIGMA_BASE}/icon-biology-506-9919.png`,
}

/** Figma 506:9919 / 600:5792 — card gradient fallback when row bg image is loading */
export const SCIENCE_ROW_GRADIENT = 'linear-gradient(155deg, #d2f3ef 0%, #b8e8e4 40%, #b0ddf0 100%)'

/** Product rule: only math is routable in this pass. */
export const OPEN_SCIENCE_MAJOR_IDS = new Set(['math-u'])

export const SCIENCE_COLLEGE_SUBJECTS = [
  {
    id: 'math-u',
    cn: '数学',
    en: 'Mathematics',
    icon: SCIENCE_COLLEGE_ASSETS.iconMath,
  },
  {
    id: 'physics-u',
    cn: '物理',
    en: 'Physics',
    icon: SCIENCE_COLLEGE_ASSETS.iconPhysics,
  },
  {
    id: 'chem-u',
    cn: '化学',
    en: 'Chemistry',
    icon: SCIENCE_COLLEGE_ASSETS.iconChemistry,
  },
  {
    id: 'bio-u',
    cn: '生物',
    en: 'Biology',
    icon: SCIENCE_COLLEGE_ASSETS.iconBiology,
  },
]

export function isScienceMajorUnlocked(majorId) {
  return OPEN_SCIENCE_MAJOR_IDS.has(majorId)
}
