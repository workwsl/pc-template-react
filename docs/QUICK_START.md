# 快速开始指南

## 🎯 5 分钟上手

### 步骤 1: 启动项目

```bash
# 安装依赖(如果还没安装)
npm install

# 启动开发服务器
npm run dev
```

访问: http://localhost:5173

### 步骤 2: 了解目录结构

```
src/
├── services/   → 所有 API 接口都在这里
├── pages/      → 页面组件 (小驼峰命名)
├── router/     → 路由配置
├── utils/      → 工具函数
├── hooks/      → 自定义 Hooks (基于 ahooks)
├── store/      → 状态管理 (Zustand)
└── styles/     → 全局样式
```

### 步骤 3: 创建第一个页面

#### 3.1 创建页面组件

在 `src/pages/` 下创建新目录 `myPage/`（使用小驼峰命名）:

```typescript
// src/pages/myPage/index.tsx
import { Button, Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.less'

const MyPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.myPage}>
      <Card title="我的页面">
        <p>这是我创建的第一个页面!</p>
        <Button color="primary" onClick={() => navigate('/')}>
          返回首页
        </Button>
      </Card>
    </div>
  )
}

export default MyPage
```

```less
// src/pages/myPage/index.module.less
// 使用 BEM 命名规范
.myPage {
  padding: 16px;
  min-height: 100vh;
  background-color: #f5f5f5;

  // Element (使用单下划线 _)
  &_content {
    margin-top: 20px;
  }
}
```

#### 3.2 配置路由

在 `src/router/routes.tsx` 中添加路由:

```typescript
// 1. 导入页面组件
import YourPage from '../pages/yourPage'

// 2. 在路由表中添加配置
export const routes: RouteConfig[] = [
  // ... 其他路由
  {
    path: '/your-page',
    element: <YourPage />,
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
<Button color="primary" onClick={() => navigate('/my-page')}>
  your页面
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
import { ProductAPI, Product } from '@/services'

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

// 格式化手机号
const phone = formatPhone('13800138000') // 138****8000

// 格式化日期
const date = formatDate(Date.now()) // 2024-01-01 12:00:00

// 本地存储
storage.set('token', 'abc123', 3600) // 保存 1 小时
const token = storage.get('token')
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
    ├── index.module.less
    └── components/          → 只在 home 页使用的组件
        └── Banner/
            ├── index.tsx
            └── index.module.less
```

### 4. 样式变量和 BEM 命名

```less
// 在组件样式中使用全局变量和 BEM 命名
@import '@/styles/variables.less';

// Block
.myPage {
  color: @primary-color;

  // Element (使用单下划线 _)
  &_button {
    font-size: @font-size-lg;
    padding: @spacing-base;

    // Modifier (使用双下划线 __)
    &__primary {
      background: @primary-color;
    }
  }
}
```

详细样式规范请查看 [页面开发规范](./PAGE_GUIDE.md)

## 🎨 UI 组件使用

antd 常用组件示例:

```typescript
import {
  Button,
  Input,
  Card,
  List,
  Modal,
} from 'antd'

// 按钮
<Button color="primary">主要按钮</Button>

// 输入框
<Input placeholder="请输入" />

// 卡片
<Card title="卡片标题">内容</Card>


// 提示
Modal.success({ content: '操作成功' })
Modal.error({ content: '操作失败' })
Modal.warning({ content: '操作警告' })
Modal.info({ content: '操作信息' })

// 对话框
Modal.confirm({ title: '确认删除?', content: '确认删除?' })
```

## 🐛 常见问题

### Q: API 请求失败?

A: 检查 `.env.development` 中的 `VITE_API_BASE_URL` 配置是否正确。

### Q: 样式不生效?

A: 确保使用了 CSS Modules,文件名为 `.module.less`。

### Q: 路由跳转失败?

A: 检查路由配置是否正确,路径是否匹配。

### Q: TypeScript 报错?

A: 运行 `npm run type-check` 查看详细错误信息。

## 📚 下一步

- 阅读 [项目结构指南](./PROJECT_GUIDE.md) - 了解完整项目结构
- 查看 [API 开发规范](./API_GUIDE.md) - 学习 Services 模块开发
- 查看 [页面开发规范](./PAGE_GUIDE.md) - 学习页面和样式规范
- 查看 [状态管理指南](./ZUSTAND_GUIDE.md) - 学习 Zustand 使用
- 参考 [antd 文档](https://ant.design/)
- 参考 [ahooks 文档](https://ahooks.js.org/)
