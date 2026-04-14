# Cursor 规则说明

本目录只放“硬约束（必须遵守）”；教程、示例和解释统一放在 `docs/`。

## 总纲入口

- [ai.mdc](mdc:.cursor/rules/ai.mdc) 为本仓库规则总纲（alwaysApply），定义分层、执行流程与边界。

## 执行总纲

1. 先读全局规则（alwaysApply）
2. 根据任务场景选择分层规则（`basic/*`、`modules/*`）
3. 对齐仓库内已有实现风格后再改动
4. 交付前完成最小自检（受影响文件、类型、lint/构建按需）

## 规则文件结构建议

每个规则文件建议采用统一结构，方便检索与执行：

- 基础规范：适用范围、目标、实现边界
- 强制行为：必须执行，可检查
- 禁止行为：明确禁止，可检查
- 示例代码：正反例或引用仓库内实现

## 单一真源约定

- `ai.mdc` 只维护“分层、流程、边界”
- `README.md` 只维护“导航与索引”
- 具体规则正文仅维护在 `basic/*` 与 `modules/*`

## 规则分层

### 全局规则（alwaysApply）

1. `ai.mdc`：规则总纲（首读）
2. `basic/project-overview.mdc`：项目技术栈与目录基线

### `basic/`（必须调用）

- `project-overview.mdc`
- `basic.mdc`
- `code-quality.mdc`
- `ts.mdc`
- `react.mdc`
- `style.mdc`
- `comment.mdc`
- `code-names.mdc`
- `lint.mdc`
- `git-commit.mdc`

### `modules/`（按需）

- `components.mdc`
- `pages.mdc`
- `hooks.mdc`
- `service.mdc`
- `route.mdc`
- `constants.mdc`
- `utils.mdc`
- `store.mdc`

### 旧文件状态

- 旧平铺规则文件已删除，正文维护统一在 `basic/` 与 `modules/`

## 场景与调用建议

- 页面开发：`basic/react.mdc` + `basic/style.mdc` + `modules/pages.mdc`
- 服务封装：`basic/ts.mdc` + `basic/code-quality.mdc` + `modules/service.mdc`
- 状态管理：`basic/ts.mdc` + `modules/store.mdc` + `modules/constants.mdc`
- 通用工具：`basic/code-quality.mdc` + `modules/utils.mdc` + `modules/route.mdc`

## 维护原则

- rules 只保留短规则和边界，不放长教程
- docs 负责示例、背景和排障
- 修改 `.prettierrc`、`eslint.config.js`、`package.json scripts` 时，需同步更新 docs 与对应 rules

## 相关文档

- [AGENTS.md](../../AGENTS.md)（仓库协作与 AI 入口）
- [快速开始指南](../../docs/QUICK_START.md)
- [项目结构指南](../../docs/PROJECT_GUIDE.md)
- [React 开发规范](../../docs/REACT_GUIDE.md)
- [API 开发规范](../../docs/API_GUIDE.md)
- [页面开发规范](../../docs/PAGE_GUIDE.md)
- [状态管理指南](../../docs/ZUSTAND_GUIDE.md)
- [代码格式化配置](../../docs/FORMAT_CONFIG.md)
