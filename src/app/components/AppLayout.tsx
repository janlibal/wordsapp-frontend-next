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

import Link from 'next/link'
import { useAuth } from '../context/authContext'
import { useRouter } from 'next/navigation'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 240

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const { token, logout } = useAuth()
  const router = useRouter()

  const drawerContent = (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          href="/"
          onClick={() => setMobileOpen(false)}
        >
          <FormatQuoteIcon sx={{ mr: 2 }} />
          <ListItemText primary="All Quotes" />
        </ListItemButton>
      </ListItem>

      {token && (
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
    </List>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 🔝 APP BAR */}
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* 🔹 LEFT */}
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
              QuoteKeeper
            </Typography>
          </Box>

          {/* 🔹 CENTER */}
          {!isMobile && token && (
            <InputBase
              placeholder="Search quotes..."
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
            {token ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/quotes/new')}
                >
                  {isMobile ? '' : 'Add'}
                </Button>

                <Button
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    logout()
                    router.push('/login')
                  }}
                >
                  {isMobile ? '' : 'Logout'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  onClick={() => router.push('/login')}
                >
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
