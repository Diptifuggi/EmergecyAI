import axios from './axios'

export async function createDispatch(payload) {
  const resp = await axios.post('/dispatch', payload)
  return resp.data
}

export async function updateDispatch(id, payload) {
  const resp = await axios.put(`/dispatch/${id}`, payload)
  return resp.data
}
