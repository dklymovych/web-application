import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

export function Header() {
  return (
    <AppBar position="static">
      <Toolbar variant="dense" sx={{ display: "flex" }}>
        <Button color="inherit" component="div">
          <Link href="/">Home</Link>
        </Button>
        <Button color="inherit" component="div" sx={{ ml: "auto" }}>
          <Link href="/login">Sign in</Link>
        </Button>
        <Button color="inherit" component="div" sx={{ ml: "10px" }}>
          <Link href="/signup">Sign up</Link>
        </Button>
      </Toolbar>
    </AppBar>
  )
}
