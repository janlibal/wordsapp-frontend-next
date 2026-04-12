export function highlightText(text: string, query: string) {
  if (!query) return text

  // escape regex special chars
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        style={{
          backgroundColor: '#ffe58a',
          padding: '0 2px',
          borderRadius: '2px',
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  )
}
