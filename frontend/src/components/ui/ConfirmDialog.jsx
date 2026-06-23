import React from 'react'
import PropTypes from 'prop-types'

export default function ConfirmDialog({ open, onOpenChange, title, description, onConfirm, confirmLabel = 'Confirm', destructive = false }){
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={()=> onOpenChange(false)} />
      <div className="bg-white p-6 rounded shadow z-10 w-full max-w-md">
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-sm text-gray-600 mt-2">{description}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={()=> onOpenChange(false)} className="px-3 py-1 border rounded">Cancel</button>
          <button onClick={()=> { onConfirm(); onOpenChange(false) }} className={`px-3 py-1 rounded ${destructive ? 'bg-red-600 text-white' : 'bg-black text-white'}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onOpenChange: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmLabel: PropTypes.string,
  destructive: PropTypes.bool,
}
