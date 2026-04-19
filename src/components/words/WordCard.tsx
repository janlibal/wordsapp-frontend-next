import { useUpdateWord } from '@/src/hooks/useUpdateHook'
import { Tag } from '@/src/types/tags/tag.type'
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { highlightText } from '@/src/helpers/highlightText'

type WordCardProps = {
  id: string
  content: string
  search: string
  tags: Tag[]
}

export default function WordCard({ id, content, search, tags }: WordCardProps) {
  const [editing, setEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  const mutation = useUpdateWord()

  // 🔁 keep local state in sync after refetch
  useEffect(() => {
    setEditedContent(content)
  }, [content])

  const handleSave = () => {
    mutation.mutate({
      id,
      data: {
        content: editedContent,
      },
    })

    setEditing(false)
  }

  const handleCancel = () => {
    setEditedContent(content)
    setEditing(false)
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* HEADER (content + edit button) */}
        <Box display="flex" alignItems="center" gap={1}>
          {editing ? (
            <TextField
              fullWidth
              multiline
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <Typography variant="body1" sx={{ flex: 1 }}>
              {highlightText(content, search)}
            </Typography>
          )}

          <IconButton onClick={() => setEditing((v) => !v)}>
            {editing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {/* TAGS */}
        {!editing && tags?.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tags.map((t) => t.name).join(', ')}
          </Typography>
        )}

        {/* ACTIONS */}
        {editing && (
          <Box mt={2} display="flex" gap={1}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>

            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
