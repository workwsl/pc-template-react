# 快速开始指南

面向本 **PC 端 React 模板** 的本地开发与常见任务；路由与页面以 `src/pages/`、`src/router/routes.tsx` 为准，随业务迭代扩展你的业务模块即可。

## 🎯 5 分钟上手

### 步骤 1: 启动项目

```bash
# 安装依赖(如果还没安装)
npm install

# 启动开发服务器
npm run dev
```

访问: http://localhost:5173（Hash 路由下首页多为 `http://localhost:5173/#/`）

### 步骤 2: 了解目录结构

```
src/
├── services/   → 所有 API 接口都在这里
├── pages/      → 页面组件 (小驼峰命名)
├── router/     → 路由配置
├── utils/      → 工具函数
├── hooks/      → 自定义 Hooks (基于 ahooks)
├── store/      → 状态管理 (Zustand)
├── components/ → 公共组件 (shadcn/ui)
├── lib/        → 工具库 (cn, toast)
└── styles/     → 全局样式 (Tailwind CSS)
```

### 步骤 3: 创建第一个页面

#### 3.1 创建页面组件

在 `src/pages/` 下创建新目录 `myPage/`（使用小驼峰命名）:

```typescript
// src/pages/myPage/index.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

const MyPage = () => {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>我的页面</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground">这是我创建的第一个页面!</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            返回首页
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default MyPage
```

**注意**：不再需要创建 `index.module.less` 文件，所有样式使用 Tailwind CSS 工具类。

#### 3.2 配置路由

在 `src/router/routes.tsx` 中添加路由:

```typescript
// 1. 导入页面组件
import MyPage from '@/pages/myPage'

// 2. 在路由表中添加配置
export const routes: RouteConfig[] = [
  // ... 其他路由
  {
    path: '/my-page',
    element: <MyPage />,
    meta: {
      title: '我的页面',
      requiresAuth: false,
    },
  },
  // ... 其他路由
]
```

#### 3.3 添加导航链接

在首页添加链接:

```typescript
// src/pages/home/index.tsx
<Button onClick={() => navigate('/my-page')}>
  我的页面
</Button>
```

### 步骤 4: 调用 API

#### 4.1 定义 API 接口

遵循项目的目录规范，每个 API 模块使用目录结构，将类型定义和 API 方法分离：

```typescript
// src/services/product/types.ts
export interface Product {
  id: number
  name: string
  price: number
}
```

```typescript
// src/services/product/index.ts
import { http } from '@/utils/request'
import type { Product } from './types'

export const ProductAPI = {
  getList(): Promise<Product[]> {
    return http.get('/products')
  },

  getDetail(id: number): Promise<Product> {
    return http.get(`/products/${id}`)
  },
}

// 导出类型
export type { Product } from './types'
```

#### 4.2 导出 API

```typescript
// src/services/index.ts
export * from './product'
```

#### 4.3 在组件中使用

```typescript
import { useEffect, useState } from 'react'
import { ProductAPI, type Product } from '@/services'

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const data = await ProductAPI.getList()
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <div>加载中...</div>

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  )
}
```

### 步骤 5: 使用 Hooks (基于 ahooks)

项目使用 [ahooks](https://ahooks.js.org/) 提供 70+ 个高质量 React Hooks。

使用 `useRequest` Hook 简化 API 调用:

```typescript
import { useRequest, useDebounce } from '@/hooks'
import { ProductAPI } from '@/services'

const ProductList = () => {
  const [searchText, setSearchText] = useState('')

  // 请求管理
  const { data, loading, run } = useRequest(ProductAPI.getList)

  // 防抖搜索
  const debouncedSearch = useDebounce(searchText, { wait: 500 })

  useEffect(() => {
    run()
  }, [])

  if (loading) return <div>加载中...</div>

  return (
    <div>
      {data?.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  )
}
```

### 步骤 6: 使用工具函数

```typescript
import { formatPhone, formatDate, storage } from '@/utils'
import { toast } from '@/lib/toast'

// 格式化手机号
const phone = formatPhone('13800138000') // 138****8000

// 格式化日期
const date = formatDate(Date.now()) // 2024-01-01 12:00:00

// 本地存储
storage.set('token', 'abc123', 3600) // 保存 1 小时
const token = storage.get('token')

// Toast 通知
toast.success('操作成功')
toast.error('操作失败')
```

## 🔧 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint

# 代码检查并自动修复
npm run lint:fix
```

## 📝 开发技巧

### 1. 使用路径别名

```typescript
// ❌ 不推荐
import { UserAPI } from '../../../api/modules/user'

// ✅ 推荐
import { UserAPI } from '@/services'
```

### 2. 组件按功能分类

```
components/
├── ui/         → shadcn/ui 组件
├── Common/      → 通用组件 (Loading, Empty)
└── Business/    → 业务组件 (UserCard, ProductCard)
```

### 2.1 页面目录命名

```
pages/
├── home/              → 使用小驼峰命名
├── productDetail/     → 多单词也用小驼峰
└── userProfile/       → 保持一致的命名风格
```

### 3. 页面私有组件

```
pages/
└── home/
    ├── index.tsx
    └── components/          → 只在 home 页使用的组件
        └── Banner/
            └── index.tsx
```

### 4. Tailwind CSS 样式

```tsx
// 使用 Tailwind 工具类
;<div className="container mx-auto p-4">
  <div className="flex items-center justify-between">
    <h1 className="text-lg font-semibold">标题</h1>
    <Button className="ml-auto">操作</Button>
  </div>
</div>

// 使用 cn() 组合条件类名
import { cn } from '@/lib/utils'
;<div className={cn('base-class', isActive && 'bg-primary text-white', className)}>内容</div>
```

详细样式规范请查看 [页面开发规范](./PAGE_GUIDE.md)

## 🎨 UI 组件使用

shadcn/ui 常用组件示例:

```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from '@/lib/toast'

// 按钮
<Button>主要按钮</Button>
<Button variant="outline">次要按钮</Button>
<Button variant="destructive">危险按钮</Button>

// 卡片
<Card>
  <CardHeader>
    <CardTitle>卡片标题</CardTitle>
  </CardHeader>
  <CardContent>内容</CardContent>
</Card>

// 输入框
<Input placeholder="请输入" />

// 对话框
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>确认</DialogTitle>
    </DialogHeader>
    <p>确认删除?</p>
  </DialogContent>
</Dialog>

// Toast 通知
toast.success('操作成功')
toast.error('操作失败')
toast.warning('警告信息')
```

## 🐛 常见问题

### Q: API 请求失败?

A: 检查 `.env.development` 中的 `VITE_API_BASE_URL` 配置是否正确。

### Q: 样式不生效?

A: 确保使用了 Tailwind CSS 工具类，检查类名是否正确。

### Q: 路由跳转失败?

A: 检查路由配置是否正确,路径是否匹配。

### Q: TypeScript 报错?

A: 运行 `npm run build` 查看详细类型错误，或运行 `npm run check:types` 检查 Services 类型规范。

### Q: shadcn/ui 组件找不到?

A: 确保组件已添加到 `src/components/ui/` 目录，使用 shadcn CLI 添加组件。

## 📚 下一步

- 阅读 [项目结构指南](./PROJECT_GUIDE.md) - 了解完整项目结构
- 查看 [API 开发规范](./API_GUIDE.md) - 学习 Services 模块开发
- 查看 [页面开发规范](./PAGE_GUIDE.md) - 学习页面和样式规范
- 查看 [状态管理指南](./ZUSTAND_GUIDE.md) - 学习 Zustand 使用
- 参考 [Tailwind CSS 文档](https://tailwindcss.com/docs)
- 参考 [shadcn/ui 文档](https://ui.shadcn.com/)
- 参考 [ahooks 文档](https://ahooks.js.org/)
