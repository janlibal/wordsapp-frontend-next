import { Menu, MenuItem } from '@mui/material'
import { useState } from 'react'

type Props = {
  onEdit: () => void
  onDelete: () => void
}

export default function CollectionActionsMenu({ onEdit, onDelete }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return {
    anchorEl,
    open,
    handleOpen,
    handleClose,
    Menu: (
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose()
          }}
        >
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEdit()
            handleClose()
          }}
        >
          Rename
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDelete()
            handleClose()
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    ),
  }
}
