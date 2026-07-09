'use client'
import { Suspense } from 'react'
import WordsList from '../../components/words/WordsList'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WordsList />
    </Suspense>
  )
}
