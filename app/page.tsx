'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
    }
  })

  const addTask = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files !== null) {
      const body = new FormData()
      body.set('file', files[0])

      const res = await fetch('/api/tasks/new', {
        method: 'POST',
        headers: {
          'Authorization': getToken() || ''
        },
        body
      })
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{
        marginTop: 2,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Typography component="h1" variant="h5">
          Tasks
        </Typography>
        <Button
          variant="contained"
          component="label"
        >
          Add
          <input type="file" onChange={addTask} hidden />
        </Button>
      </Box>
    </Container>
  )
}
