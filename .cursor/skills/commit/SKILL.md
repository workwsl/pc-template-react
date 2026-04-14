---
name: commit
description: >-
  审查 git 变更与暂存区，按路径选择性暂存（排除密钥、依赖与构建产物），起草 Conventional Commits
  说明，并在用户确认后再执行 git commit。适用于用户要 提交、commit、提交代码、写提交说明、暂存并提交、
  或 review staged changes 时。
disable-model-invocation: true
allowed-tools: [Bash, AskQuestion]
---

# Git 提交

## 前置

- **显式启用**：`disable-model-invocation: true`，模型不会自动挂载本 skill；仅在用户 **@ / 本 skill** 或明确要执行「审查变更 → 起草说明 → 确认后提交」时再按本流程执行，避免日常对话误跑 git。
- 在**仓库根目录**执行；若当前工作区不是 git 仓库，说明情况并停止。
- **禁止**在 commit message、终端说明或日志中写入密钥、token、完整 `.env` 内容。
- 需要网络、钩子或身份配置时以实际环境为准。

## 步骤

1. **查看变更**：`git status`；若需写说明或核对内容，再运行 `git diff`（未暂存）与 `git diff --staged`（已暂存）。
2. **暂存**：若用户意图为提交当前改动而暂存区为空，使用 `git add <路径…>` **只**加入本次相关文件；**排除** `.env`、`.env.*`、`node_modules/`、`dist/`、`build/`、覆盖率输出、锁文件以外的误加依赖、编辑器与系统垃圾文件等；**勿**使用 `git add .` 盲加。若用户已手动 `git add`，尊重现有暂存区，除非用户要求调整。
3. **撰写说明**：根据 `git diff --staged` 起草 **Conventional Commits** 标题行：`<type>(optional scope): <简短描述>`（描述用祈使语气、中文或英文与仓库习惯一致）。
   - 常用 `type`：`feat` 新功能、`fix` 修复、`refactor` 重构（行为不变）、`docs` 文档、`chore`/`style`/`test`/`ci` 等。
   - **破坏性变更**：在标题加 `!`（如 `feat(api)!: …`）或正文含 `BREAKING CHANGE:` 说明。
   - 需要**多行正文**时：优先向用户展示完整草稿；执行可用 `git commit -m "标题" -m "正文"`，或 `git commit` 打开编辑器（需用户环境支持），**勿**在未确认时提交。
4. **用户确认**：用 **AskQuestion**（或等效「展示选项并等待选择」）展示建议的**完整**标题（及多行时的正文）；用户确认后再执行 `git commit`；**禁止**未确认时代为提交。
5. **失败处理**：若 `git commit` 失败（钩子、冲突、`user.name`/`user.email` 未配置等），根据终端输出说明原因与下一步，避免重复无效命令。
6. **`--no-verify`**：仅在用户**明确要求**跳过钩子时使用；否则默认遵守 hooks。

## 示例 message

```text
feat(articles): 添加列表分页加载

fix(auth): 登录态过期后不再发起受保护请求

refactor(api): 抽取 hono-api 响应解析

docs(env): 补充 VITE_API_BASE_URL 说明

feat(parser)!: 更换 AST 格式

BREAKING CHANGE: 旧版插件需重新生成
```

## 附加资源

本流程独立；若需完整约定，见 [Conventional Commits](https://www.conventionalcommits.org/)。
