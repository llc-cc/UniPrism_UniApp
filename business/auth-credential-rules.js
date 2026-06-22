export const INVITE_LOGIN_ID_MIN_LENGTH = 3
export const INVITE_LOGIN_ID_MAX_LENGTH = 32
export const INVITE_PIN_MIN_LENGTH = 6
export const INVITE_PIN_MAX_LENGTH = 32

export const INVITE_LOGIN_ID_RULE_TEXT =
  '用户 ID：3-32 位，以字母开头；可用字母、数字、下划线 _、短横线 -；系统保存为小写。'

export const INVITE_PIN_RULE_TEXT =
  '密码：6-32 位，至少包含 1 个字母和 1 个数字；可用大小写字母、数字、下划线 _、短横线 -、! @ #。'

const LOGIN_ID_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/
const PIN_ALLOWED_PATTERN = /^[A-Za-z0-9_!@#-]+$/
const PHONE_RE = /^1[3-9]\d{9}$/

export function normalizePhone(input) {
  const digits = String(input || '').replace(/\D/g, '')
  if (digits.length === 11 && PHONE_RE.test(digits)) return digits
  if (digits.length === 13 && digits.startsWith('86')) {
    const local = digits.slice(2)
    return PHONE_RE.test(local) ? local : null
  }
  return null
}

export function getPhoneIssue(phone) {
  const raw = String(phone || '').trim()
  if (!raw) return '请填写手机号'
  if (!normalizePhone(raw)) return '请输入有效的中国大陆手机号'
  return null
}

export function getSmsCodeIssue(code) {
  const value = String(code || '').trim()
  if (!value) return '请填写验证码'
  if (!/^\d{6}$/.test(value)) return '请输入 6 位数字验证码'
  return null
}

export function getInviteLoginIdIssue(loginId) {
  const value = String(loginId || '').trim()
  if (value.length < INVITE_LOGIN_ID_MIN_LENGTH) {
    return `用户 ID 至少需要 ${INVITE_LOGIN_ID_MIN_LENGTH} 个字符。`
  }
  if (value.length > INVITE_LOGIN_ID_MAX_LENGTH) {
    return `用户 ID 不能超过 ${INVITE_LOGIN_ID_MAX_LENGTH} 个字符。`
  }
  if (!/^[A-Za-z]/.test(value)) {
    return '用户 ID 必须以字母开头。'
  }
  if (!LOGIN_ID_PATTERN.test(value)) {
    return '用户 ID 只能包含字母、数字、下划线 _ 或短横线 -。'
  }
  return null
}

export function getInvitePinIssue(pin) {
  const value = String(pin || '').trim()
  if (value.length < INVITE_PIN_MIN_LENGTH) {
    return `密码至少需要 ${INVITE_PIN_MIN_LENGTH} 位。`
  }
  if (value.length > INVITE_PIN_MAX_LENGTH) {
    return `密码不能超过 ${INVITE_PIN_MAX_LENGTH} 位。`
  }
  if (!PIN_ALLOWED_PATTERN.test(value)) {
    return '密码只能包含大小写字母、数字、下划线 _、短横线 -、! @ #。'
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return '密码至少需要包含 1 个字母和 1 个数字。'
  }
  return null
}
