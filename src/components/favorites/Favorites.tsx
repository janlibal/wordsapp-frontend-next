// app/favorites/FavoritesPage.tsx
import { User } from '@/src/types/auth.types'
import { Box } from '@mui/material'

export default function FavoritesPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <h1>Favorites</h1>
    </Box>
  )
}
