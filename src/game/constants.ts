import type { Coord } from "./types";

export const BOARD_SIZE = 10;
export const PLAYER_HP = 3;
export const ENEMY_HP = 3;
export const PLAYER_MOVEMENT = 3;
export const ENEMY_MOVEMENT = 2;

export const INITIAL_PLAYER_POSITIONS: Coord[] = [
  { x: 1, y: 7 },
  { x: 3, y: 8 },
  { x: 5, y: 7 }
];

export const INITIAL_ENEMY_POSITIONS: Coord[] = [
  { x: 7, y: 2 },
  { x: 8, y: 4 },
  { x: 6, y: 1 }
];

export const INITIAL_OBSTACLES: Coord[] = [
  { x: 4, y: 4 },
  { x: 5, y: 4 },
  { x: 2, y: 5 },
  { x: 7, y: 6 }
];
