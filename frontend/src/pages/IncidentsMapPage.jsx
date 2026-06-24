import React, { useMemo, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import axiosClient from '@/api/axiosClient'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix default icon paths for Leaflet in many bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const INDIA_CENTER = [20.5937, 78.9629]

function createPriorityMarker(priority) {
  const color = priority === 'Critical' ? '#dc2626' : priority === 'Very High' ? '#f97316' : priority === 'High' ? '#f59e0b' : priority === 'Moderate' ? '#16a34a' : '#3b82f6'
  const html = `
    <div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);background:${color};border:2px solid #fff"></div>
  `
  return L.divIcon({ html, className: '', iconSize: [40, 40], iconAnchor: [20, 40], popupAnchor: [0, -40] })
}

function FlyToMarker({ position }) {
  const map = useMap()
  if (position) {
    map.flyTo(position, 12, { duration: 0.8 })
  }
  return null
}

export default function IncidentsMapPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = React.useState(null)
  const [selectedPos, setSelectedPos] = React.useState(null)
  const [statusFilter, setStatusFilter] = React.useState('All')

  const { data, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: async () => {
      const resp = await axiosClient.get('/incidents')
      return resp.data
    },
    refetchInterval: 30000,
  })

  const incidents = Array.isArray(data) ? data : []

  const active = incidents.find(i => i.id === selectedId) || incidents[0] || null

  return (
    <div className="min-h-screen grid grid-cols-[340px_1fr]">
      <aside className="bg-white border-r overflow-auto h-screen sticky top-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Incidents</h2>
            <div className="px-2 py-1 bg-gray-200 rounded text-sm">{incidents.length}</div>
          </div>

          <div className="mb-3">
            <div className="flex space-x-2">
              {['All','Open','Assigned','Resolved'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1 rounded ${statusFilter===s? 'bg-zinc-900 text-white' : ''}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <input placeholder="Search title, category, location" className="w-full p-2 border rounded" />
          </div>

          <div className="space-y-2">
            {isLoading ? (
              new Array(8).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))
            ) : (
              incidents
                .filter(it => (statusFilter==='All' ? true : (it.status || 'Open') === statusFilter))
                .filter(it => it.latitude !== null && it.longitude !== null)
                .map((inc) => {
                const priority = inc.priority || 'Low'
                const colorClass = priority === 'Critical' ? 'bg-red-600' : priority === 'Very High' ? 'bg-orange-600' : priority === 'High' ? 'bg-amber-500' : priority === 'Moderate' ? 'bg-green-500' : 'bg-blue-500'
                return (
                  <div key={inc.id} onClick={() => { setSelectedId(inc.id); setSelectedPos([inc.latitude, inc.longitude]); navigate(`/incidents/${inc.id}`) }} className={`flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer ${selectedId === inc.id ? 'bg-zinc-50 border-r-2 border-r-zinc-900' : ''}`}>
                    <div style={{ width: 8, height: 32, background: colorClass }} className="mr-3 rounded-sm" />
                    <div className="flex-1">
                      <div className="truncate font-medium">{inc.title || 'Untitled'}</div>
                      <div className="text-xs text-gray-500">{inc.call_count || 0} calls • {inc.updated_at ? new Date(inc.updated_at).toLocaleString() : '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{inc.severity_score ?? '—'}</div>
                      <div className="text-xs text-gray-500">{inc.priority || '—'}</div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </aside>

      <main className="h-screen">
        <MapContainer center={INDIA_CENTER} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {incidents
            .filter(it => (statusFilter==='All' ? true : (it.status || 'Open') === statusFilter))
            .filter(it => it.latitude !== null && it.longitude !== null)
            .map((inc) => (
            <Marker key={inc.id} position={[inc.latitude, inc.longitude]} icon={createPriorityMarker(inc.priority)} eventHandlers={{ click: (e) => { const map = e.target._map; map.flyTo([inc.latitude, inc.longitude], 12); setSelectedId(inc.id); setSelectedPos([inc.latitude, inc.longitude]) } }}>
              <Popup>
                <div className="w-64">
                  <div className="font-medium truncate">{inc.title}</div>
                  <div className="text-sm text-gray-600">{inc.category}</div>
                  <div className="mt-2">Calls: {inc.call_count || 0}</div>
                  <div className="mt-2">Severity: {inc.severity_score ?? '—'}</div>
                  <div className="mt-3"><button onClick={() => navigate(`/incidents/${inc.id}`)} className="px-3 py-1 bg-zinc-900 text-white rounded">View Incident</button></div>
                </div>
              </Popup>
            </Marker>
          ))}
          {selectedPos ? <FlyToMarker position={selectedPos} /> : null}
        </MapContainer>
      </main>
    </div>
  )
}
