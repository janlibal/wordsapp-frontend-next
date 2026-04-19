export function highlightText(content: string, search?: string) {
  if (!search) return content

  const terms = search.toLowerCase().split(' ').filter(Boolean)

  if (!terms.length) return content

  const regex = new RegExp(`(${terms.join('|')})`, 'gi')

  return content.split(regex).map((part, i) => {
    const match = terms.includes(part.toLowerCase())

    return match ? (
      <span
        key={i}
        style={{
          backgroundColor: '#ffe58f',
          padding: '0 2px',
          borderRadius: '2px',
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  })
}
