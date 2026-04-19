// hooks/useUrlFilters.ts
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export function useUrlFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''

  const tags = useMemo(
    () => searchParams.get('tags')?.split(',').filter(Boolean) ?? [],
    [searchParams]
  )

  const setFilters = (updates: { search?: string; tags?: string[] }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.search !== undefined) {
      updates.search
        ? params.set('search', updates.search)
        : params.delete('search')
    }

    if (updates.tags !== undefined) {
      updates.tags.length
        ? params.set('tags', updates.tags.join(','))
        : params.delete('tags')
    }

    router.replace(`/?${params.toString()}`)
  }

  const toggleTag = (tagId: string) => {
    const next = tags.includes(tagId)
      ? tags.filter((t) => t !== tagId)
      : [...tags, tagId]

    setFilters({ tags: next })
  }

  return {
    search,
    tags,
    setFilters,
    toggleTag,
  }
}
