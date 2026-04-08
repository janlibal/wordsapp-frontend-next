'use client'

import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputBase,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import AddIcon from '@mui/icons-material/Add'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ComputerIcon from '@mui/icons-material/Computer'
import LocalOfferIcon from '@mui/icons-material/Sell'

import Link from 'next/link'

import { useRouter, useSearchParams } from 'next/navigation'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from '../context/authContext'
import Person from '@mui/icons-material/Person'
import TagsSidebar from '@/src/components/tags/TagsSidebar'

const drawerWidth = 240

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [value, setValue] = useState(searchParams.get('search') || '')

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)

    const params = new URLSearchParams(searchParams.toString())

    if (val) {
      params.set('search', val)
    } else {
      params.delete('search')
    }

    router.push(`/?${params.toString()}`)
  }

  const { user, logout } = useAuth()

  const drawerContent = (
    <List>
      {user && (
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/"
            onClick={() => setMobileOpen(false)}
          >
            <FormatQuoteIcon sx={{ mr: 2 }} />
            <ListItemText primary="All Words" />
          </ListItemButton>
        </ListItem>
      )}

      {user && (
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/favorites"
            onClick={() => setMobileOpen(false)}
          >
            <FavoriteIcon sx={{ mr: 2 }} />
            <ListItemText primary="Favorites" />
          </ListItemButton>
        </ListItem>
      )}

      {user && (
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/system"
            onClick={() => setMobileOpen(false)}
          >
            <ComputerIcon sx={{ mr: 2 }} />
            <ListItemText primary="System" />
          </ListItemButton>
        </ListItem>
      )}
      {user && (
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/tags"
            onClick={() => setMobileOpen(false)}
          >
            <LocalOfferIcon sx={{ mr: 2 }} />
            <ListItemText primary="Tags" />
          </ListItemButton>
        </ListItem>
      )}
      {user && <TagsSidebar />}
    </List>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 🔝 APP BAR */}
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 🔹 LEFT */}

          {user ? (
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
          ) : (
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
          )}

          {/* 🔹 CENTER */}
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

          {/* 🔹 RIGHT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/words/new')}
                >
                  {isMobile ? '' : 'Add'}
                </Button>

                <Button
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  onClick={async () => {
                    await logout()
                    router.push('/login')
                  }}
                >
                  {isMobile ? '' : 'Logout'}
                </Button>

                <Button
                  color="inherit"
                  startIcon={<Person />}
                  onClick={() => router.push('/me')}
                >
                  {isMobile ? '' : 'Me'}
                </Button>
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

      {/* 📄 MAIN CONTENT */}
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
