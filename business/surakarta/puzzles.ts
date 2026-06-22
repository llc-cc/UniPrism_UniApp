import type { Coord, Side, SurakartaPiece } from './core';

export type SurakartaPuzzleKind =
  | 'count_step_moves'
  | 'count_capture_targets'
  | 'count_side_captures'
  | 'count_piece_legal_moves'
  | 'mate_in_one'
  | 'forced_win_depth';

export type SurakartaPuzzle = {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  sideToMove: Side | null;
  board: { pieces: SurakartaPiece[] };
  prompt: {
    kind: SurakartaPuzzleKind;
    targetPiece?: Coord;
    side?: Side;
    depth?: number;
    text: string;
  };
  answer: {
    value?: number | string;
    coords?: Coord[];
    moves?: string[];
    stepMoves?: string[];
    captureMoves?: string[];
    firstMoves?: string[];
    strategy?: Record<string, string>;
    paths?: string[];
    explanation: string;
  };
  validation: {
    mode: 'number' | 'coord_set' | 'move_set' | 'strategy_tree';
    number?: number;
    depth?: number;
  };
};

export const SURAKARTA_PUZZLESET_V2 = {
  ruleset: 'standard-surakarta-6x6-v1',
  visualSpecVersion: 'surakarta-svg-reference-v2',
  topologyVersion: 'surakarta-loop-transitions-v2',
  countingPolicy: 'unique-from-target-shortest-path-for-explanation',
  validated: true,
  puzzles: [
    {
      id: 'surakarta-01-step-count',
      title: '题 1：基础邻移计数',
      difficulty: 1,
      sideToMove: null,
      board: {
        pieces: [
          { id: 'p1', side: 'B', at: 'C3' },
          { id: 'p2', side: 'W', at: 'B2' },
          { id: 'p3', side: 'B', at: 'C2' },
          { id: 'p4', side: 'W', at: 'D2' },
          { id: 'p5', side: 'W', at: 'B3' },
          { id: 'p6', side: 'B', at: 'D3' },
        ],
      },
      prompt: {
        kind: 'count_step_moves',
        targetPiece: 'C3',
        text: '黑棋在 C3 时，如果只按普通相邻移动、不使用回路吃子，有几种合法走法？',
      },
      answer: {
        value: 3,
        coords: ['B4', 'C4', 'D4'],
        moves: ['C3-B4', 'C3-C4', 'C3-D4'],
        explanation: 'C3 的 8 个邻点中，B2、C2、D2、B3、D3 已被棋子占据；剩余可落空点为 B4、C4、D4，共 3 种。',
      },
      validation: { mode: 'coord_set', number: 3 },
    },
    {
      id: 'surakarta-02-capture-targets',
      title: '题 2：单子旋吃目标判断',
      difficulty: 2,
      sideToMove: null,
      board: {
        pieces: [
          { id: 'p1', side: 'B', at: 'D4' },
          { id: 'p2', side: 'W', at: 'F3' },
          { id: 'p3', side: 'W', at: 'E4' },
          { id: 'p4', side: 'W', at: 'C6' },
          { id: 'p5', side: 'W', at: 'D6' },
        ],
      },
      prompt: {
        kind: 'count_capture_targets',
        targetPiece: 'D4',
        text: '黑棋 D4 当前可以旋吃到几枚白棋？',
      },
      answer: {
        value: 2,
        coords: ['F3', 'C6'],
        moves: ['D4xF3', 'D4xC6'],
        paths: ['D4xF3：D4-D3-D2-D1-右上外回路-F3。', 'D4xC6：D4-C4-B4-A4-左下外回路-C6。'],
        explanation: 'E4、D6 虽然是白棋，但它们处在未经过回路前的直线路径上，因此只会阻塞，不能作为合法吃子终点。',
      },
      validation: { mode: 'coord_set', number: 2 },
    },
    {
      id: 'surakarta-03-side-captures',
      title: '题 3：黑方全局旋吃数量',
      difficulty: 3,
      sideToMove: null,
      board: {
        pieces: [
          { id: 'p1', side: 'B', at: 'C3' },
          { id: 'p2', side: 'B', at: 'D4' },
          { id: 'p3', side: 'B', at: 'E4' },
          { id: 'p4', side: 'W', at: 'A3' },
          { id: 'p5', side: 'W', at: 'F3' },
          { id: 'p6', side: 'W', at: 'C6' },
          { id: 'p7', side: 'W', at: 'F5' },
        ],
      },
      prompt: {
        kind: 'count_side_captures',
        side: 'B',
        text: '黑方当前一共有多少个合法旋吃走法？',
      },
      answer: {
        value: 4,
        moves: ['C3xA3', 'D4xF3', 'D4xC6', 'E4xF5'],
        paths: [
          'C3xA3：C3-C2-C1-左上外回路-A3。',
          'D4xF3：D4-D3-D2-D1-右上外回路-F3。',
          'D4xC6：D4-C4-B4-A4-左下外回路-C6。',
          'E4xF5：E4-E5-E6-右下内回路-F5。',
        ],
        explanation: '本题按“唯一吃子走法 from x target”计数，不按多条等价路径重复计数。',
      },
      validation: { mode: 'move_set', number: 4 },
    },
    {
      id: 'surakarta-04-piece-legal-moves',
      title: '题 4：单子总合法走法计数',
      difficulty: 3,
      sideToMove: null,
      board: {
        pieces: [
          { id: 'p1', side: 'B', at: 'D4' },
          { id: 'p2', side: 'B', at: 'C3' },
          { id: 'p3', side: 'B', at: 'E5' },
          { id: 'p4', side: 'W', at: 'F3' },
          { id: 'p5', side: 'W', at: 'E4' },
          { id: 'p6', side: 'W', at: 'C6' },
          { id: 'p7', side: 'W', at: 'D6' },
        ],
      },
      prompt: {
        kind: 'count_piece_legal_moves',
        targetPiece: 'D4',
        text: '黑棋 D4 当前总共有几种合法走法？包括普通邻移和旋吃。',
      },
      answer: {
        value: 7,
        moves: ['D4-C4', 'D4-C5', 'D4-D3', 'D4-D5', 'D4-E3', 'D4xC6', 'D4xF3'],
        stepMoves: ['D4-C4', 'D4-C5', 'D4-D3', 'D4-D5', 'D4-E3'],
        captureMoves: ['D4xC6', 'D4xF3'],
        explanation: 'D4 有 5 个普通邻移空点；E4 是白棋但普通移动不能吃，C3、E5 是己方棋子也不能落入。旋吃目标为 C6、F3，共 2 个。',
      },
      validation: { mode: 'move_set', number: 7 },
    },
    {
      id: 'surakarta-05-mate-in-one',
      title: '题 5：终局多起点判断',
      difficulty: 4,
      sideToMove: 'B',
      board: {
        pieces: [
          { id: 'p1', side: 'B', at: 'C3' },
          { id: 'p2', side: 'B', at: 'D4' },
          { id: 'p3', side: 'B', at: 'E4' },
          { id: 'p4', side: 'W', at: 'F3' },
        ],
      },
      prompt: {
        kind: 'mate_in_one',
        side: 'B',
        text: '黑方先行，当前有几种一步内直接获胜的合法旋吃？',
      },
      answer: {
        value: 2,
        moves: ['C3xF3', 'D4xF3'],
        paths: [
          'C3xF3：C3-C2-C1-左上外回路-A3-B3-C3-D3-E3-F3。',
          'D4xF3：D4-D3-D2-D1-右上外回路-F3。',
        ],
        explanation: 'F3 是白方唯一棋子。C3 和 D4 都能经过回路吃到 F3，任意一手成功后白方无子，黑方立即获胜；E4 不能直接算作第三种。',
      },
      validation: { mode: 'move_set', number: 2 },
    },
    {
      id: 'surakarta-06-forced-win-depth-3',
      title: '题 6：两手内强制必胜',
      difficulty: 5,
      sideToMove: 'B',
      board: {
        pieces: [
          { id: 'p1', side: 'B', at: 'A2' },
          { id: 'p2', side: 'B', at: 'F2' },
          { id: 'p3', side: 'W', at: 'C1' },
        ],
      },
      prompt: {
        kind: 'forced_win_depth',
        side: 'B',
        depth: 3,
        text: '黑方先行。能保证黑方第二手吃掉白方唯一棋子的第一手，有几种？',
      },
      answer: {
        value: 1,
        firstMoves: ['F2-E3'],
        strategy: {
          'C1-B1': 'A2xB1',
          'C1-D1': 'E3xD1',
          'C1-B2': 'A2xB2',
          'C1-C2': 'E3xC2',
          'C1-D2': 'E3xD2',
          'C1xE3': 'A2xE3',
        },
        explanation: '初始局面黑方没有一步必胜。走 F2-E3 后，白方唯一棋子 C1 的所有合法应手都可被黑方下一手吃掉，因此黑方能保证在自己的第二手获胜。',
      },
      validation: { mode: 'strategy_tree', depth: 3, number: 1 },
    },
  ],
} satisfies {
  ruleset: string;
  visualSpecVersion: string;
  topologyVersion: string;
  countingPolicy: string;
  validated: true;
  puzzles: SurakartaPuzzle[];
};

export const SURAKARTA_PUZZLES_V2 = SURAKARTA_PUZZLESET_V2.puzzles;
