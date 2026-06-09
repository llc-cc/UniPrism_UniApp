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
