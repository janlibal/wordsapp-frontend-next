'use client'
import { useEffect, useState } from 'react'
import { Button, Container, TextField } from '@mui/material'

export default function ApiPages() {
  const message = 'My message'
  //const [message, setMessage] = useState('')
  /*useEffect(() => {
    fetch('/api/v1/app/info') //relative path if Nginx reverse proxy is configured
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error(err))
  }, [])
  
  
  \\
  
  <TextField
        label="Search"
        variant="outlined"
        style={{ width: 320, margin: 13 }}
        size="small"
        sx={{ marginLeft: 2, backgroundColor: 'white' }}
        type="yet to be defined"
        placeholder="Search products (e.g., iPhone, Macbook)"
      />
      <Button variant="contained" color="primary" style={{ margin: 13 }}>
        Search
      </Button>

  */

  return (
    <Container>
      <h1>api page content</h1>
    </Container>
  )
}
