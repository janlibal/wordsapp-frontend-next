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
  Stack,
  MenuItem,
  Menu,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Tag } from '@/src/types/tags/tag.type'
import { useUpdateWord } from '@/src/hooks/useUpdateHook'
import { getTags } from '@/src/services/tags/tag.service'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import {
  addTagToWord,
  removeTagFromWord,
} from '@/src/services/words/word.service'
import WordActionsMenu from './WordActionsMenu'

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
  const [isSaving, setIsSaving] = useState(false)
  const [hovered, setHovered] = useState(false)

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(menuAnchor)

  const { handleOpen, Menu: ActionsMenu } = WordActionsMenu({
    onEdit: () => setEditing(true),
    onDelete: () => alert('TODO delete'),
    onFavorite: () => alert('TODO favorite'),
  })

  const mutation = useUpdateWord()

  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getTags(),
  })

  useEffect(() => {
    setSelectedTags(tags)
  }, [tags])

  // 💾 save content
  const handleSave = () => {
    setIsSaving(true)

    mutation.mutate(
      {
        id,
        data: { content: editedContent },
      },
      {
        onSettled: () => {
          setIsSaving(false)
          setEditing(false)
        },
      }
    )
  }

  // 🏷 tag update
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

  // 🧠 menu handlers

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  // ✨ highlight search
  const highlightText = (text: string, query?: string) => {
    if (!query) return text

    const words = query.trim().split(/\s+/)
    const regex = new RegExp(`(${words.join('|')})`, 'gi')

    return text
      .split(regex)
      .map((part, i) =>
        words.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        )
      )
  }

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: 3,
        mb: 2,
        transition: '0.2s',
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          {/* TOP ROW */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            {/* CONTENT */}
            {editing ? (
              <TextField
                fullWidth
                multiline
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            ) : (
              <Typography sx={{ flex: 1, lineHeight: 1.6 }}>
                {highlightText(content, search)}
              </Typography>
            )}

            {/* MENU BUTTON (hover only) */}
            {hovered && !editing && (
              <IconButton size="small" onClick={handleOpen}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}

            {/* MENU (ALWAYS MOUNTED) */}
            {ActionsMenu}
            <Menu
              anchorEl={menuAnchor}
              open={openMenu}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  setEditing(true)
                  handleMenuClose()
                }}
              >
                Edit
              </MenuItem>

              <MenuItem
                onClick={() => {
                  alert('TODO delete')
                  handleMenuClose()
                }}
              >
                Delete
              </MenuItem>

              <MenuItem
                onClick={() => {
                  alert('TODO favorite')
                  handleMenuClose()
                }}
              >
                Favorite
              </MenuItem>
            </Menu>
          </Box>

          {/* TAGS + COUNT */}
          {!editing && (
            <Box display="flex" alignItems="center" gap={1}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tags.map((t) => (
                  <Chip
                    key={t.id}
                    label={t.name}
                    size="small"
                    sx={{ borderRadius: 1.5 }}
                  />
                ))}
              </Stack>

              <Chip
                size="small"
                label={tags.length}
                sx={{
                  ml: 'auto',
                  fontSize: 11,
                  height: 20,
                }}
              />
            </Box>
          )}

          {/* EDIT MODE */}
          {editing && (
            <>
              <Autocomplete
                multiple
                options={allTags}
                value={selectedTags}
                onChange={(_, v) => handleTagChange(v)}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                getOptionLabel={(o) => o.name}
                renderInput={(params) => <TextField {...params} label="Tags" />}
              />

              <Box display="flex" gap={1} alignItems="center">
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>

                {isSaving && (
                  <Typography variant="body2" color="text.secondary">
                    Saving...
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
