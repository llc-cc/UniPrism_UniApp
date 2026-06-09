# UniPrism UniApp（微信小程序）

独立微信小程序客户端，通过 HTTP 调用 [UniPrism_New](https://github.com/poet77/UniPrism_New) 后端的 `/api/miniapp/*` 接口。

## 环境要求

- [HBuilderX](https://www.dcloud.io/hbuilderx.html)（推荐）或 UniApp CLI
- 微信开发者工具
- Node.js 18+

## 快速开始

```bash
npm install
```

### 开发

1. 在 `UniPrism_New-main` 启动后端：`npm run dev`（默认 `http://127.0.0.1:3000`）
2. HBuilderX：**运行 → 运行到小程序模拟器 → 微信开发者工具**
3. 或在项目根目录：`npm run dev:mp-weixin`

开发环境 API 基地址见 `.env.development`（默认 `http://127.0.0.1:3000`）。

### 生产构建

```bash
npm run build:mp-weixin
```

产物目录：`unpackage/dist/build/mp-weixin/`（已在 `.gitignore` 中忽略）。

## 后端接口

| 能力 | 路径 |
|------|------|
| 邀请码登录/注册 | `/api/miniapp/auth/invite/*` |
| 手机号验证码登录 | `/api/miniapp/auth/sms/*` |
| 探索会话 | `/api/miniapp/explore/session` |
| 兴趣画像 | `/api/miniapp/explore/profile` |
| AI 报告 | `/api/miniapp/reports/generate` |

接口封装：`utils/api.js`

## 分支说明

| 分支 | 说明 |
|------|------|
| `main` | 稳定基线 |
| `feature/xiaochengxu` | 小程序对接后端（与后端同名分支联调） |

## 微信小程序配置

- AppID：`manifest.json` → `mp-weixin.appid`
- 开发阶段可在微信开发者工具关闭「校验合法域名」
- 正式发布需在公众平台配置 `request` 合法域名（如 `https://uniprism.cn`）

## 常用脚本

```bash
npm run questions:sync    # 从 Web 端同步问卷数据
npm run questions:verify  # 校验问卷与 Web 端一致性
npm run assets:sync       # 同步远程图片资源到本地
```
