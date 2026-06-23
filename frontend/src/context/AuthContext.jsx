import React, { createContext, useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import * as authApi from '@/api/authApi'
import { tokenStore } from '@/api/axiosClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  async function login(usernameOrEmail, password) {
    const data = await authApi.login(usernameOrEmail, password)
    // expected { access_token, refresh_token }
    tokenStore.setTokens(data.access_token, data.refresh_token || null)
    let me = null
    try {
      me = await authApi.getMe()
    } catch (e) {
      // backend may not implement /auth/me; fall back to a minimal user
      me = { username: usernameOrEmail, email: null }
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
      if (tokenStore.refreshToken) {
        try {
          const res = await authApi.refreshToken(tokenStore.refreshToken)
          tokenStore.accessToken = res.access_token
          const me = await authApi.getMe()
          if (mounted) setUser(me)
        } catch (e) {
          tokenStore.clearTokens()
          if (mounted) setUser(null)
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
