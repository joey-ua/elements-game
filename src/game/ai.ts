import type { Coord, EnemyIntent, GameState, Unit } from "./types";
import { getAdjacentCoords, getUnitAt, isBlockedTile, isInsideBoard, manhattanDistance } from "./selectors";

const getClosestPlayer = (enemy: Unit, players: Unit[]): Unit | undefined => {
  return players
    .slice()
    .sort((a, b) => manhattanDistance(enemy.position, a.position) - manhattanDistance(enemy.position, b.position))[0];
};

const getBestStepToward = (state: GameState, from: Coord, target: Coord): Coord | undefined => {
  const options = getAdjacentCoords(from)
    .filter((coord) => isInsideBoard(coord, state.boardSize))
    .filter((coord) => !isBlockedTile(state, coord))
    .sort((a, b) => manhattanDistance(a, target) - manhattanDistance(b, target));

  return options[0];
};

export const computeEnemyIntents = (state: GameState): EnemyIntent[] => {
  const players = state.units.filter((unit) => unit.team === "player");
  const enemies = state.units.filter((unit) => unit.team === "enemy");

  return enemies.map((enemy) => {
    const target = getClosestPlayer(enemy, players);
    if (!target) {
      return {
        enemyId: enemy.id,
        type: "wait",
        from: enemy.position
      };
    }

    const adjacentPlayer = getAdjacentCoords(enemy.position)
      .map((coord) => getUnitAt(state, coord))
      .find((unit) => unit?.team === "player");

    if (adjacentPlayer) {
      return {
        enemyId: enemy.id,
        type: "attack",
        from: enemy.position,
        targetId: adjacentPlayer.id
      };
    }

    const next = getBestStepToward(state, enemy.position, target.position);
    if (!next) {
      return {
        enemyId: enemy.id,
        type: "wait",
        from: enemy.position
      };
    }

    return {
      enemyId: enemy.id,
      type: "move",
      from: enemy.position,
      to: next,
      targetId: target.id
    };
  });
};
