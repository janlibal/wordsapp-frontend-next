'use client'

import useCollections from '@/src/hooks/queries/useCollections'
import { PageContainer } from '@/src/ui/pageContainer'
import { Stack, Typography } from '@mui/material'

export default function CollectionsList() {
  const { data: collections = [], isLoading } = useCollections()

  return (
    <PageContainer>
      <Stack spacing={2}>
        {isLoading && <Typography>Loading collections...</Typography>}

        {!collections.length && !isLoading && (
          <Typography color="text.secondary">No collections yet</Typography>
        )}

        {collections.map((collection) => (
          <li key={collection.name} />
        ))}
      </Stack>
    </PageContainer>
  )
}
