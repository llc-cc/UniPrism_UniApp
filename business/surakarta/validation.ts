import {
  forceWinFirstMoves,
  getCaptureMovesForPiece,
  getLegalMoves,
  getLegalMovesForPiece,
  getStepMoves,
  isCoord,
  mateInOne,
  type Coord,
  type Side,
  type SurakartaState,
} from './core';
import { SURAKARTA_PUZZLES_V2, type SurakartaPuzzle } from './puzzles';

export type SurakartaPuzzleValidationResult = {
  id: string;
  ok: boolean;
  errors: string[];
  generated: {
    coords?: string[];
    moves?: string[];
    firstMoves?: string[];
  };
};

function sortValues(values: readonly string[]) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function sameSet(left: readonly string[] = [], right: readonly string[] = []) {
  const sortedLeft = sortValues(left);
  const sortedRight = sortValues(right);
  return sortedLeft.length === sortedRight.length && sortedLeft.every((value, index) => value === sortedRight[index]);
}

function puzzleState(puzzle: SurakartaPuzzle): SurakartaState {
  return { pieces: puzzle.board.pieces, sideToMove: puzzle.sideToMove };
}

function targetPiece(puzzle: SurakartaPuzzle, errors: string[]): Coord | null {
  const target = puzzle.prompt.targetPiece;
  if (!target || !isCoord(target)) {
    errors.push('Missing or invalid targetPiece.');
    return null;
  }
  return target;
}

function sideFromPrompt(puzzle: SurakartaPuzzle, errors: string[]): Side | null {
  const side = puzzle.prompt.side;
  if (side !== 'B' && side !== 'W') {
    errors.push('Missing side.');
    return null;
  }
  return side;
}

export function validateSurakartaPuzzle(puzzle: SurakartaPuzzle): SurakartaPuzzleValidationResult {
  const errors: string[] = [];
  const generated: SurakartaPuzzleValidationResult['generated'] = {};
  const state = puzzleState(puzzle);

  const occupied = new Set<string>();
  for (const piece of state.pieces) {
    if (!isCoord(piece.at)) errors.push(`Invalid coord ${piece.at}.`);
    if (occupied.has(piece.at)) errors.push(`Duplicate coord ${piece.at}.`);
    occupied.add(piece.at);
  }

  if (puzzle.prompt.kind === 'count_step_moves') {
    const target = targetPiece(puzzle, errors);
    if (target) {
      const moves = getStepMoves(state, target);
      generated.coords = moves.map((move) => move.to);
      generated.moves = moves.map((move) => move.notation);
      if (!sameSet(generated.coords, puzzle.answer.coords)) errors.push('Step target coord set mismatch.');
      if (!sameSet(generated.moves, puzzle.answer.moves)) errors.push('Step move set mismatch.');
    }
  }

  if (puzzle.prompt.kind === 'count_capture_targets') {
    const target = targetPiece(puzzle, errors);
    if (target) {
      const moves = getCaptureMovesForPiece(state, target);
      generated.coords = moves.map((move) => move.to);
      generated.moves = moves.map((move) => move.notation);
      if (!sameSet(generated.coords, puzzle.answer.coords)) errors.push('Capture target coord set mismatch.');
      if (!sameSet(generated.moves, puzzle.answer.moves)) errors.push('Capture move set mismatch.');
    }
  }

  if (puzzle.prompt.kind === 'count_side_captures') {
    const side = sideFromPrompt(puzzle, errors);
    if (side) {
      const moves = getLegalMoves(state, side).filter((move) => move.type === 'capture');
      generated.moves = moves.map((move) => move.notation);
      if (!sameSet(generated.moves, puzzle.answer.moves)) errors.push('Side capture move set mismatch.');
    }
  }

  if (puzzle.prompt.kind === 'count_piece_legal_moves') {
    const target = targetPiece(puzzle, errors);
    if (target) {
      const moves = getLegalMovesForPiece(state, target);
      generated.moves = moves.map((move) => move.notation);
      if (!sameSet(generated.moves, puzzle.answer.moves)) errors.push('Piece legal move set mismatch.');
    }
  }

  if (puzzle.prompt.kind === 'mate_in_one') {
    const side = sideFromPrompt(puzzle, errors);
    if (side) {
      generated.moves = mateInOne(state, side).map((move) => move.notation);
      if (!sameSet(generated.moves, puzzle.answer.moves)) errors.push('Mate-in-one move set mismatch.');
    }
  }

  if (puzzle.prompt.kind === 'forced_win_depth') {
    const side = sideFromPrompt(puzzle, errors);
    if (side) {
      generated.firstMoves = forceWinFirstMoves(state, side, puzzle.prompt.depth ?? 3).map((move) => move.notation);
      if (!sameSet(generated.firstMoves, puzzle.answer.firstMoves)) errors.push('Forced-win first move set mismatch.');
    }
  }

  const generatedCount = generated.coords?.length ?? generated.moves?.length ?? generated.firstMoves?.length;
  if (typeof puzzle.validation.number === 'number' && generatedCount !== undefined && generatedCount !== puzzle.validation.number) {
    errors.push(`Generated count ${generatedCount} does not match expected ${puzzle.validation.number}.`);
  }

  return { id: puzzle.id, ok: errors.length === 0, errors, generated };
}

export function validateSurakartaPuzzles() {
  return SURAKARTA_PUZZLES_V2.map((puzzle) => validateSurakartaPuzzle(puzzle));
}
