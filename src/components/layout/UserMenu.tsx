'use client'

import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import { useRouter } from 'next/navigation'
import { UserNavItem } from './userNavigation'

type Props = {
  items: UserNavItem[]
}

export default function UserMenu({ items }: Props) {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const open = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleItemClick = async (item: UserNavItem) => {
    handleClose()

    if (item.href) {
      router.push(item.href)
      return
    }

    if (item.action) {
      await item.action()
    }
  }

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        aria-label="user menu"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <PersonIcon />
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {items.map((item) => (
          <MenuItem key={item.label} onClick={() => handleItemClick(item)}>
            <Box
              sx={{
                mr: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {item.icon}
            </Box>

            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
