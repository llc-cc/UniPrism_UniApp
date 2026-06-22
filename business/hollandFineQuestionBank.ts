import bankData from '../data/holland-fine-grained-question-bank.json';
import type { RIASECDimension } from './riasecEngine';

export type HollandFineAnswerMode =
  | 'single'
  | 'primary-secondary'
  | 'multi'
  | 'ranked'
  | 'scale-pair'
  | 'open';

export interface HollandFineBankOption {
  id: string;
  key: string;
  label: string;
  riasecWeights: Partial<Record<RIASECDimension, number>>;
  personalityTags?: string[];
  hollandFineAxis?: {
    dimension: RIASECDimension;
    axisKey: string;
    axisLabel: string;
    side: 'left' | 'right';
    sideKey: string;
    sideLabel: string;
  };
}

export interface HollandFineOpenField {
  id: string;
  label: string;
  type: 'text';
  minLength?: number;
}

export interface HollandFineScaleAnchors {
  leftKey: string;
  leftLabel: string;
  rightKey: string;
  rightLabel: string;
}

export interface HollandFineBankItem {
  id: string;
  number?: number;
  prompt: string;
  mode: HollandFineAnswerMode;
  minSelections?: number;
  maxSelections?: number;
  rankWeights?: number[];
  options?: HollandFineBankOption[];
  scaleAnchors?: HollandFineScaleAnchors;
  axisKey?: string;
  axisLabel?: string;
  scoring?: {
    leftKey: string;
    leftLabel: string;
    rightKey: string;
    rightLabel: string;
  };
  scene?: string;
  sceneImageSrc?: string;
  openFields?: HollandFineOpenField[];
}

export interface HollandFineBankSection {
  id: string;
  title: string;
  mode: HollandFineAnswerMode;
  sectionIntro?: string;
  axisKey?: string;
  axisLabel?: string;
  leftLabel?: string;
  rightLabel?: string;
  items: HollandFineBankItem[];
}

export interface HollandFineDimensionData {
  code: RIASECDimension;
  label: string;
  sourcePath: string;
  sections: HollandFineBankSection[];
}

export const HOLLAND_FINE_QUESTION_BANK_VERSION =
  bankData.version;

const DIMENSION_LABELS: Record<RIASECDimension, string> = {
  R: '现实型 R',
  I: '研究型 I',
  A: '艺术型 A',
  S: '社会型 S',
  E: '企业型 E',
  C: '常规型 C',
};

function asDimension(value: string): RIASECDimension {
  return value as RIASECDimension;
}

function normalizeDimensionData(value: unknown, code: RIASECDimension): HollandFineDimensionData {
  const record = value as HollandFineDimensionData;
  return {
    code,
    label: record.label || DIMENSION_LABELS[code],
    sourcePath: record.sourcePath,
    sections: record.sections.map((section) => ({
      id: section.id,
      title: section.title,
      mode: section.mode,
      sectionIntro: section.sectionIntro,
      items: section.items.map((item) => ({
        ...item,
        options: item.options?.map((option) => ({
          ...option,
          riasecWeights: Object.fromEntries(
            Object.entries(option.riasecWeights ?? {}).map(([dim, score]) => [asDimension(dim), score]),
          ) as Partial<Record<RIASECDimension, number>>,
        })),
      })),
    })),
  };
}

export const HOLLAND_FINE_DIMENSION_DATA: Record<RIASECDimension, HollandFineDimensionData> = {
  R: normalizeDimensionData(bankData.dimensions.R, 'R'),
  I: normalizeDimensionData(bankData.dimensions.I, 'I'),
  A: normalizeDimensionData(bankData.dimensions.A, 'A'),
  S: normalizeDimensionData(bankData.dimensions.S, 'S'),
  E: normalizeDimensionData(bankData.dimensions.E, 'E'),
  C: normalizeDimensionData(bankData.dimensions.C, 'C'),
};

export const HOLLAND_FINE_DIMENSION_ORDER: RIASECDimension[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export function getHollandFineDimensionLabel(dimension: RIASECDimension) {
  return HOLLAND_FINE_DIMENSION_DATA[dimension]?.label ?? DIMENSION_LABELS[dimension];
}

export function getHollandFineSectionsForDimensions(dimensions: RIASECDimension[]) {
  const unique = Array.from(new Set(dimensions));
  return unique.flatMap((dimension) => HOLLAND_FINE_DIMENSION_DATA[dimension]?.sections ?? []);
}
