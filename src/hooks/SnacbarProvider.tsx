import { createContext, useContext, useState } from 'react'
import { Snackbar } from '@mui/material'

const SnackbarContext = createContext<(msg: string) => void>(() => {})

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const showSnackbar = (msg: string) => {
    setMessage(msg)
  }

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}

      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        message={message}
      />
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => useContext(SnackbarContext)
