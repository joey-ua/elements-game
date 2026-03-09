import type { Coord, GameState, Unit } from "./types";

export const coordKey = (coord: Coord): string => `${coord.x},${coord.y}`;

export const areCoordsEqual = (a: Coord, b: Coord): boolean => a.x === b.x && a.y === b.y;

export const isInsideBoard = (coord: Coord, boardSize: number): boolean =>
  coord.x >= 0 && coord.y >= 0 && coord.x < boardSize && coord.y < boardSize;

export const manhattanDistance = (a: Coord, b: Coord): number =>
  Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

export const getUnitById = (state: GameState, unitId: string): Unit | undefined =>
  state.units.find((unit) => unit.id === unitId);

export const getUnitAt = (state: GameState, coord: Coord): Unit | undefined =>
  state.units.find((unit) => areCoordsEqual(unit.position, coord));

export const isObstacleAt = (state: GameState, coord: Coord): boolean =>
  state.obstacles.some((obstacle) => areCoordsEqual(obstacle, coord));

export const isBlockedTile = (state: GameState, coord: Coord): boolean =>
  isObstacleAt(state, coord) || getUnitAt(state, coord) !== undefined;

export const getAdjacentCoords = (coord: Coord): Coord[] => [
  { x: coord.x + 1, y: coord.y },
  { x: coord.x - 1, y: coord.y },
  { x: coord.x, y: coord.y + 1 },
  { x: coord.x, y: coord.y - 1 }
];
