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
import FavoriteIcon from '@mui/icons-material/Favorite'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import ComputerIcon from '@mui/icons-material/Computer'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import SearchIcon from '@mui/icons-material/Search'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useAuth } from '../context/authContext'
import TagsSidebar from '@/src/components/tags/TagsSidebar'

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)

  const handleMenuClose = () => setAnchorEl(null)

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)

    const params = new URLSearchParams(searchParams.toString())

    if (val) params.set('search', val)
    else params.delete('search')

    router.replace(params.toString() ? `/?${params}` : '/')
  }

  // 🔥 SINGLE SOURCE OF TRUTH
  const navItems: NavItem[] = useMemo(() => {
    if (!user) return []

    return [
      {
        label: 'All Words',
        icon: <FormatQuoteIcon />,
        href: '/',
        showInDrawer: true,
      },
      {
        label: 'Favorites',
        icon: <FavoriteIcon />,
        href: '/favorites',
        showInDrawer: true,
      },
      {
        label: 'System',
        icon: <ComputerIcon />,
        href: '/system',
        showInDrawer: true,
        showInMenu: true,
        mobileMenu: false,
      },
      {
        label: 'Tags',
        icon: <LocalOfferIcon />,
        href: '/tags',
        showInDrawer: true,
      },
      {
        label: 'Me',
        icon: <Person />,
        href: '/me',
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
  }, [user, logout, router])

  // 🎯 FILTERED VIEWS
  const drawerItems = navItems.filter((i) => i.showInDrawer)

  const menuItems = navItems.filter(
    (i) => i.showInMenu && (!isMobile || i.mobileMenu)
  )

  const regularMenuItems = menuItems.filter((i) => i.label !== 'Logout')
  const logoutItem = menuItems.find((i) => i.label === 'Logout')

  // 📂 DRAWER
  const drawerContent = (
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

      {user && <TagsSidebar />}
    </List>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 🔝 APP BAR */}
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* LEFT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h6"
              sx={{ cursor: 'pointer' }}
              onClick={() => router.push('/')}
            >
              WordsApp
            </Typography>
          </Box>

          {/* CENTER */}
          {!isMobile && user && (
            <InputBase
              value={value}
              onChange={handleSearch}
              placeholder="Search words..."
              sx={{
                background: 'rgba(255,255,255,0.15)',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                width: 300,
                color: 'white',
              }}
            />
          )}

          {/* RIGHT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                {isMobile && (
                  <IconButton
                    color="inherit"
                    onClick={() => router.push('/search')}
                  >
                    <SearchIcon />
                  </IconButton>
                )}

                {isMobile ? (
                  <IconButton
                    color="inherit"
                    onClick={() => router.push('/words/new')}
                  >
                    <AddIcon />
                  </IconButton>
                ) : (
                  <Button
                    color="inherit"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/words/new')}
                  >
                    Add
                  </Button>
                )}

                <IconButton color="inherit" onClick={handleMenuOpen}>
                  <Person />
                </IconButton>

                {/* 🔽 DROPDOWN */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { minWidth: 180, mt: 1 } }}
                >
                  {/* Regular items */}
                  {regularMenuItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      sx={{ py: 1.5 }}
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

                  {/* Logout separated */}
                  {logoutItem && [
                    <Divider key="divider" />,
                    <MenuItem
                      key="logout"
                      sx={{ py: 1.5, color: 'error.main' }}
                      onClick={async () => {
                        handleMenuClose()
                        if (logoutItem.action) await logoutItem.action()
                      }}
                    >
                      <Box sx={{ mr: 1 }}>{logoutItem.icon}</Box>
                      {logoutItem.label}
                    </MenuItem>,
                  ]}
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => router.push('/login')}>
                  {isMobile ? '' : 'Login'}
                </Button>

                <Button
                  color="inherit"
                  onClick={() => router.push('/register')}
                >
                  {isMobile ? '' : 'Sign Up'}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 📂 SIDEBAR */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: drawerWidth } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              mt: 8,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 8,
          ml: isMobile ? 0 : `${drawerWidth}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
