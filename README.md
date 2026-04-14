# PC Template React

适用于快速搭建 **中后台 / 桌面优先** 类产品的 **PC 端 Web 模板**，基于 React 19 + TypeScript + Vite + shadcn/ui + Tailwind CSS。路由为 React Router 7（`HashRouter`），接口请求统一走 `@/utils/request`（Axios）。

## ✨ 特性

- ⚡️ **Vite** - 极速的开发体验
- ⚛️ **React 19** - 最新的 React 特性
- 🎨 **shadcn/ui + Tailwind CSS** - 现代化的 UI 组件库和实用优先的 CSS 框架
- 📦 **TypeScript** - 类型安全
- 🛣️ **React Router 7** - 路由管理（`HashRouter`）
- 🗃️ **Zustand** - 轻量级状态管理
- 🔄 **Axios** - HTTP 请求封装
- 🎯 **ESLint + Prettier** - 代码规范和格式化
- 🔒 **Git Hooks** - 提交前自动检查代码质量
- 📝 **Commitlint** - 规范化 Git 提交信息
- 📂 **最佳实践目录结构** - 清晰的代码组织

## 📦 技术栈

- React 19.2.0
- TypeScript 5.9.3
- Vite 7.x
- React Router 7.x
- shadcn/ui + Tailwind CSS - UI 组件和样式框架
- Zustand 5.x - 状态管理
- ahooks 3.x - React Hooks 工具库
- Axios - HTTP 请求
- React Hook Form + Zod - 表单处理和验证
- Sonner - Toast 通知

## 其他分支与多分支开发（Git Worktree）

- **react19-antd6**：React 19 + Ant Design 6 + TailwindCSS v4 + Less（补充）
- **react18antd5**：React 18 + Ant Design 5 + Less（PC 端模板，非 antd-mobile）

各变体分支的 `.cursor/rules`、`.cursor/skills`、`AGENTS.md` **各自维护**；本仓库 `main` 为 **shadcn/ui** 线，其他分支可借鉴本线目录结构做初版，后续互不强制对齐。

并行检出示例（在仓库**父目录**执行，路径可按需调整）：

```bash
git fetch origin
git worktree add ../pc-template-react-react19-antd6 origin/react19-antd6
git worktree add ../pc-template-react-react18antd5 origin/react18antd5
```

使用 `git worktree list` 查看已绑定的目录。

## 🚀 快速开始

### 环境要求

- **Node.js >= 20**（见 `package.json` 的 `engines`）

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# Prettier 格式化
npm run format

# Prettier 检查
npm run format:check

# API 相关类型检测（见 scripts/check-api-types.js）
npm run check:types
```

### Git 提交

```bash
# 使用 Commitizen 交互式提交（推荐）
npm run commit

# 生成 CHANGELOG 并升级版本
npm run changelog
```

## 📁 项目结构

详细的项目结构说明请查看 [PROJECT_GUIDE.md](./docs/PROJECT_GUIDE.md)

```
src/
├── services/               # API 接口（按模块拆分，经 http 封装）
├── assets/                 # 静态资源
├── components/             # 公共组件（含 ui/ shadcn 组件）
├── constants/              # 常量定义
├── hooks/                  # 自定义 Hooks（基于 ahooks）
├── lib/                    # 工具库（如 toast、cn）
├── pages/                  # 页面（目录小驼峰）
│   ├── home/
│   ├── login/
│   ├── about/
│   ├── user/
│   └── notFound/
├── router/                 # 路由表、守卫、非组件内 navigate
├── store/                  # Zustand 状态
├── styles/                 # 全局样式（Tailwind 入口）
├── types/                  # 类型定义
├── utils/                  # 工具函数与 request 封装
├── App.tsx
└── main.tsx
```

## 🔧 配置说明

### 环境变量

项目支持多环境配置,通过不同的 `.env` 文件管理:

- `.env.development` - 开发环境
- `.env.test` - 测试环境
- `.env.production` - 生产环境

### 路径别名

已配置 `@/` 别名指向 `src/`：

```typescript
import { UserAPI } from '@/services'
import { useRequest } from '@/hooks'
```

## 📖 开发指南

### 创建新页面

1. 在 `src/pages/` 下创建页面目录（小驼峰，如 `productDetail/`）
2. 必备 `index.tsx`；页面私有模块放在同目录 `components/`；样式使用 **Tailwind**，不再使用页面级 `*.module.less`
3. 在 `src/router/routes.tsx` 中配置路由

详细规范请查看 [页面开发规范](./docs/PAGE_GUIDE.md)

### API 接口调用

```typescript
import { UserAPI } from '@/services'
import { toast } from '@/lib/toast'

const handleLogin = async () => {
  try {
    await UserAPI.login({ username, password })
    toast.success('登录成功')
  } catch {
    toast.error('登录失败')
  }
}
```

### 使用 Hooks (基于 ahooks)

项目使用 [ahooks](https://ahooks.js.org/) 提供 70+ 个高质量 React Hooks。

```typescript
import { useState } from 'react'
import { useRequest, useDebounce } from '@/hooks'
import { UserAPI } from '@/services'

function UserPage() {
  const [searchText, setSearchText] = useState('')
  const debouncedKeyword = useDebounce(searchText, { wait: 500 })
  const { data, loading } = useRequest(UserAPI.getUserInfo)

  return (
    <div>
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="搜索"
      />
      <p>防抖后：{debouncedKeyword}</p>
      {loading ? <div>加载中…</div> : <div>{data?.username}</div>}
    </div>
  )
}
```

### 使用工具函数

```typescript
import { formatPhone, formatDate, storage } from '@/utils'

// 格式化手机号
const phone = formatPhone('13800138000') // 138****8000

// 格式化日期
const date = formatDate(Date.now()) // 2024-01-01 12:00:00

// 本地存储
storage.set('token', 'xxx', 3600) // 保存 1 小时
const token = storage.get('token')
```

### 使用 Zustand 状态管理

```typescript
import { useUserStore, useIsLogin } from '@/store'

function MyPage() {
  const isLogin = useIsLogin()
  const { login, logout } = useUserStore()

  // 登录
  const handleLogin = () => {
    login('token', { id: 1, username: 'user', email: 'user@example.com' })
  }

  // 登出
  const handleLogout = () => {
    logout()
  }

  return (
    <div>
      <p>登录状态: {isLogin ? '已登录' : '未登录'}</p>
      <button onClick={handleLogin}>登录</button>
      <button onClick={handleLogout}>登出</button>
    </div>
  )
}
```

详细使用说明请查看 [Zustand 使用指南](./docs/ZUSTAND_GUIDE.md)

## 🎨 代码规范

### 命名规范

- **组件文件**: PascalCase (如 `UserCard.tsx`)
- **工具文件**: camelCase (如 `useRequest.ts`)
- **页面目录**: camelCase (如 `home/`, `productDetail/`)
- **组件目录**: PascalCase (如 `Common/`, `Business/`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

详细规范请查看 [项目结构指南](./docs/PROJECT_GUIDE.md)

### 导入顺序

```typescript
// 1. 第三方库
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. 项目内部模块（别名）
import { useRequest } from '@/hooks'
import { UserAPI } from '@/services'

// 3. 相对路径
import { Foo } from './components/Foo'
```

## 📝 常见问题

### 如何配置代理?

在 `vite.config.ts` 中配置:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

### 如何自定义主题？

修改 Tailwind 与设计令牌：优先调整 `src/styles/index.css`（CSS 变量）与根目录 `tailwind.config.js`，详见 [Tailwind 文档](https://tailwindcss.com/docs/configuration)。

## 📄 文档

### 📚 核心文档

- **[文档索引](./docs/README.md)** - 所有文档的导航入口
- **[快速开始](./docs/QUICK_START.md)** - 5 分钟快速上手指南
- **[项目结构](./docs/PROJECT_GUIDE.md)** - 完整的项目结构说明
- **[AI 与协作约定](./AGENTS.md)** - Cursor / Agent 规则索引与工程约定入口

### 📖 开发规范

- **[React 开发规范](./docs/REACT_GUIDE.md)** - 组件开发和代码风格规范
- **[API 开发规范](./docs/API_GUIDE.md)** - Services 模块开发规范
- **[页面开发规范](./docs/PAGE_GUIDE.md)** - 页面目录和样式规范
- **[状态管理指南](./docs/ZUSTAND_GUIDE.md)** - Zustand 使用指南
- **[Git 提交规范](./docs/GIT_COMMIT_GUIDE.md)** - Git Commit 规范和工具使用

### 🎯 按场景查找

- **开发新功能**: 快速开始 → React 规范 → API 规范 → 页面规范
- **了解项目**: 项目结构 → 快速开始
- **规范代码**: React 规范 → API 规范 → 页面规范
- **AI / Cursor 协作**: [AGENTS.md](./AGENTS.md) → `.cursor/rules/` → `docs/`

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request 来改进这个项目。

## 📄 License

MIT
