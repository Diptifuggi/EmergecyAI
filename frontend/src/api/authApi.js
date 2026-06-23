import axiosClient, { tokenStore } from '@/api/axiosClient'

// login(email, password) → POST /auth/login → returns { access_token, refresh_token, expires_in }
export async function login(username, password) {
  // backend expects POST /auth/ with { username, password }
  const resp = await axiosClient.post('/auth/', { username, password })
  return resp.data
}

// logout() → POST /auth/logout → clears tokens locally
export async function logout() {
  try {
    await axiosClient.post('/auth/logout')
  } catch (e) {
    // best-effort
  } finally {
    tokenStore.clearTokens()
  }
}

// refreshToken(token) → POST /auth/refresh → returns { access_token }
export async function refreshToken(token) {
  const resp = await axiosClient.post('/auth/refresh', { refresh_token: token })
  return resp.data
}

// getMe() → GET /auth/me → returns user
export async function getMe() {
  const resp = await axiosClient.get('/auth/me')
  return resp.data
}

// register(name, email, password) → POST /auth/register → returns created user
export async function register(name, email, password) {
  const resp = await axiosClient.post('/auth/register', { name, email, password })
  return resp.data
}

const authApi = { login, logout, refreshToken, getMe, register }
export default authApi
