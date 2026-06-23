import React from 'react'
import PropTypes from 'prop-types'
import { PRIORITY_CONFIG } from '@/lib/constants'

export default function PriorityBadge({ priority = 'low', size = 'default' }){
  const cfg = PRIORITY_CONFIG?.[priority] || { color: '#6b7280', label: priority }
  const sizeClass = size === 'sm' ? 'text-xs py-0.5 px-2' : size === 'md' ? 'text-sm py-1 px-3' : 'text-sm py-1 px-3'
  return (
    <div className={`inline-flex items-center rounded ${sizeClass} bg-white/5 text-white`}>
      <span className="w-2 h-2 rounded-full mr-2" style={{background: cfg.color}} />
      <span>{cfg.label}</span>
    </div>
  )
}

PriorityBadge.propTypes = {
  priority: PropTypes.string,
  size: PropTypes.oneOf(['sm','md','default']),
}
