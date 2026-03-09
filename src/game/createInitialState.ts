import {
  BOARD_SIZE,
  ENEMY_COUNT,
  ENEMY_HP,
  ENEMY_MOVEMENT,
  OBSTACLE_COUNT,
  PLAYER_COUNT,
  PLAYER_HP,
  PLAYER_MOVEMENT,
} from "./constants";
import { computeEnemyIntents } from "./ai";
import type { Coord, GameState } from "./types";

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const buildRandomCoords = (
  count: number,
  yMin: number,
  yMax: number,
): Coord[] => {
  const used = new Set<string>();
  const coords: Coord[] = [];

  while (coords.length < count) {
    const coord = {
      x: randomInt(0, BOARD_SIZE - 1),
      y: randomInt(yMin, yMax),
    };
    const key = `${coord.x},${coord.y}`;
    if (used.has(key)) continue;
    used.add(key);
    coords.push(coord);
  }

  return coords;
};

export const createInitialState = (): GameState => {
  const enemyPositions = buildRandomCoords(ENEMY_COUNT, 0, 2);
  const obstaclePositions = buildRandomCoords(OBSTACLE_COUNT, 3, 6);
  const playerPositions = buildRandomCoords(PLAYER_COUNT, 7, 9);

  const state: GameState = {
    turn: 1,
    boardSize: BOARD_SIZE,
    units: [
      ...playerPositions.map((position, index) => ({
        id: `P${index + 1}`,
        team: "player" as const,
        hp: PLAYER_HP,
        maxHp: PLAYER_HP,
        movement: PLAYER_MOVEMENT,
        attackDamage: 1,
        position,
        hasMoved: false,
        hasAttacked: false,
      })),
      ...enemyPositions.map((position, index) => ({
        id: `E${index + 1}`,
        team: "enemy" as const,
        hp: ENEMY_HP,
        maxHp: ENEMY_HP,
        movement: ENEMY_MOVEMENT,
        attackDamage: 1,
        position,
        hasMoved: false,
        hasAttacked: false,
      })),
    ],
    obstacles: obstaclePositions,
    selectedUnitId: null,
    enemyIntents: [],
  };

  return {
    ...state,
    enemyIntents: computeEnemyIntents(state),
  };
};
