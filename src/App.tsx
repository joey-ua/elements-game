import { useMemo, useState } from "react";
import { GameBoard } from "./components/GameBoard";
import { Hud } from "./components/Hud";
import { applyAttack, getAttackableTargetIds } from "./game/combat";
import { createInitialState } from "./game/createInitialState";
import { moveUnit, getReachableTiles } from "./game/movement";
import { getUnitById, getUnitAt } from "./game/selectors";
import { endTurn } from "./game/turnResolver";
import { computeEnemyIntents } from "./game/ai";
import type { Coord } from "./game/types";

function App() {
  const [state, setState] = useState(createInitialState);

  const selectedUnit = useMemo(() => {
    if (!state.selectedUnitId) return undefined;
    return getUnitById(state, state.selectedUnitId);
  }, [state]);

  const moveTiles = useMemo(() => {
    if (!selectedUnit || selectedUnit.team !== "player" || selectedUnit.hasMoved) return [];
    return getReachableTiles(state, selectedUnit.id);
  }, [selectedUnit, state]);

  const attackTargetIds = useMemo(() => {
    if (!selectedUnit || selectedUnit.team !== "player" || selectedUnit.hasAttacked) return [];
    return getAttackableTargetIds(state, selectedUnit.id);
  }, [selectedUnit, state]);

  const refreshIntents = (nextState: typeof state) => ({
    ...nextState,
    enemyIntents: computeEnemyIntents(nextState)
  });

  const selectPlayerUnit = (unitId: string) => {
    setState((prev) => ({ ...prev, selectedUnitId: unitId }));
  };

  const handleMove = (destination: Coord) => {
    if (!state.selectedUnitId) return;
    const next = moveUnit(state, state.selectedUnitId, destination);
    if (next === state) return;
    setState(refreshIntents(next));
  };

  const handleAttack = (targetId: string) => {
    if (!state.selectedUnitId) return;
    const next = applyAttack(state, state.selectedUnitId, targetId);
    if (next === state) return;
    setState(refreshIntents(next));
  };

  const onTileClick = (coord: Coord) => {
    const clickedUnit = getUnitAt(state, coord);

    if (clickedUnit?.team === "player") {
      selectPlayerUnit(clickedUnit.id);
      return;
    }

    if (!selectedUnit || selectedUnit.team !== "player") return;

    if (clickedUnit?.team === "enemy") {
      handleAttack(clickedUnit.id);
      return;
    }

    handleMove(coord);
  };

  const selectedUnitLabel = selectedUnit
    ? `${selectedUnit.id} (hp ${selectedUnit.hp}) move:${selectedUnit.hasMoved ? "done" : "ready"} attack:${
        selectedUnit.hasAttacked ? "done" : "ready"
      }`
    : "none";

  const playerAlive = state.units.some((unit) => unit.team === "player");
  const enemyAlive = state.units.some((unit) => unit.team === "enemy");

  return (
    <main className="layout">
      <Hud
        state={state}
        selectedUnitLabel={selectedUnitLabel}
        onEndTurn={() => setState((prev) => endTurn(prev))}
      />

      <section>
        <GameBoard
          state={state}
          moveTiles={moveTiles}
          attackTargetIds={attackTargetIds}
          selectedUnitId={state.selectedUnitId}
          onTileClick={onTileClick}
        />

        <div className="status-line">
          {!playerAlive && <p>Defeat: all player units were destroyed.</p>}
          {!enemyAlive && <p>Victory: all enemies defeated.</p>}
          {playerAlive && enemyAlive && <p>Click a player unit, move, attack once, then end turn.</p>}
        </div>
      </section>
    </main>
  );
}

export default App;
