import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axiosClient from '@/api/axiosClient'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow })

import { SOP_ACTIONS, DEPARTMENTS } from '@/lib/constants'
import formatters from '@/lib/formatters'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Textarea,
  Input,
  Select,
  Skeleton,
} from '@/components/ui'

export default function IncidentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [dept, setDept] = useState(DEPARTMENTS[0] || '')
  const [officer, setOfficer] = useState('')

  const { data: incident, isLoading } = useQuery({
    queryKey: ['incident', id],
    queryFn: async () => { const resp = await axiosClient.get(`/incidents/${id}`); return resp.data },
    enabled: !!id,
  })

  const related = useQuery({ queryKey: ['incident', id, 'calls'], queryFn: async () => { const resp = await axiosClient.get(`/incidents/${id}/calls`); return resp.data }, enabled: !!id })

  const dispatchMut = useMutation({ mutationFn: async (payload) => { await axiosClient.post(`/incidents/${id}/dispatch`, payload) }, onSuccess: () => qc.invalidateQueries(['incident', id]) })

  const similarityLabel = (v) => v >= 0.9 ? 'Very Similar' : v >= 0.75 ? 'Similar' : 'Possibly Related'
  const similarityClass = (v) => v >= 0.9 ? 'bg-zinc-900 text-white' : v >= 0.75 ? 'bg-zinc-600 text-white' : 'bg-zinc-400 text-black'

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        <a href="/incidents">Incidents</a>
        <span>&gt;</span>
        <div>Incident #{id}</div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div>
          <Card>
            <CardContent>
              {isLoading ? <Skeleton className="h-24" /> : (
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold truncate">{incident?.title || 'Untitled'}</div>
                      <div className="text-sm text-gray-500">{incident?.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{incident?.severity_score ?? '—'}</div>
                      <div className="text-sm">{incident?.priority || '—'}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardHeader><CardTitle>Related Emergency Calls</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-2">Grouped by semantic similarity using pgvector cosine distance (≥0.75 threshold)</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Caller</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Similarity</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Transcript</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(related.data || []).map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.caller_name}</TableCell>
                        <TableCell>{formatters.formatDate(c.received_at)}</TableCell>
                        <TableCell>
                          <div className={`inline-block px-2 py-1 rounded ${similarityClass(c.similarity ?? 0)}`}>{(c.similarity || 0).toFixed(2)}</div>
                          <div className="w-full bg-gray-200 h-2 mt-1"><div style={{ width: `${(c.similarity||0)*100}%` }} className="h-2 bg-zinc-900" /></div>
                        </TableCell>
                        <TableCell>{c.priority}</TableCell>
                        <TableCell>{(c.transcript || '').slice(0,120)}{(c.transcript || '').length > 120 ? '…' : ''}</TableCell>
                        <TableCell><Button size="sm" onClick={()=>navigate(`/calls/${c.id}`)}>View</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="mt-4 bg-zinc-50 border border-zinc-200 p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <div className="font-semibold">How incident correlation works</div>
                  <div className="text-sm mt-2">Each transcript is converted to a 384-dimensional semantic vector using BAAI/bge-small-en-v1.5.
                  Calls are grouped when cosine similarity ≥ 0.75 AND received within 6 hours.
                  This identifies duplicate reports of the same incident automatically — a primary research contribution of EmergencyIQ.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Severity Summary</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-24" /> : (
                <div className="text-center">
                  <div className="text-4xl font-extrabold">{formatters.formatScore(incident?.severity_score || 0)} / 100</div>
                  <div className="mt-2">Priority: {incident?.priority}</div>
                  <div className="mt-1 text-sm text-gray-500">Calls: {incident?.call_count || 0}</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Active Dispatches</CardTitle></CardHeader>
            <CardContent>
              {(incident?.dispatches || []).length === 0 ? <div>No active dispatches</div> : (
                <div>
                  {(incident.dispatches || []).map((d) => (
                    <div key={d.id} className="flex items-center justify-between py-2">
                      <div>
                        <div className="text-sm font-medium">{d.department}</div>
                        <div className="text-xs text-gray-500">{d.officer}</div>
                      </div>
                      <div className="text-xs text-gray-500">{formatters.formatDate(d.dispatched_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Incident Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(incident?.timeline || []).map((ev,i) => (
                  <div key={i} className="text-sm">
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-xs text-gray-500">{formatters.formatDate(ev.time)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Mini Map</CardTitle></CardHeader>
            <CardContent>
              {incident?.latitude && incident?.longitude ? (
                <MapContainer center={[incident.latitude, incident.longitude]} zoom={13} style={{ height: 220, width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[incident.latitude, incident.longitude]} />
                </MapContainer>
              ) : <div>No location data</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Add Dispatch</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-2">
                <label className="block text-sm">Department</label>
                <select value={dept} onChange={(e)=>setDept(e.target.value)} className="w-full p-2 border rounded">{DEPARTMENTS.map(d=>(<option key={d} value={d}>{d}</option>))}</select>
              </div>
              <div className="mb-2"><label className="block text-sm">Officer</label><input value={officer} onChange={(e)=>setOfficer(e.target.value)} className="w-full p-2 border rounded" /></div>
              <div className="flex space-x-2"><Button onClick={()=>dispatchMut.mutate({ department: dept, officer })}>Dispatch</Button><Button variant="secondary" onClick={()=>navigate('/incidents')}>Close</Button></div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
