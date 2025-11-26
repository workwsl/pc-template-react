import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useNavigate } from 'react-router-dom'
import { User as UserIcon, Mail, Phone } from 'lucide-react'
import { useUserStore, useUserInfo } from '../../store'
import { formatPhone } from '../../utils'
import { useState } from 'react'

const User = () => {
  const navigate = useNavigate()
  const userInfo = useUserInfo()
  const { logout } = useUserStore()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // 处理登出
  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
    setShowLogoutDialog(false)
  }

  const userInfoData = [
    {
      icon: <UserIcon className="h-4 w-4" />,
      label: '用户名',
      value: userInfo?.username || '-',
    },
    {
      icon: <Mail className="h-4 w-4" />,
      label: '邮箱',
      value: userInfo?.email || '-',
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: '电话',
      value: userInfo?.phone ? formatPhone(userInfo.phone) : '-',
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userInfo?.avatar} alt={userInfo?.username} />
              <AvatarFallback>
                <UserIcon className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-lg font-semibold">{userInfo?.username || '未登录'}</h2>
              <CardDescription>{userInfo?.email || '暂无邮箱信息'}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <CardTitle className="mb-4">个人信息</CardTitle>
            <div className="space-y-3">
              {userInfoData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-muted-foreground">{item.icon}</div>
                  <div className="flex-1 text-base">
                    <span className="font-medium">{item.label}: </span>
                    <span className="text-muted-foreground">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button type="button" onClick={() => navigate('/')}>
              返回首页
            </Button>
            {userInfo && (
              <Button type="button" variant="destructive" onClick={() => setShowLogoutDialog(true)}>
                退出登录
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认退出</DialogTitle>
            <DialogDescription>确认退出登录?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowLogoutDialog(false)}>
              取消
            </Button>
            <Button type="button" variant="destructive" onClick={handleLogout}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default User
