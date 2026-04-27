'use client'

import { getTags } from '@/src/services/tags/tag.service'
import { Tag } from '@/src/types/tags/tag.type'
import { Chip, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { useQuery } from '@tanstack/react-query'

type TagSelectorProps = {
  value: Tag[]
  onChange: (tags: Tag[]) => void
  label?: string
  placeholder?: string
}

export default function TagSelector({
  value,
  onChange,
  label = 'Tags',
  placeholder = 'Type or select tags',
}: TagSelectorProps) {
  const { data: allTags = [] } = useQuery<Tag[]>({
    queryKey: ['tags'],
    queryFn: () => getTags(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  return (
    <Autocomplete
      multiple
      freeSolo
      options={allTags}
      value={value}
      onChange={(_, newValue) => {
        const mapped = newValue.map((item) => {
          if (typeof item === 'string') {
            return { id: item, name: item, count: 0 }
          }

          if ((item as any).inputValue) {
            return {
              id: (item as any).inputValue,
              name: (item as any).inputValue,
              count: 0,
            }
          }

          return item
        })

        // ✅ prevent duplicates
        const unique = Array.from(
          new Map(mapped.map((t) => [t.name.toLowerCase(), t])).values()
        )

        onChange(unique)
      }}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option
        return option.name
      }}
      filterOptions={(options, params) => {
        const filtered = options.filter((o) =>
          o.name.toLowerCase().includes(params.inputValue.toLowerCase())
        )

        if (params.inputValue !== '') {
          filtered.push({
            id: params.inputValue,
            name: `Add "${params.inputValue}"`,
            count: 0,
            inputValue: params.inputValue,
          } as any)
        }

        return filtered
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index })

          return <Chip key={key} label={option.name} {...tagProps} />
        })
      }
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  )
}
