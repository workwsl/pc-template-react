import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  const techStack = [
    'React 19.2.0',
    'shadcn/ui + Tailwind CSS',
    'React Router 7.x',
    'TypeScript 5.9.3',
    'Vite 7.x',
    'Zustand 5.x',
    'ahooks 3.x',
  ]

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>关于</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">技术栈</h2>
            <ul className="list-inside list-disc space-y-1">
              {techStack.map((item, index) => (
                <li key={index} className="text-base text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Button type="button" onClick={() => navigate('/')}>
              返回首页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default About
