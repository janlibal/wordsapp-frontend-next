'use client'

import { Tag } from '@/src/types/tags/tag.type'
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { useUpdateTag } from '@/src/hooks/mutations/tags/useUpdateTagHook'
import { useSnackbar } from '@/src/hooks/SnacbarProvider'

type Props = {
  tag: Tag
}

export default function TagCard({ tag }: Props) {
  //const [editing, setEditing] = useState(false)
  const [name, setName] = useState(tag.name)
  const [editing, setEditing] = useState(false)
  const [editedName, setEditedName] = useState(name)
  const showSnackbar = useSnackbar()

  const updateMutation = useUpdateTag()
  updateMutation.isPending

  const handleSave = () => {
    updateMutation.mutate(
      { id: tag.id, data: { name: editedName } },
      {
        onSuccess: () => {
          showSnackbar({ message: 'Tag updated' })
          setEditing(false)
        },
        onError: () => showSnackbar({ message: 'Tag failed' }),
      }
    )
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box flex={1}>
            {editing ? (
              <TextField
                fullWidth
                size="small"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            ) : (
              <Typography variant="body1">#{tag.name}</Typography>
            )}

            <Typography variant="body2" color="text.secondary">
              {tag.count} words
            </Typography>
          </Box>

          {editing ? (
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                onClick={() => {
                  setEditing(false)
                  setEditedName(tag.name)
                }}
              >
                Cancel
              </Button>

              <Button
                size="small"
                variant="contained"
                onClick={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Update'}
              </Button>
            </Stack>
          ) : (
            <IconButton onClick={() => setEditing(true)}>
              <EditIcon />
            </IconButton>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
