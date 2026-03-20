'use client'

import { useState, useEffect } from 'react'

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true')
    }
    setIsLoaded(true)
  }, [])

  const toggle = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  return { isCollapsed, toggle, isLoaded }
}
