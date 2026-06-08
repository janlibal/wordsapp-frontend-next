import CollectionsPage from '@/src/components/collections/Collections'

export default async function Page() {
  // optionally pass user to component
  return <CollectionsPage />
}

/*//'use client'

import { Box } from '@mui/material'

export default async function Page() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2, // 👈 horizontal padding for small screens
      }}
    >
      <h1>Favorites</h1>
    </Box>
  )
}
*/
