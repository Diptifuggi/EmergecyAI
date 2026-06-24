export const PRIORITY_CONFIG = {
  Critical: { color: '#b91c1c', label: 'Critical', rank: 5 },
  'Very High': { color: '#ea580c', label: 'Very High', rank: 4 },
  High: { color: '#f59e0b', label: 'High', rank: 3 },
  Moderate: { color: '#10b981', label: 'Moderate', rank: 2 },
  Low: { color: '#3b82f6', label: 'Low', rank: 1 },
}

export function getPriorityLevel(score){
  if (typeof score !== 'number') return 'Low'
  if (score >= 81) return 'Critical'
  if (score >= 61) return 'Very High'
  if (score >= 41) return 'High'
  if (score >= 21) return 'Moderate'
  return 'Low'
}

export function getPriorityConfig(level){
  return PRIORITY_CONFIG[level] || PRIORITY_CONFIG['Low']
}

export default { PRIORITY_CONFIG, getPriorityLevel, getPriorityConfig }
