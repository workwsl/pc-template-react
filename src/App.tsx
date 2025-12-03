import { Toaster } from 'sonner'
import Router from './router'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setNavigate } from '@/router/navigate'

function App() {
  const navigate = useNavigate()
  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])
  return (
    <>
      <Router />
      <Toaster />
    </>
  )
}

export default App
