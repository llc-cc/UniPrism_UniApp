/**
 * 小程序 ↔ 后端 接口层（UniApp / 微信小程序）
 * ------------------------------------------------------------------
 * 统一封装所有对后端的 HTTP 请求，约定：
 *   - 基地址：生产默认 https://uniprism.cn；开发构建默认 http://127.0.0.1:3000
 *   - 可通过本地存储 uniprism.apiBaseUrl 或 VUE_APP_API_BASE_URL 覆盖
 *   - 鉴权：登录后保存 JWT，后续请求自动带上 `Authorization: Bearer <token>`
 *   - 响应：后端统一返回信封结构
 *       成功 -> { ok: true,  data: <业务数据> }
 *       失败 -> { ok: false, error: { code, message, requestId, details? } }
 *
 * 重要约定：本层方法 resolve 的值是「整个成功信封」，业务数据在 `.data` 下。
 *   例如：const res = await api.login(...); const token = res.data.token
 *   失败时 reject 一个 Error，message 取自后端 error.message。
 *
 * 已对接的后端接口（详见 UniPrism_New-main/docs/MINIAPP_API.md）：
 *   1. POST /api/miniapp/auth/login        登录
 *   2. POST /api/miniapp/auth/register     注册
 *   3. POST /api/miniapp/explore/session   创建/续期探索会话
 *   4. POST /api/miniapp/explore/profile   保存 RIASEC 兴趣画像
 *   5. POST /api/miniapp/reports/generate  发起/复用 AI 报告任务
 *   6. GET  /api/miniapp/reports/latest    查询最近一份报告任务
 *   7. GET  /api/miniapp/reports/status    查询指定报告任务状态
 *   8. POST /api/miniapp/auth/sms/send     发送手机验证码
 *   9. POST /api/miniapp/auth/sms/login    手机号验证码登录
 *   10. POST /api/miniapp/auth/invite/*    邀请码注册/登录/重置
 *   11. POST /api/miniapp/auth/wechat/login 微信一键登录（需授权手机号）
 */

/** 生产环境后端基地址。 */
const PRODUCTION_BASE_URL = 'https://uniprism.cn'

/** 本地 Next.js 开发服务（npm run dev）。 */
const LOCAL_DEV_BASE_URL = 'http://127.0.0.1:3000'

/** 本地存储 Key（统一前缀，避免与其他业务冲突）。 */
const STORAGE_KEYS = {
  apiBaseUrl: 'uniprism.apiBaseUrl', // 可选：自定义后端地址（调试用）
  token: 'uniprism.token', // 登录态 JWT
  user: 'uniprism.user', // 当前登录用户信息
}

/** 所有请求共用的请求头。 */
const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'x-miniapp-client': 'uniprism-weapp', // 后端用于区分小程序来源
}

/** 请求超时时间（毫秒）。 */
const REQUEST_TIMEOUT = 12000

/** AI 报告生成超时（报告链路较长，需比常规请求更宽松）。 */
const REPORT_GENERATE_TIMEOUT = 420000

/**
 * 后端接口路径常量。集中管理，避免散落在各处的硬编码字符串。
 * 注意：`events` 对应的小程序后端路由尚未实现，属于预留项（见 sendEvents 注释）。
 */
export const API_PATHS = {
  login: '/api/miniapp/auth/login',
  register: '/api/miniapp/auth/register',
  sendSmsCode: '/api/miniapp/auth/sms/send',
  loginWithPhone: '/api/miniapp/auth/sms/login',
  inviteStatus: '/api/miniapp/auth/invite/status',
  inviteRegister: '/api/miniapp/auth/invite/register',
  inviteLogin: '/api/miniapp/auth/invite/login',
  invitePasswordReset: '/api/miniapp/auth/invite/password-reset',
  wechatLogin: '/api/miniapp/auth/wechat/login',
  createSession: '/api/miniapp/explore/session',
  saveProfile: '/api/miniapp/explore/profile',
  generateReport: '/api/miniapp/reports/generate',
  latestReport: '/api/miniapp/reports/latest',
  reportStatus: '/api/miniapp/reports/status',
  sendEvents: '/api/miniapp/explore/events', // 预留，后端暂未提供
}

/**
 * @typedef {Object} AuthUser 登录用户信息
 * @property {string} id
 * @property {string|null} name
 * @property {string|null} email
 * @property {string} role
 *
 * @typedef {Object} RiasecScores RIASEC 六维分数（每项 0~100 的整数）
 * @property {number} R 实际型 Realistic
 * @property {number} I 研究型 Investigative
 * @property {number} A 艺术型 Artistic
 * @property {number} S 社会型 Social
 * @property {number} E 企业型 Enterprising
 * @property {number} C 常规型 Conventional
 *
 * @typedef {Object} ApiEnvelope 后端成功响应信封
 * @property {true} ok
 * @property {any} data 业务数据
 */

/* ------------------------------------------------------------------ *
 * 基地址管理
 * ------------------------------------------------------------------ */

/** 去除地址首尾空白与结尾多余的斜杠。 */
function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '')
}

/** 是否为开发构建（微信开发者工具 / npm run dev:mp-weixin）。 */
function isWechatMiniProgram() {
  return typeof wx !== 'undefined' && typeof wx.getAccountInfoSync === 'function'
}

/** 微信开发者工具 / 体验版：应连本地或测试 API，而非线上域名。 */
function isWechatDevelopEnv() {
  try {
    if (typeof uni !== 'undefined' && typeof uni.getAccountInfoSync === 'function') {
      const envVersion = uni.getAccountInfoSync()?.miniProgram?.envVersion
      if (envVersion === 'release') return false
      if (envVersion) return true
    }
  } catch {
    // ignore
  }

  if (!isWechatMiniProgram()) return false
  try {
    const envVersion = wx.getAccountInfoSync().miniProgram.envVersion
    return envVersion !== 'release'
  } catch {
    return true
  }
}

function isDevBuild() {
  if (isWechatDevelopEnv()) return true
  try {
    return typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development'
  } catch {
    return false
  }
}

/** 是否应默认使用本地 Next.js API。 */
function shouldUseLocalDevApi() {
  return isDevBuild()
}

/** 读取构建期环境变量中的 API 基地址。 */
function getEnvBaseUrl() {
  if (typeof process === 'undefined' || !process.env) return ''
  return normalizeBaseUrl(process.env.VUE_APP_API_BASE_URL || process.env.VITE_APP_API_BASE_URL || '')
}

/**
 * 当前构建下的默认基地址（未写入 Storage 时生效）。
 * 开发构建 → 本地 Next.js；生产构建 → uniprism.cn。
 */
function getDefaultBaseUrl() {
  const envUrl = getEnvBaseUrl()
  if (envUrl && !shouldUseLocalDevApi()) return envUrl
  if (shouldUseLocalDevApi()) return LOCAL_DEV_BASE_URL
  return envUrl || PRODUCTION_BASE_URL
}

/**
 * 获取当前生效的后端基地址。
 * 微信开发者工具内始终优先本地 API，避免 Storage 里残留 uniprism.cn。
 * @returns {string}
 */
function getBaseUrl() {
  const storageUrl = normalizeBaseUrl(uni.getStorageSync(STORAGE_KEYS.apiBaseUrl))

  if (shouldUseLocalDevApi()) {
    if (
      storageUrl &&
      storageUrl !== PRODUCTION_BASE_URL &&
      !storageUrl.startsWith('https://uniprism.cn')
    ) {
      return storageUrl
    }
    return LOCAL_DEV_BASE_URL
  }

  return storageUrl || getDefaultBaseUrl()
}

/**
 * 启动时初始化 API 配置（开发模式打印基地址，并清除误设的生产域名）。
 * @returns {string} 生效后的地址
 */
function initApiConfig() {
  if (!shouldUseLocalDevApi()) return getBaseUrl()

  const stored = normalizeBaseUrl(uni.getStorageSync(STORAGE_KEYS.apiBaseUrl))
  if (!stored || stored === PRODUCTION_BASE_URL || stored.startsWith('https://uniprism.cn')) {
    uni.setStorageSync(STORAGE_KEYS.apiBaseUrl, LOCAL_DEV_BASE_URL)
  }

  const baseUrl = getBaseUrl()
  console.info('[UniPrism] 开发模式 API 基地址:', baseUrl)
  return baseUrl
}

/**
 * 设置（或清除）自定义后端基地址，写入本地存储。
 * @param {string} url 传空字符串表示恢复默认地址
 * @returns {string} 生效后的地址
 */
function setBaseUrl(url) {
  const nextUrl = normalizeBaseUrl(url)
  if (!nextUrl) {
    uni.removeStorageSync(STORAGE_KEYS.apiBaseUrl)
    return getDefaultBaseUrl()
  }

  uni.setStorageSync(STORAGE_KEYS.apiBaseUrl, nextUrl)
  return nextUrl
}

/* ------------------------------------------------------------------ *
 * 登录态管理
 * ------------------------------------------------------------------ */

/** 读取当前 JWT，未登录返回空字符串。 */
function getToken() {
  return uni.getStorageSync(STORAGE_KEYS.token) || ''
}

/** 读取当前登录用户信息，未登录返回 null。 @returns {AuthUser|null} */
function getUser() {
  return uni.getStorageSync(STORAGE_KEYS.user) || null
}

/** 是否已登录。 @returns {boolean} */
function isLoggedIn() {
  return Boolean(getToken())
}

/**
 * 写入登录态（登录/注册成功后调用）。
 * @param {string} token JWT
 * @param {AuthUser} [user] 用户信息
 */
function setAuthSession(token, user) {
  if (token) {
    uni.setStorageSync(STORAGE_KEYS.token, token)
  } else {
    uni.removeStorageSync(STORAGE_KEYS.token)
  }

  if (user) {
    uni.setStorageSync(STORAGE_KEYS.user, user)
  } else {
    uni.removeStorageSync(STORAGE_KEYS.user)
  }
}

/** 清除登录态（退出登录或 token 失效时调用）。 */
function clearAuthSession() {
  uni.removeStorageSync(STORAGE_KEYS.token)
  uni.removeStorageSync(STORAGE_KEYS.user)
}

/* ------------------------------------------------------------------ *
 * 参数归一化（保证发送给后端的数据符合其校验规则）
 * ------------------------------------------------------------------ */

/** 将分数对象约束为 0~100 的整数六维。 @returns {RiasecScores} */
function toRiasecScores(scores) {
  const s = scores || {}
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)))
  return { R: clamp(s.R), I: clamp(s.I), A: clamp(s.A), S: clamp(s.S), E: clamp(s.E), C: clamp(s.C) }
}

/**
 * 推荐专业归一化为「专业 ID 字符串数组」。
 * 兼容传入的是字符串数组，或 [{ majorId }] / [{ id }] 形式的对象数组。
 * 后端要求：string[]，最多 20 项。
 */
function toMajorIdList(recommendedMajors) {
  if (!Array.isArray(recommendedMajors)) return []
  return recommendedMajors
    .map((m) => (typeof m === 'string' ? m : (m && (m.majorId || m.id)) || ''))
    .filter(Boolean)
    .slice(0, 20)
}

/**
 * 原始答案归一化为对象（后端要求 record<string, unknown>）。
 * 兼容小程序按题序记录的数组：转换为 { 题目ID 或 序号: 答案 } 的对象。
 */
function toAnswersRecord(rawAnswers) {
  if (!rawAnswers) return {}
  if (Array.isArray(rawAnswers)) {
    return rawAnswers.reduce((acc, item, index) => {
      const key = item && (item.questionId || item.id) ? String(item.questionId || item.id) : String(index)
      acc[key] = item
      return acc
    }, {})
  }
  if (typeof rawAnswers === 'object') return rawAnswers
  return {}
}

/* ------------------------------------------------------------------ *
 * 请求核心
 * ------------------------------------------------------------------ */

/** 从响应中提取可读的错误信息。 */
function getErrorMessage(res) {
  if (res && res.data && res.data.error && res.data.error.message) {
    return res.data.error.message
  }
  if (res && res.errMsg) {
    return res.errMsg
  }
  return '请求失败'
}

function encodeQuery(query) {
  const pairs = Object.entries(query || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
  return pairs.length ? '?' + pairs.join('&') : ''
}

/**
 * 发起一次 HTTP 请求。
 * - 自动拼接基地址、注入公共头与鉴权头
 * - 2xx 且 body.ok !== false 视为成功，resolve 整个成功信封 { ok, data }
 * - 其他情况 reject 一个携带后端文案的 Error
 *
 * @param {'GET'|'POST'|'PUT'|'DELETE'} method
 * @param {string} path 接口路径（以 / 开头）
 * @param {Object} [data] 请求体
 * @param {number} [timeoutMs] 超时毫秒，默认 REQUEST_TIMEOUT
 * @returns {Promise<ApiEnvelope>}
 */
function request(method, path, data, timeoutMs) {
  const token = getToken()
  const baseUrl = getBaseUrl()
  const timeout = typeof timeoutMs === 'number' ? timeoutMs : REQUEST_TIMEOUT

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + path,
      method,
      data,
      header: Object.assign(
        {},
        COMMON_HEADERS,
        token ? { Authorization: 'Bearer ' + token } : {},
      ),
      timeout,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 业务层失败（HTTP 2xx 但 ok=false）
          if (res.data && res.data.ok === false) {
            reject(new Error(getErrorMessage(res)))
            return
          }
          resolve(res.data)
          return
        }

        // 401 视为登录态失效，清除本地 token，便于上层引导重新登录
        if (res.statusCode === 401) {
          clearAuthSession()
        }

        reject(new Error(getErrorMessage(res)))
      },
      fail(err) {
        reject(new Error(getErrorMessage(err)))
      },
    })
  })
}

/* ------------------------------------------------------------------ *
 * 对外接口
 * ------------------------------------------------------------------ */

export const api = {
  // —— 配置与登录态 ——
  getBaseUrl,
  getDefaultBaseUrl,
  isDevBuild,
  initApiConfig,
  setBaseUrl,
  useLocalDevApi() {
    return setBaseUrl(LOCAL_DEV_BASE_URL)
  },
  useProductionApi() {
    return setBaseUrl(PRODUCTION_BASE_URL)
  },
  getToken,
  getUser,
  isLoggedIn,
  setAuthSession,
  clearAuthSession,

  /**
   * 登录。POST /api/miniapp/auth/login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<ApiEnvelope>} data: { token, user: AuthUser }
   * 后端错误：400 邮箱或密码错误 / 429 请求过于频繁（15 分钟内最多 10 次）
   */
  login(email, password) {
    return request('POST', API_PATHS.login, { email, password })
  },

  /**
   * 注册。POST /api/miniapp/auth/register
   * @param {string|null} name 昵称（可空）
   * @param {string} email
   * @param {string} password 至少 6 位
   * @returns {Promise<ApiEnvelope>} data: { token, user: AuthUser }
   * 后端错误：400 输入/密码强度 / 409 邮箱已注册 / 429 请求过于频繁（15 分钟内最多 5 次）
   */
  register(name, email, password) {
    return request('POST', API_PATHS.register, { name, email, password })
  },

  /**
   * 发送手机验证码。POST /api/miniapp/auth/sms/send
   * @param {string} phone
   * @returns {Promise<ApiEnvelope>} data: { sent, devCode? }
   */
  sendSmsCode(phone) {
    return request('POST', API_PATHS.sendSmsCode, { phone })
  },

  /**
   * 手机号验证码登录（首次自动注册）。POST /api/miniapp/auth/sms/login
   * @param {string} phone
   * @param {string} code
   * @returns {Promise<ApiEnvelope>} data: { token, user }
   */
  loginWithPhone(phone, code) {
    return request('POST', API_PATHS.loginWithPhone, { phone, code })
  },

  /** 校验邀请码是否可用。POST /api/miniapp/auth/invite/status */
  checkInviteStatus(inviteCode) {
    return request('POST', API_PATHS.inviteStatus, { inviteCode })
  },

  /** 邀请码注册并登录。POST /api/miniapp/auth/invite/register */
  registerWithInvite(inviteCode, loginId, password) {
    return request('POST', API_PATHS.inviteRegister, { inviteCode, loginId, password })
  },

  /** 用户 ID + 密码登录（邀请码体系）。POST /api/miniapp/auth/invite/login */
  loginWithLoginId(loginId, password) {
    return request('POST', API_PATHS.inviteLogin, { loginId, password })
  },

  /** 邀请码找回密码并登录。POST /api/miniapp/auth/invite/password-reset */
  resetInvitePassword(inviteCode, loginId, password) {
    return request('POST', API_PATHS.invitePasswordReset, { inviteCode, loginId, password })
  },

  /**
   * 微信一键登录（需用户授权手机号）。POST /api/miniapp/auth/wechat/login
   * @param {string} loginCode wx.login 返回的 code
   * @param {string} phoneCode getPhoneNumber 返回的 code
   * @returns {Promise<ApiEnvelope>} data: { token, user }
   */
  loginWithWechat(loginCode, phoneCode) {
    return request('POST', API_PATHS.wechatLogin, { loginCode, phoneCode })
  },

  /**
   * 创建/续期探索会话。POST /api/miniapp/explore/session
   * 已登录用户带 token 自动关联 userId；匿名用户用 anonymousId 关联。
   * @param {string} [anonymousId] 匿名标识（未登录时使用；不传后端会生成）
   * @returns {Promise<ApiEnvelope>} data: { sessionId, anonymousId, discoveryCompleted }
   * 后端错误：429 请求过于频繁（每分钟最多 30 次）
   */
  createSession(anonymousId) {
    return request('POST', API_PATHS.createSession, anonymousId ? { anonymousId } : {})
  },

  /**
   * 保存 RIASEC 兴趣画像（问卷完成后调用，会把会话标记为已完成探索）。
   * POST /api/miniapp/explore/profile
   * @param {string} sessionId
   * @param {RiasecScores} scores 六维分数（自动约束为 0~100 整数）
   * @param {string[]} topDimensions 主导维度（如 ['I','C']，最多 6 项）
   * @param {Array<string|{majorId?:string,id?:string}>} recommendedMajors 推荐专业（自动归一化为 ID 数组）
   * @param {Object|Array} rawAnswers 原始作答（数组会自动转为对象）
   * @returns {Promise<ApiEnvelope>} data: { profileId }
   * 后端错误：403 会话不属于当前用户 / 404 会话不存在 / 429 每分钟最多 20 次
   */
  saveProfile(sessionId, scores, topDimensions, recommendedMajors, rawAnswers, openEndedAnswers, personalityTraits) {
    const payload = {
      sessionId,
      scores: toRiasecScores(scores),
      topDimensions: (Array.isArray(topDimensions) ? topDimensions : []).slice(0, 6),
      recommendedMajors: toMajorIdList(recommendedMajors),
      rawAnswers: toAnswersRecord(rawAnswers),
    }
    if (openEndedAnswers && typeof openEndedAnswers === 'object') {
      payload.openEndedAnswers = openEndedAnswers
    }
    if (personalityTraits && typeof personalityTraits === 'object') {
      payload.personalityTraits = personalityTraits
    }
    return request('POST', API_PATHS.saveProfile, payload)
  },

  /**
   * 发起或复用 AI 兴趣报告任务。POST /api/miniapp/reports/generate
   * 对齐 Web 端后，接口可能返回三类结果：
   * 1. 已完成：直接返回 { report }
   * 2. 排队/生成中：返回 { reportId, status, queued, workflowProgress }
   * 3. 新建任务：生产环境入队，开发环境可能本地直跑
   * @param {string} sessionId
   * @param {boolean} [force=false] 是否强制重新生成
   * @returns {Promise<ApiEnvelope>} data: { reportId, status, report?, queued?, workflowProgress? }
   * 后端错误：403 会话不属于当前用户 / 404 会话不存在或未完成探索 / 429 10 分钟内最多 5 次 / 500 生成失败
   */
  generateReport(sessionId, force) {
    return request(
      'POST',
      API_PATHS.generateReport,
      {
        sessionId,
        force: Boolean(force),
      },
      REPORT_GENERATE_TIMEOUT,
    )
  },

  /**
   * 查询当前探索会话最近一份可读报告记录。GET /api/miniapp/reports/latest
   * 返回的是任务元信息，不一定携带完整 report 内容。
   * @param {string} sessionId
   * @param {string} [reportType='full_explore']
   * @returns {Promise<ApiEnvelope>}
   */
  getLatestReport(sessionId, reportType) {
    return request(
      'GET',
      API_PATHS.latestReport + encodeQuery({
        sessionId,
        reportType: reportType || 'full_explore',
      }),
    )
  },

  /**
   * 查询指定报告任务状态。GET /api/miniapp/reports/status
   * @param {string} sessionId
   * @param {string} reportId
   * @returns {Promise<ApiEnvelope>} data: { reportId, status, queued, report?, workflowProgress?, errorMessage? }
   */
  getReportStatus(sessionId, reportId) {
    return request(
      'GET',
      API_PATHS.reportStatus + encodeQuery({
        sessionId,
        reportId,
      }),
    )
  },

  /**
   * 上报埋点事件（预留接口）。
   * ⚠️ 后端暂未实现 /api/miniapp/explore/events，调用会 404。
   * 待后端提供后即可直接启用，无需改动调用方。
   * @param {string} sessionId
   * @param {Array<Object>} events 事件列表
   * @returns {Promise<ApiEnvelope>}
   */
  sendEvents(sessionId, events) {
    return request('POST', API_PATHS.sendEvents, { sessionId, events })
  },
}
