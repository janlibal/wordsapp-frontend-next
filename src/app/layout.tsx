'use client'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import AppLayout from './components/AppLayout'
import theme from './theme'
import { AuthProvider } from './context/authContext'

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
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
