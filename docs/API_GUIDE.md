# API 开发规范

本文档规定了 Services 模块的目录结构、类型命名规范和开发流程。

## 📁 目录结构

```
src/services/
├── index.ts              # 统一导出
├── user/                 # 用户模块
│   ├── index.ts         # API 方法定义
│   └── types.ts         # 类型定义
├── product/             # 产品模块
│   ├── index.ts
│   └── types.ts
└── order/               # 订单模块
    ├── index.ts
    └── types.ts
```

## 📋 类型命名规范

### 核心规则

为避免不同模块间的类型重复和命名冲突,**所有类型必须使用模块前缀命名**。

**格式**: `模块名 + 类型描述`

### 命名约定

| 类型用途  | 命名格式                   | 示例                                       |
| --------- | -------------------------- | ------------------------------------------ |
| 信息/实体 | `模块名 + Info`            | `UserInfo`, `ProductInfo`                  |
| 列表项    | `模块名 + Item`            | `UserItem`, `ProductItem`                  |
| 请求参数  | `模块名 + 操作 + Params`   | `UserLoginParams`, `ProductCreateParams`   |
| 响应数据  | `模块名 + 操作 + Response` | `UserLoginResponse`, `ProductListResponse` |
| 状态枚举  | `模块名 + Status`          | `OrderStatus`, `UserStatus`                |
| 类型枚举  | `模块名 + Type`            | `ProductType`, `OrderType`                 |

### 示例对比

```typescript
// ❌ 错误 - 没有模块前缀
export interface Info {}
export interface Params {}
export interface Response {}

// ✅ 正确 - 使用模块前缀
export interface UserInfo {}
export interface UserLoginParams {}
export interface UserLoginResponse {}
```

## 📝 文件规范

### 1. types.ts - 类型定义文件

**职责**: 定义该模块相关的所有 TypeScript 类型

**示例**:

```typescript
/**
 * 用户相关类型定义
 */

// 用户信息
export interface UserInfo {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 头像 */
  avatar?: string
  /** 手机号 */
  phone?: string
}

// 登录参数
export interface UserLoginParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

// 登录响应
export interface UserLoginResponse {
  /** 令牌 */
  token: string
  /** 用户信息 */
  userInfo: UserInfo
}

// 用户状态枚举
export enum UserStatus {
  /** 活跃 */
  Active = 'active',
  /** 禁用 */
  Inactive = 'inactive',
  /** 封禁 */
  Banned = 'banned',
}
```

### 2. index.ts - API 方法定义文件

**职责**: 定义该模块的所有 API 方法

**示例**:

```typescript
import { http } from '@/utils/request'
import type { UserLoginParams, UserLoginResponse, UserInfo } from './types'

/**
 * 用户相关 API
 */
export const UserAPI = {
  /**
   * 用户登录
   */
  login(params: UserLoginParams) {
    return http.post<UserLoginResponse>('/user/login', params)
  },

  /**
   * 获取用户信息
   */
  getUserInfo() {
    return http.get<UserInfo>('/user/info')
  },

  /**
   * 更新用户信息
   */
  updateUserInfo(data: Partial<UserInfo>) {
    return http.put<UserInfo>('/user/info', data)
  },

  /**
   * 退出登录
   */
  logout() {
    return http.post<void>('/user/logout')
  },
}

// 导出类型，方便外部使用
export type { UserInfo, UserLoginParams, UserLoginResponse } from './types'
```

### 3. index.ts - 统一导出

```typescript
// src/services/index.ts
export * from './user'
export * from './product'
export * from './order'
```

## 📚 创建新模块步骤

### 步骤 1: 创建目录结构

```bash
mkdir -p src/services/product
```

### 步骤 2: 创建 types.ts

```typescript
// src/services/product/types.ts
export interface ProductInfo {
  /** 产品ID */
  id: number
  /** 产品名称 */
  name: string
  /** 产品价格 */
  price: number
  /** 产品描述 */
  description?: string
}

export interface ProductListParams {
  /** 页码 */
  page?: number
  /** 每页条数 */
  pageSize?: number
  /** 分类 */
  category?: string
}

export interface ProductListResponse {
  /** 产品列表 */
  list: ProductInfo[]
  /** 总条数 */
  total: number
}
```

### 步骤 3: 创建 index.ts

```typescript
// src/services/product/index.ts
import { http } from '@/utils/request'
import type { ProductInfo, ProductListParams, ProductListResponse } from './types'

export const ProductAPI = {
  /**
   * 获取产品列表
   * @param params 查询参数
   * @returns 产品列表
   */
  getList(params?: ProductListParams) {
    return http.get<ProductListResponse>('/products', { params })
  },

  /**
   * 获取产品详情
   * @param id 产品ID
   * @returns 产品详情
   */
  getDetail(id: number) {
    return http.get<ProductInfo>(`/products/${id}`)
  },

  /**
   * 创建产品
   * @param data 创建产品数据
   * @returns 创建产品
   */
  create(data: Omit<ProductInfo, 'id'>) {
    return http.post<ProductInfo>('/products', data)
  },
}

export type { ProductInfo, ProductListParams, ProductListResponse } from './types'
```

### 步骤 4: 在 services/index.ts 中导出

```typescript
// src/services/index.ts
export * from './user'
export * from './product'
```

### 步骤 5: 在组件中使用

```typescript
import { ProductAPI, ProductInfo } from '@/services'

/**
 * 产品列表
 */
const ProductList = () => {
  const { data, loading } = useRequest(() => ProductAPI.getList())

  return (
    <div>
      {data?.list.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

## ✅ 最佳实践

### 1. 类型定义

- ✅ 使用有意义的类型名称
- ✅ 为每个类型添加 JSDoc 注释
- ✅ 使用 `interface` 定义对象类型
- ✅ 使用 `type` 定义联合类型、交叉类型等
- ✅ 可选属性使用 `?`
- ✅ 导出所有需要在模块外部使用的类型

### 2. API 方法

- ✅ 使用统一的命名规范：`模块名API`（如 `UserAPI`, `ProductAPI`）
- ✅ 每个方法都有清晰的 JSDoc 注释
- ✅ 使用类型导入 (`import type`) 提高性能
- ✅ 在文件末尾统一导出类型
- ✅ 使用 `http` 工具函数进行请求

### 3. 导入导出

- ✅ 在 `src/services/index.ts` 中统一导出
- ✅ 使用 `export *` 导出模块的所有内容
- ✅ 类型和 API 方法都可以从 `@/services` 导入

```typescript
// 在组件中使用
import { UserAPI, UserInfo, ProductAPI, ProductInfo } from '@/services'
```

### 4. 类型复用

对于**跨模块使用的通用类型**，应该提取到公共类型文件：

```typescript
// src/services/types/common.ts
/**
 * 通用类型定义
 */

/**
 * 分页参数（多个模块使用）
 */
export interface PaginationParams {
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/**
 * 分页响应（多个模块使用）
 */
export interface PaginationResponse<T> {
  /** 列表 */
  list: T[]
  /** 总条数 */
  total: number
  /** 页码 */
  page: number
  /** 每页条数 */
  pageSize: number
}
```

然后在各模块中使用：

```typescript
// src/services/user/types.ts
import type { PaginationParams } from '../types/common'

export interface UserListParams extends PaginationParams {
  /** 用户状态 */
  status?: UserStatus
}
```

## 🔍 类型检测机制

### 1. 自动化检测脚本

项目提供了自动化检测脚本 `scripts/check-api-types.js`，可以：

- ✅ 检测重复的类型定义
- ✅ 检测命名规范违规
- ✅ 统计类型数量
- ✅ 提供修复建议

**使用方法**:

```bash
npm run check:types
```

### 2. TypeScript 编译检查

TypeScript 编译器会自动检测类型冲突：

```bash
npm run build
```

### 3. 手动检查清单

在创建新类型时，检查以下事项：

- [ ] 类型名是否以模块名开头？
- [ ] 是否与其他模块的类型名冲突？
- [ ] 命名是否清晰表达类型的用途？
- [ ] 是否遵循项目的命名约定？

## 🚫 常见错误

### ❌ 错误示例

```typescript
// 错误 1: 没有模块前缀
export interface Info {}
export interface Params {}

// 错误 2: 模块前缀不一致
export interface UserInfo {}
export interface ProductInfo {}
export interface OrderData {} // 应该用 OrderInfo

// 错误 3: 命名不清晰
export interface UserParams {} // 应该用 UserLoginParams 或 UserUpdateParams
```

### ✅ 正确示例

```typescript
// 正确: 使用模块前缀
export interface UserInfo {}
export interface ProductInfo {}
export interface OrderInfo {}

// 正确: 清晰的命名
export interface UserLoginParams {}
export interface UserUpdateParams {}
export interface ProductCreateParams {}
```

## 🎯 优势

1. **清晰的职责分离**: 类型定义和 API 方法分开，便于维护
2. **更好的代码组织**: 模块化结构，易于扩展
3. **类型安全**: 完整的 TypeScript 类型支持
4. **易于查找**: 目录结构清晰，方便定位代码
5. **统一的规范**: 所有模块遵循相同的结构
6. **避免冲突**: 模块前缀命名避免类型重复

## 📖 示例模块

参考 `src/services/user/` 目录下的文件作为标准示例。

## 📚 相关文档

- [快速开始指南](./QUICK_START.md)
- [项目结构指南](./PROJECT_GUIDE.md)
