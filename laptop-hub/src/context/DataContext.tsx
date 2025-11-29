'use client'

import { createContext, useContext } from 'react'

type DataContextType = Record<string, never>

const DataContext = createContext<DataContextType>({})

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Add data logic here

  return (
    <DataContext.Provider value={{}}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  return useContext(DataContext)
}
