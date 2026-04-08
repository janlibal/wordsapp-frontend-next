'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, Chip, Collapse, IconButton } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme, useMediaQuery } from '@mui/material'

export default function TagsSidebar() {
  const tags = ['caitlin', 'abcnews']
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTag = searchParams.get('tag')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  if (!tags.length) return null

  return (
    <Box sx={{ px: 2, mt: 2 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="subtitle2">Tags</Typography>
        {isMobile && (open ? <ExpandLess /> : <ExpandMore />)}
      </Box>

      {/* CHIP LIST */}
      <Collapse in={open || !isMobile}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1,
          }}
        >
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              clickable
              color={tag === activeTag ? 'primary' : 'default'}
              variant={tag === activeTag ? 'filled' : 'outlined'}
              onClick={() => router.push(`/?tag=${tag}`)}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  )
}
