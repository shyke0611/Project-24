"use client"

import { createContext, useState, useContext, type ReactNode } from "react"
import { authAPI } from "../services/api"

type AuthContextType = {
  isAuthenticated: boolean
  user: any | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  createAccount: (username: string, password: string) => Promise<boolean>
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authAPI.login(username, password)
      setIsAuthenticated(true)
      setUser({ id: response.id, username: response.username })
      return true
    } catch (err: any) {
      setError(err.response?.data || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  const createAccount = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await authAPI.register(username, password)
      setIsAuthenticated(true)
      setUser({ id: response.id, username: response.username })
      return true
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      createAccount, 
      loading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
