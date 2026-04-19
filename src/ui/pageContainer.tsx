import { Box } from '@mui/material'
import { layout } from './spacing'

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: layout.pageMaxWidth,
        mx: 'auto',
        px: layout.pagePadding,
        py: 2,
      }}
    >
      {children}
    </Box>
  )
}
