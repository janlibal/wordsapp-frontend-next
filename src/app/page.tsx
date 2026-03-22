'use client'
import { Suspense } from 'react'
import ApiPage from './ApiPage'
//import { useState, useEffect } from 'react'

export default function Home() {
  

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApiPage />
    </Suspense>
  )
}
