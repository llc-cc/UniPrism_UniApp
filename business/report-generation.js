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
}

const CONTEXT_STEP_DELAY_MS = 360
const LAYOUT_STEP_DELAY_MS = 520
const MIN_PROGRESS_VISIBLE_MS = 800

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
  const completedCount = progress.completedSteps.length
  if (progress.failedStep) {
    return Math.max(12, (completedCount / REPORT_GENERATION_STEPS.length) * 100)
  }
  if (completedCount >= REPORT_GENERATION_STEPS.length) return 100
  return Math.min(94, ((completedCount + 0.42) / REPORT_GENERATION_STEPS.length) * 100)
}

/**
 * 执行报告生成链路并回调进度。
 * @param {{
 *   session: import('./discover-session').DiscoverSession,
 *   syncDiscoverProfileToBackend: Function,
 *   api: { generateReport: Function },
 *   onProgress: (progress: { activeStep: string, completedSteps: string[], failedStep?: string }) => void,
 * }} options
 */
export async function runReportGenerationChain(options) {
  const { session, syncDiscoverProfileToBackend, api, onProgress } = options
  const startedAt = Date.now()
  let activeStep = 'read_answers'

  const setProgress = (nextActive, completedSteps, failedStep) => {
    activeStep = nextActive
    onProgress({ activeStep: nextActive, completedSteps, failedStep })
  }

  try {
    setProgress('read_answers', [])
    await wait(180)
    setProgress('build_profile', ['read_answers'])
    await wait(180)

    setProgress('save_profile', ['read_answers', 'build_profile'])
    const sessionId = await syncDiscoverProfileToBackend(session, { force: true })
    if (!sessionId) throw new Error('无法保存兴趣画像')

    setProgress('build_context', ['read_answers', 'build_profile', 'save_profile'])
    await wait(CONTEXT_STEP_DELAY_MS)

    setProgress('generate_report', ['read_answers', 'build_profile', 'save_profile', 'build_context'])
    const res = await api.generateReport(sessionId, false)
    const report = res && res.data && res.data.report
    if (!report) throw new Error('报告生成失败，请稍后重试')

    setProgress('layout_report', [
      'read_answers',
      'build_profile',
      'save_profile',
      'build_context',
      'generate_report',
    ])
    await wait(LAYOUT_STEP_DELAY_MS)

    const elapsed = Date.now() - startedAt
    if (elapsed < MIN_PROGRESS_VISIBLE_MS) {
      await wait(MIN_PROGRESS_VISIBLE_MS - elapsed)
    }

    setProgress('layout_report', REPORT_GENERATION_STEPS.map((step) => step.id))
    return report
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
