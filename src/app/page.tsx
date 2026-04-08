'use client'
import { Suspense } from 'react'
import WordsList from '../components/words/WordsList'
import { getWords } from '../services/words/word.service'
//import { useState, useEffect } from 'react'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WordsList />
    </Suspense>
  )
}
