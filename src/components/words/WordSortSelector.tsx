'use client'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function WordSortSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = searchParams.get('sort') ?? 'updated'

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('sort', value)

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Sort</InputLabel>

      <Select
        value={sort}
        label="Sort"
        onChange={(e) => handleChange(e.target.value)}
      >
        <MenuItem value="updated">Recently updated</MenuItem>
        <MenuItem value="newest">Newest first</MenuItem>
        <MenuItem value="oldest">Oldest first</MenuItem>
        <MenuItem value="favorites">Favorites first</MenuItem>
      </Select>
    </FormControl>
  )
}
