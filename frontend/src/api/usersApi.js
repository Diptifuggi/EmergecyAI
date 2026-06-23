import axiosClient from '@/api/axiosClient'

export async function listUsers(params = {}) {
  const resp = await axiosClient.get('/users', { params })
  return resp.data
}

export async function createUser(data) {
  const resp = await axiosClient.post('/users', data)
  return resp.data
}

export async function updateUser(id, data) {
  const resp = await axiosClient.patch(`/users/${id}`, data)
  return resp.data
}

export async function listRoles() {
  const resp = await axiosClient.get('/roles')
  return resp.data
}

export default {
  listUsers,
  createUser,
  updateUser,
  listRoles,
}
