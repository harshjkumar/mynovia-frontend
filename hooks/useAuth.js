'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { login as apiLogin, getMe } from '@/lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = localStorage.getItem('mynovia_token')
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const userData = await getMe()
      setUser(userData)
    } catch (err) {
      localStorage.removeItem('mynovia_token')
    }
    setLoading(false)
  }

  async function login(email, password) {
    const resp = await apiLogin(email, password)
    localStorage.setItem('mynovia_token', resp.token)
    setUser(resp.user)
    return resp
  }

  function logout() {
    localStorage.removeItem('mynovia_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
