import React from 'react'
import PropTypes from 'prop-types'

export default function EmptyState({ icon: Icon, title, description, action }){
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center text-center text-gray-600">
      {Icon && <Icon className="w-12 h-12 text-gray-400 mb-3" />}
      <div className="text-base font-medium">{title}</div>
      <div className="text-sm text-gray-500 mt-1">{description}</div>
      {action && (
        <div className="mt-4">
          <button onClick={action.onClick} className="px-4 py-2 bg-black text-white rounded">{action.label}</button>
        </div>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.shape({ label: PropTypes.string, onClick: PropTypes.func }),
}
