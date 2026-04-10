'use client'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import AppLayout from './components/AppLayout'
import theme from './theme'
import { AuthProvider } from './context/authContext'
import Providers from './providers'

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
              <AppLayout>{children}</AppLayout>
            </Providers>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
