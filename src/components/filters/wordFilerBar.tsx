import { useUrlFilters } from '@/src/hooks/useFilters'
import { Box, Chip, Stack } from '@mui/material'

export default function WordFilterBar() {
  const { search, tags, setFilters } = useUrlFilters()

  const removeTag = (tagId: string) => {
    setFilters({
      tags: tags.filter((t) => t !== tagId),
    })
  }

  return (
    <Box>
      {/* existing search input */}

      {tags.length > 0 && (
        <Stack direction="row" spacing={1} mt={1}>
          {tags.map((tagId) => (
            <Chip
              key={tagId}
              label={tagId} // we’ll map to names next
              onDelete={() => removeTag(tagId)}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}
