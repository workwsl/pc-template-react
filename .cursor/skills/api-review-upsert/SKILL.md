---
name: api-review-upsert
description: >-
  根据用户提供的 OpenAPI 3.x JSON（URL 或本地路径）审查并同步 src/services；增量合并基线、不删代码。Incrementally syncs OpenAPI 3.x into src/services via merge-baseline upsert; does not delete existing service exports.
  已存在的 path+method 对齐契约并更新实现与类型，契约中有而代码中没有则新增；不从仓库删除任何既有接口封装、类型或 openapi 基线路径。适用于用户给出 openapi.json 链接/文件、要求「只增改不删」、与完整 api-gen 相比需保留历史接口时。
license: MIT
version: 1.1.0
allowed-tools: [Bash, Read, Write, Edit]
---

# OpenAPI 接口审查（仅更新与新增）

## 与 api-gen 的差异

| 维度     | [api-gen](../api-gen/SKILL.md)                 | 本技能（api-review-upsert）                                                                 |
| -------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 契约对比 | `openapi-diff.sh`，含「仅 baseline」的删除提示 | 可用同一脚本**辅助**看差异；**忽略**「仅在 baseline」的删除清单对代码的影响                 |
| 代码     | 可按契约删除旧目录/旧导出                      | **禁止**因契约缺省而删除 service 方法、类型、模块目录                                       |
| 基线写回 | 覆盖为 latest                                  | **合并写回**：`scripts/openapi-merge-upsert.sh`（保留 baseline 独有 path/method 与 schema） |
| 收尾报告 | 依赖分析 Markdown                              | **不强制**；按需简短说明变更摘要即可                                                        |

其余约束仍与项目一致：唯一 `http` 入口、`src/services/<module>/{index.ts,types.ts}`、[service.mdc](mdc:.cursor/rules/modules/service.mdc)。**本技能的「不删除」优先于 service.mdc 中「删除旧目录」的表述。**

## 前置条件

- 规范为 **OpenAPI 3.x JSON**；YAML 须先转 JSON。
- 系统可用 `jq`；对比差异时可选跑 [api-gen 的 openapi-diff.sh](../api-gen/scripts/openapi-diff.sh)。
- 私有 URL 无法拉取时，由用户本地下载后提供路径（敏感地址与凭证勿写入仓库或技能内容）。

### 无 baseline 时

若仓库中尚无 `src/services/.../openapi.json`：可先将 **当前 latest** 复制为第一个 baseline 文件，或落一个最小 `openapi: "3.0.0" + info + 空 paths` 骨架后再跑合并脚本，避免「无文件可对齐」。

## Quick start

1. **获取 latest**：`curl -sS -o /tmp/openapi-latest.json "<url>"` 或使用用户本地文件。
2. **定基线**：`src/services/openapi.json` 或 `src/services/<模块>/openapi.json`（与项目现状一致）。
3. **（可选）对比**：`bash .cursor/skills/api-gen/scripts/openapi-diff.sh <baseline> <latest>` — 只用于识别「新增」「变更」；**不**根据「仅在 baseline」去删代码。
4. **改代码**：对每个 **latest** 中的 operation，在 services 中 **更新或新增**；对 **仅在 baseline** 或「契约已移除但仍存在于代码」的接口 **保持不动**。
5. **写回基线**：在仓库根执行  
   `bash .cursor/skills/api-review-upsert/scripts/openapi-merge-upsert.sh <baseline> <latest> <out>`  
   再将 `<out>` **覆盖**原 baseline 路径（或先 diff 确认再覆盖）。

## 合并规则（基线 JSON）

脚本行为见 [reference.md](reference.md)。要点：

- **paths**：按 path 键并集；同一 path 下，每个 **HTTP 方法**若在 latest 中存在则**整段 operation 以 latest 为准**，否则保留 baseline 该 method；仅 baseline 有的 method 保留。
- **components.schemas**：各 schema **名**并集；同名则**整段定义以 latest 为准**，否则保留 baseline 该名；仅 baseline 有的名保留。
- **openapi / info**：`openapi` 以 latest 优先；`info` 为对象字段级合并（见 reference）。

最小命令示例见 [reference.md#最小示例](reference.md#最小示例)。

## 代码侧规则

- **匹配键**：以 `METHOD` + `path`（与 OpenAPI `paths` 一致，含参数段）识别「同一接口」。
- **更新**：签名、泛型、`types.ts` 与契约一致；保留的「契约外」方法不得被误改。
- **新增**：按模块约定新增方法/类型，并维护 `src/services/index.ts`。
- **禁止**：因 latest 未包含某接口而删除其实现；因「仅在 baseline」而删 path/method。

## 自检清单

- [ ] latest 已落地（URL curl 或本地文件）。
- [ ] 已对所有 latest 中的 operation 完成更新或新增。
- [ ] 未删除任何既有 service 导出/类型/基线路径（除非用户**另行**明确要求删除）。
- [ ] 已用 `openapi-merge-upsert.sh` 写回基线，而非直接用 latest 覆盖整个文件；写回后执行 `jq empty <out>` 确认 JSON 有效。
- [ ] 可选：用 [openapi-diff.sh](../api-gen/scripts/openapi-diff.sh) 对「旧 baseline」与「合并后 out」做 diff，核对「整文件契约」与引用是否可接受。
- [ ] 仍仅通过 `@/utils/request` 的 `http` 调用。

## 参考

- [reference.md](reference.md) — 合并脚本参数与说明
- [api-gen SKILL.md](../api-gen/SKILL.md) — 注释、代码模式、diff 脚本
