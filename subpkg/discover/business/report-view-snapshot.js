const SNAPSHOT_PREFIX = 'uniprism.reportViewSnapshot'

function buildSnapshotKey(sessionId, reportId) {
  return `${SNAPSHOT_PREFIX}.${sessionId}.${reportId}`
}

export function saveReportViewSnapshot(snapshot) {
  if (!snapshot || !snapshot.sessionId || !snapshot.reportId) return
  try {
    uni.setStorageSync(buildSnapshotKey(snapshot.sessionId, snapshot.reportId), {
      version: 1,
      savedAt: Date.now(),
      ...snapshot,
    })
  } catch (error) {
    // ignore storage failures
  }
}

export function readReportViewSnapshot(sessionId, reportId) {
  if (!sessionId || !reportId) return null
  try {
    const cached = uni.getStorageSync(buildSnapshotKey(sessionId, reportId))
    if (!cached || typeof cached !== 'object') return null
    if (cached.sessionId !== sessionId || cached.reportId !== reportId) return null
    return cached
  } catch (error) {
    return null
  }
}

export function clearReportViewSnapshot(sessionId, reportId) {
  if (!sessionId || !reportId) return
  try {
    uni.removeStorageSync(buildSnapshotKey(sessionId, reportId))
  } catch (error) {
    // ignore
  }
}
