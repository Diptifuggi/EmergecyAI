import axios from 'axios'
import { API_BASE_URL } from '@/lib/constants'

// In-memory token store (not localStorage — documented security tradeoff for academic project)
export const tokenStore = {
  accessToken: null,
  refreshToken: null,
  setTokens(access, refresh) { this.accessToken = access; this.refreshToken = refresh },
  clearTokens() { this.accessToken = null; this.refreshToken = null },
}

const axiosClient = axios.create({ baseURL: API_BASE_URL })

// REQUEST: attach Bearer token from tokenStore
axiosClient.interceptors.request.use(config => {
  if (tokenStore.accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${tokenStore.accessToken}`
  }
  return config
})

// RESPONSE: on 401 attempt silent refresh once, then retry original request
// If refresh fails: clearTokens + redirect to /login
// Never retry 401 responses from /auth/refresh itself (prevents infinite loop)
let isRefreshing = false
let failQueue = []
axiosClient.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config || {}
    const status = err.response?.status
    if (status === 401 && !orig._retry && !(orig.url || '').includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failQueue.push({ resolve, reject })
        }).then(token => {
          orig.headers = orig.headers || {}
          orig.headers.Authorization = `Bearer ${token}`
          return axiosClient(orig)
        })
      }
      orig._retry = true
      isRefreshing = true
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: tokenStore.refreshToken
        })
        const newToken = res.data.access_token
        tokenStore.accessToken = newToken
        failQueue.forEach(p => p.resolve(newToken))
        failQueue = []
        orig.headers = orig.headers || {}
        orig.headers.Authorization = `Bearer ${newToken}`
        return axiosClient(orig)
      } catch (e) {
        failQueue.forEach(p => p.reject(e))
        failQueue = []
        tokenStore.clearTokens()
        window.location.href = '/login'
        return Promise.reject(e)
      } finally { isRefreshing = false }
    }
    return Promise.reject(err)
  }
)

export default axiosClient
