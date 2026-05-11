'use client'

import { Snackbar, Button, Alert } from '@mui/material'
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
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        sx={{
          bottom: { xs: 16, sm: 24 },

          '& .MuiAlert-root': {
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: 320 },
            maxWidth: { xs: 'calc(100vw - 16px)', sm: 568 },
            borderRadius: 2,
          },
        }}
      >
        <Alert
          onClose={() => setSnackbar(null)}
          severity="success"
          variant="filled"
          elevation={6}
          sx={{ alignItems: 'center' }}
          action={snackbar?.action}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = () => useContext(SnackbarContext)
