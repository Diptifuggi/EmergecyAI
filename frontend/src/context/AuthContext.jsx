import React, { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import * as authApi from '@/api/authApi'
import { tokenStore } from '@/api/axiosClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  async function login(email, password) {
    const data = await authApi.login(email, password)
    // expected { access_token, refresh_token, expires_in }
    tokenStore.setTokens(data.access_token, data.refresh_token || null)
    let me = null
    try {
      me = await authApi.getMe()
    } catch (e) {
      // backend may not implement /auth/me; fall back to a minimal user
      me = { email, username: email.split('@')[0] }
    }
    setUser(me)
    return me
  }

  async function logout() {
    try { await authApi.logout() } catch(e) {}
    tokenStore.clearTokens()
    setUser(null)
  }

  useEffect(() => {
    let mounted = true
    async function restore() {
      // If we have a refresh token persisted, try to refresh and load current user.
      // If refresh fails, DO NOT automatically clear tokens or log the user out —
      // the app will stay on the current page until the user explicitly logs out.
      if (tokenStore.refreshToken) {
        try {
          const res = await authApi.refreshToken(tokenStore.refreshToken)
          tokenStore.setAccessToken(res.access_token)
          if (res.refresh_token) {
            tokenStore.setRefreshToken(res.refresh_token)
          }
          const me = await authApi.getMe()
          if (mounted) setUser(me)
        } catch (e) {
          // keep tokens as-is (they may be expired); do not clear or force logout here
          // the app may show limited functionality until the user re-authenticates.
          console.warn('Auth restore: refresh failed, keeping tokens until explicit logout')
        }
      }
      if (mounted) setIsLoading(false)
    }
    restore()
    return () => { mounted = false }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = { children: PropTypes.node }

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
