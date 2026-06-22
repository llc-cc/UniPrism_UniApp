/**
 * 兴趣探索主页路线进度（对齐 Web lib/homeInterestRoadProgress.ts）
 */

import { getScreenStageIndex } from './discover-chat-screens'
import { getInterestContinueAnchorIndex, getInterestContinueAnchorStageId, getSessionScreenId } from './interest-progress-snapshot'

/** @typedef {'personality' | 'holland' | 'deep'} HomeInterestRoadStageId */
/** @typedef {HomeInterestRoadStageId | 'report'} HomeInterestRoadNodeId */
/** @typedef {'locked' | 'current' | 'completed'} HomeInterestRoadStatus */
/** @typedef {'continue' | 'generate-report' | 'report-progress' | 'view-report'} HomeInterestRoadCtaKind */

/**
 * @typedef {Object} HomeInterestRoadStageInput
 * @property {HomeInterestRoadStageId} id
 * @property {string} label
 * @property {HomeInterestRoadStatus} status
 * @property {number} progressPercent
 */

/**
 * @typedef {Object} HomeLatestReportState
 * @property {boolean} exists
 * @property {string | null} status
 * @property {boolean} queued
 */

const STAGE_ORDER = ['personality', 'holland', 'deep']

const STAGE_LABELS = {
  personality: '性格测试',
  holland: '职业测试',
  deep: '深度测评',
}

const ROAD_NODE_PROGRESS = {
  personality: 18,
  holland: 38,
  deep: 82,
  report: 100,
}

/** 继续探索气泡尺寸（rpx） */
const CONTINUE_CTA_SIZE = { width: 160, height: 70 }

/**
 * 各阶段「继续探索」尖角锚点（rpx，基于 750 宽路线图）
 * 报告阶段气泡使用固定坐标，不参与尖角推导
 */
export const INTEREST_MAP_CTA_TIP_ANCHORS = {
  personality: { x: 200, y: 300 },
  holland: { x: 480, y: 410 },
  deep: { x: 615, y: 505 },
}

/** 报告气泡固定位置（rpx，勿随继续探索锚点改动） */
export const INTEREST_REPORT_CTA_LAYOUT = { left: 280, top: 880, width: 408, height: 176 }

export const INTEREST_REPORT_GENERATING_COPY = '报告正在生成，继续查看进度'
export const INTEREST_REPORT_PENDING_COPY = '生成你的兴趣关键词、优势类型与推荐方向'
export const INTEREST_REPORT_READY_COPY = '查看你的兴趣关键词、优势类型与推荐方向'

/** @param {{ x: number, y: number }} tip */
function layoutContinueBubbleFromTip(tip) {
  const { width, height } = CONTINUE_CTA_SIZE
  return {
    left: Math.round(tip.x - width / 2),
    top: Math.round(tip.y - height),
    width,
    height,
  }
}

/** 小程序地图 CTA 定位（rpx） */
export const INTEREST_MAP_CTA_LAYOUT = {
  personality: layoutContinueBubbleFromTip(INTEREST_MAP_CTA_TIP_ANCHORS.personality),
  holland: layoutContinueBubbleFromTip(INTEREST_MAP_CTA_TIP_ANCHORS.holland),
  deep: layoutContinueBubbleFromTip(INTEREST_MAP_CTA_TIP_ANCHORS.deep),
  report: INTEREST_REPORT_CTA_LAYOUT,
}

function clampPercent(value) {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, value))
}

function getReportComplete(report) {
  return report.exists === true || report.status === 'completed'
}

function getReportInProgress(report) {
  return report.queued === true || report.status === 'pending' || report.status === 'generating'
}

function normalizeStages(stages) {
  return STAGE_ORDER.map((id, index) => {
    const stage = stages.find((item) => item.id === id)
    return {
      id,
      label: STAGE_LABELS[id],
      status: stage?.status ?? (index === 0 ? 'current' : 'locked'),
      progressPercent: clampPercent(stage?.progressPercent ?? 0),
    }
  })
}

function resolveCurrentStageIndex(normalizedStages) {
  const currentIndex = normalizedStages.findIndex((stage) => stage.status === 'current')
  if (currentIndex >= 0) return currentIndex

  const firstOpenIndex = normalizedStages.findIndex((stage) => stage.status !== 'completed')
  if (firstOpenIndex >= 0) return firstOpenIndex

  return 0
}

/**
 * @param {{ currentQuestionIndex?: number, answers?: unknown[] } | null | undefined} session
 * @param {typeof STAGE_ORDER[number]} anchorNodeId
 */
export function getContinueExploreUrl(session, anchorNodeId) {
  const anchorIndex = STAGE_ORDER.indexOf(anchorNodeId)
  if (anchorIndex < 0) return '/pages/discover/chat'

  const screenId = getSessionScreenId(session)
  const screenStageIndex = getScreenStageIndex(screenId)
  if (screenStageIndex >= anchorIndex && screenId !== 'basic') {
    return '/pages/discover/chat'
  }
  return getStageIntroUrl(anchorNodeId)
}

/**
 * @param {{
 *   stages: HomeInterestRoadStageInput[],
 *   discoveryCompleted: boolean,
 *   report: HomeLatestReportState,
 *   session?: { currentQuestionIndex?: number, answers?: unknown[] } | null,
 * }} input
 */
export function buildHomeInterestRoadView({ stages, discoveryCompleted, report, session = null }) {
  const normalizedStages = normalizeStages(stages)
  const assessmentComplete =
    discoveryCompleted || normalizedStages.every((stage) => stage.status === 'completed')
  const reportComplete = getReportComplete(report)
  const reportInProgress = getReportInProgress(report)

  if (reportComplete) {
    return {
      activeNodeId: 'report',
      activeNodeIds: [...STAGE_ORDER, 'report'],
      roadProgressPercent: 100,
      statusLabel: '生成报告',
      statusText: '已完成',
      cta: {
        kind: 'view-report',
        label: '查看报告',
        url: '/pages/discover/results',
        anchorNodeId: 'report',
      },
    }
  }

  if (assessmentComplete) {
    return {
      activeNodeId: 'report',
      activeNodeIds: [...STAGE_ORDER, 'report'],
      roadProgressPercent: reportInProgress ? 96 : 92,
      statusLabel: '生成报告',
      statusText: reportInProgress ? '生成中' : '待生成',
      cta: {
        kind: reportInProgress ? 'report-progress' : 'generate-report',
        label: reportInProgress ? '查看进度' : '生成报告',
        url: reportInProgress ? '/pages/discover/results' : '/pages/discover/chat?screen=complete',
        anchorNodeId: 'report',
      },
    }
  }

  const anchorIndex = session
    ? getInterestContinueAnchorIndex(session)
    : resolveCurrentStageIndex(normalizedStages)
  const anchorNodeId = session
    ? getInterestContinueAnchorStageId(session)
    : (normalizedStages[anchorIndex]?.id || STAGE_ORDER[0])
  const anchorStage = normalizedStages[anchorIndex] ?? normalizedStages[0]
  const previousNodeId = STAGE_ORDER[anchorIndex - 1]
  const previousProgress = previousNodeId ? ROAD_NODE_PROGRESS[previousNodeId] : 0
  const currentProgress = ROAD_NODE_PROGRESS[anchorStage.id]
  const stageProgress = clampPercent(anchorStage.progressPercent)
  const roadProgressPercent = clampPercent(Math.max(
    anchorIndex === 0 ? 10 : previousProgress,
    previousProgress + ((currentProgress - previousProgress) * stageProgress) / 100,
  ))
  const activeNodeIds = normalizedStages
    .filter((stage, index) => stage.status === 'completed' || index === anchorIndex)
    .map((stage) => stage.id)

  return {
    activeNodeId: anchorNodeId,
    activeNodeIds: activeNodeIds.length ? activeNodeIds : [anchorNodeId],
    roadProgressPercent,
    statusLabel: anchorStage.label,
    statusText: '进行中',
    cta: {
      kind: 'continue',
      label: '继续探索',
      url: getContinueExploreUrl(session, anchorNodeId),
      anchorNodeId,
    },
  }
}

/** @param {number} percent */
export function getRoadProgressAsset(percent) {
  const value = clampPercent(percent)
  if (value >= 92) return '/static/assets/discover/road-progress-4.svg'
  if (value >= 55) return '/static/assets/discover/road-progress-3.svg'
  if (value >= 28) return '/static/assets/discover/road-progress-2.svg'
  return '/static/assets/discover/road-progress-1.svg'
}

/** @param {HomeInterestRoadNodeId} nodeId */
export function getStageIntroUrl(nodeId) {
  if (nodeId === 'personality') return '/pages/discover/chat?screen=stage-personality-intro'
  if (nodeId === 'holland') return '/pages/discover/chat?screen=stage-holland-intro'
  if (nodeId === 'deep') return '/pages/discover/chat?screen=stage-deep-intro'
  if (nodeId === 'report') return '/pages/discover/chat?screen=complete'
  return '/pages/discover/chat'
}
