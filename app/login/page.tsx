'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'

export default function LoginPage() {
  const [emptyFieldsError, setEmptyFieldsError] = useState(false)
  const [loginError, setLoginError] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const username = data.get('username')
    const password = data.get('password')

    if (!username || !password) {
      setEmptyFieldsError(true)
      return
    }
    
    const res = await fetch('/api/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    })

    if (res.status == 200) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      router.push('/')
    } else if (res.status == 400) {
      setLoginError(true)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '5px',
          boxShadow: '1px 1px 1px 1px gray',
          padding: '30px'
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            size='small'
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
          />
          <TextField
            size='small'
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
      {emptyFieldsError ?
        <Alert severity="error" sx={{ mt: 1 }}>
          The fields must not be empty!
        </Alert>
        : undefined
      }
      {loginError ?
        <Alert severity="error" sx={{ mt: 1 }}>
          Incorrect username or password!
        </Alert>
        : undefined
      }
    </Container>
  )
}
