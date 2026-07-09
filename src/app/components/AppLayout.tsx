'use client'

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputBase,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'
import Person from '@mui/icons-material/Person'
import CollectionsIcon from '@mui/icons-material/Collections'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import ComputerIcon from '@mui/icons-material/Computer'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SearchIcon from '@mui/icons-material/Search'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/authContext'
import TagsSidebar from '@/src/components/tags/TagsSidebar'
import { useDebouncedValue } from '@/src/hooks/useDebounceValue'

const drawerWidth = 240

type NavItem = {
  label: string
  icon: React.ReactNode
  href?: string
  action?: () => void
  showInDrawer?: boolean
  showInMenu?: boolean
  mobileMenu?: boolean
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const { user, logout } = useAuth()

  const [value, setValue] = useState(searchParams.get('search') || '')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const debounced = useDebouncedValue(value, 400)

  // 🔍 sync search with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debounced) {
      params.set('search', debounced)
    } else {
      params.delete('search')
    }

    router.replace(params.toString() ? `/?${params.toString()}` : '/')
  }, [debounced])

  /*useEffect1(() => {
    const params = new URLSearchParams(searchParams.toString())

    if (debounced) params.set('search', debounced)
    else params.delete('search')

    router.replace(`/?${params.toString()}`)
  }, [debounced])*/

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleSearch1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)

    const params = new URLSearchParams(searchParams.toString())

    if (val) params.set('search', val)
    else params.delete('search')

    router.replace(params.toString() ? `/?${params}` : '/')
  }

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget)

  const handleMenuClose = () => setAnchorEl(null)

  // 🔥 NAV CONFIG
  const navItems: NavItem[] = useMemo(() => {
    return [
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
        //hidden: true,
        showInDrawer: true,
      },
      {
        label: 'System',
        icon: <ComputerIcon />,
        href: '/system',
        showInDrawer: false,
        showInMenu: true,
        mobileMenu: true,
      },
      {
        label: 'Tags',
        icon: <LocalOfferIcon />,
        href: '/tags',
        showInDrawer: true,
      },
      {
        label: 'Profile',
        icon: <Person />,
        href: '/profile',
        showInMenu: true,
        mobileMenu: true,
      },
      {
        label: 'Logout',
        icon: <LogoutIcon />,
        action: async () => {
          await logout()
          router.push('/login')
        },
        showInMenu: true,
        mobileMenu: true,
      },
    ]
  }, [logout, router])

  const drawerItems = navItems.filter((i) => i.showInDrawer)
  const menuItems = navItems.filter(
    (i) => i.showInMenu && (!isMobile || i.mobileMenu)
  )

  // 📂 DRAWER CONTENT
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List>
        {drawerItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={item.href ? Link : 'button'}
              href={item.href}
              onClick={() => {
                setMobileOpen(false)
                if (item.action) item.action()
              }}
            >
              <Box sx={{ mr: 2 }}>{item.icon}</Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <TagsSidebar onSelect={() => setMobileOpen(false)} />
      </Box>
    </Box>
  )

  // 🔒 AUTH GUARD — minimal layout when logged out
  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4ecf7 100%)',
        }}
      >
        {children}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 🔝 APP BAR */}
      <AppBar position="fixed" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* LEFT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              sx={{ cursor: 'pointer', fontWeight: 600 }}
              onClick={() => router.push('/')}
            >
              WordsApp
            </Typography>
          </Box>

          {/* CENTER (desktop search) */}
          {!isMobile && (
            <InputBase
              value={value}
              onChange={handleSearch}
              placeholder="Search words..."
              sx={{
                background: 'rgba(255,255,255,0.15)',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                width: 320,
                color: 'white',
              }}
            />
          )}

          {/* RIGHT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileSearchOpen(true)}
              >
                <SearchIcon />
              </IconButton>
            )}

            <IconButton
              color="inherit"
              onClick={() => {
                const params = searchParams.toString()

                router.push(params ? `/words/new?${params}` : '/words/new')
              }}
            >
              <AddIcon />
            </IconButton>

            <IconButton color="inherit" onClick={handleMenuOpen}>
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔍 MOBILE SEARCH */}
      {isMobile && mobileSearchOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            p: 1,
            background: 'background.paper',
            zIndex: 1200,
          }}
        >
          <InputBase
            autoFocus
            fullWidth
            value={value}
            onChange={handleSearch}
            onBlur={() => setMobileSearchOpen(false)}
            placeholder="Search words..."
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
              backgroundColor: 'rgba(0,0,0,0.05)',
            }}
          />
        </Box>
      )}

      {/* 📂 DRAWER */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: drawerWidth,
            mt: isMobile ? 0 : 8,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 🔽 USER MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={async () => {
              handleMenuClose()
              if (item.href) router.push(item.href)
              if (item.action) await item.action()
            }}
          >
            <Box sx={{ mr: 1 }}>{item.icon}</Box>
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: 8,
          ml: isMobile ? 0 : `${drawerWidth}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
