import axiosClient from '@/api/axiosClient'

export async function getSummary() {
  const resp = await axiosClient.get('/dashboard/summary')
  return resp.data
}

// compatibility alias for older components
export const getDashboard = getSummary

export default { getSummary }
