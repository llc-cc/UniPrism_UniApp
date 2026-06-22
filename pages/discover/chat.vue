<template>
  <view
    class="page"
    :class="{
      'page--basic-profile': isBasicProfileScreen,
      'page--stage-personality-intro': isPersonalityStageIntro,
      'page--stage-holland-intro': isHollandStageIntro,
      'page--stage-deep-intro': isDeepStageIntro,
      'page--complete': showComplete,
    }"
  >
    <view
      v-if="isBasicProfileScreen"  
      class="mp-nav-bar"
      :style="navBarStyle"
    >
      <view class="mp-nav-bar__inner" :style="{ height: navLayout.contentHeight + 'px' }">
        <view class="mp-nav-bar__side mp-nav-bar__side--back" @tap="goHome">
          <view class="basic-back-icon"></view>
        </view>
        <view class="mp-nav-bar__center">
          <text class="mp-nav-bar__title">基本信息</text>
        </view>
        <view class="mp-nav-bar__side mp-nav-bar__side--right"></view>
      </view>
    </view>
    <view v-else class="mp-nav-bar mp-nav-bar--default" :class="{ 'mp-nav-bar--complete': showComplete }" :style="navBarStyle">
      <view class="mp-nav-bar__inner" :style="{ height: navLayout.contentHeight + 'px' }">
        <view v-if="!showComplete && !isCurrentStageIntro" class="mp-nav-bar__side mp-nav-bar__side--back" @tap="goHome">
          <view class="basic-back-icon"></view>
        </view>
        <view v-else class="mp-nav-bar__side"></view>
        <view class="mp-nav-bar__center">
          <text class="mp-nav-bar__title">{{ showComplete ? '兴趣探索' : topbarTitle }}</text>
        </view>
        <view class="mp-nav-bar__side mp-nav-bar__side--right"></view>
      </view>
    </view>
    <view
      v-if="isCurrentStageIntro && !showComplete"
      class="stage-intro-top-skip"
      :style="stageIntroSkipStyle"
      @tap="handlePrimary"
    >
      <text class="stage-intro-top-skip__text">跳过</text>
    </view>

    <view v-if="showPageProgressBar" class="question-stage-progress">
      <view
        v-for="(stage, index) in progressStageNodes"
        :key="stage.id"
        class="question-stage-progress__item"
        :class="[
          `question-stage-progress__item--${stageProgressNodeState(index)}`,
          { 'question-stage-progress__item--clickable': stageProgressClickable(index) },
        ]"
        @tap="handleStageProgressTap(index)"
      >
        <view class="question-stage-progress__dot">
          <view class="question-stage-progress__dot-core" />
        </view>
        <view v-if="index < progressStageSegmentCount" class="question-stage-progress__bar">
          <view
            class="question-stage-progress__bar-fill"
            :style="{ width: stageProgressSegmentWidth(index) }"
          />
        </view>
      </view>
    </view>
    <view v-if="showPageProgressBar" class="question-progress-actions">
      <button class="question-progress-restart" @tap="restart">重来</button>
    </view>

    <view v-if="showComplete" class="complete-screen">
      <!-- icon + shadow -->
      <view class="complete-body">
        <view class="complete-icon-wrap">
          <ChatAssetImage
            :path="REPORT_READY_SHADOW"
            mode="aspectFit"
            image-class="complete-shadow-img"
            wrap-class="complete-shadow-wrap"
            label="完成页阴影"
            :show-path-hint="0"
          />
          <ChatAssetImage
            :path="REPORT_READY_ICON"
            mode="aspectFit"
            image-class="complete-icon-img"
            wrap-class="complete-icon-inner"
            label="探索完成图标"
            :show-path-hint="0"
          />
        </view>
        <text class="complete-title">兴趣探索已全部完成</text>

        <!-- button -->
        <view class="complete-footer">
          <button class="complete-btn" :disabled="finishing" @tap="generateReport">
            {{ finishing ? '生成中...' : '生成报告' }}
          </button>
        </view>
      </view>
    </view>

    <scroll-view
      v-else
      class="content"
      :class="{
        'content--basic-profile': isBasicProfileScreen,
        'content--stage-holland-intro': isHollandStageIntro,
        'content--stage-deep-intro': isDeepStageIntro,
      }"
      scroll-y
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
      :enable-back-to-top="true"
    >
      <view
        v-if="isCurrentStageIntro"
        class="question-card stage-intro-card"
        :class="{
          'stage-intro-card--personality': isPersonalityStageIntro,
          'stage-intro-card--holland': isHollandStageIntro,
          'stage-intro-card--deep': isDeepStageIntro,
        }"
      >
        <text v-if="currentStageIntro.badge" class="stage-intro-badge">{{ currentStageIntro.badge }}</text>
        <text class="stage-intro-title">{{ currentStageIntro.title }}</text>
        <text class="stage-intro-subtitle">{{ currentStageIntro.subtitle }}</text>

        <view class="stage-intro-hero">
          <ChatAssetImage
            v-if="currentStageIntro.shadowSrc"
            :path="currentStageIntro.shadowSrc"
            mode="aspectFit"
            image-class="stage-intro-shadow"
            wrap-class="stage-intro-shadow-wrap"
            label="阶段阴影"
            :show-path-hint="0"
          />
          <ChatAssetImage
            v-if="currentStageIntro.iconSrc"
            :path="currentStageIntro.iconSrc"
            mode="aspectFit"
            :image-class="currentStageIntro.iconClass || 'stage-intro-icon'"
            :wrap-class="currentStageIntro.iconWrapClass || 'stage-intro-icon-wrap'"
            label="阶段图标"
            :show-path-hint="0"
          />
          <ChatAssetImage
            v-else-if="currentStageIntro.artwork"
            :path="currentStageIntro.artwork"
            mode="aspectFit"
            image-class="stage-intro-image"
            wrap-class="stage-intro-image-wrap"
            label="阶段配图"
            :show-path-hint="0"
          />
        </view>

        <view class="stage-intro-metrics">
          <view
            v-for="metric in currentStageIntro.metrics"
            :key="metric"
            class="stage-intro-metric"
          >
            <text class="stage-intro-metric-text">{{ metric }}</text>
          </view>
        </view>

        <view v-if="currentStageIntro.paragraphs && currentStageIntro.paragraphs.length" class="stage-intro-copy">
          <text v-for="paragraph in currentStageIntro.paragraphs" :key="paragraph" class="stage-intro-copy-text">{{ paragraph }}</text>
        </view>

        <view v-if="isPersonalityStageIntro" class="stage-mbti-wrap">
          <view class="stage-mbti-card">
            <text class="stage-mbti-title">你是否做过 MBTI 测试</text>
            <view class="stage-mbti-choice-row">
              <view
                class="stage-mbti-choice"
                :class="{ 'stage-mbti-choice--on': mbtiChoice === 'known' }"
                @tap="setMbtiChoice('known')"
              >
                <text class="stage-mbti-choice-text">是</text>
              </view>
              <view
                class="stage-mbti-choice"
                :class="{ 'stage-mbti-choice--on': mbtiChoice === 'unknown' }"
                @tap="setMbtiChoice('unknown')"
              >
                <text class="stage-mbti-choice-text">否</text>
              </view>
            </view>
          </view>

          <view v-if="mbtiChoice === 'known'" class="stage-mbti-card stage-mbti-card--selector-line" @tap="toggleMbtiPicker">
            <text class="stage-mbti-line-label">你的MBTI是</text>
            <view class="stage-mbti-line-value-wrap">
              <text class="stage-mbti-line-value" :class="{ 'stage-mbti-line-value--placeholder': !selectedMbtiType }">{{ selectedMbtiType || '请选择' }}</text>
              <text class="stage-mbti-line-arrow" :class="{ 'stage-mbti-line-arrow--open': mbtiPickerOpen }">⌃</text>
            </view>
          </view>

          <view v-if="mbtiChoice === 'known' && mbtiPickerOpen" class="stage-mbti-card stage-mbti-card--selector">
            <view class="stage-mbti-grid">
              <view
                v-for="type in MBTI_TYPES"
                :key="type"
                class="stage-mbti-pill"
                :class="{ 'stage-mbti-pill--on': selectedMbtiType === type }"
                @tap="selectMbtiType(type)"
              >
                <text class="stage-mbti-pill-text">{{ type }}</text>
              </view>
            </view>
          </view>

          <view v-else class="stage-mbti-card stage-mbti-card--disclaimer">
            <text class="stage-mbti-disclaimer">本阶段只用于了解你的MBTI行为风格倾向；结果会作为探索报告中的人格画像参考，不作为心理诊断</text>
          </view>
        </view>
      </view>

      <!-- 性格 / 能力：多题同页（对齐 Web PersonalityBatchScreen / AbilityBatchScreen） -->
      <view v-else-if="isCurrentBatchScreen" class="question-card">
        <view
          v-for="(bq, bi) in screenQuestions"
          :key="bq.id"
          :id="'anchor-q-' + bq.id"
          class="batch-block"
          :class="[
            isPersonalityBatch
              ? 'batch-block--personality'
              : (isCareerCalibrationBatch ? 'batch-block--calibration' : 'batch-block--ability'),
          ]"
        >
          <template v-if="isPersonalityBatch">
            <text class="batch-block-title">{{ bq.prompt }}</text>
            <ChatAssetImage
              v-if="bq.imageSrc"
              :path="bq.imageSrc"
              mode="aspectFit"
              image-class="personality-question-image"
              wrap-class="personality-question-image-wrap"
              label="性格测试配图"
              :show-path-hint="0"
            />
          </template>

          <template v-else-if="isCareerCalibrationBatch">
            <text class="batch-block-prompt">{{ getVisibleQuestionPrompt(bq.prompt) }}</text>
            <ChatAssetImage
              v-if="bq.imageSrc"
              :path="bq.imageSrc"
              mode="aspectFit"
              image-class="calibration-question-image"
              wrap-class="calibration-question-image-wrap"
              label="深度测评校准配图"
              :show-path-hint="0"
            />
          </template>

          <template v-else>
            <view v-if="bq.abilitySetup" class="ability-card">
              <text class="ability-series">{{ bq.abilitySetup.series }}</text>
              <text class="ability-title">{{ bq.abilitySetup.title }}</text>
              <text v-for="line in bq.abilitySetup.lines" :key="line" class="ability-line">{{ line }}</text>
            </view>

            <view v-if="bq.abilityPuzzle" class="puzzle-block">
              <ChatAssetImage
                v-if="bq.abilityPuzzle.imageSrc"
                :path="bq.abilityPuzzle.imageSrc"
                mode="widthFix"
                image-class="question-image puzzle-image"
                wrap-class="puzzle-image-wrap"
                label="谜题配图"
              />
              <text class="puzzle-scene">{{ bq.abilityPuzzle.scene }}</text>
              <view v-for="(table, ti) in bq.abilityPuzzle.tables || []" :key="ti" class="puzzle-table-wrap">
                <view class="puzzle-table-row puzzle-table-head">
                  <text v-for="col in table.columns" :key="col" class="puzzle-table-cell">{{ col }}</text>
                </view>
                <view v-for="(row, ri) in table.rows" :key="ri" class="puzzle-table-row">
                  <text v-for="(cell, ci) in row" :key="ci" class="puzzle-table-cell">{{ cell }}</text>
                </view>
              </view>
              <text v-if="bq.abilityPuzzle.hint" class="puzzle-hint">提示：{{ bq.abilityPuzzle.hint }}</text>
            </view>

            <text class="batch-block-prompt">{{ bq.prompt }}</text>
          </template>

          <view
            class="batch-opt-grid"
            :class="isCareerCalibrationBatch ? 'batch-opt-grid--scale' : 'batch-opt-grid--stack'"
          >
            <view
              v-for="(opt, oi) in bq.options || []"
              :key="opt.id"
              class="opt batch-opt"
              :class="[
                isCareerCalibrationBatch ? 'batch-opt--scale' : 'career-opt career-opt--row',
                {
                  'opt--on': batchValues[bq.id] === opt.id,
                  'opt--err': questionValidations[bq.id] && batchValues[bq.id] !== opt.id,
                },
              ]"
              @tap="setBatchAnswer(bq.id, opt.id)"
            >
              <template v-if="isCareerCalibrationBatch">
                <text class="batch-scale-circle">{{ chr(oi) }}</text>
                <text class="batch-scale-label">{{ opt.label }}</text>
              </template>
              <template v-else>
                <text class="opt-p">{{ chr(oi) }}</text>
                <text class="opt-l">{{ opt.label }}</text>
              </template>
            </view>
          </view>
        </view>

        <view v-if="screenValidationMessage" class="validation-banner">
          <text class="validation-banner-text">{{ screenValidationMessage }}</text>
        </view>
      </view>

      <view
        v-else-if="q"
        class="question-card"
        :class="{
          'question-card--basic-profile': isBasicProfileScreen,
        }"
      >
        <ChatAssetImage
          v-if="showStageArtwork && stageArtworkPath"
          :path="stageArtworkPath"
          mode="aspectFit"
          image-class="stage-artwork-img"
          wrap-class="stage-artwork-wrap"
          label="阶段配图"
        />
        <ChatAssetImage
          v-if="questionImagePath && q.type !== 'career-scenario' && q.type !== 'holland-fine-grained' && !isBasicProfileScreen"
          :path="questionImagePath"
          mode="aspectFill"
          image-class="question-image-img"
          wrap-class="question-image-wrap"
          label="题目配图"
        />

        <view v-if="q.abilitySetup" class="ability-card">
          <text class="ability-series">{{ q.abilitySetup.series }}</text>
          <text class="ability-title">{{ q.abilitySetup.title }}</text>
          <text v-for="line in q.abilitySetup.lines" :key="line" class="ability-line">{{ line }}</text>
        </view>

        <view v-if="q.abilityPuzzle" class="puzzle-block">
          <ChatAssetImage
            v-if="puzzleImagePath"
            :path="puzzleImagePath"
            mode="widthFix"
            image-class="question-image puzzle-image"
            wrap-class="puzzle-image-wrap"
            label="谜题配图"
          />
          <text class="puzzle-scene">{{ q.abilityPuzzle.scene }}</text>
          <view v-for="(table, ti) in q.abilityPuzzle.tables || []" :key="ti" class="puzzle-table-wrap">
            <view class="puzzle-table-row puzzle-table-head">
              <text v-for="col in table.columns" :key="col" class="puzzle-table-cell">{{ col }}</text>
            </view>
            <view v-for="(row, ri) in table.rows" :key="ri" class="puzzle-table-row">
              <text v-for="(cell, ci) in row" :key="ci" class="puzzle-table-cell">{{ cell }}</text>
            </view>
          </view>
          <text v-if="q.abilityPuzzle.hint" class="puzzle-hint">提示：{{ q.abilityPuzzle.hint }}</text>
        </view>

        <text v-if="!isBasicProfileScreen && q.type !== 'holland-fine-grained'" class="question-title">{{ q.prompt }}</text>
        <text
          v-if="!isBasicProfileScreen && q.subtext && q.type !== 'career-scenario' && q.type !== 'holland-fine-grained'"
          class="question-subtext"
        >{{ q.subtext }}</text>

        <view class="question-body">
          <!-- career-scenario: 职业倾向情景测试（对齐 Web CareerScenarioScreen） -->
          <view v-if="q.type === 'career-scenario' && q.careerScenario" class="career-scenario">
          <view id="anchor-career-first" class="career-section">
            <ChatAssetImage
              :path="careerFirstImagePath"
              mode="widthFix"
              image-class="career-scene-image"
              wrap-class="career-scene-wrap"
              label="情景配图"
            />
            <text class="career-scene-text">{{ q.careerScenario.scene }}</text>
            <text class="career-block-title">{{ q.careerScenario.firstPrompt }}</text>
            <view class="career-choice-list">
              <view
                v-for="(opt, oi) in q.careerScenario.firstOptions"
                :key="opt.id"
                class="opt career-opt career-opt--row"
                :class="{
                  'career-opt--on': careerVal.firstChoiceId === opt.id,
                  'opt--on': careerVal.firstChoiceId === opt.id,
                  'opt--err': careerFieldErrors.firstChoiceId && careerVal.firstChoiceId !== opt.id,
                }"
                @tap="setCareerFirst(opt.id)"
              >
                <text class="opt-p">{{ chr(oi) }}</text>
                <text class="opt-l">{{ opt.label }}</text>
              </view>
            </view>
          </view>

          <view
            id="anchor-career-items"
            class="career-section"
            :class="{
              'career-items-interactive--dragging': rankDragIndex >= 0,
            }"
            @touchmove="onCareerItemsTouchMove"
            @touchend="onCareerRankTouchEnd"
            @touchcancel="onCareerRankTouchCancel"
          >
            <ChatAssetImage
              v-if="showCareerItemScene"
              :path="careerItemImagePath"
              mode="widthFix"
              image-class="career-scene-image"
              wrap-class="career-scene-wrap"
              label="情景配图"
            />
            <text v-if="showCareerItemScene" class="career-scene-text">{{ q.careerScenario.itemScene || q.careerScenario.scene }}</text>
            <view class="career-block-head">
              <text class="career-block-title">{{ q.careerScenario.itemPrompt }}</text>
              <text class="career-block-meta">{{ careerVal.itemChoiceIds.length }}/{{ q.careerScenario.itemMaxSelections }}</text>
            </view>

            <view
              v-if="careerVal.itemChoiceIds.length"
              class="career-rank-selected career-rank-grid"
              :class="{ 'career-rank-selected--pool-drag': rankDragOverPool }"
            >
              <view
                v-for="(optionId, ri) in careerVal.itemChoiceIds"
                :key="'rank-slot-' + optionId"
                class="career-rank-slot-wrap"
              >
                <view
                  class="career-rank-slot career-rank-slot--on"
                  :class="{
                    'career-rank-slot--placeholder-active': rankDragIndex === ri,
                    'career-rank-slot--drop': rankDropTargetIndex === ri && rankDragIndex >= 0 && rankDragIndex !== ri,
                  }"
                  @touchstart.stop="onCareerRankSlotTouchStart(ri, $event)"
                >
                  <text class="career-rank-slot-order">{{ ri + 1 }}</text>
                  <text class="career-rank-slot-text">{{ careerItemLabel(optionId) }}</text>
                </view>
              </view>
            </view>
            <view
              v-if="rankDragIndex >= 0 && rankDragGhostVisible"
              class="career-rank-ghost"
              :style="rankGhostStyleStr"
            >
              <text class="career-rank-slot-order">{{ rankDragIndex + 1 }}</text>
              <text class="career-rank-slot-text">{{ careerRankSlotLabel(rankDragIndex) }}</text>
            </view>
            <text v-if="careerRankMaxSelections > 0 && careerVal.itemChoiceIds.length" class="career-rank-hint">已选项会固定显示在上方，拖动可上下换序；向下滑动可移回下方，轻点可取消选择</text>
            <view v-if="careerRankMaxSelections > 0 && careerVal.itemChoiceIds.length" class="career-rank-divider"></view>

            <view
              class="career-item-pool"
              :class="{
                'career-item-pool--err': careerFieldErrors.itemChoiceIds,
                'career-item-pool--drop-active': rankDragOverPool,
              }"
            >
              <view
                v-for="opt in q.careerScenario.itemOptions || []"
                :key="opt.id"
                class="career-item-tile"
                :class="{ 'career-item-tile--picked': isCareerItemPicked(opt.id) }"
                @tap="toggleCareerItem(opt.id)"
              >
                <text class="career-item-tile-text">{{ opt.label }}</text>
              </view>
            </view>
          </view>

          <view
            id="anchor-career-open"
            class="career-section"
          >
            <ChatAssetImage
              v-if="showCareerOpenScene"
              :path="careerOpenImagePath"
              mode="widthFix"
              image-class="career-scene-image"
              wrap-class="career-scene-wrap"
              label="情景配图"
            />
            <text v-if="showCareerOpenScene" class="career-scene-text">{{ q.careerScenario.openScene || q.careerScenario.openPrompt }}</text>
            <text id="anchor-career-team" class="career-block-title">{{ careerTeamTitle }}</text>
            <view v-if="q.careerScenario.teamOptions && q.careerScenario.teamOptions.length" class="career-choice-list">
              <view
                v-for="(opt, oi) in q.careerScenario.teamOptions"
                :key="opt.id"
                class="opt career-opt career-opt--row"
                :class="{
                  'career-opt--on': careerVal.teamChoiceId === opt.id,
                  'opt--on': careerVal.teamChoiceId === opt.id,
                  'opt--err': careerFieldErrors.teamChoiceId && careerVal.teamChoiceId !== opt.id,
                }"
                @tap="setCareerTeam(opt.id)"
              >
                <text class="opt-p">{{ chr(oi) }}</text>
                <text class="opt-l">{{ opt.label }}</text>
              </view>
            </view>
            <view v-for="field in q.careerScenario.openFields || []" :key="field.id" :id="'anchor-career-open-' + field.id" class="career-open-field">
              <text class="career-open-label">{{ field.label }}</text>
              <textarea
                class="textarea career-textarea"
                :class="{ 'career-textarea--err': careerFieldErrors[field.id] }"
                :value="careerOpenText(field.id)"
                :placeholder="field.placeholder || '写下你的回答'"
                @input="onCareerOpenInput(field.id, $event)"
              />
            </view>
          </view>
        </view>

        <!-- profile-form: dynamic fields from question bank -->
        <view v-if="q.type === 'profile-form'" class="profile-form" :class="{ 'profile-form--basic': isBasicProfileScreen }">
          <view v-if="isBasicProfileScreen" class="basic-profile-intro">
            <ChatAssetImage
              :path="STAGE_PROFILE_ARTWORK"
              mode="aspectFit"
              image-class="basic-profile-intro__img"
              wrap-class="basic-profile-intro__img-wrap"
              label="基本信息配图"
              :show-path-hint="0"
            />
            <text class="basic-profile-intro__title">填写基本信息</text>
            <text class="basic-profile-intro__sub">信息用于生成报告与初始画像</text>
          </view>
          <view
            v-for="field in q.profileFields || []"
            :key="field.id"
            :id="'anchor-field-' + field.id"
            class="field-card"
            :class="field.type === 'text' ? 'field-card--text' : ''"
          >
            <view v-if="field.type === 'multi'" class="field-head">
              <text class="field-label">{{ field.label }}</text>
              <text class="field-meta">{{ profileMultiCount(field.id) }}/{{ field.maxSelections || 3 }}</text>
            </view>
            <text v-if="field.type !== 'multi'" class="field-label">{{ field.label }}</text>

            <input
              v-if="field.type === 'text'"
              class="text-input"
              :class="{
                'text-input--err': profileFieldErrors[field.id],
                'text-input--filled': isProfileTextFilled(field.id),
              }"
              type="text"
              :placeholder="field.id === 'name' ? '请输入姓名或者昵称' : (field.placeholder || '')"
              placeholder-class="text-input-placeholder"
              :value="profileText(field.id)"
              @input="onProfileTextInput(field.id, $event)"
            />

            <view v-if="field.type === 'single'" class="career-choice-list">
              <view
                v-for="(opt, oi) in field.options || []"
                :key="opt.id"
                class="opt career-opt career-opt--row"
                :class="{
                  'opt--on': profileSingle(field.id) === opt.id,
                  'opt--err': profileFieldErrors[field.id] && profileSingle(field.id) !== opt.id,
                }"
                @tap="setProfileSingle(field.id, opt.id)"
              >
                <text class="opt-p">{{ chr(oi) }}</text>
                <text class="opt-l">{{ opt.label }}</text>
              </view>
            </view>

            <view v-if="field.type === 'multi'" class="profile-multi-grid">
              <view
                v-for="(opt, oi) in field.options || []"
                :key="opt.id"
                class="opt career-opt career-opt--row"
                :class="{
                  'opt--on': profileMulti(field.id).includes(opt.id),
                  'opt--err': profileFieldErrors[field.id] && !profileMulti(field.id).includes(opt.id),
                }"
                @tap="toggleProfileMulti(field.id, opt.id, field.maxSelections || 3)"
              >
                <text class="opt-p">{{ chr(oi) }}</text>
                <text class="opt-l">{{ opt.label }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- interest-tag-grid -->
        <view
          v-if="q.type === 'interest-tag-grid'"
          :id="'anchor-q-' + q.id"
          class="tag-grid"
        >
          <view
            v-for="o in tagOpts"
            :key="o.id"
            class="tag-tile"
            :class="{
              'tag-tile--on': o.selected,
              'tag-tile--err': q && questionValidations[q.id] && !o.selected,
            }"
            @tap="toggleTag(o.id)"
          >
            <view class="tag-icon-wrap">
              <ChatAssetImage
                :path="o.iconPath || '/images/explore/discover/icons/generated/discover-choice-icon-interest-default.svg'"
                mode="aspectFit"
                image-class="tag-icon"
                wrap-class="tag-icon-inner"
                label="标签图标"
                :show-path-hint="0"
              />
            </view>
            <view class="tag-label-wrap" :class="o.selected ? 'tag-label-wrap--on' : ''">
              <text class="tag-label">{{ o.label }}</text>
            </view>
          </view>
        </view>

        <!-- free-text -->
        <view v-if="q.type === 'free-text'" class="mt28">
          <textarea class="textarea" :value="textVal" :placeholder="q.placeholder || ''" @input="onTextInput" />
        </view>

        <view v-if="q.type === 'holland-fine-grained' && q.hollandFine" class="holland-fine">
          <text class="holland-fine-section-title">{{ hollandFineDisplayTitle }}</text>
          <view
            v-for="(item, itemIndex) in q.hollandFine.items"
            :key="item.id"
            :id="'anchor-hf-' + item.id"
            class="holland-fine-item"
          >
            <view class="holland-fine-scene">
              <ChatAssetImage
                v-if="hollandFineItemImage(item, itemIndex)"
                :path="hollandFineItemImage(item, itemIndex)"
                mode="aspectFit"
                image-class="holland-fine-scene-image"
                wrap-class="holland-fine-scene-image-wrap"
                label="深度测评情境配图"
                :show-path-hint="0"
              />
              <text v-if="item.scene" class="holland-fine-scene-text">{{ item.scene }}</text>
            </view>
            <view class="holland-fine-question">
              <view v-if="getHollandFineItemHelper(item) || getHollandFineItemMeta(item)" class="holland-fine-question-meta">
                <text v-if="getHollandFineItemHelper(item)" class="holland-fine-question-helper">{{ getHollandFineItemHelper(item) }}</text>
                <text v-if="getHollandFineItemMeta(item)" class="holland-fine-question-badge">{{ getHollandFineItemMeta(item) }}</text>
              </view>
              <text class="holland-fine-question-title">{{ item.prompt }}</text>
              <view
                v-if="item.mode === 'scale-pair' && item.scaleAnchors"
                class="holland-fine-scale-anchors"
              >
                <view class="holland-fine-scale-anchor">
                  <text class="holland-fine-scale-anchor-prefix">A.</text>
                  <text class="holland-fine-scale-anchor-label">{{ item.scaleAnchors.leftLabel }}</text>
                </view>
                <view class="holland-fine-scale-anchor">
                  <text class="holland-fine-scale-anchor-prefix">B.</text>
                  <text class="holland-fine-scale-anchor-label">{{ item.scaleAnchors.rightLabel }}</text>
                </view>
              </view>
              <view
                v-if="item.mode === 'open'"
                class="holland-fine-open-list"
              >
                <view
                  v-for="field in item.openFields || []"
                  :key="field.id"
                  :id="'anchor-hf-open-' + item.id + '-' + field.id"
                  class="holland-fine-open-field"
                >
                  <text class="holland-fine-open-label">{{ field.label }}</text>
                  <textarea
                    class="textarea holland-fine-open-textarea"
                    :class="{ 'career-textarea--err': hollandFineFieldErrors[item.id + '.' + field.id] }"
                    :value="hollandFineOpenResponse(item.id, field.id)"
                    placeholder="写下你的回答"
                    @input="onHollandFineOpenInput(item.id, field.id, $event)"
                  />
                  <text v-if="hollandFineFieldErrors[item.id + '.' + field.id]" class="validation-inline-text">
                    {{ hollandFineFieldErrors[item.id + '.' + field.id] }}
                  </text>
                </view>
              </view>
              <view v-else class="career-choice-list">
                <view
                  v-for="(opt, oi) in item.options || []"
                  :key="opt.id"
                  class="opt career-opt career-opt--row"
                  :class="{
                    'opt--on': hollandFineOptionSelected(item.id, opt.id),
                    'opt--err': hollandFineFieldErrors[item.id] && !hollandFineOptionSelected(item.id, opt.id),
                  }"
                  @tap="setHollandFineOption(item, opt.id)"
                >
                  <text class="opt-p">{{ hollandFineOptionPrefix(item, opt.id, oi) }}</text>
                  <text class="opt-l">{{ opt.label }}</text>
                </view>
                <text
                  v-if="(item.mode === 'multi' || item.mode === 'ranked' || item.mode === 'primary-secondary') && getHollandFineMaxSelections(item) > 1"
                  class="holland-fine-selection-count"
                >
                  {{ hollandFineSelectionCount(item.id) }}/{{ getHollandFineMaxSelections(item) }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <!-- slider (legacy, not in active bank) -->
        <view v-if="q.type === 'slider'" class="mt28">
          <view class="srow">
            <text class="slabel">{{ q.sliderConfig && q.sliderConfig.leftLabel }}</text>
            <text class="slabel">{{ q.sliderConfig && q.sliderConfig.rightLabel }}</text>
          </view>
          <slider :value="slideVal" :min="0" :max="100" :step="1" activeColor="#6b23ff" backgroundColor="#e6e2ff" @change="onSliderChange" />
        </view>

        <!-- card-select / scenario-pair / multi-select -->
        <view
          v-if="isOptionListType"
          :id="'anchor-q-' + q.id"
          class="career-choice-list optlist"
        >
          <view
            v-for="(o, i) in opts"
            :key="o.id"
            class="opt career-opt career-opt--row opt--full"
            :class="{
              'opt--on': o.cls === 'opt--on',
              'opt--err': questionValidations[q.id] && o.cls !== 'opt--on',
            }"
            @tap="onTap(o.id)"
          >
            <text class="opt-p">{{ chr(i) }}</text>
            <text class="opt-l">{{ o.label }}</text>
          </view>
        </view>
        </view>

        <view v-if="screenValidationMessage" class="validation-banner">
          <text class="validation-banner-text">{{ screenValidationMessage }}</text>
        </view>

      </view>
      <view v-else class="question-card">
        <text class="question-title">加载中…</text>
      </view>
    </scroll-view>

    <view
      v-if="!showComplete"
      class="footer"
      :class="{
        'footer--basic-profile': isBasicProfileScreen,
        'footer--stage-figma-intro': isFigmaHeroStageIntro && !isBasicProfileScreen,
        'footer--stage-holland-intro': isHollandStageIntro,
        'footer--stage-deep-intro': isDeepStageIntro,
      }"
    >
      <template>
        <button v-if="!isCurrentStageIntro && !isBasicProfileScreen" class="fbtn fbtn--ghost" :disabled="isPreviousDisabled" @tap="goPreviousWithinStage">上一页</button>
        <button
          class="fbtn fbtn--primary"
          :class="{
            'fbtn--primary-ready': isBasicProfileScreen && isBasicProfileComplete,
            'fbtn--primary-muted': isBasicProfileScreen && !isBasicProfileComplete,
            'fbtn--stage-intro-ready': isFigmaHeroStageIntro && ready,
            'fbtn--stage-intro-muted': isFigmaHeroStageIntro && !ready,
          }"
          :hover-class="isPrimaryDisabled ? '' : 'fbtn--primary-press'"
          hover-stay-time="80"
          :disabled="isPrimaryDisabled"
          @tap="handlePrimary"
        >{{ primaryLabel }}</button>
      </template>
    </view>

    <view v-if="finishing && !showComplete" class="finishing-mask">
      <text class="finishing-text">正在保存探索结果...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, getCurrentInstance, nextTick } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import {
  ALL_QUESTIONS,
  FINAL_CAREER_CALIBRATION_QUESTION_IDS,
  MBTI_KNOWN_QUESTION_ID,
  computePreCareerRiasecTopDimensions,
  createEmptyCareerScenarioAnswer,
  createEmptyHollandFineAnswer,
  isCareerScenarioValue,
  isHollandFineAnswerValue,
} from '../../business/discover-questions'
import {
  CHAT_STAGES,
  getQuestionStageArtwork,
  REPORT_READY_ICON,
  REPORT_READY_SHADOW,
  STAGE_PROFILE_ARTWORK,
} from '../../business/discover-chat-stages'
import {
  CHAT_SCREEN_ORDER,
  PROGRESS_STAGE_SPECS,
  boundedScreenIndex,
  getQuestionsForScreen,
  getProgressStageIndex,
  getScreenStageIndex,
  getScreenTitle,
  isAbilityScreen,
  isAbilityOverviewScreen,
  isBatchScreen,
  isCareerCalibrationScreen,
  isCareerScreen,
  isPersonalityScreen,
  isStageIntroScreen,
} from '../../business/discover-chat-screens'
import {
  computeDiscoverResults,
  emptyDiscoverSession,
  getInitialAnswerValue,
  isAnswerReady,
  loadDiscoverSession,
  resetDiscoverSession,
  saveDiscoverSession,
  submitAnswer,
} from '../../business/discover-session'
import {
  getValidationAnchorId,
  validateAnswer,
} from '../../business/discover-chat-validation'
import {
  clearDiscoverReportCache,
  clearExploreBackendSession,
  clearProfileUploadFlag,
  ensureExploreSessionId,
} from '../../business/profile-sync'
import { resolveAsset } from '../../utils/asset-map'
import ChatAssetImage from '../../components/ChatAssetImage/ChatAssetImage.vue'

const pageInstance = getCurrentInstance()
const MBTI_TYPES = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']
const STAGE_PERSONALITY_DISCLAIMER = '我们为你准备了一份简短的性格测试题供测试使用，本测试不代表真实 MBTI 结果；请以官网实际测试题目为准。'

const questions = ref(Array.isArray(ALL_QUESTIONS) ? ALL_QUESTIONS.slice() : [])
const screenTotal = CHAT_SCREEN_ORDER.length
const displayScreenOrder = CHAT_SCREEN_ORDER.filter((screenId) => !isStageIntroScreen(screenId))
const displayScreenTotal = displayScreenOrder.length
const screenIndex = ref(0)
const q = ref(questions.value[0] || null)
const batchValues = ref({})
const pfFields = ref({})
const singleVal = ref('')
const textVal = ref('')
const slideVal = ref(50)
const multiVal = ref([])
const opts = ref([])
const tagOpts = ref([])
const careerVal = ref(createEmptyCareerScenarioAnswer())
const hollandFineVal = ref({ items: {} })
const backNavigationFloorIndex = ref(null)
const ready = ref(false)
const primaryLabel = ref('下一步')
const finishing = ref(false)
const showComplete = ref(false)
const screenValidationMessage = ref('')
const profileFieldErrors = ref({})
const questionValidations = ref({})
const careerFieldErrors = ref({})
const hollandFineFieldErrors = ref({})
const scrollIntoView = ref('')
const scrollTop = ref(0)
const mbtiChoice = ref('unknown')
const selectedMbtiType = ref('')
const mbtiPickerOpen = ref(false)
const sessionAnswers = ref([])
const entryPrepared = ref(false)
const navLayout = ref({
  paddingTop: 44,
  contentHeight: 44,
  sideWidth: 96,
})

function updateNavLayout() {
  let paddingTop = 44
  let contentHeight = 44
  let sideWidth = 96

  try {
    const systemInfo = uni.getSystemInfoSync()
    paddingTop = systemInfo.statusBarHeight || 44
    // #ifdef MP-WEIXIN
    const menuButton = wx.getMenuButtonBoundingClientRect()
    if (menuButton && menuButton.top) {
      contentHeight = (menuButton.top - paddingTop) * 2 + menuButton.height
      sideWidth = Math.max(systemInfo.windowWidth - menuButton.left + 8, 80)
    } else {
      contentHeight = 44
    }
    // #endif
    // #ifndef MP-WEIXIN
    contentHeight = 44
    // #endif
  } catch (error) {
    paddingTop = 44
    contentHeight = 44
    sideWidth = 96
  }

  navLayout.value = { paddingTop, contentHeight, sideWidth }
}

const navBarStyle = computed(() => {
  const layout = navLayout.value
  return {
    paddingTop: `${layout.paddingTop}px`,
    height: `${layout.paddingTop + layout.contentHeight}px`,
    '--mp-nav-side-width': `${layout.sideWidth}px`,
  }
})

const stageIntroSkipStyle = computed(() => {
  const layout = navLayout.value
  return {
    top: `${layout.paddingTop + layout.contentHeight + 6}px`,
  }
})

/** 选答后稍停再滚，避免过快；滚动时保留上方一截上下文，避免顶到最头 */
const SCROLL_AFTER_ANSWER_MS = 165
const SCROLL_OFFSET_PX = 80

const questionMap = computed(() => {
  const map = new Map()
  for (const item of questions.value) map.set(item.id, item)
  return map
})
const currentScreenId = computed(() => CHAT_SCREEN_ORDER[screenIndex.value] || 'basic')
const screenQuestions = computed(() => getQuestionsForScreen(currentScreenId.value, questionMap.value, sessionAnswers.value))
const isBasicProfileScreen = computed(() => q.value?.id === 'basic-profile')

function isBasicProfileFieldComplete(field, value) {
  if (!field) return false
  if (field.type === 'text') {
    return typeof value === 'string' && value.trim().length >= (field.minLength ?? 1)
  }
  if (field.type === 'multi') {
    return Array.isArray(value) && value.length === (field.maxSelections ?? 3)
  }
  return typeof value === 'string' && value.length > 0
}

const isBasicProfileComplete = computed(() => {
  if (!isBasicProfileScreen.value || !q.value) return false
  const fields = q.value.profileFields || []
  return fields.every((field) => isBasicProfileFieldComplete(field, pfFields.value[field.id]))
})

const isCurrentStageIntro = computed(() => isStageIntroScreen(currentScreenId.value))
const isPersonalityStageIntro = computed(() => currentScreenId.value === 'stage-personality-intro')
const isHollandStageIntro = computed(() => currentScreenId.value === 'stage-holland-intro')
const isDeepStageIntro = computed(() => currentScreenId.value === 'stage-deep-intro')
const isFigmaHeroStageIntro = computed(() => isPersonalityStageIntro.value || isHollandStageIntro.value || isDeepStageIntro.value)
const isCurrentAbilityOverview = computed(() => isAbilityOverviewScreen(currentScreenId.value))
const isCurrentBatchScreen = computed(() => isBatchScreen(currentScreenId.value))
const isPersonalityBatch = computed(() => isPersonalityScreen(currentScreenId.value))
const isCareerCalibrationBatch = computed(() => isCareerCalibrationScreen(currentScreenId.value))
const isAbilityBatch = computed(() => isAbilityScreen(currentScreenId.value))
const careerTopDimensions = computed(() => computePreCareerRiasecTopDimensions(sessionAnswers.value || [], 2))
const hollandFineDisplayTitle = computed(() => {
  if (!q.value || q.value.type !== 'holland-fine-grained') return ''
  const dimension = q.value.hollandFine?.dimension
  const fineDimensionIndex = dimension
    ? careerTopDimensions.value.findIndex((entry) => entry === dimension)
    : -1
  return `深度测评题目 - ${chr(fineDimensionIndex >= 0 ? fineDimensionIndex : 0)}`
})
const topbarTitle = computed(() => {
  if (isBasicProfileScreen.value) return '基本信息'
  if (isCurrentStageIntro.value) return ''
  return phaseLabel.value
})
const showPageProgressBar = computed(() => !showComplete.value && !isBasicProfileScreen.value && !isCurrentStageIntro.value)
const batchScreenTitle = computed(() => {
  if (isAbilityBatch.value) return ''
  return getScreenTitle(currentScreenId.value, screenQuestions.value)
})
const displayScreenIndex = computed(() => {
  const index = displayScreenOrder.indexOf(currentScreenId.value)
  if (index >= 0) return index + 1
  const nextScreenId = CHAT_SCREEN_ORDER.slice(screenIndex.value + 1).find((screenId) => !isStageIntroScreen(screenId))
  const nextIndex = nextScreenId ? displayScreenOrder.indexOf(nextScreenId) : -1
  return nextIndex >= 0 ? nextIndex + 1 : 1
})
const progressStageNodes = computed(() => PROGRESS_STAGE_SPECS)
const progressStageSegmentCount = computed(() => Math.max(0, progressStageNodes.value.length - 1))
const activeProgressStageIndex = computed(() => getProgressStageIndex(currentScreenId.value, showComplete.value))
const answeredQuestionIdSet = computed(() => {
  const set = new Set()
  for (const answer of sessionAnswers.value || []) {
    if (!answer || !answer.questionId) continue
    const value = answer.value
    const ready = typeof value === 'string'
      ? value.trim().length > 0
      : Array.isArray(value)
        ? value.length > 0
        : value !== undefined && value !== null
    if (ready) set.add(answer.questionId)
  }

  return set
})
const progressStageScreenIds = computed(() => {
  return progressStageNodes.value.map((_, stageIndex) => {
    if (stageIndex >= progressStageSegmentCount.value) return []
    const screenIds = []
    for (const screenId of CHAT_SCREEN_ORDER) {
      if (screenId === 'basic' || isStageIntroScreen(screenId)) continue
      if (getScreenStageIndex(screenId) !== stageIndex) continue
      const questionsForScreen = getQuestionsForScreen(screenId, questionMap.value, sessionAnswers.value)
      if (questionsForScreen.length > 0 && !screenIds.includes(screenId)) screenIds.push(screenId)
    }
    return screenIds
  })
})
const progressStageQuestionIds = computed(() => {
  return progressStageScreenIds.value.map((screenIds) => {
    const ids = []
    for (const screenId of screenIds) {
      const questionsForScreen = getQuestionsForScreen(screenId, questionMap.value, sessionAnswers.value)
      for (const question of questionsForScreen) {
        if (question && question.id && !ids.includes(question.id)) ids.push(question.id)
      }
    }
    return ids
  })
})
const activeStageScreenFraction = computed(() => {
  const stageIndex = activeProgressStageIndex.value
  const screenIds = progressStageScreenIds.value[stageIndex] || []
  if (!screenIds.length) return 0
  const currentIndex = screenIds.indexOf(currentScreenId.value)
  if (currentIndex < 0) return 0
  return Math.max(0, Math.min(1, (currentIndex + 1) / screenIds.length))
})
const completedProgressStageCount = computed(() => {
  let count = 0
  for (let stageIndex = 0; stageIndex < progressStageSegmentCount.value; stageIndex += 1) {
    const questionIds = progressStageQuestionIds.value[stageIndex] || []
    const completed = stageIndex === 0 && answeredQuestionIdSet.value.has(MBTI_KNOWN_QUESTION_ID)
      ? true
      : questionIds.length > 0 && questionIds.every((id) => answeredQuestionIdSet.value.has(id))
    if (!completed) break
    count += 1
  }
  return count
})
const stageIntroConfigs = {
  'stage-personality-intro': {
    badge: '',
    title: '阶段一：性格测试',
    subtitle: '了解你的行为风格与适配环境',
    artwork: CHAT_STAGES[0].artwork,
    iconSrc: '/images/explore/home/card-personality@4x.png',
    shadowSrc: '',
    iconClass: 'stage-intro-icon stage-intro-icon--personality-launch',
    iconWrapClass: 'stage-intro-icon-wrap stage-intro-icon-wrap--personality-launch',
    primaryLabel: '点击测试',
    metrics: ['预计时长：大约5分钟', '题目数量：20题'],
    paragraphs: [],
  },
  'stage-holland-intro': {
    badge: '',
    title: '阶段二：职业测试',
    subtitle: '匹配更适合你的职业方向',
    artwork: CHAT_STAGES[1].artwork,
    iconSrc: '/images/explore/home/card-career@4x.png',
    shadowSrc: '',
    iconClass: 'stage-intro-icon stage-intro-icon--career-launch',
    iconWrapClass: 'stage-intro-icon-wrap stage-intro-icon-wrap--career-launch',
    primaryLabel: '点击测试',
    metrics: ['预计时长：大约5分钟', '题目数量：20题'],
    paragraphs: [],
  },
  'stage-deep-intro': {
    badge: '',
    title: '阶段三：深度测评',
    subtitle: '深度分析您的价值观和人格底色',
    artwork: CHAT_STAGES[2].artwork,
    iconSrc: '/explore-static/discover/figma/stage-deep-icon-figma-494-542.svg',
    shadowSrc: '',
    iconClass: 'stage-intro-icon stage-intro-icon--deep-launch',
    iconWrapClass: 'stage-intro-icon-wrap stage-intro-icon-wrap--deep-launch',
    primaryLabel: '点击测试',
    metrics: ['预计时长：大约8分钟', `题目数量：约${30 + FINAL_CAREER_CALIBRATION_QUESTION_IDS.length}道题`],
    paragraphs: [],
  },
}
const currentStageIntro = computed(() => {
  return stageIntroConfigs[currentScreenId.value] || {
    badge: '阶段',
    title: '',
    subtitle: '',
    artwork: '',
    iconSrc: '',
    shadowSrc: '',
    iconClass: '',
    iconWrapClass: '',
    primaryLabel: '开始',
    metrics: [],
    paragraphs: [],
  }
})
const abilityOverviewConfigs = {
}
const currentAbilityOverview = computed(() => (
  abilityOverviewConfigs[currentScreenId.value] || {
    title: '',
    subtitle: '',
    artwork: '',
    paragraphs: [],
    modules: [],
    primaryLabel: '下一步',
  }
))
const phaseLabel = computed(() => {
  const idx = showComplete.value
    ? CHAT_STAGES.length - 1
    : getScreenStageIndex(currentScreenId.value)
  return CHAT_STAGES[idx]?.label || CHAT_STAGES[0].label
})
const showStageArtwork = computed(() => {
  if (!q.value || isCurrentBatchScreen.value) return false
  if (q.value.id === 'basic-profile') return false
  return q.value.type !== 'interest-tag-grid'
    && q.value.type !== 'career-scenario'
    && q.value.type !== 'holland-fine-grained'
})
const isPrimaryDisabled = computed(() => (
  finishing.value
  || (isPersonalityStageIntro.value && mbtiChoice.value === 'known' && !selectedMbtiType.value)
))
const stageArtworkPath = computed(() => {
  if (showComplete.value) return CHAT_STAGES[CHAT_STAGES.length - 1]?.artwork || CHAT_STAGES[3].artwork
  return getQuestionStageArtwork(q.value)
})
const questionImagePath = computed(() => (q.value && q.value.imageSrc) || '')
const puzzleImagePath = computed(() => {
  if (!q.value || !q.value.abilityPuzzle || !q.value.abilityPuzzle.imageSrc) return ''
  return q.value.abilityPuzzle.imageSrc
})
const careerFirstImagePath = computed(() => {
  const scenario = q.value && q.value.careerScenario
  if (!scenario) return ''
  return scenario.sceneImageSrc || q.value.imageSrc || ''
})
const careerItemImagePath = computed(() => {
  const scenario = q.value && q.value.careerScenario
  if (!scenario) return ''
  return scenario.itemImageSrc || scenario.sceneImageSrc || q.value.imageSrc || ''
})
const careerOpenImagePath = computed(() => {
  const scenario = q.value && q.value.careerScenario
  if (!scenario) return ''
  return scenario.openImageSrc || scenario.itemImageSrc || scenario.sceneImageSrc || q.value.imageSrc || ''
})
const isCareerSingleSceneImage = computed(() => {
  const scenario = q.value && q.value.careerScenario
  return Boolean(scenario && scenario.sceneImageMode === 'single')
})
const showCareerItemScene = computed(() => !isCareerSingleSceneImage.value)
const showCareerOpenScene = computed(() => !isCareerSingleSceneImage.value)
const careerTeamTitle = computed(() => {
  const scenario = q.value && q.value.careerScenario
  if (!scenario) return ''
  return scenario.teamPrompt || (scenario.openScene ? scenario.openPrompt : '你最希望接下来做些什么？')
})
const hasCareerOpenFieldErrors = computed(() => (
  Object.keys(careerFieldErrors.value).some((fieldId) => (
    fieldId !== 'firstChoiceId'
    && fieldId !== 'itemChoiceIds'
    && fieldId !== 'teamChoiceId'
  ))
))
const careerRankMaxSelections = computed(() => {
  const scenario = q.value && q.value.careerScenario
  return scenario ? scenario.itemMaxSelections : 0
})
const rankGhostStyleStr = computed(() => {
  return `top:${rankGhostTop.value}px;left:${rankGhostLeft.value}px;width:${rankGhostWidth.value}px;`
})
const isOptionListType = computed(() => {
  const current = q.value
  if (!current) return false
  return current.type === 'card-select'
    || current.type === 'career-calibration-scale'
    || current.type === 'scenario-pair'
    || current.type === 'multi-select'
})
const currentStageIntroScreenIndex = computed(() => {
  if (showComplete.value || isBasicProfileScreen.value || isCurrentStageIntro.value) return null
  const stageIndex = getScreenStageIndex(currentScreenId.value)
  if (stageIndex === 0) return getScreenIndexById('stage-personality-intro')
  if (stageIndex === 1) return getScreenIndexById('stage-holland-intro')
  if (stageIndex === 2) return getScreenIndexById('stage-deep-intro')
  return null
})
const currentStageFirstQuestionScreenIndex = computed(() => {
  const introIndex = currentStageIntroScreenIndex.value
  if (typeof introIndex !== 'number') return null
  const answers = sessionAnswers.value || []
  const firstIndex = findNextRenderableScreenIndex(introIndex + 1, answers)
  return firstIndex >= 0 ? firstIndex : null
})
const isPreviousDisabled = computed(() => (
  finishing.value
  || currentStageIntroScreenIndex.value === null
  || screenIndex.value <= currentStageIntroScreenIndex.value
))

function careerItemLabel(optionId) {
  const scenario = q.value && q.value.careerScenario
  const option = scenario && scenario.itemOptions
    ? scenario.itemOptions.find((item) => item.id === optionId)
    : null
  return option ? option.label : ''
}

function isCareerItemPicked(optionId) {
  return careerVal.value.itemChoiceIds.includes(optionId)
}

function hollandFineSelected(itemId) {
  const answerItem = hollandFineVal.value.items?.[itemId]
  return Array.isArray(answerItem?.selectedOptionIds) ? (answerItem.selectedOptionIds[0] || '') : ''
}

function hollandFineSelectedIds(itemId) {
  const answerItem = hollandFineVal.value.items?.[itemId]
  return Array.isArray(answerItem?.selectedOptionIds) ? answerItem.selectedOptionIds : []
}

function hollandFineOptionSelected(itemId, optionId) {
  return hollandFineSelectedIds(itemId).includes(optionId)
}

function getHollandFineMaxSelections(item) {
  return item?.maxSelections ?? (item?.mode === 'primary-secondary' ? 2 : 1)
}

function getHollandFineItemMeta(item) {
  if (!item) return ''
  if (item.mode === 'ranked' || item.mode === 'multi') return `选 ${getHollandFineMaxSelections(item)} 项`
  if (item.mode === 'primary-secondary') return '可选 1-2 项'
  return ''
}

function getHollandFineItemHelper(item) {
  if (!item) return ''
  if (item.mode === 'primary-secondary') return '先选最像你的一项；如果两项都像，可以再选第二项。'
  if (item.mode === 'ranked') return '点击顺序即排序。'
  if (item.mode === 'multi') return '请选择最符合你的几项。'
  if (item.mode === 'scale-pair') return '在 A 与 B 之间选择你的接近程度。'
  return ''
}

function hollandFineOptionPrefix(item, optionId, optionIndex) {
  const selectedIndex = hollandFineSelectedIds(item.id).indexOf(optionId)
  if ((item.mode === 'ranked' || item.mode === 'multi' || item.mode === 'primary-secondary') && selectedIndex >= 0) {
    return String(selectedIndex + 1)
  }
  return chr(optionIndex)
}

function hollandFineSelectionCount(itemId) {
  return hollandFineSelectedIds(itemId).length
}

function hollandFineOpenResponse(itemId, fieldId) {
  const answerItem = hollandFineVal.value.items?.[itemId]
  return typeof answerItem?.openResponses?.[fieldId] === 'string' ? answerItem.openResponses[fieldId] : ''
}

function hollandFineItemImage(item, itemIndex) {
  void itemIndex
  return item?.sceneImageSrc || q.value?.imageSrc || ''
}

const rankDragIndex = ref(-1)
const rankDragStartX = ref(0)
const rankDragStartY = ref(0)
const rankDragMoved = ref(false)
const rankDragOverPool = ref(false)
const rankDragGhostVisible = ref(false)
const rankDropTargetIndex = ref(-1)
const rankSlotRects = ref([])
const rankContainerRect = ref(null)
const rankItemPoolRect = ref(null)
const rankGhostTop = ref(0)
const rankGhostLeft = ref(0)
const rankGhostWidth = ref(0)
const rankGhostHeight = ref(0)
const rankTouchOffsetX = ref(0)
const rankTouchOffsetY = ref(0)

function profileText(fieldId) {
  const v = pfFields.value[fieldId]
  return typeof v === 'string' ? v : ''
}

function isProfileTextFilled(fieldId) {
  return profileText(fieldId).trim().length > 0
}

function profileSingle(fieldId) {
  const v = pfFields.value[fieldId]
  return typeof v === 'string' ? v : ''
}

function profileMulti(fieldId) {
  const v = pfFields.value[fieldId]
  return Array.isArray(v) ? v : []
}

function profileMultiCount(fieldId) {
  return profileMulti(fieldId).length
}

function clearValidation() {
  screenValidationMessage.value = ''
  profileFieldErrors.value = {}
  questionValidations.value = {}
  careerFieldErrors.value = {}
  hollandFineFieldErrors.value = {}
}

function applyScrollTop(top) {
  const value = Math.max(0, Math.round(top))
  scrollTop.value = value <= 0 ? 0 : value + 0.01
  nextTick(() => {
    scrollTop.value = value
  })
}

function resetScrollPosition() {
  scrollIntoView.value = ''
  applyScrollTop(0)
}

function scrollToAnchor(anchorId, options) {
  if (!anchorId) return
  const opts = options || {}
  const delay = typeof opts.delay === 'number' ? opts.delay : 0
  const offset = typeof opts.offset === 'number' ? opts.offset : SCROLL_OFFSET_PX
  setTimeout(() => {
    const query = uni.createSelectorQuery()
    if (pageInstance && pageInstance.proxy) query.in(pageInstance.proxy)
    query.select('.content').scrollOffset()
    query.select('.content').boundingClientRect()
    query.select(`#${anchorId}`).boundingClientRect()
    query.exec((results) => {
      const scrollOffset = results[0]
      const containerRect = results[1]
      const targetRect = results[2]
      if (!scrollOffset || !containerRect || !targetRect) {
        scrollIntoView.value = ''
        nextTick(() => {
          scrollIntoView.value = anchorId
        })
        return
      }
      const relativeTop = targetRect.top - containerRect.top
      applyScrollTop(scrollOffset.scrollTop + relativeTop - offset)
    })
  }, delay)
}

function scheduleScrollToAnchor(anchorId) {
  scrollToAnchor(anchorId, { delay: SCROLL_AFTER_ANSWER_MS })
}

function normalizeBackNavigationFloorIndex(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return boundedScreenIndex(value, screenTotal)
}

function getScreenIndexById(screenId) {
  const idx = CHAT_SCREEN_ORDER.indexOf(screenId)
  return idx >= 0 ? idx : 0
}

function hasRenderableContent(screenId, answers) {
  if (isStageIntroScreen(screenId)) return true
  return getQuestionsForScreen(screenId, questionMap.value, answers).length > 0
}

function findNextRenderableScreenIndex(startIndex, answers) {
  for (let index = Math.max(0, startIndex); index < screenTotal; index += 1) {
    const screenId = CHAT_SCREEN_ORDER[index]
    if (hasRenderableContent(screenId, answers)) return index
  }
  return -1
}

function findPreviousRenderableScreenIndex(startIndex, answers, minIndex = 0) {
  for (let index = Math.min(screenTotal - 1, startIndex); index >= Math.max(0, minIndex); index -= 1) {
    const screenId = CHAT_SCREEN_ORDER[index]
    if (hasRenderableContent(screenId, answers)) return index
  }
  return -1
}

function focusFirstQuestionInCurrentScreen() {
  const firstQuestion = screenQuestions.value[0]
  if (!firstQuestion || !firstQuestion.id) return
  scrollToAnchor(`anchor-q-${firstQuestion.id}`, { delay: 60, offset: 48 })
}

function jumpToScreenIndex(targetScreenIndex, options) {
  const opts = options || {}
  saveScreenAnswers()
  clearValidation()
  showComplete.value = false

  const previousScreenIndex = boundedScreenIndex(screenIndex.value, screenTotal)
  if (targetScreenIndex < 0) {
    showComplete.value = true
    resetScrollPosition()
    return
  }

  screenIndex.value = targetScreenIndex
  const s = loadDiscoverSession()
  s.currentQuestionIndex = targetScreenIndex
  s.backNavigationFloorIndex = typeof opts.forceBackNavigationFloorIndex === 'number'
    ? normalizeBackNavigationFloorIndex(opts.forceBackNavigationFloorIndex)
    : (
      targetScreenIndex < previousScreenIndex
        ? targetScreenIndex
        : null
    )
  backNavigationFloorIndex.value = normalizeBackNavigationFloorIndex(s.backNavigationFloorIndex)
  s.phase = 'chatting'
  saveDiscoverSession(s)
  loadScreen(s)
  resetScrollPosition()
}

function stageProgressNodeState(stageIndex) {
  if (showComplete.value && stageIndex >= progressStageNodes.value.length - 1) return 'active'
  if (stageIndex < activeProgressStageIndex.value) return 'completed'
  if (stageIndex === activeProgressStageIndex.value) return 'active'
  return 'pending'
}

function stageProgressClickable(stageIndex) {
  return stageIndex >= 0
    && stageIndex < progressStageSegmentCount.value
    && stageIndex < completedProgressStageCount.value
}

function stageProgressSegmentWidth(stageIndex) {
  if (showComplete.value || stageIndex < activeProgressStageIndex.value) return '100%'
  if (stageIndex > activeProgressStageIndex.value) return '0%'
  return `${Math.round(activeStageScreenFraction.value * 100)}%`
}

function getStageProgressTargetIndex(stageIndex) {
  if (stageIndex === 0) return getScreenIndexById('stage-personality-intro')
  if (stageIndex === 1) return getScreenIndexById('stage-holland-intro')
  if (stageIndex === 2) return getScreenIndexById('stage-deep-intro')
  return -1
}

function handleStageProgressTap(stageIndex) {
  if (!stageProgressClickable(stageIndex)) return
  const targetIndex = getStageProgressTargetIndex(stageIndex)
  if (targetIndex < 0) return
  jumpToScreenIndex(targetIndex, {
    forceBackNavigationFloorIndex: targetIndex,
  })
}

function goToNextScreen() {
  if (finishing.value || showComplete.value) return
  if (!validateCurrentScreen()) return
  const savedSession = saveScreenAnswers()
  const nextScreenIndex = findNextRenderableScreenIndex(screenIndex.value + 1, savedSession.answers || [])
  if (nextScreenIndex < 0 || nextScreenIndex >= screenTotal) {
    showComplete.value = true
    resetScrollPosition()
    return
  }
  const s = loadDiscoverSession()
  s.currentQuestionIndex = nextScreenIndex
  s.backNavigationFloorIndex = backNavigationFloorIndex.value
  saveDiscoverSession(s)
  screenIndex.value = nextScreenIndex
  loadScreen(s)
  resetScrollPosition()
}

function scrollToNextBatchQuestion(questionId) {
  const sqs = screenQuestions.value
  const idx = sqs.findIndex((item) => item.id === questionId)
  if (idx < 0 || idx >= sqs.length - 1) return false
  scheduleScrollToAnchor(`anchor-q-${sqs[idx + 1].id}`)
  return true
}

function scrollToNextProfileField(fieldId) {
  const fields = (q.value && q.value.profileFields) || []
  const idx = fields.findIndex((field) => field.id === fieldId)
  if (idx < 0 || idx >= fields.length - 1) return
  scheduleScrollToAnchor(`anchor-field-${fields[idx + 1].id}`)
}

function afterBatchAnswer(questionId) {
  scrollToNextBatchQuestion(questionId)
}

function afterCareerFirstChoice() {
  scheduleScrollToAnchor('anchor-career-items')
}

function afterCareerItemsComplete() {
  scheduleScrollToAnchor('anchor-career-team')
}

function afterCareerTeamChoice() {
  const fields = (q.value && q.value.careerScenario && q.value.careerScenario.openFields) || []
  if (fields.length) scheduleScrollToAnchor(`anchor-career-open-${fields[0].id}`)
}

function scrollToNextHollandFineItem(itemId) {
  const items = (q.value && q.value.hollandFine && q.value.hollandFine.items) || []
  const idx = items.findIndex((item) => item.id === itemId)
  if (idx < 0) return false
  for (let nextIndex = idx + 1; nextIndex < items.length; nextIndex += 1) {
    const nextItem = items[nextIndex]
    if (!nextItem || !nextItem.id) continue
    if (isHollandFineItemComplete(nextItem, hollandFineVal.value.items?.[nextItem.id])) continue
    scheduleScrollToAnchor(`anchor-hf-${nextItem.id}`)
    return true
  }
  return false
}

function afterHollandFineAnswer(itemId) {
  scrollToNextHollandFineItem(itemId)
}

function validateCurrentScreen() {
  clearValidation()
  const entries = []

  if (isCurrentBatchScreen.value) {
    for (const question of screenQuestions.value) {
      const val = batchValues.value[question.id] || ''
      entries.push({
        question,
        value: val,
        validation: validateAnswer(question, val),
      })
    }
  } else if (q.value) {
    entries.push({
      question: q.value,
      value: getVal(),
      validation: validateAnswer(q.value, getVal()),
    })
  }

  const firstInvalid = entries.find((entry) => !entry.validation.valid)
  if (!firstInvalid) return true

  screenValidationMessage.value = firstInvalid.validation.message || '请完成本题。'

  if (firstInvalid.question.type === 'profile-form') {
    profileFieldErrors.value = firstInvalid.validation.fieldErrors || {}
    const fieldErrors = firstInvalid.validation.fieldErrors || {}
    const firstField = (firstInvalid.question.profileFields || []).find((field) => fieldErrors[field.id])
    scrollToAnchor(firstField ? `anchor-field-${firstField.id}` : getValidationAnchorId(firstInvalid.question, fieldErrors), { delay: 120, offset: 48 })
  } else if (firstInvalid.question.type === 'career-scenario') {
    careerFieldErrors.value = firstInvalid.validation.fieldErrors || {}
    scrollToAnchor(getValidationAnchorId(firstInvalid.question, firstInvalid.validation.fieldErrors), { delay: 120, offset: 48 })
  } else if (firstInvalid.question.type === 'holland-fine-grained') {
    hollandFineFieldErrors.value = firstInvalid.validation.fieldErrors || {}
    scrollToAnchor(getValidationAnchorId(firstInvalid.question, firstInvalid.validation.fieldErrors), { delay: 120, offset: 48 })
  } else {
    const invalidMap = {}
    for (const entry of entries) {
      if (!entry.validation.valid) invalidMap[entry.question.id] = entry.validation
    }
    questionValidations.value = invalidMap
    scrollToAnchor(getValidationAnchorId(firstInvalid.question, firstInvalid.validation.fieldErrors), { delay: 120, offset: 48 })
  }

  return false
}

function clearProfileFieldError(fieldId) {
  if (!profileFieldErrors.value[fieldId]) return
  const next = Object.assign({}, profileFieldErrors.value)
  delete next[fieldId]
  profileFieldErrors.value = next
  if (!Object.keys(next).length) screenValidationMessage.value = ''
}

function clearQuestionValidation(questionId) {
  if (!questionValidations.value[questionId]) return
  const next = Object.assign({}, questionValidations.value)
  delete next[questionId]
  questionValidations.value = next
  if (!Object.keys(next).length) screenValidationMessage.value = ''
}

function clearCareerFieldError(fieldKey) {
  if (!careerFieldErrors.value[fieldKey]) return
  const next = Object.assign({}, careerFieldErrors.value)
  delete next[fieldKey]
  careerFieldErrors.value = next
  if (!Object.keys(next).length) screenValidationMessage.value = ''
}

function clearHollandFineFieldError(itemId, fieldId) {
  const fieldKey = fieldId ? `${itemId}.${fieldId}` : ''
  const relatedKeys = Object.keys(hollandFineFieldErrors.value).filter((key) => {
    if (fieldKey) return key === fieldKey
    return key === itemId || key.startsWith(`${itemId}.`)
  })
  if (!relatedKeys.length) return
  const next = Object.assign({}, hollandFineFieldErrors.value)
  for (const key of relatedKeys) delete next[key]
  hollandFineFieldErrors.value = next
  if (!Object.keys(next).length) screenValidationMessage.value = ''
}

function emptyProfileFields(question) {
  const fields = {}
  for (const field of question.profileFields || []) {
    if (field.type === 'multi') fields[field.id] = []
    else fields[field.id] = ''
  }
  return fields
}

function bootstrapPage(options = {}) {
  if (!questions.value.length) {
    uni.showToast({ title: '题库加载失败，请重新编译', icon: 'none' })
    return
  }
  const session = loadDiscoverSession()
  sessionAnswers.value = Array.isArray(session.answers) ? session.answers.slice() : []
  backNavigationFloorIndex.value = normalizeBackNavigationFloorIndex(session.backNavigationFloorIndex)
  if (!options.skipResultsRedirect && session.phase === 'results' && session.profile) {
    uni.redirectTo({ url: '/pages/discover/results' })
    return
  }
  screenIndex.value = boundedScreenIndex(session.currentQuestionIndex, screenTotal)
  loadScreen(session)
}

function normalizeBooleanOption(value) {
  return value === '1' || value === 'true'
}

async function ensureBackendSessionReady() {
  await ensureExploreSessionId()
}

function forceStartFromBasicProfile() {
  const session = loadDiscoverSession()
  const nextSession = {
    ...session,
    phase: 'chatting',
    currentQuestionIndex: 0,
    backNavigationFloorIndex: null,
  }
  saveDiscoverSession(nextSession)
}

const STAGE_INTRO_SCREEN_IDS = new Set([
  'stage-personality-intro',
  'stage-holland-intro',
  'stage-deep-intro',
])

async function prepareChatEntry(options) {
  entryPrepared.value = false
  const shouldRetake = normalizeBooleanOption(options && options.retake)
  const shouldStartFromBasic = normalizeBooleanOption(options && options.start)
  const targetScreen = options && options.screen ? String(options.screen) : ''
  const skipResultsRedirect = STAGE_INTRO_SCREEN_IDS.has(targetScreen) || targetScreen === 'complete'

  try {
    uni.showLoading({ title: '正在连接后端...' })
    if (shouldRetake) {
      await restart({ silent: true })
      bootstrapPage({ skipResultsRedirect: true })
    } else {
      await ensureBackendSessionReady()
      if (shouldStartFromBasic) {
        forceStartFromBasicProfile()
      }
      bootstrapPage({ skipResultsRedirect })
    }

    if (targetScreen === 'complete') {
      jumpToScreenIndex(-1)
    } else if (targetScreen) {
      const targetIndex = getScreenIndexById(targetScreen)
      if (targetIndex >= 0) {
        jumpToScreenIndex(targetIndex)
      }
    }
  } catch (error) {
    uni.showToast({
      title: (error && error.message) || '后端会话初始化失败',
      icon: 'none',
    })
  } finally {
    uni.hideLoading()
    entryPrepared.value = true
  }
}

function loadScreen(session) {
  const s = session || loadDiscoverSession()
  sessionAnswers.value = Array.isArray(s.answers) ? s.answers.slice() : []
  const knownTypeAnswer = (s.answers || []).find((answer) => answer.questionId === MBTI_KNOWN_QUESTION_ID)
  const knownType = typeof knownTypeAnswer?.value === 'string' ? knownTypeAnswer.value.trim().toUpperCase() : ''
  if (isCurrentStageIntro.value) {
    if (MBTI_TYPES.includes(knownType)) {
      mbtiChoice.value = 'known'
      selectedMbtiType.value = knownType
    } else {
      mbtiChoice.value = 'unknown'
      selectedMbtiType.value = ''
    }
    q.value = null
    batchValues.value = {}
    pfFields.value = {}
    singleVal.value = ''
    textVal.value = ''
    slideVal.value = 50
    multiVal.value = []
    tagOpts.value = []
    opts.value = []
    careerVal.value = createEmptyCareerScenarioAnswer()
    hollandFineVal.value = { items: {} }
    clearValidation()
    ready.value = isPersonalityStageIntro.value ? (mbtiChoice.value === 'unknown' || !!selectedMbtiType.value) : true
    primaryLabel.value = currentStageIntro.value.primaryLabel
    resetScrollPosition()
    return
  }
  if (isCurrentAbilityOverview.value) {
    q.value = null
    batchValues.value = {}
    pfFields.value = {}
    singleVal.value = ''
    textVal.value = ''
    slideVal.value = 50
    multiVal.value = []
    tagOpts.value = []
    opts.value = []
    careerVal.value = createEmptyCareerScenarioAnswer()
    hollandFineVal.value = { items: {} }
    clearValidation()
    ready.value = true
    primaryLabel.value = currentAbilityOverview.value.primaryLabel
    resetScrollPosition()
    return
  }
  let sqs = screenQuestions.value
  if (!sqs.length) {
    const fallbackIndex = findNextRenderableScreenIndex(screenIndex.value, s.answers || [])
    if (fallbackIndex >= 0 && fallbackIndex !== screenIndex.value) {
      screenIndex.value = fallbackIndex
      s.currentQuestionIndex = fallbackIndex
      saveDiscoverSession(s)
      sqs = screenQuestions.value
    }
    if (!sqs.length) {
      showComplete.value = true
      resetScrollPosition()
      return
    }
  }

  const screenId = currentScreenId.value

  if (isBatchScreen(screenId)) {
    const vals = {}
    for (const question of sqs) {
      const val = getInitialAnswerValue(question, s.answers || [])
      vals[question.id] = typeof val === 'string' ? val : ''
    }
    batchValues.value = vals
    q.value = sqs[0]
    pfFields.value = {}
    singleVal.value = ''
    textVal.value = ''
    slideVal.value = 50
    multiVal.value = []
    tagOpts.value = []
    opts.value = []
    careerVal.value = createEmptyCareerScenarioAnswer()
    hollandFineVal.value = { items: {} }
    clearValidation()
    checkReady()
    resetScrollPosition()
    return
  }

  batchValues.value = {}
  const current = sqs[0]
  q.value = current
  const val = getInitialAnswerValue(current, s.answers || [])

  if (current.type === 'profile-form') {
    pfFields.value = Object.assign(emptyProfileFields(current), (val && val.fields) ? val.fields : {})
  } else {
    pfFields.value = {}
  }

  singleVal.value = typeof val === 'string' ? val : ''
  textVal.value = val && val.text ? val.text : ''
  slideVal.value = typeof val === 'number' ? val : 50
  multiVal.value = Array.isArray(val) ? val.slice() : []
  if (current.type === 'career-scenario') {
    careerVal.value = isCareerScenarioValue(val)
      ? {
          firstChoiceId: val.firstChoiceId || '',
          itemChoiceIds: Array.isArray(val.itemChoiceIds) ? val.itemChoiceIds.slice() : [],
          teamChoiceId: val.teamChoiceId || '',
          openResponses: Object.assign({}, createEmptyCareerScenarioAnswer().openResponses, val.openResponses || {}),
          aiDialogue: val.aiDialogue || createEmptyCareerScenarioAnswer().aiDialogue,
        }
      : createEmptyCareerScenarioAnswer()
  } else {
    careerVal.value = createEmptyCareerScenarioAnswer()
  }
  if (current.type === 'holland-fine-grained') {
    hollandFineVal.value = isHollandFineAnswerValue(val)
      ? {
          items: Object.fromEntries(
            Object.entries(val.items || {}).map(([itemId, itemValue]) => [
              itemId,
              {
                selectedOptionIds: Array.isArray(itemValue?.selectedOptionIds) ? itemValue.selectedOptionIds.slice() : [],
                openResponses: Object.assign({}, itemValue?.openResponses || {}),
              },
            ]),
          ),
        }
      : createEmptyHollandFineAnswer(current)
  } else {
    hollandFineVal.value = { items: {} }
  }

  buildOpts()
  buildTagOpts()
  clearValidation()
  checkReady()
  resetScrollPosition()
}

function buildTagOpts() {
  const current = q.value
  if (!current || current.type !== 'interest-tag-grid') {
    tagOpts.value = []
    return
  }
  tagOpts.value = (current.options || []).map((o) => ({
    id: o.id,
    label: o.label,
    iconPath: o.iconSrc || '',
    selected: multiVal.value.includes(o.id),
  }))
}

function buildOpts() {
  const current = q.value
  if (!current) return
  let raw = []
  if (current.type === 'scenario-pair' && current.scenarioPair) {
    raw = [current.scenarioPair.optionA, current.scenarioPair.optionB].filter(Boolean)
  } else {
    raw = current.options || []
  }
  opts.value = raw.map((o) => {
    let cls = ''
    if (current.type === 'multi-select') cls = multiVal.value.includes(o.id) ? 'opt--on' : ''
    else cls = singleVal.value === o.id ? 'opt--on' : ''
    return { id: o.id, label: o.label, cls }
  })
}

function checkReady() {
  if (isCurrentStageIntro.value) {
    ready.value = !isPersonalityStageIntro.value || mbtiChoice.value === 'unknown' || !!selectedMbtiType.value
    primaryLabel.value = currentStageIntro.value.primaryLabel
    return
  }
  if (isCurrentAbilityOverview.value) {
    ready.value = true
    primaryLabel.value = currentAbilityOverview.value.primaryLabel
    return
  }
  if (isCurrentBatchScreen.value) {
    const sqs = screenQuestions.value
    ready.value = sqs.length > 0 && sqs.every((question) => {
      const val = batchValues.value[question.id]
      return typeof val === 'string' && val.length > 0
    })
    primaryLabel.value = screenIndex.value >= screenTotal - 1 ? '完成' : '下一步'
    return
  }

  const current = q.value
  if (!current) {
    ready.value = false
    return
  }
  ready.value = isAnswerReady(current, getVal())
  if (current.type === 'holland-fine-grained') {
    primaryLabel.value = '确认'
    return
  }
  primaryLabel.value = screenIndex.value >= screenTotal - 1 ? '完成' : '下一步'
}

function setBatchAnswer(questionId, optionId) {
  batchValues.value = Object.assign({}, batchValues.value, { [questionId]: optionId })
  clearQuestionValidation(questionId)
  checkReady()
  afterBatchAnswer(questionId)
}

function setHollandFineSingle(itemId, optionId) {
  const nextItems = Object.assign({}, hollandFineVal.value.items || {})
  nextItems[itemId] = Object.assign({}, nextItems[itemId] || {}, { selectedOptionIds: [optionId] })
  hollandFineVal.value = { items: nextItems }
  clearHollandFineFieldError(itemId)
  checkReady()
  afterHollandFineAnswer(itemId)
}

function isHollandFineItemComplete(item, itemValue) {
  if (!item) return false
  if (item.mode === 'open') {
    return (item.openFields || []).every((field) => {
      const minLength = field.minLength ?? 1
      const text = itemValue?.openResponses?.[field.id] || ''
      return typeof text === 'string' && text.trim().length >= minLength
    })
  }
  const selectedCount = Array.isArray(itemValue?.selectedOptionIds) ? itemValue.selectedOptionIds.length : 0
  const minSelections = item.minSelections ?? 1
  return selectedCount >= minSelections && selectedCount <= getHollandFineMaxSelections(item)
}

function setHollandFineOption(item, optionId) {
  if (!item || !item.id) return
  if (item.mode === 'single' || item.mode === 'scale-pair') {
    setHollandFineSingle(item.id, optionId)
    return
  }

  const nextItems = Object.assign({}, hollandFineVal.value.items || {})
  const currentItem = Object.assign({}, nextItems[item.id] || {})
  const selectedIds = Array.isArray(currentItem.selectedOptionIds) ? currentItem.selectedOptionIds.slice() : []
  const maxSelections = getHollandFineMaxSelections(item)
  let nextSelected

  if (selectedIds.includes(optionId)) {
    nextSelected = selectedIds.filter((id) => id !== optionId)
  } else if (selectedIds.length < maxSelections) {
    nextSelected = selectedIds.concat(optionId)
  } else if (item.mode === 'primary-secondary' && selectedIds.length >= 1) {
    nextSelected = [selectedIds[0], optionId].slice(0, maxSelections)
  } else {
    nextSelected = selectedIds.slice(1).concat(optionId).slice(0, maxSelections)
  }

  nextItems[item.id] = Object.assign({}, currentItem, { selectedOptionIds: nextSelected })
  hollandFineVal.value = { items: nextItems }
  clearHollandFineFieldError(item.id)
  checkReady()
  if (isHollandFineItemComplete(item, nextItems[item.id])) afterHollandFineAnswer(item.id)
}

function onHollandFineOpenInput(itemId, fieldId, event) {
  const value = event?.detail?.value || ''
  const nextItems = Object.assign({}, hollandFineVal.value.items || {})
  const currentItem = Object.assign({}, nextItems[itemId] || {})
  nextItems[itemId] = Object.assign({}, currentItem, {
    openResponses: Object.assign({}, currentItem.openResponses || {}, { [fieldId]: value }),
  })
  hollandFineVal.value = { items: nextItems }
  clearHollandFineFieldError(itemId, fieldId)
  checkReady()
}

function getVal() {
  const current = q.value
  if (!current) return ''
  if (current.type === 'profile-form') return { fields: { ...pfFields.value } }
  if (current.type === 'multi-select' || current.type === 'interest-tag-grid') return multiVal.value.slice()
  if (current.type === 'free-text') return { text: textVal.value }
  if (current.type === 'slider') return slideVal.value
  if (current.type === 'holland-fine-grained') {
    return {
      items: Object.fromEntries(
        Object.entries(hollandFineVal.value.items || {}).map(([itemId, itemValue]) => [
          itemId,
          {
            selectedOptionIds: Array.isArray(itemValue?.selectedOptionIds) ? itemValue.selectedOptionIds.slice() : [],
            openResponses: Object.assign({}, itemValue?.openResponses || {}),
          },
        ]),
      ),
    }
  }
  if (current.type === 'career-scenario') {
    return {
      firstChoiceId: careerVal.value.firstChoiceId,
      itemChoiceIds: careerVal.value.itemChoiceIds.slice(),
      teamChoiceId: careerVal.value.teamChoiceId,
      openResponses: { ...careerVal.value.openResponses },
      aiDialogue: careerVal.value.aiDialogue,
    }
  }
  return singleVal.value
}

function saveScreenAnswers() {
  let s = loadDiscoverSession()
  if (isCurrentBatchScreen.value) {
    for (const question of screenQuestions.value) {
      s = submitAnswer(s, question.id, batchValues.value[question.id] || '')
    }
  } else if (q.value) {
    s = submitAnswer(s, q.value.id, getVal())
  }
  s.currentQuestionIndex = screenIndex.value
  s.backNavigationFloorIndex = backNavigationFloorIndex.value
  s.phase = 'chatting'
  saveDiscoverSession(s)
  sessionAnswers.value = Array.isArray(s.answers) ? s.answers.slice() : []
  return s
}

function saveKnownMbtiAnswer(type) {
  const nextType = typeof type === 'string' ? type.trim().toUpperCase() : ''
  let s = loadDiscoverSession()
  s.answers = (s.answers || []).filter((item) => item.questionId !== MBTI_KNOWN_QUESTION_ID)
  if (MBTI_TYPES.includes(nextType)) {
    s = submitAnswer(s, MBTI_KNOWN_QUESTION_ID, nextType)
  }
  s.currentQuestionIndex = screenIndex.value
  s.backNavigationFloorIndex = backNavigationFloorIndex.value
  s.phase = 'chatting'
  saveDiscoverSession(s)
  sessionAnswers.value = Array.isArray(s.answers) ? s.answers.slice() : []
  return s
}

function handlePrimary() {
  if (isPrimaryDisabled.value) return
  if (isPersonalityStageIntro.value) {
    if (mbtiChoice.value === 'known') {
      if (!selectedMbtiType.value) return
      saveKnownMbtiAnswer(selectedMbtiType.value)
      jumpToScreenIndex(getScreenIndexById('stage-holland-intro'), {
        forceBackNavigationFloorIndex: getScreenIndexById('stage-personality-intro'),
      })
      return
    }
    saveKnownMbtiAnswer('')
  }
  goToNextScreen()
}

async function generateReport() {
  const session = loadDiscoverSession()
  await finish(session)
}

function goPreviousFromComplete() {
  showComplete.value = false
  loadScreen(null)
}

function goHome() {
  if (!showComplete.value) saveScreenAnswers()
  uni.reLaunch({ url: '/pages/discover/index' })
}

async function finish(session) {
  clearExploreBackendSession()
  clearProfileUploadFlag()
  clearDiscoverReportCache()
  const done = computeDiscoverResults(session)
  clearDiscoverReportCache(done)
  saveDiscoverSession(done)
  finishing.value = true
  try {
    uni.redirectTo({ url: '/pages/discover/results?generate=1' })
  } finally {
    finishing.value = false
  }
}

function goPrevious() {
  if (showComplete.value) {
    goPreviousFromComplete()
    return
  }
  if (isPreviousDisabled.value) return
  if (screenIndex.value <= 0) {
    uni.reLaunch({ url: '/pages/discover/index' })
    return
  }
  const targetScreenIndex = screenIndex.value - 1
  if (backNavigationFloorIndex.value !== null && targetScreenIndex < backNavigationFloorIndex.value) return
  screenIndex.value = targetScreenIndex
  const s = loadDiscoverSession()
  s.currentQuestionIndex = screenIndex.value
  s.backNavigationFloorIndex = backNavigationFloorIndex.value
  saveDiscoverSession(s)
  loadScreen(null)
}

function goPreviousWithinStage() {
  if (showComplete.value) {
    goPreviousFromComplete()
    return
  }
  if (isPreviousDisabled.value) return
  const introIndex = currentStageIntroScreenIndex.value
  const firstQuestionIndex = currentStageFirstQuestionScreenIndex.value
  if (typeof introIndex !== 'number' || introIndex < 0) return
  if (typeof firstQuestionIndex === 'number' && screenIndex.value === firstQuestionIndex) {
    jumpToScreenIndex(introIndex, {
      forceBackNavigationFloorIndex: introIndex,
    })
    return
  }
  const targetScreenIndex = findPreviousRenderableScreenIndex(screenIndex.value - 1, sessionAnswers.value || [], introIndex + 1)
  if (targetScreenIndex >= 0) {
    jumpToScreenIndex(targetScreenIndex, {
      forceBackNavigationFloorIndex: introIndex,
    })
  }
}

async function restart(options) {
  const opts = options || {}
  resetDiscoverSession()
  clearExploreBackendSession()
  clearProfileUploadFlag()
  clearDiscoverReportCache()
  showComplete.value = false
  const s = Object.assign({}, emptyDiscoverSession, { phase: 'chatting' })
  saveDiscoverSession(s)
  await ensureBackendSessionReady()
  sessionAnswers.value = []
  backNavigationFloorIndex.value = null
  screenIndex.value = 0
  loadScreen(s)
  if (!opts.silent) {
    uni.showToast({ title: '已重新开始', icon: 'none' })
  }
}

function setMbtiChoice(choice) {
  mbtiChoice.value = choice
  if (choice === 'known') {
    mbtiPickerOpen.value = !selectedMbtiType.value
  } else {
    selectedMbtiType.value = ''
    mbtiPickerOpen.value = false
  }
  checkReady()
}

function toggleMbtiPicker() {
  if (mbtiChoice.value !== 'known') return
  mbtiPickerOpen.value = !mbtiPickerOpen.value
}

function selectMbtiType(type) {
  selectedMbtiType.value = type
  mbtiPickerOpen.value = false
  checkReady()
}

function getProgressTextRatio(text, minLength) {
  const min = Math.max(1, Number(minLength) || 1)
  const current = typeof text === 'string' ? text.trim().length : 0
  return Math.max(0, Math.min(1, current / min))
}

function getProfileFieldProgress(field, value) {
  if (!field) return 0
  if (field.type === 'text') return getProgressTextRatio(value, field.minLength)
  if (field.type === 'multi') {
    const max = Math.max(1, field.maxSelections || 1)
    return Array.isArray(value) ? Math.max(0, Math.min(1, value.length / max)) : 0
  }
  return typeof value === 'string' && value ? 1 : 0
}

function getCareerScenarioProgress(question, value) {
  const scenario = question && question.careerScenario
  if (!scenario || !value || typeof value !== 'object') return 0
  const maxSelections = Math.max(1, scenario.itemMaxSelections || 1)
  const openFields = Array.isArray(scenario.openFields) ? scenario.openFields : []
  let units = 2 + openFields.length + (Array.isArray(scenario.teamOptions) && scenario.teamOptions.length ? 1 : 0)
  let completed = 0
  if (value.firstChoiceId) completed += 1
  completed += Math.max(0, Math.min(1, (Array.isArray(value.itemChoiceIds) ? value.itemChoiceIds.length : 0) / maxSelections))
  if (Array.isArray(scenario.teamOptions) && scenario.teamOptions.length) {
    if (value.teamChoiceId) completed += 1
  }
  for (const field of openFields) {
    completed += getProgressTextRatio(value.openResponses && value.openResponses[field.id], field.minLength)
  }
  units = Math.max(1, units)
  return Math.max(0, Math.min(1, completed / units))
}

function chr(i) {
  return String.fromCharCode(65 + i)
}

function getVisibleQuestionPrompt(prompt) {
  return String(prompt || '')
    .replace(/^(?:兴趣探索|性格测试|职业测评|能力测试|深度测评)\s*\d+\s*\/\s*\d+\s*[：:]\s*/, '')
    .trim()
}

function onTap(id) {
  if (!q.value) return
  if (q.value.type === 'multi-select') {
    const max = q.value.maxSelections || 3
    const sel = multiVal.value.slice()
    if (sel.includes(id)) multiVal.value = sel.filter((x) => x !== id)
    else if (sel.length < max) multiVal.value = [...sel, id]
    else {
      uni.showToast({ title: `最多选 ${max} 项`, icon: 'none' })
      return
    }
    buildOpts()
    checkReady()
    return
  }
  singleVal.value = id
  clearQuestionValidation(q.value.id)
  buildOpts()
  checkReady()
}

function toggleTag(id) {
  const sel = multiVal.value.slice()
  if (sel.includes(id)) multiVal.value = sel.filter((x) => x !== id)
  else multiVal.value = [...sel, id]
  buildTagOpts()
  checkReady()
}

function onProfileTextInput(fieldId, e) {
  pfFields.value = Object.assign({}, pfFields.value, { [fieldId]: e.detail.value })
  clearProfileFieldError(fieldId)
  checkReady()
}

function setProfileSingle(fieldId, value) {
  pfFields.value = Object.assign({}, pfFields.value, { [fieldId]: value })
  clearProfileFieldError(fieldId)
  checkReady()
  scrollToNextProfileField(fieldId)
}

function toggleProfileMulti(fieldId, optionId, max) {
  const cur = profileMulti(fieldId).slice()
  let next
  if (cur.includes(optionId)) next = cur.filter((x) => x !== optionId)
  else if (cur.length < max) next = [...cur, optionId]
  else {
    uni.showToast({ title: `最多选 ${max} 项`, icon: 'none' })
    return
  }
  pfFields.value = Object.assign({}, pfFields.value, { [fieldId]: next })
  if (next.length === max) clearProfileFieldError(fieldId)
  checkReady()
  if (next.length === max) scrollToNextProfileField(fieldId)
}

function onTextInput(e) {
  textVal.value = e.detail.value
  checkReady()
}

function onSliderChange(e) {
  slideVal.value = e.detail.value
  checkReady()
}

function careerOpenText(fieldId) {
  return careerVal.value.openResponses[fieldId] || ''
}

function careerRankSlotOptionId(slotIndex) {
  return careerVal.value.itemChoiceIds[slotIndex] || ''
}

function careerRankSlotLabel(slotIndex) {
  return careerItemLabel(careerRankSlotOptionId(slotIndex))
}

function measureRankArea() {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery()
    if (pageInstance && pageInstance.proxy) query.in(pageInstance.proxy)
    query.select('.career-rank-selected').boundingClientRect()
    query.selectAll('.career-rank-selected .career-rank-slot-wrap').boundingClientRect()
    query.select('.career-item-pool').boundingClientRect()
    query.exec((res) => {
      rankContainerRect.value = res && res[0] ? res[0] : null
      rankSlotRects.value = res && Array.isArray(res[1]) ? res[1] : []
      rankItemPoolRect.value = res && res[2] ? res[2] : null
      resolve(rankSlotRects.value)
    })
  })
}

function isTouchInItemPool(y) {
  const pool = rankItemPoolRect.value
  if (pool) return y >= pool.top - 12 && y <= pool.bottom + 12
  const container = rankContainerRect.value
  return container ? y > container.bottom + 24 : false
}

function updateRankGhostPosition(touch) {
  if (!touch) return
  const touchX = touch.clientX
  const touchY = touch.clientY
  let top = touchY - rankTouchOffsetY.value
  let left = touchX - rankTouchOffsetX.value
  const container = rankContainerRect.value
  const ghostHeight = rankGhostHeight.value || 0
  const ghostWidth = rankGhostWidth.value || 0

  if (isTouchInItemPool(touchY)) {
    rankDragOverPool.value = true
    if (container) {
      left = Math.max(container.left, Math.min(container.right - ghostWidth, left))
    }
  } else {
    rankDragOverPool.value = false
    if (container) {
      top = Math.max(container.top, Math.min(container.bottom - ghostHeight, top))
      left = Math.max(container.left, Math.min(container.right - ghostWidth, left))
    }
  }

  rankGhostTop.value = top
  rankGhostLeft.value = left
}

function getRankSlotIndexFromPoint(x, y) {
  const rects = rankSlotRects.value
  if (!rects.length) return -1
  for (let i = 0; i < rects.length; i += 1) {
    const rect = rects[i]
    if (!rect) continue
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return i
  }
  for (let i = 0; i < rects.length; i += 1) {
    const rect = rects[i]
    if (!rect) continue
    const middleY = rect.top + (rect.height || 0) / 2
    if (y < middleY) return i
  }
  return rects.length - 1
}

function getRankDropTarget(x, y) {
  if (!rankSlotRects.value.length || rankDragOverPool.value) return -1
  const container = rankContainerRect.value
  if (container && (y < container.top || y > container.bottom)) return -1
  return getRankSlotIndexFromPoint(x, y)
}

function getTouchClientY(touch) {
  return touch ? touch.clientY : rankDragStartY.value
}

function getTouchClientX(touch) {
  return touch ? touch.clientX : rankDragStartX.value
}

function shouldMarkRankDragMoved(dx, dy) {
  return Math.abs(dx) > 10 || Math.abs(dy) > 10
}

function isRankReorderTargetValid(target, index) {
  return target >= 0 && target !== index
}

function getRankTouchDelta(touch) {
  return {
    dx: getTouchClientX(touch) - rankDragStartX.value,
    dy: getTouchClientY(touch) - rankDragStartY.value,
  }
}

function resolveRankTouchMove(touch) {
  if (rankDragIndex.value < 0) return
  const { dx, dy } = getRankTouchDelta(touch)
  if (shouldMarkRankDragMoved(dx, dy)) rankDragMoved.value = true

  updateRankGhostPosition(touch)
  const touchX = getTouchClientX(touch)
  const touchY = getTouchClientY(touch)
  rankDropTargetIndex.value = getRankDropTarget(touchX, touchY)
}

function resolveRankTouchEnd(index, touch) {
  const touchX = getTouchClientX(touch)
  const touchY = getTouchClientY(touch)
  if (rankDragOverPool.value || isTouchInItemPool(touchY)) {
    clearCareerRankSlot(index)
    return
  }
  const target = getRankDropTarget(touchX, touchY)
  if (rankDragMoved.value && isRankReorderTargetValid(target, index)) {
    applyCareerRankDrop(index, target)
  }
}

function resetRankDrag() {
  rankDragIndex.value = -1
  rankDragStartX.value = 0
  rankDragStartY.value = 0
  rankDragMoved.value = false
  rankDragOverPool.value = false
  rankDragGhostVisible.value = false
  rankDropTargetIndex.value = -1
  rankContainerRect.value = null
  rankSlotRects.value = []
  rankItemPoolRect.value = null
  rankGhostTop.value = 0
  rankGhostLeft.value = 0
  rankGhostWidth.value = 0
  rankGhostHeight.value = 0
  rankTouchOffsetX.value = 0
  rankTouchOffsetY.value = 0
}

function onCareerRankSlotTouchStart(index, e) {
  if (!careerRankSlotOptionId(index)) return
  const touch = e.touches && e.touches[0]
  if (!touch) return
  rankDragStartX.value = touch.clientX
  rankDragStartY.value = touch.clientY
  rankDragMoved.value = false
  rankDragOverPool.value = false
  rankDropTargetIndex.value = -1
  rankDragGhostVisible.value = false

  measureRankArea().then(() => {
    const wrap = rankSlotRects.value[index]
    if (!wrap) return
    rankDragIndex.value = index
    rankGhostWidth.value = wrap.width || 0
    rankGhostHeight.value = wrap.height || 0
    rankGhostTop.value = wrap.top
    rankGhostLeft.value = wrap.left
    rankTouchOffsetX.value = touch.clientX - wrap.left
    rankTouchOffsetY.value = touch.clientY - wrap.top
    rankDragGhostVisible.value = true
  })
}

function onCareerItemsTouchMove(e) {
  if (rankDragIndex.value < 0) return
  if (typeof e.preventDefault === 'function') e.preventDefault()
  if (typeof e.stopPropagation === 'function') e.stopPropagation()
  const touch = e.touches && e.touches[0]
  if (!touch) return
  resolveRankTouchMove(touch)
}

function applyCareerRankDrop(sourceIndex, targetIndex) {
  const max = careerRankMaxSelections.value || 4
  const selected = careerVal.value.itemChoiceIds.slice()
  const sourceOption = selected[sourceIndex]
  if (!sourceOption) return
  const boundedTarget = Math.max(0, Math.min(Math.max(selected.length - 1, 0), targetIndex))
  if (boundedTarget === sourceIndex) return

  let next = selected.slice()
  if (boundedTarget < next.length) {
    next[sourceIndex] = next[boundedTarget]
    next[boundedTarget] = sourceOption
  } else {
    next.splice(sourceIndex, 1)
    next.splice(Math.min(boundedTarget, next.length), 0, sourceOption)
    next = next.slice(0, max)
  }
  careerVal.value = Object.assign({}, careerVal.value, { itemChoiceIds: next })
  checkReady()
}

function onCareerRankTouchEnd(e) {
  if (rankDragIndex.value < 0) return
  const index = rankDragIndex.value
  const touch = e.changedTouches && e.changedTouches[0]

  if (rankDragMoved.value) {
    resolveRankTouchEnd(index, touch)
  } else {
    clearCareerRankSlot(index)
  }
  resetRankDrag()
}

function onCareerRankTouchCancel() {
  resetRankDrag()
}

function setCareerFirst(optionId) {
  careerVal.value = Object.assign({}, careerVal.value, { firstChoiceId: optionId })
  clearCareerFieldError('firstChoiceId')
  checkReady()
  afterCareerFirstChoice()
}

function setCareerTeam(optionId) {
  careerVal.value = Object.assign({}, careerVal.value, { teamChoiceId: optionId })
  clearCareerFieldError('teamChoiceId')
  checkReady()
  afterCareerTeamChoice()
}

function toggleCareerItem(optionId) {
  const max = q.value && q.value.careerScenario ? q.value.careerScenario.itemMaxSelections : 4
  const selected = careerVal.value.itemChoiceIds.slice()
  if (selected.includes(optionId)) {
    careerVal.value = Object.assign({}, careerVal.value, {
      itemChoiceIds: selected.filter((id) => id !== optionId),
    })
  } else if (selected.length < max) {
    careerVal.value = Object.assign({}, careerVal.value, {
      itemChoiceIds: [...selected, optionId],
    })
  } else {
    uni.showToast({ title: `最多选 ${max} 组`, icon: 'none' })
    return
  }
  if (careerVal.value.itemChoiceIds.length === max) {
    clearCareerFieldError('itemChoiceIds')
    afterCareerItemsComplete()
  }
  checkReady()
}

function clearCareerRankSlot(index) {
  const selected = careerVal.value.itemChoiceIds.slice()
  if (!selected[index]) return
  selected.splice(index, 1)
  careerVal.value = Object.assign({}, careerVal.value, { itemChoiceIds: selected })
  checkReady()
}

function onCareerOpenInput(fieldId, e) {
  careerVal.value = Object.assign({}, careerVal.value, {
    openResponses: Object.assign({}, careerVal.value.openResponses, { [fieldId]: e.detail.value }),
  })
  clearCareerFieldError(fieldId)
  checkReady()
}

onLoad((options) => {
  updateNavLayout()
  void prepareChatEntry(options || {})
})

onShow(() => {
  updateNavLayout()
  if (!entryPrepared.value) return
  bootstrapPage()
})

onHide(() => {
  if (!entryPrepared.value || showComplete.value) return
  saveScreenAnswers()
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f4eefe 0%, #f7f4ff 14%, #f7f8fb 32%, #f7f8fb 100%);
}
.page--complete {
  background: linear-gradient(180deg, #f1e8fb 0%, #f7f3fb 44%, #eff1f5 100%);
}
.page--basic-profile {
  background: linear-gradient(180deg, #fbfafe 0%, #f6f4fa 36%, #f4f4f5 100%);
}
.page--stage-personality-intro {
  background: linear-gradient(180deg, #e0c9fe 0%, #f4f6f8 38%, #f4f6f8 100%);
}
.page--stage-holland-intro {
  background: linear-gradient(180deg, #e0c9fe 0%, #f4f6f8 38%, #f4f6f8 100%);
}
.page--stage-deep-intro {
  background: linear-gradient(180deg, #e0c9fe 0%, #f4f6f8 38%, #f4f6f8 100%);
}
.topbar {
  display: none;
}
.mp-nav-bar {
  flex-shrink: 0;
  box-sizing: border-box;
  background: transparent;
}
.mp-nav-bar--default {
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(18rpx);
}
.mp-nav-bar--complete {
  background: transparent;
  backdrop-filter: none;
}
.mp-nav-bar--complete .mp-nav-bar__title {
  color: #1c1c3a;
}
.mp-nav-bar--complete .mp-nav-bar__action {
  color: #6b23ff;
}
.page--stage-personality-intro .mp-nav-bar--default {
  background: transparent;
  backdrop-filter: none;
}
.page--stage-holland-intro .mp-nav-bar--default {
  background: transparent;
  backdrop-filter: none;
}
.page--stage-deep-intro .mp-nav-bar--default {
  background: transparent;
  backdrop-filter: none;
}
.mp-nav-bar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8rpx 0 24rpx;
  box-sizing: border-box;
}
.mp-nav-bar__side {
  width: var(--mp-nav-side-width, 96px);
  min-width: var(--mp-nav-side-width, 96px);
  display: flex;
  align-items: center;
  height: 100%;
}
.mp-nav-bar__side--right,
.mp-nav-bar__side--action {
  justify-content: flex-end;
}
.mp-nav-bar__side--right {
  pointer-events: none;
}
.mp-nav-bar__center {
  flex: 1;
  min-width: 0;
  text-align: center;
}
.mp-nav-bar__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
  color: #18181b;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mp-nav-bar__progress {
  display: block;
  margin-top: 4rpx;
  font-size: 20rpx;
  color: #7b8697;
  line-height: 1.2;
}
.mp-nav-bar__action {
  font-size: 24rpx;
  color: #6b23ff;
  font-weight: 700;
  white-space: nowrap;
}
.stage-intro-top-skip {
  position: fixed;
  right: 34rpx;
  top: calc(98rpx + env(safe-area-inset-top));
  z-index: 30;
  min-width: 80rpx;
  height: 50rpx;
  padding: 0 18rpx;
  border-radius: 12rpx;
  background: rgba(151, 98, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.stage-intro-top-skip__text {
  font-size: 22rpx;
  line-height: 1;
  color: #9b7bff;
  font-weight: 700;
}
.question-stage-progress {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 18rpx 24rpx 20rpx;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(18rpx);
  box-sizing: border-box;
}
.page--stage-personality-intro .question-stage-progress {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(18rpx);
}
.page--stage-holland-intro .question-stage-progress {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(18rpx);
}
.page--stage-deep-intro .question-stage-progress {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(18rpx);
}
.question-stage-progress__item {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}
.question-stage-progress__item:last-child {
  flex: 0 0 auto;
}
.question-stage-progress__item--clickable {
  cursor: pointer;
}
.question-stage-progress__dot {
  flex: 0 0 auto;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: background 0.2s ease;
}
.question-stage-progress__dot-core {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #ffffff;
}
.question-stage-progress__item--completed .question-stage-progress__dot,
.question-stage-progress__item--active .question-stage-progress__dot {
  background: #4ee33f;
}
.question-stage-progress__item--clickable .question-stage-progress__dot {
  box-shadow: 0 0 0 5rpx rgba(78, 227, 63, 0.16);
}
.question-stage-progress__bar {
  position: relative;
  flex: 1;
  height: 24rpx;
  margin: 0 10rpx;
  border-radius: 999rpx;
  overflow: hidden;
  background:
    repeating-linear-gradient(
      90deg,
      #dcdcdc 0,
      #dcdcdc 4rpx,
      #f2f2f2 4rpx,
      #f2f2f2 8rpx
    );
}
.question-stage-progress__bar-fill {
  height: 100%;
  border-radius: inherit;
  background: #4ee33f;
  transition: width 0.25s ease;
}
.question-progress-actions {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding: 0 8rpx 8rpx 24rpx;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(18rpx);
  box-sizing: border-box;
}
.page--stage-personality-intro .question-progress-actions,
.page--stage-holland-intro .question-progress-actions,
.page--stage-deep-intro .question-progress-actions {
  background: rgba(255, 255, 255, 0.3);
}
.question-progress-restart {
  min-width: 92rpx;
  height: 58rpx;
  line-height: 56rpx;
  padding: 0 22rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.86);
  color: #a1a1aa;
  font-size: 24rpx;
  font-weight: 500;
}
.question-progress-restart::after {
  border: none;
}
.basic-profile-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rpx 0 34rpx;
}
:deep(.basic-profile-intro__img-wrap) {
  width: 112rpx;
  height: 112rpx;
  min-height: 112rpx;
  margin: 0 auto;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.basic-profile-intro__img-wrap.chat-asset-wrap) {
  width: 112rpx;
}
:deep(.basic-profile-intro__img) {
  width: 112rpx;
  height: 112rpx;
  display: block;
}
.basic-profile-intro__title {
  display: block;
  margin-top: 18rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: #18181b;
  line-height: 1.24;
}
.basic-profile-intro__sub {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #b3b3bb;
  line-height: 1.45;
}
.basic-back-icon {
  width: 22rpx;
  height: 22rpx;
  border-left: 4rpx solid #18181b;
  border-bottom: 4rpx solid #18181b;
  transform: rotate(45deg);
  margin-left: 6rpx;
}
.stage-progress {
  flex-shrink: 0;
  padding: 4rpx 20rpx 12rpx;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(18rpx);
}
.stage-track { position: relative; height: 56rpx; }
.stage-track-bg {
  position: absolute;
  left: 34rpx;
  right: 34rpx;
  top: 22rpx;
  height: 18rpx;
  border-radius: 999rpx;
  background: #ece8f8;
}
.stage-fill {
  position: absolute;
  left: 34rpx;
  top: 22rpx;
  height: 18rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, #e7c2ff, #9762ff);
  transition: width 0.25s ease;
  max-width: calc(100% - 68rpx);
}
.stage-dots { position: relative; display: flex; justify-content: space-between; padding: 0 17rpx; }
.stage-dot-wrap { width: 68rpx; display: flex; justify-content: center; }
.stage-dot-wrap--clickable { cursor: pointer; }
.stage-dot {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: #ddd6f8;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
}
.stage-dot-wrap--clickable .stage-dot { box-shadow: 0 0 0 3rpx rgba(151, 98, 255, 0.18); }
.stage-dot--on { background: #9762ff; }
.stage-diamond { width: 34rpx; height: 34rpx; }
.stage-labels { display: flex; justify-content: space-between; margin-top: 8rpx; }
.stage-label { flex: 1; text-align: center; font-size: 18rpx; font-weight: 700; color: #aaa3b9; line-height: 1.25; }
.stage-label--on { color: #283248; }
.stage-label--clickable { color: #6b23ff; }
.content { flex: 1; height: 0; padding: 8rpx 20rpx 176rpx; box-sizing: border-box; }
.content--basic-profile { padding: 8rpx 30rpx 216rpx; }
.content--stage-holland-intro { padding: 0 24rpx 212rpx; }
.content--stage-deep-intro { padding: 0 24rpx 212rpx; }
.page--stage-personality-intro .content { padding: 0 24rpx 212rpx; }
.question-card {
  background: #fff;
  border-radius: 28rpx;
  padding: 24rpx 22rpx;
  box-shadow: 0 8rpx 32rpx rgba(15,23,42,0.05);
}
.question-card--basic-profile {
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}
.stage-intro-card {
  padding: 28rpx 24rpx 32rpx;
  text-align: center;
  background: linear-gradient(180deg, #ead8ff 0%, #faf7ff 34%, #ffffff 100%);
}
.stage-intro-card--personality,
.stage-intro-card--holland,
.stage-intro-card--deep {
  padding: 34rpx 30rpx 24rpx;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}
.stage-intro-card--personality {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 42rpx 18rpx 24rpx;
  overflow: visible;
}
.stage-intro-card--holland {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  padding: 112rpx 18rpx 24rpx;
}
.stage-intro-card--deep {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  padding: 132rpx 18rpx 24rpx;
}
.stage-intro-skip {
  align-self: flex-end;
  min-width: 106rpx;
  height: 54rpx;
  padding: 0 18rpx;
  border-radius: 16rpx;
  background: rgba(204, 187, 255, 0.56);
  display: flex;
  align-items: center;
  justify-content: center;
}
.stage-intro-skip__text {
  font-size: 28rpx;
  line-height: 1;
  color: #b297ff;
  font-weight: 700;
}
.stage-intro-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(255,255,255,0.92);
  color: #6b23ff;
  font-size: 24rpx;
  font-weight: 700;
}
.stage-intro-title {
  display: block;
  margin-top: 16rpx;
  font-size: 36rpx;
  line-height: 1.4;
  color: #283248;
  font-weight: 700;
}
.stage-intro-card--personality .stage-intro-title,
.stage-intro-card--holland .stage-intro-title,
.stage-intro-card--deep .stage-intro-title {
  margin-top: 40rpx;
  font-size: 52rpx;
  line-height: 1.28;
  color: #293347;
  font-weight: 800;
  letter-spacing: 1rpx;
}
.stage-intro-card--personality .stage-intro-title {
  order: 2;
  margin-top: 8rpx;
  color: #6b23ff;
  font-weight: 700;
  line-height: 1.9;
}
.stage-intro-card--holland .stage-intro-title {
  order: 1;
  margin-top: 0;
  font-size: 38rpx;
  line-height: 1.35;
  color: #293347;
  font-weight: 800;
  letter-spacing: 0;
}
.stage-intro-card--deep .stage-intro-title {
  order: 1;
  margin-top: 0;
  font-size: 38rpx;
  line-height: 1.35;
  color: #293347;
  font-weight: 800;
  letter-spacing: 0;
}
.stage-intro-subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.65;
  color: #5f6b7b;
}
.stage-intro-card--personality .stage-intro-subtitle,
.stage-intro-card--holland .stage-intro-subtitle,
.stage-intro-card--deep .stage-intro-subtitle {
  margin-top: 10rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #666666;
}
.stage-intro-card--personality .stage-intro-subtitle {
  order: 3;
  margin-top: 0;
  font-size: 32rpx;
  line-height: 1.9;
  color: #4b4b4b;
}
.stage-intro-card--holland .stage-intro-subtitle {
  order: 2;
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.45;
  color: #4b4b4b;
  font-weight: 400;
}
.stage-intro-card--deep .stage-intro-subtitle {
  order: 2;
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.45;
  color: #4b4b4b;
  font-weight: 400;
}
.stage-intro-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 132rpx;
  margin-top: 16rpx;
}
.stage-intro-card--personality .stage-intro-hero,
.stage-intro-card--holland .stage-intro-hero,
.stage-intro-card--deep .stage-intro-hero {
  min-height: 330rpx;
  margin-top: 34rpx;
}
.stage-intro-card--personality .stage-intro-hero {
  order: 1;
  width: 100%;
  min-height: 410rpx;
  margin-top: 24rpx;
}
.stage-intro-card--personality .stage-intro-hero::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 55%;
  width: 430rpx;
  height: 246rpx;
  border-radius: 46% 54% 55% 45% / 52% 34% 66% 48%;
  background: #e0e2f1;
  transform: translate(-50%, -50%) rotate(8deg);
  pointer-events: none;
}
.stage-intro-card--holland .stage-intro-hero {
  order: 3;
  width: 100%;
  min-height: 296rpx;
  margin-top: 54rpx;
}
.stage-intro-card--holland .stage-intro-hero::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 58%;
  width: 344rpx;
  height: 194rpx;
  border-radius: 40% 60% 48% 52% / 62% 30% 70% 38%;
  background: #e0e2f1;
  transform: translate(-50%, -50%) rotate(-17deg);
  pointer-events: none;
}
.stage-intro-card--deep .stage-intro-hero {
  order: 3;
  width: 100%;
  min-height: 296rpx;
  margin-top: 54rpx;
}
.stage-intro-card--deep .stage-intro-hero::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 58%;
  width: 344rpx;
  height: 194rpx;
  border-radius: 40% 60% 48% 52% / 62% 30% 70% 38%;
  background: #e0e2f1;
  transform: translate(-50%, -50%) rotate(-17deg);
  pointer-events: none;
}
.stage-intro-icon-wrap {
  width: 180rpx;
  height: 132rpx;
  min-height: 132rpx;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.stage-intro-card--personality .stage-intro-icon-wrap,
.stage-intro-card--holland .stage-intro-icon-wrap,
.stage-intro-card--deep .stage-intro-icon-wrap {
  width: 430rpx;
  height: 280rpx;
  min-height: 280rpx;
  align-items: center;
}
.stage-intro-icon {
  width: 120rpx;
  height: 120rpx;
  display: block;
}
.stage-intro-card--personality .stage-intro-icon,
.stage-intro-card--holland .stage-intro-icon,
.stage-intro-card--deep .stage-intro-icon {
  width: 360rpx;
  height: 260rpx;
}
.stage-intro-card--personality .stage-intro-icon-wrap--personality-launch {
  width: 432rpx;
  height: 352rpx;
  min-height: 352rpx;
  align-items: center;
}
.stage-intro-card--personality .stage-intro-icon--personality-launch {
  width: 340rpx;
  height: 340rpx;
}
.stage-intro-card--holland .stage-intro-icon-wrap--career-launch,
.stage-intro-card--deep .stage-intro-icon-wrap--deep-launch {
  width: 344rpx;
  height: 280rpx;
  min-height: 280rpx;
  align-items: center;
  overflow: visible;
}
.stage-intro-card--holland .stage-intro-icon--career-launch,
.stage-intro-card--deep .stage-intro-icon--deep-launch {
  width: 272rpx;
  height: 272rpx;
}
.stage-intro-icon-wrap--career {
  width: 220rpx;
  height: 156rpx;
  min-height: 156rpx;
}
.stage-intro-icon--career {
  width: 148rpx;
  height: 148rpx;
}
.stage-intro-shadow-wrap {
  position: absolute;
  left: 50%;
  bottom: 6rpx;
  width: 220rpx;
  height: 36rpx;
  min-height: 36rpx;
  transform: translateX(-50%);
}
.stage-intro-card--holland .stage-intro-shadow-wrap {
  bottom: -2rpx;
  width: 244rpx;
  height: 42rpx;
  min-height: 42rpx;
}
.stage-intro-shadow {
  width: 220rpx;
  height: 36rpx;
  display: block;
}
.stage-intro-card--holland .stage-intro-shadow {
  width: 244rpx;
  height: 42rpx;
}
.stage-intro-image-wrap {
  width: 100%;
  min-height: 320rpx;
  border-radius: 28rpx;
  overflow: hidden;
  background: rgba(255,255,255,0.78);
}
.stage-intro-image { width: 100%; height: 320rpx; display: block; }
.stage-intro-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  min-height: 88rpx;
  margin-top: 20rpx;
  padding: 0 22rpx;
  border-radius: 22rpx;
  background: #fff;
  box-shadow: 0 8rpx 16rpx rgba(138,138,138,0.05);
}
.stage-intro-metric {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}
.stage-intro-card--personality .stage-intro-metrics,
.stage-intro-card--holland .stage-intro-metrics,
.stage-intro-card--deep .stage-intro-metrics {
  margin-top: 36rpx;
  min-height: 92rpx;
  padding: 0 28rpx;
  border-radius: 28rpx;
  background: rgba(255,255,255,0.78);
  box-shadow: none;
}
.stage-intro-card--personality .stage-intro-metrics {
  order: 4;
  width: 100%;
  margin-top: 34rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12rpx 34rpx rgba(107, 35, 255, 0.08);
}
.stage-intro-card--holland .stage-intro-metrics {
  order: 4;
  width: 100%;
  max-width: 620rpx;
  margin-top: 40rpx;
  min-height: 92rpx;
  padding: 0 28rpx;
  gap: 16rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12rpx 34rpx rgba(107, 35, 255, 0.08);
}
.stage-intro-card--deep .stage-intro-metrics {
  order: 4;
  width: 100%;
  max-width: 620rpx;
  margin-top: 40rpx;
  min-height: 92rpx;
  padding: 0 28rpx;
  gap: 16rpx;
  border-radius: 28rpx;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12rpx 34rpx rgba(107, 35, 255, 0.08);
}
.stage-intro-card--holland .stage-intro-metric {
  min-height: 86rpx;
  position: relative;
}
.stage-intro-card--holland .stage-intro-metric + .stage-intro-metric::before {
  content: none;
}
.stage-intro-metric-text {
  flex: 1;
  display: block;
  font-size: 24rpx;
  line-height: 1.65;
  color: #000;
  font-weight: 700;
}
.stage-intro-card--personality .stage-intro-metric-text,
.stage-intro-card--holland .stage-intro-metric-text,
.stage-intro-card--deep .stage-intro-metric-text {
  font-size: 22rpx;
  line-height: 1.4;
  color: #4b4b4b;
  font-weight: 700;
}
.stage-intro-card--holland .stage-intro-metric-text {
  text-align: center;
  font-size: 22rpx;
  line-height: 1.32;
  color: #4d4d4d;
}
.stage-intro-copy { display: flex; flex-direction: column; gap: 14rpx; margin-top: 20rpx; }
.stage-intro-copy-text { display: block; font-size: 24rpx; line-height: 1.75; color: #4b5563; text-align: left; }
.stage-intro-card--overview { padding-bottom: 44rpx; }
.rule-module-list { display: flex; flex-direction: column; gap: 18rpx; margin-top: 30rpx; }
.rule-module-card { padding: 24rpx 24rpx 22rpx; border-radius: 24rpx; background: #f8fafc; border: 2rpx solid #e9edf5; }
.rule-module-title { display: block; font-size: 30rpx; line-height: 1.45; color: #283248; font-weight: 700; }
.rule-module-body { display: block; margin-top: 10rpx; font-size: 25rpx; line-height: 1.72; color: #4b5563; }
.question-head { display: flex; align-items: center; justify-content: space-between; }
.question-badge { padding: 10rpx 20rpx; border-radius: 999rpx; background: #f3edff; color: #6b23ff; font-size: 22rpx; font-weight: 700; }
.question-index { font-size: 22rpx; color: #7b8697; }
.stage-artwork-wrap,
.question-image-wrap,
.puzzle-image-wrap,
.career-scene-wrap {
  margin-top: 16rpx;
  min-height: 160rpx;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.stage-artwork-wrap {
  width: 100%;
  max-width: 560rpx;
  margin: 16rpx auto 0;
}
.stage-artwork-img { width: 100%; height: 180rpx; display: block; margin: 0 auto; }
.question-image-wrap {
  width: 100%;
  max-width: 540rpx;
  min-height: 180rpx;
  margin: 16rpx auto 0;
}
.question-image-img { width: 100%; height: 180rpx; display: block; border-radius: 20rpx; margin: 0 auto; }
.puzzle-image-wrap {
  width: 100%;
  max-width: 540rpx;
  min-height: 160rpx;
  margin: 16rpx auto 12rpx;
}
.puzzle-image { width: 100%; height: auto; display: block; border-radius: 24rpx; margin: 0 auto; }
.profile-hero { display: flex; justify-content: center; margin: 8rpx 0 28rpx; }
.profile-hero-wrap { width: 168rpx; height: 168rpx; min-height: 168rpx; border-radius: 24rpx; }
.profile-hero-img { width: 192rpx; height: 192rpx; display: block; }
.profile-form--basic { margin-top: 0; }
.profile-form--basic .field-card,
.profile-form--basic .field-card--text {
  margin-bottom: 36rpx;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: none;
  box-shadow: none;
}
.profile-form--basic .field-card:last-child,
.profile-form--basic .field-card--text:last-child {
  margin-bottom: 0;
}
.profile-form--basic .field-card--text .text-input,
.profile-form--basic .field-card .text-input,
.profile-form--basic .field-card .opt,
.profile-form--basic .field-card .career-item-tile {
  border: 4rpx solid #e6e6e6;
  box-shadow: 0 4rpx 0 #e6e6e6;
  background: #fff;
  transition: all 160ms ease;
}
.profile-form--basic .field-card .opt,
.profile-form--basic .field-card .career-item-tile {
  min-height: 90rpx;
  border-radius: 16rpx;
  padding: 15rpx 20rpx 14rpx 20rpx;
}
.profile-form--basic .opt-p {
  width: 38rpx;
  min-width: 38rpx;
  height: 38rpx;
  line-height: 34rpx;
  font-size: 22rpx;
  font-weight: 600;
  background: #fff;
  color: #a1a1aa;
  border: 2rpx solid #e6e6e6;
  box-sizing: border-box;
}
.profile-form--basic .opt-l,
.profile-form--basic .career-item-tile-text {
  color: #18181b;
  font-weight: 500;
  font-size: 30rpx;
}
.profile-form--basic .field-card .opt.opt--on,
.profile-form--basic .field-card .career-item-tile.career-item-tile--picked,
.profile-form--basic .field-card .opt.career-opt.career-opt--on,
.profile-form--basic .field-card .opt.career-opt.career-opt--row.career-opt--on {
  background: #f0e8ff !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.profile-form--basic .field-card .opt.opt--on .opt-p,
.profile-form--basic .field-card .opt.career-opt.career-opt--on .opt-p,
.profile-form--basic .field-card .opt.career-opt.career-opt--row.career-opt--on .opt-p {
  background: #fff;
  color: #18181b !important;
  border-color: #18181b !important;
}
.profile-form--basic .field-card .opt.opt--on .opt-l,
.profile-form--basic .field-card .career-item-tile.career-item-tile--picked .career-item-tile-text,
.profile-form--basic .field-card .opt.career-opt.career-opt--on .opt-l,
.profile-form--basic .field-card .opt.career-opt.career-opt--row.career-opt--on .opt-l {
  color: #18181b !important;
  font-weight: 700;
}
.profile-form--basic .field-card .career-item-tile.career-item-tile--picked {
  background: #f0e8ff !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.profile-form--basic .field-card .career-item-tile.career-item-tile--picked .career-item-tile-text {
  color: #18181b !important;
  font-weight: 700;
}
.profile-form--basic .opt--err,
.profile-form--basic .field-card .opt--err {
  background: #fff5f5;
  border-color: #ff4d4f;
  box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.12);
}
.profile-form--basic .opt--err .opt-p {
  background: #fff;
  color: #ff4d4f;
  border-color: #ff4d4f;
}
.profile-form--basic .opt--err .opt-l {
  color: #4b4b4b;
}
.profile-form--basic .field-card .opt.opt--on.opt--err {
  background: #f0e8ff !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.profile-form--basic .field-card .opt.opt--on.opt--err .opt-p {
  background: #fff;
  color: #18181b !important;
  border-color: #18181b !important;
}
.profile-form--basic .field-card .opt.opt--on.opt--err .opt-l {
  color: #18181b !important;
}
.profile-form--basic .field-card .opt + .opt,
.profile-form--basic .field-card .career-item-tile + .career-item-tile {
  margin-top: 0;
}
.ability-card { margin-top: 20rpx; border-radius: 24rpx; border: 2rpx solid #e3edff; background: #f8fbff; padding: 20rpx; }
.ability-series { display: block; text-align: center; font-size: 22rpx; color: #3b82f6; font-weight: 700; }
.ability-title { display: block; margin-top: 10rpx; font-size: 30rpx; color: #0f172a; font-weight: 700; }
.ability-line { display: block; margin-top: 12rpx; padding: 16rpx 18rpx; border-radius: 18rpx; background: #fff; font-size: 24rpx; color: #334155; }
.puzzle-block { margin-top: 16rpx; padding: 18rpx; border-radius: 20rpx; background: #f8fafc; border: 2rpx solid #e9edf5; }
.puzzle-scene { display: block; font-size: 24rpx; line-height: 1.7; color: #334155; white-space: pre-wrap; }
.puzzle-table-wrap { margin-top: 16rpx; border-radius: 14rpx; overflow: hidden; border: 2rpx solid #d9e2ee; }
.puzzle-table-row { display: flex; flex-direction: row; }
.puzzle-table-head { background: #e2e8f0; }
.puzzle-table-cell { flex: 1; padding: 12rpx 8rpx; font-size: 20rpx; color: #0f172a; border-right: 1rpx solid #cbd5e1; word-break: break-all; }
.puzzle-table-cell:last-child { border-right: none; }
.puzzle-hint { display: block; margin-top: 12rpx; font-size: 22rpx; color: #0369a1; line-height: 1.55; }
.question-title { display: block; margin-top: 16rpx; font-size: 34rpx; line-height: 1.4; color: #283248; font-weight: 700; }
.question-subtext { display: block; margin-top: 10rpx; font-size: 24rpx; line-height: 1.65; color: #6b7280; }
.question-body { margin-top: 6rpx; }
.question-card--basic-profile .question-body { margin-top: 0; }
.profile-form { margin-top: 0; }
.field-card { margin-bottom: 18rpx; padding: 20rpx; border-radius: 22rpx; background: #f8fafc; }
.field-card--text { background: transparent; padding: 0 0 18rpx; }
.field-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14rpx; }
.field-label { display: block; font-size: 28rpx; color: #283248; font-weight: 700; line-height: 1.5; }
.field-meta { font-size: 22rpx; color: #64748b; }
.profile-form--basic .field-head { margin-bottom: 14rpx; }
.profile-form--basic .field-label {
  display: flex;
  align-items: center;
  min-height: 62rpx;
  font-family: 'DouyinSans', sans-serif;
  font-size: 28rpx;
  color: #293347;
  font-weight: 700;
  line-height: 1.45;
}
.profile-form--basic .field-meta {
  font-size: 22rpx;
  color: #a1a1aa;
}
.text-input {
  width: 100%;
  height: 96rpx;
  margin-top: 16rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  border-radius: 24rpx;
  background: #fff;
  border: 2rpx solid #ece8f8;
  box-shadow: 0 8rpx 18rpx rgba(15,23,42,0.04);
  font-size: 30rpx;
  color: #4b4b4b;
  line-height: 96rpx;
}
.profile-form--basic .text-input {
  margin-top: 0;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 16rpx;
  border: 4rpx solid #e6e6e6;
  box-shadow: 0 4rpx 0 #e6e6e6;
  background: #fff;
  font-size: 30rpx;
  color: #18181b;
  font-weight: 500;
  padding: 0 20rpx;
}
.profile-form--basic .text-input--filled {
  background: #f0e8ff !important;
  color: #18181b !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.profile-form--basic .text-input--err {
  background: #fff5f5;
  color: #3f3f46;
  border-color: #ff4d4f;
  box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.12);
}
.profile-form--basic .textarea {
  border-radius: 18rpx;
  border-color: #d6d6da;
  box-shadow: 0 4rpx 0 rgba(210, 210, 214, 0.92);
}
.text-input-placeholder { color: #afafaf; font-size: 30rpx; line-height: 1.4; }
.profile-form--basic .text-input-placeholder {
  color: #9ca3af;
  font-size: 28rpx;
}
.textarea { width: 100%; min-height: 240rpx; padding: 20rpx 22rpx; box-sizing: border-box; border-radius: 24rpx; background: #fff; border: 2rpx solid #ece8f8; font-size: 28rpx; color: #0f172a; box-shadow: 0 8rpx 18rpx rgba(15,23,42,0.04); }
.tag-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 24rpx; }
.tag-tile {
  width: calc(50% - 8rpx);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 18rpx 18rpx;
  border-radius: 16rpx;
  border: 4rpx solid #e6e6e6;
  background: #fff;
  box-shadow: 0 4rpx 0 #e6e6e6;
  transition: all 160ms ease;
}
.tag-tile--on {
  background: #f0e8ff !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.tag-tile--err {
  border-color: #ff4d4f;
  background: #fff5f5;
  box-shadow: 0 4rpx 0 2rpx #ffb3b3;
}
.tag-icon-wrap { width: 112rpx; height: 112rpx; border-radius: 28rpx; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; box-shadow: inset 0 0 0 2rpx #f0ebfb; }
.tag-icon-inner { width: 92rpx; height: 92rpx; min-height: 92rpx; }
.tag-icon { width: 92rpx; height: 92rpx; display: block; }
.tag-label-wrap { margin-top: 16rpx; width: 100%; min-height: 68rpx; display: flex; align-items: center; justify-content: center; border-radius: 14rpx; border: 2rpx solid #e6e6e6; background: #fff; padding: 8rpx 10rpx; box-sizing: border-box; }
.tag-label-wrap--on { border-color: #18181b; background: #fff; }
.tag-label { font-size: 30rpx; color: #18181b; font-weight: 500; line-height: 1.35; text-align: center; }
.tag-tile--on .tag-label { color: #18181b; font-weight: 700; }
.career-scenario { margin-top: 8rpx; }
.career-section { margin-top: 36rpx; padding-top: 8rpx; }
.career-section:first-child { margin-top: 0; }
.career-scene-image { width: 100%; border-radius: 16rpx; background: #f8fafc; }
.career-scene-text { display: block; margin-top: 20rpx; font-size: 28rpx; line-height: 1.75; color: #334155; white-space: pre-wrap; }
.career-block-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16rpx; margin-top: 24rpx; }
.career-block-title { display: block; flex: 1; font-size: 34rpx; line-height: 1.45; color: #283248; font-weight: 700; }
.career-block-meta { flex-shrink: 0; padding: 10rpx 18rpx; border-radius: 999rpx; background: #f4f0ff; color: #6b23ff; font-size: 24rpx; font-weight: 700; }
.career-choice-list { display: flex; flex-direction: column; gap: 16rpx; margin-top: 20rpx; }
.career-choice-list .opt { width: 100%; box-sizing: border-box; }
.career-item-pool { display: flex; flex-wrap: wrap; gap: 16rpx; width: 100%; margin-top: 20rpx; box-sizing: border-box; }
.career-item-tile {
  width: calc(50% - 8rpx);
  min-height: 88rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18rpx 16rpx;
  border-radius: 16rpx;
  border: 4rpx solid #e6e6e6;
  background: #fff;
  box-shadow: 0 4rpx 0 #e6e6e6;
  transition: all 160ms ease;
}
.career-item-tile-text { font-size: 30rpx; line-height: 1.45; color: #18181b; font-weight: 500; text-align: center; word-break: break-word; }
.career-item-tile--picked {
  background: #f0e8ff !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.career-item-tile--picked .career-item-tile-text { color: #18181b !important; font-weight: 700; }
.career-item-pool--err .career-item-tile:not(.career-item-tile--picked) {
  border-color: #ff4d4f;
  background: #fff5f5;
  box-shadow: 0 4rpx 0 2rpx #ffb3b3;
}
.career-item-pool--err .career-item-tile:not(.career-item-tile--picked) .career-item-tile-text { color: #4b4b4b; }
.career-opt--row { align-items: flex-start; }
.career-opt--row .opt-p { margin-top: 4rpx; flex-shrink: 0; }
.career-opt--row .opt-l { flex: 1; min-width: 0; word-break: break-word; white-space: normal; line-height: 1.55; }
.profile-form--basic .career-opt { border: none; box-shadow: none; }
.career-opt { border: 4rpx solid #e6e6e6; box-shadow: 0 4rpx 0 #e6e6e6; }
.career-items-interactive--dragging { position: relative; z-index: 4; }
.career-rank-selected { position: relative; width: 100%; margin-top: 20rpx; box-sizing: border-box; }
.career-rank-grid { display: flex; flex-direction: column; flex-wrap: nowrap; gap: 12rpx; width: 100%; }
.career-rank-slot-wrap { width: 100%; box-sizing: border-box; }
.career-rank-selected .career-rank-slot { width: 100%; min-width: 0; min-height: 88rpx; box-sizing: border-box; display: flex; align-items: center; justify-content: flex-start; gap: 18rpx; padding: 18rpx 18rpx; border-radius: 20rpx; border: 2rpx solid rgba(107,35,255,0.3); background: linear-gradient(180deg, #f6f0ff 0%, #ffffff 100%); box-shadow: 0 12rpx 24rpx rgba(107,35,255,0.1); }
.career-rank-slot { position: relative; touch-action: none; }
.career-rank-slot--on { border-color: rgba(107,35,255,0.3); background: linear-gradient(180deg, #f6f0ff 0%, #ffffff 100%); box-shadow: 0 12rpx 24rpx rgba(107,35,255,0.1); }
.career-rank-slot--empty { border-color: #ece8f8; background: #fff; box-shadow: 0 10rpx 20rpx rgba(15,23,42,0.04); align-items: center; justify-content: center; }
.career-rank-slot--placeholder-active { opacity: 0.28; }
.career-rank-slot--drop { border-color: #6b23ff; background: #ede5ff; box-shadow: 0 0 0 2rpx rgba(107,35,255,0.16), 0 12rpx 24rpx rgba(107,35,255,0.14); }
.career-rank-slot-empty { font-size: 24rpx; line-height: 1.45; color: #afafaf; font-weight: 700; text-align: center; }
.career-rank-ghost { position: fixed; z-index: 1200; pointer-events: none; min-height: 88rpx; box-sizing: border-box; display: flex; align-items: center; justify-content: flex-start; gap: 18rpx; padding: 18rpx 16rpx; border-radius: 20rpx; border: 2rpx solid #6b23ff; background: #f6f0ff; box-shadow: 0 18rpx 36rpx rgba(107,35,255,0.18); }
.career-item-pool--drop-active { border-radius: 12rpx; background: rgba(107,35,255,0.05); box-shadow: inset 0 0 0 2rpx rgba(107,35,255,0.28); }
.career-rank-slot-order { width: 40rpx; height: 40rpx; border-radius: 50%; background: #fff; color: #6b23ff; font-size: 22rpx; line-height: 40rpx; font-weight: 700; text-align: center; flex-shrink: 0; }
.career-rank-slot-text { font-size: 24rpx; line-height: 1.45; color: #6b23ff; font-weight: 700; text-align: left; flex: 1; min-width: 0; word-break: break-word; }
.career-rank-hint { display: block; margin-top: 12rpx; font-size: 22rpx; line-height: 1.5; color: #94a3b8; }
.stage-mbti-wrap { display: flex; flex-direction: column; gap: 18rpx; margin-top: 30rpx; }
.stage-mbti-card { padding: 0 24rpx; border-radius: 28rpx; background: rgba(255,255,255,0.78); border: none; box-shadow: none; }
.stage-mbti-wrap > .stage-mbti-card:first-child {
  min-height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  padding: 0 22rpx;
}
.stage-mbti-card--selector { padding: 22rpx 24rpx 24rpx; background: #efecff; }
.stage-mbti-card--selector-line { min-height: 86rpx; display: flex; align-items: center; justify-content: space-between; gap: 16rpx; }
.stage-mbti-card--disclaimer { padding: 24rpx 28rpx; background: #e9e8f7; }
.stage-mbti-title { display: block; flex: 1; min-width: 0; font-size: 24rpx; line-height: 1.35; color: #4b4b4b; font-weight: 700; text-align: left; }
.stage-mbti-choice-row { flex-shrink: 0; display: flex; gap: 14rpx; margin-top: 0; margin-left: 0; width: 166rpx; }
.stage-mbti-choice { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 60rpx; border-radius: 20rpx; border: 2rpx solid #d8d8d8; background: rgba(255,255,255,0.64); }
.stage-mbti-choice--on { border-color: #9761ff; background: rgba(151,97,255,0.08); box-shadow: inset 0 0 0 2rpx rgba(151,97,255,0.12); }
.stage-mbti-choice-text { font-size: 18rpx; line-height: 1.3; color: #4b4b4b; font-weight: 700; }
.stage-mbti-choice--on .stage-mbti-choice-text { color: #4b4b4b; }
.stage-mbti-line-label { font-size: 24rpx; line-height: 1.4; color: #4b4b4b; font-weight: 700; }
.stage-mbti-line-value-wrap { display: flex; align-items: center; gap: 16rpx; }
.stage-mbti-line-value { font-size: 24rpx; line-height: 1.4; color: #6b23ff; font-weight: 700; }
.stage-mbti-line-value--placeholder { color: #8b5cf6; }
.stage-mbti-line-arrow { font-size: 26rpx; line-height: 1; color: #4b4b4b; transform: rotate(180deg); transition: transform 160ms ease; }
.stage-mbti-line-arrow--open { transform: rotate(0deg); }
.stage-mbti-grid { display: flex; flex-wrap: wrap; gap: 14rpx; margin-top: 0; }
.stage-mbti-pill { width: calc(25% - 11rpx); min-height: 72rpx; display: flex; align-items: center; justify-content: center; border-radius: 18rpx; border: 2rpx solid #d8d8d8; background: rgba(255,255,255,0.76); box-sizing: border-box; }
.stage-mbti-pill--on { border-color: #9761ff; background: #f0e8ff; box-shadow: 0 4rpx 0 rgba(151,97,255,0.55); }
.stage-mbti-pill-text { font-size: 24rpx; line-height: 1.4; color: #4b4b4b; font-weight: 700; }
.stage-mbti-pill--on .stage-mbti-pill-text { color: #6b23ff; }
.stage-mbti-disclaimer { display: block; font-size: 22rpx; line-height: 1.6; color: #4b4b4b; text-align: center; }
.stage-intro-card--personality .stage-mbti-wrap {
  order: 5;
  width: 100%;
}
.stage-intro-card--personality .stage-mbti-card {
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10rpx 30rpx rgba(107, 35, 255, 0.07);
}
.stage-intro-card--personality .stage-mbti-card--selector {
  background: rgba(239, 236, 255, 0.92);
}
.stage-intro-card--personality .stage-mbti-card--disclaimer {
  background: rgba(233, 232, 247, 0.86);
}
.batch-section-title { display: block; margin-top: 28rpx; font-size: 36rpx; line-height: 1.45; color: #283248; font-weight: 700; }
.batch-section-desc { display: block; margin-top: 16rpx; font-size: 28rpx; line-height: 1.75; color: #666; font-weight: 500; }
.batch-block { margin-top: 48rpx; padding-bottom: 48rpx; border-bottom: 2rpx solid #f1f0f7; }
.batch-block:first-of-type { margin-top: 32rpx; }
.batch-block:last-child { padding-bottom: 8rpx; border-bottom: none; }
.batch-block-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20rpx; margin-bottom: 28rpx; }
:deep(.personality-question-image-wrap) {
  width: 100%;
  margin: 48rpx auto 24rpx;
  min-height: 345rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  background: transparent;
}
:deep(.personality-question-image) {
  width: 460rpx;
  height: 345rpx;
  display: block;
  flex-shrink: 0;
  margin: 0 auto;
}
.calibration-question-image-wrap {
  margin: 0 auto 32rpx;
  width: 400rpx;
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.calibration-question-image {
  width: 400rpx;
  height: 300rpx;
  display: block;
  margin: 0 auto;
}
.batch-block--calibration .batch-block-prompt {
  margin-top: 0;
}
.batch-block--calibration:first-of-type {
  margin-top: 32rpx;
}
.batch-block-title { flex: 1; font-size: 32rpx; line-height: 1.55; color: #283248; font-weight: 700; }
.batch-block-meta { flex-shrink: 0; padding: 8rpx 16rpx; border-radius: 999rpx; background: #f4f0ff; color: #6b23ff; font-size: 22rpx; font-weight: 700; line-height: 1.2; }
.batch-block-prompt { display: block; margin-top: 28rpx; font-size: 32rpx; line-height: 1.55; color: #283248; font-weight: 700; }
.batch-opt-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 8rpx; }
.batch-opt-grid--stack { flex-direction: column; flex-wrap: nowrap; gap: 14rpx; }
.batch-opt-grid--stack .batch-opt { width: 100%; box-sizing: border-box; }
.batch-opt-grid--scale {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 8rpx;
}
.batch-opt--scale {
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}
.batch-scale-circle {
  width: 76rpx;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 999rpx;
  border: 6rpx solid #d9d9d9;
  background: #fff;
  color: #999;
  font-size: 28rpx;
  font-weight: 700;
  text-align: center;
}
.batch-scale-label {
  display: block;
  margin-top: 16rpx;
  font-size: 22rpx;
  line-height: 1.35;
  color: #4b4b4b;
  font-weight: 600;
  text-align: center;
  word-break: break-word;
  white-space: normal;
}
.batch-opt--scale.opt--on .batch-scale-circle {
  border-color: #6b23ff;
  background: #6b23ff;
  color: #fff;
  box-shadow: 0 8rpx 0 #3e0aa9;
}
.batch-opt--scale.opt--on .batch-scale-label {
  color: #252525;
}
.batch-opt--scale.opt--err .batch-scale-circle {
  border-color: #ff4d4f;
  color: #ff4d4f;
}
.batch-opt { padding: 20rpx 22rpx; align-items: flex-start; }
.batch-opt .opt-p { min-width: 44rpx; height: 44rpx; line-height: 44rpx; font-size: 22rpx; margin-top: 2rpx; flex-shrink: 0; }
.batch-opt .opt-l { flex: 1; min-width: 0; font-size: 28rpx; font-weight: 500; color: #4b4b4b; line-height: 1.55; word-break: break-word; white-space: normal; }
.batch-block--ability .ability-card { margin-top: 0; }
.batch-block--ability .puzzle-block { margin-top: 24rpx; }
.career-rank-divider { height: 2rpx; background: #e5e5e5; margin: 20rpx 0 0; }
.career-open-field { margin-top: 28rpx; }
.career-open-label { display: block; font-size: 34rpx; line-height: 1.45; color: #283248; font-weight: 700; }
.career-textarea { margin-top: 16rpx; min-height: 320rpx; border: 2rpx solid #ece8f8; box-shadow: 0 10rpx 18rpx rgba(15,23,42,0.04); border-radius: 24rpx; }
.opt2col { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 16rpx; }
.profile-multi-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 16rpx; }
.profile-multi-grid .opt { width: calc(50% - 8rpx); box-sizing: border-box; }
.profile-form--basic .profile-multi-grid,
.profile-form--basic .opt2col,
.profile-form--basic .optlist,
.profile-form--basic .career-choice-list { gap: 14rpx; margin-top: 14rpx; }
.profile-form--basic .profile-multi-grid {
  flex-direction: column;
  flex-wrap: nowrap;
}
.profile-form--basic .profile-multi-grid .opt {
  width: 100%;
  min-height: 90rpx;
  align-items: center;
  padding: 15rpx 20rpx 14rpx 20rpx;
}
.profile-form--basic .profile-multi-grid .opt {
  box-sizing: border-box;
}
.profile-form--basic .profile-multi-grid .opt-l {
  font-size: 30rpx;
  line-height: 1.45;
}
.profile-form--basic .profile-multi-grid .opt.opt--on .opt-l {
  color: #18181b;
}
.text-input--err { border-color: #ff4d4f; box-shadow: 0 10rpx 18rpx rgba(255,77,79,0.12); }
.career-textarea--err { border-color: #ff4d4f; box-shadow: 0 10rpx 18rpx rgba(255,77,79,0.12); }
.validation-banner { margin-top: 24rpx; padding: 20rpx 24rpx; border-radius: 20rpx; background: #fff5f5; border: 2rpx solid #ff4d4f; }
.validation-banner--inline { margin: 16rpx 0 0; }
.validation-banner-text { display: block; font-size: 26rpx; line-height: 1.6; color: #ff4d4f; font-weight: 700; }
.opt2col .opt { width: calc(50% - 8rpx); box-sizing: border-box; }
.optlist { display: flex; flex-direction: column; gap: 16rpx; margin-top: 24rpx; }
.opt--full { width: 100%; }
.opt {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  border: 4rpx solid #e6e6e6;
  background: #fff;
  box-shadow: 0 4rpx 0 #e6e6e6;
  transition: all 160ms ease;
}
.opt--on {
  background: #f0e8ff !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.opt.career-opt.career-opt--on,
.opt.career-opt.career-opt--row.career-opt--on,
.batch-opt.opt--on {
  background: #f0e8ff !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.opt.career-opt.career-opt--on .opt-p,
.opt.career-opt.career-opt--row.career-opt--on .opt-p,
.batch-opt.opt--on .opt-p,
.opt--on .opt-p {
  background: #fff;
  color: #18181b !important;
  border-color: #18181b !important;
}
.opt.career-opt.career-opt--on .opt-l,
.opt.career-opt.career-opt--row.career-opt--on .opt-l,
.batch-opt.opt--on .opt-l,
.opt--on .opt-l {
  color: #18181b !important;
  font-weight: 700;
}
.opt--err {
  border-color: #ff4d4f;
  background: #fff5f5;
  box-shadow: 0 4rpx 0 2rpx #ffb3b3;
}
.opt--err .opt-p { background: #fff; color: #ff4d4f; border: 2rpx solid #ff4d4f; }
.opt--err .opt-l { color: #4b4b4b; }
.opt--on.opt--err {
  background: #f0e8ff !important;
  border-color: #9761ff !important;
  box-shadow: 0 4rpx 0 2rpx #9761ff !important;
}
.opt--on.opt--err .opt-p { background: #fff; color: #18181b !important; border-color: #18181b !important; }
.opt--ok { border-color: #16a34a; background: #16a34a; box-shadow: 0 10rpx 24rpx rgba(22,163,74,0.2); }
.opt--ok .opt-p { background: #fff; color: #16a34a; }
.opt--ok .opt-l { color: #fff; }
.opt-p {
  min-width: 38rpx;
  width: 38rpx;
  height: 38rpx;
  line-height: 34rpx;
  border-radius: 50%;
  text-align: center;
  background: #fff;
  color: #a1a1aa;
  font-size: 22rpx;
  font-weight: 600;
  border: 2rpx solid #e6e6e6;
  box-sizing: border-box;
  flex-shrink: 0;
}
.opt-l { font-size: 30rpx; color: #18181b; font-weight: 500; line-height: 1.45; flex: 1; }
.mt28 { margin-top: 28rpx; }
.srow { display: flex; justify-content: space-between; margin-bottom: 16rpx; }
.slabel { font-size: 24rpx; color: #64748b; }
.fb { margin-top: 22rpx; padding: 20rpx 22rpx; border-radius: 18rpx; }
.fb--ok { background: #f0fdf4; border: 2rpx solid #16a34a; }
.fb--err { background: #fef2f2; border: 2rpx solid #ef4444; }
.fb-text { font-size: 26rpx; line-height: 1.7; color: #0f172a; }
.footer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; display: flex; gap: 18rpx; padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom)); background: rgba(255,255,255,0.94); backdrop-filter: blur(18rpx); box-shadow: 0 -8rpx 28rpx rgba(15,23,42,0.06); }
.footer--basic-profile {
  padding: 20rpx 24rpx calc(22rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(244, 244, 245, 0) 0%, rgba(244, 244, 245, 0.92) 18%, #f4f4f5 100%);
  box-shadow: none;
  border-top: none;
}
.footer--stage-figma-intro {
  justify-content: center;
  padding: 28rpx 24rpx calc(40rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(244, 244, 245, 0) 0%, rgba(244, 244, 245, 0.9) 22%, #f4f4f5 100%);
  box-shadow: none;
  border-top: none;
}
.page--stage-personality-intro .footer--stage-figma-intro {
  padding-bottom: calc(44rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(244, 246, 248, 0) 0%, rgba(244, 246, 248, 0.92) 20%, #f4f6f8 100%);
}
.footer--basic-profile .fbtn {
  flex: none;
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 18rpx;
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}
.footer--basic-profile .fbtn--primary-muted,
.footer--basic-profile .fbtn--primary[disabled] {
  background: #dedee1 !important;
  color: #b0b0b6 !important;
  box-shadow: none !important;
  opacity: 1;
}
.footer--basic-profile .fbtn--primary-ready {
  background: #6b23ff !important;
  color: #fff !important;
  box-shadow: 0 8rpx 0 #3d0aa8 !important;
}
.footer--stage-figma-intro .fbtn {
  flex: none;
  width: 297rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 700;
}
.footer--stage-figma-intro .fbtn--stage-intro-muted,
.footer--stage-figma-intro .fbtn--primary[disabled] {
  background: #dedede !important;
  color: #b4b4b4 !important;
  box-shadow: none !important;
  opacity: 1;
}
.footer--stage-figma-intro .fbtn--stage-intro-ready {
  background: #6b23ff !important;
  color: #fff !important;
  box-shadow: 0 8rpx 0 #3d0aa8 !important;
}
.fbtn--primary-press {
  transform: translateY(2rpx);
  box-shadow: 0 4rpx 0 #3d0aa8 !important;
}
.fbtn { flex: 1; height: 80rpx; line-height: 80rpx; border-radius: 16rpx; font-size: 28rpx; font-weight: 700; border: none; }
.fbtn--ghost { background: #f3f5fb; color: #4b5c75; }
.fbtn--ghost[disabled] { background: #e2e8f0; color: #94a3b8; box-shadow: none; opacity: 1; }
.fbtn--primary { background: #6b23ff; color: #fff; box-shadow: 0 8rpx 0 #3d0aa8; }
.fbtn--primary[disabled] { background: #e9e0ff; color: #9b7fd9; box-shadow: none; opacity: 1; }
/* === Complete screen === */
.complete-screen {
  flex: 1;
  height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
  box-sizing: border-box;
}
.complete-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  transform: translateY(-96rpx);
}
.complete-icon-wrap {
  position: relative;
  width: 330rpx;
  height: 306rpx;
}
:deep(.complete-shadow-wrap) {
  position: absolute;
  left: 50%;
  top: 264rpx;
  transform: translateX(-50%);
  width: 248rpx;
  height: 26rpx;
  overflow: visible;
  z-index: 1;
}
:deep(.complete-shadow-img) {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.42;
}
:deep(.complete-icon-inner) {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 268rpx;
  height: 268rpx;
  overflow: visible;
  z-index: 2;
}
:deep(.complete-icon-img) {
  width: 100%;
  height: 100%;
  display: block;
}
.complete-title {
  display: block;
  margin-top: 32rpx;
  font-size: 36rpx;
  line-height: 1.6;
  color: #24334b;
  font-weight: 700;
  text-align: center;
}
.complete-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 58rpx;
}
.complete-btn {
  width: 380rpx;
  height: 92rpx;
  line-height: 92rpx;
  border-radius: 24rpx;
  background: linear-gradient(180deg, #7d28ff 0%, #631cff 100%);
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  text-align: center;
  border: none;
  box-shadow: 0 10rpx 0 #4410b3;
}
.complete-btn[disabled] {
  background: #c4b0ff;
  color: #f0eaff;
}
.finishing-mask { position: fixed; inset: 0; z-index: 99; background: rgba(15,23,42,0.45); display: flex; align-items: center; justify-content: center; }
.finishing-text { color: #fff; font-size: 30rpx; font-weight: 600; }
.holland-fine {
  display: flex;
  flex-direction: column;
  gap: 88rpx;
}
.holland-fine-section-title {
  display: block;
  font-size: 48rpx;
  line-height: 1.45;
  color: #283248;
  font-weight: 700;
}
.holland-fine-item {
  display: flex;
  flex-direction: column;
  gap: 44rpx;
  margin-top: 0;
  padding: 0;
  border-bottom: none;
}
.holland-fine-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36rpx;
}
.holland-fine-scene-image-wrap {
  width: 480rpx;
  height: 360rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.holland-fine-scene-image {
  width: 480rpx;
  height: 360rpx;
  display: block;
}
.holland-fine-scene-text {
  width: 100%;
  font-size: 40rpx;
  line-height: 1.55;
  color: #283248;
  font-weight: 700;
  text-align: left;
  white-space: pre-wrap;
}
.holland-fine-question {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.holland-fine-question-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  flex-wrap: wrap;
}
.holland-fine-question-helper {
  font-size: 24rpx;
  line-height: 1.6;
  color: #9762ff;
  font-weight: 700;
}
.holland-fine-question-badge {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: #f3efff;
  color: #6b23ff;
  font-size: 22rpx;
  line-height: 1.4;
  font-weight: 700;
}
.holland-fine-question-title {
  font-size: 40rpx;
  line-height: 1.45;
  color: #283248;
  font-weight: 700;
}
.holland-fine-scale-anchors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}
.holland-fine-scale-anchor {
  min-height: 120rpx;
  padding: 22rpx 24rpx;
  border-radius: 20rpx;
  border: 4rpx solid #e6e6e6;
  background: #fff;
  box-shadow: 0 8rpx 0 #e6e6e6;
  box-sizing: border-box;
}
.holland-fine-scale-anchor-prefix {
  font-size: 28rpx;
  line-height: 1.4;
  color: #283248;
  font-weight: 800;
}
.holland-fine-scale-anchor-label {
  display: block;
  margin-top: 8rpx;
  font-size: 28rpx;
  line-height: 1.65;
  color: #4b4b4b;
}
.holland-fine-open-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}
.holland-fine-open-field {
  display: flex;
  flex-direction: column;
}
.holland-fine-open-label {
  display: block;
  font-size: 30rpx;
  line-height: 1.5;
  color: #283248;
  font-weight: 700;
}
.holland-fine-open-textarea {
  margin-top: 16rpx;
  min-height: 260rpx;
}
.holland-fine-selection-count {
  display: block;
  margin-top: 16rpx;
  text-align: right;
  color: #6b7280;
  font-size: 24rpx;
  line-height: 1.5;
  font-weight: 700;
}
.validation-inline-text {
  display: block;
  margin-top: 12rpx;
  color: #ff4d4f;
  font-size: 24rpx;
  line-height: 1.5;
}
.footer--stage-holland-intro {
  padding-bottom: calc(44rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(244, 246, 248, 0) 0%, rgba(244, 246, 248, 0.92) 20%, #f4f6f8 100%);
}
.footer--stage-holland-intro .fbtn {
  width: 297rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
}
.footer--stage-holland-intro .fbtn--stage-intro-ready {
  background: #6b23ff !important;
  color: #fff !important;
  box-shadow: 0 8rpx 0 #3d0aa8 !important;
}
.footer--stage-deep-intro {
  padding-bottom: calc(44rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(244, 246, 248, 0) 0%, rgba(244, 246, 248, 0.92) 20%, #f4f6f8 100%);
}
.footer--stage-deep-intro .fbtn {
  width: 297rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
}
.footer--stage-deep-intro .fbtn--stage-intro-ready {
  background: #6b23ff !important;
  color: #fff !important;
  box-shadow: 0 8rpx 0 #3d0aa8 !important;
}

/* Unified transition page layout, matching the compact mini-program mockups. */
.stage-intro-card--personality,
.stage-intro-card--holland,
.stage-intro-card--deep {
  padding-top: 128rpx;
}
.stage-intro-card--personality .stage-intro-title,
.stage-intro-card--holland .stage-intro-title,
.stage-intro-card--deep .stage-intro-title {
  order: 1;
  margin-top: 0;
  font-size: 38rpx;
  line-height: 1.35;
  color: #293347;
  font-weight: 800;
  letter-spacing: 0;
}
.stage-intro-card--personality .stage-intro-subtitle,
.stage-intro-card--holland .stage-intro-subtitle,
.stage-intro-card--deep .stage-intro-subtitle {
  order: 2;
  margin-top: 12rpx;
  font-size: 24rpx;
  line-height: 1.45;
  color: #4b4b4b;
  font-weight: 400;
}
.stage-intro-card--personality .stage-intro-hero,
.stage-intro-card--holland .stage-intro-hero,
.stage-intro-card--deep .stage-intro-hero {
  order: 3;
  width: 100%;
  min-height: 286rpx;
  margin-top: 48rpx;
}
.stage-intro-card--personality .stage-intro-hero::before {
  width: 344rpx;
  height: 198rpx;
}
.stage-intro-card--holland .stage-intro-hero::before,
.stage-intro-card--deep .stage-intro-hero::before {
  width: 344rpx;
  height: 194rpx;
}
.stage-intro-card--personality .stage-intro-icon-wrap--personality-launch,
.stage-intro-card--holland .stage-intro-icon-wrap--career-launch,
.stage-intro-card--deep .stage-intro-icon-wrap--deep-launch {
  width: 344rpx;
  height: 280rpx;
  min-height: 280rpx;
  align-items: center;
  overflow: visible;
}
.stage-intro-card--personality .stage-intro-icon--personality-launch,
.stage-intro-card--holland .stage-intro-icon--career-launch,
.stage-intro-card--deep .stage-intro-icon--deep-launch {
  width: 272rpx;
  height: 272rpx;
}
.stage-intro-card--personality .stage-intro-metrics,
.stage-intro-card--holland .stage-intro-metrics,
.stage-intro-card--deep .stage-intro-metrics {
  order: 4;
  width: 100%;
  max-width: 620rpx;
  margin-top: 40rpx;
  min-height: 92rpx;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 12rpx 34rpx rgba(107, 35, 255, 0.08);
}
.stage-intro-card--personality .stage-mbti-wrap {
  max-width: 620rpx;
}
.stage-intro-card--personality .stage-intro-hero,
.stage-intro-card--holland .stage-intro-hero,
.stage-intro-card--deep .stage-intro-hero {
  min-height: 236rpx;
  margin-top: 34rpx;
}
.stage-intro-card--holland .stage-intro-hero,
.stage-intro-card--deep .stage-intro-hero {
  /* Stage 2/3 artwork sits a bit lower than stage 1 for a lighter visual balance. */
  margin-top: 90rpx;
}
.stage-intro-card--personality .stage-intro-hero::before {
  width: 268rpx;
  height: 156rpx;
}
.stage-intro-card--holland .stage-intro-hero::before,
.stage-intro-card--deep .stage-intro-hero::before {
  width: 286rpx;
  height: 162rpx;
}
.stage-intro-card--personality .stage-intro-icon-wrap--personality-launch,
.stage-intro-card--holland .stage-intro-icon-wrap--career-launch,
.stage-intro-card--deep .stage-intro-icon-wrap--deep-launch {
  width: 292rpx;
  height: 226rpx;
  min-height: 226rpx;
}
.stage-intro-card--holland .stage-intro-icon-wrap--career-launch,
.stage-intro-card--deep .stage-intro-icon-wrap--deep-launch {
  /* Keep the illustration container compact so the CTA has more breathing room. */
  width: 248rpx;
  height: 194rpx;
  min-height: 194rpx;
}
.stage-intro-card--personality .stage-intro-icon--personality-launch,
.stage-intro-card--holland .stage-intro-icon--career-launch,
.stage-intro-card--deep .stage-intro-icon--deep-launch {
  width: 226rpx;
  height: 226rpx;
}
.stage-intro-card--holland .stage-intro-icon--career-launch,
.stage-intro-card--deep .stage-intro-icon--deep-launch {
  /* Actual artwork size for stage 2 intro card. */
  width: 176rpx;
  height: 176rpx;
}
/* Emphasize the stage 2 title a bit more than the shared intro title size. */
.stage-intro-card--holland .stage-intro-title {
  font-size: 50rpx;
}
.stage-intro-card--deep .stage-intro-title {
  font-size: 50rpx;
}
.stage-intro-card--personality .stage-intro-icon--personality-launch {
  width: 208rpx;
  height: 208rpx;
}
.stage-intro-card--personality,
.stage-intro-card--holland,
.stage-intro-card--deep {
  min-height: calc(100vh - 420rpx);
  justify-content: flex-start;
  padding-top: 168rpx;
}
.stage-intro-card--holland .stage-intro-metrics,
.stage-intro-card--deep .stage-intro-metrics {
  margin-top: 34rpx;
}
.stage-intro-card--personality .stage-intro-metrics {
  margin-top: 30rpx;
}
.stage-intro-card--personality .stage-mbti-wrap {
  margin-top: 24rpx;
}
.page--stage-personality-intro .content,
.content--stage-holland-intro,
.content--stage-deep-intro {
  padding-bottom: 170rpx;
}
.footer--stage-figma-intro,
.footer--stage-holland-intro,
.footer--stage-deep-intro {
  justify-content: center;
  padding-top: 14rpx;
  padding-bottom: calc(132rpx + env(safe-area-inset-bottom));
  background: linear-gradient(180deg, rgba(244, 246, 248, 0) 0%, rgba(244, 246, 248, 0.78) 34%, #f4f6f8 100%);
}
.footer--stage-holland-intro,
.footer--stage-deep-intro {
  bottom: 200rpx;
  padding-bottom: calc(132rpx + env(safe-area-inset-bottom));
}
.footer--stage-figma-intro {
  justify-content: center;
  bottom: 100rpx;
  padding-bottom: calc(132rpx + env(safe-area-inset-bottom));
}
.footer--stage-figma-intro .fbtn,
.footer--stage-holland-intro .fbtn,
.footer--stage-deep-intro .fbtn {
  flex: none;
  width: 297rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
}
.footer--stage-figma-intro .fbtn--stage-intro-ready,
.footer--stage-holland-intro .fbtn--stage-intro-ready,
.footer--stage-deep-intro .fbtn--stage-intro-ready {
  background: #6b23ff !important;
  box-shadow: 0 8rpx 0 #3d0aa8 !important;
}
</style>
