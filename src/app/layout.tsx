'use client'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import theme from './theme'
import { AuthProvider } from './context/authContext'
import Providers from './providers'
import { SnackbarProvider } from '../hooks/SnacbarProvider'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <Providers>
                <SnackbarProvider>
                  {children}
                </SnackbarProvider>
              </Providers>
            </ThemeProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

export function RootLayout2({
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
