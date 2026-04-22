# api-review-upsert — 参考

主流程见 [SKILL.md](SKILL.md)。

## `scripts/openapi-merge-upsert.sh`

- **用途**：将 **latest** OpenAPI 文档以「只增改、不删 path/method/schema 名」方式合并进 **baseline**，得到下一轮基线。
- **依赖**：`jq`（与 api-gen 一致）。
- **用法**：

```bash
bash .cursor/skills/api-review-upsert/scripts/openapi-merge-upsert.sh \
  path/to/baseline.json \
  path/to/latest.json \
  path/to/openapi-merged.json
```

- **成功**：退出码 `0`，写出第三参数文件。
- **失败**：文件缺失、非法 JSON、缺少 `jq` → 非 0，stderr 说明原因。

### 合并语义摘要

| 区域                                   | 行为                                                                                                                                                                                   |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paths` 键集合                         | baseline 与 latest 的 path 键 **并集**。                                                                                                                                               |
| 每个 `paths/<path>` 下的 **HTTP 方法** | 各 method 名并集。若某 method 在 **latest** 的该 path 下存在，则**整段** operation 对象以 latest 为准；否则用 baseline 中该 method；仅 baseline 有的 method **保留**。                 |
| `components.schemas`                   | 各 **schema 名**并集。若名在 **latest** 中存在，则**整段** schema 对象以 latest 为准；否则用 baseline 中该名；仅 baseline 有的名 **保留**。                                            |
| `openapi`                              | `latest.openapi // baseline.openapi`                                                                                                                                                   |
| `info`                                 | `baseline.info * latest.info`（jq 对象相乘，**同名字段**以 latest 为准，其余 baseline 键可保留；与 paths/schemas 的「整段」策略不同。）                                                |
| 其他顶层键                             | 保留 `baseline`，若 `latest` 存在同名顶层键则 **整键**以 latest 替换（与 `paths`/`components.schemas` 的细粒度合并不同；若规范大量依赖其他顶层块，应用全文 diff 对合并结果人工核对）。 |

**注意**：

- `components` 下除 `schemas` 外的子键（如 `responses`、`securitySchemes`）仍按原逻辑：在 `reduce` 中若 `latest` 有该子键则 **整子键** 替换，否则保留 baseline。复杂项目若出现 `$ref` 断裂，应用全文 diff 对合并结果做一次人工检查。

### 与 `openapi-diff.sh` 的配合

合并得到新基线后，可对 `baseline` 与 `openapi-merged.json` 再跑一次 api-gen 的 `openapi-diff.sh`：此时「仅在 baseline」的 operation 应明显减少或消失（因已保留）；若仍有，说明合并或输入有误。

## YAML 输入

须先转为 JSON 再参与合并与 diff；基线落盘文件名仍为 `openapi.json`。

## 最小示例

在仓库根目录执行（将 URL 与路径换成你的环境）：

```bash
curl -sS -o /tmp/openapi-latest.json "https://example.com/openapi.json"
# baseline 为仓库内已有文件，或先把 latest 复制一份作为首版基线
bash .cursor/skills/api-review-upsert/scripts/openapi-merge-upsert.sh \
  src/services/openapi.json \
  /tmp/openapi-latest.json \
  /tmp/openapi-merged.json
jq empty /tmp/openapi-merged.json
# 确认后再: cp /tmp/openapi-merged.json src/services/openapi.json
```

若尚无 `src/services/openapi.json`，可先用 `cp /tmp/openapi-latest.json src/services/openapi.json` 或手写最小 3.0 骨架，再于后续轮次用本脚本做 upsert 合并。
