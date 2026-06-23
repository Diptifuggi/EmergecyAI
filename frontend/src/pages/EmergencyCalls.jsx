import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getEmergencies } from '@/api/emergencyApi'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import Card from '@/components/common/Card'
import { Link } from 'react-router-dom'

export default function EmergencyCalls() {
  const [filters, setFilters] = useState({})
  const { data, isLoading, error } = useQuery({ queryKey: ['emergencies', filters], queryFn: () => getEmergencies(filters) })

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <Card title="Emergency Calls">
        <div className="mb-4 flex gap-2">
          <input aria-label="search" placeholder="Search" className="border p-2 rounded" onChange={(e)=>setFilters({...filters, q: e.target.value})} />
          <select onChange={(e)=>setFilters({...filters, priority: e.target.value})} className="border p-2 rounded">
            <option value="">All Priorities</option>
            <option>Critical</option><option>Very High</option><option>High</option><option>Moderate</option><option>Low</option>
          </select>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr><th>Call ID</th><th>Caller</th><th>Category</th><th>Priority</th><th>Location</th><th>Time</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {data?.map(call => (
              <tr key={call.id} className="border-t">
                <td>{call.id}</td>
                <td>{call.caller}</td>
                <td>{call.category}</td>
                <td>{call.priority}</td>
                <td>{call.location}</td>
                <td>{new Date(call.time).toLocaleString()}</td>
                <td>{call.status}</td>
                <td><Link to={`/emergencies/${call.id}`} className="text-blue-600">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
