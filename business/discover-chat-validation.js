import { isCareerScenarioValue } from './discover-questions'

function validationError(message, fieldErrors) {
  return { valid: false, message, fieldErrors }
}

function isProfileAnswer(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'fields' in value
}

function isTextAnswer(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'text' in value
}

/** @param {import('./discover-questions').Question} question @param {import('./discover-questions').AnswerValue} value */
export function validateAnswer(question, value) {
  if (question.type === 'profile-form') {
    if (!isProfileAnswer(value) || !question.profileFields?.length) {
      return validationError('请先完成基本信息。')
    }

    const fieldErrors = {}

    for (const field of question.profileFields) {
      const fieldValue = value.fields[field.id]
      if (field.type === 'text') {
        if (typeof fieldValue !== 'string' || fieldValue.trim().length < (field.minLength ?? 1)) {
          fieldErrors[field.id] = `请填写${field.label}`
        }
        continue
      }
      if (field.type === 'multi') {
        const required = field.maxSelections ?? 3
        if (!Array.isArray(fieldValue) || fieldValue.length !== required) {
          fieldErrors[field.id] = `请选择 ${required} 项`
        }
        continue
      }
      if (typeof fieldValue !== 'string' || fieldValue.length === 0) {
        fieldErrors[field.id] = '请选择一个选项'
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return validationError('还有基本信息未完成，请补充标红的问题。', fieldErrors)
    }

    return { valid: true }
  }

  if (question.type === 'interest-tag-grid') {
    return Array.isArray(value)
      ? { valid: true }
      : validationError('请选择符合你的兴趣标签，或者直接确认本页都不符合。')
  }

  if (question.type === 'multi-select') {
    const maxSelections = question.maxSelections ?? 3
    return Array.isArray(value) && value.length > 0 && value.length <= maxSelections
      ? { valid: true }
      : validationError(`请至少选择 1 项，最多 ${maxSelections} 项。`)
  }

  if (question.type === 'career-scenario') {
    if (!isCareerScenarioValue(value) || !question.careerScenario) {
      return validationError('请完成职业倾向情景题。')
    }

    const scenario = question.careerScenario
    const fieldErrors = {}

    if (!value.firstChoiceId) fieldErrors.firstChoiceId = '请选择第一反应。'
    if (value.itemChoiceIds.length !== scenario.itemMaxSelections) {
      fieldErrors.itemChoiceIds = `请选择 ${scenario.itemMaxSelections} 组物品，并按优先级从先到后排列。`
    }
    if (scenario.teamOptions?.length && !value.teamChoiceId) {
      fieldErrors.teamChoiceId = '请选择小队下一步行动。'
    }
    for (const field of scenario.openFields || []) {
      if (!field.minLength) continue
      if ((value.openResponses[field.id] ?? '').trim().length < field.minLength) {
        fieldErrors[field.id] = `请至少写 ${field.minLength} 个字，让系统能判断你的倾向。`
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      const message = fieldErrors.firstChoiceId
        || fieldErrors.itemChoiceIds
        || fieldErrors.teamChoiceId
        || '开放题回答太短，请补充标红的问题。'
      return validationError(message, fieldErrors)
    }

    return { valid: true }
  }

  if (question.type === 'free-text') {
    const minLength = question.minLength ?? 1
    return isTextAnswer(value) && value.text.trim().length >= minLength
      ? { valid: true }
      : validationError(`请至少写 ${minLength} 个字。`)
  }

  return typeof value === 'string' && value.length > 0
    ? { valid: true }
    : validationError('请选择一个选项。')
}

/** @param {import('./discover-questions').Question} question */
export function getValidationAnchorId(question, fieldErrors) {
  if (question.type === 'profile-form' && fieldErrors) {
    const firstFieldId = Object.keys(fieldErrors)[0]
    if (firstFieldId) return `anchor-field-${firstFieldId}`
  }
  if (question.type === 'career-scenario' && fieldErrors) {
    if (fieldErrors.firstChoiceId) return 'anchor-career-first'
    if (fieldErrors.itemChoiceIds) return 'anchor-career-items'
    if (fieldErrors.teamChoiceId) return 'anchor-career-team'
    const openFieldId = Object.keys(fieldErrors).find((id) => id.startsWith('open-') || id.includes('open'))
    if (openFieldId) return `anchor-career-open-${openFieldId}`
  }
  return `anchor-q-${question.id}`
}
