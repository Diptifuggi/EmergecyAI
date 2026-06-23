import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEmergency } from '@/api/emergencyApi'
import Loading from '@/components/common/Loading'
import ErrorMessage from '@/components/common/ErrorMessage'
import Card from '@/components/common/Card'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

export default function EmergencyDetails() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({ queryKey: ['emergency', id], queryFn: () => getEmergency(id), enabled: !!id })

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Emergency #{data.id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Caller Information">
          <div><strong>Name:</strong> {data.caller}</div>
          <div><strong>Phone:</strong> {data.phone}</div>
        </Card>

        <Card title="Priority & AI Analysis">
          <div><strong>Priority:</strong> {data.priority}</div>
          <div><strong>Priority Score:</strong> {data.priority_score}</div>
          <div className="mt-2"><strong>AI Notes:</strong><p>{data.ai_notes}</p></div>
        </Card>

        <Card title="Location Map">
          <div className="h-48">
            <MapContainer center={[data.location.lat, data.location.lng]} zoom={13} style={{height:'100%'}}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[data.location.lat, data.location.lng]}>
                <Popup>{data.location.text}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Transcript">
          <pre className="whitespace-pre-wrap">{data.transcript}</pre>
        </Card>
      </div>
    </div>
  )
}
