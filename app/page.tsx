'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dateformat from 'dateformat'
import { getToken } from '@/lib/auth'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { Header } from '@/components/Header'
import Alert from '@mui/material/Alert'

export default function HomePage() {
  const [tasks, setTasks] = useState([])
  const [load, setLoad] = useState(true)
  const [progress, setProgress] = useState({})
  const [fileError, setFileError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!getToken()) {
      router.push('/login')
    }

    fetch('/api/tasks', { method: 'GET', headers: { 'Authorization': getToken() || '' } })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data['tasks'].reverse())
        let tmp = {}
        data['tasks'].forEach((task) => tmp[task._id] = task.progress)
        setProgress(tmp)
      })

    setLoad(false)
    setFileError(false)
  }, [load])

  useEffect(() => {
    const timer = setInterval(async () => {
      fetch('/api/tasks/progress', {
        method: 'GET',
        headers: { 'Authorization': getToken() || '' }
      })
      .then((res) => res.json())
      .then((data) => {
        for (let key in data) {
          if (data[key] == 100 && progress[key] != 100) {
            setLoad(true)
            break
          }
        }

        setProgress(data)
      })
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const addTask = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files !== null) {
      if (files[0].size > 5000000) {
        setFileError(true)
        return
      }
      const body = new FormData()
      body.set('file', files[0])

      await fetch('/api/tasks/new', {
        method: 'POST',
        headers: {
          'Authorization': getToken() || ''
        },
        body
      })

      setLoad(true)
    }
  }

  const downloadData = async (task_id: string) => {
    const res = await fetch(`/api/tasks/${task_id}/input`, {
      method: 'GET',
      headers: {
        'Authorization': getToken() || ''
      }
    })

    const formData = await res.formData()

    const url = window.URL.createObjectURL(formData.get('file') as Blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'graph.dat';
    link.click();

    window.URL.revokeObjectURL(url);
    setLoad(true)
  }

  const downloadResult = async (task_id: string) => {
    const res = await fetch(`/api/tasks/${task_id}/output`, {
      method: 'GET',
      headers: {
        'Authorization': getToken() || ''
      }
    })

    const formData = await res.formData()

    const url = window.URL.createObjectURL(formData.get('file') as Blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'result.dat';
    link.click();

    window.URL.revokeObjectURL(url);
    setLoad(true)
  }

  const deleteTask = async (task_id: string) => {
    await fetch(`/api/tasks/${task_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': getToken() || ''
      }
    })
    setLoad(true)
  }

  return (
    <>
    <Header />
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
      <Box>
        {tasks.map(({ _id, output_id, created_at }, i) => (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '12px 0 12px 0',
            padding: '6px 12px',
            boxShadow: '0px 1px 1px 1px gray',
            borderRadius: '4px'
          }} key={i}>
            <Box sx={{ display: 'flex' }}>
              <Typography component="h2" variant="subtitle1" sx={{
                paddingTop: '4px'
              }}>
                {dateformat(created_at, 'd mmm HH:MM')}
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', marginLeft: '20px' }}>
                <CircularProgress variant="determinate" value={progress[_id]} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ paddingBottom: '1px' }}
                  >{progress[_id]}%</Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              <Button variant="contained" onClick={() => downloadData(_id)}>
                Data 
              </Button>
              {output_id && <>
                <Button variant="contained" onClick={() => downloadResult(_id)} sx={{ marginLeft: '10px' }}>
                  Result
                </Button>
              </>} 
              <Button variant="contained" color='error' onClick={() => deleteTask(_id)} sx={{ marginLeft: '10px' }}>
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
      {fileError &&
        <Alert severity="error" sx={{ mt: 1 }}>
          The file size must not exceed 5mb!
        </Alert>
      }
    </Container>
    </>
  )
}
