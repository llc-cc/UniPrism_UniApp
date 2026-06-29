export const REPORT_PERSONA_CARD_BASE = '/explore-static/discover/persona-cards/framed-final-20260623'

const RIASEC_DIMENSIONS = ['R', 'I', 'A', 'S', 'E', 'C']

/** Ordered RIASEC pair → persona card title (manifest framed-final-20260623). */
const REPORT_PERSONA_TYPE_TITLES = {
  RI: '芯片中 7nm 和 3nm 之间的缝隙',
  RA: '指挥机械作诗的交响乐家',
  RS: '人群最后的守护者',
  RE: '让流水线流向远方的创造者',
  RC: '复用 CR：无法摆脱的万有引力',
  IR: '最后一厘米的互联网光缆',
  IA: '深夜用代码写诗的哲学家',
  IS: '社会进步的先驱者',
  IE: '改变世界的科学家',
  IC: '实验室里的大师兄/姐',
  AR: '高维大脑里的三维居民',
  AI: '复用 AC：纳米级高科技雕刻家',
  AS: '用魔法治愈世界的小天使',
  AE: '玛丽莲梦露背后的设计师',
  AC: '纳米级高科技雕刻家',
  SR: '沉默的持伞人',
  SI: '分析人群的程序员',
  SA: '大合影背后的一道彩虹',
  SE: '人类文明的架构师',
  SC: '工业血管的细胞',
  ER: '将梦想写在日程表的船长',
  EI: '硅谷车库里的野心家',
  EA: '在发布会唱跳 Rap 的创始人',
  ES: '舞台前的演说家',
  EC: '老练的组织指挥官',
  CR: '无法摆脱的万有引力',
  CI: '修行多年的武林高手',
  CA: '给小行星命名的研究员',
  CS: '宇宙火箭的推进剂',
  CE: '把梦想写成软件的执行官',
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function normalizeRiasecPairCode(code, topDimensions) {
  const fromTop = (Array.isArray(topDimensions) ? topDimensions : [])
    .map((item) => normalizeText(item).toUpperCase())
    .filter((item) => RIASEC_DIMENSIONS.includes(item))
    .slice(0, 2)
    .join('')
  if (fromTop.length === 2) return fromTop

  const normalized = normalizeText(code).toUpperCase().replace(/[^RIASEC]/g, '')
  return normalized.slice(0, 2)
}

export function normalizeReportPersonaCardGender(value) {
  const normalized = normalizeText(value).toLowerCase()
  if (normalized === 'male' || normalized === 'gender-male' || normalized === '男') return 'male'
  if (normalized === 'female' || normalized === 'gender-female' || normalized === '女') return 'female'
  return 'female'
}

export function buildReportPersonaCardImagePath(riasecCode, gender) {
  const code = normalizeText(riasecCode).toLowerCase()
  return `${REPORT_PERSONA_CARD_BASE}/uniprism-persona-card-framed-20260623-${code}-${gender}.png`
}

export function resolveReportPersonaCard(options = {}) {
  const riasecCode = normalizeRiasecPairCode(options.riasecCode, options.topDimensions)
  if (riasecCode.length !== 2) return null

  const gender = options.genderOptionId != null
    ? normalizeReportPersonaCardGender(options.genderOptionId)
    : normalizeReportPersonaCardGender(options.gender)

  const typeTitle = REPORT_PERSONA_TYPE_TITLES[riasecCode] || ''
  if (!typeTitle) return null

  return {
    riasecCode,
    gender,
    codeTag: `${riasecCode}型`,
    typeTitle,
    imagePath: buildReportPersonaCardImagePath(riasecCode, gender),
  }
}
