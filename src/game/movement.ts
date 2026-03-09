import type { Coord, GameState } from "./types";
import { coordKey, getAdjacentCoords, getUnitById, isBlockedTile, isInsideBoard } from "./selectors";

export const getReachableTiles = (state: GameState, unitId: string): Coord[] => {
  const unit = getUnitById(state, unitId);
  if (!unit) return [];

  const visited = new Set<string>([coordKey(unit.position)]);
  const results: Coord[] = [];
  const queue: Array<{ coord: Coord; cost: number }> = [{ coord: unit.position, cost: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    for (const next of getAdjacentCoords(current.coord)) {
      if (!isInsideBoard(next, state.boardSize)) continue;
      const key = coordKey(next);
      if (visited.has(key)) continue;
      const nextCost = current.cost + 1;
      if (nextCost > unit.movement) continue;

      const blocked = isBlockedTile(state, next);
      if (blocked) continue;

      visited.add(key);
      results.push(next);
      queue.push({ coord: next, cost: nextCost });
    }
  }

  return results;
};

export const moveUnit = (state: GameState, unitId: string, destination: Coord): GameState => {
  const unit = getUnitById(state, unitId);
  if (!unit) return state;

  const legalTiles = getReachableTiles(state, unitId);
  const canMove = legalTiles.some((tile) => tile.x === destination.x && tile.y === destination.y);
  if (!canMove) return state;

  return {
    ...state,
    units: state.units.map((candidate) =>
      candidate.id === unitId
        ? {
            ...candidate,
            position: destination,
            hasMoved: true
          }
        : candidate
    )
  };
};
