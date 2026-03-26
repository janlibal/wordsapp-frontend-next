'use client'

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
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import AddIcon from '@mui/icons-material/Add'
import Link from 'next/link'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import FavoriteIcon from '@mui/icons-material/Favorite'

const drawerWidth = 240

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* 🔝 TOP BAR */}
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* LEFT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <MenuIcon />
            </IconButton>

            <Typography variant="h6">QuoteKeeper</Typography>
          </Box>

          {/* 🔍 SEARCH */}
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

          {/* ➕ ADD BUTTON */}
          <Button color="inherit" startIcon={<AddIcon />}>
            Add Quote
          </Button>
        </Toolbar>
      </AppBar>

      {/* 📂 SIDEBAR */}
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
        <List>
          {/* All Quotes */}
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/">
              <FormatQuoteIcon sx={{ mr: 2 }} />
              <ListItemText primary="All Quotes" />
            </ListItemButton>
          </ListItem>

          {/* Favorites */}
          <ListItem disablePadding>
            <ListItemButton component={Link} href="/favorites">
              <FavoriteIcon sx={{ mr: 2 }} />
              <ListItemText primary="Favorites" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* 📄 MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: `${drawerWidth}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
