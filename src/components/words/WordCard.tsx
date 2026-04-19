import { useUpdateWord } from '@/src/hooks/useUpdateHook'
import { Tag } from '@/src/types/tags/tag.type'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { highlightText } from '@/src/helpers/highlightText'
import { useQuery } from '@tanstack/react-query'
import { getTags } from '@/src/services/tags/tag.service'
import {
  addTagToWord,
  removeTagFromWord,
} from '@/src/services/words/word.service'

type WordCardProps = {
  id: string
  content: string
  search: string
  tags: Tag[]
}

export default function WordCard({ id, content, search, tags }: WordCardProps) {
  const [editing, setEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags)

  const mutation = useUpdateWord()

  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getTags(),
    staleTime: 30_000,
  })

  // 🔁 keep local state in sync after refetch
  useEffect(() => {
    setEditedContent(content)
    setSelectedTags(tags)
  }, [content, tags])

  const handleSave = () => {
    mutation.mutate({
      id,
      data: {
        content: editedContent,
        tagIds: selectedTags.map((t) => t.id),
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

    // optimistic update
    setSelectedTags(newTags)

    // add new tags
    await Promise.all(added.map((tag) => addTagToWord(id, tag.id)))

    // remove tags (if backend supports it)
    await Promise.all(removed.map((tag) => removeTagFromWord(id, tag.id)))
  }

  const handleCancel = () => {
    setEditedContent(content)
    setEditing(false)
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* CONTENT */}
        <Box display="flex" gap={1}>
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

        {/* TAGS */}
        {editing ? (
          <Autocomplete
            multiple
            options={allTags}
            value={selectedTags}
            onChange={(_, newValue) => handleTagChange(newValue)}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            getOptionLabel={(o) => o.name}
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
        ) : (
          tags.length > 0 && (
            <Typography variant="body2" color="text.secondary" mt={1}>
              {tags.map((t) => t.name).join(', ')}
            </Typography>
          )
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
