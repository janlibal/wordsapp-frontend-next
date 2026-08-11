'use client'

import { InputBase } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebouncedValue } from '@/src/hooks/useDebounceValue'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSearch = searchParams.get('search') || ''
  const [value, setValue] = useState(currentSearch)

  const debounced = useDebouncedValue(value, 400)

  // Keep local input synchronized with URL changes.
  useEffect(() => {
    setValue(currentSearch)
  }, [currentSearch])

  // Update URL after the user stops typing.
  useEffect(() => {
    if (debounced === currentSearch) {
      return
    }

    const params = new URLSearchParams(searchParams.toString())

    if (debounced) {
      params.set('search', debounced)
    } else {
      params.delete('search')
    }

    const query = params.toString()

    router.replace(query ? `/?${query}` : '/')
  }, [debounced, currentSearch, router, searchParams])

  return (
    <InputBase
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search words..."
      sx={{
        background: 'rgba(255,255,255,0.15)',
        px: 2,
        py: 0.5,
        borderRadius: 2,
        width: 320,
        color: 'white',
      }}
    />
  )
}
