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
import { highlightText } from '@/src/helpers/highlightText'
import { useUpdateWord } from '@/src/hooks/useUpdateHook'

type WordCardProps = {
  id: string
  content: string
  tags: string[]
  search?: string
  onUpdate?: (
    id: string,
    data: { content: string; tags: string[] }
  ) => Promise<void>
}

export default function WordCard({ id, content, search, tags }: WordCardProps) {
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

  const updateMutation = useUpdateWord()

  const handleSave = async () => {
    updateMutation.mutate({
      id,
      data: {
        content: editedContent,
        tags: editedTags,
      },
    })

    setEditing(false) // instant UI close
  }

  const handleSaveOriginal = async () => {
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
            <Typography variant="body1">
              {highlightText(content, search || '')}
            </Typography>
          )}

          <IconButton onClick={() => setEditing(!editing)}>
            {editing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {tags && !editing && (
          <Typography variant="body2" color="text.secondary">
            — {tags.map((f) => f)} {/*{source ? `, ${source}` : ''}*/}
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

export function WordCardNEw({
  id,
  content,
  //author,
  //source,
  tags,
  search,
  onUpdate,
}: WordCardProps) {
  const [editing, setEditing] = useState(false)

  const [editedContent, setEditedContent] = useState(content)
  const [editedTags, setEditedTags] = useState(tags)
  const [newTag, setNewTag] = useState('')

  // 🏷️ add tag
  const handleAddTag = () => {
    const trimmed = newTag.trim()

    if (trimmed && !editedTags.includes(trimmed)) {
      setEditedTags((prev) => [...prev, trimmed])
      setNewTag('')
    }
  }

  // 🗑️ remove tag
  const handleDeleteTag = (tag: string) => {
    setEditedTags((prev) => prev.filter((t) => t !== tag))
  }

  // 💾 save
  const handleSave = async () => {
    //if (!onUpdate) return

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

  // ↩️ cancel
  const handleCancel = () => {
    setEditing(false)
    setEditedContent(content)
    setEditedTags(tags)
    setNewTag('')
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* 🔝 header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {editing ? (
            <TextField
              fullWidth
              multiline
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <Typography variant="body1">
              {highlightText(content, search || '')}
            </Typography>
          )}

          <IconButton onClick={() => setEditing((v) => !v)}>
            {editing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {/* 👤 metadata 
        {(author || source) && !editing && (
          <Typography variant="caption" color="text.secondary">
            {author && `— ${author}`} {source && `(${source})`}
          </Typography>
        )}*/}

        {/* 🏷️ tags */}
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {editedTags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              onDelete={editing ? () => handleDeleteTag(tag) : undefined}
              color={editing ? 'primary' : 'default'}
              variant={editing ? 'filled' : 'outlined'}
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

        {/* 💾 actions */}
        {editing && (
          <Box mt={2} display="flex" gap={1}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
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
