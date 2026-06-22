/**
 * 报告生成链路（对齐 Web app/assessment/report/progress/page.tsx + ReportPanel.tsx）
 */

/** @typedef {'read_answers' | 'build_profile' | 'build_context' | 'generate_report'} ReportGenerationStepId */
/** @typedef {ReportGenerationStepId | 'prepare_report' | 'write_report'} ReportGenerationVisualStepId */

/** @type {Array<{ id: ReportGenerationStepId, title: string }>} */
export const REPORT_GENERATION_STEPS = [
  { id: 'read_answers', title: '读取测评结果' },
  { id: 'build_profile', title: '计算画像与底层维度' },
  { id: 'build_context', title: '检索候选知识' },
  { id: 'generate_report', title: '生成并校验报告' },
]

/** @type {Array<{ id: ReportGenerationVisualStepId, sourceStep: ReportGenerationStepId, title: string, description: string, percent: number }>} */
export const REPORT_GENERATION_VISUAL_STEPS = [
  {
    id: 'read_answers',
    sourceStep: 'read_answers',
    title: '读取测评结果',
    description: '确认 MBTI、Holland/RIASEC、深度测评和职业校准记录是否完整。',
    percent: 12,
  },
  {
    id: 'build_profile',
    sourceStep: 'build_profile',
    title: '计算画像与倾向',
    description: '整理 RIASEC Top2、MBTI 类型、深度测评倾向和职业偏好边界。',
    percent: 24,
  },
  {
    id: 'build_context',
    sourceStep: 'build_context',
    title: '检索候选知识',
    description: '检索专业/职业 RAG 候选池，并补充必要的发展与任务事实。',
    percent: 36,
  },
  {
    id: 'prepare_report',
    sourceStep: 'generate_report',
    title: '准备写作上下文',
    description: '调取报告硬规范、few-shot 样例、模板上下文和候选摘要。',
    percent: 64,
  },
  {
    id: 'write_report',
    sourceStep: 'generate_report',
    title: '生成完整报告正文',
    description: '生成用户画像、专业推荐、职业推荐和综合建议。',
    percent: 88,
  },
]

/** @type {Record<ReportGenerationStepId, ReportGenerationStepId[]>} */
const COMPLETED_STEPS_BEFORE = {
  read_answers: [],
  build_profile: ['read_answers'],
  build_context: ['read_answers', 'build_profile'],
  generate_report: ['read_answers', 'build_profile', 'build_context'],
}

/** @type {Record<ReportGenerationStepId, number>} */
const GENERATION_VISUAL_INDEX_BY_STEP = {
  read_answers: 0,
  build_profile: 1,
  build_context: 2,
  generate_report: 3,
}

const REPORT_GENERATION_LONG_STEP_SOFT_STAGES = [
  {
    atSeconds: 0,
    visualStepId: 'prepare_report',
    percent: 58,
    title: '正在准备写作上下文',
    description: '正在整理安全画像、Top7 候选摘要、报告规范和参考样例。',
  },
  {
    atSeconds: 25,
    visualStepId: 'write_report',
    percent: 68,
    title: '正在生成报告正文',
    description: '正在等待模型输出用户画像、专业推荐、职业推荐和综合建议。',
  },
  {
    atSeconds: 65,
    visualStepId: 'write_report',
    percent: 76,
    title: '正在撰写完整报告',
    description: '正在把用户画像、专业理由、职业理由和成长建议写成长文案。',
  },
  {
    atSeconds: 115,
    visualStepId: 'write_report',
    percent: 82,
    title: '正在接收长文案输出',
    description: '模型仍在返回完整报告内容，完成后会直接组装到报告页面。',
  },
  {
    atSeconds: 165,
    visualStepId: 'write_report',
    percent: 88,
    title: '正在组装报告页面',
    description: '完整报告即将完成，页面会自动进入报告解读。',
  },
]

export const INITIAL_REPORT_PROGRESS = {
  activeStep: 'read_answers',
  completedSteps: [],
  backendStage: undefined,
  timerStartedAt: null,
}

const CONTEXT_STEP_DELAY_MS = 360
const MIN_PROGRESS_VISIBLE_MS = 800
const REPORT_STATUS_POLL_INTERVAL_MS = 2000
const REPORT_STATUS_TIMEOUT_MS = 8 * 60 * 1000

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getStatusValue(data) {
  return String((data && data.status) || '').toLowerCase()
}

function isReportInProgress(data) {
  const status = getStatusValue(data)
  return Boolean(data && (data.queued === true || status === 'pending' || status === 'generating'))
}

function parseReportTimestamp(value) {
  if (!value) return null
  const timestamp = Date.parse(value)
  return Number.isFinite(timestamp) ? timestamp : null
}

function toBackendGenerationStage(workflowProgress) {
  if (!workflowProgress || !workflowProgress.visualStepId || !workflowProgress.title || !workflowProgress.description) {
    return undefined
  }
  const percent = typeof workflowProgress.percent === 'number' && Number.isFinite(workflowProgress.percent)
    ? Math.max(0, Math.min(100, Math.round(workflowProgress.percent)))
    : undefined
  if (percent === undefined) return undefined
  return {
    visualStepId: workflowProgress.visualStepId,
    title: workflowProgress.title,
    description: workflowProgress.description,
    percent,
  }
}

function getLongReportSoftStage(seconds) {
  return REPORT_GENERATION_LONG_STEP_SOFT_STAGES.reduce(
    (current, stage) => (seconds >= stage.atSeconds ? stage : current),
    REPORT_GENERATION_LONG_STEP_SOFT_STAGES[0],
  )
}

function readElapsedSeconds(timerStartedAt) {
  if (typeof timerStartedAt !== 'number' || !Number.isFinite(timerStartedAt)) return 0
  return Math.max(0, Math.floor((Date.now() - timerStartedAt) / 1000))
}

function buildProgressPayload(activeStep, completedSteps, failedStep, extra) {
  return Object.assign(
    {
      activeStep,
      completedSteps,
      failedStep,
      backendStage: undefined,
      timerStartedAt: null,
    },
    extra || {},
  )
}

function resolveActiveVisualIndex(progress) {
  const backendStage = progress && progress.backendStage
  const backendStageVisualIndex = backendStage
    ? REPORT_GENERATION_VISUAL_STEPS.findIndex((step) => step.id === backendStage.visualStepId)
    : -1

  const isLongReportGenerationStep = progress && progress.activeStep === 'generate_report'
  const softStage = isLongReportGenerationStep && !backendStage
    ? getLongReportSoftStage(readElapsedSeconds(progress.timerStartedAt))
    : null
  const softStageVisualIndex = softStage
    ? REPORT_GENERATION_VISUAL_STEPS.findIndex((step) => step.id === softStage.visualStepId)
    : -1

  if (backendStageVisualIndex >= 0) return backendStageVisualIndex
  if (softStageVisualIndex >= 0) return softStageVisualIndex
  return GENERATION_VISUAL_INDEX_BY_STEP[progress.activeStep] ?? 0
}

/**
 * @param {number} visualIndex
 * @param {{ activeStep: ReportGenerationStepId, completedSteps: ReportGenerationStepId[], failedStep?: ReportGenerationStepId, backendStage?: { visualStepId: ReportGenerationVisualStepId, title: string, description: string, percent: number }, timerStartedAt?: number | null }} progress
 */
export function getVisualStepStatus(visualIndex, progress) {
  const activeVisualIndex = resolveActiveVisualIndex(progress)
  const failedStep = progress && progress.failedStep
  const failedVisualIndex = failedStep
    ? GENERATION_VISUAL_INDEX_BY_STEP[failedStep] ?? activeVisualIndex
    : activeVisualIndex

  const completedVisualIndices = new Set(
    REPORT_GENERATION_VISUAL_STEPS
      .map((step, index) => (progress.completedSteps.includes(step.sourceStep) ? index : null))
      .filter((index) => typeof index === 'number'),
  )

  if (progress.failedStep && visualIndex === failedVisualIndex) return 'error'
  if (completedVisualIndices.has(visualIndex)) return 'complete'
  if (visualIndex < activeVisualIndex) return 'complete'
  if (visualIndex === activeVisualIndex) return 'active'
  return 'waiting'
}

/** @param {{ activeStep: ReportGenerationStepId, completedSteps: ReportGenerationStepId[], failedStep?: ReportGenerationStepId, backendStage?: { visualStepId: ReportGenerationVisualStepId, title: string, description: string, percent: number }, timerStartedAt?: number | null }} progress */
export function getVisualProgress(progress) {
  if (progress.failedStep) return 54

  const activeVisualIndex = resolveActiveVisualIndex(progress)
  const activeVisualStep = REPORT_GENERATION_VISUAL_STEPS[activeVisualIndex] || REPORT_GENERATION_VISUAL_STEPS[0]
  const backendStage = progress && progress.backendStage
  const isLongReportGenerationStep = progress && progress.activeStep === 'generate_report'
  const softStage = isLongReportGenerationStep && !backendStage
    ? getLongReportSoftStage(readElapsedSeconds(progress.timerStartedAt))
    : null

  const percent = backendStage && typeof backendStage.percent === 'number'
    ? backendStage.percent
    : softStage && typeof softStage.percent === 'number'
      ? softStage.percent
      : activeVisualStep.percent

  return Math.max(12, Math.min(100, percent))
}

/** @param {{ activeStep: ReportGenerationStepId, completedSteps: ReportGenerationStepId[], failedStep?: ReportGenerationStepId, backendStage?: { visualStepId: ReportGenerationVisualStepId, title: string, description: string, percent: number }, timerStartedAt?: number | null }} progress */
export function getProgressLabel(progress) {
  const backendStage = progress && progress.backendStage
  const isLongReportGenerationStep = progress && progress.activeStep === 'generate_report'
  const softStage = isLongReportGenerationStep && !backendStage
    ? getLongReportSoftStage(readElapsedSeconds(progress.timerStartedAt))
    : null

  return (backendStage && backendStage.title)
    || (softStage && softStage.title)
    || '正在生成综合报告'
}

/** @param {{ activeStep: ReportGenerationStepId, completedSteps: ReportGenerationStepId[], failedStep?: ReportGenerationStepId, backendStage?: { visualStepId: ReportGenerationVisualStepId, title: string, description: string, percent: number }, timerStartedAt?: number | null }} progress */
export function getProgressDescription(progress) {
  const backendStage = progress && progress.backendStage
  const isLongReportGenerationStep = progress && progress.activeStep === 'generate_report'
  const softStage = isLongReportGenerationStep && !backendStage
    ? getLongReportSoftStage(readElapsedSeconds(progress.timerStartedAt))
    : null

  return (backendStage && backendStage.description)
    || (softStage && softStage.description)
    || ''
}

/** @deprecated 保留兼容旧组件引用 */
export function getStepStatus(stepId, progress) {
  const visualIndex = REPORT_GENERATION_VISUAL_STEPS.findIndex((step) => step.id === stepId)
  if (visualIndex >= 0) return getVisualStepStatus(visualIndex, progress)
  return 'waiting'
}

function syncBackendWorkflowProgress(statusData, setProgress) {
  const backendStage = toBackendGenerationStage(statusData && statusData.workflowProgress)
  if (!backendStage) return
  setProgress(
    'generate_report',
    COMPLETED_STEPS_BEFORE.generate_report,
    getStatusValue(statusData) === 'failed' ? 'generate_report' : undefined,
    {
      backendStage,
      timerStartedAt: parseReportTimestamp(statusData && statusData.createdAt),
    },
  )
}

async function pollReportUntilReady(sessionId, reportId, api, setProgress) {
  const startedAt = Date.now()

  while (Date.now() - startedAt < REPORT_STATUS_TIMEOUT_MS) {
    await wait(REPORT_STATUS_POLL_INTERVAL_MS)

    const res = await api.getReportStatus(sessionId, reportId)
    const data = (res && res.data) || {}

    syncBackendWorkflowProgress(data, setProgress)

    if (data.report) {
      return data
    }

    if (getStatusValue(data) === 'failed') {
      throw new Error(data.errorMessage || '报告生成失败，请稍后重试')
    }
  }

  throw new Error('报告仍在生成，请稍后刷新查看')
}

async function fetchCompletedReportPayload(sessionId, reportId, api) {
  const reportRes = await api.getReportStatus(sessionId, reportId)
  const data = (reportRes && reportRes.data) || {}
  if (data.report) {
    return data.report
  }
  return null
}

/** 读取已完成的最新报告正文，不触发新的生成任务。 */
export async function loadLatestCompletedReport(sessionId, api) {
  const latestRes = await api.getLatestReport(sessionId, 'full_explore')
  const latest = (latestRes && latestRes.data) || {}
  const status = getStatusValue(latest)

  if (!latest.reportId || status !== 'completed') return null

  return fetchCompletedReportPayload(sessionId, latest.reportId, api)
}

async function resumeExistingReport(sessionId, api, setProgress, forceRegenerate) {
  if (forceRegenerate) return null

  setProgress('generate_report', COMPLETED_STEPS_BEFORE.generate_report, undefined, {
    timerStartedAt: Date.now(),
  })

  const latestRes = await api.getLatestReport(sessionId, 'full_explore')
  const latest = (latestRes && latestRes.data) || {}
  const status = getStatusValue(latest)
  const timerStartedAt = parseReportTimestamp(latest.createdAt) || Date.now()

  if (!latest.reportId) return null

  if (status === 'completed') {
    const reportRes = await api.getReportStatus(sessionId, latest.reportId)
    const data = (reportRes && reportRes.data) || {}
    if (data.report) {
      return data
    }
    return null
  }

  if (isReportInProgress(latest)) {
    setProgress('generate_report', COMPLETED_STEPS_BEFORE.generate_report, undefined, {
      timerStartedAt,
    })
    syncBackendWorkflowProgress(latest, setProgress)
    try {
      return await pollReportUntilReady(sessionId, latest.reportId, api, setProgress)
    } catch {
      return null
    }
  }

  return null
}

async function resolveGeneratedReport(sessionId, generateData, api, setProgress) {
  const data = generateData || {}
  const status = getStatusValue(data)

  syncBackendWorkflowProgress(data, setProgress)

  if (data.report) {
    return data
  }

  if (status === 'failed') {
    throw new Error(data.errorMessage || '报告生成失败，请稍后重试')
  }

  if (!data.reportId) {
    throw new Error('报告任务创建失败，请稍后重试')
  }

  if (isReportInProgress(data)) {
    return pollReportUntilReady(sessionId, data.reportId, api, setProgress)
  }

  throw new Error('报告生成失败，请稍后重试')
}

async function finalizeReport(report, startedAt, setProgress) {
  setProgress('generate_report', [...COMPLETED_STEPS_BEFORE.generate_report, 'generate_report'], undefined, {
    backendStage: {
      visualStepId: 'write_report',
      title: '报告生成完成',
      description: '完整报告已经准备好，正在进入报告页面。',
      percent: 100,
    },
  })

  const elapsed = Date.now() - startedAt
  if (elapsed < MIN_PROGRESS_VISIBLE_MS) {
    await wait(MIN_PROGRESS_VISIBLE_MS - elapsed)
  }

  return report
}

/**
 * 执行报告生成链路并回调进度。
 * @param {{
 *   session: import('./discover-session').DiscoverSession,
 *   syncDiscoverProfileToBackend: Function,
 *   api: { generateReport: Function, getLatestReport: Function, getReportStatus: Function },
 *   onProgress: (progress: { activeStep: ReportGenerationStepId, completedSteps: ReportGenerationStepId[], failedStep?: ReportGenerationStepId, backendStage?: { visualStepId: ReportGenerationVisualStepId, title: string, description: string, percent: number }, timerStartedAt?: number | null }) => void,
 *   forceRegenerate?: boolean,
 * }} options
 */
export async function runReportGenerationChain(options) {
  const { session, syncDiscoverProfileToBackend, api, onProgress, forceRegenerate } = options
  const startedAt = Date.now()
  let activeStep = 'read_answers'
  let timerStartedAt = null

  const setProgress = (nextActive, completedSteps, failedStep, extra) => {
    activeStep = nextActive
    if (extra && typeof extra.timerStartedAt === 'number') {
      timerStartedAt = extra.timerStartedAt
    } else if (nextActive === 'generate_report' && timerStartedAt == null) {
      timerStartedAt = Date.now()
    }
    onProgress(buildProgressPayload(nextActive, completedSteps, failedStep, {
      ...(extra || {}),
      timerStartedAt: (extra && extra.timerStartedAt) ?? timerStartedAt,
    }))
  }

  try {
    setProgress('read_answers', [])
    await wait(180)
    setProgress('build_profile', ['read_answers'])
    await wait(180)

    setProgress('build_profile', ['read_answers'])
    const sessionId = await syncDiscoverProfileToBackend(session, { force: false })
    if (!sessionId) throw new Error('无法保存测评画像')

    setProgress('build_context', ['read_answers', 'build_profile'])
    await wait(CONTEXT_STEP_DELAY_MS)

    const existingReport = await resumeExistingReport(sessionId, api, setProgress, Boolean(forceRegenerate))
    if (existingReport && existingReport.report) {
      return finalizeReport(existingReport.report, startedAt, setProgress)
    }

    setProgress('generate_report', COMPLETED_STEPS_BEFORE.generate_report, undefined, {
      timerStartedAt: Date.now(),
    })

    const res = await api.generateReport(sessionId, Boolean(forceRegenerate))
    const finalData = await resolveGeneratedReport(sessionId, res && res.data, api, setProgress)
    if (!finalData || !finalData.report) {
      throw new Error('报告生成失败，请稍后重试')
    }

    return finalizeReport(finalData.report, startedAt, setProgress)
  } catch (error) {
    const message = error && error.message ? error.message : '报告生成失败，请稍后重试'
    setProgress(activeStep, COMPLETED_STEPS_BEFORE[activeStep] || [], activeStep)
    const wrapped = new Error(message)
    wrapped.step = activeStep
    throw wrapped
  }
}
