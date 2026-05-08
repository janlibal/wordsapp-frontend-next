'use client'

import { useQuery } from '@tanstack/react-query'
import { Box, Chip } from '@mui/material'
import { useUrlFilters } from '@/src/hooks/useFilters'
import { Tag } from '@/src/types/tags/tag.type'
import { getTags } from '@/src/services/tags/tag.service'
import { queryKeys } from '@/src/hooks/types/queryKeys'

type Props = {
  onSelect?: () => void
}

export default function TagsSidebar({ onSelect }: Props) {
  const { tags: activeTags, toggleTag } = useUrlFilters()

  // 📦 fetch tags
  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: queryKeys.tags,
    queryFn: () => getTags(),
    //staleTime: 30_000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <p>Loading tags...</p>
  if (!tags.length) return null

  return (
    <Box
      sx={{
        px: 2,
        mt: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {tags
        .filter((tag) => tag.count > 0)
        .map((tag) => {
          const isActive = activeTags.includes(tag.id)

          return (
            <Chip
              key={tag.id}
              label={`#${tag.name} (${tag.count})`}
              clickable
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              onClick={() => {
                toggleTag(tag.id)
                onSelect?.()
              }}
            />
          )
        })}
    </Box>
  )
}

/*
export default function TagsSidebar() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const rawTags = searchParams.get('tags') || ''
  const activeTags = rawTags ? rawTags.split(',') : []

  const toggleTag = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())

    let newTags = [...activeTags]

    if (newTags.includes(tag)) {
      newTags = newTags.filter((t) => t !== tag)
    } else {
      newTags.push(tag)
    }

    if (newTags.length) {
      params.set('tags', newTags.join(','))
    } else {
      params.delete('tags')
    }

    router.replace(`/?${params.toString()}`)
  }

  // example static tags for now
  const tags = ['caitlin', 'abcnews']

  return (
    <Box>
      {tags.map((tag) => {
        const isActive = activeTags.includes(tag)

        return (
          <Chip
            key={tag}
            label={`#${tag}`}
            clickable
            color={isActive ? 'primary' : 'default'}
            variant={isActive ? 'filled' : 'outlined'}
            onClick={() => toggleTag(tag)}
          />
        )
      })}
    </Box>
  )
}
 */
