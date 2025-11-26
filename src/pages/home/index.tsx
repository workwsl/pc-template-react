import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { useUserStore, useIsLogin } from '../../store'
import { toast } from '@/lib/toast'

const Home = () => {
  const navigate = useNavigate()
  const isLogin = useIsLogin()
  const { login } = useUserStore()

  // 模拟登录
  const handleMockLogin = () => {
    // 模拟登录数据
    const mockToken = 'mock-token-' + Date.now()
    const mockUserInfo = {
      id: 1,
      username: '演示用户',
      email: 'demo@example.com',
      avatar: '',
      phone: '13800138000',
    }

    login(mockToken, mockUserInfo)
    toast.success('登录成功')
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>首页</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-lg font-semibold">欢迎来到 PC 模板</h1>
            <p className="text-base text-muted-foreground">
              这是一个基于 React 19 + shadcn/ui + Tailwind CSS 的 PC 端模板
            </p>
            <p className="text-base text-muted-foreground">集成了 Zustand 全局状态管理</p>
            <p className="text-base text-muted-foreground">
              当前登录状态: {isLogin ? '已登录 ✅' : '未登录 ❌'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {!isLogin && (
              <>
                <Button type="button" onClick={() => navigate('/login')}>
                  前往登录
                </Button>
                <Button type="button" variant="outline" onClick={handleMockLogin}>
                  模拟登录（演示）
                </Button>
              </>
            )}
            <Button type="button" onClick={() => navigate('/about')}>
              关于页面
            </Button>
            <Button type="button" onClick={() => navigate('/user')}>
              用户页面
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home
