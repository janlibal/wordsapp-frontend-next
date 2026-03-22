// src/app/components/Navbar.tsx

'use client'

import { AppBar, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'

export default function Navbar() {
  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        {/* Link to Home page */}
        <Link href="/" passHref style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"
            style={{ fontWeight: 'bold', color: 'white' }}
            sx={{ flexGrow: 1, cursor: 'pointer' }}
          >
            Home
          </Typography>
        </Link>
        <Link href="/products" passHref style={{ textDecoration: 'none' }}>
          <Typography
            marginLeft={3}
            variant="h6"
            style={{ fontWeight: 'bold', color: 'white' }}
            sx={{ flexGrow: 1, cursor: 'pointer' }}
          >
            Products
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  )
}
