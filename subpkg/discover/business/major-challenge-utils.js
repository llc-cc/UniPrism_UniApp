
import { getMajorSpeedTemplate } from './major-speed-template'

export function normalizeMajorChallengeTask(value) {
  if (value === 'diagnose' || value === 'report' || value === 'model') return value
  return 'model'
}

/** 从模板中解析挑战模块（与 Web MajorChallengeExperience.modulesFromTemplate 一致） */
export function getMajorChallengeModules(majorId) {
  const template = getMajorSpeedTemplate(majorId)
  if (!template) return []

  const foundation = (template.foundationArticles || []).map((course) => ({
    id: course.id,
    title: course.title,
    subtitle: course.subtitle,
    source: '基础课程',
    interaction: course.interaction,
    task: 'model',
  }))

  const deep = (template.deepDiveChallenges || []).map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    subtitle: challenge.description,
    source: challenge.course,
    interaction: challenge.interaction,
    task: 'diagnose',
  }))

  const topics = (template.branchDirections || []).flatMap((branch) =>
    (branch.topics || []).map((topic, index) => ({
      id: topic.id || `${branch.id}-${index + 1}`,
      title: topic.title,
      subtitle: topic.subtitle,
      source: `${branch.title}专题 ${index + 1}`,
      interaction: topic.interaction,
      task: 'report',
    })),
  )

  return [...foundation, ...deep, ...topics]
}

export function getMajorChallengeModule(majorId, moduleId, task) {
  const modules = getMajorChallengeModules(majorId)
  const normalizedTask = normalizeMajorChallengeTask(task)
  const scoped = modules.filter((item) => item.task === normalizedTask)
  if (!moduleId) return scoped[0] || modules[0] || null
  return (
    scoped.find((item) => item.id === moduleId || item.title === moduleId) ||
    modules.find((item) => item.id === moduleId || item.title === moduleId) ||
    scoped[0] ||
    null
  )
}

export function getMajorChallengeKey(moduleId, task) {
  return `${moduleId}:${normalizeMajorChallengeTask(task)}`
}
