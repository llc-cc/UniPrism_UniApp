export const DISCOVER_ABILITY_MODULE_ENABLED_IN_ASSESSMENT = false;

export const DISCOVER_ABILITY_LOTA_QUESTION_IDS = [
  'ability-jinchao-lamp-1',
  'ability-jinchao-lamp-2',
  'ability-jinchao-lamp-3',
  'ability-jinchao-lamp-4',
  'ability-jinchao-lamp-6',
] as const;

export const DISCOVER_ABILITY_SURAKARTA_QUESTION_IDS = [
  'ability-surakarta-1-step-count',
  'ability-surakarta-2-capture-targets',
  'ability-surakarta-3-side-captures',
  'ability-surakarta-4-piece-legal-moves',
] as const;

export const DISCOVER_ABILITY_QUESTION_IDS = [
  ...DISCOVER_ABILITY_LOTA_QUESTION_IDS,
  ...DISCOVER_ABILITY_SURAKARTA_QUESTION_IDS,
] as const;

export const DISCOVER_ABILITY_INFORMATIONAL_SCREEN_IDS = [
  'ability',
  'ability-surakarta',
] as const;

export const DISCOVER_ABILITY_LOTA_SCREEN_IDS = [
  'ability-lota-1',
  'ability-lota-2',
  'ability-lota-3',
] as const;

export const DISCOVER_ABILITY_SURAKARTA_SCREEN_IDS = [
  'ability-surakarta-questions-1',
  'ability-surakarta-questions-2',
] as const;

export const DISCOVER_ABILITY_QUESTION_SCREEN_IDS = [
  ...DISCOVER_ABILITY_LOTA_SCREEN_IDS,
  ...DISCOVER_ABILITY_SURAKARTA_SCREEN_IDS,
] as const;

export const DISCOVER_ABILITY_SCREEN_ORDER = [
  'ability',
  ...DISCOVER_ABILITY_LOTA_SCREEN_IDS,
  'ability-surakarta',
  ...DISCOVER_ABILITY_SURAKARTA_SCREEN_IDS,
] as const;

export const DISCOVER_ABILITY_SCREEN_QUESTION_IDS = {
  'ability-lota-1': [...DISCOVER_ABILITY_LOTA_QUESTION_IDS.slice(0, 2)],
  'ability-lota-2': [...DISCOVER_ABILITY_LOTA_QUESTION_IDS.slice(2, 4)],
  'ability-lota-3': [...DISCOVER_ABILITY_LOTA_QUESTION_IDS.slice(4, 6)],
  'ability-surakarta-questions-1': [...DISCOVER_ABILITY_SURAKARTA_QUESTION_IDS.slice(0, 2)],
  'ability-surakarta-questions-2': [...DISCOVER_ABILITY_SURAKARTA_QUESTION_IDS.slice(2, 4)],
} as const;

const ABILITY_QUESTION_ID_SET = new Set<string>(DISCOVER_ABILITY_QUESTION_IDS);
const ABILITY_SCREEN_ID_SET = new Set<string>(DISCOVER_ABILITY_SCREEN_ORDER);

export type DiscoverAbilityQuestionId = (typeof DISCOVER_ABILITY_QUESTION_IDS)[number];
export type DiscoverAbilityScreenId = (typeof DISCOVER_ABILITY_SCREEN_ORDER)[number];
export type DiscoverAbilityQuestionScreenId = (typeof DISCOVER_ABILITY_QUESTION_SCREEN_IDS)[number];

export function isDiscoverAbilityQuestionId(questionId: string): questionId is DiscoverAbilityQuestionId {
  return ABILITY_QUESTION_ID_SET.has(questionId);
}

export function isDiscoverAbilityScreenId(screenId: string): screenId is DiscoverAbilityScreenId {
  return ABILITY_SCREEN_ID_SET.has(screenId);
}
