'use client'

import useTags from '@/src/hooks/queries/useTags'
import { PageContainer } from '@/src/ui/pageContainer'
import { Box, Stack, Typography } from '@mui/material'
import TagCard from './TagCard'
import { Tag } from '@/src/types/tags/tag.type'
import { getTags } from '@/src/services/tags/tag.service'

export default function TagsList() {
  const { data: tags = [], isLoading } = useTags()

  return (
    <PageContainer>
      <Stack spacing={2}>
        {isLoading && <Typography>Loading tags...</Typography>}

        {!tags.length && !isLoading && (
          <Typography color="text.secondary">No tags yet</Typography>
        )}

        {tags.map((tag) => (
          <TagCard key={tag.id} tag={tag} />
        ))}
      </Stack>
    </PageContainer>
  )
}
