'use client'

import { Snackbar, Button } from '@mui/material'
import { createContext, useContext, useState } from 'react'

type SnackbarOptions = {
  message: string
  action?: React.ReactNode
}

type SnackbarContextType = (options: SnackbarOptions) => void

const SnackbarContext = createContext<SnackbarContextType>(() => {})

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarOptions | null>(null)

  const showSnackbar = (options: SnackbarOptions) => {
    setSnackbar(options)
  }

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        message={snackbar?.message}
        action={snackbar?.action}
      />
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => useContext(SnackbarContext)
