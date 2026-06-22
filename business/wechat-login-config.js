/**
 * 小程序前端是否展示“微信一键登录”按钮。
 *
 * 注意：
 * 1. 这只是前端展示开关，不等同于后端可用
 * 2. 当前值为 false，会直接导致登录页不渲染微信登录按钮
 * 3. 页面 onLoad 会请求 GET /api/miniapp/auth/wechat/status，以服务端 enabled + ready 为准
 */
/** 后端 status 接口不可用时的兜底展示开关（微信小程序编译目标） */
export const WECHAT_LOGIN_ENABLED = true
