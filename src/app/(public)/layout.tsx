import { Box } from "@mui/material"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 3,
        bgcolor: 'background.default',
      }}
    >
      {children}
    </Box>
  )
}