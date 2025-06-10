"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

type AuthContextType = {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  createAccount: (email: string, password: string, name: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Set to false by default to show login screen
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (email: string, password: string) => {
    // Always succeed immediately without validation
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    // For testing, we'll still allow logout
    setIsAuthenticated(false)
  }

  const createAccount = async (email: string, password: string, name: string) => {
    // Always succeed immediately without validation
    setIsAuthenticated(true)
    return true
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, createAccount }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
