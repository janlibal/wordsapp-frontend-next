'use client'

import UserHeader from '@/src/components/layout/UserHeader'
import UserSidebar from '@/src/components/layout/UserSidebar'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { useAuth } from '../../context/authContext'
import { createUserNavigation } from '@/src/components/layout/userNavigation'

export default function UserAppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen((open) => !open)
  }

  const { user, logout } = useAuth()

  const navItems = createUserNavigation({
    role: user?.role?.id,
    logout,
  })

  const drawerItems = navItems.filter((item) => item.showInDrawer)

  const menuItems = navItems.filter(
    (item) => item.showInMenu && (!isMobile || item.mobileMenu)
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* DESKTOP */}
      {!isMobile && <UserSidebar items={drawerItems} />}

      {/* MOBILE */}
      {isMobile && (
        <UserSidebar
          items={drawerItems}
          mobile
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      )}

      {/* CONTENT */}
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <UserHeader
          isMobile={isMobile}
          onMenuClick={handleDrawerToggle}
          menuItems={menuItems}
        />

        <Box
          component="main"
          sx={{
            p: { xs: 1.5, sm: 2, md: 3 },
            mt: 8,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
