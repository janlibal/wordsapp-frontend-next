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
import { User } from '@/src/types/auth/auth.types'
import { useApproveUser } from '@/src/hooks/mutations/admin/useApproveUserHook'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'

type Props = {
  disabled: boolean
  user: User
}

export default function PendingUserActionsMenu({ disabled, user }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const approveMutation = useApproveUser()

  const showSnackbar = useSnackbar()

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(user.id)
      showSnackbar({
        message: 'Invitation sent successfully',
      })
    } finally {
      setAnchorEl(null)
    }
  }

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          disabled={
            disabled || !user.emailVerified || approveMutation.isPending
          }
          onClick={handleApprove}
        >
          <ListItemIcon>
            <CheckCircleOutlineIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            {approveMutation.isPending ? 'Approving...' : 'Approve'}
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}
