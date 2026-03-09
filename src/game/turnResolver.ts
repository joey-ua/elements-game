import type { EnemyIntent, GameState } from "./types";
import { applyAttack } from "./combat";
import { computeEnemyIntents } from "./ai";
import { getUnitById, getUnitAt, manhattanDistance } from "./selectors";

const resolveEnemyIntent = (state: GameState, intent: EnemyIntent): GameState => {
  const enemy = getUnitById(state, intent.enemyId);
  if (!enemy || enemy.team !== "enemy") return state;

  if (intent.type === "move" && intent.to) {
    if (getUnitAt(state, intent.to)) return state;
    if (state.obstacles.some((obstacle) => obstacle.x === intent.to!.x && obstacle.y === intent.to!.y)) return state;

    return {
      ...state,
      units: state.units.map((unit) => (unit.id === enemy.id ? { ...unit, position: intent.to! } : unit))
    };
  }

  if (intent.type === "attack" && intent.targetId) {
    const target = getUnitById(state, intent.targetId);
    if (!target || target.team !== "player") return state;
    if (manhattanDistance(enemy.position, target.position) !== 1) return state;
    return applyAttack(state, enemy.id, target.id);
  }

  return state;
};

export const endTurn = (state: GameState): GameState => {
  const intents = computeEnemyIntents(state);
  const orderedIntents = intents.slice().sort((a, b) => a.enemyId.localeCompare(b.enemyId));

  const afterEnemyActions = orderedIntents.reduce((current, intent) => {
    return resolveEnemyIntent(current, intent);
  }, state);

  const cleaned = {
    ...afterEnemyActions,
    units: afterEnemyActions.units.filter((unit) => unit.hp > 0)
  };

  const resetPlayerUnits = {
    ...cleaned,
    units: cleaned.units.map((unit) =>
      unit.team === "player"
        ? {
            ...unit,
            hasMoved: false,
            hasAttacked: false
          }
        : unit
    ),
    selectedUnitId: null,
    turn: state.turn + 1
  };

  return {
    ...resetPlayerUnits,
    enemyIntents: computeEnemyIntents(resetPlayerUnits)
  };
};
