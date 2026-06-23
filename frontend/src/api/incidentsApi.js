import axiosClient from '@/api/axiosClient'

export async function listIncidents(params = {}) {
  const resp = await axiosClient.get('/incidents', { params })
  return resp.data
}

export async function getIncident(id) {
  const resp = await axiosClient.get(`/incidents/${id}`)
  return resp.data
}

export async function closeIncident(id) {
  const resp = await axiosClient.patch(`/incidents/${id}/close`)
  return resp.data
}

export async function createDispatch(incidentId, data) {
  const resp = await axiosClient.post(`/incidents/${incidentId}/dispatch`, data)
  return resp.data
}

export default {
  listIncidents,
  getIncident,
  closeIncident,
  createDispatch,
}
