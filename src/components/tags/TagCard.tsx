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

type Props = {
  tag: Tag
}

export default function TagCard({ tag }: Props) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(tag.name)

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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                  setName(tag.name)
                }}
              >
                Cancel
              </Button>

              <Button size="small" variant="contained">
                Save
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
