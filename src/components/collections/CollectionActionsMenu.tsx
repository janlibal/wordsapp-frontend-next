import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'

type Props = {
  onEdit: () => void
  onDelete: () => void
  onView: () => void
  deleteDisabled: boolean
}

export default function CollectionActionsMenu({
  onEdit,
  onDelete,
  onView,
  deleteDisabled,
}: Props) {
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
            onView()
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
          Edit
        </MenuItem>

        <Tooltip
          title={
            deleteDisabled ? 'Remove all words from this collection first' : ''
          }
        >
          <span>
            <MenuItem
              disabled={deleteDisabled}
              onClick={() => {
                onDelete()
                handleClose()
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText primary="Delete" />
            </MenuItem>
          </span>
        </Tooltip>
      </Menu>
    ),
  }
}
