# UniPrism 小程序更新说明

分支：`feature/xiaochengxu`  
远端：`llc-cc/UniPrism_UniApp`  
对接后端：`poet77/UniPrism_New` → `/api/miniapp/*`

---

## 2026-06-09 小程序初版（feature/xiaochengxu）

### 登录与鉴权

| 功能 | 页面/模块 | 说明 |
|------|-----------|------|
| 邀请码注册 | `pages/auth/login.vue` | 两步：校验邀请码 → 设置用户 ID + 密码 |
| 邀请码登录 | 同上 | 用户 ID + 密码登录 |
| 忘记密码 | 同上 | 初始邀请码 + 用户 ID + 新密码 |
| 手机号登录 | 同上 | 短信验证码；开发环境展示 `devCode` 便于联调 |
| 微信一键登录 | 同上 | 代码已保留，`WECHAT_LOGIN_ENABLED=false` 暂不启用 |
| 登录态守卫 | `business/auth-guard.js` | 未登录跳转登录页；Tab/路由拦截 |
| 匿名会话合并 | `business/explore-session-merge.js` | 登录后把本地匿名探索会话关联到账号 |

### 生涯规划主链路

| 功能 | 页面 | 说明 |
|------|------|------|
| 探索首页 | `pages/discover/index.vue` | 阶段入口：兴趣探索 / 专业 / 职业 / 报告 |
| 兴趣问卷 | `pages/discover/chat.vue` | 对齐 Web 多屏问卷（基础信息、兴趣、能力、职业情境等） |
| 探索结果 | `pages/discover/results.vue` | 画像摘要 + 调用后端生成 AI 报告 |
| AI 报告展示 | `components/ReportPanel/` | 加载态、失败重试、报告正文展示 |

### 专业体验

| 功能 | 页面 | 说明 |
|------|------|------|
| 专业列表 | `pages/discover/major.vue` | 10+ 模板专业 + 数学完整入口 |
| 专业详情 | `pages/discover/major-detail.vue` | |
| 专业速体验 | `pages/discover/major-speed.vue` | 对齐 Web `MajorTemplateExperience` 流程 |
| 专业挑战 | `pages/discover/major-challenge.vue` | 建模/诊断/报告类交互 |
| 课程阅读 | `pages/discover/major-course.vue` | 分页阅读 |
| 数学模块 | `pages/math/*`、`subpkg/math/course.vue` | 数学专业完整体验 + 挑战 |

### 职业模拟

| 功能 | 页面 | 说明 |
|------|------|------|
| 职业列表 | `pages/discover/career.vue` | 推荐职业 + 已体验记录 |
| 职业详情 | `pages/discover/career-detail.vue` | |
| 数学家模拟 | `pages/discover/career-experience.vue` | 完整职业体验流程 |

### 基础设施

| 模块 | 说明 |
|------|------|
| `utils/api.js` | 统一 HTTP 层、JWT 存储、miniapp 接口封装 |
| `utils/asset-map.ts` | 远程/OSS 图片资源解析与兜底 |
| `business/discover-questions.ts` | 问卷数据（可从 Web 端 sync） |
| `manifest.json` | 微信小程序 AppID、网络超时配置 |

### 已对接后端接口

见 `utils/api.js` 中 `API_PATHS`，对应后端 `app/api/miniapp/*`。

### 已知限制 / 未做

- 微信一键登录需配置 `WECHAT_MINIAPP_SECRET` 后启用
- `/api/miniapp/explore/events` 埋点接口后端未实现
- 学习 / 成就 Tab 为占位页
