import { readStorage, writeStorage } from './storage'

const EXPLORE_PROGRESS_KEY = 'uniprism.mini.exploreProgress'

export const emptyExploreProgress = {
  majorsExplored: [],
  careersExplored: [],
  selectedMajorId: '',
  selectedCareerId: '',
}

export function loadExploreProgress() {
  return readStorage(EXPLORE_PROGRESS_KEY, emptyExploreProgress)
}

export function saveExploreProgress(progress) {
  writeStorage(EXPLORE_PROGRESS_KEY, {
    ...emptyExploreProgress,
    ...progress,
    majorsExplored: Array.from(new Set(progress.majorsExplored || [])),
    careersExplored: Array.from(new Set(progress.careersExplored || [])),
  })
}

export function markMajorExplored(majorId) {
  const progress = loadExploreProgress()
  const majorsExplored = Array.from(new Set([...(progress.majorsExplored || []), majorId]))
  saveExploreProgress({ ...progress, majorsExplored, selectedMajorId: majorId })
}

export function markCareerExplored(careerId) {
  const progress = loadExploreProgress()
  const careersExplored = Array.from(new Set([...(progress.careersExplored || []), careerId]))
  saveExploreProgress({ ...progress, careersExplored, selectedCareerId: careerId })
}

export function setCareerWorkspaceSelection({ selectedMajorId, selectedCareerId }) {
  const progress = loadExploreProgress()
  const next = { ...progress }
  if (selectedMajorId) next.selectedMajorId = selectedMajorId
  if (selectedCareerId) next.selectedCareerId = selectedCareerId
  saveExploreProgress(next)
}
