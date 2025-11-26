import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRequest, useTitle } from '@/hooks'
import { UserAPI } from '@/services'
import { useUserStore } from '@/store'
import { toast } from '@/lib/toast'
import { useState } from 'react'

const loginSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符'),
  password: z.string().min(6, '密码至少6个字符'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useUserStore()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // 设置页面标题
  useTitle('登录')

  // 获取登录前的路径，登录成功后跳转回去
  const from = (location.state as { from?: string })?.from || '/'

  // 登录请求
  const { run: handleLogin, loading } = useRequest(
    async (values: LoginFormValues) => {
      const response = await UserAPI.login(values)
      return response
    },
    {
      manual: true,
      onSuccess: data => {
        // 登录成功，保存用户信息
        login(data.token, data.userInfo)
        toast.success('登录成功')
        // 跳转到登录前的页面或首页
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 500)
      },
      onError: error => {
        const errorMessage = error instanceof Error ? error.message : '登录失败，请检查用户名和密码'
        toast.error(errorMessage)
      },
    }
  )

  // 表单提交
  const onSubmit = async (values: LoginFormValues) => {
    handleLogin(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo 区域 */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl">
            👤
          </div>
          <h1 className="text-lg font-semibold">欢迎登录</h1>
          <p className="text-base text-muted-foreground">请输入您的账号和密码</p>
        </div>

        {/* 表单区域 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        placeholder="请输入用户名"
                        autoComplete="username"
                        className="pl-9"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="请输入密码"
                        autoComplete="current-password"
                        className="pl-9 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Login
