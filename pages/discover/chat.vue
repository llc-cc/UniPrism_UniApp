<template>
  <view class="page">
    <view class="topbar">
      <view class="topbar-spacer"></view>
      <view class="topbar-center">
        <text class="phase-title">{{ showComplete ? '问卷生成' : phaseLabel }}</text>
        <text v-if="!showComplete && !isCurrentStageIntro" class="progress-text">第 {{ displayScreenIndex }} 步 / 共 {{ displayScreenTotal }} 步</text>
      </view>
      <text class="topbar-action topbar-action--right" @tap="restart">重来</text>
    </view>

    <view class="stage-progress">
      <view class="stage-track">
        <view class="stage-track-bg"></view>
        <view class="stage-fill" :style="{ width: stageFillWidth }"></view>
        <view class="stage-dots">
          <view
            v-for="(stage, idx) in chatStages"
            :key="stage.id"
            class="stage-dot-wrap"
            :class="{ 'stage-dot-wrap--clickable': isStageClickable(idx) }"
            @tap="onStageTap(idx)"
          >
            <view class="stage-dot" :class="{ 'stage-dot--on': activeStageIndex >= idx }">
              <image
                class="stage-diamond"
                :src="activeStageIndex >= idx ? progressDiamondActive : progressDiamondInactive"
                mode="aspectFit"
              />
            </view>
          </view>
        </view>
      </view>
      <view class="stage-labels">
        <text
          v-for="(stage, idx) in chatStages"
          :key="stage.id + '-label'"
          class="stage-label"
          :class="{
            'stage-label--on': activeStageIndex >= idx,
            'stage-label--clickable': isStageClickable(idx),
          }"
          @tap="onStageTap(idx)"
        >{{ idx + 1 }}.{{ stage.shortLabel || stage.label }}</text>
      </view>
    </view>

    <scroll-view v-if="showComplete" class="content" scroll-y :enable-back-to-top="true">
      <view class="complete-card">
        <text class="complete-title">兴趣探索已完成，报告已准备生成</text>
        <text class="complete-subtitle">先了解你真正感兴趣的方向</text>
        <ChatAssetImage
          v-if="stageArtworkPath"
          :path="stageArtworkPath"
          mode="aspectFit"
          image-class="complete-image"
          wrap-class="complete-image-wrap"
          label="报告准备完成配图"
          :show-path-hint="0"
        />
        <text class="complete-desc">点击「生成并查看报告」后会进入报告页，保存答题记录和生成综合报告的进度会在那里显示。</text>
      </view>
    </scroll-view>

    <scroll-view v-else class="content" scroll-y :scroll-top="scrollTop" :scroll-into-view="scrollIntoView" scroll-with-animation :enable-back-to-top="true">
      <view v-if="isCurrentStageIntro" class="question-card stage-intro-card">
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
          <text
            v-for="metric in currentStageIntro.metrics"
            :key="metric"
            class="stage-intro-metric-text"
          >
            {{ metric }}
          </text>
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

          <view v-if="mbtiChoice === 'known'" class="stage-mbti-card stage-mbti-card--selector">
            <text class="stage-mbti-title">你的 MBTI 是</text>
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
            <text class="stage-mbti-disclaimer">{{ STAGE_PERSONALITY_DISCLAIMER }}</text>
          </view>
        </view>
      </view>

      <view v-else-if="isCurrentAbilityOverview" class="question-card stage-intro-card stage-intro-card--overview">
        <text class="stage-intro-badge">规则过渡页</text>
        <text class="stage-intro-title">{{ currentAbilityOverview.title }}</text>
        <text class="stage-intro-subtitle">{{ currentAbilityOverview.subtitle }}</text>

        <ChatAssetImage
          v-if="currentAbilityOverview.artwork"
          :path="currentAbilityOverview.artwork"
          mode="aspectFit"
          image-class="stage-intro-image"
          wrap-class="stage-intro-image-wrap"
          label="能力测试过渡配图"
          :show-path-hint="0"
        />

        <view class="stage-intro-copy">
          <text v-for="paragraph in currentAbilityOverview.paragraphs" :key="paragraph" class="stage-intro-copy-text">{{ paragraph }}</text>
        </view>

        <view class="rule-module-list">
          <view v-for="module in currentAbilityOverview.modules" :key="module.title" class="rule-module-card">
            <text class="rule-module-title">{{ module.title }}</text>
            <text class="rule-module-body">{{ module.body }}</text>
          </view>
        </view>
      </view>

      <!-- 性格 / 能力：多题同页（对齐 Web PersonalityBatchScreen / AbilityBatchScreen） -->
      <view v-else-if="isCurrentBatchScreen" class="question-card">
        <view class="question-head">
          <text class="question-badge">{{ phaseLabel }}</text>
          <text class="question-index">第 {{ displayScreenIndex }} 步</text>
        </view>

        <view
          v-for="(bq, bi) in screenQuestions"
          :key="bq.id"
          :id="'anchor-q-' + bq.id"
          class="batch-block"
          :class="isPersonalityBatch ? 'batch-block--personality' : 'batch-block--ability'"
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

          <view class="batch-opt-grid batch-opt-grid--stack">
            <view
              v-for="(opt, oi) in bq.options || []"
              :key="opt.id"
              class="opt batch-opt career-opt career-opt--row"
              :class="{
                'opt--on': batchValues[bq.id] === opt.id,
                'opt--err': questionValidations[bq.id] && batchValues[bq.id] !== opt.id,
              }"
              @tap="setBatchAnswer(bq.id, opt.id)"
            >
              <text class="opt-p">{{ chr(oi) }}</text>
              <text class="opt-l">{{ opt.label }}</text>
            </view>
          </view>
        </view>

        <view v-if="screenValidationMessage" class="validation-banner">
          <text class="validation-banner-text">{{ screenValidationMessage }}</text>
        </view>
      </view>

      <view v-else-if="q" class="question-card">
        <view class="question-head">
          <text class="question-badge">{{ phaseLabel }}</text>
          <text class="question-index">第 {{ displayScreenIndex }} 步</text>
        </view>

        <ChatAssetImage
          v-if="showStageArtwork && stageArtworkPath"
          :path="stageArtworkPath"
          mode="aspectFit"
          image-class="stage-artwork-img"
          wrap-class="stage-artwork-wrap"
          label="阶段配图"
        />
        <ChatAssetImage
          v-if="questionImagePath && q.type !== 'career-scenario'"
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

        <text class="question-title">{{ q.prompt }}</text>
        <text v-if="q.subtext && q.type !== 'career-scenario'" class="question-subtext">{{ q.subtext }}</text>

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
            :class="{ 'career-items-interactive--dragging': rankDragIndex >= 0 }"
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

          <view id="anchor-career-open" class="career-section">
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
        <view v-if="q.type === 'profile-form'" class="profile-form">
          <view v-if="q.id === 'basic-profile'" class="profile-hero">
            <ChatAssetImage
              :path="STAGE_PROFILE_ARTWORK"
              mode="aspectFit"
              image-class="profile-hero-img"
              wrap-class="profile-hero-wrap"
              label="基本信息配图"
              :show-path-hint="0"
            />
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
              <text class="field-meta">已选 {{ profileMultiCount(field.id) }}/{{ field.maxSelections || 3 }}</text>
            </view>
            <text v-if="field.type !== 'multi'" class="field-label">{{ field.label }}</text>

            <input
              v-if="field.type === 'text'"
              class="text-input"
              :class="{ 'text-input--err': profileFieldErrors[field.id] }"
              type="text"
              :placeholder="field.placeholder || ''"
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
        <view v-if="q.type === 'interest-tag-grid'" :id="'anchor-q-' + q.id" class="tag-grid">
          <view
            v-for="o in tagOpts"
            :key="o.id"
            class="tag-tile"
            :class="o.selected ? 'tag-tile--on' : ''"
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

        <!-- slider (legacy, not in active bank) -->
        <view v-if="q.type === 'slider'" class="mt28">
          <view class="srow">
            <text class="slabel">{{ q.sliderConfig && q.sliderConfig.leftLabel }}</text>
            <text class="slabel">{{ q.sliderConfig && q.sliderConfig.rightLabel }}</text>
          </view>
          <slider :value="slideVal" :min="0" :max="100" :step="1" activeColor="#6b23ff" backgroundColor="#e6e2ff" @change="onSliderChange" />
        </view>

        <!-- card-select / scenario-pair / multi-select -->
        <view v-if="isOptionListType" :id="'anchor-q-' + q.id" class="career-choice-list optlist">
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

    <view class="footer">
      <template v-if="showComplete">
        <button class="fbtn fbtn--ghost" @tap="goPreviousFromComplete">返回修改</button>
        <button class="fbtn fbtn--primary" :disabled="finishing" @tap="generateReport">{{ finishing ? '生成中...' : '生成并查看报告' }}</button>
      </template>
      <template v-else>
        <button v-if="!isCurrentStageIntro" class="fbtn fbtn--ghost" :disabled="isPreviousDisabled" @tap="goPrevious">上一页</button>
        <button class="fbtn fbtn--primary" :disabled="isPrimaryDisabled" @tap="handlePrimary">{{ primaryLabel }}</button>
      </template>
    </view>

    <view v-if="finishing" class="finishing-mask">
      <text class="finishing-text">正在保存探索结果...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, getCurrentInstance, nextTick } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ALL_QUESTIONS, MBTI_KNOWN_QUESTION_ID, createEmptyCareerScenarioAnswer, isCareerScenarioValue } from '../../business/discover-questions'
import {
  CHAT_STAGES,
  getQuestionStageArtwork,
  PROGRESS_DIAMOND_ACTIVE,
  PROGRESS_DIAMOND_INACTIVE,
  STAGE_PROFILE_ARTWORK,
} from '../../business/discover-chat-stages'
import {
  CHAT_SCREEN_ORDER,
  SCREEN_QUESTION_IDS,
  boundedScreenIndex,
  findFirstScreenIndexWithQuestions,
  getProgressStageIndex,
  getProgressStageTargetScreenIndex,
  getQuestionsForScreen,
  getScreenStageIndex,
  getScreenTitle,
  isAbilityScreen,
  isAbilityOverviewScreen,
  isBatchScreen,
  isPersonalityScreen,
  isProgressStageClickable,
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
} from '../../business/profile-sync'
import { resolveAsset } from '../../utils/asset-map'
import ChatAssetImage from '../../components/ChatAssetImage/ChatAssetImage.vue'

const chatStages = CHAT_STAGES
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
const backNavigationFloorIndex = ref(null)
const ready = ref(false)
const primaryLabel = ref('下一步')
const finishing = ref(false)
const showComplete = ref(false)
const screenValidationMessage = ref('')
const profileFieldErrors = ref({})
const questionValidations = ref({})
const careerFieldErrors = ref({})
const scrollIntoView = ref('')
const scrollTop = ref(0)
const mbtiChoice = ref('unknown')
const selectedMbtiType = ref('')
const sessionAnswers = ref([])

/** 选答后稍停再滚，避免过快；滚动时保留上方一截上下文，避免顶到最头 */
const SCROLL_AFTER_ANSWER_MS = 100
const SCROLL_OFFSET_PX = 80

const questionMap = computed(() => {
  const map = new Map()
  for (const item of questions.value) map.set(item.id, item)
  return map
})
const currentScreenId = computed(() => CHAT_SCREEN_ORDER[screenIndex.value] || 'basic')
const screenQuestions = computed(() => getQuestionsForScreen(currentScreenId.value, questionMap.value))
const isCurrentStageIntro = computed(() => isStageIntroScreen(currentScreenId.value))
const isPersonalityStageIntro = computed(() => currentScreenId.value === 'stage-personality-intro')
const isCurrentAbilityOverview = computed(() => isAbilityOverviewScreen(currentScreenId.value))
const isCurrentBatchScreen = computed(() => isBatchScreen(currentScreenId.value))
const isPersonalityBatch = computed(() => isPersonalityScreen(currentScreenId.value))
const isAbilityBatch = computed(() => isAbilityScreen(currentScreenId.value))
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
const stageIntroConfigs = {
  'stage-interest-intro': {
    badge: '',
    title: '阶段一：兴趣探索',
    subtitle: '先了解你真正感兴趣的方向',
    artwork: CHAT_STAGES[0].artwork,
    iconSrc: '/explore-static/discover/figma/stage-interest-icon-figma-129-9258.png',
    shadowSrc: '',
    iconClass: '',
    iconWrapClass: '',
    primaryLabel: '开始兴趣探索',
    metrics: ['预计时长：大约5分钟', '题目数量：20题'],
    paragraphs: [],
  },
  'stage-personality-intro': {
    badge: '',
    title: '阶段二：性格测试',
    subtitle: '了解你的行为风格与适配环境',
    artwork: CHAT_STAGES[1].artwork,
    iconSrc: '/explore-static/discover/figma/stage-personality-icon-figma-129-8647.png',
    shadowSrc: '/explore-static/discover/figma/stage-personality-shadow-figma-129-8560.png',
    iconClass: '',
    iconWrapClass: '',
    primaryLabel: '进入性格测试',
    metrics: ['预计时长：约6分钟', '题目数量：28题'],
    paragraphs: [],
  },
  'stage-ability-intro': {
    badge: '',
    title: '阶段三：能力测试',
    subtitle: '识别你的优势能力与成长空间',
    artwork: '/images/explore/discover/generated/discover-question-scene-lota-city-background-rift-20260610-flat2d-r1.png',
    iconSrc: '/explore-static/discover/figma/stage-ability-icon-figma-129-8711.png',
    shadowSrc: '/explore-static/discover/figma/stage-ability-shadow-figma-129-8680.png',
    iconClass: '',
    iconWrapClass: '',
    primaryLabel: '开始能力测试',
    metrics: ['预计时长：大约5分钟', '题目数量：20题'],
    paragraphs: [
      '点击“开始能力测试”的一瞬间，屏幕里的进度条像被水面折弯。白光从题目边缘裂开，你和同行者一起跌进洛塔城月井旁；井壁上的蓝色灯石像潮水一样一圈圈亮起，远处暮桥的门闩正在落下。',
      '守桥人只给外乡人一个傍晚：夜灯全亮前拿到通行证并抵达桥口，否则城门会封到第二天。你的手机没有信号，测试页只剩一行发亮的提示；石阶下压着一本旧笔记，像是之前的探险家遗留下来的。',
      '纸页残破不全，上面夹着几组洛塔语注释、菜单、地图、药杯和回执的潦草草图。你需要一边读懂规则，一边赶在夜灯亮尽前找到最合理的答案。',
    ],
  },
  'stage-career-intro': {
    badge: '',
    title: '阶段四：职业倾向',
    subtitle: '匹配更适合你的职业方向',
    artwork: CHAT_STAGES[3].artwork,
    iconSrc: '/explore-static/discover/figma/stage-career-icon-figma-129-8628.png',
    shadowSrc: '/explore-static/discover/figma/stage-career-shadow-figma-129-8724.png',
    iconClass: 'stage-intro-icon stage-intro-icon--career',
    iconWrapClass: 'stage-intro-icon-wrap stage-intro-icon-wrap--career',
    primaryLabel: '进入职业倾向',
    metrics: ['预计时长：大约9分钟', '场景数量：6个'],
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
  'ability-surakarta-intro': {
    title: '苏拉卡尔塔棋：在回路里捕捉对手',
    subtitle: '进入棋局推理前，先用一页规则说明把移动、旋吃和阻挡关系讲清楚。',
    artwork: '/images/explore/discover/generated/discover-question-scene-surakarta-step-count-20260610-flat2d-r1.png',
    paragraphs: [
      '苏拉卡尔塔棋是一种来自印度尼西亚爪哇地区的双人抽象策略棋。本页只使用标准 6 x 6 交点棋盘：棋子落在交点上，四角外侧有内、外两套弧形回路；普通移动走网格，回路只在吃子时使用。',
      '双方轮流行动，每回合移动自己的一枚棋子。普通移动可以走到周围八个方向的相邻空交点，包括横、竖和斜向一格；终点只要已有棋子，无论敌我，都不能落子，普通移动也不能吃子。',
      '吃子叫旋吃：棋子必须沿横线或竖线进入至少一个角部回路，再沿线抵达路径上遇到的第一枚敌方棋子。路径中间只能经过空点；回路前碰到棋子，或回路后先碰到己方棋子，都会被挡住。',
    ],
    modules: [
      { title: '普通移动', body: '棋子每次可以走到相邻空交点，横向、纵向、斜向一格都可以；已有棋子的交点不能落子。' },
      { title: '旋吃回路', body: '吃子必须先沿横线或竖线进入回路，完成回路后，路径上遇到的第一枚敌方棋子才是可吃目标。' },
      { title: '连续博弈', body: '一步普通移动可能是在为后面的旋吃铺路。每次双方行动后，都要重新观察线路是否被打开或被阻挡。' },
    ],
    primaryLabel: '进入棋局推理',
  },
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
const progressStageScreens = [
  ['interest-1', 'interest-2', 'interest-3'],
  ['personality-1', 'personality-2', 'personality-3', 'personality-4'],
  ['ability-1', 'ability-2', 'ability-3', 'ability-surakarta-intro', 'ability-4', 'ability-5'],
  ['career-1', 'career-2', 'career-3', 'career-4', 'career-5', 'career-6'],
]
const stageProgressRatio = computed(() => {
  if (showComplete.value) return 1
  const stageScreens = progressStageScreens[activeStageIndex.value] || []
  if (!stageScreens.length) return 0
  const currentPageIndex = stageScreens.indexOf(currentScreenId.value)
  if (currentPageIndex < 0) return 0
  return Math.max(0, Math.min(1, currentPageIndex / stageScreens.length))
})

const phaseLabel = computed(() => {
  const idx = showComplete.value
    ? chatStages.length - 1
    : getProgressStageIndex(currentScreenId.value, false)
  return CHAT_STAGES[idx]?.label || CHAT_STAGES[0].label
})
const activeStageIndex = computed(() => (
  showComplete.value
    ? chatStages.length - 1
    : getProgressStageIndex(currentScreenId.value, false)
))
const stageFillPct = computed(() => {
  if (showComplete.value) return 100
  const segmentCount = Math.max(chatStages.length - 1, 1)
  return ((activeStageIndex.value + stageProgressRatio.value) / segmentCount) * 100
})
const stageFillWidth = computed(() => `calc((100% - 68rpx) * ${stageFillPct.value / 100})`)
const progressDiamondActive = computed(() => resolveAsset(PROGRESS_DIAMOND_ACTIVE))
const progressDiamondInactive = computed(() => resolveAsset(PROGRESS_DIAMOND_INACTIVE))
const showStageArtwork = computed(() => {
  if (!q.value || isCurrentBatchScreen.value) return false
  if (q.value.id === 'basic-profile') return false
  return q.value.type !== 'interest-tag-grid' && q.value.type !== 'career-scenario'
})
const isPrimaryDisabled = computed(() => (
  finishing.value
  || (isPersonalityStageIntro.value && mbtiChoice.value === 'known' && !selectedMbtiType.value)
))
const stageArtworkPath = computed(() => {
  if (showComplete.value) return CHAT_STAGES[chatStages.length - 1]?.artwork || CHAT_STAGES[3].artwork
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
    || current.type === 'scenario-pair'
    || current.type === 'multi-select'
})
const isPreviousDisabled = computed(() => (
  !showComplete.value
  && backNavigationFloorIndex.value !== null
  && screenIndex.value <= backNavigationFloorIndex.value
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

function isStageClickable(stageIndex) {
  if (!isProgressStageClickable(stageIndex, activeStageIndex.value, showComplete.value)) return false
  return true
}

function getScreenIndexById(screenId) {
  const idx = CHAT_SCREEN_ORDER.indexOf(screenId)
  return idx >= 0 ? idx : 0
}

function focusFirstQuestionInCurrentScreen() {
  const firstQuestion = screenQuestions.value[0]
  if (!firstQuestion || !firstQuestion.id) return
  scrollToAnchor(`anchor-q-${firstQuestion.id}`, { delay: 60, offset: 48 })
}

function onStageTap(stageIndex) {
  if (!isStageClickable(stageIndex)) return
  jumpToProgressStage(stageIndex)
}

function jumpToProgressStage(stageIndex, options) {
  const opts = options || {}
  saveScreenAnswers()
  clearValidation()
  showComplete.value = false

  const previousScreenIndex = boundedScreenIndex(screenIndex.value, screenTotal)
  const targetScreenIndex = getProgressStageTargetScreenIndex(stageIndex)
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

function goToNextScreen() {
  if (finishing.value || showComplete.value) return
  if (!validateCurrentScreen()) return
  const previousScreenId = currentScreenId.value
  saveScreenAnswers()
  if (screenIndex.value >= screenTotal - 1) {
    showComplete.value = true
    resetScrollPosition()
    return
  }
  const s = loadDiscoverSession()
  s.currentQuestionIndex = screenIndex.value + 1
  s.backNavigationFloorIndex = backNavigationFloorIndex.value
  saveDiscoverSession(s)
  screenIndex.value++
  loadScreen(s)
  resetScrollPosition()
  if (previousScreenId === 'ability-surakarta-intro' && currentScreenId.value === 'ability-4') {
    nextTick(() => {
      focusFirstQuestionInCurrentScreen()
    })
  }
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

function emptyProfileFields(question) {
  const fields = {}
  for (const field of question.profileFields || []) {
    if (field.type === 'multi') fields[field.id] = []
    else fields[field.id] = ''
  }
  return fields
}

function bootstrapPage() {
  if (!questions.value.length) {
    uni.showToast({ title: '题库加载失败，请重新编译', icon: 'none' })
    return
  }
  const session = loadDiscoverSession()
  sessionAnswers.value = Array.isArray(session.answers) ? session.answers.slice() : []
  backNavigationFloorIndex.value = normalizeBackNavigationFloorIndex(session.backNavigationFloorIndex)
  if (session.phase === 'results' && session.profile) {
    uni.redirectTo({ url: '/pages/discover/results' })
    return
  }
  screenIndex.value = boundedScreenIndex(session.currentQuestionIndex, screenTotal)
  loadScreen(session)
}

function loadScreen(session) {
  const s = session || loadDiscoverSession()
  sessionAnswers.value = Array.isArray(s.answers) ? s.answers.slice() : []
  if (isCurrentStageIntro.value) {
    if (isPersonalityStageIntro.value) {
      const knownTypeAnswer = (s.answers || []).find((answer) => answer.questionId === MBTI_KNOWN_QUESTION_ID)
      const knownType = typeof knownTypeAnswer?.value === 'string' ? knownTypeAnswer.value.trim().toUpperCase() : ''
      if (MBTI_TYPES.includes(knownType)) {
        mbtiChoice.value = 'known'
        selectedMbtiType.value = knownType
      } else {
        mbtiChoice.value = 'unknown'
        selectedMbtiType.value = ''
      }
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
    clearValidation()
    ready.value = true
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
    clearValidation()
    ready.value = true
    primaryLabel.value = currentAbilityOverview.value.primaryLabel
    resetScrollPosition()
    return
  }
  let sqs = screenQuestions.value
  if (!sqs.length) {
    const fallbackIndex = findFirstScreenIndexWithQuestions(questionMap.value)
    if (fallbackIndex !== screenIndex.value) {
      screenIndex.value = fallbackIndex
      s.currentQuestionIndex = fallbackIndex
      saveDiscoverSession(s)
      sqs = screenQuestions.value
    }
    if (!sqs.length) {
      uni.showToast({ title: '问卷步骤配置异常，请重新编译', icon: 'none' })
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
    ready.value = true
    primaryLabel.value = isPersonalityStageIntro.value && mbtiChoice.value === 'known'
      ? '跳过性格测试'
      : currentStageIntro.value.primaryLabel
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
  primaryLabel.value = screenIndex.value >= screenTotal - 1 ? '完成' : '下一步'
}

function setBatchAnswer(questionId, optionId) {
  batchValues.value = Object.assign({}, batchValues.value, { [questionId]: optionId })
  clearQuestionValidation(questionId)
  checkReady()
  afterBatchAnswer(questionId)
}

function getVal() {
  const current = q.value
  if (!current) return ''
  if (current.type === 'profile-form') return { fields: { ...pfFields.value } }
  if (current.type === 'multi-select' || current.type === 'interest-tag-grid') return multiVal.value.slice()
  if (current.type === 'free-text') return { text: textVal.value }
  if (current.type === 'slider') return slideVal.value
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
  if (finishing.value) return
  if (isPersonalityStageIntro.value) {
    if (mbtiChoice.value === 'known') {
      if (!selectedMbtiType.value) return
      saveKnownMbtiAnswer(selectedMbtiType.value)
      // 已选择“跳过性格测试”时，进入能力测试后允许返回到性格测试介绍页，
      // 但不能再进入任何性格测试题目页。
      jumpToProgressStage(2, {
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
    uni.switchTab({ url: '/pages/discover/index' })
    return
  }
  const personalityIntroScreenIndex = getScreenIndexById('stage-personality-intro')
  const targetScreenIndex = screenIndex.value - 1
  const targetScreenId = CHAT_SCREEN_ORDER[targetScreenIndex] || ''
  const shouldJumpBackToPersonalityIntro = (
    backNavigationFloorIndex.value === personalityIntroScreenIndex
    && isAbilityScreen(currentScreenId.value)
    && isPersonalityScreen(targetScreenId)
  )
  if (backNavigationFloorIndex.value !== null && !shouldJumpBackToPersonalityIntro && targetScreenIndex < backNavigationFloorIndex.value) return
  screenIndex.value = shouldJumpBackToPersonalityIntro ? personalityIntroScreenIndex : targetScreenIndex
  const s = loadDiscoverSession()
  s.currentQuestionIndex = screenIndex.value
  s.backNavigationFloorIndex = backNavigationFloorIndex.value
  saveDiscoverSession(s)
  loadScreen(null)
}

function restart() {
  resetDiscoverSession()
  clearExploreBackendSession()
  clearProfileUploadFlag()
  clearDiscoverReportCache()
  showComplete.value = false
  const s = Object.assign({}, emptyDiscoverSession, { phase: 'chatting' })
  saveDiscoverSession(s)
  sessionAnswers.value = []
  backNavigationFloorIndex.value = null
  screenIndex.value = 0
  loadScreen(s)
}

function setMbtiChoice(choice) {
  mbtiChoice.value = choice
  if (choice !== 'known') selectedMbtiType.value = ''
  checkReady()
}

function selectMbtiType(type) {
  selectedMbtiType.value = type
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
  if (options && (options.retake === '1' || options.retake === 'true')) {
    restart()
    return
  }
  bootstrapPage()
})

onShow(() => {
  bootstrapPage()
})
</script>

<style scoped>
.page { display: flex; flex-direction: column; height: 100vh; background: #f3f7fb; }
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 26rpx 24rpx 14rpx; background: #fff; }
.topbar-spacer { width: 120rpx; }
.topbar-action { width: 120rpx; font-size: 26rpx; color: #475569; }
.topbar-action--right { text-align: right; }
.topbar-center { flex: 1; text-align: center; }
.phase-title { display: block; font-size: 28rpx; font-weight: 700; color: #0f172a; }
.progress-text { display: block; margin-top: 6rpx; font-size: 22rpx; color: #64748b; }
.stage-progress { padding: 8rpx 24rpx 20rpx; background: #fff; }
.stage-track { position: relative; height: 68rpx; }
.stage-track-bg { position: absolute; left: 34rpx; right: 34rpx; top: 28rpx; height: 24rpx; border-radius: 999rpx; background: #e5e5e5; }
.stage-fill { position: absolute; left: 34rpx; top: 28rpx; height: 24rpx; border-radius: 999rpx; background: linear-gradient(90deg, #e7c2ff, #9762ff); transition: width 0.25s ease; max-width: calc(100% - 68rpx); }
.stage-dots { position: relative; display: flex; justify-content: space-between; padding: 0 17rpx; }
.stage-dot-wrap { width: 68rpx; display: flex; justify-content: center; }
.stage-dot-wrap--clickable { cursor: pointer; }
.stage-dot { width: 56rpx; height: 56rpx; border-radius: 50%; background: #d8d8d8; box-sizing: border-box; display: flex; align-items: center; justify-content: center; padding: 10rpx; }
.stage-dot-wrap--clickable .stage-dot { box-shadow: 0 0 0 3rpx rgba(151, 98, 255, 0.28); }
.stage-dot--on { background: #9762ff; }
.stage-diamond { width: 34rpx; height: 34rpx; }
.stage-labels { display: flex; justify-content: space-between; margin-top: 8rpx; }
.stage-label { flex: 1; text-align: center; font-size: 20rpx; font-weight: 700; color: #999; line-height: 1.3; }
.stage-label--on { color: #283248; }
.stage-label--clickable { color: #6b23ff; }
.content { flex: 1; height: 0; padding: 24rpx 24rpx 200rpx; box-sizing: border-box; }
.question-card { background: #fff; border-radius: 28rpx; padding: 32rpx 28rpx; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.06); }
.stage-intro-card {
  padding: 44rpx 32rpx 40rpx;
  text-align: center;
  background: linear-gradient(180deg, #e0c9fe 0%, #f4f6f8 37.563%, #f4f6f8 100%);
}
.stage-intro-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(255,255,255,0.72);
  color: #6b23ff;
  font-size: 24rpx;
  font-weight: 700;
}
.stage-intro-title {
  display: block;
  margin-top: 28rpx;
  font-size: 48rpx;
  line-height: 1.45;
  color: #283248;
  font-weight: 700;
}
.stage-intro-subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 28rpx;
  line-height: 1.8;
  color: #4b4b4b;
}
.stage-intro-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220rpx;
  margin-top: 28rpx;
}
.stage-intro-icon-wrap {
  width: 248rpx;
  height: 180rpx;
  min-height: 180rpx;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.stage-intro-icon {
  width: 180rpx;
  height: 180rpx;
  display: block;
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
.stage-intro-shadow {
  width: 220rpx;
  height: 36rpx;
  display: block;
}
.stage-intro-image-wrap {
  width: 100%;
  min-height: 320rpx;
  border-radius: 24rpx;
  overflow: hidden;
  background: rgba(255,255,255,0.68);
}
.stage-intro-image { width: 100%; height: 320rpx; display: block; }
.stage-intro-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  min-height: 108rpx;
  margin-top: 28rpx;
  padding: 0 28rpx;
  border-radius: 24rpx;
  background: #fff;
  box-shadow: 0 10rpx 18rpx rgba(138,138,138,0.05);
}
.stage-intro-metric-text {
  flex: 1;
  display: block;
  font-size: 28rpx;
  line-height: 1.8;
  color: #000;
  font-weight: 700;
}
.stage-intro-copy { display: flex; flex-direction: column; gap: 18rpx; margin-top: 28rpx; }
.stage-intro-copy-text { display: block; font-size: 27rpx; line-height: 1.82; color: #4b5563; text-align: left; }
.stage-intro-card--overview { padding-bottom: 44rpx; }
.rule-module-list { display: flex; flex-direction: column; gap: 18rpx; margin-top: 30rpx; }
.rule-module-card { padding: 24rpx 24rpx 22rpx; border-radius: 20rpx; background: #f8fafc; border: 2rpx solid #e2e8f0; }
.rule-module-title { display: block; font-size: 30rpx; line-height: 1.45; color: #283248; font-weight: 700; }
.rule-module-body { display: block; margin-top: 10rpx; font-size: 25rpx; line-height: 1.72; color: #4b5563; }
.question-head { display: flex; align-items: center; justify-content: space-between; }
.question-badge { padding: 10rpx 20rpx; border-radius: 999rpx; background: #f3edff; color: #6b23ff; font-size: 22rpx; font-weight: 700; }
.question-index { font-size: 22rpx; color: #64748b; }
.stage-artwork-wrap,
.question-image-wrap,
.puzzle-image-wrap,
.career-scene-wrap { margin-top: 20rpx; min-height: 280rpx; border-radius: 20rpx; overflow: hidden; }
.stage-artwork-img { width: 100%; height: 280rpx; display: block; }
.question-image-wrap { min-height: 320rpx; }
.question-image-img { width: 100%; height: 320rpx; display: block; border-radius: 20rpx; }
.puzzle-image-wrap { min-height: 240rpx; margin-bottom: 18rpx; }
.puzzle-image { width: 100%; height: auto; display: block; border-radius: 20rpx; }
.profile-hero { display: flex; justify-content: center; margin: 8rpx 0 28rpx; }
.profile-hero-wrap { width: 168rpx; height: 168rpx; min-height: 168rpx; border-radius: 24rpx; }
.profile-hero-img { width: 192rpx; height: 192rpx; display: block; }
.ability-card { margin-top: 24rpx; border-radius: 24rpx; border: 2rpx solid #dbeafe; background: #f8fbff; padding: 24rpx; }
.ability-series { display: block; text-align: center; font-size: 22rpx; color: #3b82f6; font-weight: 700; }
.ability-title { display: block; margin-top: 10rpx; font-size: 32rpx; color: #0f172a; font-weight: 700; }
.ability-line { display: block; margin-top: 14rpx; padding: 18rpx 20rpx; border-radius: 18rpx; background: #fff; font-size: 26rpx; color: #334155; }
.puzzle-block { margin-top: 20rpx; padding: 20rpx; border-radius: 20rpx; background: #f8fafc; border: 2rpx solid #e2e8f0; }
.puzzle-scene { display: block; font-size: 26rpx; line-height: 1.75; color: #334155; white-space: pre-wrap; }
.puzzle-table-wrap { margin-top: 20rpx; border-radius: 12rpx; overflow: hidden; border: 2rpx solid #cbd5e1; }
.puzzle-table-row { display: flex; flex-direction: row; }
.puzzle-table-head { background: #e2e8f0; }
.puzzle-table-cell { flex: 1; padding: 14rpx 10rpx; font-size: 22rpx; color: #0f172a; border-right: 1rpx solid #cbd5e1; word-break: break-all; }
.puzzle-table-cell:last-child { border-right: none; }
.puzzle-hint { display: block; margin-top: 16rpx; font-size: 24rpx; color: #0369a1; line-height: 1.6; }
.question-title { display: block; margin-top: 24rpx; font-size: 40rpx; line-height: 1.4; color: #0f172a; font-weight: 700; }
.question-subtext { display: block; margin-top: 16rpx; font-size: 26rpx; line-height: 1.7; color: #64748b; }
.question-body { margin-top: 8rpx; }
.profile-form { margin-top: 0; }
.field-card { margin-bottom: 20rpx; padding: 22rpx; border-radius: 20rpx; background: #f8fafc; }
.field-card--text { background: transparent; padding: 0 0 20rpx; }
.field-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14rpx; }
.field-label { display: block; font-size: 28rpx; color: #283248; font-weight: 700; line-height: 1.5; }
.field-meta { font-size: 22rpx; color: #64748b; }
.text-input {
  width: 100%;
  height: 96rpx;
  margin-top: 16rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  border-radius: 16rpx;
  background: #fff;
  border: 3rpx solid #e5e5e5;
  box-shadow: 0 4rpx 0 #e5e5e5;
  font-size: 30rpx;
  color: #4b4b4b;
  line-height: 96rpx;
}
.text-input-placeholder { color: #afafaf; font-size: 30rpx; line-height: 1.4; }
.textarea { width: 100%; min-height: 240rpx; padding: 20rpx 22rpx; box-sizing: border-box; border-radius: 16rpx; background: #fff; border: 2rpx solid #dbe4ee; font-size: 28rpx; color: #0f172a; }
.tag-grid { display: flex; flex-wrap: wrap; gap: 14rpx; margin-top: 24rpx; }
.tag-tile { width: calc(50% - 7rpx); box-sizing: border-box; display: flex; flex-direction: column; align-items: center; padding: 22rpx 18rpx 18rpx; border-radius: 12rpx; border: 3rpx solid #e5e5e5; background: #fff; box-shadow: 0 4rpx 0 #e5e5e5; }
.tag-tile--on { border-color: rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.tag-icon-wrap { width: 112rpx; height: 112rpx; border-radius: 28rpx; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.tag-icon-inner { width: 92rpx; height: 92rpx; min-height: 92rpx; }
.tag-icon { width: 92rpx; height: 92rpx; display: block; }
.tag-label-wrap { margin-top: 16rpx; width: 100%; min-height: 68rpx; display: flex; align-items: center; justify-content: center; border-radius: 8rpx; border: 2rpx solid #e5e5e5; background: #fff; padding: 8rpx 10rpx; box-sizing: border-box; }
.tag-label-wrap--on { border-color: #d5bdff; background: rgba(107,35,255,0.06); }
.tag-label { font-size: 30rpx; color: #4b4b4b; font-weight: 700; line-height: 1.35; text-align: center; }
.tag-tile--on .tag-label { color: #6b23ff; font-weight: 700; }
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
  border-radius: 8rpx;
  border: 3rpx solid #e5e5e5;
  background: #fff;
  box-shadow: 0 4rpx 0 #e5e5e5;
}
.career-item-tile-text { font-size: 26rpx; line-height: 1.35; color: #4b4b4b; font-weight: 500; text-align: center; word-break: break-word; }
.career-item-tile--picked { border-color: #e5e5e5; background: #e5e5e5; box-shadow: 0 4rpx 0 #e5e5e5; }
.career-item-tile--picked .career-item-tile-text { color: #afafaf; }
.career-item-pool--err .career-item-tile:not(.career-item-tile--picked) { border-color: #ff4d4f; background: #fff5f5; box-shadow: 0 4rpx 0 #ffb3b3; }
.career-item-pool--err .career-item-tile:not(.career-item-tile--picked) .career-item-tile-text { color: #4b4b4b; }
.career-opt--row { align-items: flex-start; }
.career-opt--row .opt-p { margin-top: 4rpx; flex-shrink: 0; }
.career-opt--row .opt-l { flex: 1; min-width: 0; word-break: break-word; white-space: normal; line-height: 1.55; }
.career-opt { border: 3rpx solid #e5e5e5; box-shadow: 0 4rpx 0 #e5e5e5; }
.career-items-interactive--dragging { position: relative; z-index: 4; }
.career-rank-selected { position: relative; width: 100%; margin-top: 20rpx; box-sizing: border-box; }
.career-rank-grid { display: flex; flex-direction: column; flex-wrap: nowrap; gap: 12rpx; width: 100%; }
.career-rank-slot-wrap { width: 100%; box-sizing: border-box; }
.career-rank-selected .career-rank-slot { width: 100%; min-width: 0; min-height: 88rpx; box-sizing: border-box; display: flex; align-items: center; justify-content: flex-start; gap: 18rpx; padding: 18rpx 18rpx; border-radius: 8rpx; border: 3rpx solid rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.career-rank-slot { position: relative; touch-action: none; }
.career-rank-slot--on { border-color: rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.career-rank-slot--empty { border-color: #e5e5e5; background: #fff; box-shadow: 0 4rpx 0 #e5e5e5; align-items: center; justify-content: center; }
.career-rank-slot--placeholder-active { opacity: 0.28; }
.career-rank-slot--drop { border-color: #6b23ff; background: #ede5ff; box-shadow: 0 0 0 2rpx rgba(107,35,255,0.25), 0 4rpx 0 #9762ff; }
.career-rank-slot-empty { font-size: 24rpx; line-height: 1.45; color: #afafaf; font-weight: 700; text-align: center; }
.career-rank-ghost { position: fixed; z-index: 1200; pointer-events: none; min-height: 88rpx; box-sizing: border-box; display: flex; align-items: center; justify-content: flex-start; gap: 18rpx; padding: 18rpx 16rpx; border-radius: 8rpx; border: 3rpx solid #6b23ff; background: #f3edff; box-shadow: 0 8rpx 24rpx rgba(107,35,255,0.22), 0 4rpx 0 #9762ff; }
.career-item-pool--drop-active { border-radius: 12rpx; background: rgba(107,35,255,0.05); box-shadow: inset 0 0 0 2rpx rgba(107,35,255,0.28); }
.career-rank-slot-order { width: 40rpx; height: 40rpx; border-radius: 50%; background: #fff; color: #6b23ff; font-size: 22rpx; line-height: 40rpx; font-weight: 700; text-align: center; flex-shrink: 0; }
.career-rank-slot-text { font-size: 24rpx; line-height: 1.45; color: #6b23ff; font-weight: 700; text-align: left; flex: 1; min-width: 0; word-break: break-word; }
.career-rank-hint { display: block; margin-top: 12rpx; font-size: 22rpx; line-height: 1.5; color: #94a3b8; }
.stage-mbti-wrap { display: flex; flex-direction: column; gap: 18rpx; margin-top: 30rpx; }
.stage-mbti-card { padding: 24rpx; border-radius: 20rpx; background: #fff; border: 2rpx solid #efe7ff; box-shadow: 0 8rpx 24rpx rgba(107,35,255,0.06); }
.stage-mbti-card--selector { background: #faf7ff; }
.stage-mbti-card--disclaimer { background: rgba(170,168,241,0.18); }
.stage-mbti-title { display: block; font-size: 28rpx; line-height: 1.5; color: #283248; font-weight: 700; }
.stage-mbti-choice-row { display: flex; gap: 16rpx; margin-top: 18rpx; }
.stage-mbti-choice { flex: 1; display: flex; align-items: center; justify-content: center; min-height: 84rpx; border-radius: 18rpx; border: 3rpx solid #e5e5e5; background: #fff; box-shadow: 0 4rpx 0 #e5e5e5; }
.stage-mbti-choice--on { border-color: rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.stage-mbti-choice-text { font-size: 28rpx; line-height: 1.4; color: #4b4b4b; font-weight: 700; }
.stage-mbti-choice--on .stage-mbti-choice-text { color: #6b23ff; }
.stage-mbti-grid { display: flex; flex-wrap: wrap; gap: 14rpx; margin-top: 18rpx; }
.stage-mbti-pill { width: calc(25% - 11rpx); min-height: 72rpx; display: flex; align-items: center; justify-content: center; border-radius: 16rpx; border: 3rpx solid #ece8f8; background: #f4f1ff; box-sizing: border-box; }
.stage-mbti-pill--on { border-color: rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.stage-mbti-pill-text { font-size: 24rpx; line-height: 1.4; color: #4b4b4b; font-weight: 700; }
.stage-mbti-pill--on .stage-mbti-pill-text { color: #6b23ff; }
.stage-mbti-disclaimer { display: block; font-size: 24rpx; line-height: 1.75; color: #4b4b4b; }
.batch-section-title { display: block; margin-top: 28rpx; font-size: 36rpx; line-height: 1.45; color: #283248; font-weight: 700; }
.batch-section-desc { display: block; margin-top: 16rpx; font-size: 28rpx; line-height: 1.75; color: #666; font-weight: 500; }
.batch-block { margin-top: 48rpx; padding-bottom: 48rpx; border-bottom: 2rpx solid #f1f5f9; }
.batch-block:first-of-type { margin-top: 32rpx; }
.batch-block:last-child { padding-bottom: 8rpx; border-bottom: none; }
.batch-block-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20rpx; margin-bottom: 28rpx; }
.personality-question-image-wrap { margin: 0 0 24rpx; min-height: 260rpx; border-radius: 20rpx; overflow: hidden; background: #f8fafc; }
.personality-question-image { width: 100%; height: 260rpx; display: block; }
.batch-block-title { flex: 1; font-size: 32rpx; line-height: 1.55; color: #283248; font-weight: 700; }
.batch-block-meta { flex-shrink: 0; padding: 8rpx 16rpx; border-radius: 999rpx; background: #f4f0ff; color: #6b23ff; font-size: 22rpx; font-weight: 700; line-height: 1.2; }
.batch-block-prompt { display: block; margin-top: 28rpx; font-size: 32rpx; line-height: 1.55; color: #283248; font-weight: 700; }
.batch-opt-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 8rpx; }
.batch-opt-grid--stack { flex-direction: column; flex-wrap: nowrap; gap: 14rpx; }
.batch-opt-grid--stack .batch-opt { width: 100%; box-sizing: border-box; }
.batch-opt { padding: 20rpx 22rpx; align-items: flex-start; }
.batch-opt .opt-p { min-width: 44rpx; height: 44rpx; line-height: 44rpx; font-size: 22rpx; margin-top: 2rpx; flex-shrink: 0; }
.batch-opt .opt-l { flex: 1; min-width: 0; font-size: 28rpx; font-weight: 500; color: #4b4b4b; line-height: 1.55; word-break: break-word; white-space: normal; }
.batch-block--ability .ability-card { margin-top: 0; }
.batch-block--ability .puzzle-block { margin-top: 24rpx; }
.career-rank-divider { height: 2rpx; background: #e5e5e5; margin: 20rpx 0 0; }
.career-open-field { margin-top: 28rpx; }
.career-open-label { display: block; font-size: 34rpx; line-height: 1.45; color: #283248; font-weight: 700; }
.career-textarea { margin-top: 16rpx; min-height: 320rpx; border: 3rpx solid #e5e5e5; box-shadow: 0 4rpx 0 #e5e5e5; border-radius: 8rpx; }
.opt2col { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 16rpx; }
.profile-multi-grid { display: flex; flex-wrap: wrap; gap: 16rpx; margin-top: 16rpx; }
.profile-multi-grid .opt { width: calc(50% - 8rpx); box-sizing: border-box; }
.text-input--err { border-color: #ff4d4f; box-shadow: 0 4rpx 0 #ffb3b3; }
.career-textarea--err { border-color: #ff4d4f; box-shadow: 0 4rpx 0 #ffb3b3; }
.validation-banner { margin-top: 24rpx; padding: 20rpx 24rpx; border-radius: 12rpx; background: #fff5f5; border: 2rpx solid #ff4d4f; }
.validation-banner--inline { margin: 16rpx 0 0; }
.validation-banner-text { display: block; font-size: 26rpx; line-height: 1.6; color: #ff4d4f; font-weight: 700; }
.opt2col .opt { width: calc(50% - 8rpx); box-sizing: border-box; }
.optlist { display: flex; flex-direction: column; gap: 16rpx; margin-top: 24rpx; }
.opt--full { width: 100%; }
.opt { display: flex; align-items: center; gap: 14rpx; padding: 20rpx; border-radius: 20rpx; border: 3rpx solid #e5e5e5; background: #fff; box-shadow: 0 4rpx 0 #e5e5e5; }
.opt--on { border-color: rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.opt--on .opt-p { background: #fff; color: #6b23ff; }
.opt--on .opt-l { color: #6b23ff; font-weight: 700; }
.opt.career-opt.career-opt--on,
.opt.career-opt.career-opt--row.career-opt--on { border-color: rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.opt.career-opt.career-opt--on .opt-p,
.opt.career-opt.career-opt--row.career-opt--on .opt-p { background: #fff; color: #6b23ff; }
.opt.career-opt.career-opt--on .opt-l,
.opt.career-opt.career-opt--row.career-opt--on .opt-l { color: #6b23ff; font-weight: 700; }
.batch-opt.opt--on { border-color: rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.batch-opt.opt--on .opt-l { color: #6b23ff; font-weight: 700; }
.opt--err { border-color: #ff4d4f; background: #fff5f5; box-shadow: 0 4rpx 0 #ffb3b3; }
.opt--err .opt-p { background: #fff; color: #ff4d4f; border: 2rpx solid #ff4d4f; }
.opt--err .opt-l { color: #4b4b4b; }
.opt--on.opt--err { border-color: rgba(107,35,255,0.35); background: rgba(107,35,255,0.1); box-shadow: 0 4rpx 0 #9762ff; }
.opt--on.opt--err .opt-p { background: #fff; color: #6b23ff; border-color: #d5bdff; }
.opt--ok { border-color: #16a34a; background: #16a34a; box-shadow: 0 10rpx 24rpx rgba(22,163,74,0.2); }
.opt--ok .opt-p { background: #fff; color: #16a34a; }
.opt--ok .opt-l { color: #fff; }
.opt-p { min-width: 44rpx; height: 44rpx; line-height: 44rpx; border-radius: 50%; text-align: center; background: #e2e8f0; color: #334155; font-size: 22rpx; font-weight: 700; flex-shrink: 0; }
.opt-l { font-size: 28rpx; color: #0f172a; font-weight: 600; line-height: 1.5; flex: 1; }
.mt28 { margin-top: 28rpx; }
.srow { display: flex; justify-content: space-between; margin-bottom: 16rpx; }
.slabel { font-size: 24rpx; color: #64748b; }
.fb { margin-top: 22rpx; padding: 20rpx 22rpx; border-radius: 18rpx; }
.fb--ok { background: #f0fdf4; border: 2rpx solid #16a34a; }
.fb--err { background: #fef2f2; border: 2rpx solid #ef4444; }
.fb-text { font-size: 26rpx; line-height: 1.7; color: #0f172a; }
.footer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; display: flex; gap: 18rpx; padding: 18rpx 24rpx calc(18rpx + env(safe-area-inset-bottom)); background: #fff; box-shadow: 0 -8rpx 28rpx rgba(15,23,42,0.08); }
.fbtn { flex: 1; height: 88rpx; line-height: 88rpx; border-radius: 999rpx; font-size: 28rpx; font-weight: 700; border: none; }
.fbtn--ghost { background: #f1f5f9; color: #334155; }
.fbtn--ghost[disabled] { background: #e2e8f0; color: #94a3b8; box-shadow: none; opacity: 1; }
.fbtn--primary { background: #6b23ff; color: #fff; box-shadow: 0 6rpx 0 #3e0aa9; }
.fbtn--primary[disabled] { background: #e9e0ff; color: #9b7fd9; box-shadow: none; opacity: 1; }
.complete-card { background: #fff; border-radius: 28rpx; padding: 48rpx 36rpx; box-shadow: 0 16rpx 48rpx rgba(15,23,42,0.06); text-align: center; }
.complete-title { display: block; font-size: 40rpx; line-height: 1.45; color: #283248; font-weight: 700; }
.complete-subtitle { display: block; margin-top: 18rpx; font-size: 28rpx; line-height: 1.7; color: #4b4b4b; }
.complete-image-wrap { margin: 40rpx auto 0; width: 100%; max-width: 420rpx; min-height: 280rpx; border-radius: 24rpx; overflow: hidden; background: linear-gradient(180deg, #efe3ff 0%, #f8fafc 100%); }
.complete-image { width: 100%; height: 280rpx; display: block; }
.complete-desc { display: block; margin-top: 32rpx; font-size: 26rpx; line-height: 1.8; color: #64748b; }
.finishing-mask { position: fixed; inset: 0; z-index: 99; background: rgba(15,23,42,0.45); display: flex; align-items: center; justify-content: center; }
.finishing-text { color: #fff; font-size: 30rpx; font-weight: 600; }
</style>
