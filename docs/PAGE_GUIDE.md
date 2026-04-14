# 页面开发规范

本文档规定了页面目录结构和样式编写规范。

## 📁 页面目录结构

### 目录命名规则

页面目录采用**小驼峰命名**（camelCase）：

```
src/pages/
├── home/                    # 首页（模板已提供）
│   ├── index.tsx           # 页面组件
│   └── components/         # 页面私有组件
├── login/                   # 登录页
│   ├── index.tsx
│   └── components/
├── about/                   # 关于页（模板已提供）
├── user/                    # 用户中心（模板已提供，示例需登录）
├── notFound/                # 404（模板已提供）
└── productDetail/           # 产品详情（示例：多单词用小驼峰）
    ├── index.tsx
    └── components/
```

### 命名规范

- ✅ 使用小驼峰命名（camelCase）
- ✅ 单个单词：`home`, `login`, `about`, `user`, `notFound`
- ✅ 多个单词：`productDetail`, `orderList`, `userProfile`
- ❌ 禁止使用 PascalCase：`Home`, `Login`, `ProductDetail`
- ❌ 禁止使用 kebab-case：`product-detail`, `order-list`

### 必需文件

每个页面目录必须包含：

- `index.tsx` - 页面组件（必需）
- `components/` - 页面私有组件目录（按需创建，有页面私有模块时必须创建）

**注意**：不再需要 `index.module.less` 文件，所有样式使用 Tailwind CSS 工具类。

### 页面入口职责（新增约束）

- `index.tsx` 是页面入口，职责是“编排页面模块”，不应把所有 UI 和业务逻辑都堆在一个文件中
- 页面私有模块（只被当前页面使用）放在当前页面的 `components/` 目录
- 多页面复用的模块提升到 `src/components/`（例如 `src/components/Common/`、`src/components/Business/`）
- 当 `index.tsx` 出现大段渲染块或混合多类业务逻辑时，应主动拆分为独立组件/自定义 Hook

### 二级页面结构

如果页面需要分模块，采用二级目录结构：

```
src/pages/
└── user/
    ├── index.tsx              # 用户中心主页
    ├── components/            # 用户中心公共组件
    ├── profile/               # 个人资料子页面
    │   ├── index.tsx
    │   └── components/
    └── settings/              # 设置子页面
        ├── index.tsx
        └── components/
```

## 🎨 Tailwind CSS 样式使用

### 1. 基础使用

项目使用 **Tailwind CSS** 作为样式框架，所有样式通过 Tailwind 工具类实现。

```tsx
// ✅ 正确：使用 Tailwind 工具类
<div className="container mx-auto p-4">
  <div className="flex items-center justify-between">
    <h1 className="text-lg font-semibold">标题</h1>
    <Button>操作</Button>
  </div>
</div>

// ❌ 错误：不使用内联样式或自定义 CSS
<div style={{ padding: '16px' }}>
  <h1 style={{ fontSize: '18px' }}>标题</h1>
</div>
```

### 2. 使用 shadcn/ui 组件

项目使用 **shadcn/ui** 作为 UI 组件库，所有组件位于 `src/components/ui/` 目录。

```tsx
// ✅ 正确：使用 shadcn/ui 组件
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const MyPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>标题</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="请输入" />
        <Button>提交</Button>
      </CardContent>
    </Card>
  )
}
```

### 3. 组合 Tailwind 类名

使用 `cn()` 工具函数（来自 `@/lib/utils`）组合类名：

```tsx
import { cn } from '@/lib/utils'

// ✅ 正确：使用 cn() 组合类名
<div className={cn('base-class', isActive && 'active-class', className)}>
  内容
</div>

// ✅ 正确：条件类名
<button
  className={cn(
    'px-4 py-2 rounded-md',
    variant === 'primary' && 'bg-primary text-white',
    variant === 'secondary' && 'bg-secondary text-secondary-foreground',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
  按钮
</button>
```

### 4. 响应式设计

使用 Tailwind 的响应式前缀：

```tsx
// ✅ 正确：响应式类名
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="p-4 md:p-6 lg:p-8">内容</div>
</div>

// ✅ 正确：移动端优先
<div className="text-sm md:text-base lg:text-lg">文字</div>
```

## 💡 完整页面示例

### 示例 1: 登录页面

```tsx
// src/pages/login/index.tsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { UserAPI } from '@/services'
import { useUserStore } from '@/store'
import { toast } from '@/lib/toast'
import { useRequest } from '@/hooks'

const loginSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符'),
  password: z.string().min(6, '密码至少6个字符'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useUserStore()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const from = (location.state as { from?: string })?.from || '/'

  const { run: handleLogin, loading } = useRequest(
    async (values: LoginFormValues) => {
      const response = await UserAPI.login(values)
      return response
    },
    {
      manual: true,
      onSuccess: data => {
        login(data.token, data.userInfo)
        toast.success('登录成功')
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 500)
      },
      onError: error => {
        const errorMessage = error instanceof Error ? error.message : '登录失败'
        toast.error(errorMessage)
      },
    }
  )

  const onSubmit = async (values: LoginFormValues) => {
    handleLogin(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-lg font-semibold">欢迎登录</h1>
          <p className="text-base text-muted-foreground">请输入您的账号和密码</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入用户名" />
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
                    <Input type="password" {...field} placeholder="请输入密码" />
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
```

### 示例 2: 用户卡片

```tsx
// src/pages/user/index.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useUserInfo } from '@/store'

const User = () => {
  const userInfo = useUserInfo()

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userInfo?.avatar} alt={userInfo?.username} />
              <AvatarFallback>{userInfo?.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{userInfo?.username || '未登录'}</CardTitle>
              <p className="text-sm text-muted-foreground">{userInfo?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-base">
              <span className="font-medium">用户名:</span>{' '}
              <span className="text-muted-foreground">{userInfo?.username || '-'}</span>
            </p>
            <p className="text-base">
              <span className="font-medium">邮箱:</span>{' '}
              <span className="text-muted-foreground">{userInfo?.email || '-'}</span>
            </p>
          </div>
          <Button className="mt-4">编辑资料</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default User
```

## 🔧 在 React 组件中使用

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const MyPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>我的页面</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground">页面内容</p>
          <Button className={cn('mt-4', isLoading && 'opacity-50')} disabled={isLoading}>
            {isLoading ? '加载中...' : '按钮'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

## ✅ 最佳实践

### 1. 组件放置原则

- **页面私有组件**：放在 `pages/xxx/components/` 下
- **全局公共组件**：放在 `src/components/` 下
- **业务组件**：如果多个页面使用，提升到 `src/components/`
- **页面入口职责**：`index.tsx` 负责组合与编排，不承担全部 UI/逻辑实现

### 2. 样式组织

- 使用 Tailwind CSS 工具类，不创建自定义 CSS 文件
- 使用 `cn()` 函数组合条件类名
- 保持类名简洁，避免过长的类名列表

### 3. 使用 shadcn/ui 组件

- 优先使用 `src/components/ui/` 下的组件
- 如需新组件，使用 shadcn CLI 添加或从官网复制

### 4. 路由配置

```typescript
// src/router/routes.tsx
import Home from '@/pages/home'
import Login from '@/pages/login'
import ProductDetail from '@/pages/productDetail'

export const routes = [
  {
    path: '/',
    element: <Home />,
    meta: {
      title: '首页',
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    element: <Login />,
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/product/:id',
    element: <ProductDetail />,
    meta: {
      title: '产品详情',
      requiresAuth: false,
    },
  },
]
```

## 🚫 常见错误

### ❌ 错误示例

```tsx
// 错误 1: 页面目录使用 PascalCase
src/pages/Home/
src/pages/ProductDetail/

// 错误 2: 创建 CSS 文件
import styles from './index.module.less'  // ❌ 不使用

// 错误 3: 使用内联样式
<div style={{ padding: '16px' }}>  // ❌ 不使用

// 错误 4: 缺少必需文件
pages/myPage/
├── index.tsx           # 把整个页面所有 UI/逻辑都写在这里
└── (应按需拆分到 components/ 与 hooks/)
```

### ✅ 正确示例

```tsx
// 正确 1: 页面目录使用小驼峰
src/pages/home/
src/pages/productDetail/

// 正确 2: 使用 Tailwind 工具类
<div className="p-4 bg-background">  // ✅ 使用

// 正确 3: 使用 shadcn/ui 组件
import { Button } from '@/components/ui/button'  // ✅ 使用

// 正确 4: 完整的文件结构
pages/myPage/
├── index.tsx
└── components/
```

## ✅ 创建新页面检查清单

- [ ] 目录名使用小驼峰命名
- [ ] 包含 `index.tsx` 文件
- [ ] 页面私有模块已拆分到 `components/`（如有）
- [ ] 使用 Tailwind CSS 工具类，不创建 CSS 文件
- [ ] 使用 shadcn/ui 组件
- [ ] 在路由配置中添加路由
- [ ] 组件名使用 PascalCase（如 `ProductDetail`）

## 🎯 快速记忆口诀

- **页面目录**: 小驼峰 camelCase
- **样式**: 使用 Tailwind CSS 工具类
- **组件**: 使用 shadcn/ui 组件库
- **禁止**: 不使用 CSS 文件、内联样式

## 📚 相关文档

- [快速开始指南](./QUICK_START.md)
- [项目结构指南](./PROJECT_GUIDE.md)
- [样式规范详细说明](../.cursor/rules/basic/style.mdc)
- [页面规则说明](../.cursor/rules/modules/pages.mdc)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [shadcn/ui 官方文档](https://ui.shadcn.com/)
