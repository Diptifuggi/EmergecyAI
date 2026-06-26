import axiosClient, { tokenStore } from '@/api/axiosClient'

// login(email, password) → POST /auth/login → returns { access_token, refresh_token, expires_in }
export async function login(email, password) {
  // backend expects POST /auth/login with { email, password }
  const resp = await axiosClient.post('/auth/login', { email, password })
  const data = resp.data
  
  // Store tokens
  if (data.access_token) {
    tokenStore.setAccessToken(data.access_token)
  }
  if (data.refresh_token) {
    tokenStore.setRefreshToken(data.refresh_token)
  }
  
  return data
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

// refreshToken(token) → POST /auth/refresh → returns { access_token, refresh_token, expires_in }
export async function refreshToken(refreshTokenValue) {
  const resp = await axiosClient.post('/auth/refresh', { refresh_token: refreshTokenValue })
  const data = resp.data
  
  // Store new tokens
  if (data.access_token) {
    tokenStore.setAccessToken(data.access_token)
  }
  if (data.refresh_token) {
    tokenStore.setRefreshToken(data.refresh_token)
  }
  
  return data
}

// getMe() → GET /auth/me → returns user
export async function getMe() {
  const resp = await axiosClient.get('/auth/me')
  return resp.data
}

// register(username, email, password) → POST /auth/register → returns created user
export async function register(username, email, password) {
  const resp = await axiosClient.post('/auth/register', { username, email, password })
  return resp.data
}

// changePassword(oldPassword, newPassword, confirmPassword) → POST /auth/change-password
export async function changePassword(oldPassword, newPassword, confirmPassword) {
  const resp = await axiosClient.post('/auth/change-password', {
    old_password: oldPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  })
  return resp.data
}

const authApi = { login, logout, refreshToken, getMe, register, changePassword }
export default authApi
