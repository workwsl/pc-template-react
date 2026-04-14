# Git 提交规范指南

本项目使用 **Conventional Commits** 规范来管理 Git 提交，配合 husky、lint-staged 和 commitlint 工具，确保代码质量和提交信息的规范性。

## 🚀 快速开始

```bash
# 交互式提交（推荐）
npm run commit

# 手动提交
git commit -m "feat: 添加新功能"

# 生成 CHANGELOG
npm run changelog
```

## 📋 目录

- [快速开始](#快速开始)
- [为什么需要规范](#为什么需要规范)
- [Commit 消息格式](#commit-消息格式)
- [提交类型说明](#提交类型说明)
- [提交流程](#提交流程)
- [工具说明](#工具说明)
- [常见问题](#常见问题)
- [示例](#示例)
- [配置说明](#配置说明)

## 🎯 为什么需要规范

1. **自动生成 CHANGELOG**：规范的提交信息可以自动生成版本更新日志
2. **语义化版本控制**：根据提交类型自动确定版本号升级规则
3. **提高可读性**：统一的格式让团队成员快速理解每次提交的目的
4. **代码质量保障**：提交前自动执行代码检查和格式化
5. **便于追溯**：清晰的提交历史便于问题排查和代码审查

## 📝 Commit 消息格式

每个 commit 消息由 **header**、**body** 和 **footer** 组成：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Header（必需）

Header 是必需的，包含三个部分：

```
<type>(<scope>): <subject>
```

- **type**（必需）：提交类型，见下方说明
- **scope**（可选）：影响范围，如 `user`、`product`、`api` 等
- **subject**（必需）：简短描述，不超过 50 字符

**规则：**

- Header 总长度不超过 100 字符
- type 必须小写
- subject 不能以句号结尾
- subject 使用祈使句，如 "add" 而不是 "added" 或 "adds"

### Body（可选）

详细描述本次提交的内容，可以分多行：

- 说明代码变动的动机
- 与之前行为的对比
- 每行不超过 100 字符

### Footer（可选）

用于关闭 Issue 或说明不兼容变动：

```
Closes #123, #456
BREAKING CHANGE: 说明不兼容的变动
```

## 🏷️ 提交类型说明

| Type       | 说明                                   | 示例                                    |
| ---------- | -------------------------------------- | --------------------------------------- |
| `feat`     | 新功能（feature）                      | `feat(user): 添加用户登录功能`          |
| `fix`      | 修复 bug                               | `fix(api): 修复用户信息接口返回错误`    |
| `docs`     | 文档更新                               | `docs: 更新 README 安装说明`            |
| `style`    | 代码格式（不影响代码运行的变动）       | `style: 格式化代码，统一缩进`           |
| `refactor` | 重构（既不是新增功能，也不是修复 bug） | `refactor(store): 优化用户状态管理`     |
| `perf`     | 性能优化                               | `perf(list): 优化列表渲染性能`          |
| `test`     | 增加测试                               | `test(utils): 添加格式化工具单元测试`   |
| `chore`    | 构建过程或辅助工具的变动               | `chore: 升级依赖包版本`                 |
| `revert`   | 回滚之前的 commit                      | `revert: 回滚 feat(user): 添加登录功能` |
| `build`    | 构建系统或外部依赖的变动               | `build: 修改 vite 配置`                 |
| `ci`       | CI 配置文件和脚本的变动                | `ci: 添加 GitHub Actions 配置`          |

## 🚀 提交流程

### 方式一：使用 Commitizen（推荐）

Commitizen 提供交互式界面，引导你完成规范的提交：

```bash
# 1. 添加文件到暂存区
git add .

# 2. 使用 commitizen 提交（会自动执行代码检查）
npm run commit

# 3. 按照提示选择 type、填写 scope、subject 等
# 4. 推送到远程仓库
git push
```

### 方式二：手动提交

如果你熟悉规范，也可以直接使用 `git commit`：

```bash
# 1. 添加文件到暂存区
git add .

# 2. 提交（会自动执行代码检查和消息验证）
git commit -m "feat(user): 添加用户登录功能"

# 3. 推送到远程仓库
git push
```

## 🔧 工具说明

### 1. Husky

Git Hooks 管理工具，在特定的 Git 操作时自动执行脚本。

**配置的 Hooks：**

- **pre-commit**：提交前执行 lint-staged
- **commit-msg**：提交时验证消息格式

### 2. lint-staged

只对暂存区的文件执行检查和格式化，提高效率。

**检查内容：**

- TypeScript/JavaScript 文件：
  - ESLint 自动修复
  - Prettier 格式化
  - TypeScript 类型检查
- Less/CSS 文件：Prettier 格式化
- JSON/Markdown 文件：Prettier 格式化

**手动执行：**

```bash
npm run lint:staged
```

### 3. Commitlint

验证 commit 消息是否符合 Conventional Commits 规范。

**配置文件：** `commitlint.config.js`

### 4. Commitizen

交互式提交工具，引导你创建规范的提交消息。

**使用：**

```bash
npm run commit
```

### 5. Standard Version

自动生成 CHANGELOG 和管理版本号。

**使用：**

```bash
# 自动升级版本、生成 CHANGELOG、创建 tag
npm run changelog

# 首次发布
npm run changelog -- --first-release

# 指定版本号
npm run changelog -- --release-as 1.0.0

# 预发布版本
npm run changelog -- --prerelease alpha
```

**版本升级规则：**

- `feat`：升级 minor 版本（0.1.0 -> 0.2.0）
- `fix`：升级 patch 版本（0.1.0 -> 0.1.1）
- `BREAKING CHANGE`：升级 major 版本（0.1.0 -> 1.0.0）

## ❓ 常见问题

### 1. 提交时代码检查失败怎么办？

**问题：** pre-commit hook 执行失败，提交被阻止。

**解决：**

```bash
# 查看具体错误信息
npm run lint

# 自动修复 ESLint 错误
npm run lint:fix

# 格式化代码
npm run format

# 修复后重新提交
git add .
git commit -m "fix: 修复代码规范问题"
```

### 2. Commit 消息格式验证失败

**问题：** commit-msg hook 提示消息格式不符合规范。

**常见错误：**

```bash
# ❌ 错误：缺少 type
git commit -m "添加用户登录功能"

# ✅ 正确
git commit -m "feat: 添加用户登录功能"

# ❌ 错误：type 大写
git commit -m "Feat: 添加用户登录功能"

# ✅ 正确
git commit -m "feat: 添加用户登录功能"

# ❌ 错误：subject 以句号结尾
git commit -m "feat: 添加用户登录功能。"

# ✅ 正确
git commit -m "feat: 添加用户登录功能"
```

### 3. 如何跳过 Hooks（受控使用）

默认禁止使用 `--no-verify`。仅在以下场景可临时使用：

- CI/发布阻断且需要先恢复线上服务
- 已有负责人明确审批，并在同一工作日补齐检查

```bash
# 临时跳过（需要审批记录）
git commit --no-verify -m "fix: 紧急恢复线上可用性"
```

补救要求（必须全部执行）：

1. 立即执行 `npm run lint && npm run build`
2. 发现问题先修复，再补一个正常 commit
3. 在 PR/提交说明中记录“为何跳过、何时补救、谁审批”

### 4. TypeScript 类型检查失败

**问题：** lint-staged 执行 `tsc --noEmit` 时报错。

**解决：**

```bash
# 查看类型错误
npm run build

# 修复类型错误后重新提交
git add .
git commit -m "fix: 修复类型错误"
```

### 5. 如何修改已提交的消息

**场景：** 提交后发现消息写错了。

```bash
# 修改最后一次提交的消息
git commit --amend -m "feat: 正确的提交消息"

# 如果已经 push，优先新增 commit 纠正，不要改写公共历史
```

`git push --force` 风险极高，默认禁止在共享分支使用。若必须使用，请满足：

- 仅限个人分支，且经过团队明确同意
- 使用 `git push --force-with-lease` 替代 `git push --force`
- 提前在协作渠道通知影响范围

## 📚 示例

### 示例 1：新增功能

```bash
git commit -m "feat(user): 添加用户登录功能"
```

### 示例 2：修复 Bug

```bash
git commit -m "fix(api): 修复用户信息接口返回 null 的问题"
```

### 示例 3：带 scope 和详细描述

```bash
git commit -m "feat(product): 添加商品搜索功能

- 支持按名称搜索
- 支持按分类筛选
- 添加搜索历史记录

Closes #123"
```

### 示例 4：重构代码

```bash
git commit -m "refactor(store): 使用 Zustand 重构用户状态管理"
```

### 示例 5：性能优化

```bash
git commit -m "perf(list): 使用虚拟滚动优化长列表性能"
```

### 示例 6：文档更新

```bash
git commit -m "docs: 更新 API 开发规范文档"
```

### 示例 7：不兼容变更

```bash
git commit -m "feat(api): 重构用户 API 接口

BREAKING CHANGE: getUserInfo 接口返回格式变更
- 原：{ data: {...} }
- 新：{ user: {...} }"
```

## 🎨 使用 Commitizen 的完整流程

```bash
# 1. 修改代码
# 2. 添加到暂存区
git add .

# 3. 运行 commitizen
npm run commit

# 4. 按照提示操作：
# ? Select the type of change that you're committing: (Use arrow keys)
# ❯ feat:     A new feature
#   fix:      A bug fix
#   docs:     Documentation only changes
#   style:    Changes that do not affect the meaning of the code
#   refactor: A code change that neither fixes a bug nor adds a feature
#   perf:     A code change that improves performance
#   test:     Adding missing tests

# 5. 输入 scope（可选）
# ? What is the scope of this change (e.g. component or file name): user

# 6. 输入简短描述
# ? Write a short, imperative tense description of the change: 添加用户登录功能

# 7. 输入详细描述（可选）
# ? Provide a longer description of the change:

# 8. 是否有不兼容变更
# ? Are there any breaking changes? No

# 9. 是否关联 Issue
# ? Does this change affect any open issues? No

# 10. 提交成功！
```

## 📊 生成 CHANGELOG

```bash
# 生成 CHANGELOG 并升级版本
npm run changelog

# 生成的 CHANGELOG.md 示例：
```

```markdown
# 更新日志

## [1.1.0](https://github.com/xxx/h5-template-react/compare/v1.0.0...v1.1.0) (2024-01-15)

### ✨ 新功能

- **user**: 添加用户登录功能 ([abc1234](https://github.com/xxx/h5-template-react/commit/abc1234))
- **product**: 添加商品搜索功能 ([def5678](https://github.com/xxx/h5-template-react/commit/def5678))

### 🐛 Bug 修复

- **api**: 修复用户信息接口返回错误 ([ghi9012](https://github.com/xxx/h5-template-react/commit/ghi9012))

### ⚡ 性能优化

- **list**: 优化列表渲染性能 ([jkl3456](https://github.com/xxx/h5-template-react/commit/jkl3456))
```

## 🔗 相关资源

- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [Commitlint 文档](https://commitlint.js.org/)
- [Husky 文档](https://typicode.github.io/husky/)
- [lint-staged 文档](https://github.com/okonet/lint-staged)
- [Commitizen 文档](https://github.com/commitizen/cz-cli)
- [Standard Version 文档](https://github.com/conventional-changelog/standard-version)

## 💡 最佳实践

1. **提交频率**：小步快跑，每完成一个小功能就提交
2. **原子性**：每次提交只做一件事，便于回滚和追溯
3. **使用 Commitizen**：避免手写错误，提高效率
4. **详细描述**：复杂的改动要在 body 中详细说明
5. **关联 Issue**：在 footer 中关联相关的 Issue
6. **代码审查**：提交前自己先审查一遍代码
7. **测试通过**：确保代码能正常运行再提交
8. **定期发版**：使用 `npm run changelog` 生成版本和更新日志

## 🔧 配置说明

### 已安装的依赖包

- `husky@9.1.7` - Git Hooks 管理工具
- `lint-staged@16.2.6` - 暂存文件检查工具
- `@commitlint/cli@20.1.0` - Commit 消息验证工具
- `@commitlint/config-conventional@20.0.0` - Conventional Commits 配置
- `commitizen@4.3.1` - 交互式提交工具
- `cz-conventional-changelog@3.3.0` - Commitizen 适配器
- `standard-version@9.5.0` - 版本管理和 CHANGELOG 生成工具

### 配置文件

- `commitlint.config.js` - Commit 消息验证规则
- `.lintstagedrc.json` - 暂存文件检查规则
- `.versionrc.json` - CHANGELOG 生成配置
- `.husky/pre-commit` - 提交前执行代码检查
- `.husky/commit-msg` - 提交时验证消息格式

### NPM Scripts

```json
{
  "prepare": "husky", // npm install 后自动安装 husky
  "commit": "git-cz", // 交互式提交
  "changelog": "standard-version", // 生成 CHANGELOG
  "lint:staged": "lint-staged" // 手动执行 lint-staged
}
```

### 自动检查内容

提交前会自动执行：

- ✅ ESLint 代码规范检查和自动修复
- ✅ Prettier 代码格式化
- ✅ TypeScript 类型检查
- ✅ Commit 消息格式验证

详细的技术实现和配置细节请查看 [GIT_SETUP.md](./GIT_SETUP.md)
