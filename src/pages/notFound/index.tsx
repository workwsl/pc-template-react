import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold">404</CardTitle>
          <CardDescription className="text-lg">抱歉,您访问的页面不存在</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button type="button" onClick={() => navigate('/')}>
            返回首页
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            返回上一页
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFound
