import { api } from '../utils/api'
import { loadDiscoverSession } from './discover-session-storage'

const AVATAR_DEFAULT =
  'https://assets.uniprism.cn/images/explore/discover/figma/home-sidebar-user-assets/avatar-default-878-1291.png'
const AVATAR_MALE =
  'https://assets.uniprism.cn/images/explore/discover/figma/home-sidebar-user-assets/avatar-male-878-1288.png'
const AVATAR_FEMALE =
  'https://assets.uniprism.cn/images/explore/discover/figma/home-sidebar-user-assets/avatar-female-878-1285.png'

/** 从探索会话的基本信息页读取性别选项 id（gender-male / gender-female / gender-private）。 */
export function getBasicProfileGenderFromSession(session) {
  const answers = (session && session.answers) || []
  const basicAnswer = answers.find((item) => item.questionId === 'basic-profile')
  const fields = basicAnswer && basicAnswer.value && basicAnswer.value.fields
  const gender = fields && fields.gender
  return typeof gender === 'string' ? gender : ''
}

/** 无后端头像时，按基本信息中的性别返回占位头像 URL；未填性别则用默认图。 */
export function resolvePlaceholderAvatarUrl(genderOptionId) {
  if (genderOptionId === 'gender-male') return AVATAR_MALE
  if (genderOptionId === 'gender-female') return AVATAR_FEMALE
  return AVATAR_DEFAULT
}

/**
 * 解析个人主页展示用头像。
 * 优先使用后端 avatarUrl（如微信一键登录授权头像）；否则按基本信息中的性别展示占位图。
 */
export function resolveDisplayAvatarUrl(user, session) {
  const avatarPath = user && user.avatarUrl
  if (avatarPath) {
    return api.resolveUserAvatarUrl(avatarPath)
  }
  const discoverSession = session || loadDiscoverSession()
  const gender = getBasicProfileGenderFromSession(discoverSession)
  return resolvePlaceholderAvatarUrl(gender)
}

/** 未登录个人中心：未填基本信息用默认图，填写后按性别展示占位图。 */
export function resolveGuestAvatarUrl(session) {
  return resolveDisplayAvatarUrl(null, session)
}
