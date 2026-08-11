import React from 'react'

import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import CollectionsIcon from '@mui/icons-material/Collections'
import ComputerIcon from '@mui/icons-material/Computer'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

import { RoleEnum } from '@/src/types/auth/auth.types'

export type UserNavItem = {
  label: string
  icon: React.ReactNode
  href?: string
  action?: () => void | Promise<void>

  showInDrawer?: boolean
  showInMenu?: boolean
  mobileMenu?: boolean

  roles?: RoleEnum[]
}

type CreateUserNavigationParams = {
  role?: RoleEnum
  logout: () => void | Promise<void>
}

export function createUserNavigation({
  role,
  logout,
}: CreateUserNavigationParams): UserNavItem[] {
  const items: UserNavItem[] = [
    {
      label: 'All Words',
      icon: <FormatQuoteIcon />,
      href: '/',
      showInDrawer: true,
    },
    {
      label: 'Collections',
      icon: <CollectionsIcon />,
      href: '/collections',
      showInDrawer: true,
    },
    {
      label: 'Tags',
      icon: <LocalOfferIcon />,
      href: '/tags',
      showInDrawer: true,
    },
    {
      label: 'System',
      icon: <ComputerIcon />,
      href: '/system',
      showInMenu: true,
      mobileMenu: true,
    },
    {
      label: 'Profile',
      icon: <PersonIcon />,
      href: '/profile',
      showInMenu: true,
      mobileMenu: true,
    },
    {
      label: 'Logout',
      icon: <LogoutIcon />,
      action: logout,
      showInMenu: true,
      mobileMenu: true,
    },
  ]

  if (role === RoleEnum.admin) {
    items.push({
      label: 'Admin',
      icon: <AdminPanelSettingsIcon />,
      href: '/admin',
      showInMenu: true,

      // Intentionally desktop-only in the user menu.
      mobileMenu: false,

      roles: [RoleEnum.admin],
    })
  }

  return items
}
