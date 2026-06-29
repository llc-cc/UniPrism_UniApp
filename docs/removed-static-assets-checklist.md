# 已移除 / 忽略的本地静态资源清单

> 生成时间：2026-06-24  
> 作用：列出所有从 `static/` 中删除或加入 `packOptions.ignore` 的文件，
> 以及它们对应的 OSS 路径，便于核查 OSS 是否已有对应资源。

---

## 一、说明

- **已安全**：文件在 `static/` 下仍存在，且通过 `/static/` 路径硬编码引用，打包正常。
- **已删除**：文件物理上已从 `static/` 删除，代码通过 `resolveAsset()` 走 OSS。
- **已忽略**：文件还在 `static/` 但加入了 `packOptions.ignore`，不会进入上传包。代码通过 `resolveAsset()` 走 OSS，本地文件仅供开发态备用。

---

## 二、已删除的 PNG 文件

这些文件已从磁盘删除。如代码通过 `resolveAsset()` 引用它们，运行时会走下方对应的 OSS 地址。

| 本地原路径 | OSS 对应路径 | 备注 |
|-----------|------------|------|
| `static/assets/auth/login-background-waves.png` | — | login.vue 已改用同名 **SVG**，PNG 不再需要 |
| `static/assets/auth/login-brand-mark.png` | — | login.vue 已改用同名 **SVG**，PNG 不再需要 |
| `static/assets/auth/launch-career.png` | — | 已确认代码中无任何引用，属于未使用资源 |
| `static/assets/auth/launch-interest.png` | — | 已确认代码中无任何引用，属于未使用资源 |
| `static/assets/auth/launch-personality.png` | — | 已确认代码中无任何引用，属于未使用资源 |
| `static/assets/auth/launch-backdrop-assessment.png` | — | SVG 版本仍在，改为 SVG 使用 |
| `static/assets/auth/launch-backdrop-career.png` | — | SVG 版本仍在，改为 SVG 使用 |
| `static/assets/auth/launch-backdrop-interest.png` | — | SVG 版本仍在，改为 SVG 使用 |
| `static/assets/auth/launch-backdrop-personality.png` | — | SVG 版本仍在，改为 SVG 使用 |
| `static/assets/discover/report-v4-top-rank-corner.png` | `/explore-static/discover/figma/report/report-v4-top-rank-corner.png` | **⚠️ 需核查 OSS** |
| `static/assets/majors/generated/discover-major-artificial-intelligence-20260610-v2-flat2d.png` | `/images/explore/discover/icons/generated/discover-major-artificial-intelligence-20260610-v2-flat2d.png` | **⚠️ 需核查 OSS** |
| `static/assets/majors/generated/discover-major-computer-science-technology-20260610-v2-flat2d.png` | `/images/explore/discover/icons/generated/discover-major-computer-science-technology-20260610-v2-flat2d.png` | **⚠️ 需核查 OSS** |
| `static/assets/majors/generated/discover-major-data-science-big-data-technology-20260610-v2-flat2d.png` | `/images/explore/discover/icons/generated/discover-major-data-science-big-data-technology-20260610-v2-flat2d.png` | **⚠️ 需核查 OSS** |
| `static/assets/majors/generated/discover-major-economics-20260610-v2-flat2d.png` | `/images/explore/discover/icons/generated/discover-major-economics-20260610-v2-flat2d.png` | **⚠️ 需核查 OSS** |
| `static/assets/majors/generated/discover-major-finance-20260608-v1.png` | `/images/explore/discover/icons/generated/discover-major-finance-20260608-v1.png` | **⚠️ 需核查 OSS** |
| `static/tab-discover-active.png`（及其余 7 个 tab/*.png）| — | 小程序使用自定义 tabBar（非原生），这些文件本就未被引用 |

> **验证 OSS 方法**：在浏览器访问 `https://assets.uniprism.cn` + OSS 路径，例如：  
> `https://assets.uniprism.cn/images/explore/discover/icons/generated/discover-major-economics-20260610-v2-flat2d.png`

---

## 三、已忽略（packOptions.ignore）的 SVG 文件

文件仍在 `static/`，但上传时会被排除。代码通过 `resolveAsset()` 走 OSS。

### 3-1. discover 相关 SVG（通过 local-asset-map 兜底，现改为 OSS）

| 本地路径 | 对应 OSS 路径 | 是否需核查 |
|---------|------------|----------|
| `static/assets/discover/stage-deep-icon.svg` | `/explore-static/discover/figma/stage-deep-icon-figma-494-542.svg` | ⚠️ 需核查 |
| `static/assets/discover/stage-career.svg` | `/images/explore/discover/figma/stage-career-icon-transparent-20260615.png` | ⚠️ 需核查（主页用 OSS PNG） |
| `static/assets/discover/stage-interest.svg` | `/images/explore/discover/figma/...` | ⚠️ 需核查 |
| `static/assets/discover/stage-major-experience.svg` | `/images/explore/discover/generated/stage-major-experience-crop.png` | ⚠️ 需核查 |
| `static/assets/discover/stage-report.svg` | `/explore-static/discover/figma/report-ready-clipboard-figma-205-12203.png` | ⚠️ 需核查 |
| `static/assets/discover/task-card.svg` | 无直接对应，仅作旧版兜底 | 可忽略 |
| `static/assets/discover/interest-question.svg` | 无直接对应，仅作旧版兜底 | 可忽略 |
| `static/assets/discover/icon-generic.svg` | 无对应，通用占位符 | 可忽略 |
| `static/assets/discover/major-ribbon-left.svg` | `/images/explore/discover/figma/report/major-ribbon-left.svg` | ⚠️ 需核查 |
| `static/assets/discover/major-ribbon-right.svg` | `/images/explore/discover/figma/report/major-ribbon-right.svg` | ⚠️ 需核查 |
| `static/assets/discover/report-ready-shadow.svg` | `/explore-static/discover/figma/report-ready-shadow-figma-205-12205.svg` | ⚠️ 需核查 |
| `static/assets/discover/road-curve-career.svg` | 无引用 | 可忽略 |
| `static/assets/discover/road-curve-career-gray.svg` | 无引用 | 可忽略 |

### 3-2. auth 启动页 SVG（launch-backdrop，`packOptions.ignore`）

| 本地路径 | 状态 |
|---------|------|
| `static/assets/auth/launch-backdrop-assessment.svg` | launch.vue 未引用，可忽略 |
| `static/assets/auth/launch-backdrop-career.svg` | launch.vue 未引用，可忽略 |
| `static/assets/auth/launch-backdrop-interest.svg` | launch.vue 未引用，可忽略 |
| `static/assets/auth/launch-backdrop-personality.svg` | launch.vue 未引用，可忽略 |

### 3-3. majors SVG（`packOptions.ignore`）

| 本地路径 | 对应 OSS 路径 | 是否需核查 |
|---------|------------|----------|
| `static/assets/majors/major-ai.svg` | `/images/explore/discover/icons/generated/majors/major-ai.png` | ⚠️ 需核查 |
| `static/assets/majors/major-cs.svg` | `/images/explore/discover/icons/generated/majors/major-cs.png` | ⚠️ 需核查 |
| `static/assets/majors/major-math.svg` | `/images/explore/discover/icons/generated/majors/major-math.png` | ⚠️ 需核查 |
| `static/assets/majors/major-physics.svg` | `/images/explore/discover/icons/generated/majors/major-physics.png` | ⚠️ 需核查 |
| `static/assets/majors/major-finance.svg` | `/images/explore/discover/icons/generated/majors/major-finance.svg` | ⚠️ 需核查 |
| `static/assets/majors/major-economics.svg` | `/images/explore/discover/icons/generated/majors/major-economics.svg` | ⚠️ 需核查 |
| `static/assets/majors/major-actuarial.svg` | `/images/explore/discover/icons/generated/majors/major-actuarial.svg` | ⚠️ 需核查 |
| `static/assets/majors/major-chemistry.svg` | `/images/explore/discover/icons/generated/majors/major-chemistry.svg` | ⚠️ 需核查 |
| `static/assets/majors/major-mechanical.svg` | `/images/explore/discover/icons/generated/majors/major-mechanical.svg` | ⚠️ 需核查 |
| `static/assets/majors/major-ee.svg` | `/images/explore/discover/icons/generated/majors/major-ee.svg` | ⚠️ 需核查 |
| `static/assets/majors/major-ic.svg` | `/images/explore/discover/icons/generated/majors/major-ic.svg` | ⚠️ 需核查 |
| `static/assets/majors/major-bio.svg` | `/images/explore/discover/icons/generated/majors/major-bio.svg` | ⚠️ 需核查 |

### 3-4. home-professional 文件夹（整个文件夹 ignore）

这些 SVG 之前是 `major.vue` 学院卡片的图标，现在改为通过 `resolveAsset()` 走 OSS。

| 本地文件 | 对应 OSS 路径 |
|--------|------------|
| `icon-engineering-494-3715.svg` | `/images/explore/discover/figma/home-professional-assets/icon-engineering-494-3715.svg` |
| `icon-computer-494-3820.svg` | `/images/explore/discover/figma/home-professional-assets/icon-computer-494-3820.svg` |
| `icon-law-494-3935.svg` | `/images/explore/discover/figma/home-professional-assets/icon-law-494-3935.svg` |
| `icon-medical-494-3924.svg` | `/images/explore/discover/figma/home-professional-assets/icon-medical-494-3924.svg` |
| `icon-literature-494-3911.svg` | `/images/explore/discover/figma/home-professional-assets/icon-literature-494-3911.svg` |
| `icon-science-base-494-3752.svg` | `/images/explore/discover/figma/home-professional-assets/icon-science-base-494-3752.svg` |
| `icon-science-paper-494-3796.svg` | `/images/explore/discover/figma/home-professional-assets/icon-science-paper-494-3796.svg` |
| `icon-science-flask-494-3817.svg` | `/images/explore/discover/figma/home-professional-assets/icon-science-flask-494-3817.svg` |
| `sidebar-logo-mark-494-1004.svg` | `/images/explore/discover/figma/home-professional-assets/sidebar-logo-mark-494-1004.svg` |
| `sidebar-logo-wordmark-494-1004.svg` | `/images/explore/discover/figma/home-professional-assets/sidebar-logo-wordmark-494-1004.svg` |

> ⚠️ **这组文件需重点核查 OSS**，它们是学院卡片页面的核心图标。

### 3-5. atlas / careers / home-science 文件夹（整个文件夹 ignore）

| 本地路径 | 对应 OSS 路径 |
|---------|------------|
| `static/assets/atlas/university.svg` | `/images/explore/discover/icons/atlas/university.png` |
| `static/assets/atlas/college-science.svg` | `/images/explore/discover/icons/atlas/college-science-alpha-v2.png` |
| `static/assets/atlas/college-engineering.svg` | `/images/explore/discover/icons/atlas/college-engineering.png` |
| `static/assets/atlas/college-computer.svg` | `/images/explore/discover/icons/atlas/college-computer-alpha-v2.png` |
| `static/assets/atlas/college-literature.svg` | `/images/explore/discover/icons/atlas/college-literature.png` |
| `static/assets/atlas/college-business.svg` | `/images/explore/discover/icons/atlas/college-business.png` |
| `static/assets/atlas/college-arts.svg` | `/images/explore/discover/icons/atlas/college-arts.png` |
| `static/assets/careers/career-generic.svg` | 无直接对应 OSS 路径，旧版兜底 |
| `static/assets/home-science/major-row-wave-506-9919.svg` | `/images/explore/discover/figma/home-professional-assets/major-row-wave-506-9919.svg` ？ |

---

## 四、⚠️ 重要：仍在包内且直接引用的 SVG（不能删除 / 不能 ignore）

以下文件通过 `/static/` 路径**硬编码**在代码中，必须保留：

| 文件 | 引用位置 |
|-----|--------|
| `static/assets/auth/login-background-waves.svg` | `login.vue` |
| `static/assets/auth/login-brand-mark.svg` | `login.vue`（已由 PNG 换为 SVG） |
| `static/assets/auth/login-icon-phone.svg` | `login.vue` |
| `static/assets/auth/login-icon-wechat.svg` | `login.vue` |
| `static/assets/auth/login-icon-back.svg` | `login.vue` |
| `static/assets/auth/login-icon-ticket.svg` | `login.vue` |
| `static/assets/auth/card-interest.svg` | `launch.vue` |
| `static/assets/auth/card-personality.svg` | `launch.vue` |
| `static/assets/auth/card-career.svg` | `launch.vue` |
| `static/assets/auth/card-ability.svg` | `launch.vue` |
| `static/assets/auth/background-curves.svg` | `launch.vue` |
| `static/assets/discover/interest-road.svg` | `index.vue` |
| `static/assets/discover/continue-bubble-down.svg` | `index.vue` |
| `static/assets/discover/road-lock-top.svg` | `index.vue`, `math/index.vue`, `math/deep-explore.vue` |
| `static/assets/discover/road-lock-body.svg` | `index.vue`, `math/index.vue`, `math/deep-explore.vue` |
| `static/assets/discover/road-progress-1.svg` | `business/home-interest-road-progress.js` |
| `static/assets/discover/road-progress-2.svg` | `business/home-interest-road-progress.js` |
| `static/assets/discover/road-progress-3.svg` | `business/home-interest-road-progress.js` |
| `static/assets/discover/road-progress-4.svg` | `business/home-interest-road-progress.js` |
| `static/assets/discover/profile-clipboard-figma.svg` | `share-invite.vue`, `DiscoverReportView.vue` |
| `static/assets/discover/share-join-globe.svg` | `share-invite.vue`, `DiscoverReportView.vue` |
| `static/assets/discover/tabbar/icon-interest.svg` | `index.vue`, `major.vue`, 等 |
| `static/assets/discover/tabbar/icon-major.svg` | `index.vue`, `major.vue` |
| `static/assets/discover/tabbar/icon-achievement.svg` | `profile/index.vue`, 等 |
| `static/assets/discover/tabbar/icon-profile.svg` | `profile/index.vue`, 等 |
| `static/assets/discover/tabbar/icon-lock.svg` | `index.vue`, `major.vue` |
| `static/assets/discover/tabbar/icon-more.svg` | tabbar |
| `static/assets/discover/tabbar/system-line-long.svg` | `index.vue`, `major.vue` |
| `static/assets/discover/tabbar/system-line-short.svg` | `index.vue`, `major.vue` |
| `static/assets/math/math-road.svg` | `subpkg/math/deep-explore.vue` |
| `static/assets/math/math-road-progress-1~5.svg` | `subpkg/math/deep-explore.vue` |
| `static/assets/math/math-stage-arrow-active.svg` | `subpkg/math/deep-explore.vue` |
| `static/assets/math/math-stage-arrow-locked.svg` | `subpkg/math/deep-explore.vue` |
| `static/assets/math/continue-bubble-down-cyan.svg` | `subpkg/math/deep-explore.vue` |
| `static/assets/math/math-shadow-*.svg`（4个）| `subpkg/math/deep-explore.vue` |

---

## 五、快速核查 OSS 脚本

打开浏览器，逐一访问以下地址，确认能正常返回图片（非 403/404）：

```
# 报告麦穗角标
https://assets.uniprism.cn/explore-static/discover/figma/report/report-v4-top-rank-corner.png

# 专业图标（报告页核心）
https://assets.uniprism.cn/images/explore/discover/icons/generated/discover-major-economics-20260610-v2-flat2d.png
https://assets.uniprism.cn/images/explore/discover/icons/generated/discover-major-artificial-intelligence-20260610-v2-flat2d.png
https://assets.uniprism.cn/images/explore/discover/icons/generated/discover-major-computer-science-technology-20260610-v2-flat2d.png
https://assets.uniprism.cn/images/explore/discover/icons/generated/discover-major-finance-20260608-v1.png
https://assets.uniprism.cn/images/explore/discover/icons/generated/discover-major-data-science-big-data-technology-20260610-v2-flat2d.png

# 学院卡片图标（major.vue）
https://assets.uniprism.cn/images/explore/discover/figma/home-professional-assets/icon-engineering-494-3715.svg
https://assets.uniprism.cn/images/explore/discover/figma/home-professional-assets/icon-computer-494-3820.svg
https://assets.uniprism.cn/images/explore/discover/figma/home-professional-assets/icon-law-494-3935.svg
https://assets.uniprism.cn/images/explore/discover/figma/home-professional-assets/icon-medical-494-3924.svg
https://assets.uniprism.cn/images/explore/discover/figma/home-professional-assets/icon-literature-494-3911.svg
https://assets.uniprism.cn/images/explore/discover/figma/home-professional-assets/icon-science-base-494-3752.svg
https://assets.uniprism.cn/images/explore/discover/figma/home-professional-assets/icon-science-paper-494-3796.svg
https://assets.uniprism.cn/images/explore/discover/figma/home-professional-assets/icon-science-flask-494-3817.svg

# 兴趣探索首页 stage 图标
https://assets.uniprism.cn/images/explore/discover/figma/stage-personality-icon-transparent-20260615.png
https://assets.uniprism.cn/images/explore/discover/figma/stage-career-icon-transparent-20260615.png
https://assets.uniprism.cn/images/explore/discover/figma/stage-deep-icon-transparent-20260615.png
https://assets.uniprism.cn/explore-static/discover/figma/report-ready-clipboard-figma-205-12203.png

# 报告页麦穗彩带
https://assets.uniprism.cn/images/explore/discover/figma/report/major-ribbon-left.svg
https://assets.uniprism.cn/images/explore/discover/figma/report/major-ribbon-right.svg
```

---

## 六、如果 OSS 缺文件怎么办

1. 从本地 `static/assets/` 找到对应 SVG 文件（仍在磁盘，只是 ignore 了）
2. 上传到 OSS，路径对应上表中的 OSS 对应路径
3. 或者：从 `UniPrism_New-main/public/images/` 找对应源文件上传

如果某个文件确实找不到 OSS 对应，可以把它从 `packOptions.ignore` 中移除，让它重新回到本地包里作为兜底。

---

*此文档由代码分析自动生成，OSS 实际可用性需手动验证。*
