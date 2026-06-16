/**
 * 小程序前端是否展示“微信一键登录”按钮。
 *
 * 注意：
 * 1. 这只是前端展示开关，不等同于后端可用
 * 2. 当前值为 false，会直接导致登录页不渲染微信登录按钮
 * 3. 真正上线前还必须同时确认：
 *    - manifest.json / project.config.json 使用的是目标小程序 AppID
 *    - 后端 WECHAT_MINIAPP_APPID / WECHAT_MINIAPP_SECRET 与该 AppID 匹配
 *    - 微信公众平台已配置手机号获取能力与隐私指引
 */
export const WECHAT_LOGIN_ENABLED = false
