/**
 * 报告生成步骤（对齐 Web components/explore/discover/ReportPanel.tsx）
 */
export const REPORT_GENERATION_STEPS = [
  {
    id: 'read_answers',
    title: '读取答题记录',
    description: '确认你的基础信息和本次测评选择',
  },
  {
    id: 'build_profile',
    title: '生成兴趣画像',
    description: '计算 RIASEC 维度和初步兴趣密码',
  },
  {
    id: 'save_profile',
    title: '保存测评画像',
    description: '把本次画像写入你的探索会话',
  },
  {
    id: 'build_context',
    title: '组织报告上下文',
    description: '汇总开放回答、AI 对话和推荐专业线索',
  },
  {
    id: 'generate_report',
    title: '生成综合报告',
    description: '生成能力维度、职业倾向和专业建议',
  },
  {
    id: 'layout_report',
    title: '整理报告版式',
    description: '把内容放入最终报告页面',
  },
]

export const INITIAL_REPORT_PROGRESS = {
  activeStep: 'read_answers',
  completedSteps: [],
  backendTitle: '',
  backendDescription: '',
  backendPercent: 0,
}

const CONTEXT_STEP_DELAY_MS = 360
const LAYOUT_STEP_DELAY_MS = 520
const MIN_PROGRESS_VISIBLE_MS = 800
const REPORT_POLL_INTERVAL_MS = 1500
const REPORT_POLL_TIMEOUT_MS = 5 * 60 * 1000

const BASE_COMPLETED_STEPS = ['read_answers', 'build_profile', 'save_profile']

const BACKEND_VISUAL_STEP_MAP = {
  read_answers: 'build_context',
  build_profile: 'build_context',
  build_context: 'build_context',
  compress_evidence: 'generate_report',
  select_candidates: 'generate_report',
  write_report: 'generate_report',
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** @param {string} stepId @param {{ activeStep: string, completedSteps: string[], failedStep?: string }} progress */
export function getStepStatus(stepId, progress) {
  if (progress.failedStep === stepId) return 'error'
  if (progress.completedSteps.includes(stepId)) return 'complete'
  if (progress.activeStep === stepId) return 'active'
  return 'waiting'
}

/** @param {{ activeStep: string, completedSteps: string[], failedStep?: string }} progress */
export function getVisualProgress(progress) {
  const backendPercent = Number(progress && progress.backendPercent)
  if (Number.isFinite(backendPercent) && backendPercent > 0) {
    return Math.max(12, Math.min(100, backendPercent))
  }
  const completedCount = progress.completedSteps.length
  if (progress.failedStep) {
    return Math.max(12, (completedCount / REPORT_GENERATION_STEPS.length) * 100)
  }
  if (completedCount >= REPORT_GENERATION_STEPS.length) return 100
  return Math.min(94, ((completedCount + 0.42) / REPORT_GENERATION_STEPS.length) * 100)
}

function getBackendActiveStep(visualStepId) {
  return BACKEND_VISUAL_STEP_MAP[visualStepId] || 'generate_report'
}

function buildProgressPayload(activeStep, completedSteps, failedStep, extra) {
  return Object.assign(
    {
      activeStep,
      completedSteps,
      failedStep,
      backendTitle: '',
      backendDescription: '',
      backendPercent: 0,
    },
    extra || {},
  )
}

function applyBackendProgress(statusData, setProgress) {
  const workflow = statusData && statusData.workflowProgress
  const activeStep = getBackendActiveStep(workflow && workflow.visualStepId)
  const completedSteps =
    activeStep === 'generate_report'
      ? ['read_answers', 'build_profile', 'save_profile', 'build_context']
      : BASE_COMPLETED_STEPS.slice()

  setProgress(activeStep, completedSteps, undefined, {
    backendTitle: (workflow && workflow.title) || '',
    backendDescription: (workflow && workflow.description) || '',
    backendPercent: workflow && typeof workflow.percent === 'number' ? workflow.percent : 0,
  })
}

function getStatusValue(data) {
  return String((data && data.status) || '').toLowerCase()
}

async function pollReportUntilReady(sessionId, reportId, api, setProgress) {
  const deadline = Date.now() + REPORT_POLL_TIMEOUT_MS

  while (Date.now() < deadline) {
    const res = await api.getReportStatus(sessionId, reportId)
    const data = (res && res.data) || {}
    const status = getStatusValue(data)

    if (status === 'completed' && data.report) {
      return data
    }

    if (status === 'failed') {
      throw new Error(data.errorMessage || '报告生成失败，请稍后重试')
    }

    applyBackendProgress(data, setProgress)
    await wait(REPORT_POLL_INTERVAL_MS)
  }

  throw new Error('报告生成耗时较长，请稍后重新进入报告页查看')
}

async function resolveExistingReport(sessionId, api, setProgress) {
  const latestRes = await api.getLatestReport(sessionId, 'full_explore')
  const latest = (latestRes && latestRes.data) || {}
  const status = getStatusValue(latest)

  if (!latest.reportId || !status) return null

  if (status === 'completed') {
    const reportRes = await api.getReportStatus(sessionId, latest.reportId)
    return (reportRes && reportRes.data) || null
  }

  if (status === 'pending' || status === 'generating') {
    applyBackendProgress(latest, setProgress)
    return pollReportUntilReady(sessionId, latest.reportId, api, setProgress)
  }

  return null
}

async function resolveGeneratedReport(sessionId, generateData, api, setProgress) {
  const data = generateData || {}
  const status = getStatusValue(data)

  if (status === 'completed' && data.report) {
    return data
  }

  if (status === 'failed') {
    throw new Error(data.errorMessage || '报告生成失败，请稍后重试')
  }

  if (!data.reportId) {
    throw new Error('报告任务创建失败，请稍后重试')
  }

  applyBackendProgress(data, setProgress)
  return pollReportUntilReady(sessionId, data.reportId, api, setProgress)
}

async function finalizeReport(report, startedAt, setProgress) {
  setProgress(
    'layout_report',
    ['read_answers', 'build_profile', 'save_profile', 'build_context', 'generate_report'],
    undefined,
    {
      backendTitle: '正在整理报告版式',
      backendDescription: '把报告内容整理成最终展示页，即将进入结果解读。',
      backendPercent: 96,
    },
  )
  await wait(LAYOUT_STEP_DELAY_MS)

  const elapsed = Date.now() - startedAt
  if (elapsed < MIN_PROGRESS_VISIBLE_MS) {
    await wait(MIN_PROGRESS_VISIBLE_MS - elapsed)
  }

  setProgress('layout_report', REPORT_GENERATION_STEPS.map((step) => step.id), undefined, {
    backendTitle: '报告生成完成',
    backendDescription: '完整报告已经准备好，正在进入报告页面。',
    backendPercent: 100,
  })
  return report
}

/**
 * 执行报告生成链路并回调进度。
 * @param {{
 *   session: import('./discover-session').DiscoverSession,
 *   syncDiscoverProfileToBackend: Function,
 *   api: { generateReport: Function, getLatestReport: Function, getReportStatus: Function },
 *   onProgress: (progress: { activeStep: string, completedSteps: string[], failedStep?: string, backendTitle?: string, backendDescription?: string, backendPercent?: number }) => void,
 *   forceRegenerate?: boolean,
 * }} options
 */
export async function runReportGenerationChain(options) {
  const { session, syncDiscoverProfileToBackend, api, onProgress, forceRegenerate } = options
  const startedAt = Date.now()
  let activeStep = 'read_answers'

  const setProgress = (nextActive, completedSteps, failedStep, extra) => {
    activeStep = nextActive
    onProgress(buildProgressPayload(nextActive, completedSteps, failedStep, extra))
  }

  try {
    setProgress('read_answers', [])
    await wait(180)
    setProgress('build_profile', ['read_answers'])
    await wait(180)

    setProgress('save_profile', ['read_answers', 'build_profile'])
    const sessionId = await syncDiscoverProfileToBackend(session, { force: false })
    if (!sessionId) throw new Error('无法保存兴趣画像')

    setProgress('build_context', ['read_answers', 'build_profile', 'save_profile'])
    await wait(CONTEXT_STEP_DELAY_MS)

    if (!forceRegenerate) {
      const existingReport = await resolveExistingReport(sessionId, api, setProgress)
      if (existingReport && existingReport.report) {
        return finalizeReport(existingReport.report, startedAt, setProgress)
      }
    }

    setProgress('generate_report', ['read_answers', 'build_profile', 'save_profile', 'build_context'], undefined, {
      backendTitle: '正在创建报告任务',
      backendDescription: '后台将根据当前画像复用已有报告或发起新的生成任务。',
      backendPercent: 52,
    })

    const res = await api.generateReport(sessionId, Boolean(forceRegenerate))
    const finalData = await resolveGeneratedReport(sessionId, res && res.data, api, setProgress)
    if (!finalData || !finalData.report) {
      throw new Error('报告生成失败，请稍后重试')
    }

    return finalizeReport(finalData.report, startedAt, setProgress)
  } catch (error) {
    const message = error && error.message ? error.message : '报告生成失败，请稍后重试'
    setProgress(activeStep, getCompletedBefore(activeStep), activeStep)
    const wrapped = new Error(message)
    wrapped.step = activeStep
    throw wrapped
  }
}

function getCompletedBefore(stepId) {
  const index = REPORT_GENERATION_STEPS.findIndex((step) => step.id === stepId)
  if (index <= 0) return []
  return REPORT_GENERATION_STEPS.slice(0, index).map((step) => step.id)
}
