'use client'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from './theme'
import { AuthProvider } from './context/authContext'
import Providers from './providers'
import { SnackbarProvider } from '../hooks/SnacbarProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Providers>
              <SnackbarProvider>{children}</SnackbarProvider>
            </Providers>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
