import {
  getLegalMovesForPiece,
  isCoord,
  type Coord,
  type SurakartaMove,
  type SurakartaState,
} from './core';
import type { SurakartaPuzzle } from './puzzles';

export function puzzleState(puzzle: SurakartaPuzzle): SurakartaState {
  return { pieces: puzzle.board.pieces, sideToMove: puzzle.sideToMove };
}

export function getMoveByCoordsInState(state: SurakartaState, from: Coord, to: Coord): SurakartaMove | null {
  return getLegalMovesForPiece(state, from).find((candidate) => candidate.to === to) ?? null;
}

export function getMoveByCoords(puzzle: SurakartaPuzzle, from: Coord, to: Coord): SurakartaMove | null {
  return getMoveByCoordsInState(puzzleState(puzzle), from, to);
}

export function isSurakartaCoord(value: string | null | undefined): value is Coord {
  return Boolean(value && isCoord(value));
}
