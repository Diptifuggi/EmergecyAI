import React, { createContext, useState } from 'react'

export const GlobalContext = createContext(null)

export function GlobalProvider({ children }) {
  const [state, setState] = useState({})
  return (
    <GlobalContext.Provider value={{ state, setState }}>
      {children}
    </GlobalContext.Provider>
  )
}
