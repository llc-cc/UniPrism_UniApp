<template>
  <view class="report-shell">
  <scroll-view class="report-page" scroll-y>
    <view class="hero">
      <image v-if="coverUrl" class="cover" :src="coverUrl" mode="aspectFill" />
      <view v-else class="cover cover--placeholder" />
      <text class="greeting">Hi，{{ nickname }}</text>
      <view class="tagline-pill">
        <view class="tagline-accent" />
        <text class="tagline-code">{{ codeTag }}</text>
        <text class="tagline-text">{{ taglineText }}</text>
      </view>
    </view>

    <view class="desc-box">
      <scroll-view class="desc-scroll" scroll-y @scroll="handleDescScroll">
        <view class="desc-segments">
          <view
            v-for="segment in careerDimensionSegments"
            :key="segment.dim + '-' + segment.label"
            class="desc-segment"
          >
            <view class="desc-segment-head">
              <view class="desc-segment-accent" />
              <text class="desc-segment-title">{{ segment.label }}</text>
              <text v-if="segment.dim" class="desc-segment-code">({{ segment.dim }})</text>
            </view>
            <rich-text class="desc-segment-rich" :nodes="segment.nodes" />
          </view>
        </view>
      </scroll-view>
      <view class="desc-bar">
        <view
          class="desc-thumb"
          :style="{ height: descThumbHeight + 'rpx', transform: 'translateY(' + descThumbTop + 'rpx)' }"
        />
      </view>
    </view>

    <view class="result-card result-card--clickable" @tap="openPersonalityDetail">
      <view class="result-head">
        <view class="result-icon">
          <image class="result-icon-img" src="/static/assets/discover/profile-clipboard-figma.svg" mode="aspectFit" />
        </view>
        <view class="result-title-wrap">
          <text class="result-title">性格测试结果</text>
          <text class="result-subtitle">The result of the personality test</text>
        </view>
      </view>
      <text class="result-body">{{ personalityPreviewText }}</text>
      <text v-if="personalityResult" class="result-cta">点击查看</text>
    </view>

    <view class="result-card result-card--clickable" @tap="openPersonaDetail">
      <view class="result-head">
        <view class="result-icon">
          <image class="result-icon-img" src="/static/assets/discover/profile-clipboard-figma.svg" mode="aspectFit" />
        </view>
        <view class="result-title-wrap">
          <text class="result-title">综合人格画像</text>
          <text class="result-subtitle">Comprehensive personality profile</text>
        </view>
      </view>
      <text class="result-body">{{ personaPreviewText }}</text>
      <text v-if="personaResult" class="result-cta">点击查看</text>
    </view>

    <view class="divider" />

    <view class="section-head">
      <text class="section-title">专业推荐</text>
      <text class="section-subtitle">结合兴趣类型、能力倾向与学习场景，优先推荐以下方向。</text>
    </view>

    <view
      v-for="major in majorCards"
      :key="major.id"
      class="major-card"
      :style="{ background: major.bg }"
      @tap="openMajor(major)"
    >
      <view class="major-body">
        <view class="major-rank">
          <view class="major-rank-head">
            <view class="major-rank-wing major-rank-wing--l">
              <image class="major-rank-wing-img" :src="majorRankWheatUrl" mode="aspectFit" />
            </view>
            <text class="major-rank-top">TOP</text>
            <view class="major-rank-wing major-rank-wing--r">
              <image class="major-rank-wing-img major-rank-wing-img--mirror" :src="majorRankWheatUrl" mode="aspectFit" />
            </view>
          </view>
          <text class="major-rank-num">{{ major.rankLabel }}</text>
        </view>

        <view class="major-main">
          <view class="major-icon-box">
            <image class="major-icon" :src="major.iconUrl" mode="aspectFit" />
          </view>
          <text class="major-name">{{ major.name }}</text>
        </view>

        <view class="major-cta" @tap.stop="openMajor(major)">
          <text class="major-cta-text">点击查看分析</text>
        </view>
      </view>

      <view class="major-rating">
        <text class="major-rating-label">推荐指数：</text>
        <view class="major-stars">
          <text
            v-for="n in 5"
            :key="major.id + '-star-' + n"
            class="major-star"
            :class="{ 'major-star--dim': n > major.starCount }"
          >
            ★
          </text>
        </view>
      </view>
    </view>

    <view class="divider" />

    <view class="section-head">
      <text class="section-title">综合建议</text>
      <text class="section-subtitle">把兴趣优势转化为可执行的学习与选择策略。</text>
    </view>

    <view class="advice-box" @tap="openAdvice">
      <text class="advice-text">{{ advicePreviewText }}</text>
      <text v-if="adviceText" class="advice-cta">点击查看</text>
    </view>

    <view class="share-card">
      <text class="share-card-title">转发给好友</text>
      <text class="share-card-desc">把这份兴趣报告分享给朋友看看，一起聊聊适合的专业方向。</text>
      <button class="share-card-button" open-type="share" @tap="$emit('prepare-share')">
        <image class="share-card-button-icon" src="/static/assets/discover/share-join-globe.svg" mode="aspectFit" />
        <text class="share-card-button-label">分享报告</text>
      </button>
    </view>

    <view class="report-footer">
      <button class="experience-button" @tap="openMajorExperience">专业体验</button>
    </view>

    <view class="bottom-safe" />
  </scroll-view>

  <view v-if="detailSheet.visible" class="detail-sheet-mask" @tap="closeDetailSheet">
    <view class="detail-sheet" @tap.stop>
      <text class="detail-sheet-title">{{ detailSheet.title }}</text>
      <scroll-view class="detail-sheet-scroll" scroll-y>
        <text class="detail-sheet-body">{{ detailSheet.content }}</text>
      </scroll-view>
      <button class="detail-sheet-btn" @tap="closeDetailSheet">知道了</button>
    </view>
  </view>
  </view>
</template>

<script>
import { DIMENSION_DESCRIPTIONS, getMajorLabelById } from '../../../../business/riasecEngine'
import { getMajorById } from '../../../../business/explore-data'
import {
  REPORT_MAJOR_WHEAT,
  resolveReportMajorIconPath,
} from '../../business/discover-report-asset-locations'
import { navigateToMajor } from '../../../../business/major-routes'
import { loadDiscoverSession } from '../../../../business/discover-session-storage'
import { getBasicProfileGenderFromSession } from '../../../../business/user-avatar'
import {
  buildReportHeroModel,
  buildReportMajorRows,
  resolveReportHeroDimensions,
} from '../../../../business/report-display-model'
import {
  buildReportViewSnapshot,
} from '../../business/report-share-view'
import { saveReportViewSnapshot } from '../../business/report-view-snapshot'
import {
  formatIntegratedPersonaDisplay,
  formatPersonalityResultDisplay,
} from '../../business/report-personality-display'
import { resolveAsset, resolveCatalogAsset } from '../../../../utils/asset-map'

const REPORT_DEFAULT_MAJOR_IMAGE =
  '/images/explore/discover/icons/generated/discover-major-artificial-intelligence-20260610-v2-flat2d.png'
const MAJOR_BG_COLORS = ['#8455E0', '#925FF7', 'rgba(152, 115, 226, 0.9)', '#B394EF', 'rgba(188, 163, 236, 0.7)']
const RESULT_PREVIEW_MAX_LEN = 120
const ADVICE_PREVIEW_MAX_LEN = 180
function clampScore(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(60, Math.min(99, Math.round(n)))
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function sliceByPunctuation(value) {
  const text = normalizeText(value)
  if (!text) return ''
  const idx = text.search(/[。！？.!?]/)
  if (idx > -1) return text.slice(0, idx + 1)
  return text
}

function joinReadableParts(parts) {
  return parts.map(normalizeText).filter(Boolean).join(' ')
}

function formatProfileSummaryLongText(items) {
  return joinReadableParts((items || []).map((item) => {
    if (!item || !item.title || !item.detail) return ''
    return `${item.title}：${item.detail}`
  }))
}

function dimensionsFromReportCode(code) {
  return String(code || '')
    .toUpperCase()
    .split('')
    .filter((item, index, list) => DIMENSION_DESCRIPTIONS[item] && list.indexOf(item) === index)
    .slice(0, 2)
}

function buildProfileDescNodes(text, highlight) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return []
  if (!highlight) return [{ type: 'text', text: normalized }]
  const safeHighlight = String(highlight).trim()
  if (!safeHighlight) return [{ type: 'text', text: normalized }]

  const parts = normalized.split(safeHighlight)
  if (parts.length === 1) return [{ type: 'text', text: normalized }]
  const nodes = []
  parts.forEach((part, index) => {
    if (part) nodes.push({ type: 'text', text: part })
    if (index < parts.length - 1) {
      nodes.push({ type: 'text', text: safeHighlight, style: 'font-weight: 700;' })
    }
  })
  return nodes
}

function sentenceMatchesDimension(sentence, tag) {
  if (!sentence || !tag) return false
  const label = tag.label || ''
  const dim = tag.dim || ''
  if (label && sentence.includes(label)) return true
  if (dim && new RegExp(`\\(${dim}\\)`, 'i').test(sentence)) return true
  if (dim && new RegExp(`${dim}型`).test(sentence)) return true
  return false
}

function splitCompoundSentence(sentence, primary, secondary) {
  const secondaryMarkers = [
    `，${secondary.label}则`,
    `，${secondary.label}`,
    `、${secondary.label}`,
  ]
  for (let i = 0; i < secondaryMarkers.length; i += 1) {
    const marker = secondaryMarkers[i]
    const idx = sentence.indexOf(marker)
    if (idx > 0) {
      const primaryPart = `${sentence.slice(0, idx).replace(/[，、]$/, '')}。`
      const secondaryPart = `${sentence.slice(idx + 1).replace(/^[，、]/, '')}`
      return {
        primary: primaryPart,
        secondary: secondaryPart.endsWith('。') ? secondaryPart : `${secondaryPart}。`,
      }
    }
  }
  const dualMatch = sentence.match(/^(.*为主)[、，]?(.*)$/)
  if (dualMatch && dualMatch[1] && dualMatch[2]) {
    return {
      primary: `${dualMatch[1]}。`,
      secondary: dualMatch[2].endsWith('。') ? dualMatch[2] : `${dualMatch[2]}。`,
    }
  }
  return { primary: sentence, secondary: '' }
}

function removeFusionFromText(text, fusionSentence) {
  const normalized = normalizeText(text)
  const fusion = normalizeText(fusionSentence)
  if (!normalized || !fusion) return normalized
  if (!normalized.includes(fusion)) return normalized
  return normalizeText(normalized.replace(fusion, ''))
}

function extractFusionArchetype(fusionSentence) {
  const text = normalizeText(fusionSentence)
  if (!text) return ''
  const quoted = text.match(/[“"「『]([^”"」』]+)[”"」』]/)
  if (quoted && quoted[1]) return `${quoted[1]}式组合`
  const combo = text.match(/([^。！？!?]{2,16}式组合)/)
  if (combo && combo[1]) return combo[1]
  const role = text.match(/一位[^。！？!?]{2,20}[。！？!?]/)
  if (role && role[0]) return role[0].replace(/[。！？!?]$/, '')
  return ''
}

const DIMENSION_DETAIL_KEYWORDS = {
  R: ['动手', '操作', '工具', '机械', '实际', '户外'],
  I: ['分析', '探索', '理论', '逻辑', '证据', '研究', '思考', '独立', '科学', '好奇心'],
  A: ['创造', '想象', '表达', '美感', '艺术', '独特'],
  S: ['交流', '帮助', '倾听', '沟通', '社会', '他人'],
  E: ['推动', '影响', '成果', '团队', '职业', '策略', '行动', '企业', '领导', '成就', '商业'],
  C: ['条理', '细节', '规则', '数据', '系统', '规范'],
}

function scoreClauseForDimension(clause, dim) {
  const keywords = DIMENSION_DETAIL_KEYWORDS[dim] || []
  let score = 0
  keywords.forEach((keyword) => {
    if (clause.includes(keyword)) score += 1
  })
  if (sentenceMatchesDimension(clause, { dim, label: (DIMENSION_DESCRIPTIONS[dim] && DIMENSION_DESCRIPTIONS[dim].label) || dim })) {
    score += 2
  }
  return score
}

function splitDetailClauses(remainder) {
  const normalized = normalizeText(remainder)
  if (!normalized) return []
  return normalized
    .split(/(?<=[。！？!?])/)
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .flatMap((sentence) => {
      if (!/[，,]/.test(sentence)) return [sentence]
      return sentence
        .split(/，/)
        .map((part, index, list) => {
          const value = normalizeText(part)
          if (!value) return ''
          if (index < list.length - 1) return `${value}，`
          return value.endsWith('。') ? value : `${value}。`
        })
        .filter(Boolean)
    })
}

function enrichDimensionDetailText(text, tag) {
  const body = normalizeText(text)
  const meta = tag && tag.dim && DIMENSION_DESCRIPTIONS[tag.dim]
  if (!meta) return body
  if (body.length >= 48) return body
  const traits = (meta.traits || []).slice(0, 2).join('、')
  const prefix = `${meta.label}：${meta.description}`
  if (!body) return traits ? `${prefix}，常见特质包括${traits}。` : `${prefix}。`
  return `${body}${body.endsWith('。') ? '' : '。'}${traits ? ` 典型特质包括${traits}。` : ''}`
}

function dimensionFallbackText(tag) {
  const meta = tag && tag.dim && DIMENSION_DESCRIPTIONS[tag.dim]
  if (!meta) return ''
  return `${meta.label}：${meta.description}。`
}

function splitIntroSentences(introText) {
  const normalized = normalizeText(introText)
  if (!normalized) return []
  const sentenceList = normalized.match(/[^。！？!?]+[。！？!?]?/g) || [normalized]
  return sentenceList.map((item) => String(item || '').trim()).filter(Boolean)
}

function findFusionSummarySentence(sentences, topTags) {
  if (!sentences.length || topTags.length < 2) return ''
  const fusion = sentences.find((sentence) => (
    sentenceMatchesDimension(sentence, topTags[0])
    && sentenceMatchesDimension(sentence, topTags[1])
  ))
  return fusion || sentences[0] || ''
}

function buildFusionTaglineText(introText, topTags, maxLen = 22) {
  const sentences = splitIntroSentences(introText)
  const fusion = findFusionSummarySentence(sentences, topTags)
  const archetype = extractFusionArchetype(fusion)
  if (archetype) {
    if (archetype.length <= maxLen) return archetype
    return `${archetype.slice(0, maxLen)}...`
  }
  if (topTags.length >= 2) {
    return `${topTags[0].label}×${topTags[1].label}融合型`
  }
  const fallback = sliceByPunctuation(introText) || normalizeText(introText)
  if (!fallback) return '你的兴趣画像已生成'
  if (fallback.length <= maxLen) return fallback
  return `${fallback.slice(0, maxLen)}...`
}

function buildCareerDimensionSegments(introText, topTags) {
  const normalized = normalizeText(introText)
  if (!normalized) return []
  if (!topTags.length) {
    return [{ dim: '', label: '兴趣画像', text: normalized }]
  }
  if (topTags.length === 1) {
    const sentences = splitIntroSentences(normalized)
    const fusion = sentences[0] || normalized
    const detailText = removeFusionFromText(normalized, fusion) || dimensionFallbackText(topTags[0])
    return [{
      dim: topTags[0].dim,
      label: topTags[0].label,
      text: enrichDimensionDetailText(detailText, topTags[0]),
    }]
  }

  const primary = topTags[0]
  const secondary = topTags[1]
  const sentences = splitIntroSentences(normalized)
  const fusionSentence = findFusionSummarySentence(sentences, topTags)
  const remainder = removeFusionFromText(normalized, fusionSentence)
  const clauses = splitDetailClauses(remainder)
  const primaryClauses = []
  const secondaryClauses = []

  clauses.forEach((clause) => {
    if (/为主|为辅|式组合/.test(clause) && clause.length <= 36) return

    const primaryHit = sentenceMatchesDimension(clause, primary)
    const secondaryHit = sentenceMatchesDimension(clause, secondary)
    if (primaryHit && secondaryHit) {
      const splitParts = splitCompoundSentence(clause, primary, secondary)
      if (splitParts.primary) primaryClauses.push(splitParts.primary)
      if (splitParts.secondary) secondaryClauses.push(splitParts.secondary)
      return
    }
    if (primaryHit && !secondaryHit) {
      primaryClauses.push(clause)
      return
    }
    if (secondaryHit && !primaryHit) {
      secondaryClauses.push(clause)
      return
    }

    const primaryScore = scoreClauseForDimension(clause, primary.dim)
    const secondaryScore = scoreClauseForDimension(clause, secondary.dim)
    if (primaryScore > secondaryScore) {
      primaryClauses.push(clause)
      return
    }
    if (secondaryScore > primaryScore) {
      secondaryClauses.push(clause)
      return
    }
    primaryClauses.push(clause)
    secondaryClauses.push(clause)
  })

  const segments = [
    {
      dim: primary.dim,
      label: primary.label,
      text: enrichDimensionDetailText(primaryClauses.join(''), primary),
    },
    {
      dim: secondary.dim,
      label: secondary.label,
      text: enrichDimensionDetailText(secondaryClauses.join(''), secondary),
    },
  ]

  return segments.filter((item) => normalizeText(item.text))
}

function computeStarCountByRank(rankIndex) {
  const rank = Number(rankIndex)
  if (!Number.isFinite(rank) || rank <= 0) return 5
  if (rank === 1) return 5
  if (rank <= 3) return 4
  return 3
}

function buildPreviewText(text, maxLen = RESULT_PREVIEW_MAX_LEN) {
  const normalized = normalizeText(text)
  if (!normalized) return ''
  if (normalized.length <= maxLen) return normalized
  return `${normalized.slice(0, maxLen)}......`
}

function resolveMajorIconPath(majorId, majorName, reportMajors) {
  const local = getMajorById(majorId)
  return resolveReportMajorIconPath(majorId, {
    reportMajors,
    name: majorName,
    localIcon: (local && local.icon) || '',
  })
}

function appendMajorRow(rows, seen, entry) {
  if (!entry || !entry.id || seen.has(entry.id)) return
  seen.add(entry.id)
  rows.push(entry)
}

function isUnresolvedMajorName(id, name) {
  const label = normalizeText(name)
  const majorId = normalizeText(id)
  if (!label) return true
  if (label === majorId) return true
  return /^[a-z0-9_-]+$/i.test(label)
}

function resolveMajorName(id, name, reportMajors) {
  const majorId = normalizeText(id)
  const normalizedName = normalizeText(name)
  if (!isUnresolvedMajorName(majorId, normalizedName)) return normalizedName
  const fromReport = (reportMajors || []).find((item) => item.majorId === majorId)
  if (fromReport && !isUnresolvedMajorName(majorId, fromReport.name)) {
    return normalizeText(fromReport.name)
  }
  const fromRiasec = getMajorLabelById(majorId)
  if (fromRiasec) return fromRiasec
  const local = getMajorById(majorId)
  if (local && normalizeText(local.title)) return normalizeText(local.title)
  return '待定专业'
}

function buildExpandedReportDetailModel(report) {
  if (!report) return null

  const structuredAnalysis = report.personalityAndCareerAnalysis
  if (structuredAnalysis && report.majorRecommendations && report.comprehensiveAdvice) {
    return {
      analysisTitle: structuredAnalysis.title || '人格与职业倾向分析',
      analysisBlocks: [
        {
          eyebrow: '职业倾向分析',
          title: structuredAnalysis.careerTendencyAnalysis && structuredAnalysis.careerTendencyAnalysis.title,
          body: structuredAnalysis.careerTendencyAnalysis && structuredAnalysis.careerTendencyAnalysis.body,
        },
        {
          eyebrow: '性格测试结果',
          title: structuredAnalysis.personalityTestResult && structuredAnalysis.personalityTestResult.title,
          body: structuredAnalysis.personalityTestResult && structuredAnalysis.personalityTestResult.body,
        },
        {
          eyebrow: '综合人格画像',
          title: structuredAnalysis.integratedPersona && structuredAnalysis.integratedPersona.title,
          body: structuredAnalysis.integratedPersona && structuredAnalysis.integratedPersona.body,
        },
      ].filter((item) => normalizeText(item.title) || normalizeText(item.body)),
      profilePortrait: structuredAnalysis.integratedPersona || null,
      majorExperience: (report.majorRecommendations.majors || []).map((item) => ({
        id: item.majorId,
        name: item.name,
        body: item.personalizedReason || item.overview,
      })),
      careerRecommendations: ((report.careerRecommendations && report.careerRecommendations.careers) || []).map((item) => ({
        id: item.careerId,
        name: item.name,
        body: item.personalizedReason || item.overview,
      })),
      comprehensiveAdvice: {
        title: report.comprehensiveAdvice.title || '综合建议',
        body: report.comprehensiveAdvice.developmentAdvice || '',
        disclaimer: report.comprehensiveAdvice.disclaimer || '',
      },
    }
  }

  const expanded = report.expandedReport
  if (expanded) {
    return {
      analysisTitle: '人格与职业倾向分析',
      analysisBlocks: [
        {
          eyebrow: '人物画像',
          title: expanded.profilePortrait && expanded.profilePortrait.title,
          body: expanded.profilePortrait && expanded.profilePortrait.body,
        },
        {
          eyebrow: '个性化建议',
          title: expanded.personalityAdvice && expanded.personalityAdvice.title,
          body: expanded.personalityAdvice && expanded.personalityAdvice.body,
        },
      ].filter((item) => normalizeText(item.title) || normalizeText(item.body)),
      profilePortrait: expanded.profilePortrait || null,
      majorExperience: (expanded.majorExperience || []).map((item) => ({
        id: item.majorId,
        name: item.name,
        body: item.body,
        nextAction: item.nextAction,
      })),
      careerRecommendations: (expanded.careerRecommendations || []).map((item) => ({
        id: item.careerId,
        name: item.name,
        body: item.body,
        nextAction: item.nextAction,
      })),
      comprehensiveAdvice: {
        title: (expanded.growthPath && expanded.growthPath.title) || '综合建议',
        body: (expanded.growthPath && expanded.growthPath.body) || '',
        disclaimer: report.disclaimer || '',
      },
    }
  }

  return {
    analysisTitle: '人格与职业倾向分析',
    analysisBlocks: [
      {
        eyebrow: '人物画像',
        title: '人物画像',
        body: joinReadableParts([
          report.summary,
          formatProfileSummaryLongText(report.profileSummary && report.profileSummary.personalityTraits),
        ]),
      },
      {
        eyebrow: '个性化建议',
        title: '个性化建议',
        body: joinReadableParts([
          report.riasec && report.riasec.interpretation,
          formatProfileSummaryLongText(report.profileSummary && report.profileSummary.growthEdges),
        ]),
      },
    ].filter((item) => normalizeText(item.body)),
    profilePortrait: {
      title: '人物画像',
      body: joinReadableParts([
        report.summary,
        formatProfileSummaryLongText(report.profileSummary && report.profileSummary.personalityTraits),
      ]),
    },
    majorExperience: (report.recommendedMajors || []).map((item) => ({
      id: item.majorId,
      name: item.name,
      body: joinReadableParts([item.reason, item.knowledgeReason]),
      nextAction: item.nextAction,
    })),
    careerRecommendations: (report.recommendedCareers || []).slice(0, 3).map((item) => ({
      id: item.careerId,
      name: item.name,
      body: joinReadableParts([item.reason, item.knowledgeReason]),
      nextAction: item.nextAction,
    })),
    comprehensiveAdvice: {
      title: '综合建议',
      body: joinReadableParts([
        (report.growthPlan || []).map((item) => `第${item.week}周：${item.task}`).join(' '),
        report.disclaimer,
      ]),
      disclaimer: report.disclaimer || '',
    },
  }
}

export default {
  name: 'DiscoverReportView',
  components: {},
  props: {
    profile: { type: Object, required: true },
    majors: { type: Array, default: () => [] },
    report: { type: Object, default: null },
    nickname: { type: String, default: '同学' },
    sessionId: { type: String, default: '' },
    reportId: { type: String, default: '' },
  },
  emits: ['restart', 'go-home', 'prepare-share'],
  data() {
    return {
      descThumbHeight: 112,
      descThumbTop: 0,
      descBoxHeight: 360,
      detailSheet: {
        visible: false,
        title: '',
        content: '',
      },
    }
  },
  computed: {
    displayTopDimensions() {
      return resolveReportHeroDimensions(this.report, this.profile)
    },
    topTags() {
      const dims = this.displayTopDimensions
      return dims.slice(0, 2).map((dim) => ({
        dim,
        label: (DIMENSION_DESCRIPTIONS[dim] && DIMENSION_DESCRIPTIONS[dim].label) || dim,
      }))
    },
    reportCodeLabel() {
      const code = (this.report && this.report.riasec && this.report.riasec.code) || this.displayTopDimensions.join('')
      return code || 'IC'
    },
    heroModel() {
      const session = loadDiscoverSession()
      const genderOptionId = getBasicProfileGenderFromSession(session)
      return buildReportHeroModel({
        report: this.report,
        profile: this.profile,
        genderOptionId,
      })
    },
    personaCard() {
      return this.heroModel && this.heroModel.personaCard
    },
    coverUrl() {
      const imagePath = this.heroModel && this.heroModel.coverImagePath
      return imagePath ? resolveAsset(imagePath) : ''
    },
    defaultMajorImagePath() {
      return REPORT_DEFAULT_MAJOR_IMAGE
    },
    majorRankWheatUrl() {
      return resolveCatalogAsset(REPORT_MAJOR_WHEAT)
    },
    detailModel() {
      return buildExpandedReportDetailModel(this.report)
    },
    introText() {
      const analysis = this.report && this.report.personalityAndCareerAnalysis
      const careerBody = analysis && analysis.careerTendencyAnalysis && analysis.careerTendencyAnalysis.body
      if (careerBody) return normalizeText(careerBody)
      const portrait = this.detailModel && this.detailModel.profilePortrait
      if (portrait && portrait.body) return portrait.body
      if (this.report && this.report.summary) return this.report.summary
      return ''
    },
    codeTag() {
      return (this.heroModel && this.heroModel.codeTag) || `${this.reportCodeLabel}型`
    },
    taglineText() {
      if (this.heroModel && this.heroModel.taglineText) return this.heroModel.taglineText
      return buildFusionTaglineText(this.introText, this.topTags)
    },
    careerDimensionSegments() {
      return buildCareerDimensionSegments(this.introText, this.topTags).map((segment) => ({
        ...segment,
        nodes: buildProfileDescNodes(segment.text, segment.label),
      }))
    },
    majorRows() {
      return buildReportMajorRows({
        report: this.report,
        detailModel: this.detailModel,
      })
    },
    majorCards() {
      const reportMajors = [
        ...(((this.report && this.report.majorRecommendations && this.report.majorRecommendations.majors) || [])),
        ...(((this.report && this.report.recommendedMajors) || [])),
      ]
      return this.majorRows.map((major, index) => {
        const iconPath = resolveMajorIconPath(major.id, major.name, reportMajors)
        const iconUrl = resolveCatalogAsset(iconPath) || resolveCatalogAsset(this.defaultMajorImagePath)
        return {
          ...major,
          iconPath,
          iconUrl,
          rankLabel: String(index + 1).padStart(2, '0'),
          starCount: computeStarCountByRank(index + 1),
          bg: MAJOR_BG_COLORS[index % MAJOR_BG_COLORS.length],
        }
      })
    },
    personalityDisplayContext() {
      const session = loadDiscoverSession()
      return {
        profile: this.profile,
        report: this.report,
        sessionAnswers: (session && session.answers) || [],
      }
    },
    rawPersonalityResult() {
      const analysis = this.report && this.report.personalityAndCareerAnalysis
      const structured = analysis && analysis.personalityTestResult && analysis.personalityTestResult.body
      if (structured) return normalizeText(structured)
      const blocks = (this.detailModel && this.detailModel.analysisBlocks) || []
      const preferred = blocks.find((item) => /性格/.test(item.eyebrow || '') || /性格/.test(item.title || ''))
      const fallback = blocks[0]
      return normalizeText((preferred && preferred.body) || (fallback && fallback.body) || '')
    },
    personalityResult() {
      if (!this.rawPersonalityResult) return ''
      return formatPersonalityResultDisplay(this.rawPersonalityResult, this.personalityDisplayContext)
    },
    personalityPreviewText() {
      if (!this.personalityResult) return '完成性格测试后，这里会展示你的性格类型与倾向解读。'
      return buildPreviewText(this.personalityResult)
    },
    rawPersonaResult() {
      const analysis = this.report && this.report.personalityAndCareerAnalysis
      const integrated = analysis && analysis.integratedPersona && analysis.integratedPersona.body
      if (integrated) return normalizeText(integrated)
      const portrait = this.detailModel && this.detailModel.profilePortrait
      return normalizeText((portrait && portrait.body) || '')
    },
    personaResult() {
      if (!this.rawPersonaResult) return ''
      return formatIntegratedPersonaDisplay(this.rawPersonaResult, this.personalityDisplayContext)
    },
    personaPreviewText() {
      if (!this.personaResult) return '综合人格画像生成后，这里会展示你的兴趣优势与成长提醒。'
      return buildPreviewText(this.personaResult)
    },
    adviceText() {
      const detailed = this.detailModel && this.detailModel.comprehensiveAdvice && this.detailModel.comprehensiveAdvice.body
      return normalizeText(detailed || (this.report && this.report.summary) || '')
    },
    advicePreviewText() {
      if (!this.adviceText) return '把兴趣优势转化为可执行的学习与选择策略。'
      return buildPreviewText(this.adviceText, ADVICE_PREVIEW_MAX_LEN)
    },
  },
  watch: {
    report: {
      deep: true,
      handler() {
        this.persistShareViewSnapshot()
      },
    },
    nickname() {
      this.persistShareViewSnapshot()
    },
    sessionId() {
      this.persistShareViewSnapshot()
    },
    reportId() {
      this.persistShareViewSnapshot()
    },
  },
  mounted() {
    this.persistShareViewSnapshot()
  },
  methods: {
    persistShareViewSnapshot() {
      if (!this.report || !this.sessionId || !this.reportId) return
      const session = loadDiscoverSession()
      saveReportViewSnapshot(buildReportViewSnapshot({
        sessionId: this.sessionId,
        reportId: this.reportId,
        report: this.report,
        profile: this.profile,
        nickname: this.nickname,
        genderOptionId: getBasicProfileGenderFromSession(session),
        sessionAnswers: (session && session.answers) || [],
      }))
    },
    handleDescScroll(e) {
      const scrollTop = (e && e.detail && e.detail.scrollTop) || 0
      const scrollHeight = (e && e.detail && e.detail.scrollHeight) || this.descBoxHeight
      const boxHeight = this.descBoxHeight
      const maxScrollTop = Math.max(1, scrollHeight - boxHeight)
      const thumbHeight = Math.max(84, Math.round((boxHeight * boxHeight) / Math.max(scrollHeight, 1)))
      const maxThumbTop = Math.max(0, boxHeight - thumbHeight)
      const thumbTop = Math.round((Math.min(scrollTop, maxScrollTop) / maxScrollTop) * maxThumbTop)

      this.descThumbHeight = thumbHeight
      this.descThumbTop = thumbTop
    },
    openMajor(major) {
      if (!major || !major.id) return
      navigateToMajor(major.id, {
        source: 'report',
        name: major.name,
        description: major.description,
        score: major.score,
        rankLabel: major.rankLabel,
      })
    },
    openMajorExperience() {
      const major = (this.majorRows && this.majorRows[0]) || null
      if (!major) {
        uni.showToast({ title: '暂无可体验专业', icon: 'none' })
        return
      }
      this.openMajor(major)
    },
    openDetailSheet(title, content) {
      const text = normalizeText(content)
      if (!text) {
        uni.showToast({ title: '暂无内容', icon: 'none' })
        return
      }
      this.detailSheet = {
        visible: true,
        title,
        content: text,
      }
    },
    closeDetailSheet() {
      this.detailSheet.visible = false
    },
    openPersonalityDetail() {
      this.openDetailSheet('性格测试结果', this.personalityResult)
    },
    openPersonaDetail() {
      this.openDetailSheet('综合人格画像', this.personaResult)
    },
    openAdvice() {
      this.openDetailSheet('综合建议', this.adviceText)
    },
  },
}
</script>

<style scoped>
.report-shell {
  min-height: 100vh;
}
.report-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 0 28rpx 40rpx;
  box-sizing: border-box;
}
.hero {
  padding-top: 34rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cover {
  width: 278rpx;
  height: 352rpx;
  border-radius: 14rpx;
  box-shadow: 0 16rpx 28rpx rgba(0, 0, 0, 0.18);
}
.cover--placeholder {
  background: #d9d9d9;
}
.greeting {
  margin-top: 30rpx;
  font-size: 42rpx;
  line-height: 1.2;
  font-weight: 700;
  color: #1c2130;
  text-align: center;
}
.tagline-pill {
  margin-top: 28rpx;
  display: inline-flex;
  align-self: center;
  max-width: calc(100% - 8rpx);
  border-radius: 5rpx;
  background: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(252, 250, 255, 1) 100%);
  box-shadow: 0 10rpx 44rpx rgba(91, 91, 110, 0.21);
  position: relative;
  overflow: hidden;
  align-items: center;
  padding: 16rpx 22rpx 16rpx 26rpx;
  gap: 8rpx;
  box-sizing: border-box;
}
.tagline-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10rpx;
  background: #000000;
  border-radius: 0 0 5rpx 5rpx;
}
.tagline-code {
  flex-shrink: 0;
  font-size: 30rpx;
  line-height: 1.2;
  font-weight: 700;
  color: #424651;
}
.tagline-text {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 28rpx;
  line-height: 1.2;
  color: #424651;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.desc-box {
  margin-top: 44rpx;
  width: 100%;
  height: 360rpx;
  position: relative;
}
.desc-segments {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}
.desc-segment {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.desc-segment + .desc-segment {
  padding-top: 28rpx;
  border-top: 1rpx solid rgba(0, 0, 0, 0.08);
}
.desc-segment-head {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.desc-segment-accent {
  width: 6rpx;
  height: 28rpx;
  border-radius: 999rpx;
  background: #9762ff;
  flex-shrink: 0;
}
.desc-segment-title {
  font-size: 28rpx;
  line-height: 1.3;
  font-weight: 700;
  color: #1c2130;
}
.desc-segment-code {
  font-size: 22rpx;
  line-height: 1.3;
  color: #9762ff;
  font-weight: 600;
}
.desc-segment-rich {
  font-size: 24rpx;
  line-height: 1.75;
  color: #676e80;
}
.desc-rich {
  font-size: 24rpx;
  line-height: 1.75;
  color: #676e80;
}
.desc-scroll {
  height: 360rpx;
  padding-right: 22rpx;
  box-sizing: border-box;
}
.desc-bar {
  position: absolute;
  top: 0;
  right: 0;
  width: 4rpx;
  height: 360rpx;
  background: #ebebec;
  border-radius: 200rpx;
}
.desc-thumb {
  width: 4rpx;
  background: #000000;
  border-radius: 200rpx;
}
.result-card {
  margin-top: 30rpx;
  width: 100%;
  border-radius: 28rpx;
  border: 2rpx solid #ece8f4;
  padding: 28rpx 30rpx 30rpx;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 8rpx 24rpx rgba(40, 50, 72, 0.04);
}
.desc-box + .result-card {
  margin-top: 50rpx;
}
.result-card--clickable {
  position: relative;
  padding-bottom: 64rpx;
}
.result-head {
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.result-icon {
  width: 62rpx;
  height: 62rpx;
  border-radius: 18rpx;
  background: rgba(151, 98, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.result-icon-img {
  width: 46rpx;
  height: 46rpx;
  display: block;
}
.result-title-wrap {
  flex: 1;
  min-width: 0;
}
.result-title {
  display: block;
  font-size: 30rpx;
  line-height: 1.37;
  font-weight: 700;
  color: #1c2130;
}
.result-subtitle {
  display: block;
  margin-top: 2rpx;
  font-size: 20rpx;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.3);
}
.result-body {
  display: block;
  margin-top: 20rpx;
  font-size: 24rpx;
  line-height: 1.75;
  color: #676e80;
}
.result-cta {
  position: absolute;
  right: 30rpx;
  bottom: 22rpx;
  font-size: 24rpx;
  line-height: 1.65;
  color: #999999;
}
.detail-sheet-mask {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(17, 24, 39, 0.48);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 48rpx 28rpx calc(28rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
.detail-sheet {
  width: 100%;
  max-height: 72vh;
  border-radius: 28rpx;
  background: #ffffff;
  padding: 32rpx 28rpx 24rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.detail-sheet-title {
  font-size: 32rpx;
  line-height: 1.4;
  font-weight: 700;
  color: #1c2130;
  text-align: center;
}
.detail-sheet-scroll {
  flex: 1;
  max-height: 52vh;
}
.detail-sheet-body {
  display: block;
  font-size: 26rpx;
  line-height: 1.85;
  color: #676e80;
  white-space: pre-wrap;
  word-break: break-word;
}
.detail-sheet-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  border: none;
  border-radius: 16rpx;
  background: #6b23ff;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 0 #3d0aa8;
}
.detail-sheet-btn::after {
  border: none;
}
.divider {
  margin-top: 40rpx;
  height: 1rpx;
  width: 100%;
  background: #000000;
  opacity: 0.38;
}
.section-head {
  margin-top: 42rpx;
  width: 100%;
}
.section-title {
  display: block;
  font-size: 36rpx;
  line-height: 1.9;
  font-weight: 700;
  color: #1c2130;
}
.section-subtitle {
  display: block;
  margin-top: 2rpx;
  font-size: 24rpx;
  line-height: 1.5;
  color: #676e80;
}
.major-card {
  margin-top: 16rpx;
  width: 100%;
  border-radius: 18rpx;
  overflow: hidden;
  box-shadow: 0 10rpx 24rpx rgba(117, 74, 210, 0.16);
  padding: 20rpx 24rpx 16rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.major-body {
  display: grid;
  grid-template-columns: 58rpx minmax(0, 1fr) 176rpx;
  align-items: center;
  column-gap: 12rpx;
}
.major-rank {
  width: 58rpx;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.major-rank-head {
  position: relative;
  width: 58rpx;
  height: 28rpx;
}
.major-rank-wing {
  position: absolute;
  top: 8rpx;
  width: 20rpx;
  height: 18rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}
.major-rank-wing--l {
  left: 0;
}
.major-rank-wing--r {
  right: 0;
}
.major-rank-wing-img {
  width: 20rpx;
  height: 18rpx;
  display: block;
}
.major-rank-wing-img--mirror {
  transform: scaleX(-1);
}
.major-rank-top {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  font-size: 18rpx;
  line-height: 1;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0;
  flex-shrink: 0;
  white-space: nowrap;
}
.major-rank-num {
  margin-top: 2rpx;
  font-size: 34rpx;
  line-height: 1;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 6rpx rgba(0, 0, 0, 0.25);
}
.major-main {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.major-icon-box {
  width: 58rpx;
  height: 58rpx;
  flex-shrink: 0;
  border-radius: 12rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.94);
  display: flex;
  align-items: center;
  justify-content: center;
}
.major-icon {
  width: 46rpx;
  height: 46rpx;
  display: block;
}
.major-name {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
  line-height: 1.35;
  font-weight: 500;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.major-cta {
  width: 176rpx;
  height: 50rpx;
  background: rgba(255, 255, 255, 0.58);
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10rpx;
  box-sizing: border-box;
  flex-shrink: 0;
}
.major-cta-text {
  font-size: 20rpx;
  line-height: 1.3;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.25);
}
.major-rating {
  width: 100%;
  min-height: 40rpx;
  border-radius: 10rpx;
  background: rgba(255, 255, 255, 0.29);
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 6rpx 18rpx;
  box-sizing: border-box;
}
.major-rating-label {
  font-size: 22rpx;
  line-height: 1.5;
  color: #ffffff;
}
.major-stars {
  display: flex;
  align-items: center;
  gap: 4rpx;
}
.major-star {
  font-size: 22rpx;
  line-height: 1;
  color: #ffbb3b;
}
.major-star--dim {
  color: rgba(255, 187, 59, 0.3);
}
.advice-box {
  margin-top: 20rpx;
  width: 100%;
  min-height: 354rpx;
  border-radius: 28rpx;
  border: 2rpx solid #f0e36a;
  padding: 28rpx 36rpx 70rpx;
  box-sizing: border-box;
  position: relative;
  background: #fffef8;
}
.advice-text {
  display: block;
  font-size: 24rpx;
  line-height: 1.85;
  color: #1c2130;
}
.advice-cta {
  position: absolute;
  right: 36rpx;
  bottom: 20rpx;
  font-size: 24rpx;
  line-height: 1.65;
  color: #999999;
}
.share-card {
  margin-top: 36rpx;
  width: 100%;
  border-radius: 48rpx;
  padding: 36rpx 32rpx 32rpx;
  box-sizing: border-box;
  background: linear-gradient(90deg, #faebab 0%, #fffffc 100%);
  border: 2rpx solid #f6e08a;
  box-shadow: 0 8rpx 24rpx rgba(214, 170, 36, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.share-card-title {
  display: block;
  font-size: 34rpx;
  line-height: 1.4;
  font-weight: 700;
  color: #1c2130;
}
.share-card-desc {
  display: block;
  margin-top: 16rpx;
  max-width: 560rpx;
  font-size: 26rpx;
  line-height: 1.65;
  color: #4b5565;
}
.share-card-button {
  margin-top: 28rpx;
  width: 100%;
  height: 88rpx;
  border: none;
  border-radius: 999rpx;
  background: #f9d54a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  box-shadow: 0 8rpx 0 #d9b52f;
}
.share-card-button-icon {
  width: 36rpx;
  height: 36rpx;
  flex-shrink: 0;
}
.share-card-button-label {
  font-size: 30rpx;
  line-height: 1;
  font-weight: 700;
  color: #1c2130;
}
.share-card-button::after {
  border: none;
}
.report-footer {
  margin-top: 36rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 8rpx;
}
.experience-button {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  border: none;
  border-radius: 16rpx;
  background: #6b23ff;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 700;
  box-shadow: 0 8rpx 0 #3d0aa8;
}
.experience-button[disabled] {
  background: #6b23ff;
  color: #ffffff;
  box-shadow: 0 8rpx 0 #3d0aa8;
  opacity: 1;
  pointer-events: none;
}
.experience-button::after {
  border: none;
}
.bottom-safe { height: 40rpx; }
</style>
