'use client'

import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchBar from './Searchbar'
import { UserNavItem } from './userNavigation'
import UserMenu from './UserMenu'
import AddIcon from '@mui/icons-material/Add'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  isMobile: boolean
  onMenuClick: () => void
  menuItems: UserNavItem[]
}

export default function UserHeader({
  isMobile,
  onMenuClick,
  menuItems,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleAddWord = () => {
    const params = searchParams.toString()

    router.push(params ? `/words/new?${params}` : '/words/new')
  }
  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
              aria-label="open navigation"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            WordsApp
          </Typography>
        </Box>

        {/* CENTER */}
        {!isMobile && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'center',
              px: 2,
            }}
          >
            <SearchBar />
          </Box>
        )}

        {/* RIGHT */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <IconButton
            color="inherit"
            onClick={handleAddWord}
            aria-label="add new word"
          >
            <AddIcon />
          </IconButton>

          <UserMenu items={menuItems} />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
