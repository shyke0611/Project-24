"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

type UserRole = "elderly" | "caregiver" | null

type UserRoleContextType = {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

export const UserRoleProvider = ({ children }: { children: ReactNode }) => {
  // Set to null by default to trigger role selection after login
  const [userRole, setUserRole] = useState<UserRole>(null)

  return <UserRoleContext.Provider value={{ userRole, setUserRole }}>{children}</UserRoleContext.Provider>
}

export const useUserRole = () => {
  const context = useContext(UserRoleContext)
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider")
  }
  return context
}
