/** 占位职业模拟（algorithm / software-engineer，为后续完整接入预留结构） */

import { asset } from '../../../utils/asset-map'
import { getCareerById } from '../../../business/explore-data'

function buildPreviewPages(careerId) {
  const career = getCareerById(careerId)
  if (!career) return []

  const heroImage = career.heroImage || asset('/images/explore/discover/stage-hero-career-clean.png')

  return [
    {
      id: `${careerId}-welcome`,
      type: 'preview-welcome',
      title: `${career.title}职业模拟：欢迎`,
      pageTitle: `${career.title}职业模拟`,
      pageSubtitle: '沉浸式预览版 · 完整模拟筹备中',
      lead: [
        career.summary,
        'Web 端该职业的完整情境模拟尚未接入。小程序已按相同页面结构预留流程，你可以先浏览职业任务预览，待正式版上线后直接替换正文与交互。',
      ],
      heroImage,
      isFinal: false,
    },
    ...(career.steps || []).map((step, index) => ({
      id: `${careerId}-step-${index}`,
      type: 'preview-step',
      title: `${career.title}职业模拟：${step.title}`,
      pageTitle: step.title,
      pageSubtitle: `预览步骤 ${index + 1} / ${career.steps.length}`,
      body: step.body,
      image: step.image,
      isFinal: false,
    })),
    {
      id: `${careerId}-placeholder`,
      type: 'preview-final',
      title: `${career.title}职业模拟：筹备中`,
      pageTitle: '完整模拟筹备中',
      pageSubtitle: '占位流程已完成，正式版将接入情境选择与反馈记录',
      lead: [
        '当前版本不会把占位预览记录为“已完成职业体验”。数学家职业已接入完整模拟，建议优先完成数学家流程后再回来比较其他职业。',
        '占位页保留与 Web 相同的入口结构，便于后续直接替换为正式任务组件。',
      ],
      isFinal: true,
    },
  ]
}

export const CAREER_PREVIEW_EXPERIENCES = {
  'algorithm-researcher': {
    accent: '#00a889',
    accentGradient: 'linear-gradient(90deg, #00a889 0%, #1cb0f6 100%)',
    storageKey: 'uniprism.career.algorithm-researcher.preview',
    pages: buildPreviewPages('algorithm-researcher'),
  },
  'software-engineer': {
    accent: '#5b6cff',
    accentGradient: 'linear-gradient(90deg, #5b6cff 0%, #1cb0f6 100%)',
    storageKey: 'uniprism.career.software-engineer.preview',
    pages: buildPreviewPages('software-engineer'),
  },
}

export function getCareerPreviewExperience(careerId) {
  return CAREER_PREVIEW_EXPERIENCES[careerId] || null
}
