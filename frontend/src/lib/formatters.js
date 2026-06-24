import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(iso) {
  if (!iso) return '—'
  try { return format(new Date(iso), 'dd LLL yyyy, HH:mm') } catch { return iso }
}

export function formatDateAgo(iso) {
  if (!iso) return '—'
  try { return formatDistanceToNow(new Date(iso), { addSuffix: true }) } catch { return '—' }
}

export function formatUUID(uuid) {
  if (!uuid) return '—'
  return uuid.toString().slice(0,8) + '...'
}

export function formatScore(n) { return typeof n === 'number' ? n.toFixed(1) : '—' }

export function formatFileSize(bytes){
  if (!bytes && bytes !== 0) return '—'
  const units = ['B','KB','MB','GB']
  let i = 0
  let v = bytes
  while (v >= 1024 && i < units.length-1) { v /= 1024; i++ }
  return `${v.toFixed(1)} ${units[i]}`
}

export function formatDuration(secs){
  if (!secs && secs !== 0) return '—'
  const m = Math.floor(secs/60); const s = Math.floor(secs%60)
  return `${m}m ${s}s`
}

export function getScoreColor(score){
  if (score >= 90) return '#b91c1c' // critical
  if (score >= 75) return '#ea580c' // very high
  if (score >= 50) return '#f59e0b' // high
  if (score >= 25) return '#10b981' // moderate
  return '#3b82f6' // low
}

const formatters = {
  formatDate,
  formatDateAgo,
  formatUUID,
  formatScore,
  formatFileSize,
  formatDuration,
  getScoreColor,
}

export default formatters
