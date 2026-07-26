'use client'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useState } from 'react'

type Props = {
  disabled: boolean
  onApprove: () => void
}

export default function PendingUserActionsMenu({ disabled, onApprove }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          disabled={disabled}
          onClick={() => {
            setAnchorEl(null)
            onApprove()
            console.log('just clicked')
          }}
        >
          <ListItemIcon>
            <CheckCircleOutlineIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText>Approve</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
