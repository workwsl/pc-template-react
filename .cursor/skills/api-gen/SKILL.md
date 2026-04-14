---
name: api-gen
description: >-
  在当前仓库中依据 OpenAPI 3.x 维护 src/services 下的 REST 封装与类型，统一经 http 实例并与 service 规范对齐。
  适用于用户提供或更新 openapi.json、HTTPS 可访问的规范 URL、或提及接口封装、DTO、Bearer、基线对比、与 http 对齐时。
  固定流程：基线对比（若存在）→ 更新实现 → 写回 openapi.json 基线 → 输出依赖分析 Markdown；契约对比必须由 Agent 执行
  scripts/openapi-diff.sh（需 jq），不纳入应用或 npm 脚本。
license: MIT
version: 2.5.0
allowed-tools: [Bash, Read, Write, Edit]
---

# OpenAPI API 生成（api-gen）

## 适用范围与前置条件

- 适用范围：本仓库及遵循同等 service 规范的前端项目。
- 规范输入：latest 必须是 OpenAPI 3.x JSON；若为 YAML，先转换为 JSON。
- 运行前置：在仓库根执行命令，且系统可用 `jq`。
- 私有规范 URL：若无法直接拉取，由用户先下载后提供本地路径。

## Quick start

1. 确认契约来源：**本地 JSON 路径**（YAML 须先转 JSON）或可 **curl** 的 URL（鉴权则用户先下载再给路径）。
2. 定模块与基线：`src/services/openapi.json`（单后端）或 `src/services/<模块>/openapi.json`（多模块）。
3. **有基线**：在仓库根执行 `bash .cursor/skills/api-gen/scripts/openapi-diff.sh <baseline> <latest>` → 再改代码。
4. **无基线**：跳过对比，实现后写回基线。
5. 完成后：覆盖写回基线 + 按 [templates/dependency-report.md](templates/dependency-report.md) 输出报告（模板底部附示例）。

细则、脚本退出码与故障排查见 [reference.md](reference.md)。

## 目录结构

```text
.cursor/skills/api-gen/
├── SKILL.md
├── reference.md              # 脚本细节、YAML、排错（按需阅读）
├── templates/
│   └── dependency-report.md  # 依赖分析报告骨架
└── scripts/
    └── openapi-diff.sh
```

**约束**：应用项目**不**依赖该脚本；**不要**在 `package.json` 中包装此脚本。业务代码遵循 [service.mdc](mdc:.cursor/rules/modules/service.mdc) 与 [request.ts](mdc:src/utils/request.ts)。

## 工作流程（顺序固定）

**对比（若有基线）→ 更新实现 → 写回基线 → 依赖分析报告**

| 场景               | 操作                                                                                                                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **首次（无基线）** | 将规范规范化保存为基线路径；按 `tags`/`paths` 在 `src/services/<模块>/` 分文件实现；同步维护 `src/services/index.ts` 聚合导出；**不写**与旧版的 diff 段落（报告中可注明首次接入）。          |
| **更新（有基线）** | **先**跑 `openapi-diff.sh` 归纳新增/删除/变更 operation 与 `components.schemas` 影响；**再**改 service 与类型；同步维护 `src/services/index.ts`；处理 `src/` 内调用方并确认删除/改签名影响。 |

### 注释生成（强制）

- 生成或更新 `src/services/<module>/index.ts`、`types.ts` 时，必须同步补齐注释，不得交付“无注释骨架”。
- 注释遵循 [comment.mdc](mdc:.cursor/rules/basic/comment.mdc)：解释 **why / 约束 / 边界**，避免逐行复述代码。
- `index.ts` 至少包含：
  - 模块级职责注释（该 API 模块封装范围与边界）
  - 每个导出方法的 JSDoc（用途、关键参数约束、返回语义）
- `types.ts` 至少包含：
  - 导出类型/接口的职责注释
  - 关键业务字段注释（单位、可空语义、枚举约束、兼容说明）
- 对 OpenAPI 中“看起来像文件流但示例是 JSON”这类歧义接口，必须在方法注释明确当前处理策略与待联调点。

### 获取最新规范

```bash
curl -sS -o /tmp/openapi-latest.json "https://example.com/openapi.json"
```

记 **latest** = 用户文件或上式输出；**baseline** = 基线路径。

### 对比阶段交付物

对比与更新阶段**不**单独向用户交付报告；变更清单用于指导实现阶段编码，**最终**在收尾输出 Markdown 报告。

### 写回基线

将已与代码对齐的最新规范**覆盖写入** `openapi.json`，供下一轮使用。

### 依赖分析报告

在 services、调用方与基线均就绪后，基于 [templates/dependency-report.md](templates/dependency-report.md) 填写并交给用户；建议路径：与基线同目录或 `src/services/<模块>/reports/`，文件名含日期更易追溯。模板底部附有填写示例，可直接对照必填项与写法。

## Diff 手段（必读摘要）

- **必须**使用 `.cursor/skills/api-gen/scripts/openapi-diff.sh`；**禁止**仅凭肉眼扫 JSON 归纳变更。
- 执行示例：`bash .cursor/skills/api-gen/scripts/openapi-diff.sh path/to/baseline.json path/to/latest.json`
- 全文 diff、operation 集合、schema 名称三节含义与退出码见 [reference.md](reference.md)。

## 关键规则

- **唯一 HTTP 入口**：`import { http } from '@/utils/request'`；禁止组件内 `axios` 裸调或 `axios.create`。
- **服务目录结构**：保持 `src/services/<module>/{index.ts,types.ts}`，并同步维护 `src/services/index.ts` 聚合导出。
- **目录与契约对齐**：`src/services/<module>/` 命名与 OpenAPI `tags`、路径资源段或团队约定一致；kebab-case segment → camelCase 目录等映射规则在全仓统一即可。
- **以接口为主**：若历史目录、导出名或类型归属与当前契约不一致，必须按契约为准迁移到正确模块，并删除旧目录/旧导出；不得为了兼容保留不匹配的 `services` 目录。
- **环境变量**：`import.meta.env.VITE_API_BASE_URL`；禁止硬编码域名。
- **错误与日志**：与 [request.ts](mdc:src/utils/request.ts) 拦截器及项目约定一致；业务错误体与契约 schema 对齐。
- **成功体**：统一信封（如 `code`/`data`）时泛型与解包与文档一致。
- **认证**：OpenAPI `security`（如 Bearer）与拦截器/全局策略一致。
- **注释完整性**：新生成/更新的 service 与类型文件必须包含可读注释，且与实现保持同步。

## 代码模式（示例）

```typescript
import { http } from '@/utils/request'
import type { UserDTO } from './types'

/** 用户查询 API（保留后端契约语义，不在此处做 ViewModel 组装）。 */
export async function fetchUser(id: string): Promise<UserDTO> {
  const { data } = await http.get<{ code: 0; data: UserDTO }>(`/api/users/${id}`)
  return data.data
}
```

路径前缀是否与 `servers`/`baseURL` 叠加，以契约与项目配置为准。

## 参考链接

- [reference.md](reference.md) — 脚本行为、YAML、排错
- [service.mdc](mdc:.cursor/rules/modules/service.mdc)
- [request.ts](mdc:src/utils/request.ts)

## 自检清单

- [ ] 仅通过 `http`；泛型与解包与 OpenAPI 一致。
- [ ] 新增/变更在 `services/`（及类型），并同步 `src/services/index.ts` 导出。
- [ ] `src/services` 目录已与 OpenAPI tags/路径约定一致，不匹配的旧目录已删除。
- [ ] 基线存在时已执行 `openapi-diff.sh` 再改代码；未向项目添加 npm 包装。
- [ ] 基线已写回。
- [ ] 已输出依赖分析 Markdown（基于模板）。
- [ ] `components.schemas` 重大变更已反映到 TS 与调用方。
- [ ] 新增/更新的 `index.ts`、`types.ts` 已补齐注释（模块、方法、关键类型/字段）。
