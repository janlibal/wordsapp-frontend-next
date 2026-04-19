import { useUrlFilters } from '@/src/hooks/useFilters'
import { Tag } from '@/src/types/tags/tag.type'
import { Box, Chip, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

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
        <Stack
          direction="row"
          sx={{
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            overflowX: { xs: 'auto', md: 'visible' },
            gap: 1,
            mt: 1,
            py: 1,
          }}
        >
          {tags.map((tagId) => (
            <Chip
              key={tagId}
              label={tagId}
              onDelete={() => removeTag(tagId)}
              color="primary"
              size="small"
              sx={{
                borderRadius: 1.5,
                height: 28,
                fontWeight: 500,
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  )
}
