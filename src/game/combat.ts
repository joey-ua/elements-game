import type { GameState } from "./types";
import { getAdjacentCoords, getUnitById, getUnitAt } from "./selectors";

export const getAttackableTargetIds = (state: GameState, attackerId: string): string[] => {
  const attacker = getUnitById(state, attackerId);
  if (!attacker) return [];

  const adjacent = getAdjacentCoords(attacker.position);
  return adjacent
    .map((coord) => getUnitAt(state, coord))
    .filter((unit): unit is NonNullable<typeof unit> => !!unit)
    .filter((unit) => unit.team !== attacker.team)
    .map((unit) => unit.id);
};

export const applyAttack = (state: GameState, attackerId: string, targetId: string): GameState => {
  const attacker = getUnitById(state, attackerId);
  const target = getUnitById(state, targetId);
  if (!attacker || !target) return state;

  const targetIds = getAttackableTargetIds(state, attackerId);
  if (!targetIds.includes(targetId)) return state;

  return {
    ...state,
    units: state.units
      .map((unit) => {
        if (unit.id === targetId) {
          return { ...unit, hp: unit.hp - attacker.attackDamage };
        }
        if (unit.id === attackerId) {
          return { ...unit, hasAttacked: true };
        }
        return unit;
      })
      .filter((unit) => unit.hp > 0)
  };
};
