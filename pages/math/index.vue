<template>
  <view class="page">
    <view class="top-sticky-shell">
      <view class="top-progress">
        <view class="stage-track">
          <view class="stage-track-bg" />
          <view class="stage-fill" :style="{ width: stageFillWidth }" />
          <view class="stage-dots">
            <view
              v-for="(stage, idx) in stageMeta"
              :key="`${stage.key}-dot`"
              class="stage-dot-wrap"
              :class="{ 'stage-dot-wrap-clickable': isStageUnlocked(idx) }"
              @tap="jumpToStage(idx)"
            >
              <view
                class="stage-dot"
                :class="{
                  'stage-dot-active': idx === activeStageIndex,
                  'stage-dot-done': isStageCompleted(idx),
                  'stage-dot-locked': !isStageUnlocked(idx),
                }"
              >
                <image
                  class="stage-diamond"
                  :src="resolveAsset(idx <= activeStageIndex ? progressDiamondActive : progressDiamondInactive)"
                  mode="aspectFit"
                />
              </view>
            </view>
          </view>
        </view>
        <view class="stage-labels">
          <text
            v-for="(stage, idx) in stageMeta"
            :key="`${stage.key}-label`"
            class="stage-label"
            :class="{
              'stage-label-active': idx === activeStageIndex,
              'stage-label-done': isStageCompleted(idx),
              'stage-label-locked': !isStageUnlocked(idx),
            }"
            @tap="jumpToStage(idx)"
          >
            {{ idx + 1 }}.{{ stage.shortLabel || stage.label }}
          </text>
        </view>
      </view>

      <view class="shell-header">
        <view class="header-copy">
          <text class="header-kicker">数学专业体验</text>
          <text class="header-stage-mini">{{ currentStageLabel }}</text>
        </view>
      </view>

      <scroll-view scroll-x class="progress-nav-scroll" :show-scrollbar="false" enable-flex>
        <view class="progress-nav-row">
          <view
            v-for="item in topLevelNavItems"
            :key="item.id"
            class="progress-nav-pill"
            :class="{
              'progress-nav-pill-active': item.active,
              'progress-nav-pill-locked': !item.unlocked,
            }"
            @tap="jumpToNavItem(item)"
          >
            <text class="progress-nav-pill-text">{{ item.label }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view
        v-if="tertiaryNavItems.length"
        scroll-x
        class="tertiary-nav-scroll"
        :show-scrollbar="false"
        enable-flex
      >
        <view class="tertiary-nav-row">
          <view
            v-for="item in tertiaryNavItems"
            :key="item.id"
            class="tertiary-nav-pill"
            :class="{
              'tertiary-nav-pill-active': item.active,
              'tertiary-nav-pill-locked': !item.unlocked,
            }"
            @tap="jumpToTertiaryItem(item)"
          >
            <text class="tertiary-nav-pill-text">{{ item.label }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <scroll-view
      class="body"
      scroll-y
      :enable-back-to-top="true"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoViewTarget"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <view :id="pageTopAnchorId" class="page-top-anchor" />

      <!-- 三级区域：仅 Part1 等简单页；课程页标题放入正文 -->
      <view
        v-if="showTertiaryZone"
        class="tertiary-zone"
      >
        <view class="tertiary-head">
          <text class="tertiary-title">{{ tertiaryPageTitle }}</text>
          <text v-if="tertiaryPageSubtitle" class="tertiary-sub">{{ tertiaryPageSubtitle }}</text>
        </view>
      </view>

      <view v-if="showModuleCard" class="module-card">
        <view class="module-card-head">
          <text class="module-card-chip">{{ stageMeta[activeStageIndex] ? stageMeta[activeStageIndex].label : '数学专业体验' }}</text>
        </view>
        <text v-if="showModuleTitle" class="module-card-title">{{ currentDisplayTitle }}</text>
        <text v-if="currentPageSummary" class="module-card-desc">{{ currentPageSummary }}</text>
        <view class="module-card-meta">
          <text v-if="currentPage.course && currentPage.course.pagesCount" class="module-meta-pill">共 {{ currentPage.course.pagesCount }} 个主题</text>
          <text v-if="currentPage.course && currentPage.course.challengeEnabled" class="module-meta-pill module-meta-pill-accent">含互动挑战</text>
        </view>
      </view>

      <!-- 欢迎页 -->
      <view v-if="currentPage.type === 'welcome'" class="stage">
        <view class="intro-copy-panel intro-copy-panel-tabbed">
          <text
            v-for="(paragraph, idx) in currentPage.paragraphs"
            :key="`welcome-${idx}`"
            class="intro-paragraph"
          >
            {{ paragraph }}
          </text>
        </view>
        <view class="intro-card-grid intro-card-grid-compact">
          <view v-for="card in currentPage.cards" :key="card.index" class="intro-card intro-card-compact">
            <image class="intro-card-image" :src="resolveAsset(card.image)" mode="aspectFill" />
            <view class="intro-card-copy">
              <text class="intro-card-index">{{ card.index }}</text>
              <text class="intro-card-title">{{ card.title }}</text>
              <text class="intro-card-body">{{ card.body }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 专业介绍 -->
      <view v-else-if="currentPage.type === 'intro-text'" class="stage">
        <view class="intro-copy-panel intro-copy-panel-tabbed">
          <text
            v-for="(paragraph, idx) in currentPage.paragraphs"
            :key="`intro-${idx}`"
            class="intro-paragraph"
          >
            {{ paragraph }}
          </text>
        </view>
        <view class="intro-card-grid">
          <view v-for="card in currentPage.cards" :key="card.index" class="intro-card">
            <view class="intro-card-copy">
              <text class="intro-card-index">{{ card.index }}</text>
              <text class="intro-card-title">{{ card.title }}</text>
              <text class="intro-card-body">{{ card.body }}</text>
            </view>
            <image class="intro-card-side-image" :src="resolveAsset(card.image)" mode="aspectFit" />
          </view>
        </view>
      </view>

      <!-- 介绍视频 -->
      <view v-else-if="currentPage.type === 'intro-video'" class="stage">
        <view class="intro-copy-panel intro-copy-panel-tabbed">
          <text class="stage-intro">{{ currentPage.summary }}</text>
        </view>
        <view class="video-panel">
          <video
            class="intro-video"
            :src="resolveVideoAsset(currentPage.videoSrc)"
            :poster="resolveAsset(currentPage.posterImage)"
            controls
            object-fit="contain"
            show-center-play-btn
          />
          <text class="video-caption">{{ currentPage.videoTitle }}</text>
        </view>
      </view>

      <!-- 阶段导语 -->
      <view v-else-if="currentPage.type === 'stage-intro'" class="stage">
        <image class="hero-image" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        <view class="spotlight-panel">
          <text class="spotlight-badge">{{ currentPage.stageIndex === 1 ? '基础课入口' : '进阶课入口' }}</text>
          <text class="spotlight-title">{{ getStageIntroHeading(currentPage) }}</text>
          <text class="spotlight-body">{{ currentPage.intro }}</text>
        </view>
        <view class="course-list">
          <view v-for="course in currentPage.courses" :key="course.id" class="course-entry-card">
            <image v-if="course.heroImage" class="course-entry-image" :src="resolveAsset(course.heroImage)" mode="aspectFill" />
            <view class="course-entry-copy">
              <text class="course-entry-badge">{{ course.badge }}</text>
              <text class="course-entry-title">{{ course.title }}</text>
              <text class="course-entry-sub">{{ course.subtitle }}</text>
              <text class="course-entry-meta">共 {{ course.pagesCount }} 页 · 后续可进入正文与任务</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 概览卡片 -->
      <view v-else-if="currentPage.type === 'catalog' || currentPage.type === 'intro-home'" class="stage">
        <image class="hero-image" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        <text class="stage-intro">{{ currentPage.type === 'catalog' ? '建立整体印象，了解数学专业能做什么。' : '了解课程体系、发展方向与案例体验。' }}</text>
        <view v-for="card in currentPage.cards" :key="card.index" class="catalog-card">
          <image class="catalog-image" :src="resolveAsset(card.image)" mode="widthFix" />
          <view class="catalog-copy">
            <text class="catalog-index">{{ card.index }}</text>
            <text class="catalog-title">{{ card.title }}</text>
            <text class="catalog-body">{{ card.body }}</text>
          </view>
        </view>
      </view>

      <!-- 阶段完成 -->
      <view v-else-if="currentPage.type === 'stage-complete'" class="stage">
        <view class="completion-card completion-card-tabbed">
          <text class="completion-badge">阶段完成</text>
          <text class="completion-desc">{{ currentPage.completionDescription }}</text>
          <view class="next-stage-card">
            <text class="next-stage-label">下一阶段</text>
            <text class="next-stage-title">{{ currentPage.nextStageTitle }}</text>
            <text class="next-stage-desc">{{ currentPage.nextStageDescription }}</text>
          </view>
        </view>
      </view>

      <!-- 课程概览 / 课程介绍 -->
      <view v-else-if="currentPage.type === 'course-overview'" class="stage">
        <view class="article-panel article-panel-tabbed">
          <view class="article-body-head">
            <text class="article-body-title">{{ currentPage.title }}</text>
          </view>
          <video
            v-if="currentPage.videoSrc"
            class="intro-video"
            :src="resolveVideoAsset(currentPage.videoSrc)"
            controls
            object-fit="contain"
            show-center-play-btn
          />
          <text v-if="currentPage.videoTitle" class="video-caption">{{ currentPage.videoTitle }}</text>
          <image
            v-if="currentPage.imageSrc"
            class="section-image"
            :src="resolveAsset(currentPage.imageSrc)"
            mode="widthFix"
          />
          <text class="article-paragraph">{{ currentPage.summary }}</text>
          <text
            v-for="(paragraph, idx) in currentPage.body || []"
            :key="`overview-body-${idx}`"
            class="article-paragraph"
          >
            {{ paragraph }}
          </text>
          <view v-if="currentPage.formula" class="formula-card">
            <text class="formula-math">{{ currentPage.formula }}</text>
          </view>
        </view>
      </view>

      <!-- 课程 section 正文 -->
      <view v-else-if="currentPage.type === 'course-section'" class="stage">
        <view class="article-panel article-panel-tabbed">
          <view class="article-body-head">
            <text class="article-body-title">{{ currentPage.title }}</text>
          </view>
          <view
            v-for="(item, idx) in courseSectionItems"
            :key="`course-item-${idx}`"
          >
            <text v-if="item.type === 'paragraph'" class="article-paragraph">{{ item.text }}</text>
            <view v-else-if="item.type === 'blockFormula'" class="formula-card">
              <text class="formula-math">{{ item.latex }}</text>
              <text v-if="item.explanation" class="formula-note">{{ item.explanation }}</text>
            </view>
            <view v-else-if="item.type === 'figure'" class="figure-card">
              <image v-if="item.imageSrc" class="section-image" :src="resolveAsset(item.imageSrc)" mode="widthFix" />
              <text v-if="item.caption" class="figure-caption">{{ item.caption }}</text>
            </view>
            <view v-else-if="item.type === 'lectureBlock'" class="lecture-block-card">
              <text v-if="item.title" class="lecture-block-title">{{ item.title }}</text>
              <text v-if="item.body" class="lecture-block-body">{{ item.body }}</text>
              <view v-if="item.latex" class="formula-card">
                <text class="formula-math">{{ item.latex }}</text>
              </view>
            </view>
            <text v-else-if="item.text" class="article-paragraph">{{ item.text }}</text>
          </view>
        </view>
      </view>

      <!-- 习题体验入口 -->
      <view v-else-if="currentPage.type === 'course-challenge'" class="stage">
        <view class="article-panel article-panel-tabbed">
          <view class="article-body-head">
            <text class="article-body-title">{{ currentPage.title }}</text>
          </view>
          <text class="article-paragraph">{{ currentPage.summary }}</text>

          <view v-if="currentPage.courseId === 'analysis'" class="challenge-section challenge-section-inline">
            <text class="challenge-section-title">挑战任务（建议按顺序解锁）</text>
            <view
              v-for="card in analysisChallengeCards"
              :key="`entry-${card.id}`"
              class="challenge-entry-card"
              :class="{
                'challenge-entry-locked': card.locked,
                'challenge-entry-done': card.completed,
              }"
              @tap="startAnalysisChallenge(card)"
            >
              <image class="challenge-entry-image" :src="resolveAsset(card.imageSrc)" mode="widthFix" />
              <view class="challenge-entry-copy">
                <view class="challenge-entry-head">
                  <text class="challenge-entry-seq">{{ card.sequenceLabel }}</text>
                  <text v-if="card.completed" class="challenge-entry-status">已完成</text>
                  <text v-else-if="card.locked" class="challenge-entry-status challenge-entry-status-lock">未解锁</text>
                </view>
                <text class="challenge-entry-title">{{ card.title }}</text>
                <text class="challenge-entry-body">{{ card.body }}</text>
              </view>
            </view>
          </view>

          <view v-else class="course-note-card">
            <text class="course-note-title">当前小程序入口</text>
            <text class="course-note-body">这一页已经按 web 端链路放回到该课程的习题体验位置，便于用户理解完整流程。后续会继续把对应课程的独立挑战细节同步到小程序。</text>
          </view>
        </view>
      </view>

      <!-- 数学分析：内联正文 + 底部挑战 -->
      <view v-else-if="currentPage.type === 'math-analysis-inline'" class="stage">
        <view class="article-panel article-panel-flat">
          <text class="inline-course-title">数学分析</text>
          <text class="inline-course-sub">理解连续世界的基础语言</text>
          <view v-for="(section, sIdx) in analysisSections" :key="`${section.title}-${sIdx}`" class="article-section">
            <text v-if="section.role" class="section-role">{{ section.role }}</text>
            <text class="article-section-title">{{ section.title }}</text>
            <view v-if="section.content && section.content.length">
              <view v-for="(item, idx) in section.content" :key="idx">
                <text v-if="item.type === 'paragraph'" class="article-paragraph">{{ item.text }}</text>
                <view v-else-if="item.type === 'blockFormula'" class="formula-card">
                  <text class="formula-math">{{ item.latex }}</text>
                  <text v-if="item.explanation" class="formula-note">{{ item.explanation }}</text>
                </view>
                <view v-else-if="item.type === 'figure'" class="figure-card">
                  <image v-if="item.imageSrc" class="section-image" :src="resolveAsset(item.imageSrc)" mode="widthFix" />
                  <text v-if="item.caption" class="figure-caption">{{ item.caption }}</text>
                </view>
              </view>
            </view>
            <template v-else>
              <text v-for="(paragraph, pIdx) in section.paragraphs" :key="pIdx" class="article-paragraph">{{ paragraph }}</text>
              <text v-if="section.formula" class="formula-math">{{ section.formula }}</text>
              <image v-if="section.imageSrc" class="section-image" :src="resolveAsset(section.imageSrc)" mode="widthFix" />
            </template>
          </view>
        </view>

        <view class="challenge-section">
          <text class="challenge-section-title">挑战任务（建议按顺序解锁）</text>
          <view
            v-for="(card, idx) in analysisChallengeCards"
            :key="card.id"
            class="challenge-entry-card"
            :class="{
              'challenge-entry-locked': card.locked,
              'challenge-entry-done': card.completed,
            }"
            @tap="startAnalysisChallenge(card)"
          >
            <image class="challenge-entry-image" :src="resolveAsset(card.imageSrc)" mode="widthFix" />
            <view class="challenge-entry-copy">
              <view class="challenge-entry-head">
                <text class="challenge-entry-seq">{{ card.sequenceLabel }}</text>
                <text v-if="card.completed" class="challenge-entry-status">已完成</text>
                <text v-else-if="card.locked" class="challenge-entry-status challenge-entry-status-lock">未解锁</text>
              </view>
              <text class="challenge-entry-title">{{ card.title }}</text>
              <text class="challenge-entry-body">{{ card.body }}</text>
              <text v-if="card.locked" class="challenge-entry-hint">{{ card.unlockHint }}</text>
              <text v-else class="challenge-entry-action">{{ card.completed ? '再次挑战' : '开始挑战' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 课程页（基础/深入） -->
      <view v-else-if="currentPage.type === 'math-course'" class="stage">
        <view class="course-panel">
          <image
            v-if="getCourseCover(currentPage.course)"
            class="course-cover-image"
            :src="resolveAsset(getCourseCover(currentPage.course))"
            mode="aspectFill"
          />
          <view class="course-head">
            <text class="course-flag">{{ currentPage.level === 'foundation' ? '基础课' : '核心课' }}</text>
            <text class="course-title">{{ currentPage.course.title }}</text>
            <text class="course-sub">{{ currentPage.course.subtitle }}</text>
          </view>
          <view class="course-tag-row">
            <text class="course-chip">{{ currentPage.level === 'foundation' ? '本科基础训练' : '本科进阶训练' }}</text>
            <text class="course-chip">共 {{ currentPage.course.pagesCount }} 个主题</text>
            <text v-if="currentPage.course.challengeEnabled" class="course-chip course-chip-accent">含挑战任务</text>
          </view>
          <text class="course-preview">{{ getCourseLeadText(currentPage.course) }}</text>
          <view class="course-outline-card">
            <text class="course-outline-label">你会先接触这些主题</text>
            <view class="topic-list">
              <view
                v-for="(topic, topicIdx) in getCourseTopics(currentPage.course)"
                :key="`${currentPage.course.id}-topic-${topicIdx}`"
                class="topic-item"
              >
                <text class="topic-index">{{ topicIdx + 1 }}</text>
                <view class="topic-copy">
                  <text class="topic-title">{{ topic.title }}</text>
                  <text class="topic-role">{{ topic.role }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="course-note-card">
            <text class="course-note-title">阅读建议</text>
            <text class="course-note-body">先看每个主题在解决什么问题，再观察数学是怎样把直觉变成定义、公式和证明链条的。</text>
          </view>
          <view class="course-preview-stack">
            <text class="course-section-title">主题预览</text>
            <view
              v-for="(section, previewIdx) in getCoursePreviewSections(currentPage.course)"
              :key="`${currentPage.course.id}-preview-${previewIdx}`"
              class="course-preview-card"
            >
              <view class="course-preview-head">
                <text class="course-preview-index">主题 {{ previewIdx + 1 }}</text>
                <text class="course-preview-role">{{ section.role }}</text>
              </view>
              <text class="course-preview-topic">{{ section.title }}</text>
              <text
                v-for="(paragraph, pIdx) in section.paragraphs"
                :key="`${currentPage.course.id}-preview-${previewIdx}-paragraph-${pIdx}`"
                class="course-preview-paragraph"
              >
                {{ paragraph }}
              </text>
              <view v-if="section.formula" class="course-preview-formula-card">
                <text class="course-preview-formula">{{ section.formula }}</text>
                <text v-if="section.formulaExplanation" class="course-preview-formula-note">{{ section.formulaExplanation }}</text>
              </view>
              <view v-if="section.figure" class="course-preview-figure-card">
                <image class="course-preview-figure" :src="resolveAsset(section.figure.imageSrc)" mode="widthFix" />
                <text class="course-preview-figure-note">{{ section.figure.caption || section.figure.imageAlt }}</text>
              </view>
            </view>
          </view>
          <view class="course-path-card">
            <text class="course-section-title">完整体验流程</text>
            <view class="course-path-list">
              <view
                v-for="(step, stepIdx) in getCourseLearningPath(currentPage.course)"
                :key="`${currentPage.course.id}-path-${stepIdx}`"
                class="course-path-item"
              >
                <text class="course-path-index">{{ stepIdx + 1 }}</text>
                <view class="course-path-copy">
                  <text class="course-path-title">{{ step.title }}</text>
                  <text class="course-path-desc">{{ step.desc }}</text>
                </view>
              </view>
            </view>
          </view>
          <view class="action-row">
            <button class="btn-inline" @tap="goReadCourse(currentPage.course.id)">阅读课程</button>
            <button
              v-if="currentPage.course.challengeEnabled"
              class="btn-inline btn-inline-accent"
              @tap="goAnalysisChallenge"
            >
              进入挑战
            </button>
          </view>
          <view class="course-status-row">
            <text v-if="visitedCourses.includes(currentPage.course.id)" class="visited-tag">已阅读</text>
            <text v-if="currentPage.course.challengeEnabled" class="visited-tag visited-tag-muted">建议完成正文后再挑战</text>
          </view>
        </view>
      </view>

      <!-- 深入开始 -->
      <view v-else-if="currentPage.type === 'deep-start'" class="stage">
        <image class="hero-image" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        <text class="stage-intro">{{ currentPage.intro }}</text>
        <view v-for="course in currentPage.courses" :key="course.id" class="course-card">
          <text class="course-title">{{ course.title }}</text>
          <text class="course-sub">{{ course.subtitle }}</text>
          <text class="course-meta-inline">{{ course.pagesCount }} 页</text>
        </view>
      </view>

      <!-- 分流 -->
      <view v-else-if="currentPage.type === 'branching'" class="stage">
        <image class="hero-image" :src="resolveAsset(currentPage.heroImage)" mode="widthFix" />
        <text class="stage-intro">探索不同方向，获得个性化建议。请选择一个你更想长期投入的训练方向。</text>
        <view
          v-for="branch in currentPage.branches"
          :key="branch.id"
          class="branch-card"
          :class="{ 'branch-card-active': selectedBranchId === branch.id }"
          @tap="selectBranch(branch)"
        >
          <image v-if="branch.imageSrc" class="branch-card-image" :src="resolveAsset(branch.imageSrc)" mode="aspectFill" />
          <view class="branch-head">
            <text class="branch-title">{{ branch.title }}</text>
            <text v-if="selectedBranchId === branch.id" class="branch-check">已选</text>
          </view>
          <text class="branch-subtitle">{{ branch.subtitle }}</text>
          <text class="branch-body">{{ branch.body }}</text>
          <view class="branch-tags">
            <text v-for="module in branch.modules" :key="module" class="branch-tag">{{ module }}</text>
          </view>
          <text class="branch-fit">{{ branch.fit }}</text>
        </view>
      </view>

      <!-- 方向概览 -->
      <view v-else-if="currentPage.type === 'branch-overview'" class="stage">
        <view class="article-panel">
          <text class="completion-badge">方向总览</text>
          <text class="article-title">{{ currentPage.branch.title }}</text>
          <text class="article-sub">{{ currentPage.subtitle || currentPage.branch.subtitle }}</text>
          <video
            v-if="currentPage.videoSrc && !isCurrentVideoFailed()"
            class="intro-video"
            :src="resolveVideoAsset(currentPage.videoSrc)"
            :poster="resolveAsset(currentPage.heroImage || currentPage.posterImage)"
            controls
            object-fit="contain"
            show-center-play-btn
            @error="onCurrentVideoError"
          />
          <view v-else-if="currentPage.videoSrc" class="media-fallback-card">
            <text class="media-fallback-title">视频暂不可播放</text>
            <text class="media-fallback-desc">当前已回退展示封面图，你仍可继续浏览本页文字内容。</text>
          </view>
          <text v-if="currentPage.videoTitle" class="video-caption">{{ currentPage.videoTitle }}</text>
          <image
            v-if="currentPage.heroImage && !isCurrentHeroFailed()"
            class="hero-image"
            :src="resolveAsset(currentPage.heroImage)"
            mode="widthFix"
            @error="onCurrentHeroError"
          />
          <view v-else-if="currentPage.heroImage" class="media-fallback-card">
            <text class="media-fallback-title">图片暂不可加载</text>
            <text class="media-fallback-desc">当前素材地址不可用，已保留文字内容供继续体验。</text>
          </view>
          <text class="article-paragraph">{{ currentPage.summary || currentPage.branch.body }}</text>
          <text
            v-for="(paragraph, idx) in currentPage.body || []"
            :key="`branch-overview-${idx}`"
            class="article-paragraph"
          >
            {{ paragraph }}
          </text>
          <view class="branch-tags">
            <text v-for="module in currentPage.branch.modules" :key="module" class="branch-tag">{{ module }}</text>
          </view>
          <view class="course-note-card">
            <text class="course-note-title">适配人群</text>
            <text class="course-note-body">{{ currentPage.branch.fit }}</text>
          </view>
        </view>
      </view>

      <!-- 方向专题 -->
      <view v-else-if="currentPage.type === 'branch-topic'" class="stage">
        <view class="article-panel">
          <text class="completion-badge">专题体验</text>
          <text class="article-title">{{ currentPage.topic.title }}</text>
          <text class="article-sub">{{ currentPage.topic.subtitle }}</text>
          <video
            v-if="currentPage.videoSrc && !isCurrentVideoFailed()"
            class="intro-video"
            :src="resolveVideoAsset(currentPage.videoSrc)"
            :poster="resolveAsset(currentPage.heroImage || currentPage.posterImage)"
            controls
            object-fit="contain"
            show-center-play-btn
            @error="onCurrentVideoError"
          />
          <view v-else-if="currentPage.videoSrc" class="media-fallback-card">
            <text class="media-fallback-title">视频暂不可播放</text>
            <text class="media-fallback-desc">当前已回退展示封面图，你仍可继续浏览本专题内容。</text>
          </view>
          <text v-if="currentPage.videoTitle" class="video-caption">{{ currentPage.videoTitle }}</text>
          <image
            v-if="currentPage.heroImage && !isCurrentHeroFailed()"
            class="hero-image"
            :src="resolveAsset(currentPage.heroImage)"
            mode="widthFix"
            @error="onCurrentHeroError"
          />
          <view v-else-if="currentPage.heroImage" class="media-fallback-card">
            <text class="media-fallback-title">图片暂不可加载</text>
            <text class="media-fallback-desc">当前素材地址不可用，已保留文字内容供继续体验。</text>
          </view>
          <text class="article-paragraph">{{ currentPage.topic.summary }}</text>
          <view class="interaction-panel">
            <text class="interaction-title">{{ currentPage.topic.interaction.title }}</text>
            <text class="interaction-goal">{{ currentPage.topic.interaction.goal }}</text>
            <text class="task-line">输出：{{ currentPage.topic.interaction.output }}</text>
          </view>
        </view>
      </view>

      <view v-else-if="currentPage.type === 'branch-topic-section'" class="stage">
        <view class="article-panel">
          <text class="completion-badge">专题正文</text>
          <text class="article-title">{{ currentPage.title }}</text>
          <text class="article-sub">{{ currentPage.subtitle }}</text>
          <video
            v-if="currentPage.videoSrc && !isCurrentVideoFailed()"
            class="intro-video"
            :src="resolveVideoAsset(currentPage.videoSrc)"
            :poster="resolveAsset(currentPage.heroImage || currentPage.posterImage)"
            controls
            object-fit="contain"
            show-center-play-btn
            @error="onCurrentVideoError"
          />
          <view v-else-if="currentPage.videoSrc" class="media-fallback-card">
            <text class="media-fallback-title">视频暂不可播放</text>
            <text class="media-fallback-desc">当前已回退展示封面图，你仍可继续浏览本节正文内容。</text>
          </view>
          <text v-if="currentPage.videoTitle" class="video-caption">{{ currentPage.videoTitle }}</text>
          <image
            v-if="currentPage.heroImage && !isCurrentHeroFailed()"
            class="hero-image"
            :src="resolveAsset(currentPage.heroImage)"
            mode="widthFix"
            @error="onCurrentHeroError"
          />
          <view v-else-if="currentPage.heroImage" class="media-fallback-card">
            <text class="media-fallback-title">图片暂不可加载</text>
            <text class="media-fallback-desc">当前素材地址不可用，已保留文字内容供继续体验。</text>
          </view>
          <text
            v-for="(paragraph, idx) in currentPage.section.paragraphs"
            :key="`branch-topic-section-${idx}`"
            class="article-paragraph"
          >
            {{ paragraph }}
          </text>
        </view>
      </view>

      <view v-else-if="currentPage.type === 'branch-topic-challenge'" class="stage">
        <view class="article-panel">
          <text class="completion-badge">专题任务</text>
          <text class="article-title">{{ currentPage.topic.title }}</text>
          <text class="article-sub">{{ currentPage.topic.subtitle }}</text>
          <video
            v-if="currentPage.videoSrc && !isCurrentVideoFailed()"
            class="intro-video"
            :src="resolveVideoAsset(currentPage.videoSrc)"
            :poster="resolveAsset(currentPage.heroImage || currentPage.posterImage)"
            controls
            object-fit="contain"
            show-center-play-btn
            @error="onCurrentVideoError"
          />
          <view v-else-if="currentPage.videoSrc" class="media-fallback-card">
            <text class="media-fallback-title">视频暂不可播放</text>
            <text class="media-fallback-desc">当前已回退展示封面图，你仍可继续完成专题任务判断。</text>
          </view>
          <text v-if="currentPage.videoTitle" class="video-caption">{{ currentPage.videoTitle }}</text>
          <image
            v-if="currentPage.heroImage && !isCurrentHeroFailed()"
            class="hero-image"
            :src="resolveAsset(currentPage.heroImage)"
            mode="widthFix"
            @error="onCurrentHeroError"
          />
          <view v-else-if="currentPage.heroImage" class="media-fallback-card">
            <text class="media-fallback-title">图片暂不可加载</text>
            <text class="media-fallback-desc">当前素材地址不可用，已保留文字内容供继续体验。</text>
          </view>
          <text class="article-paragraph">{{ currentPage.topic.interaction.goal }}</text>
          <view class="interaction-panel">
            <text class="interaction-title">{{ currentPage.topic.interaction.title }}</text>
            <text class="task-line">输出：{{ currentPage.topic.interaction.output }}</text>
          </view>
        </view>
      </view>

      <!-- 职业路径 -->
      <view v-else-if="currentPage.type === 'branch-rolemap'" class="stage">
        <view class="article-panel">
          <text class="completion-badge">职业路径</text>
          <text class="article-title">{{ currentPage.branch.title }} · 职业路径</text>
          <text class="article-sub">结合方向训练重点，这些岗位通常需要类似的数学能力结构。</text>
          <view class="role-grid">
            <view v-for="role in rolemapRoles" :key="role" class="role-card">
              <text class="role-card-title">{{ role }}</text>
              <text class="role-card-desc">需要把该方向训练出的数学能力迁移到真实业务、研究或工程问题中。</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 完成 -->
      <view v-else-if="currentPage.type === 'done'" class="stage">
        <view class="completion-card">
          <text class="completion-badge">体验完成</text>
          <text class="completion-title">{{ currentPage.completionTitle }}</text>
          <text class="completion-desc">{{ currentPage.completionDescription }}</text>
        </view>
        <view class="finish-card">
          <text class="finish-title">适配判断</text>
          <text class="finish-desc">结合你刚体验的方向与专题，判断自己是否愿意长期投入这类问题。</text>
          <view class="summary-card">
            <text class="summary-line">方向：{{ selectedBranchTitle || '未选择' }}</text>
            <text class="summary-line">已阅读课程：{{ visitedCourses.length }} 门</text>
          </view>
          <view
            v-for="option in fitOptions"
            :key="option.value"
            class="fit-option"
            :class="{ 'fit-option-active': fitChoice === option.value }"
            @tap="selectFit(option.value)"
          >
            <text class="fit-option-text">{{ option.label }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="footer">
      <button v-if="pageIndex > 0" class="btn-ghost" @tap="prevPage">上一页</button>
      <button
        v-if="pageIndex < pages.length - 1"
        class="btn-primary"
        :disabled="!canNext"
        @tap="nextPage"
      >
        {{ nextLabel }}
      </button>
      <button v-else class="btn-primary" @tap="finishExperience">
        {{ completed ? '完成并返回' : '完成体验' }}
      </button>
    </view>
  </view>
</template>

<script>
import { markMajorExplored } from '../../business/explore-progress'
import { loadMathProgress, markMathCourseVisited, saveMathProgress } from '../../business/math-progress'
import { MATH_BRANCH_ROLEMAPS, MATH_BRANCH_TOPICS } from '../../business/math-config'
import {
  buildMathSpeedPages,
  findMathBranchOverviewPageIndex,
  MATH_STAGE_META,
} from '../../business/math-speed-pages'
import { analysisArticleSections } from '../../business/math-content.ts'
import { challengeTaskCards } from '../../business/challenge-task-cards'
import {
  readAnalysisChallengeProgress,
  isAnalysisChallengeTaskLocked,
  getAnalysisChallengeUnlockHint,
} from '../../business/analysis-challenge-progress'
import {
  PROGRESS_DIAMOND_ACTIVE,
  PROGRESS_DIAMOND_INACTIVE,
} from '../../business/discover-chat-stages'
import { getAssetHost, resolveAsset } from '../../utils/asset-map'

export default {
  data() {
    return {
      pageIndex: 0,
      unlockedPageIndex: 0,
      scrollTop: 0,
      scrollIntoViewTarget: '',
      pageTopAnchorId: 'math-page-top-anchor',
      touchStartX: 0,
      touchStartY: 0,
      selectedBranchId: 'basic',
      selectedBranchTitle: '基础数学',
      fitChoice: '',
      completed: false,
      visitedCourses: [],
      unlockedStageIndexes: [0],
      stageMeta: MATH_STAGE_META,
      videoFailureState: {},
      imageFailureState: {},
      fitOptions: [
        { value: 'fit', label: '我愿意长期处理抽象推理与证明问题' },
        { value: 'maybe', label: '有兴趣，但还想体验其他专业' },
        { value: 'unfit', label: '不太适合我，想换个方向' },
      ],
      analysisSections: analysisArticleSections,
      analysisChallengeProgress: readAnalysisChallengeProgress(),
      progressDiamondActive: PROGRESS_DIAMOND_ACTIVE,
      progressDiamondInactive: PROGRESS_DIAMOND_INACTIVE,
    }
  },
  computed: {
    pages() {
      return buildMathSpeedPages(this.selectedBranchId)
    },
    stageRanges() {
      const ranges = []
      this.pages.forEach((page, index) => {
        const stageIndex = page.stageIndex || 0
        const last = ranges[ranges.length - 1]
        if (last && last.stageIndex === stageIndex) {
          last.endIndex = index
        } else {
          ranges.push({ stageIndex, startIndex: index, endIndex: index })
        }
      })
      return ranges
    },
    currentPage() {
      return this.pages[this.pageIndex] || { type: 'catalog', title: '', stageIndex: 0 }
    },
    activeStageIndex() {
      return this.currentPage.stageIndex || 0
    },
    currentStageLabel() {
      const stage = this.stageMeta[this.activeStageIndex]
      return stage ? `Part ${this.activeStageIndex + 1} · ${stage.label}` : '数学专业体验'
    },
    currentPageTitle() {
      const page = this.currentPage
      if (page.type === 'stage-complete') return page.navTitle || page.title
      if (page.type === 'done') return page.completionTitle || page.title
      if (page.type === 'stage-intro') return this.getStageIntroHeading(page)
      if (page.type === 'course-section') return page.title
      if (page.type === 'course-overview') return page.title
      if (page.type === 'course-challenge') return page.title
      if (page.type === 'branch-topic-section') return page.title
      if (page.type === 'branch-topic-challenge') return page.title
      if (page.type === 'branch-topic') return page.topic?.title || page.title
      return page.navTitle || page.title
    },
    currentSecondaryLabel() {
      const page = this.currentPage
      if (page.type === 'branch-topic' || page.type === 'branch-topic-section' || page.type === 'branch-topic-challenge') {
        return '专题学习'
      }
      if (page.navTitle) return page.navTitle
      if (page.type === 'course-section') return page.title
      if (page.type === 'course-overview') return page.title
      if (page.type === 'course-challenge') return '习题体验'
      if (page.type === 'welcome') return '欢迎页'
      if (page.type === 'intro-text') return '数学专业介绍'
      if (page.type === 'intro-video') return '介绍视频'
      if (page.type === 'stage-complete') return page.navTitle || page.title
      if (page.type === 'stage-intro') return page.title
      if (page.type === 'branching') return '选择方向'
      if (page.type === 'branch-overview') return '方向概览'
      if (page.type === 'branch-rolemap') return '职业 Rolemap'
      if (page.type === 'done') return '体验完成'
      const tab = this.activeSecondaryTabs.find((item) => item.id === this.currentSecondaryId)
      return tab?.label || page.title
    },
    currentCourseLabel() {
      const page = this.currentPage
      if (page.type === 'course-section' || page.type === 'course-challenge') {
        return page.subtitle || ''
      }
      if (page.type === 'course-overview') return page.subtitle || ''
      return ''
    },
    showModuleCard() {
      const hiddenTypes = new Set([
        'welcome',
        'intro-text',
        'intro-video',
        'stage-complete',
        'stage-intro',
        'course-overview',
        'course-section',
        'course-challenge',
        'branching',
        'branch-overview',
        'branch-topic',
        'branch-rolemap',
        'done',
        'math-analysis-inline',
      ])
      return !hiddenTypes.has(this.currentPage.type)
    },
    currentDisplayTitle() {
      if (this.currentPage.type === 'stage-intro') {
        return this.getStageIntroHeading(this.currentPage)
      }
      if (this.currentPage.type === 'done') return '完成方向体验与最终判断'
      return this.currentSecondaryLabel || this.currentPage.title
    },
    showModuleTitle() {
      return this.currentDisplayTitle && this.currentDisplayTitle !== this.currentSecondaryLabel
    },
    currentPageSummary() {
      if (!this.showModuleCard) return ''
      if (Array.isArray(this.currentPage.body) && this.currentPage.body.length) {
        return this.currentPage.body[0]
      }
      if (Array.isArray(this.currentPage.paragraphs) && this.currentPage.paragraphs.length) {
        return this.currentPage.paragraphs[0]
      }
      if (this.currentPage.summary) return this.currentPage.summary
      if (this.currentPage.intro) return this.currentPage.intro
      if (this.currentPage.course) return this.getCourseLeadText(this.currentPage.course)
      if (this.currentPage.branch?.body) return this.currentPage.branch.body
      if (this.currentPage.topic?.summary) return this.currentPage.topic.summary
      if (this.currentPage.completionDescription) return this.currentPage.completionDescription
      return '按照当前流程继续体验，你会逐步看到课程内容、方向分流和适配判断。'
    },
    rolemapRoles() {
      return MATH_BRANCH_ROLEMAPS[this.selectedBranchId] || []
    },
    currentStageRange() {
      return this.stageRanges.find((range) => range.stageIndex === this.activeStageIndex) || { startIndex: 0, endIndex: 0 }
    },
    currentStageProgressRatio() {
      const range = this.currentStageRange
      const pageCount = Math.max(1, range.endIndex - range.startIndex + 1)
      const offset = Math.max(0, this.pageIndex - range.startIndex)
      return Math.max(0, Math.min(1, offset / pageCount))
    },
    stageSections() {
      return [
        {
          id: 'part1',
          stageIndex: 0,
          label: '数学专业介绍',
          items: [
            { id: 'welcome', label: '欢迎页', pageId: 'catalog-overview' },
            { id: 'intro', label: '数学专业介绍', pageId: 'major-intro-text' },
            { id: 'video', label: '介绍视频', pageId: 'major-overview-video' },
            { id: 'part1-done', label: 'Part1结束', pageId: 'part-one-complete' },
          ],
        },
        {
          id: 'part2',
          stageIndex: 1,
          label: '三门基础课程',
          items: [
            { id: 'part2-start', label: '课程概览', pageId: 'foundation-courses-start' },
            { id: 'analysis', label: '数学分析', matcher: (page) => page.id.startsWith('analysis-') },
            { id: 'linear', label: '线性代数', matcher: (page) => page.id.startsWith('linear-algebra-') },
            { id: 'logic', label: '数理逻辑基础', matcher: (page) => page.id.startsWith('logic-basics') },
            { id: 'part2-done', label: 'Part2结束', pageId: 'major-intro-complete' },
          ],
        },
        {
          id: 'part3',
          stageIndex: 2,
          label: '三门进阶课程',
          items: [
            { id: 'part3-start', label: '课程概览', pageId: 'deep-dive-start' },
            { id: 'probability', label: '概率论', matcher: (page) => page.id.startsWith('probability-') },
            { id: 'abstract', label: '抽象代数', matcher: (page) => page.id.startsWith('abstract-algebra-') },
            { id: 'topology', label: '拓扑学', matcher: (page) => page.id.startsWith('topology-') },
            { id: 'part3-done', label: 'Part3结束', pageId: 'deep-dive-complete' },
          ],
        },
        {
          id: 'part4',
          stageIndex: 3,
          label: '数学专业分流',
          items: [
            { id: 'branch-select', label: '选择方向', pageId: 'branching-start' },
          ],
        },
        {
          id: 'part5',
          stageIndex: 4,
          label: '体验完成',
          items: [
            { id: 'branch-overview', label: '方向概览', matcher: (page) => /^branch-.+-overview$/.test(page.id) },
            { id: 'branch-topic', label: '专题学习', matcher: (page) => /^branch-.+-topic-/.test(page.id) },
            { id: 'branch-rolemap', label: '职业 Rolemap', matcher: (page) => /^branch-.+-rolemap$/.test(page.id) },
            { id: 'complete', label: '体验完成', pageId: 'math-full-experience-complete' },
          ],
        },
      ]
    },
    activeStageSection() {
      return this.stageSections.find((section) => section.stageIndex === this.activeStageIndex) || this.stageSections[0]
    },
    activeSecondaryTabs() {
      return (this.activeStageSection?.items || []).map((item) => ({
        ...item,
        targetIndex: this.resolveNavTargetIndex(item),
      }))
    },
    currentSecondaryId() {
      const current = this.activeSecondaryTabs.find((item) => this.isCurrentSecondary(item))
      return current?.id || this.activeSecondaryTabs[0]?.id || ''
    },
    topLevelNavItems() {
      const section = this.activeStageSection
      if (!section) return []

      return section.items.map((entry) => {
        const pageIndex = this.resolveNavTargetIndex(entry)
        return {
          id: entry.id,
          label: entry.label,
          pageIndex,
          active: this.isCurrentSecondary(entry),
          unlocked: pageIndex >= 0 && pageIndex <= this.unlockedPageIndex,
        }
      })
    },
    tertiaryNavItems() {
      return this.buildTertiaryEntries().map((entry) => {
        const pageIndex = this.resolveNavTargetIndex(entry)
        return {
          id: entry.id,
          label: entry.label,
          pageIndex,
          active: this.isCurrentTertiary(entry),
          unlocked: pageIndex >= 0 && pageIndex <= this.unlockedPageIndex,
        }
      })
    },
    isCourseFlowPage() {
      const type = this.currentPage.type
      return type === 'course-overview' || type === 'course-section' || type === 'course-challenge'
    },
    courseSectionItems() {
      if (this.currentPage.type !== 'course-section') return []
      return this.normalizeCourseContent(this.currentPage)
    },
    showTertiaryZone() {
      if (this.isCourseFlowPage) return false
      const hidden = new Set(['branching', 'math-analysis-inline', 'catalog', 'intro-home', 'math-course', 'deep-start'])
      return !hidden.has(this.currentPage.type)
    },
    tertiaryPageTitle() {
      const page = this.currentPage
      if (page.type === 'stage-complete') return page.completionTitle || page.title
      if (page.type === 'done') return page.completionTitle || page.title
      if (page.type === 'stage-intro') return this.getStageIntroHeading(page)
      if (page.type === 'branch-topic') return page.topic?.title || page.title
      if (page.type === 'branch-topic-section') return page.title
      if (page.type === 'branch-topic-challenge') return page.title
      if (page.type === 'branch-overview') return page.branch?.title || page.title
      if (page.type === 'branch-rolemap') return page.title
      return page.title || page.navTitle || ''
    },
    tertiaryPageSubtitle() {
      const page = this.currentPage
      if (page.type === 'stage-complete') return page.navTitle || page.title || ''
      if (page.type === 'intro-video') return page.videoTitle || ''
      if (page.type === 'branch-overview') return page.branch?.subtitle || page.subtitle || ''
      return ''
    },
    primaryProgressPercent() {
      const total = this.stageMeta.length
      if (!total) return 0
      if (total === 1) return 100
      if (this.activeStageIndex >= total - 1) return 100
      return Math.round(((this.activeStageIndex + this.currentStageProgressRatio) / (total - 1)) * 100)
    },
    stageFillWidth() {
      return `calc((100% - 68rpx) * ${this.primaryProgressPercent / 100})`
    },
    canNext() {
      if (this.currentPage.type === 'branching') return Boolean(this.selectedBranchId)
      return true
    },
    nextLabel() {
      if (this.currentPage.type === 'branching') {
        return this.selectedBranchId ? '进入所选方向' : '请先选择方向'
      }
      if (this.currentPage.type === 'stage-complete') return '进入下一阶段'
      return '下一页'
    },
    analysisChallengeCards() {
      const progress = this.analysisChallengeProgress
      return challengeTaskCards.map((card) => ({
        ...card,
        locked: isAnalysisChallengeTaskLocked(card.id, progress),
        completed: Boolean(progress[card.id]?.completed),
        unlockHint: getAnalysisChallengeUnlockHint(card.id),
      }))
    },
  },
  watch: {
    selectedBranchId() {
      this.saveSnapshot()
    },
  },
  onShow() {
    this.restoreSnapshot()
    this.analysisChallengeProgress = readAnalysisChallengeProgress()
  },
  onLoad() {
    uni.setNavigationBarTitle({ title: '数学专业体验' })
    this.restoreSnapshot()
  },
  methods: {
    resolveAsset,
    resolveVideoAsset(src) {
      if (!src) return ''
      if (/^https?:\/\//i.test(src)) return src
      const host = getAssetHost().replace(/\/$/, '')
      const path = src.startsWith('/') ? src : `/${src}`
      return `${host}${path}`
    },
    isCurrentVideoFailed() {
      return Boolean(this.videoFailureState[this.currentPage.id])
    },
    isCurrentHeroFailed() {
      return Boolean(this.imageFailureState[this.currentPage.id])
    },
    onCurrentVideoError() {
      this.videoFailureState = {
        ...this.videoFailureState,
        [this.currentPage.id]: true,
      }
    },
    onCurrentHeroError() {
      this.imageFailureState = {
        ...this.imageFailureState,
        [this.currentPage.id]: true,
      }
    },
    normalizeCourseContent(page) {
      if (!page) return []
      const content = Array.isArray(page.content) ? page.content : []
      if (content.length) return content

      const items = []
      const paragraphs = Array.isArray(page.paragraphs) ? page.paragraphs : []
      paragraphs.forEach((entry) => {
        if (typeof entry === 'string' && entry.trim()) {
          items.push({ type: 'paragraph', text: entry })
          return
        }
        if (entry && typeof entry === 'object') {
          if (entry.type) {
            items.push(entry)
            return
          }
          if (entry.text) {
            items.push({ type: 'paragraph', text: entry.text })
          }
        }
      })

      if (page.formula) {
        items.push({ type: 'blockFormula', latex: page.formula, explanation: '' })
      }
      if (page.imageSrc) {
        items.push({
          type: 'figure',
          imageSrc: page.imageSrc,
          imageAlt: page.imageAlt || '',
          caption: page.imageAlt || '',
        })
      }
      return items
    },
    getCourseCover(course) {
      if (course?.heroImage) return course.heroImage
      const figure = course?.pages?.find((page) => Array.isArray(page.content))
        ?.content?.find((item) => item.type === 'figure')
      return figure?.imageSrc || ''
    },
    getCourseLeadText(course) {
      const paragraph = course?.pages
        ?.flatMap((page) => page.content || [])
        ?.find((item) => item.type === 'paragraph')
      return paragraph?.text || course?.preview || ''
    },
    getCourseTopics(course) {
      return (course?.pages || []).slice(0, 3).map((page) => ({
        title: page.title,
        role: page.role,
      }))
    },
    getCoursePreviewSections(course) {
      return (course?.pages || []).slice(0, 2).map((page) => {
        const paragraphs = (page.content || [])
          .filter((item) => item.type === 'paragraph')
          .slice(0, 2)
          .map((item) => item.text)
        const formulaItem = (page.content || []).find((item) => item.type === 'blockFormula')
        const figureItem = (page.content || []).find((item) => item.type === 'figure')
        return {
          title: page.title,
          role: page.role,
          paragraphs,
          formula: formulaItem?.latex || '',
          formulaExplanation: formulaItem?.explanation || '',
          figure: figureItem || null,
        }
      })
    },
    getCourseLearningPath(course) {
      const steps = [
        {
          title: '先建立整体直觉',
          desc: '先看课程概览、主题标题和问题背景，知道这门课主要在处理什么类型的问题。',
        },
        {
          title: '再进入正文阅读',
          desc: `完整阅读 ${course?.pagesCount || course?.pages?.length || 0} 个主题，跟着定义、图示和公式理解核心内容。`,
        },
      ]
      if (course?.challengeEnabled) {
        steps.push({
          title: '最后进入互动挑战',
          desc: '完成正文后进入挑战任务，把课程里的分析思路真正用起来。',
        })
      } else {
        steps.push({
          title: '最后回看适配判断',
          desc: '结合阅读感受判断自己是否喜欢这门课所需要的抽象程度和推理方式。',
        })
      }
      return steps
    },
    getStageIntroHeading(page) {
      if (!page) return ''
      return page.stageIndex === 1 ? '先看三门基础课会学什么' : '先看三门进阶课会学什么'
    },
    restoreSnapshot() {
      const snapshot = loadMathProgress()
      this.selectedBranchId = snapshot.selectedBranchId || this.selectedBranchId
      this.selectedBranchTitle = snapshot.selectedBranchTitle || this.selectedBranchTitle
      this.fitChoice = snapshot.fitChoice || ''
      this.completed = Boolean(snapshot.completed)
      this.visitedCourses = snapshot.visitedCourses || []
      this.unlockedStageIndexes = snapshot.unlockedStageIndexes || [0]
      this.unlockedPageIndex = typeof snapshot.unlockedPageIndex === 'number' ? snapshot.unlockedPageIndex : (snapshot.pageIndex || 0)
      const maxIndex = Math.max(0, buildMathSpeedPages(this.selectedBranchId).length - 1)
      this.pageIndex = Math.min(snapshot.pageIndex || 0, maxIndex)
      this.unlockedPageIndex = Math.min(Math.max(this.unlockedPageIndex, this.pageIndex), maxIndex)
    },
    saveSnapshot() {
      saveMathProgress({
        pageIndex: this.pageIndex,
        unlockedPageIndex: this.unlockedPageIndex,
        selectedBranchId: this.selectedBranchId,
        selectedBranchTitle: this.selectedBranchTitle,
        fitChoice: this.fitChoice,
        completed: this.completed,
        visitedCourses: this.visitedCourses,
        unlockedStageIndexes: this.unlockedStageIndexes,
      })
    },
    scrollToTop() {
      this.$nextTick(() => {
        this.scrollIntoViewTarget = ''
        this.scrollTop = 0
        this.$nextTick(() => {
          this.scrollIntoViewTarget = this.pageTopAnchorId
          this.$nextTick(() => {
            this.scrollIntoViewTarget = ''
          })
        })
      })
    },
    handleTouchStart(event) {
      const touch = event?.changedTouches?.[0] || event?.touches?.[0]
      this.touchStartX = touch?.clientX || 0
      this.touchStartY = touch?.clientY || 0
    },
    handleTouchEnd(event) {
      const touch = event?.changedTouches?.[0]
      const endX = touch?.clientX || 0
      const endY = touch?.clientY || 0
      const deltaX = endX - this.touchStartX
      const deltaY = endY - this.touchStartY
      if (Math.abs(deltaX) < 90 || Math.abs(deltaY) > 60) return
      if (deltaX < 0) {
        this.nextPage()
      } else if (this.pageIndex > 0) {
        this.prevPage()
      }
    },
    resolveNavTargetIndex(item) {
      if (!item) return -1
      if (item.pageId) return this.pages.findIndex((page) => page.id === item.pageId)
      if (typeof item.matcher === 'function') return this.pages.findIndex((page) => item.matcher(page))
      return -1
    },
    isCurrentSecondary(item) {
      if (!item) return false
      if (item.pageId) return this.currentPage.id === item.pageId
      if (typeof item.matcher === 'function') return item.matcher(this.currentPage)
      return false
    },
    isStageUnlocked(stageIndex) {
      const range = this.stageRanges.find((item) => item.stageIndex === stageIndex)
      return !range || range.startIndex <= this.unlockedPageIndex
    },
    isStageCompleted(stageIndex) {
      const range = this.stageRanges.find((item) => item.stageIndex === stageIndex)
      return Boolean(range && this.unlockedPageIndex > range.endIndex)
    },
    isSecondaryUnlocked(item) {
      const targetIndex = item?.targetIndex ?? this.resolveNavTargetIndex(item)
      return targetIndex >= 0 && targetIndex <= this.unlockedPageIndex
    },
    isSecondaryCompleted(item) {
      const targetIndex = item?.targetIndex ?? this.resolveNavTargetIndex(item)
      return targetIndex >= 0 && targetIndex < this.pageIndex
    },
    unlockStage(stageIndex) {
      if (!this.unlockedStageIndexes.includes(stageIndex)) {
        this.unlockedStageIndexes = [...this.unlockedStageIndexes, stageIndex].sort((a, b) => a - b)
      }
    },
    jumpToStage(stageIndex) {
      if (!this.isStageUnlocked(stageIndex)) {
        uni.showToast({ title: '请先完成上一阶段', icon: 'none' })
        return
      }
      const target = this.stageRanges.find((range) => range.stageIndex === stageIndex)?.startIndex ?? -1
      if (target >= 0) {
        this.pageIndex = target
        this.scrollToTop()
        this.saveSnapshot()
      }
    },
    jumpToSecondary(item) {
      this.jumpToNavItem({
        pageIndex: item?.targetIndex ?? this.resolveNavTargetIndex(item),
      })
    },
    jumpToNavItem(item) {
      if (!item || item.pageIndex < 0) return
      if (item.pageIndex > this.unlockedPageIndex) {
        uni.showToast({ title: '请先按当前流程继续体验', icon: 'none' })
        return
      }
      this.pageIndex = item.pageIndex
      this.scrollToTop()
      this.saveSnapshot()
    },
    jumpToTertiaryItem(item) {
      this.jumpToNavItem(item)
    },
    buildTertiaryEntries() {
      const courseRootMap = {
        analysis: 'analysis-video',
        linear: 'linear-algebra-video',
        logic: 'logic-basics',
        probability: 'probability-overview',
        abstract: 'abstract-algebra-overview',
        topology: 'topology-overview',
      }

      const currentCourseRootId = courseRootMap[this.currentSecondaryId]
      if (currentCourseRootId) {
        return this.pages
          .filter((page) => page.navParentId === currentCourseRootId)
          .map((page) => ({
            id: `tertiary-${page.id}`,
            label: page.navTitle || page.title,
            pageId: page.id,
            matcher: (candidate) => candidate.id === page.id,
          }))
      }

      if (this.currentSecondaryId === 'branch-topic') {
        return (MATH_BRANCH_TOPICS[this.selectedBranchId] || []).map((topic, index) => {
          const flowId = `branch-${this.selectedBranchId}-topic-${index}`
          return {
            id: `tertiary-${flowId}`,
            label: topic.title,
            pageId: `${flowId}-intro`,
            matcher: (page) => page.flowId === flowId,
          }
        })
      }

      return []
    },
    isCurrentTertiary(item) {
      if (!item) return false
      if (typeof item.matcher === 'function') return item.matcher(this.currentPage)
      if (item.pageId) return this.currentPage.id === item.pageId
      return false
    },
    prevPage() {
      if (this.pageIndex > 0) {
        this.pageIndex -= 1
        this.scrollToTop()
        this.saveSnapshot()
      }
    },
    nextPage() {
      if (!this.canNext) {
        uni.showToast({ title: '请先选择一个方向', icon: 'none' })
        return
      }
      if (this.currentPage.type === 'branching' && this.selectedBranchId) {
        const branchOverviewIndex = findMathBranchOverviewPageIndex(
          buildMathSpeedPages(this.selectedBranchId),
        )
        if (branchOverviewIndex >= 0) {
          this.unlockStage(4)
          this.pageIndex = branchOverviewIndex
          this.unlockedPageIndex = Math.max(this.unlockedPageIndex, branchOverviewIndex)
          this.scrollToTop()
          this.saveSnapshot()
          return
        }
      }
      if (this.pageIndex < this.pages.length - 1) {
        if (this.currentPage.type === 'math-analysis-inline') {
          this.markAnalysisCourseVisited()
        }
        const nextPage = this.pages[this.pageIndex + 1]
        this.unlockStage(nextPage.stageIndex)
        this.pageIndex += 1
        this.unlockedPageIndex = Math.max(this.unlockedPageIndex, this.pageIndex)
        this.scrollToTop()
        this.saveSnapshot()
      }
    },
    markAnalysisCourseVisited() {
      if (!this.visitedCourses.includes('analysis')) {
        this.visitedCourses = [...this.visitedCourses, 'analysis']
        markMathCourseVisited('analysis')
        this.saveSnapshot()
      }
    },
    startAnalysisChallenge(card) {
      if (card.locked) {
        uni.showToast({ title: card.unlockHint || '请先完成上一关', icon: 'none' })
        return
      }
      this.markAnalysisCourseVisited()
      uni.navigateTo({ url: `/pages/math/challenge?task=${card.id}` })
    },
    selectBranch(branch) {
      this.selectedBranchId = branch.id
      this.selectedBranchTitle = branch.title
      this.saveSnapshot()
    },
    selectFit(value) {
      this.fitChoice = value
      this.saveSnapshot()
    },
    goReadCourse(courseId) {
      if (!this.visitedCourses.includes(courseId)) {
        this.visitedCourses = [...this.visitedCourses, courseId]
        markMathCourseVisited(courseId)
        this.saveSnapshot()
      }
      uni.navigateTo({ url: `/subpkg/math/course?course=${courseId}` })
    },
    goAnalysisChallenge() {
      this.markAnalysisCourseVisited()
      uni.navigateTo({ url: '/pages/math/challenge?task=calculation' })
    },
    finishExperience() {
      if (!this.selectedBranchId) {
        uni.showToast({ title: '请先选择方向', icon: 'none' })
        return
      }
      if (!this.fitChoice) {
        uni.showToast({ title: '请先完成适配判断', icon: 'none' })
        return
      }
      if (this.completed) {
        uni.navigateBack()
        return
      }
      markMajorExplored('math-u')
      this.completed = true
      this.saveSnapshot()
      uni.showToast({ title: '数学专业体验完成', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 800)
    },
  },
}
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100vh; background: #f6f8fc; }
.top-sticky-shell {
  position: sticky;
  top: 0;
  background: #ffffff;
  border-bottom: 1rpx solid #e6edf5;
  box-shadow: 0 10rpx 26rpx rgba(15, 23, 42, 0.05);
  z-index: 10;
}
.top-progress {
  padding: 12rpx 24rpx 18rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}
.stage-track {
  position: relative;
  height: 68rpx;
}
.stage-track-bg,
.stage-fill {
  position: absolute;
  left: 34rpx;
  right: 34rpx;
  top: 28rpx;
  height: 24rpx;
  border-radius: 999rpx;
}
.stage-track-bg { background: #ebe7ff; }
.stage-fill {
  right: auto;
  max-width: calc(100% - 68rpx);
  background: linear-gradient(90deg, #e7c2ff 0%, #9762ff 100%);
  transition: width 0.25s ease;
}
.stage-dots {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 17rpx;
}
.stage-dot-wrap {
  width: 68rpx;
  height: 68rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stage-dot-wrap-clickable { cursor: pointer; }
.stage-dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
}
.stage-dot-wrap-clickable .stage-dot { box-shadow: 0 0 0 3rpx rgba(151, 98, 255, 0.22); }
.stage-dot-active,
.stage-dot-done { background: #9762ff; }
.stage-dot-locked { opacity: 0.55; }
.stage-diamond { width: 34rpx; height: 34rpx; }
.stage-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8rpx;
}
.stage-label {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-size: 20rpx;
  line-height: 1.3;
  color: #999999;
  font-weight: 700;
}
.stage-label-active,
.stage-label-done { color: #283248; }
.stage-label-locked { opacity: 0.55; }
.primary-tabs-scroll,
.primary-tabs,
.primary-tab,
.primary-tab-index,
.primary-tab-label,
.primary-tabs-top {
  display: none;
}
.shell-header {
  padding: 12rpx 24rpx 10rpx;
  background: #ffffff;
  border-top: 1rpx solid #f3f5fb;
}
.header-copy { min-width: 0; }
.header-kicker { display: block; font-size: 21rpx; font-weight: 700; color: #64748b; }
.header-stage-mini { display: block; margin-top: 6rpx; font-size: 24rpx; line-height: 1.4; color: #6b23ff; font-weight: 700; }
.progress-nav-scroll {
  width: 100%;
  white-space: nowrap;
  border-top: 1rpx solid #f3f5fb;
  background: #fff;
}
.progress-nav-row {
  display: inline-flex;
  gap: 12rpx;
  padding: 12rpx 24rpx 14rpx;
}
.progress-nav-pill {
  flex-shrink: 0;
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: #f3f6fb;
  border: 2rpx solid transparent;
}
.progress-nav-pill-active {
  background: #eef4ff;
  border-color: #2f6bff;
}
.progress-nav-pill-locked { opacity: 0.45; }
.progress-nav-pill-text { font-size: 22rpx; color: #475569; white-space: nowrap; }
.progress-nav-pill-active .progress-nav-pill-text { color: #2f6bff; font-weight: 700; }
.tertiary-nav-scroll {
  width: 100%;
  white-space: nowrap;
  border-top: 1rpx solid #f3f5fb;
  background: #f8fbff;
}
.tertiary-nav-row {
  display: inline-flex;
  gap: 12rpx;
  padding: 10rpx 24rpx 14rpx;
}
.tertiary-nav-pill {
  flex-shrink: 0;
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 2rpx solid #dbe5f0;
}
.tertiary-nav-pill-active {
  background: #eef4ff;
  border-color: #2f6bff;
}
.tertiary-nav-pill-locked { opacity: 0.45; }
.tertiary-nav-pill-text {
  font-size: 20rpx;
  color: #64748b;
  white-space: nowrap;
}
.tertiary-nav-pill-active .tertiary-nav-pill-text {
  color: #2f6bff;
  font-weight: 700;
}
.tertiary-zone {
  margin-bottom: 16rpx;
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx 28rpx 20rpx;
  box-shadow: 0 14rpx 38rpx rgba(15, 23, 42, 0.05);
}
.tertiary-head { min-width: 0; }
.tertiary-title {
  display: block;
  text-align: center;
  font-size: 40rpx;
  font-weight: 700;
  line-height: 1.45;
  color: #102033;
}
.tertiary-sub {
  display: block;
  margin-top: 8rpx;
  text-align: center;
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.5;
}
.completion-card-tabbed { margin-top: 0; }
.completion-card-tabbed .completion-desc:first-of-type { margin-top: 0; }
.article-body-head {
  margin-bottom: 24rpx;
  padding-bottom: 8rpx;
}
.article-body-title {
  display: block;
  font-size: 46rpx;
  font-weight: 700;
  line-height: 1.5;
  color: #102033;
}
.article-panel-tabbed .article-body-head + .article-paragraph,
.article-panel-tabbed .article-body-head + view .article-paragraph:first-child {
  margin-top: 0;
}
.module-card {
  margin: 22rpx 24rpx 0;
  padding: 24rpx 24rpx 26rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 18rpx 42rpx rgba(15, 23, 42, 0.06);
}
.module-card-head { display: flex; align-items: center; justify-content: flex-end; }
.module-card-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42rpx;
  padding: 0 18rpx;
  border-radius: 999rpx;
  background: #f1f5f9;
  font-size: 20rpx;
  color: #64748b;
  font-weight: 700;
}
.module-card-title { display: block; margin-top: 18rpx; font-size: 38rpx; font-weight: 700; color: #102033; line-height: 1.5; }
.module-card-desc { display: block; margin-top: 16rpx; font-size: 28rpx; line-height: 1.75; color: #52657a; }
.module-card-meta { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 18rpx; }
.module-meta-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46rpx;
  padding: 0 16rpx;
  border-radius: 999rpx;
  background: #ffffff;
  border: 2rpx solid #dce9fb;
  color: #2f6bff;
  font-size: 20rpx;
  font-weight: 700;
}
.module-meta-pill-accent {
  border-color: #c9efd5;
  color: #0c8c4a;
}
.body { flex: 1; min-height: 0; padding: 16rpx 24rpx 24rpx; box-sizing: border-box; }
.page-top-anchor { width: 100%; height: 0; }
.stage { padding-bottom: 24rpx; }
.intro-copy-panel-tabbed { margin-top: 0; }
.intro-copy-panel-tabbed .intro-paragraph:first-child,
.intro-copy-panel-tabbed .stage-intro:first-child {
  margin-top: 0;
}
.intro-copy-panel-tabbed .stage-intro {
  text-align: left;
}
.intro-copy-panel,
.spotlight-panel,
.course-panel,
.article-panel,
.completion-card,
.finish-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: 0 14rpx 38rpx rgba(15,23,42,0.05);
}
.intro-title { display: block; text-align: center; font-size: 40rpx; font-weight: 700; line-height: 1.45; color: #102033; }
.intro-paragraph { display: block; margin-top: 18rpx; font-size: 25rpx; line-height: 1.82; color: #394657; }
.intro-card-grid { display: flex; flex-direction: column; gap: 18rpx; margin-top: 24rpx; }
.intro-card-grid-compact { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18rpx; }
.intro-card {
  display: flex;
  align-items: center;
  gap: 18rpx;
  background: #ffffff;
  border: 2rpx solid #e3ebf3;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 18rpx 36rpx rgba(15,23,42,0.04);
}
.intro-card-compact { display: block; min-height: 330rpx; }
.intro-card-image { width: 100%; height: 180rpx; background: #f5f8fc; }
.intro-card-side-image { width: 220rpx; height: 220rpx; flex-shrink: 0; margin-right: 10rpx; }
.intro-card-copy { flex: 1; min-width: 0; padding: 22rpx; }
.intro-card-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54rpx;
  height: 54rpx;
  padding: 0 12rpx;
  border-radius: 999rpx;
  background: #e8f3ff;
  color: #2f6bff;
  font-size: 20rpx;
  font-weight: 700;
}
.intro-card-title { display: block; margin-top: 14rpx; font-size: 28rpx; font-weight: 700; color: #102033; line-height: 1.5; }
.intro-card-body { display: block; margin-top: 10rpx; font-size: 22rpx; line-height: 1.68; color: #52657a; }
.video-panel {
  margin-top: 24rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 14rpx 38rpx rgba(15,23,42,0.05);
}
.intro-video { width: 100%; height: 420rpx; border-radius: 18rpx; background: #0f172a; }
.video-caption { display: block; margin-top: 14rpx; text-align: center; font-size: 22rpx; color: #7b8794; }
.hero-image { width: 100%; border-radius: 24rpx; margin-bottom: 20rpx; background: #eef2f7; }
.spotlight-badge,
.course-entry-badge,
.course-flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #e8f3ff;
  color: #2f6bff;
  font-size: 20rpx;
  font-weight: 700;
}
.spotlight-title { display: block; margin-top: 16rpx; font-size: 34rpx; font-weight: 700; color: #102033; }
.spotlight-body,
.stage-intro { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.75; color: #52657a; }
.course-list { display: flex; flex-direction: column; gap: 18rpx; margin-top: 22rpx; }
.course-entry-card {
  overflow: hidden;
  border-radius: 24rpx;
  background: #ffffff;
  border: 2rpx solid #e3ebf3;
}
.course-entry-image { width: 100%; height: 240rpx; background: #f4f7fb; }
.course-entry-copy { padding: 24rpx; }
.course-entry-title,
.catalog-title { display: block; margin-top: 14rpx; font-size: 30rpx; font-weight: 700; color: #102033; }
.course-entry-sub,
.catalog-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.68; color: #64748b; }
.course-entry-meta { display: block; margin-top: 14rpx; font-size: 22rpx; color: #94a3b8; }
.catalog-card { border: 2rpx solid #e5e7eb; border-radius: 18rpx; overflow: hidden; margin-bottom: 18rpx; background: #fff; }
.catalog-image { width: 100%; background: #f8fafc; }
.catalog-copy { padding: 22rpx; }
.catalog-index { display: inline-flex; align-items: center; justify-content: center; min-width: 54rpx; height: 54rpx; padding: 0 12rpx; border-radius: 999rpx; background: #ecfbf7; color: #087a64; font-size: 20rpx; font-weight: 700; }
.completion-card, .finish-card { background: #fff; border-radius: 24rpx; padding: 28rpx; margin-bottom: 20rpx; box-shadow: 0 14rpx 38rpx rgba(15,23,42,0.05); }
.completion-badge { display: inline-block; padding: 8rpx 16rpx; border-radius: 999rpx; background: #ecfdf5; color: #047857; font-size: 20rpx; font-weight: 700; }
.completion-title { display: block; margin-top: 16rpx; font-size: 32rpx; font-weight: 700; color: #162033; }
.completion-desc { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.75; color: #566070; }
.next-stage-card { margin-top: 22rpx; padding: 22rpx; border-radius: 18rpx; background: #f8fbff; }
.next-stage-label { display: block; font-size: 20rpx; color: #64748b; }
.next-stage-title { display: block; margin-top: 8rpx; font-size: 28rpx; font-weight: 700; color: #007a66; }
.next-stage-desc { display: block; margin-top: 10rpx; font-size: 22rpx; line-height: 1.65; color: #64748b; }
.course-panel, .article-panel { background: #fff; border-radius: 24rpx; padding: 28rpx; box-shadow: 0 14rpx 38rpx rgba(15,23,42,0.05); }
.course-cover-image { width: 100%; height: 260rpx; border-radius: 20rpx; margin-bottom: 22rpx; background: #eef2f7; }
.course-head { margin-bottom: 16rpx; }
.course-flag { display: inline-block; padding: 6rpx 14rpx; border-radius: 999rpx; background: #ecfdf5; color: #047857; font-size: 20rpx; font-weight: 700; margin-bottom: 12rpx; }
.course-title { display: block; font-size: 32rpx; font-weight: 700; color: #162033; }
.course-sub { display: block; margin-top: 8rpx; font-size: 24rpx; color: #64748b; }
.course-preview { display: block; margin-top: 18rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }
.course-meta, .course-meta-inline { display: block; margin-top: 12rpx; font-size: 22rpx; color: #94a3b8; }
.course-tag-row { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 16rpx; }
.course-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: #eff6ff;
  color: #2f6bff;
  font-size: 20rpx;
  font-weight: 700;
}
.course-chip-accent { background: #ecfdf5; color: #047857; }
.course-outline-card,
.course-note-card {
  margin-top: 22rpx;
  padding: 22rpx;
  border-radius: 18rpx;
  background: #f8fbff;
  border: 2rpx solid #e6edf8;
}
.course-outline-label,
.course-note-title { display: block; font-size: 22rpx; font-weight: 700; color: #2f6bff; }
.course-note-body { display: block; margin-top: 10rpx; font-size: 22rpx; line-height: 1.68; color: #52657a; }
.course-preview-stack,
.course-path-card { margin-top: 22rpx; }
.course-section-title { display: block; font-size: 24rpx; font-weight: 700; color: #102033; }
.course-preview-card,
.course-path-card {
  padding: 22rpx;
  border-radius: 22rpx;
  background: #ffffff;
  border: 2rpx solid #e6edf5;
}
.course-preview-card { margin-top: 16rpx; }
.course-preview-head { display: flex; align-items: center; justify-content: space-between; gap: 12rpx; }
.course-preview-index { font-size: 20rpx; font-weight: 700; color: #2f6bff; }
.course-preview-role { font-size: 20rpx; color: #64748b; }
.course-preview-topic {
  display: block;
  margin-top: 10rpx;
  font-size: 27rpx;
  font-weight: 700;
  color: #102033;
  line-height: 1.5;
}
.course-preview-paragraph {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.8;
  color: #52657a;
}
.course-preview-formula-card {
  margin-top: 16rpx;
  padding: 18rpx 20rpx;
  border-radius: 18rpx;
  background: #f8fbff;
  border-left: 6rpx solid #2f6bff;
}
.course-preview-formula { display: block; font-size: 22rpx; color: #102033; font-family: monospace; }
.course-preview-formula-note { display: block; margin-top: 8rpx; font-size: 20rpx; line-height: 1.6; color: #64748b; }
.course-preview-figure-card { margin-top: 16rpx; padding: 16rpx; border-radius: 18rpx; background: #f8fafc; }
.course-preview-figure { width: 100%; border-radius: 14rpx; }
.course-preview-figure-note { display: block; margin-top: 10rpx; font-size: 20rpx; line-height: 1.6; color: #64748b; }
.media-fallback-card {
  margin-top: 18rpx;
  padding: 20rpx 22rpx;
  border-radius: 18rpx;
  background: #f8fafc;
  border: 2rpx dashed #cbd5e1;
}
.media-fallback-title {
  display: block;
  font-size: 24rpx;
  font-weight: 700;
  color: #334155;
}
.media-fallback-desc {
  display: block;
  margin-top: 10rpx;
  font-size: 21rpx;
  line-height: 1.7;
  color: #64748b;
}
.course-path-list { margin-top: 16rpx; }
.course-path-item { display: flex; gap: 16rpx; align-items: flex-start; }
.course-path-item + .course-path-item { margin-top: 16rpx; }
.course-path-index {
  width: 36rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  border-radius: 50%;
  background: #2f6bff;
  color: #ffffff;
  font-size: 20rpx;
  font-weight: 700;
  flex-shrink: 0;
}
.course-path-copy { flex: 1; min-width: 0; }
.course-path-title { display: block; font-size: 22rpx; font-weight: 700; color: #102033; }
.course-path-desc { display: block; margin-top: 8rpx; font-size: 21rpx; line-height: 1.7; color: #52657a; }
.topic-list { display: flex; flex-direction: column; gap: 16rpx; margin-top: 18rpx; }
.topic-item { display: flex; gap: 16rpx; align-items: flex-start; }
.topic-index {
  width: 44rpx;
  height: 44rpx;
  line-height: 44rpx;
  text-align: center;
  border-radius: 50%;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 20rpx;
  font-weight: 700;
  flex-shrink: 0;
}
.topic-copy { flex: 1; min-width: 0; }
.topic-title { display: block; font-size: 24rpx; font-weight: 700; color: #102033; line-height: 1.6; }
.topic-role { display: block; margin-top: 6rpx; font-size: 21rpx; color: #64748b; line-height: 1.6; }
.action-row { display: flex; gap: 16rpx; margin-top: 24rpx; }
.btn-inline { flex: 1; height: 72rpx; line-height: 72rpx; border-radius: 999rpx; background: #eef2f7; color: #2f6bff; font-size: 24rpx; font-weight: 700; border: none; }
.btn-inline-accent { background: #2f6bff; color: #fff; }
.course-status-row { display: flex; flex-wrap: wrap; gap: 14rpx; margin-top: 16rpx; }
.visited-tag { display: inline-block; font-size: 20rpx; font-weight: 700; color: #007a66; }
.visited-tag-muted { color: #64748b; }
.course-card { background: #fff; border-radius: 18rpx; padding: 22rpx; margin-bottom: 14rpx; border: 2rpx solid #e5e7eb; }
.branch-card { background: #fff; border-radius: 18rpx; padding: 22rpx; margin-bottom: 16rpx; border: 2rpx solid #e5e7eb; }
.branch-card-active { border-color: #007a66; background: #f0faf8; }
.branch-card-image { width: 100%; height: 220rpx; border-radius: 16rpx; margin-bottom: 18rpx; background: #f8fafc; }
.branch-head { display: flex; justify-content: space-between; align-items: center; }
.branch-title { font-size: 28rpx; font-weight: 700; color: #162033; }
.branch-check { font-size: 20rpx; color: #007a66; font-weight: 700; }
.branch-subtitle { display: block; margin-top: 8rpx; font-size: 22rpx; color: #007a66; }
.branch-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }
.branch-tags { display: flex; flex-wrap: wrap; gap: 10rpx; margin-top: 14rpx; }
.branch-tag { padding: 8rpx 16rpx; border-radius: 999rpx; background: #ecfdf5; font-size: 20rpx; color: #047857; }
.branch-fit { display: block; margin-top: 12rpx; font-size: 21rpx; color: #475569; font-weight: 600; }
.article-title { display: block; font-size: 32rpx; font-weight: 700; color: #162033; }
.article-sub { display: block; margin-top: 10rpx; font-size: 24rpx; color: #64748b; }
.article-paragraph { display: block; margin-top: 18rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }
.interaction-panel { margin-top: 24rpx; padding: 22rpx; border-radius: 18rpx; background: #f8fbff; }
.interaction-title { display: block; font-size: 26rpx; font-weight: 700; color: #162033; }
.interaction-goal { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }
.task-line { display: block; margin-top: 12rpx; font-size: 22rpx; color: #007a66; font-weight: 600; }
.role-grid { display: flex; flex-direction: column; gap: 16rpx; margin-top: 22rpx; }
.role-card {
  padding: 22rpx;
  border-radius: 18rpx;
  background: #f8fbff;
  border: 2rpx solid #e6edf8;
}
.role-card-title { display: block; font-size: 25rpx; font-weight: 700; color: #102033; line-height: 1.6; }
.role-card-desc { display: block; margin-top: 10rpx; font-size: 22rpx; line-height: 1.68; color: #52657a; }
.finish-title { display: block; font-size: 30rpx; font-weight: 700; color: #162033; }
.finish-desc { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }
.summary-card { margin-top: 18rpx; padding: 18rpx; border-radius: 16rpx; background: #f8fafc; }
.summary-line { display: block; font-size: 23rpx; color: #475569; line-height: 1.6; }
.fit-option { margin-top: 16rpx; padding: 20rpx; border-radius: 18rpx; background: #f5f8fc; border: 2rpx solid transparent; }
.fit-option-active { border-color: #007a66; background: #ecfdf5; }
.fit-option-text { font-size: 24rpx; color: #334155; font-weight: 600; line-height: 1.6; }
.footer { display: flex; gap: 16rpx; padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -8rpx 28rpx rgba(15,23,42,0.06); }
.btn-ghost, .btn-primary { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; font-size: 28rpx; font-weight: 700; }
.btn-ghost { background: #e5e7eb; color: #6b7280; }
.btn-primary { background: #2f6bff; color: #fff; box-shadow: 0 10rpx 0 #2248a4; }
.btn-primary[disabled] { opacity: 0.45; box-shadow: none; }
.article-panel-flat { box-shadow: none; padding: 0; }
.article-panel-tabbed {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 28rpx;
  box-shadow: 0 14rpx 38rpx rgba(15, 23, 42, 0.05);
}
.article-panel-tabbed .article-paragraph:first-child {
  margin-top: 0;
}
.inline-course-title { display: block; text-align: center; font-size: 36rpx; font-weight: 700; color: #102033; }
.inline-course-sub { display: block; text-align: center; margin-top: 12rpx; font-size: 24rpx; color: #64748b; margin-bottom: 28rpx; }
.article-section { margin-top: 36rpx; padding-top: 28rpx; border-top: 2rpx solid #eef2f7; }
.section-role { display: block; font-size: 20rpx; color: #007a66; font-weight: 700; margin-bottom: 10rpx; }
.article-section-title { display: block; font-size: 30rpx; font-weight: 700; color: #162033; line-height: 1.5; }
.lecture-block-card {
  margin-top: 18rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  background: #f8fbff;
  border: 2rpx solid #e6edf8;
}
.lecture-block-title { display: block; font-size: 24rpx; font-weight: 700; color: #102033; }
.lecture-block-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.7; color: #52657a; }
.formula-math { display: block; font-size: 24rpx; color: #007a66; line-height: 1.6; font-family: monospace; }
.formula-note { display: block; margin-top: 10rpx; font-size: 22rpx; color: #64748b; line-height: 1.6; }
.section-image { width: 100%; margin-top: 18rpx; border-radius: 16rpx; background: #f8fafc; }
.figure-caption { display: block; margin-top: 10rpx; font-size: 22rpx; color: #94a3b8; text-align: center; }
.challenge-section { margin-top: 48rpx; padding-top: 32rpx; border-top: 4rpx solid #007a66; }
.challenge-section-title { display: block; font-size: 30rpx; font-weight: 700; color: #162033; margin-bottom: 24rpx; }
.challenge-entry-card { display: flex; flex-direction: column; background: #fff; border-radius: 20rpx; overflow: hidden; margin-bottom: 20rpx; border: 2rpx solid #e5e7eb; }
.challenge-entry-locked { opacity: 0.72; background: #f8fafc; }
.challenge-entry-done { border-color: #007a66; }
.challenge-entry-image { width: 100%; background: #f8fafc; }
.challenge-entry-copy { padding: 22rpx; }
.challenge-entry-head { display: flex; align-items: center; gap: 12rpx; margin-bottom: 10rpx; }
.challenge-entry-seq { font-size: 20rpx; font-weight: 700; color: #007a66; }
.challenge-entry-status { font-size: 20rpx; font-weight: 700; color: #047857; }
.challenge-entry-status-lock { color: #94a3b8; }
.challenge-entry-title { display: block; font-size: 28rpx; font-weight: 700; color: #162033; }
.challenge-entry-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }
.challenge-entry-hint { display: block; margin-top: 12rpx; font-size: 22rpx; color: #ef4444; }
.challenge-entry-action { display: block; margin-top: 14rpx; font-size: 22rpx; font-weight: 700; color: #007a66; }
</style>
