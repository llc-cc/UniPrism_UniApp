/** 职业模拟配置（与 Web discover / career 路由对齐） */

export const CAREER_SIMULATION_GUIDES = [
  {
    id: 'role',
    title: '从角色到职业',
    description: '先选择一个职业角色，理解它的目标、职责与日常判断方式。',
    action: '选择角色',
    image: '/images/explore/discover/career-simulation/role-to-career.png',
  },
  {
    id: 'scenario',
    title: '从情境到任务',
    description: '进入真实工作情境，处理关键任务，体验职业节奏与协作方式。',
    action: '进入情境',
    image: '/images/explore/discover/career-simulation/scenario-to-task.png',
  },
  {
    id: 'fit',
    title: '从选择到判断',
    description: '根据每次选择与反馈，判断你是否适合长期投入这类工作。',
    action: '记录反馈',
    image: '/images/explore/discover/career-simulation/choice-to-fit.png',
  },
]

const LIVE_CAREER_IDS = new Set(['mathematician'])
const PREVIEW_CAREER_IDS = new Set(['algorithm-researcher', 'software-engineer'])

export function getCareerExperienceKind(careerId) {
  if (LIVE_CAREER_IDS.has(careerId)) return 'live'
  if (PREVIEW_CAREER_IDS.has(careerId)) return 'preview'
  return 'none'
}

/** @deprecated 使用 getCareerExperienceKind */
export function hasCareerExperience(careerId) {
  return getCareerExperienceKind(careerId) !== 'none'
}

export function getCareerExperienceRoute(careerId, majorId) {
  if (getCareerExperienceKind(careerId) === 'none') return ''
  let url = `/subpkg/discover/career-experience?id=${encodeURIComponent(careerId)}`
  if (majorId) url += `&majorId=${encodeURIComponent(majorId)}`
  return url
}

export function getCareerDetailRoute(careerId, majorId) {
  let url = `/subpkg/discover/career-detail?id=${encodeURIComponent(careerId)}`
  if (majorId) url += `&majorId=${encodeURIComponent(majorId)}`
  return url
}

export function openCareerSimulation(careerId, majorId) {
  const kind = getCareerExperienceKind(careerId)
  if (kind === 'live' || kind === 'preview') {
    uni.navigateTo({ url: getCareerExperienceRoute(careerId, majorId) })
    return
  }
  uni.navigateTo({ url: getCareerDetailRoute(careerId, majorId) })
}
