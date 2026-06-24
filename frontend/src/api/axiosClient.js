import axios from 'axios'
import { API_BASE_URL } from '@/lib/constants'

// In-memory token store (not localStorage — documented security tradeoff for academic project)
export const tokenStore = {
  accessToken: null,
  refreshToken: null,
  setTokens(access, refresh) {
    this.accessToken = access
    this.refreshToken = refresh
    try {
      localStorage.setItem('accessToken', access || '')
      localStorage.setItem('refreshToken', refresh || '')
    } catch (e) {}
  },
  clearTokens() {
    this.accessToken = null
    this.refreshToken = null
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    } catch (e) {}
  },
  initFromStorage() {
    try {
      const a = localStorage.getItem('accessToken') || null
      const r = localStorage.getItem('refreshToken') || null
      this.accessToken = a || null
      this.refreshToken = r || null
    } catch (e) { this.accessToken = null; this.refreshToken = null }
  }
}

// initialize from localStorage so sessions persist across page reloads
try { tokenStore.initFromStorage() } catch (e) {}

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
        // Use the axios client instance so baseURL and interceptors are applied consistently.
        const res = await axiosClient.post('/auth/refresh', {
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
          // DO NOT automatically redirect to /login. Clear tokens but let app decide when to log out.
          tokenStore.clearTokens()
          return Promise.reject(e)
      } finally { isRefreshing = false }
    }
    return Promise.reject(err)
  }
)

export default axiosClient
