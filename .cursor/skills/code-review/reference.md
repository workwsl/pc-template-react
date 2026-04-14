# 代码审查参考清单

按需查阅；与 [SKILL.md](SKILL.md) 主流程配合使用。

## 强制对齐项（来自项目约定）

- **HTTP**：仅使用 `@/utils/request` 导出的 `http` 实例；业务 URL 与类型在 `src/services/<module>/{index.ts,types.ts}`。禁止在组件/Hook 内裸调 `axios` 或重复 `axios.create`。
- **路径**：`src/` 下使用 `@/` 别名，避免深层 `../../../`。
- **路由**：新页面在 `src/router/routes.tsx` 注册；需要鉴权/标题语义的页面设置对应 `meta`。组件内用 `useNavigate`；拦截器/非 React 模块用 `@/router/navigate` 的 `navigate`（见 `AGENTS.md`）。禁止重复实现全局守卫逻辑。
- **环境变量**：基地址等使用 `VITE_*`，在 `.env` 配置；不在源码硬编码域名或写入密钥。
- **状态管理（Zustand）**：避免页面/组件直接拼装“服务层数据加工”；store 以 slice 划分职责，组件订阅尽量用 selector 降低重渲染；异步副作用与错误处理归属明确（页面/Hook vs store）。

## 分层与可维护性

- **页面**：`src/pages/{pageName}/index.tsx`（camelCase）；仅负责编排与展示。
- **组件**：跨页面复用放 `src/components`；页面私有组件放 `src/pages/<page>/components`；单组件文件 **≤ 300 行**，超限须拆分子组件或 Hook。
- **Hooks**：多页面复用的 `useXxx` 放 `src/hooks`；仅单页使用的放页面目录内；Hook 只管状态、数据编排与副作用，不混入 JSX 渲染细节。
- **Service**：`service` 层职责是请求封装与类型声明，不承担 ViewModel 加工；禁止在 `service` 中拼装前端专用组合字段或格式转换；默认返回 `Promise<ApiResponse<T>>`，不提前解包 `response.data`。
- **魔法数字与固定文案**：优先 `src/constants/` 或就近常量。
- **变更范围**：审查时留意是否引入无关大重构或格式化噪音（与本次需求无关则标为建议收敛）。

## TypeScript / React

- Props 类型须显式声明（`interface`/`type`），避免隐式 `any`；公共类型有明确位置。
- **副作用清理**：`useEffect` 中的订阅、定时器、事件监听须在清理函数中释放；依赖数组保持完整，禁止遗漏或滥用空数组规避检查。
- 异步竞态：多次触发的异步请求（搜索、翻页）考虑取消/忽略过期响应（`AbortController` 或 cleanup flag）。

## 安全与日志

- 不在日志、错误提示、commit message 中输出 token、密码、完整 `.env`。
- 使用 `dangerouslySetInnerHTML` 须确认内容来源可信或已转义，注意 XSS 风险。

## 样式

- 统一使用 Tailwind；条件拼接或变体组合使用 `cn()`；响应式使用 Tailwind 前缀。
- 禁止引入与 shadcn/ui 冲突的组件库；禁止常规使用 `.module.less/.module.css`。

## 交付前可提示的自检

- 若变更涉及 `src/` 下应用代码，可提示是否已本地执行 `npm run lint`、`npm run build` 与 `npm run check:types`；若仅为文档、配置或本仓库 `.cursor/` 等无 `src/` 运行时变更，可弱化或省略，避免噪音。
