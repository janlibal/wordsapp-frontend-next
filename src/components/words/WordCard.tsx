import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  IconButton,
  Button,
  Chip,
  Autocomplete,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tag } from '@/src/types/tags/tag.type'
import { useUpdateWord } from '@/src/hooks/useUpdateHook'
import { getTags } from '@/src/services/tags/tag.service'
import { highlightText } from '@/src/helpers/highlightText'
import {
  addTagToWord,
  removeTagFromWord,
} from '@/src/services/words/word.service'

type WordCardProps = {
  id: string
  content: string
  tags: Tag[]
  search?: string
}

export default function WordCard({ id, content, tags, search }: WordCardProps) {
  const [editing, setEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)

  const mutation = useUpdateWord()

  // fetch all tags for selector
  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getTags(),
    staleTime: 30_000,
  })

  // sync when backend updates
  useEffect(() => {
    setEditedContent(content)
    setSelectedTags(tags)
  }, [content, tags])

  const handleSave = () => {
    mutation.mutate({
      id,
      data: {
        content: editedContent,
      },
    })

    setEditing(false)
  }

  const handleTagChange = async (newTags: Tag[]) => {
    const added = newTags.filter(
      (t) => !selectedTags.some((st) => st.id === t.id)
    )

    const removed = selectedTags.filter(
      (t) => !newTags.some((nt) => nt.id === t.id)
    )

    setSelectedTags(newTags)

    await Promise.all([
      ...added.map((t) => addTagToWord(id, t.id)),
      ...removed.map((t) => removeTagFromWord(id, t.id)),
    ])
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* CONTENT */}
        <Box display="flex" alignItems="flex-start" gap={1}>
          {editing ? (
            <TextField
              fullWidth
              multiline
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <Typography sx={{ flex: 1 }}>
              {highlightText(content, search)}
            </Typography>
          )}

          <IconButton onClick={() => setEditing((v) => !v)}>
            {editing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        {/* TAGS (VIEW MODE) */}
        {!editing && tags.length > 0 && (
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              {tags.map((t) => t.name).join(', ')}
            </Typography>
          </Box>
        )}

        {/* TAGS (EDIT MODE) */}
        {editing && (
          <Autocomplete
            multiple
            options={allTags}
            value={selectedTags}
            onChange={(_, newValue) => handleTagChange(newValue)}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            getOptionLabel={(option) => option.name}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Tags" />}
            sx={{ mt: 2 }}
          />
        )}

        {/* ACTIONS */}
        {editing && (
          <Box mt={2} display="flex" gap={1}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
