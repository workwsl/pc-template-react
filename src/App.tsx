import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { setNavigate } from '@/router/navigate'
import Router from './router'
import './App.module.less'

function App() {
  const navigate = useNavigate()
  useEffect(() => {
    setNavigate(navigate)
  }, [navigate])
  return (
    <ConfigProvider locale={zhCN}>
      <Router />
    </ConfigProvider>
  )
}

export default App
