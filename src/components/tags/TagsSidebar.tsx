'use client'

import { Tag } from '@/src/types/tags/tag.type'
import { Box, Chip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export default function TagsSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawTags = searchParams.get('tags') || ''
  const activeTagIds = rawTags ? rawTags.split(',') : []

  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await fetch('/api/api/v1/tags')
      const data = await res.json()
      return data.result
    },
    staleTime: 30_000, // optional
  })

  const toggleTag = (tagId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    let newTags = [...activeTagIds]

    if (newTags.includes(tagId)) {
      newTags = newTags.filter((t) => t !== tagId)
    } else {
      newTags.push(tagId)
    }

    if (newTags.length) {
      params.set('tags', newTags.join(','))
    } else {
      params.delete('tags')
    }

    router.replace(`/?${params.toString()}`)
  }

  if (isLoading) return <p>Loading tags...</p>
  if (!tags.length) return null

  return (
    <Box sx={{ px: 2, mt: 2 }}>
      {tags
        .filter((tag) => tag.count > 0)
        .map((tag) => {
          const isActive = activeTagIds.includes(tag.id)

          return (
            <Chip
              key={tag.id}
              label={`#${tag.name} (${tag.count})`}
              clickable
              color={isActive ? 'primary' : 'default'}
              variant={isActive ? 'filled' : 'outlined'}
              onClick={() => toggleTag(tag.id)}
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
