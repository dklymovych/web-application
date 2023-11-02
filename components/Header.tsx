'use client'

import Link from 'next/link';
import { getToken } from '@/lib/auth';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter()

  const signOut = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ display: "flex" }}>
        <Button color="inherit" component="div">
          <Link href="/">Home</Link>
        </Button>
        {getToken === null ?
          <>
            <Button color="inherit" component="div" sx={{ ml: "auto" }}>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button color="inherit" component="div" sx={{ ml: "10px" }}>
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
          :
          <Button color="inherit" component="div" onClick={signOut} sx={{ ml: "auto" }}>
            Sign out
          </Button>
        }
      </Toolbar>
    </AppBar>
  )
}
