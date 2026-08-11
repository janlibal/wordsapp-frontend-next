import UserLayout from './UserLayout'

import UserAppShell from './UserAppShell'

export default function UserRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserAppShell>{children}</UserAppShell>
}

export function UserRouteLayout1({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
export function Layout111({ children }: { children: React.ReactNode }) {
  return <UserLayout>{children}</UserLayout>
}
