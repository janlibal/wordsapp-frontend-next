import AdminAppShell from './AdminAppShell'

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAppShell>{children}</AdminAppShell>
}
