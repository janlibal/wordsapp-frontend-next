// /components/QuoteCard.tsx

import { Card, CardContent, Typography, Chip, Stack } from '@mui/material'

type QuoteCardProps = {
  content: string
  author?: string
  source?: string
  tags: string[]
}

export default function QuoteCard({
  content,
  author,
  source,
  tags,
}: QuoteCardProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Quote text */}
        <Typography variant="h6" gutterBottom>
          “{content}”
        </Typography>

        {/* Author / source */}
        {(author || source) && (
          <Typography variant="body2" color="text.secondary">
            — {content} {source ? `, ${source}` : ''}
          </Typography>
        )}

        {/* Tags */}
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {tags.map((tag) => (
            <Chip key={tag} label={tag} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}
