import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function SignupPage() {
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
          Sign Up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
            id="email"
            label="Email"
            name="email"
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
    </Container>
  )
}