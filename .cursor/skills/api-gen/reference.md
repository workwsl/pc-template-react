# api-gen — 详细参考

主流程见 [SKILL.md](SKILL.md)。本文件供 Agent 在需要细节时阅读，避免占用主 Skill 上下文。

## `scripts/openapi-diff.sh` 行为

- **依赖**：系统已安装 `jq`（缺失时提示安装方式见脚本 stderr）。
- **输入**：两个已存在的 JSON 文件路径：`baseline`、`latest`。
- **输出（三节）**：
  1. `jq -S` 规范化后的 **unified diff**（契约变化的主要依据）。
  2. `paths` 下 HTTP operation（`METHOD` + `path`）仅在一边出现的集合（**新增/删除** 接口的快速视图）。
  3. `components.schemas` **名称集合** 的 comm 对比（**重命名/增删** schema 名一目了然；字段级结构变化仍以第 1 节全文 diff 为准）。
- **退出码**：`0` 规范化后完全一致；`1` 存在差异；`2` 参数错误、文件不存在、非法 JSON 或缺少 `jq`；其他非 0 为 `diff` 异常。

**重要**：同一 path/method 下仅改 request/response/schema 引用时，第 2 节 operation 行可能不变，**必须以第 1 节全文 diff 为准**。

**可选交叉验证**：可选用 `openapi-diff` 等 CLI；**默认仍以本 Skill 脚本为准**，避免与项目约定漂移。

## 与 `package.json` 的关系

- 脚本**不**加入 `npm scripts`，**不**作为应用或 CI 依赖。
- 仅由 Agent 在需要对比时以 **Bash** 从仓库根执行。

## 与项目 service 规范的对齐

- 请求入口统一为 `@/utils/request` 的 `http`，禁止生成 `@/api/http` 或额外 `axios.create`。
- Service 结构保持 `src/services/<module>/{index.ts,types.ts}`。
- 模块新增或变更后，同步维护 `src/services/index.ts` 聚合导出。
- 若 operation 删除或签名变化，需在 `src/` 范围扫描并处理调用方影响。
- 注释生成遵循 [comment.mdc](mdc:.cursor/rules/basic/comment.mdc)：优先说明约束、边界和取舍，而非逐句复述实现。

## 注释最小模板（可直接套用）

以下模板用于保证新生成 service 文件具备统一可读性；按模块语义替换名称与描述。

### `index.ts` 模板

```ts
import { http } from '@/utils/request'
import type { ApiResponse } from '@/utils/request'
import type { DemoListQuery, DemoListResponse } from './types'

/**
 * Demo API：
 * 仅负责契约请求封装，不在 service 层做页面视图模型转换。
 */
export const DemoAPI = {
  /**
   * 分页查询 Demo 列表。
   * @param query 查询参数；分页与筛选规则由后端契约定义
   * @returns 业务信封响应，调用方按需读取 `data`
   */
  list(query?: DemoListQuery): Promise<ApiResponse<DemoListResponse>> {
    return http.get<DemoListResponse>('/api/demo', { params: query })
  },
}
```

### `types.ts` 模板

```ts
/** Demo 列表查询参数。 */
export interface DemoListQuery {
  /** 页码（从 1 开始）。 */
  page?: number
  /** 每页条数。 */
  size?: number
}

/** Demo 列表单行数据。 */
export interface DemoListItem {
  /** 记录主键 ID。 */
  id?: number
  /** 展示名称。 */
  name?: string
}

/** Demo 分页响应主体。 */
export interface DemoListResponse {
  /** 当前页数据。 */
  content?: DemoListItem[]
  /** 总记录数。 */
  total?: number
}
```

### 歧义接口注释模板（文件流/下载）

```ts
/**
 * 导出明细文件。
 * OpenAPI 当前示例为 JSON，但后端可能返回二进制流；
 * 现阶段保持 ApiResponse 以对齐契约，联调后按真实响应决定是否切换为 blob。
 */
```

## 注释快速检查

- `index.ts` 是否有模块级职责注释 + 每个方法 JSDoc。
- `types.ts` 是否有类型职责注释 + 关键字段语义（单位/可空/枚举）注释。
- 注释是否说明“为什么/边界”，而不是“这行代码做了什么”。
- 注释是否与当前实现一致（参数名、返回值、策略未过期）。

## YAML 输入

若用户仅有 `.yaml` / `.yml`，需先转为 JSON（或由用户指定工具）再参与 diff 与基线落盘；基线文件名为 `openapi.json`。

## 故障排查

| 现象                    | 处理                                                      |
| ----------------------- | --------------------------------------------------------- |
| `jq: command not found` | 安装 `jq` 后重试；勿在应用内引入 jq 依赖。                |
| diff 过大               | 先根据第 2、3 节缩小范围，再对第 1 节相关 path 片段精读。 |
| 私有 URL 无法拉取       | 请用户本地下载后提供**本地路径**。                        |
