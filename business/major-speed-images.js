import { getMajorById } from './explore-data'
import { MAJOR_SPEED_TEMPLATES } from './major-speed-data'
import { asset, resolveAsset } from '../utils/asset-map'

const sim = (path) => asset(`/design/major-sim/${path}`)

const CS_ALGO = sim('cs/foundation/algorithms-data-structures-v1.png')
const CS_SYS = sim('cs/foundation/systems-networks-v1.png')
const AI_TRAIN = sim('ai/foundation/training-loop-v1.png')
const AI_SEARCH = sim('ai/foundation/knowledge-search-v1.png')

function buildCourseMap(courseIds, foundationImage, coreImage) {
  const courses = {}
  courseIds.foundation.forEach((id) => {
    courses[id] = foundationImage
  })
  courseIds.core.forEach((id) => {
    courses[id] = coreImage || foundationImage
  })
  return courses
}

function templateCourseIds(majorId) {
  const blueprint = MAJOR_SPEED_TEMPLATES[majorId]
  if (!blueprint) return { foundation: [], core: [] }
  return {
    foundation: blueprint.foundationCourses.map((c) => c.id),
    core: blueprint.coreCourses.map((c) => c.id),
  }
}

function branchMap(majorId, images) {
  const blueprint = MAJOR_SPEED_TEMPLATES[majorId]
  if (!blueprint) return {}
  const entries = blueprint.branches.map((branch, index) => [branch.id, images[index] || images[0]])
  return Object.fromEntries(entries)
}

const MAJOR_IMAGE_PACKS = {
  'ai-u': {
    overview: sim('ai/generated/ai-overview-hero-v2.png'),
    courseMap: sim('ai/generated/ai-course-map-v2.png'),
    deepStart: sim('ai/generated/ai-deep-start-v1.png'),
    branching: sim('ai/generated/ai-branching-routes-v2.png'),
    courses: {
      'ai-math-stat-optimization': sim('ai/generated/ai-course-math-foundation-v1.png'),
      'ai-cs-data-foundation': sim('ai/generated/ai-course-data-experiment-v1.png'),
      'ai-problem-formalization': sim('ai/generated/ai-course-principles-knowledge-v1.png'),
      'ai-ml-dl': sim('ai/generated/ai-course-machine-learning-v1.png'),
      'ai-rl-robotics': sim('ai/generated/ai-course-rl-embodied-v1.png'),
      'ai-llm-agent-eval-safety': sim('ai/generated/ai-course-deep-learning-v1.png'),
    },
    branches: {
      'ai-agent': sim('ai/generated/ai-branch-infra-v1.png'),
      'ai-research': sim('ai/generated/ai-branch-theory-v1.png'),
      'ai-embodied': sim('ai/generated/ai-branch-embodied-v1.png'),
      'ai-safety-industry': sim('ai/generated/ai-branch-applications-v1.png'),
    },
  },
  'physics-u': {
    overview: sim('physics/foundation/mechanics-model-cn-v2.png'),
    courseMap: sim('physics/foundation/electromagnetism-overview-cn-v2.png'),
    deepStart: sim('physics/deep/latex-model/deep-quantum-mechanics-v1.png'),
    branching: sim('physics/foundation/optics-overview-cn-v2.png'),
    courses: {
      'physics-mech-em-math': sim('physics/foundation/mechanics-model-cn-v2.png'),
      'physics-thermal-stat-quantum': sim('physics/foundation/thermal-micro-macro-cn-v2.png'),
      'physics-experiment-computation-uncertainty': sim('physics/foundation/optics-overview-cn-v2.png'),
      'physics-classical-ed-quantum': sim('physics/deep/latex-model/deep-analytical-mechanics-v1.png'),
      'physics-stat-condensed-material': sim('physics/deep/latex-model/deep-statistical-physics-v1.png'),
      'physics-experiment-big-science-qi': sim('physics/deep/latex-model/topic-particle-invariant-mass-v1.png'),
    },
    branches: {
      'physics-condensed-quantum-material': sim('physics/deep/latex-model/topic-band-conductor-insulator-v1.png'),
      'physics-particle-cosmos-data': sim('physics/deep/latex-model/topic-particle-invariant-mass-v1.png'),
      'physics-photonics-instrument': sim('physics/foundation/optics-applications-cn-v2.png'),
      'physics-computational-data': sim('physics/deep/latex-model/topic-ising-monte-carlo-v1.png'),
    },
  },
  'cs-u': {
    overview: CS_ALGO,
    courseMap: CS_SYS,
    deepStart: sim('cs/generated/cs-branch-software-theory-v1.png'),
    branching: sim('cs/generated/cs-branch-systems-architecture-v1.png'),
    courses: buildCourseMap(templateCourseIds('cs-u'), CS_ALGO, CS_SYS),
    branches: {
      'cs-infra': sim('cs/generated/cs-branch-systems-architecture-v1.png'),
      'cs-security': sim('cs/generated/cs-branch-security-v1.png'),
      'cs-ai-data': sim('cs/generated/cs-branch-applications-v1.png'),
      'cs-hci-pl': sim('cs/generated/cs-branch-software-theory-v1.png'),
    },
  },
  'finance-u': {
    courses: buildCourseMap(templateCourseIds('finance-u'), CS_ALGO, CS_SYS),
    branches: branchMap('finance-u', [CS_SYS, CS_ALGO]),
  },
  'econ-u': {
    courses: buildCourseMap(templateCourseIds('econ-u'), AI_SEARCH, AI_TRAIN),
    branches: branchMap('econ-u', [AI_SEARCH, AI_TRAIN]),
  },
  'actuarial-u': {
    courses: buildCourseMap(templateCourseIds('actuarial-u'), AI_TRAIN, AI_SEARCH),
    branches: branchMap('actuarial-u', [AI_TRAIN, AI_SEARCH]),
  },
  'chem-u': {
    courses: buildCourseMap(templateCourseIds('chem-u'), CS_ALGO, CS_SYS),
    branches: branchMap('chem-u', [CS_ALGO, CS_SYS]),
  },
  'mech-u': {
    courses: buildCourseMap(templateCourseIds('mech-u'), CS_SYS, CS_ALGO),
    branches: branchMap('mech-u', [CS_SYS, CS_ALGO]),
  },
  'ee-u': {
    courses: buildCourseMap(templateCourseIds('ee-u'), CS_SYS, CS_ALGO),
    branches: branchMap('ee-u', [CS_SYS, CS_ALGO]),
  },
  'ic-u': {
    courses: buildCourseMap(templateCourseIds('ic-u'), CS_ALGO, CS_SYS),
    branches: branchMap('ic-u', [CS_ALGO, CS_SYS]),
  },
}

function fallbackHero(majorId) {
  const major = getMajorById(majorId)
  const fallback = asset('/images/explore/discover/stage-hero-major-clean.png')
  if (!major) return fallback
  if (major.heroImage) return resolveAsset(major.heroImage)
  const mediaImage = (major.media || []).find((item) => item.type === 'image')
  return mediaImage ? resolveAsset(mediaImage.url) : fallback
}

export function getMajorSpeedImage(majorId, slot, key) {
  const pack = MAJOR_IMAGE_PACKS[majorId] || {}
  if (slot === 'overview') return pack.overview || fallbackHero(majorId)
  if (slot === 'courseMap') return pack.courseMap || fallbackHero(majorId)
  if (slot === 'deepStart') return pack.deepStart || fallbackHero(majorId)
  if (slot === 'branching') return pack.branching || fallbackHero(majorId)
  if (slot === 'course') return (pack.courses && pack.courses[key]) || fallbackHero(majorId)
  if (slot === 'branch') return (pack.branches && pack.branches[key]) || fallbackHero(majorId)
  return fallbackHero(majorId)
}
