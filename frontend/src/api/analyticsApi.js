import axios from './axios'

export async function getAnalytics() {
  const resp = await axios.get('/analytics')
  return resp.data
}
