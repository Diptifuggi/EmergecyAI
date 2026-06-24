import React from 'react'
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

const directionIcon = (dir) => {
  if (dir === 'up') return ArrowUp
  if (dir === 'down') return ArrowDown
  return Minus
}

export default function StatCard({ icon, iconBg = 'bg-gray-100', label, value, delta, deltaDirection = 'neutral' }) {
  const DeltaIcon = directionIcon(deltaDirection)
  const deltaColor = deltaDirection === 'up' ? 'text-green-600' : deltaDirection === 'down' ? 'text-red-600' : 'text-gray-500'

  return (
    <div className="w-full">
      <div className="shadow-sm border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="text-sm text-gray-500 font-medium truncate">{label}</div>
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-3xl font-bold text-gray-900 truncate">{value}</div>
        </div>

        <div className="mt-3 flex items-center text-sm">
          <div className={`inline-flex items-center ${deltaColor} font-medium`}> 
            <DeltaIcon className="w-4 h-4 mr-1" />
            <span>
              {deltaDirection === 'up' ? '↑' : deltaDirection === 'down' ? '↓' : ''} {delta}% since last month
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
