import {
  BOARD_SIZE,
  ENEMY_HP,
  ENEMY_MOVEMENT,
  INITIAL_ENEMY_POSITIONS,
  INITIAL_OBSTACLES,
  INITIAL_PLAYER_POSITIONS,
  PLAYER_HP,
  PLAYER_MOVEMENT
} from "./constants";
import { computeEnemyIntents } from "./ai";
import type { GameState } from "./types";

export const createInitialState = (): GameState => {
  const state: GameState = {
    turn: 1,
    boardSize: BOARD_SIZE,
    units: [
      ...INITIAL_PLAYER_POSITIONS.map((position, index) => ({
        id: `P${index + 1}`,
        team: "player" as const,
        hp: PLAYER_HP,
        maxHp: PLAYER_HP,
        movement: PLAYER_MOVEMENT,
        attackDamage: 1,
        position,
        hasMoved: false,
        hasAttacked: false
      })),
      ...INITIAL_ENEMY_POSITIONS.map((position, index) => ({
        id: `E${index + 1}`,
        team: "enemy" as const,
        hp: ENEMY_HP,
        maxHp: ENEMY_HP,
        movement: ENEMY_MOVEMENT,
        attackDamage: 1,
        position,
        hasMoved: false,
        hasAttacked: false
      }))
    ],
    obstacles: INITIAL_OBSTACLES,
    selectedUnitId: null,
    enemyIntents: []
  };

  return {
    ...state,
    enemyIntents: computeEnemyIntents(state)
  };
};
