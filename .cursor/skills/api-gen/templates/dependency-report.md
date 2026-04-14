# OpenAPI 依赖分析报告

> 由 api-gen 工作流生成；将 `[占位符]` 替换为实际内容。

## 1. 本次上下文

- **模块**：`[例如：src/services/]`
- **基线路径**：`[path/to/openapi.json]`
- **最新规范路径**：`[path/to/latest-openapi.json]`
- **对比结论**：`[首次接入 | 有变更摘要：…]`
- **接口变更计数**：`[新增 N | 删除 N | 变更 N]`
- **Breaking Change 判断**：`[是/否 + 依据]`

## 2. 变更与实现摘要

| 类型 | OpenAPI | 已落地文件/导出 |
| ---- | ------- | ---------------- |
| 新增 | … | … |
| 删除 | … | … |
| 变更 | … | … |

> 最小要求：本节必须明确每类变更的数量、对应 operation 或 schema、以及落地文件。

## 3. 依赖扫描（`src/`）

对本次涉及 service 导出与类型的 **import / 调用** 列表：

| 文件 | 用途 / 备注 |
| ---- | ------------- |
| … | … |

**需人工跟进**（若有）：删除或签名变更后仍可疑的调用点。
**影响模块汇总（必填）**：`[列出受影响 page/component/store/hook/service]`

## 4. 契约与类型注意点

- 响应信封 / `data` 解包与 OpenAPI 一致性：
- `components.schemas` 与 TS 类型对齐情况：
- 已知风险或待测项：

## 5. 后续建议（可选）

- …

---

## 附：填写示例（参考）

> 以下内容仅用于示范写法，实际交付请替换为真实路径、数量与结论。

### 1. 本次上下文（示例）

- **模块**：`src/services/user/`
- **基线路径**：`src/services/openapi.json`
- **最新规范路径**：`/tmp/openapi-latest.json`
- **对比结论**：`有变更：新增 2 个接口，删除 0 个接口，变更 1 个接口响应结构`
- **接口变更计数**：`新增 2 | 删除 0 | 变更 1`
- **Breaking Change 判断**：`否；原有接口路径与必填参数未发生破坏性变化`

### 2. 变更与实现摘要（示例）

| 类型 | OpenAPI | 已落地文件/导出 |
| ---- | ------- | ---------------- |
| 新增 | `POST /api/auth/invite` | `src/services/auth/index.ts` 新增 `createInvite()` 并在 `src/services/index.ts` 聚合导出 |
| 新增 | `GET /api/auth/invite/{id}` | `src/services/auth/index.ts` 新增 `getInviteDetail()` |
| 变更 | `GET /api/auth/profile` 响应新增 `statusLabel` 字段 | `src/services/auth/types.ts` 更新 `UserProfileDTO`，调用方按新字段渲染 |

### 3. 依赖扫描（示例）

| 文件 | 用途 / 备注 |
| ---- | ------------- |
| `src/pages/dashboard/index.tsx` | 调用 `getInviteDetail()` 展示邀请详情 |
| `src/pages/settings/index.tsx` | 调用 `createInvite()` 生成邀请 |
| `src/pages/settings/components/InviteCard.tsx` | 消费 `UserProfileDTO.statusLabel` |

**需人工跟进**（若有）：`src/pages/settings/index.tsx` 的空态分支尚未覆盖新字段兜底。  
**影响模块汇总（必填）**：`pages/settings`、`pages/dashboard`、`services/user`

### 4. 契约与类型注意点（示例）

- 响应信封 / `data` 解包与 OpenAPI 一致性：已按 `{ code, data }` 信封解包，与当前请求封装一致。
- `components.schemas` 与 TS 类型对齐情况：`UserProfile` 已同步到 `UserProfileDTO`，新增字段 `statusLabel?: string`。
- 已知风险或待测项：后端若返回 `statusLabel = null`，前端需确认展示兜底文案。
