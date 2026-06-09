import {
  Answer,
  AnswerValue,
  Question,
  createEmptyCareerScenarioAnswer,
  isCareerScenarioValue,
} from './discover-questions';
import {
  computeRawScores,
  extractOpenEndedAnswers,
  extractPersonalityTraits,
} from './discover-questions';
import {
  computeProfile,
  matchMajors,
  type MajorMatch,
  type RIASECProfile,
  type RIASECScores,
} from './riasecEngine';
import { readStorage, removeStorage, writeStorage } from './storage';

const DISCOVER_SESSION_KEY = 'uniprism.mini.discoverSession';

export type DiscoverPhase = 'intro' | 'chatting' | 'results';

export type DiscoverSession = {
  phase: DiscoverPhase;
  currentQuestionIndex: number;
  answers: Answer[];
  profile: RIASECProfile | null;
  recommendedMajors: MajorMatch[] | null;
  personalityTraits: Record<string, number> | null;
  openEndedAnswers: Record<string, string>;
};

export const emptyDiscoverSession: DiscoverSession = {
  phase: 'intro',
  currentQuestionIndex: 0,
  answers: [],
  profile: null,
  recommendedMajors: null,
  personalityTraits: null,
  openEndedAnswers: {},
};

export function loadDiscoverSession(): DiscoverSession {
  return readStorage<DiscoverSession>(DISCOVER_SESSION_KEY, emptyDiscoverSession);
}

export function saveDiscoverSession(session: DiscoverSession) {
  writeStorage(DISCOVER_SESSION_KEY, session);
}

export function resetDiscoverSession() {
  removeStorage(DISCOVER_SESSION_KEY);
}

export function submitAnswer(session: DiscoverSession, questionId: string, value: AnswerValue): DiscoverSession {
  const answer: Answer = {
    questionId,
    value,
    timestamp: Date.now(),
  };
  return {
    ...session,
    answers: [...session.answers.filter((item) => item.questionId !== questionId), answer],
  };
}

export function computeDiscoverResults(session: DiscoverSession): DiscoverSession {
  const rawScores = computeRawScores(session.answers);
  const profile = computeProfile(rawScores);
  const recommendedMajors = matchMajors(rawScores, 3);
  return {
    ...session,
    phase: 'results',
    profile,
    recommendedMajors,
    personalityTraits: extractPersonalityTraits(session.answers),
    openEndedAnswers: extractOpenEndedAnswers(session.answers),
  };
}

export function skipDiscoverSession(): DiscoverSession {
  const defaultScores: RIASECScores = { R: 3, I: 8, A: 5, S: 4, E: 6, C: 2 };
  const profile = computeProfile(defaultScores);
  return {
    ...emptyDiscoverSession,
    phase: 'results',
    profile,
    recommendedMajors: matchMajors(defaultScores, 3),
    personalityTraits: { analytical: 3, creative: 2, leadership: 1 },
  };
}

export function getInitialAnswerValue(question: Question, answers: Answer[]): AnswerValue {
  const stored = answers.find((answer) => answer.questionId === question.id)?.value;
  if (stored !== undefined) return stored;
  if (question.type === 'profile-form') return { fields: {} };
  if (question.type === 'multi-select' || question.type === 'interest-tag-grid') return [];
  if (question.type === 'slider') return 50;
  if (question.type === 'free-text') return { text: '' };
  if (question.type === 'career-scenario') {
    return isCareerScenarioValue(stored) ? stored : createEmptyCareerScenarioAnswer();
  }
  return '';
}

function isTextAnswer(value: AnswerValue): value is { text: string } {
  return typeof value === 'object' && !Array.isArray(value) && 'text' in value;
}

function isProfileAnswer(value: AnswerValue): value is { fields: Record<string, string | string[]> } {
  return typeof value === 'object' && !Array.isArray(value) && 'fields' in value;
}

export function isAnswerReady(question: Question, value: AnswerValue) {
  if (question.type === 'profile-form') {
    if (!isProfileAnswer(value) || !question.profileFields?.length) return false;
    return question.profileFields.every((field) => {
      const fieldValue = value.fields[field.id];
      if (field.type === 'text') {
        return typeof fieldValue === 'string' && fieldValue.trim().length >= (field.minLength ?? 1);
      }
      if (field.type === 'multi') {
        const max = field.maxSelections ?? 3;
        return Array.isArray(fieldValue) && fieldValue.length === max;
      }
      return typeof fieldValue === 'string' && fieldValue.length > 0;
    });
  }
  if (question.type === 'multi-select') {
    const max = question.maxSelections ?? 3;
    return Array.isArray(value) && value.length === max;
  }
  if (question.type === 'interest-tag-grid') {
    return Array.isArray(value);
  }
  if (question.type === 'slider') return typeof value === 'number';
  if (question.type === 'free-text') {
    return isTextAnswer(value) && value.text.trim().length >= (question.minLength ?? 1);
  }
  if (question.type === 'career-scenario') {
    if (!isCareerScenarioValue(value) || !question.careerScenario) return false;
    const scenario = question.careerScenario;
    if (!value.firstChoiceId) return false;
    if (value.itemChoiceIds.length !== scenario.itemMaxSelections) return false;
    if (scenario.teamOptions?.length && !value.teamChoiceId) return false;
    for (const field of scenario.openFields) {
      if (!field.minLength) continue;
      if ((value.openResponses[field.id] ?? '').trim().length < field.minLength) return false;
    }
    return true;
  }
  return typeof value === 'string' && value.length > 0;
}

export function hasCorrectAnswer(question: Question) {
  return Boolean(question.options?.some((option) => typeof option.correct === 'boolean'));
}

export function isCorrectAnswer(question: Question, value: AnswerValue) {
  if (typeof value !== 'string') return false;
  return Boolean(question.options?.find((option) => option.id === value)?.correct);
}

export function boundedQuestionIndex(index: number, total: number) {
  const n = typeof index === 'number' && !isNaN(index) ? index : 0;
  if (total === 0) return 0;
  return Math.max(0, Math.min(total - 1, n));
}
