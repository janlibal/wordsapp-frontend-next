// /app/page.tsx

import { Box } from '@mui/material'
import QuoteCard from './components/QuoteCard'

export default function Homex() {
  const quotes = [
    {
      content: 'People see what they want to see.',
      author: 'Dan Brown',
      source: 'The Da Vinci Code',
      tags: ['dan brown', 'perception'],
    },
    {
      content: 'The truth is rarely pure and never simple.',
      author: 'Oscar Wilde',
      source: '',
      tags: ['truth', 'philosophy'],
    },
    {
      content: 'Not all those who wander are lost.',
      author: 'J.R.R. Tolkien',
      source: 'The Lord of the Rings',
      tags: ['adventure', 'life'],
    },
  ]

  return (
    <Box>
      {quotes.map((quote, index) => (
        <QuoteCard key={index} {...quote} />
      ))}
    </Box>
  )
}
