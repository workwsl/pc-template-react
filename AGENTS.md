# AI 与协作约定（pc-template-react）

本文件为仓库级入口，便于 Agent Skill、`docs` 与工具链引用同一说明；并约定 AI Agent（含 Cursor Agent）的协作方式，目标是稳定产出、降低返工、避免规范漂移。

**仓库角色**：本仓库为 **PC 端 Web 模板**，用于快速搭建中后台或桌面优先类产品。

**分支说明**：本文件以 **`main`（shadcn/ui 线）** 为准。`react19-antd6`、`react18antd5` 等变体分支各自维护各自的 `AGENTS.md` 与 `.cursor/rules`，不强制与本分支对齐。若在 **`react19-antd6`** 等分支的 worktree 中工作（例如目录名为 `pc-template-react-react19-antd6`），请打开该检出目录内的 `AGENTS.md` 与 `.cursor/rules`，勿以本文件为栈与样式真源。

## 工程概览

- **技术栈**：React 19、TypeScript、Vite 7、React Router 7（`HashRouter`）、Tailwind CSS、shadcn/ui、Zustand、ahooks；通知为 **Sonner**（`App.tsx` 中 `<Toaster />`，业务侧多用 `@/lib/toast`）。
- **运行要求**：Node.js **>= 20**（见 `package.json` 的 `engines`）。
- **路径别名**：`@/` → `src/`。
- **路由**：路由表在 `src/router/routes.tsx`；全局守卫在 `src/router/AuthGuard.tsx`。非 React 上下文跳转使用 `src/router/navigate.ts`（由 `App.tsx` 注入 `setNavigate`）。
- **HTTP**：统一 `import { http } from '@/utils/request'`（Axios 封装），业务封装在 `src/services/<module>/`。
- **格式基线**（与 Prettier/ESLint 一致）：`semi: false`、`singleQuote: true`、`arrowParens: 'avoid'`。

## 基本原则

- **单一真源**：硬约束以 `.cursor/rules/` 为准，解释与示例以 `docs/` 为准。
- **小步快跑**：优先最小可行改动，避免无关重构。
- **先验证再结束**：有条件必须跑检查并汇报结果。
- **不破坏用户现场**：不回滚与任务无关的改动，不执行高风险破坏命令。
- **透明沟通**：说明改了什么、为什么改、如何验证。

### 规则执行优先级（必须遵守）

1. 先识别任务场景（页面 / 服务 / 状态 / 工具 / 文档）。
2. 先读总纲与基础规则（`ai.mdc` + `basic/*`）。
3. 再读场景规则（`modules/*`）。
4. 对齐仓库内邻近实现后再改动。
5. 交付前完成最小自检并报告。

## 规则与文档（单一真源）

| 用途                              | 位置                                                 |
| --------------------------------- | ---------------------------------------------------- |
| AI 执行总纲、规则分层             | [`.cursor/rules/ai.mdc`](.cursor/rules/ai.mdc)       |
| 规则索引                          | [`.cursor/rules/README.md`](.cursor/rules/README.md) |
| 基础规范                          | [`.cursor/rules/basic/`](.cursor/rules/basic/)       |
| 分层模块（页面、service、路由等） | [`.cursor/rules/modules/`](.cursor/rules/modules/)   |
| 教程与长说明                      | [`docs/README.md`](docs/README.md)                   |
| 可选自动化能力                    | [`.cursor/skills/`](.cursor/skills/) 下各 `SKILL.md` |

**边界**：

- `rules` 只放短、硬、可判定的约束；`docs` 放教程、背景、示例、排障。
- 若两者冲突：先遵循 `rules`，再修正文档。
- 具体硬约束不在本文件重复维护正文；推荐查阅顺序：`.cursor/rules/ai.mdc` → `basic/basic.mdc` → `modules/*.mdc`。

**变更同步**：修改 `.prettierrc`、`eslint.config.js`、`package.json` 中 scripts 等时，请同步更新 `docs/` 与对应 `.cursor/rules/`。涉及规范的变更需更新 `docs/README.md`；新增或调整规则范围时同步更新 `.cursor/rules/README.md`。避免在多份文档重复粘贴同一规则，优先链接引用。

## Agent 标准工作流

1. 理解任务与影响面（必要时先读 rules/docs）。
2. 制定最小改动方案。
3. 修改代码或文档。
4. 自检（至少检查受影响文件）。
5. 运行质量检查（按任务相关度执行）。
6. 输出变更说明与验证结果。

## 质量门禁（建议顺序）

```bash
npm run lint
npm run build
npm run check:types
```

若任务仅改文档，可不跑完整构建，但需说明未执行项与原因。质量门禁脚本与边界以 `.cursor/rules/basic/lint.mdc` 为准。

## Git 与提交规范

见 [`.cursor/rules/basic/git-commit.mdc`](.cursor/rules/basic/git-commit.mdc)。

## 完成定义（Definition of Done）

- 改动与需求一致，无额外副作用。
- 受影响范围有对应验证证据。
- 说明清晰：变更点、原因、验证、剩余风险（若有）。
