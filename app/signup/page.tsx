'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Alert from '@mui/material/Alert'
import { Header } from '@/components/Header'

export default function SignupPage() {
  const [passwordError, setPasswordError] = useState(false)
  const [emptyFieldsError, setEmptyFieldsError] = useState(false)
  const [userExistError, setUserExistError] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get('username')
    const password = data.get('password')

    if (!username || !password) {
      setEmptyFieldsError(true)
      return
    }

    if (password !== data.get('password2')) {
      setPasswordError(true)
      return
    }
    
    const res = await fetch('/api/auth/signup', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    })

    if (res.status == 201) {
      router.push('/login')
    } else if (res.status == 400) {
      setUserExistError(true)
    }
  }

  return (
    <>
    <Header />
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
          <TextField
            size='small'
            margin="normal"
            fullWidth
            id="password2"
            label="Confirm password"
            name="password2"
            type='password'
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
      {emptyFieldsError ?
        <Alert severity="error" sx={{ mt: 1 }}>
          The fields must not be empty!
        </Alert>
        : undefined
      }
      {passwordError ?
        <Alert severity="error" sx={{ mt: 1 }}>
          Password field must match confirm password field!
        </Alert>
        : undefined
      }
      {userExistError ?
        <Alert severity="error" sx={{ mt: 1 }}>
          The user exists!
        </Alert>
        : undefined
      }
    </Container>
    </>
  )
}
