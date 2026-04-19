import React from 'react'

export function highlightText(content: string, search?: string) {
  if (!search?.trim()) return content

  const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean)

  if (!terms.length) return content

  // escape regex special chars
  const escapeRegExp = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')

  const parts = content.split(regex)

  return parts.map((part, i) => {
    const isMatch = terms.includes(part.toLowerCase())

    return isMatch ? (
      <mark
        key={i}
        style={{
          backgroundColor: '#ffe58f',
          padding: '0 2px',
          borderRadius: '3px',
        }}
      >
        {part}
      </mark>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  })
}
