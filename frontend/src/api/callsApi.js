import axiosClient from '@/api/axiosClient'

export async function listCalls(params = {}) {
  const resp = await axiosClient.get('/calls', { params })
  return resp.data
}

export async function getCall(id) {
  const resp = await axiosClient.get(`/calls/${id}`)
  return resp.data
}

export async function createCall(data) {
  const resp = await axiosClient.post('/calls', data)
  return resp.data
}

export async function updateCall(id, data) {
  const resp = await axiosClient.patch(`/calls/${id}`, data)
  return resp.data
}

export async function deleteCall(id) {
  const resp = await axiosClient.delete(`/calls/${id}`)
  return resp.data
}

export async function uploadAudio(callId, file, onUploadProgress) {
  const form = new FormData()
  form.append('file', file)
  const resp = await axiosClient.post(`/uploads/audio/${callId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
  return resp.data
}

export async function getPipelineStatus(callId) {
  const resp = await axiosClient.get(`/uploads/status/${callId}`)
  return resp.data
}

export async function runPipeline(callId) {
  const resp = await axiosClient.post(`/pipeline/run/${callId}`)
  return resp.data
}

export default {
  listCalls,
  getCall,
  createCall,
  updateCall,
  deleteCall,
  uploadAudio,
  getPipelineStatus,
  runPipeline,
}
