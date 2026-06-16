export type Col = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type Row = 1 | 2 | 3 | 4 | 5 | 6;
export type Coord = `${Col}${Row}`;
export type Side = 'B' | 'W';
export type Dir = 'N' | 'E' | 'S' | 'W';

export type SurakartaPiece = {
  id: string;
  side: Side;
  at: Coord;
};

export type SurakartaState = {
  pieces: SurakartaPiece[];
  sideToMove?: Side | null;
};

export type SurakartaMove = {
  from: Coord;
  to: Coord;
  type: 'step' | 'capture';
  captured?: Coord;
  path: Coord[];
  loopIds?: string[];
  notation: string;
};

export type LoopTransition = {
  to: Coord;
  dir: Dir;
  loopId: string;
};

export const SURAKARTA_COLS: Col[] = ['A', 'B', 'C', 'D', 'E', 'F'];
export const SURAKARTA_ROWS: Row[] = [1, 2, 3, 4, 5, 6];

const STEP_DELTAS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

const DIR_DELTAS: Record<Dir, readonly [number, number]> = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
};

export const LOOP_TRANSITIONS: Record<string, LoopTransition> = {
  'B1:N': { to: 'A2', dir: 'E', loopId: 'inner-TL' },
  'A2:W': { to: 'B1', dir: 'S', loopId: 'inner-TL' },
  'C1:N': { to: 'A3', dir: 'E', loopId: 'outer-TL' },
  'A3:W': { to: 'C1', dir: 'S', loopId: 'outer-TL' },

  'E1:N': { to: 'F2', dir: 'W', loopId: 'inner-TR' },
  'F2:E': { to: 'E1', dir: 'S', loopId: 'inner-TR' },
  'D1:N': { to: 'F3', dir: 'W', loopId: 'outer-TR' },
  'F3:E': { to: 'D1', dir: 'S', loopId: 'outer-TR' },

  'E6:S': { to: 'F5', dir: 'W', loopId: 'inner-BR' },
  'F5:E': { to: 'E6', dir: 'N', loopId: 'inner-BR' },
  'D6:S': { to: 'F4', dir: 'W', loopId: 'outer-BR' },
  'F4:E': { to: 'D6', dir: 'N', loopId: 'outer-BR' },

  'B6:S': { to: 'A5', dir: 'E', loopId: 'inner-BL' },
  'A5:W': { to: 'B6', dir: 'N', loopId: 'inner-BL' },
  'C6:S': { to: 'A4', dir: 'E', loopId: 'outer-BL' },
  'A4:W': { to: 'C6', dir: 'N', loopId: 'outer-BL' },
};

export function isCoord(value: string): value is Coord {
  const col = value.charAt(0);
  const row = Number(value.slice(1));
  return SURAKARTA_COLS.includes(col as Col) && SURAKARTA_ROWS.includes(row as Row);
}

export function offsetCoord(coord: Coord, dx: number, dy: number): Coord | null {
  const colIndex = SURAKARTA_COLS.indexOf(coord.charAt(0) as Col) + dx;
  const rowIndex = Number(coord.slice(1)) - 1 + dy;
  if (colIndex < 0 || colIndex >= SURAKARTA_COLS.length || rowIndex < 0 || rowIndex >= SURAKARTA_ROWS.length) {
    return null;
  }
  return `${SURAKARTA_COLS[colIndex]}${rowIndex + 1}` as Coord;
}

export function offsetCoordByDir(coord: Coord, dir: Dir): Coord | null {
  const [dx, dy] = DIR_DELTAS[dir];
  return offsetCoord(coord, dx, dy);
}

export function otherSide(side: Side): Side {
  return side === 'B' ? 'W' : 'B';
}

export function notationForMove(move: Pick<SurakartaMove, 'from' | 'to' | 'type'>): string {
  return `${move.from}${move.type === 'capture' ? 'x' : '-'}${move.to}`;
}

export function pieceAt(state: SurakartaState, coord: Coord): SurakartaPiece | undefined {
  return state.pieces.find((piece) => piece.at === coord);
}

function occupiedMap(state: SurakartaState) {
  return new Map(state.pieces.map((piece) => [piece.at, piece]));
}

function nextCaptureStep(at: Coord, dir: Dir) {
  const loop = LOOP_TRANSITIONS[`${at}:${dir}`];
  if (loop) return { ...loop, isLoop: true as const };
  const to = offsetCoordByDir(at, dir);
  return to ? { to, dir, loopId: null, isLoop: false as const } : null;
}

export function getStepMoves(state: SurakartaState, from: Coord): SurakartaMove[] {
  const occupied = occupiedMap(state);
  const piece = occupied.get(from);
  if (!piece) return [];

  return STEP_DELTAS
    .map(([dx, dy]) => offsetCoord(from, dx, dy))
    .filter((to): to is Coord => Boolean(to && !occupied.has(to)))
    .map((to) => ({
      from,
      to,
      type: 'step',
      path: [from, to],
      notation: `${from}-${to}`,
    }));
}

export function getCaptureMovesForPiece(state: SurakartaState, from: Coord): SurakartaMove[] {
  const occupied = occupiedMap(state);
  const piece = occupied.get(from);
  if (!piece) return [];

  const bestByTarget = new Map<Coord, SurakartaMove>();

  for (const startDir of ['N', 'E', 'S', 'W'] as Dir[]) {
    let at = from;
    let dir = startDir;
    let usedLoop = false;
    let path: Coord[] = [from];
    let loopIds: string[] = [];
    const visited = new Set<string>();

    while (true) {
      const visitKey = `${at}:${dir}:${usedLoop}`;
      if (visited.has(visitKey)) break;
      visited.add(visitKey);

      const step = nextCaptureStep(at, dir);
      if (!step) break;

      const nextPath = [...path, step.to];
      const nextLoopIds = step.loopId ? [...loopIds, step.loopId] : loopIds;
      const nextUsedLoop: boolean = usedLoop || step.isLoop;
      const blocker = step.to === from ? undefined : occupied.get(step.to);

      if (!blocker) {
        at = step.to;
        dir = step.dir;
        usedLoop = nextUsedLoop;
        path = nextPath;
        loopIds = nextLoopIds;
        continue;
      }

      if (blocker.side !== piece.side && nextUsedLoop) {
        const move: SurakartaMove = {
          from,
          to: step.to,
          type: 'capture',
          captured: step.to,
          path: nextPath,
          loopIds: nextLoopIds,
          notation: `${from}x${step.to}`,
        };
        const previous = bestByTarget.get(step.to);
        if (!previous || move.path.length < previous.path.length) {
          bestByTarget.set(step.to, move);
        }
      }
      break;
    }
  }

  return [...bestByTarget.values()];
}

export function getLegalMovesForPiece(state: SurakartaState, from: Coord): SurakartaMove[] {
  return [...getStepMoves(state, from), ...getCaptureMovesForPiece(state, from)];
}

export function getLegalMoves(state: SurakartaState, side: Side): SurakartaMove[] {
  return state.pieces
    .filter((piece) => piece.side === side)
    .flatMap((piece) => getLegalMovesForPiece(state, piece.at));
}

export function applyMove(state: SurakartaState, move: SurakartaMove): SurakartaState {
  const movingPiece = pieceAt(state, move.from);
  if (!movingPiece) return state;

  const pieces = state.pieces
    .filter((piece) => piece.at !== move.from && piece.at !== move.captured)
    .concat({ ...movingPiece, at: move.to });

  return { pieces, sideToMove: state.sideToMove ? otherSide(state.sideToMove) : undefined };
}

export function getWinner(state: SurakartaState): Side | null {
  const hasBlack = state.pieces.some((piece) => piece.side === 'B');
  const hasWhite = state.pieces.some((piece) => piece.side === 'W');
  if (hasBlack && !hasWhite) return 'B';
  if (hasWhite && !hasBlack) return 'W';
  return null;
}

export function mateInOne(state: SurakartaState, side: Side): SurakartaMove[] {
  return getLegalMoves(state, side).filter((move) => getWinner(applyMove(state, move)) === side);
}

export function forceWinFirstMoves(state: SurakartaState, side: Side, depth = 3): SurakartaMove[] {
  if (depth < 3) return mateInOne(state, side);

  const opponent = otherSide(side);
  return getLegalMoves(state, side).filter((firstMove) => {
    const afterFirst = applyMove(state, firstMove);
    if (getWinner(afterFirst) === side) return true;

    const replies = getLegalMoves(afterFirst, opponent);
    if (!replies.length) return false;

    return replies.every((reply) => {
      const afterReply = applyMove(afterFirst, reply);
      return mateInOne(afterReply, side).length > 0;
    });
  });
}
