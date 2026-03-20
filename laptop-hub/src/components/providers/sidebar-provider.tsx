'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type SidebarContextType = {
  isCollapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
  }, [])

  const toggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
