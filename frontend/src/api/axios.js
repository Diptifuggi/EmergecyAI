import axios from 'axios'
import { API_BASE_URL } from '@/lib/constants'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can enhance error handling here (logging, toasts)
    return Promise.reject(error)
  }
)

export default axiosInstance
