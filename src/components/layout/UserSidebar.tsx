'use client'

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import Link from 'next/link'
import { UserNavItem } from './userNavigation'
import TagsSidebar from '@/src/components/tags/TagsSidebar'

type Props = {
  items: UserNavItem[]
  mobile?: boolean
  open?: boolean
  onClose?: () => void
}

export default function UserSidebar({
  items,
  mobile = false,
  open = false,
  onClose,
}: Props) {
  const content = (
    <Box
      sx={{
        width: 240,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: mobile ? 'none' : '1px solid',
        borderColor: 'divider',
        pt: mobile ? 2 : 10,
      }}
    >
      {/* Navigation */}
      <List sx={{ px: 2, py: 0 }}>
        {items.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={item.href ? Link : 'button'}
              href={item.href}
              onClick={onClose}
            >
              {item.icon && (
                <Box
                  sx={{
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon}
                </Box>
              )}

              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Tags */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        <TagsSidebar onSelect={onClose} />
      </Box>
    </Box>
  )

  if (mobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {content}
      </Drawer>
    )
  }

  return content
}
