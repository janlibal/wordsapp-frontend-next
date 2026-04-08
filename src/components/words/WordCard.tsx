import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  TextField,
  Box,
  Button,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import { updateWord } from '@/src/services/words/word.service'

type WordCardProps = {
  id: string
  content: string
  author?: string
  source?: string
  tags: string[]
}

export default function WordCard({
  id,
  content,
  author,
  source,
  tags,
}: WordCardProps) {
  const [editing, setEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [editedTags, setEditedTags] = useState(tags)
  const [newTag, setNewTag] = useState('')

  const handleAddTag = () => {
    const trimmed = newTag.trim()
    if (trimmed && !editedTags.includes(trimmed)) {
      setEditedTags([...editedTags, trimmed])
      setNewTag('')
    }
  }

  const handleDeleteTag = (tagToDelete: string) => {
    setEditedTags(editedTags.filter((t) => t !== tagToDelete))
  }

  const handleSave = async () => {
    try {
      await updateWord(id, {
        content: editedContent,
        //  tags: editedTags
      })
      setEditing(false)
    } catch (err) {
      console.error('Failed to update word:', err)
    }
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {editing ? (
            <TextField
              fullWidth
              multiline
              variant="outlined"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <Typography variant="h6" gutterBottom>
              “{editedContent}”
            </Typography>
          )}

          <IconButton onClick={() => setEditing(!editing)}>
            {editing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {(author || source) && !editing && (
          <Typography variant="body2" color="text.secondary">
            — {author} {source ? `, ${source}` : ''}
          </Typography>
        )}

        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {editedTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={editing ? () => handleDeleteTag(tag) : undefined}
              color="primary"
            />
          ))}

          {editing && (
            <TextField
              size="small"
              placeholder="New tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
          )}
        </Stack>

        {editing && (
          <Box mt={2} display="flex" gap={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setEditing(false)
                setEditedContent(content)
                setEditedTags(tags)
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
