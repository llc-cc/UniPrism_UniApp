<template>

  <view v-if="template" class="page">

    <view class="topbar" :style="{ background: template.accent }">

      <view class="topbar-row">

        <text class="topbar-title">{{ template.labelLong }}</text>

        <text class="topbar-en">{{ template.en }}</text>

      </view>

      <text class="page-indicator">{{ pageIndex + 1 }} / {{ pages.length }} · {{ currentPage.title }}</text>

      <view class="steps">

        <view

          v-for="(stage, idx) in stageMeta"

          :key="stage.key"

          class="step-dot"

          :class="{

            'step-dot-active': idx === activeStageIndex,

            'step-dot-done': unlockedStageIndexes.includes(idx) && idx < activeStageIndex,

            'step-dot-locked': !unlockedStageIndexes.includes(idx),

          }"

          @tap="jumpToStage(idx)"

        >

          <text class="step-index">{{ idx + 1 }}</text>

          <text class="step-label">{{ stage.label }}</text>

        </view>

      </view>

      <scroll-view scroll-x class="stage-nav-scroll" :show-scrollbar="false" enable-flex>
        <view class="stage-nav-row">
          <view
            v-for="item in topLevelNavItems"
            :key="item.id"
            class="stage-nav-pill"
            :class="{
              'stage-nav-pill-active': item.active,
              'stage-nav-pill-locked': !item.unlocked,
            }"
            @tap="jumpToNavItem(item)"
          >
            <text class="stage-nav-pill-text">{{ item.label }}</text>
          </view>
        </view>
      </scroll-view>

      <scroll-view
        v-if="showTertiaryNav"
        scroll-x
        class="stage-nav-scroll stage-nav-scroll-tertiary"
        :show-scrollbar="false"
        enable-flex
      >
        <view class="stage-nav-row">
          <view
            v-for="item in tertiaryNavItems"
            :key="item.id"
            class="stage-nav-pill stage-nav-pill-tertiary"
            :class="{
              'stage-nav-pill-active': item.active,
              'stage-nav-pill-locked': !item.unlocked,
            }"
            @tap="jumpToFlowItem(item)"
          >
            <text class="stage-nav-pill-text">{{ item.label }}</text>
          </view>
        </view>
      </scroll-view>

    </view>



    <scroll-view class="body" scroll-y :scroll-top="scrollTop">

      <!-- 概览（对齐 Web MajorOverviewPage） -->

      <view v-if="currentPage.type === 'overview'" class="stage stage-overview">

        <text class="overview-welcome">欢迎体验{{ template.labelLong }}！</text>

        <view class="intro-card intro-card-center">

          <text v-for="(line, idx) in template.intro" :key="idx" class="intro-line">{{ line }}</text>

        </view>

        <image v-if="showPageHero('overview')" class="hero-image" :src="pageImage('overview')" mode="widthFix" />

        <view
          v-for="(card, idx) in overviewCards"
          :key="card.title"
          class="intro-detail-card"
        >
          <text class="intro-detail-index">{{ formatCardIndex(idx) }}</text>
          <text class="intro-detail-title">{{ card.title }}</text>
          <text class="intro-detail-body">{{ card.body }}</text>
          <view class="topic-row">
            <text
              v-for="(label, lIdx) in overviewCardLabels[idx]"
              :key="`${label}-${lIdx}`"
              class="topic-chip topic-chip-soft"
            >{{ label }}</text>
          </view>
        </view>

      </view>



      <!-- 阶段完成 -->

      <view v-else-if="currentPage.type === 'stage-complete'" class="stage">

        <view class="completion-card">

          <text class="completion-badge">阶段完成</text>

          <text class="completion-title">{{ currentPage.completionTitle }}</text>

          <text class="completion-desc">{{ currentPage.completionDescription }}</text>

          <view class="next-stage-card">

            <text class="next-stage-label">下一阶段</text>

            <text class="next-stage-title">{{ currentPage.nextStageTitle }}</text>

            <text class="next-stage-desc">{{ currentPage.nextStageDescription }}</text>

          </view>

        </view>

      </view>



      <!-- 阶段完成 -->

      <view v-else-if="currentPage.type === 'course-map'" class="stage">

        <text class="overview-welcome">{{ template.labelLong }}介绍</text>

        <view class="intro-card intro-card-center">

          <text class="intro-line">{{ currentPage.intro }}</text>

          <text class="intro-line">{{ courseMapExtraIntro }}</text>

        </view>

        <image v-if="showPageHero('courseMap')" class="hero-image" :src="pageImage('courseMap')" mode="widthFix" />

        <view v-for="(card, idx) in courseMapCards" :key="`${card.title}-${idx}`" class="intro-detail-card">

          <text class="intro-detail-index">{{ formatCardIndex(idx) }}</text>

          <text class="intro-detail-title">{{ card.title }}</text>

          <text class="intro-detail-body">{{ card.body }}</text>

          <view class="topic-row">

            <text
              v-for="(label, lIdx) in courseMapCardLabels[idx]"
              :key="`${label}-${lIdx}`"
              class="topic-chip topic-chip-soft"
            >{{ label }}</text>

          </view>

        </view>

      </view>



      <!-- 基础课程预览 + 挑战入口 -->

      <view v-else-if="currentPage.type === 'course-preview'" class="stage">

        <image class="hero-image" :src="pageImage('course', currentPage.courseId)" mode="widthFix" />

        <view class="course-panel">

          <view class="course-head">

            <text class="course-flag">基础课</text>

            <text class="course-title">{{ currentPage.course.title }}</text>

            <text class="course-sub">{{ currentPage.course.subtitle }}</text>

          </view>

          <text class="course-preview-text">{{ currentPage.course.summary || currentPage.course.intro }}</text>

          <text class="course-meta">共 {{ (currentPage.article.sections || []).length }} 节 · 建议逐节阅读后再继续</text>

          <view class="action-row">

            <button class="btn-inline" :style="{ color: template.accent, borderColor: template.accent }" @tap="goReadCourse(currentPage.courseId, 'foundation')">阅读课程</button>

          </view>

          <view v-if="visitedCourses.includes(currentPage.courseId)" class="visited-tag">已阅读</view>

        </view>

        <view class="challenge-section">

          <text class="challenge-section-title">{{ challengeLabel(currentPage.challengeTask) }}</text>

          <view

            class="challenge-entry-card"

            :class="{ 'challenge-entry-done': isChallengeDone(currentPage.courseId, currentPage.challengeTask) }"

            @tap="startMajorChallenge(currentPage)"

          >

            <view class="challenge-entry-copy">

              <text class="challenge-entry-title">{{ currentPage.course.interaction.title }}</text>

              <text class="challenge-entry-body">{{ currentPage.course.interaction.goal }}</text>

              <text class="challenge-entry-action">{{ isChallengeDone(currentPage.courseId, currentPage.challengeTask) ? '再次挑战' : '开始挑战' }}</text>

            </view>

          </view>

        </view>

      </view>

      <view v-else-if="currentPage.type === 'course-section' || currentPage.type === 'deep-section'" class="stage">

        <image class="hero-image" :src="pageImage('course', currentPage.courseId)" mode="widthFix" />

        <view class="article-panel">

          <view class="article-header">

            <text class="article-badge">{{ currentPage.level === 'foundation' ? '课程正文' : '深入正文' }}</text>

            <text class="article-title">{{ currentPage.subtitle }}</text>

            <text class="article-sub">{{ currentPage.title }}</text>

          </view>

          <text v-if="currentPage.section.formula" class="section-formula">{{ currentPage.section.formula }}</text>

          <image
            v-if="currentPage.section.imageSrc"
            class="section-image"
            :src="resolveAsset(currentPage.section.imageSrc)"
            mode="widthFix"
          />

          <view v-else-if="currentPage.section.figureItems && currentPage.section.figureItems.length" class="figure-panel">
            <text class="figure-kind">{{ visualKindLabel(currentPage.section.visualKind) }}</text>
            <view v-if="currentPage.section.visualKind === 'method'" class="figure-method-list">
              <view v-for="(item, fIdx) in currentPage.section.figureItems" :key="`${item}-${fIdx}`" class="figure-method-row">
                <text class="figure-step" :style="{ background: fIdx === 0 ? template.accent : '#9fb0c4' }">{{ fIdx + 1 }}</text>
                <text class="figure-item-text">{{ item }}</text>
              </view>
            </view>
            <view v-else-if="currentPage.section.visualKind === 'concept'" class="figure-concept-grid">
              <view v-for="(item, fIdx) in currentPage.section.figureItems" :key="`${item}-${fIdx}`" class="figure-concept-card">
                <text class="figure-concept-label">对象 {{ fIdx + 1 }}</text>
                <text class="figure-item-text">{{ item }}</text>
              </view>
            </view>
            <view v-else-if="currentPage.section.visualKind === 'error'" class="figure-error-list">
              <view v-for="(item, fIdx) in currentPage.section.figureItems" :key="`${item}-${fIdx}`" class="figure-error-row">
                <text class="figure-error-tag">诊断 {{ fIdx + 1 }}</text>
                <text class="figure-item-text">{{ item }}</text>
              </view>
            </view>
            <view v-else class="figure-map-grid">
              <view v-for="(item, fIdx) in currentPage.section.figureItems" :key="`${item}-${fIdx}`" class="figure-map-card">
                <text class="figure-step" :style="{ background: fIdx === 0 ? template.accent : '#9fb0c4' }">{{ fIdx + 1 }}</text>
                <text class="figure-item-text">{{ item }}</text>
              </view>
            </view>
          </view>

          <text
            v-for="(paragraph, idx) in currentPage.section.paragraphs"
            :key="`section-paragraph-${idx}`"
            class="article-paragraph"
          >{{ paragraph }}</text>

        </view>

      </view>

      <view v-else-if="currentPage.type === 'course-challenge' || currentPage.type === 'deep-challenge'" class="stage">

        <image class="hero-image" :src="pageImage('course', currentPage.courseId)" mode="widthFix" />

        <view class="article-panel">

          <view class="article-header">

            <text class="article-badge article-badge-accent">{{ challengeLabel(currentPage.challengeTask) }}</text>

            <text class="article-title">{{ currentPage.title }}</text>

            <text class="article-sub">{{ currentPage.course.subtitle || currentPage.article.subtitle }}</text>

          </view>

          <text class="article-paragraph">{{ currentPage.course.summary || currentPage.article.summary }}</text>

          <view class="interaction-panel" :class="{ 'interaction-panel-core': currentPage.type === 'deep-challenge' }">

            <text class="interaction-title">{{ currentPage.challenge.interaction.title }}</text>

            <text class="interaction-goal">{{ currentPage.challenge.interaction.goal }}</text>

            <view class="interaction-group">

              <text class="interaction-label">输入</text>

              <view class="topic-row">

                <text
                  v-for="item in currentPage.challenge.interaction.inputs || []"
                  :key="item"
                  class="topic-chip topic-chip-soft"
                >{{ item }}</text>

              </view>

            </view>

            <view class="interaction-group">

              <text class="interaction-label">动作</text>

              <view class="topic-row">

                <text
                  v-for="item in currentPage.challenge.interaction.actions || []"
                  :key="item"
                  class="topic-chip topic-chip-action"
                >{{ item }}</text>

              </view>

            </view>

            <view v-if="(currentPage.challenge.interaction.feedback || []).length" class="interaction-group">

              <text class="interaction-label">反馈</text>

              <view class="topic-row">

                <text
                  v-for="item in currentPage.challenge.interaction.feedback"
                  :key="item"
                  class="topic-chip topic-chip-warn"
                >{{ item }}</text>

              </view>

            </view>

            <view v-if="(currentPage.challenge.errorTypes || []).length" class="interaction-group">

              <text class="interaction-label">典型错误</text>

              <view class="topic-row">

                <text
                  v-for="item in currentPage.challenge.errorTypes"
                  :key="item"
                  class="topic-chip topic-chip-warn"
                >{{ item }}</text>

              </view>

            </view>

            <text class="task-line">输出：{{ currentPage.challenge.interaction.output }}</text>

          </view>

          <view class="action-row">

            <button class="btn-inline" :style="{ color: template.accent, borderColor: template.accent }" @tap="startMajorChallenge(currentPage)">开始挑战</button>

          </view>

          <view v-if="isChallengeDone(currentPage.courseId, currentPage.challengeTask)" class="visited-tag">已完成</view>

        </view>

      </view>



      <!-- 兼容旧页类型：内联课程文章 -->

      <view v-else-if="currentPage.type === 'course-article'" class="stage">

        <image class="hero-image" :src="pageImage('course', currentPage.courseId)" mode="widthFix" />

        <view class="article-panel">

          <view class="article-header">

            <text class="article-title">{{ currentPage.article.title }}</text>

            <text class="article-sub">{{ currentPage.article.subtitle }}</text>

          </view>

          <view
            v-for="(section, sIdx) in currentPage.article.sections"
            :key="`${section.title}-${sIdx}`"
            class="article-section"
          >
            <text class="article-section-title">{{ section.title }}</text>
            <text v-if="section.formula" class="section-formula">{{ section.formula }}</text>
            <image
              v-if="section.imageSrc"
              class="section-image"
              :src="resolveAsset(section.imageSrc)"
              mode="widthFix"
            />
            <view v-else-if="section.figureItems && section.figureItems.length" class="figure-panel">
              <text class="figure-kind">{{ visualKindLabel(section.visualKind) }}</text>
              <view v-if="section.visualKind === 'method'" class="figure-method-list">
                <view v-for="(item, fIdx) in section.figureItems" :key="`${item}-${fIdx}`" class="figure-method-row">
                  <text class="figure-step" :style="{ background: fIdx === 0 ? template.accent : '#9fb0c4' }">{{ fIdx + 1 }}</text>
                  <text class="figure-item-text">{{ item }}</text>
                </view>
              </view>
              <view v-else-if="section.visualKind === 'concept'" class="figure-concept-grid">
                <view v-for="(item, fIdx) in section.figureItems" :key="`${item}-${fIdx}`" class="figure-concept-card">
                  <text class="figure-concept-label">对象 {{ fIdx + 1 }}</text>
                  <text class="figure-item-text">{{ item }}</text>
                </view>
              </view>
              <view v-else-if="section.visualKind === 'error'" class="figure-error-list">
                <view v-for="(item, fIdx) in section.figureItems" :key="`${item}-${fIdx}`" class="figure-error-row">
                  <text class="figure-error-tag">诊断 {{ fIdx + 1 }}</text>
                  <text class="figure-item-text">{{ item }}</text>
                </view>
              </view>
              <view v-else class="figure-map-grid">
                <view v-for="(item, fIdx) in section.figureItems" :key="`${item}-${fIdx}`" class="figure-map-card">
                  <text class="figure-step" :style="{ background: fIdx === 0 ? template.accent : '#9fb0c4' }">{{ fIdx + 1 }}</text>
                  <text class="figure-item-text">{{ item }}</text>
                </view>
              </view>
            </view>
            <text v-for="(paragraph, idx) in section.paragraphs" :key="idx" class="article-paragraph">{{ paragraph }}</text>
          </view>

          <view class="interaction-panel">

            <text class="interaction-title">{{ currentPage.article.interaction.title }}</text>

            <text class="interaction-goal">{{ currentPage.article.interaction.goal }}</text>

            <view class="interaction-group">

              <text class="interaction-label">输入</text>

              <view class="topic-row">

                <text v-for="item in currentPage.article.interaction.inputs" :key="item" class="topic-chip topic-chip-soft">{{ item }}</text>

              </view>

            </view>

            <view class="interaction-group">

              <text class="interaction-label">动作</text>

              <view class="topic-row">

                <text v-for="item in currentPage.article.interaction.actions" :key="item" class="topic-chip topic-chip-action">{{ item }}</text>

              </view>

            </view>

            <view class="interaction-group">

              <text class="interaction-label">反馈</text>

              <view class="topic-row">

                <text v-for="item in currentPage.article.interaction.feedback" :key="item" class="topic-chip topic-chip-warn">{{ item }}</text>

              </view>

            </view>

            <text class="task-line">体验任务：{{ currentPage.article.interaction.output }}</text>

          </view>

        </view>

      </view>



      <!-- 深入开始 -->

      <view v-else-if="currentPage.type === 'deep-start'" class="stage">

        <text class="overview-welcome">深入体验{{ template.label }}</text>

        <view class="intro-card intro-card-center">

          <text class="intro-line">{{ currentPage.intro }}</text>

        </view>

        <image v-if="showPageHero('deepStart')" class="hero-image" :src="pageImage('deepStart')" mode="widthFix" />

        <view class="intro-detail-card deep-bridge-card">

          <text class="intro-detail-title">从基础课走向深度课程</text>

          <text class="intro-detail-body">深度课程不再只介绍专业是什么，而是进入本科核心课的判断方式：读输入、建模型、检查约束、解释错误，并把结论写成可复核报告。</text>

        </view>

        <view v-for="(course, idx) in currentPage.courses" :key="course.id" class="intro-detail-card">

          <text class="intro-detail-index">深度课程 {{ idx + 1 }}</text>

          <text class="intro-detail-title">{{ course.title }}</text>

          <text class="intro-detail-body">{{ course.subtitle }}</text>

        </view>

      </view>



      <!-- 深入课程预览 + 诊断挑战 -->

      <view v-else-if="currentPage.type === 'deep-preview'" class="stage">

        <image class="hero-image" :src="pageImage('course', currentPage.courseId)" mode="widthFix" />

        <view class="course-panel">

          <view class="course-head">

            <text class="course-flag course-flag-core">{{ currentPage.challenge.badge }}</text>

            <text class="course-title">{{ currentPage.challenge.course }}</text>

            <text class="course-sub">{{ currentPage.challenge.title }}</text>

          </view>

          <text class="course-preview-text">{{ currentPage.challenge.description }}</text>

          <text class="course-meta">共 {{ (currentPage.article && currentPage.article.sections || []).length }} 节 · 建议先阅读再完成诊断挑战</text>

          <view class="action-row">

            <button class="btn-inline" :style="{ color: template.accent, borderColor: template.accent }" @tap="goReadCourse(currentPage.courseId, 'core')">阅读课程</button>

          </view>

          <view v-if="visitedCourses.includes(currentPage.courseId)" class="visited-tag">已阅读</view>

        </view>

        <view class="challenge-section">

          <text class="challenge-section-title">{{ challengeLabel(currentPage.challengeTask) }}</text>

          <view

            class="challenge-entry-card"

            :class="{ 'challenge-entry-done': isChallengeDone(currentPage.courseId, currentPage.challengeTask) }"

            @tap="startMajorChallenge(currentPage)"

          >

            <view class="challenge-entry-copy">

              <text class="challenge-entry-title">{{ currentPage.challenge.interaction.title }}</text>

              <text class="challenge-entry-body">{{ currentPage.challenge.interaction.goal }}</text>

              <text class="challenge-entry-action">{{ isChallengeDone(currentPage.courseId, currentPage.challengeTask) ? '再次挑战' : '开始挑战' }}</text>

            </view>

          </view>

        </view>

      </view>



      <!-- 兼容旧页类型：深入课程内联 -->

      <view v-else-if="currentPage.type === 'deep-course'" class="stage">

        <image class="hero-image" :src="pageImage('course', currentPage.courseId)" mode="widthFix" />

        <view v-if="currentPage.article" class="article-panel">

          <view class="article-header">

            <text class="article-title">{{ currentPage.article.title }}</text>

            <text class="article-sub">{{ currentPage.article.subtitle }}</text>

          </view>

          <view
            v-for="(section, sIdx) in currentPage.article.sections"
            :key="`${section.title}-${sIdx}`"
            class="article-section"
          >
            <text class="article-section-title">{{ section.title }}</text>
            <text v-if="section.formula" class="section-formula">{{ section.formula }}</text>
            <image
              v-if="section.imageSrc"
              class="section-image"
              :src="resolveAsset(section.imageSrc)"
              mode="widthFix"
            />
            <view v-else-if="section.figureItems && section.figureItems.length" class="figure-panel">
              <text class="figure-kind">{{ visualKindLabel(section.visualKind) }}</text>
              <view v-if="section.visualKind === 'method'" class="figure-method-list">
                <view v-for="(item, fIdx) in section.figureItems" :key="`${item}-${fIdx}`" class="figure-method-row">
                  <text class="figure-step" :style="{ background: fIdx === 0 ? template.accent : '#9fb0c4' }">{{ fIdx + 1 }}</text>
                  <text class="figure-item-text">{{ item }}</text>
                </view>
              </view>
              <view v-else-if="section.visualKind === 'concept'" class="figure-concept-grid">
                <view v-for="(item, fIdx) in section.figureItems" :key="`${item}-${fIdx}`" class="figure-concept-card">
                  <text class="figure-concept-label">对象 {{ fIdx + 1 }}</text>
                  <text class="figure-item-text">{{ item }}</text>
                </view>
              </view>
              <view v-else-if="section.visualKind === 'error'" class="figure-error-list">
                <view v-for="(item, fIdx) in section.figureItems" :key="`${item}-${fIdx}`" class="figure-error-row">
                  <text class="figure-error-tag">诊断 {{ fIdx + 1 }}</text>
                  <text class="figure-item-text">{{ item }}</text>
                </view>
              </view>
              <view v-else class="figure-map-grid">
                <view v-for="(item, fIdx) in section.figureItems" :key="`${item}-${fIdx}`" class="figure-map-card">
                  <text class="figure-step" :style="{ background: fIdx === 0 ? template.accent : '#9fb0c4' }">{{ fIdx + 1 }}</text>
                  <text class="figure-item-text">{{ item }}</text>
                </view>
              </view>
            </view>
            <text v-for="(paragraph, idx) in section.paragraphs" :key="idx" class="article-paragraph">{{ paragraph }}</text>
          </view>

          <view class="interaction-panel interaction-panel-core">

            <text class="interaction-title">{{ currentPage.challenge.interaction.title }}</text>

            <text class="interaction-goal">{{ currentPage.challenge.interaction.goal }}</text>

            <view class="interaction-group">

              <text class="interaction-label">典型错误</text>

              <view class="topic-row">

                <text v-for="item in currentPage.challenge.errorTypes" :key="item" class="topic-chip topic-chip-warn">{{ item }}</text>

              </view>

            </view>

            <text class="task-line">输出：{{ currentPage.challenge.interaction.output }}</text>

          </view>

        </view>

      </view>



      <!-- 分流选择 -->

      <view v-else-if="currentPage.type === 'branching'" class="stage">

        <text class="overview-welcome">{{ template.labelLong }}分流</text>

        <text class="stage-intro stage-intro-center">先选择一个方向进入体验。这里不要求一次定终身，你可以随时回到本页重新选择，并比较不同方向的课程结构与问题类型。</text>

        <image v-if="showPageHero('branching')" class="hero-image" :src="pageImage('branching')" mode="widthFix" />

        <view

          v-for="branch in currentPage.branches"

          :key="branch.id"

          class="branch-card"

          :class="{ 'branch-card-active': selectedBranchId === branch.id }"

          @tap="selectBranch(branch)"

        >

          <image class="branch-image" :src="pageImage('branch', branch.id)" mode="aspectFill" />

          <view class="branch-head">

            <text class="branch-title">{{ branch.title }}</text>

            <text v-if="selectedBranchId === branch.id" class="branch-check">已选</text>

          </view>

          <text class="branch-fit">{{ branch.body }}</text>

        </view>

      </view>



      <!-- 方向概览 -->

      <view v-else-if="currentPage.type === 'branch-overview'" class="stage">

        <image v-if="showBranchHero" class="hero-image" :src="pageImage('branch', currentPage.branchId)" mode="widthFix" />

        <view class="article-panel">

          <text class="article-title">{{ currentPage.direction.title }}</text>

          <text class="article-sub">{{ currentPage.direction.body }}</text>

        </view>

        <view
          v-for="(topic, idx) in currentPage.direction.topics"
          :key="topic.id || `${currentPage.branchId}-${idx}`"
          class="intro-detail-card branch-topic-preview"
        >

          <text class="intro-detail-index" :style="{ color: template.accent }">专题 {{ idx + 1 }}</text>

          <text class="intro-detail-title">{{ topic.title }}</text>

          <text class="intro-detail-body">{{ topic.subtitle }}</text>

          <text class="branch-topic-hint">下一页会进入完整专题正文，并展示正式交互 brief、输入数据和错误反馈。</text>

        </view>

      </view>



      <!-- 方向专题 -->

      <view v-else-if="currentPage.type === 'branch-topic-intro' || currentPage.type === 'branch-topic'" class="stage">

        <image class="hero-image" :src="pageImage('branch', currentPage.branchId)" mode="widthFix" />

        <view class="article-panel">

          <text class="article-title">{{ currentPage.topic.title }}</text>

          <text class="article-sub">{{ currentPage.topic.subtitle }}</text>

          <text v-if="currentPage.topic.summary" class="article-paragraph">{{ currentPage.topic.summary }}</text>

          <view class="topic-row">
            <text
              v-for="(section, sIdx) in currentPage.topic.sections"
              :key="`${section.title}-${sIdx}`"
              class="topic-chip topic-chip-soft"
            >正文 {{ sIdx + 1 }} · {{ section.title }}</text>
          </view>

          <view class="interaction-panel">

            <text class="interaction-title">{{ currentPage.topic.interaction.title }}</text>

            <text class="interaction-goal">{{ currentPage.topic.interaction.goal }}</text>

            <text class="task-line">输出：{{ currentPage.topic.interaction.output }}</text>

          </view>

        </view>

      </view>

      <view v-else-if="currentPage.type === 'branch-topic-section'" class="stage">

        <image class="hero-image" :src="pageImage('branch', currentPage.branchId)" mode="widthFix" />

        <view class="article-panel">

          <view class="article-header">

            <text class="article-badge">专题正文</text>

            <text class="article-title">{{ currentPage.subtitle }}</text>

            <text class="article-sub">{{ currentPage.topic.title }}</text>

          </view>

          <text
            v-for="(paragraph, idx) in currentPage.section.paragraphs"
            :key="`branch-topic-section-${idx}`"
            class="article-paragraph"
          >{{ paragraph }}</text>

        </view>

      </view>

      <view v-else-if="currentPage.type === 'branch-topic-challenge'" class="stage">

        <image class="hero-image" :src="pageImage('branch', currentPage.branchId)" mode="widthFix" />

        <view class="article-panel">

          <view class="article-header">

            <text class="article-badge article-badge-accent">{{ challengeLabel(currentPage.challengeTask) }}</text>

            <text class="article-title">{{ currentPage.topic.title }}</text>

            <text class="article-sub">{{ currentPage.topic.subtitle }}</text>

          </view>

          <text v-if="currentPage.topic.summary" class="article-paragraph">{{ currentPage.topic.summary }}</text>

          <view class="interaction-panel">

            <text class="interaction-title">{{ currentPage.topic.interaction.title }}</text>

            <text class="interaction-goal">{{ currentPage.topic.interaction.goal }}</text>

            <view class="interaction-group">

              <text class="interaction-label">输入</text>

              <view class="topic-row">

                <text
                  v-for="item in currentPage.topic.interaction.inputs || []"
                  :key="item"
                  class="topic-chip topic-chip-soft"
                >{{ item }}</text>

              </view>

            </view>

            <view class="interaction-group">

              <text class="interaction-label">动作</text>

              <view class="topic-row">

                <text
                  v-for="item in currentPage.topic.interaction.actions || []"
                  :key="item"
                  class="topic-chip topic-chip-action"
                >{{ item }}</text>

              </view>

            </view>

            <view class="interaction-group">

              <text class="interaction-label">反馈</text>

              <view class="topic-row">

                <text
                  v-for="item in currentPage.topic.interaction.feedback || []"
                  :key="item"
                  class="topic-chip topic-chip-warn"
                >{{ item }}</text>

              </view>

            </view>

            <text class="task-line">输出：{{ currentPage.topic.interaction.output }}</text>

          </view>

          <view class="action-row">

            <button class="btn-inline" :style="{ color: template.accent, borderColor: template.accent }" @tap="startMajorChallenge(currentPage)">开始挑战</button>

          </view>

          <view v-if="isChallengeDone(currentPage.topic.id, currentPage.challengeTask)" class="visited-tag">已完成</view>

        </view>

      </view>



      <!-- 完成页 -->

      <view v-else-if="currentPage.type === 'done'" class="stage">

        <view class="completion-card">

          <text class="completion-badge">体验完成</text>

          <text class="completion-title">{{ currentPage.completionTitle }}</text>

          <text class="completion-desc">{{ currentPage.completionDescription }}</text>

        </view>

        <view class="finish-card">

          <text class="finish-title">适配判断</text>

          <text class="finish-desc">结合你刚体验的方向与专题，判断自己是否愿意长期投入这类问题。</text>

          <view class="summary-card summary-card-inline">

            <text class="summary-line">专业：{{ template.labelLong }}</text>

            <text class="summary-line">方向：{{ selectedBranchTitle || '未选择' }}</text>

            <text class="summary-line">已阅读课程：{{ visitedCourses.length }} 门</text>

            <text class="summary-line">已完成挑战：{{ visitedChallenges.length }} 项</text>

            <text class="summary-line">相关职业：{{ template.careers.join(' / ') }}</text>

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

        :style="{ background: template.accent }"

        :disabled="!canNext"

        @tap="nextPage"

      >

        {{ nextLabel }}

      </button>

      <button

        v-else

        class="btn-primary"

        :style="{ background: template.accent }"

        @tap="finishExperience"

      >

        {{ completed ? '完成并返回' : '完成体验' }}

      </button>

    </view>

  </view>



  <view v-else class="empty-page">

    <text class="empty-title">暂未接入该专业的速体验</text>

    <text class="empty-desc">该专业内容正在按 Web 端同步中。</text>

    <button class="btn-ghost" @tap="goBack">返回</button>

  </view>

</template>



<script>

import { getMajorSpeedTemplate } from '../../business/major-speed-data'

import { markMajorExplored } from '../../business/explore-progress'

import {

  buildMajorSpeedPages,

  findBranchOverviewPageIndex,

} from '../../business/major-speed-pages'

import { getMajorSpeedImage } from '../../business/major-speed-images'
import { resolveAsset } from '../../utils/asset-map'
import { MAJOR_CHALLENGE_TASK_LABELS, getMajorStageMeta, getOverviewCards, getOverviewCardLabelSets, getCourseMapCards, getCourseMapCardLabelSets, shouldShowMajorHero, shouldShowBranchHero, COURSE_MAP_EXTRA_INTRO } from '../../business/major-config'
import { loadMajorProgress } from '../../business/major-progress'
import { isMajorChallengeCompleted } from '../../business/major-challenge-progress'



const SNAPSHOT_PREFIX = 'major-speed-progress:'



export default {

  data() {

    return {

      majorId: '',

      template: null,

      pageIndex: 0,

      scrollTop: 0,

      selectedBranchId: '',

      selectedBranchTitle: '',

      fitChoice: '',

      completed: false,

      unlockedStageIndexes: [0],

      fitOptions: [

        { value: 'fit', label: '我愿意长期处理这类问题和工具' },

        { value: 'maybe', label: '有兴趣，但还想再多体验其他专业' },

        { value: 'unfit', label: '不太适合我，想换个方向' },

      ],

      majorProgress: { visitedCourses: [], visitedChallenges: [] },

    }

  },

  computed: {

    stageMeta() {
      return getMajorStageMeta(this.template)
    },

    overviewCards() {
      return getOverviewCards(this.template)
    },

    overviewCardLabels() {
      return getOverviewCardLabelSets(this.template)
    },

    courseMapCards() {
      return getCourseMapCards(this.template)
    },

    courseMapCardLabels() {
      return getCourseMapCardLabelSets(this.template)
    },

    courseMapExtraIntro() {
      return COURSE_MAP_EXTRA_INTRO
    },

    showBranchHero() {
      return shouldShowBranchHero(this.majorId)
    },

    stageSections() {
      if (!this.template) return []
      const branch =
        this.template.branchDirections.find((item) => item.id === this.selectedBranchId) ||
        this.template.branchDirections[0] ||
        null

      return [
        {
          id: 'overview',
          stageIndex: 0,
          items: [
            { id: 'catalog', label: `${this.template.label}概览`, pageId: 'catalog' },
            { id: 'catalog-complete', label: '概览完成', pageId: 'catalog-complete' },
          ],
        },
        {
          id: 'foundation',
          stageIndex: 1,
          items: [
            { id: 'courses', label: '课程总览', pageId: 'courses' },
            ...(this.template.foundationArticles || []).map((course) => ({
              id: `foundation-${course.id}`,
              label: course.title,
              matcher: (page) => page.flowId === `foundation-${course.id}`,
            })),
            { id: 'intro-complete', label: '介绍完成', pageId: 'intro-complete' },
          ],
        },
        {
          id: 'core',
          stageIndex: 2,
          items: [
            { id: 'deep-start', label: '课程总览', pageId: 'deep-start' },
            ...(this.template.deepDiveChallenges || []).map((challenge) => ({
              id: `core-${challenge.id}`,
              label: challenge.course,
              matcher: (page) => page.flowId === `core-${challenge.id}`,
            })),
            { id: 'deep-complete', label: '深入完成', pageId: 'deep-complete' },
          ],
        },
        {
          id: 'branching',
          stageIndex: 3,
          items: [
            { id: 'branching', label: '选择方向', pageId: 'branching' },
          ],
        },
        {
          id: 'branch',
          stageIndex: 4,
          items: [
            { id: 'branch-overview', label: '方向概览', pageId: 'branch-overview' },
            ...(((branch && branch.topics) || []).map((topic, index) => ({
              id: `branch-topic-${index}`,
              label: topic.title,
              matcher: (page) => page.flowId === `branch-${branch.id}-topic-${index}`,
            }))),
            { id: 'done', label: '体验完成', pageId: 'done' },
          ],
        },
      ]
    },

    activeStageSection() {
      return this.stageSections.find((section) => section.stageIndex === this.activeStageIndex) || null
    },

    topLevelNavItems() {
      const section = this.activeStageSection
      if (!section) return []
      return section.items.map((item) => {
        const pageIndex = this.resolveNavTargetIndex(item)
        return {
          id: item.id,
          label: item.label,
          pageIndex,
          active: this.isCurrentSecondary(item),
          unlocked: pageIndex >= 0 && pageIndex <= this.pageIndex,
        }
      })
    },

    currentFlowId() {
      return this.currentPage.flowId || ''
    },

    tertiaryNavItems() {
      if (!this.currentFlowId) return []
      return this.pages
        .map((page, index) => ({ page, index }))
        .filter((entry) => entry.page.flowId === this.currentFlowId)
        .map((entry) => ({
          id: entry.page.id,
          label: entry.page.navTitle || entry.page.subtitle || entry.page.title,
          pageIndex: entry.index,
          active: this.currentPage.id === entry.page.id,
          unlocked: entry.index <= this.pageIndex,
        }))
    },

    showTertiaryNav() {
      return this.tertiaryNavItems.length > 1
    },

    visitedCourses() {

      return this.majorProgress.visitedCourses || []

    },

    visitedChallenges() {

      return this.majorProgress.visitedChallenges || []

    },

    pages() {

      return this.template ? buildMajorSpeedPages(this.template, this.selectedBranchId) : []

    },

    currentPage() {

      return this.pages[this.pageIndex] || { type: 'overview', title: '', stageIndex: 0 }

    },

    activeStageIndex() {

      return this.currentPage.stageIndex || 0

    },

    canNext() {

      if (this.currentPage.type === 'branching') return Boolean(this.selectedBranchId)

      return true

    },

    nextLabel() {

      if (this.currentPage.type === 'branching') {

        return this.selectedBranchId ? `进入${this.selectedBranchTitle || '所选方向'}` : '请先选择方向'

      }

      if (this.currentPage.type === 'stage-complete') return '进入下一阶段'

      return '下一页'

    },

  },

  watch: {

    selectedBranchId() {

      this.saveSnapshot()

    },

  },

  onLoad(query) {

    const pageQuery = query || {}

    this.majorId = pageQuery.id || ''

    this.template = getMajorSpeedTemplate(this.majorId)

    if (!this.template) return



    this.majorProgress = loadMajorProgress(this.majorId)

    const defaultBranch = this.template.branchDirections && this.template.branchDirections[0]

    if (defaultBranch) {

      this.selectedBranchId = defaultBranch.id

      this.selectedBranchTitle = defaultBranch.title

    }



    this.restoreSnapshot()

    uni.setNavigationBarTitle({ title: `${this.template.label}速体验` })

  },

  onShow() {

    if (this.majorId) {

      this.majorProgress = loadMajorProgress(this.majorId)

    }

  },

  methods: {

    goBack() {

      uni.navigateBack()

    },

    pageImage(slot, key) {

      return getMajorSpeedImage(this.majorId, slot, key)

    },

    showPageHero(slot) {
      return shouldShowMajorHero(this.majorId, slot)
    },

    formatCardIndex(idx) {
      const value = Number(idx) + 1
      return value < 10 ? `0${value}` : String(value)
    },

    resolveAsset(path) {

      return resolveAsset(path)

    },

    visualKindLabel(kind) {

      const labels = {
        map: '课程地图',
        concept: '核心对象',
        method: '专业动作',
        error: '错误反馈',
        summary: '应用总结',
      }

      return labels[kind] || '图示'

    },

    challengeLabel(task) {

      return MAJOR_CHALLENGE_TASK_LABELS[task] || '专业挑战'

    },

    isChallengeDone(moduleId, task) {

      return isMajorChallengeCompleted(this.majorId, moduleId, task)

    },

    goReadCourse(courseId, level) {

      uni.navigateTo({

        url: `/pages/discover/major-course?majorId=${encodeURIComponent(this.majorId)}&courseId=${encodeURIComponent(courseId)}&level=${encodeURIComponent(level)}`,

      })

    },

    startMajorChallenge(page) {

      const moduleId = page.topic

        ? page.topic.id

        : page.courseId

      const task = page.challengeTask || 'model'

      uni.navigateTo({

        url: `/pages/discover/major-challenge?majorId=${encodeURIComponent(this.majorId)}&moduleId=${encodeURIComponent(moduleId)}&task=${encodeURIComponent(task)}`,

      })

    },

    snapshotKey() {

      return `${SNAPSHOT_PREFIX}${this.majorId}`

    },

    restoreSnapshot() {

      try {

        const snapshot = uni.getStorageSync(this.snapshotKey())

        if (!snapshot) return

        this.selectedBranchId = snapshot.selectedBranchId || this.selectedBranchId

        this.selectedBranchTitle = snapshot.selectedBranchTitle || this.selectedBranchTitle

        this.fitChoice = snapshot.fitChoice || ''

        this.completed = Boolean(snapshot.completed)

        this.unlockedStageIndexes = Array.isArray(snapshot.unlockedStageIndexes)

          ? snapshot.unlockedStageIndexes

          : [0]

        if (typeof snapshot.pageIndex === 'number') {

          const maxIndex = Math.max(0, buildMajorSpeedPages(this.template, this.selectedBranchId).length - 1)

          this.pageIndex = Math.min(snapshot.pageIndex, maxIndex)

        }

      } catch (error) {

        console.error('[major-speed] restore snapshot failed', error)

      }

    },

    saveSnapshot() {

      try {

        uni.setStorageSync(this.snapshotKey(), {

          pageIndex: this.pageIndex,

          selectedBranchId: this.selectedBranchId,

          selectedBranchTitle: this.selectedBranchTitle,

          fitChoice: this.fitChoice,

          completed: this.completed,

          unlockedStageIndexes: this.unlockedStageIndexes,

        })

      } catch (error) {

        console.error('[major-speed] save snapshot failed', error)

      }

    },

    scrollToTop() {

      this.scrollTop = this.scrollTop === 0 ? 1 : 0

    },

    unlockStage(stageIndex) {

      if (!this.unlockedStageIndexes.includes(stageIndex)) {

        this.unlockedStageIndexes = [...this.unlockedStageIndexes, stageIndex].sort((a, b) => a - b)

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

    jumpToNavItem(item) {
      if (!item || item.pageIndex < 0) return
      if (item.pageIndex > this.pageIndex) {
        uni.showToast({ title: '请先按当前流程继续体验', icon: 'none' })
        return
      }
      this.pageIndex = item.pageIndex
      this.scrollToTop()
      this.saveSnapshot()
    },

    jumpToFlowItem(item) {
      this.jumpToNavItem(item)
    },

    jumpToStage(stageIndex) {
      if (!this.unlockedStageIndexes.includes(stageIndex)) {
        uni.showToast({ title: '请先完成上一阶段', icon: 'none' })
        return
      }

      const target = this.pages.findIndex((page) => page.stageIndex === stageIndex)

      if (target >= 0) {

        this.pageIndex = target

        this.scrollToTop()

        this.saveSnapshot()

      }

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

        const branchOverviewIndex = findBranchOverviewPageIndex(

          buildMajorSpeedPages(this.template, this.selectedBranchId),

        )

        if (branchOverviewIndex >= 0) {

          this.unlockStage(4)

          this.pageIndex = branchOverviewIndex

          this.scrollToTop()

          this.saveSnapshot()

          return

        }

      }



      if (this.pageIndex < this.pages.length - 1) {

        const nextPage = this.pages[this.pageIndex + 1]

        this.unlockStage(nextPage.stageIndex)

        this.pageIndex += 1

        this.scrollToTop()

        this.saveSnapshot()

      }

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

      markMajorExplored(this.majorId)

      this.completed = true

      this.saveSnapshot()

      uni.showToast({ title: '专业体验完成', icon: 'success' })

      setTimeout(() => uni.navigateBack(), 800)

    },

  },

}

</script>



<style scoped>

.page { display: flex; flex-direction: column; height: 100vh; background: #f4f7fb; }

.topbar { padding: 24rpx 28rpx 20rpx; }

.topbar-row { display: flex; align-items: baseline; gap: 14rpx; }

.topbar-title { font-size: 36rpx; font-weight: 700; color: #fff; }

.topbar-en { font-size: 22rpx; color: rgba(255,255,255,0.82); }

.page-indicator { display: block; margin-top: 10rpx; font-size: 22rpx; line-height: 1.5; color: rgba(255,255,255,0.9); }

.steps { display: flex; justify-content: space-between; margin-top: 18rpx; }

.stage-nav-scroll { margin-top: 18rpx; white-space: nowrap; }

.stage-nav-scroll-tertiary { margin-top: 12rpx; }

.stage-nav-row { display: inline-flex; gap: 12rpx; padding-bottom: 4rpx; }

.stage-nav-pill { flex-shrink: 0; padding: 10rpx 18rpx; border-radius: 999rpx; background: rgba(255,255,255,0.18); border: 2rpx solid transparent; }

.stage-nav-pill-active { background: #fff; border-color: rgba(15,23,42,0.08); }

.stage-nav-pill-locked { opacity: 0.45; }

.stage-nav-pill-tertiary { background: rgba(255,255,255,0.12); }

.stage-nav-pill-text { font-size: 20rpx; color: rgba(255,255,255,0.92); white-space: nowrap; }

.stage-nav-pill-active .stage-nav-pill-text { color: #102033; font-weight: 700; }

.step-dot { display: flex; flex-direction: column; align-items: center; gap: 8rpx; flex: 1; }

.step-index { width: 44rpx; height: 44rpx; line-height: 44rpx; text-align: center; border-radius: 50%; font-size: 22rpx; font-weight: 700; background: rgba(255,255,255,0.28); color: #fff; }

.step-dot-active .step-index { background: #fff; color: #0f172a; }

.step-dot-done .step-index { background: rgba(255,255,255,0.85); color: #0f172a; }

.step-dot-locked { opacity: 0.45; }

.step-label { font-size: 20rpx; color: rgba(255,255,255,0.9); }



.body { flex: 1; padding: 24rpx; box-sizing: border-box; }

.stage-overview { padding-bottom: 40rpx; }

.overview-welcome { display: block; text-align: center; font-size: 34rpx; font-weight: 800; color: #102033; line-height: 1.35; margin-bottom: 20rpx; }

.intro-card-center { text-align: left; }

.intro-detail-card { background: #fff; border-radius: 24rpx; padding: 26rpx; margin-bottom: 20rpx; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.05); border: 1rpx solid #e8eff5; }

.intro-detail-index { display: block; font-size: 20rpx; font-weight: 700; color: #64748b; margin-bottom: 8rpx; }

.intro-detail-title { display: block; font-size: 28rpx; font-weight: 700; color: #162033; }

.intro-detail-body { display: block; margin-top: 10rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }

.stage-intro-center { text-align: center; display: block; }

.deep-bridge-card { margin-top: 24rpx; }

.branch-topic-preview { margin-top: 16rpx; }

.branch-topic-hint { display: block; margin-top: 12rpx; font-size: 22rpx; line-height: 1.7; color: #64748b; }

.stage { padding-bottom: 40rpx; }

.stage-intro { display: block; font-size: 24rpx; line-height: 1.75; color: #5b6675; margin-bottom: 20rpx; }

.hero-image { width: 100%; border-radius: 24rpx; margin-bottom: 20rpx; background: #eef2f7; }



.intro-card,

.article-panel,

.finish-card,

.completion-card { background: #fff; border-radius: 24rpx; padding: 26rpx; box-shadow: 0 16rpx 40rpx rgba(15,23,42,0.05); }

.intro-line { display: block; font-size: 26rpx; line-height: 1.8; color: #2c3645; margin-bottom: 14rpx; }

.intro-line:last-child { margin-bottom: 0; }



.stats-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin: 20rpx 0 22rpx; }

.stat-card { width: calc(50% - 8rpx); box-sizing: border-box; background: #fff; border-radius: 22rpx; padding: 22rpx; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.04); }

.stat-value { display: block; font-size: 34rpx; font-weight: 700; color: #16233a; }

.stat-label { display: block; margin-top: 8rpx; font-size: 22rpx; color: #64748b; }



.method-loop { display: flex; flex-wrap: wrap; gap: 12rpx; margin: 22rpx 0; }

.method-chip { display: flex; align-items: center; gap: 8rpx; padding: 12rpx 18rpx; border-radius: 999rpx; background: #e8effb; font-size: 22rpx; color: #2f4d77; font-weight: 600; }

.method-index { width: 30rpx; height: 30rpx; line-height: 30rpx; text-align: center; border-radius: 50%; background: #2f4d77; color: #fff; font-size: 18rpx; }



.overview-grid { display: flex; flex-wrap: wrap; gap: 16rpx; }

.overview-card { width: calc(50% - 8rpx); box-sizing: border-box; background: #fff; border-radius: 22rpx; padding: 22rpx; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.04); }

.overview-title { display: block; font-size: 26rpx; font-weight: 700; color: #16233a; }

.overview-body { display: block; margin-top: 10rpx; font-size: 22rpx; line-height: 1.65; color: #5d6776; }



.completion-card { margin-bottom: 20rpx; }

.completion-badge { display: inline-block; padding: 8rpx 16rpx; border-radius: 999rpx; background: #ecfdf5; color: #047857; font-size: 20rpx; font-weight: 700; }

.completion-title { display: block; margin-top: 16rpx; font-size: 32rpx; font-weight: 700; color: #16233a; }

.completion-desc { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }

.next-stage-card { margin-top: 22rpx; padding: 22rpx; border-radius: 20rpx; background: #f8fafc; }

.next-stage-label { display: block; font-size: 20rpx; font-weight: 700; color: #64748b; }

.next-stage-title { display: block; margin-top: 10rpx; font-size: 28rpx; font-weight: 700; color: #16233a; }

.next-stage-desc { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.7; color: #64748b; }



.course-card { background: #fff; border-radius: 24rpx; padding: 26rpx; margin-bottom: 20rpx; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.05); }

.course-card-core { border-left: 6rpx solid #2563eb; }

.course-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16rpx; }

.course-title-wrap { flex: 1; min-width: 0; }

.course-title { display: block; font-size: 30rpx; font-weight: 700; color: #16233a; }

.course-sub { display: block; margin-top: 8rpx; font-size: 22rpx; color: #7b8697; line-height: 1.5; }

.course-flag { padding: 8rpx 16rpx; border-radius: 999rpx; background: #e0f2fe; font-size: 20rpx; font-weight: 700; color: #0369a1; }

.course-flag-core { background: #ede9fe; color: #6d28d9; }

.course-intro { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.7; color: #4a5564; }



.topic-row { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 16rpx; }

.topic-chip { padding: 10rpx 18rpx; border-radius: 999rpx; background: #eef3f9; font-size: 21rpx; color: #44566c; }

.topic-chip-branch { background: #ecfdf5; color: #0f766e; }

.topic-chip-soft { background: #f1f5f9; color: #475569; }

.topic-chip-action { background: #eff6ff; color: #1d4ed8; }

.topic-chip-warn { background: #fff7ed; color: #c2410c; }



.article-header { margin-bottom: 18rpx; }

.article-badge { display: inline-flex; align-items: center; justify-content: center; min-height: 42rpx; padding: 0 16rpx; border-radius: 999rpx; background: #eff6ff; color: #1d4ed8; font-size: 20rpx; font-weight: 700; }

.article-badge-accent { background: #ecfdf5; color: #047857; }

.article-title { display: block; font-size: 30rpx; font-weight: 700; color: #16233a; }

.article-sub { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.7; color: #64748b; }

.article-section { padding: 22rpx 0; border-bottom: 1rpx solid #eef2f7; }

.article-section:last-child { border-bottom: none; }

.article-section-title { display: block; font-size: 26rpx; font-weight: 700; color: #16233a; }

.section-formula { display: block; margin-top: 12rpx; padding: 14rpx 18rpx; border-radius: 14rpx; background: #f3f7fb; font-size: 22rpx; line-height: 1.6; color: #475569; }

.section-image { width: 100%; border-radius: 18rpx; margin-top: 14rpx; background: #eef2f7; }

.figure-panel { margin-top: 14rpx; padding: 20rpx; border-radius: 18rpx; border: 1rpx solid #e3ebf3; background: #fbfdff; }

.figure-kind { display: block; margin-bottom: 14rpx; font-size: 20rpx; font-weight: 700; color: #64748b; }

.figure-step { width: 40rpx; height: 40rpx; line-height: 40rpx; text-align: center; border-radius: 50%; font-size: 20rpx; font-weight: 700; color: #fff; flex-shrink: 0; }

.figure-item-text { font-size: 22rpx; line-height: 1.6; color: #3f5268; font-weight: 600; }

.figure-method-list { display: flex; flex-direction: column; gap: 12rpx; }

.figure-method-row { display: flex; align-items: center; gap: 12rpx; padding: 14rpx; border-radius: 14rpx; border: 1rpx solid #e3ebf3; background: #fff; }

.figure-concept-grid { display: flex; flex-wrap: wrap; gap: 12rpx; }

.figure-concept-card { width: calc(50% - 6rpx); box-sizing: border-box; min-height: 120rpx; padding: 14rpx; border-radius: 14rpx; border: 1rpx solid #e3ebf3; background: #fff; }

.figure-concept-label { display: block; font-size: 18rpx; font-weight: 700; color: #8aa0b6; margin-bottom: 8rpx; }

.figure-error-list { display: flex; flex-direction: column; gap: 10rpx; }

.figure-error-row { display: flex; overflow: hidden; border-radius: 14rpx; border: 1rpx solid #e3ebf3; background: #fff; }

.figure-error-tag { width: 120rpx; padding: 14rpx; background: #fff7ed; font-size: 20rpx; font-weight: 700; color: #c05621; flex-shrink: 0; }

.figure-error-row .figure-item-text { flex: 1; padding: 14rpx; }

.figure-map-grid { display: flex; flex-wrap: wrap; gap: 12rpx; }

.figure-map-card { width: calc(50% - 6rpx); box-sizing: border-box; display: flex; align-items: flex-start; gap: 10rpx; padding: 14rpx; border-radius: 14rpx; border: 1rpx solid #dbe7ef; background: #fff; }

.article-paragraph { display: block; margin-top: 12rpx; font-size: 24rpx; line-height: 1.8; color: #475569; }



.interaction-panel { margin-top: 20rpx; padding: 22rpx; border-radius: 20rpx; background: #f8fafc; }

.interaction-panel-core { background: #f8faff; }

.interaction-title { display: block; font-size: 26rpx; font-weight: 700; color: #16233a; }

.interaction-goal { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.7; color: #64748b; }

.interaction-group { margin-top: 18rpx; }

.interaction-label { display: block; font-size: 22rpx; font-weight: 700; color: #334155; }

.task-line { display: block; margin-top: 12rpx; font-size: 23rpx; line-height: 1.7; color: #1f2937; }



.branch-card { background: #fff; border-radius: 24rpx; padding: 26rpx; margin-bottom: 18rpx; border: 2rpx solid transparent; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.05); overflow: hidden; }

.branch-card-active { border-color: #14b8a6; background: #f3fffb; }

.branch-image { width: 100%; height: 220rpx; border-radius: 18rpx; margin-bottom: 16rpx; background: #eef2f7; }

.branch-head { display: flex; justify-content: space-between; align-items: center; gap: 16rpx; }

.branch-title { font-size: 28rpx; font-weight: 700; color: #16233a; }

.branch-check { font-size: 20rpx; font-weight: 700; color: #0f766e; background: #d1fae5; padding: 6rpx 14rpx; border-radius: 999rpx; }

.branch-fit { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #4a5564; }

.branch-project { display: block; margin-top: 14rpx; font-size: 22rpx; color: #475569; }



.finish-title { font-size: 30rpx; font-weight: 700; color: #16233a; }

.finish-desc { display: block; margin-top: 10rpx; font-size: 24rpx; color: #5d6776; line-height: 1.75; }

.fit-option { margin-top: 16rpx; padding: 20rpx; border-radius: 18rpx; background: #f5f8fc; border: 2rpx solid transparent; }

.fit-option-active { border-color: #2563eb; background: #eef4ff; }

.fit-option-text { font-size: 24rpx; color: #334155; font-weight: 600; line-height: 1.6; }

.summary-card-inline { margin-top: 20rpx; box-shadow: none; padding: 0; background: transparent; }

.summary-line { display: block; margin-top: 12rpx; font-size: 23rpx; color: #4a5564; line-height: 1.6; }



.footer { display: flex; gap: 16rpx; padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -8rpx 28rpx rgba(15,23,42,0.06); }

.btn-ghost, .btn-primary { flex: 1; height: 84rpx; line-height: 84rpx; border-radius: 999rpx; border: none; font-size: 28rpx; font-weight: 700; }

.btn-ghost { background: #eef2f7; color: #475569; }

.btn-primary { color: #fff; }

.btn-primary[disabled] { opacity: 0.55; }



.empty-page { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 0 60rpx; }

.empty-title { font-size: 30rpx; font-weight: 700; color: #16233a; }

.empty-desc { margin-top: 14rpx; font-size: 24rpx; color: #7b8697; text-align: center; }

.empty-page .btn-ghost { margin-top: 30rpx; width: 240rpx; flex: none; }



.catalog-card { display: flex; flex-direction: column; background: #fff; border-radius: 24rpx; overflow: hidden; margin-bottom: 20rpx; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.05); }

.catalog-image { width: 100%; background: #eef2f7; }

.catalog-copy { padding: 22rpx 24rpx 26rpx; }

.catalog-index { display: block; font-size: 20rpx; font-weight: 700; color: #64748b; }

.catalog-title { display: block; margin-top: 8rpx; font-size: 28rpx; font-weight: 700; color: #162033; }

.catalog-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }



.course-panel { background: #fff; border-radius: 24rpx; padding: 26rpx; box-shadow: 0 12rpx 32rpx rgba(15,23,42,0.05); }

.course-preview-text { display: block; margin-top: 14rpx; font-size: 24rpx; line-height: 1.75; color: #475569; }

.course-meta { display: block; margin-top: 12rpx; font-size: 22rpx; color: #94a3b8; }

.action-row { margin-top: 20rpx; }

.btn-inline { display: inline-block; padding: 14rpx 28rpx; border-radius: 999rpx; border: 2rpx solid #007a66; background: #fff; font-size: 24rpx; font-weight: 700; }

.visited-tag { display: inline-block; margin-top: 16rpx; padding: 8rpx 16rpx; border-radius: 999rpx; background: #ecfdf5; color: #047857; font-size: 20rpx; font-weight: 700; }



.challenge-section { margin-top: 28rpx; padding-top: 24rpx; border-top: 4rpx solid #e2e8f0; }

.challenge-section-title { display: block; font-size: 28rpx; font-weight: 700; color: #162033; margin-bottom: 16rpx; }

.challenge-entry-card { background: #fff; border-radius: 20rpx; padding: 22rpx; border: 2rpx solid #e5e7eb; }

.challenge-entry-done { border-color: #14b8a6; background: #f3fffb; }

.challenge-entry-title { display: block; font-size: 26rpx; font-weight: 700; color: #162033; }

.challenge-entry-body { display: block; margin-top: 10rpx; font-size: 23rpx; line-height: 1.65; color: #64748b; }

.challenge-entry-action { display: block; margin-top: 14rpx; font-size: 22rpx; font-weight: 700; color: #0f766e; }



.role-row { display: flex; align-items: flex-start; gap: 10rpx; margin-top: 14rpx; }

.role-dot { font-size: 28rpx; color: #0f766e; line-height: 1.4; }

.role-text { flex: 1; font-size: 24rpx; line-height: 1.7; color: #334155; }

</style>

