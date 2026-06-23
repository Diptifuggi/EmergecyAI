import React from 'react'
import PropTypes from 'prop-types'

export default function StatusBadge({ status = 'Pending' }){
  const s = (status || '').toLowerCase()
  const cls = s === 'assigned' || s === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${cls}`}>{status}</span>
  )
}

StatusBadge.propTypes = { status: PropTypes.string }
