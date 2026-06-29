import { computeMbtiProfile } from './discover-questions'

/** 16 型标准昵称；仅在没有报告正文可读时使用，且需配合用户真实 MBTI 类型。 */
export const MBTI_DISPLAY_NAMES = {
  INTJ: '建筑师',
  INTP: '逻辑学家',
  ENTJ: '指挥官',
  ENTP: '辩论家',
  INFJ: '提倡者',
  INFP: '调停者',
  ENFJ: '主人公',
  ENFP: '竞选者',
  ISTJ: '物流师',
  ISFJ: '守卫者',
  ESTJ: '总经理',
  ESFJ: '执政官',
  ISTP: '鉴赏家',
  ISFP: '探险家',
  ESTP: '企业家',
  ESFP: '表演者',
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

export function formatMbtiType(value) {
  const normalized = normalizeText(value).toUpperCase()
  return /^(E|I)(S|N)(T|F)(J|P)$/.test(normalized) ? normalized : ''
}

export function resolveMbtiDisplayName(type) {
  const normalized = formatMbtiType(type)
  if (!normalized) return ''
  return MBTI_DISPLAY_NAMES[normalized] || normalized
}

/** 如 ENTJ → 指挥官型人格 */
export function resolveMbtiTypePersonalityName(type) {
  const display = resolveMbtiDisplayName(type)
  if (!display) return ''
  if (display.endsWith('型人格')) return display
  if (display.endsWith('型')) return `${display}人格`
  return `${display}型人格`
}

export function normalizeLegacyPersonalityText(value) {
  const text = normalizeText(value)
  if (!text) return ''
  const normalizedWithPrefix = text.match(/^([EI][SN][TF][JP])被称为[“"「『]([^”"」』]{2,16}型人格)[”"」』][。,.，]?\s*(.*)$/)
  if (normalizedWithPrefix) {
    const suffix = normalizeText(normalizedWithPrefix[3]).replace(
      /^(?:你自报为|根据你在性格测试阶段的作答，综合给出的类型为)\s*[EI][SN][TF][JP](?:（[^（）]{2,16}型人格）)?[。,.，]?\s*/u,
      '',
    )
    return `${normalizedWithPrefix[1]}被称为“${normalizedWithPrefix[2]}”${suffix ? `，${suffix}` : ''}`
  }

  const selfReported = text.match(/^你自报为\s*([EI][SN][TF][JP])（([^（）]{2,16}型人格)）[。,.，]?\s*(.*)$/)
  if (selfReported) {
    const suffix = normalizeText(selfReported[3])
    return `${selfReported[1]}被称为“${selfReported[2]}”${suffix ? `，${suffix}` : ''}`
  }

  const inferred = text.match(/^根据你在性格测试阶段的作答，综合给出的类型为\s*([EI][SN][TF][JP])（([^（）]{2,16}型人格)）[。,.，]?\s*(.*)$/)
  if (inferred) {
    const suffix = normalizeText(inferred[3])
    return `${inferred[1]}被称为“${inferred[2]}”${suffix ? `，${suffix}` : ''}`
  }

  return text
}

export function readMbtiTypeFromProfile(profile) {
  if (!profile || typeof profile !== 'object') return ''
  const direct = formatMbtiType(profile.mbtiProfile?.type || profile.mbtiProfile?.code)
  if (direct) return direct
  return formatMbtiType(profile.mbtiType || profile.mbti)
}

export function resolveMbtiTypeFromSessionAnswers(answers) {
  if (!Array.isArray(answers) || !answers.length) return ''
  try {
    const profile = computeMbtiProfile(answers)
    return formatMbtiType(profile?.type)
  } catch {
    return ''
  }
}

export function readMbtiTypeFromReport(report) {
  if (!report || typeof report !== 'object') return ''
  return formatMbtiType(report.mbtiProfile?.type || report.mbtiProfile?.code)
}

export function resolveReportMbtiType({ profile, report, sessionAnswers } = {}) {
  return readMbtiTypeFromProfile(profile)
    || resolveMbtiTypeFromSessionAnswers(sessionAnswers)
    || readMbtiTypeFromReport(report)
}

export function extractMbtiTypeFromText(text) {
  const normalized = normalizeText(text)
  if (!normalized) return ''
  const lead = normalized.match(/^([EI][SN][TF][JP])[（(被称为]/i)
  if (lead?.[1]) return formatMbtiType(lead[1])
  return formatMbtiType(normalized.match(/\b(E|I)(S|N)(T|F)(J|P)\b/i)?.[0])
}

/** 从报告正文解析「XX型人格」，否则结合用户 MBTI 类型推导。 */
export function extractPersonalityTypeNameFromText(text, context = {}) {
  const normalized = normalizeText(text)
  if (!normalized) {
    const type = resolveReportMbtiType(context)
    return type ? resolveMbtiTypePersonalityName(type) : ''
  }

  const leadMatch = normalized.match(/[EI][SN][TF][JP].{0,16}?[“"「『]([^”"」』]{2,16}型人格)[”"」』]/i)
  if (leadMatch?.[2]) return normalizeText(leadMatch[2])

  const quotedMatch = normalized.match(/[“"「『]([^”"」』]{2,16}型人格)[”"」』]/)
  if (quotedMatch?.[1]) return normalizeText(quotedMatch[1])

  const typePersonMatch = normalized.match(/([\u4e00-\u9fa5A-Z]{2,10}型人格)/)
  if (typePersonMatch?.[1]) return typePersonMatch[1]

  const type = resolveReportMbtiType(context) || extractMbtiTypeFromText(normalized)
  return type ? resolveMbtiTypePersonalityName(type) : ''
}

/** 从报告正文动态提取综合人格角色（如 系统建筑师），不使用固定角色表。 */
export function extractPersonaRole(text) {
  const normalized = normalizeText(text)
  if (!normalized) return ''

  const quotedMatches = [...normalized.matchAll(/[“"「『]([^”"」』]{2,16})[”"」』]/g)]
  for (const match of quotedMatches) {
    const value = normalizeText(match[1])
    if (value && !/型人格$/.test(value) && !formatMbtiType(value)) {
      return value
    }
  }

  const isRole = normalized.match(/是一位([^，,。；;\n！？!?]{2,12})/)
  if (isRole?.[1]) return normalizeText(isRole[1])

  const roleLike = normalized.match(/更像一位([^，,。；;\n！？!?]{2,12})/)
  if (roleLike?.[1]) return normalizeText(roleLike[1])

  const personaMatch = normalized.match(/一位[^，,：:。！？!?]{0,28}的([^，,：:。！？!?]{2,16})/)
  if (personaMatch?.[1]) return normalizeText(personaMatch[1])

  return ''
}

function stripPersonalityBodyIntro(text, type) {
  let result = normalizeText(text)
  if (!result) return ''
  result = result.replace(/^[EI][SN][TF][JP]被称为[“"「『][^”"」』]+[”"」』][。,.，]?\s*/i, '')
  result = result.replace(/^你自报为\s*[EI][SN][TF][JP]（[^）]+）[。,.，]?\s*/i, '')
  result = result.replace(/^根据你在性格测试阶段的作答，综合给出的类型为\s*[EI][SN][TF][JP][^。，,]*[。,.，]?\s*/i, '')
  if (type) {
    result = result.replace(new RegExp(`^${type}[\\s，,]*`), '')
    result = result.replace(/^让(?=你)/, '')
  }
  result = result.replace(/^你更像一位[^，,。；;\n]{2,16}[，,]\s*/, '')
  result = result.replace(/本质上是一位[“"「『][^”"」』]+[”"」』][——-]\s*/g, '')
  return normalizeText(result)
}

function stripPersonaBodyIntro(text, role) {
  let result = normalizeText(text)
  if (!result) return ''
  result = result.replace(/^[EI][SN][TF][JP][（(][^）)]+[）)]的你[，,]\s*/, '')
  result = result.replace(/^[EI][SN][TF][JP]被称为[“"「『][^”"」』]+[”"」』][。,.，]?\s*/i, '')
  if (role) {
    result = result.replace(new RegExp(`^一位[^，,。]{0,30}的${role}[。，,]\\s*`), '')
    result = result.replace(new RegExp(`^你是一位${role}[。，,]\\s*`), '')
  }
  return normalizeText(result)
}

/** 性格测试结果：开头展示用户 MBTI + 报告/测评中的型人格名称，正文保留报告原文。 */
export function formatPersonalityResultDisplay(rawBody, context = {}) {
  const body = normalizeLegacyPersonalityText(normalizeText(rawBody))
  if (!body) return ''

  if (/^[EI][SN][TF][JP]被称为[“"「『][^”"」』]{2,20}型人格[”"」』]/.test(body)) {
    return body
  }

  const type = resolveReportMbtiType(context) || extractMbtiTypeFromText(body)
  if (!type) return body

  const personalityName = extractPersonalityTypeNameFromText(body, context)
  if (!personalityName) return body

  const lead = `${type}被称为“${personalityName}”`
  const remainder = stripPersonalityBodyIntro(body, type)
  if (!remainder) return `${lead}。`
  return `${lead}，${remainder}`
}

/** 综合人格画像：开头展示 MBTI 型人格，角色名仅从报告正文提取。 */
export function formatIntegratedPersonaDisplay(rawBody, context = {}) {
  const body = normalizeText(rawBody)
  if (!body) return ''

  if (/^[EI][SN][TF][JP][（(][^）)]+型人格[）)]的你/.test(body)) {
    return body
  }

  const type = resolveReportMbtiType(context) || extractMbtiTypeFromText(body)
  const personalityName = extractPersonalityTypeNameFromText(body, context)
  const role = extractPersonaRole(body)

  if (type && personalityName) {
    const personaLead = `${type}（${personalityName}）的你`
    const remainder = stripPersonaBodyIntro(body, role)
    if (role) {
      return remainder
        ? `${personaLead}，是一位${role}。${remainder}`
        : `${personaLead}，是一位${role}。`
    }
    const core = remainder || body
    return `${personaLead}，${core}`
  }

  if (role) {
    const remainder = stripPersonaBodyIntro(body, role)
    return remainder ? `你是一位${role}。${remainder}` : body
  }

  return body
}
