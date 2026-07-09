import { SnackbarProvider } from '../../hooks/SnacbarProvider'
import AppLayout from '../components/AppLayout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout>
      <SnackbarProvider>{children}</SnackbarProvider>
    </AppLayout>
  )
}
