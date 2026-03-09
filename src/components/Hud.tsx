import type { GameState } from "../game/types";

type Props = {
  state: GameState;
  selectedUnitLabel: string;
  onEndTurn: () => void;
};

export const Hud = ({ state, selectedUnitLabel, onEndTurn }: Props) => {
  const enemies = state.units.filter((unit) => unit.team === "enemy");

  return (
    <aside className="hud">
      <h1>Elements Tactics</h1>
      <p>Turn: {state.turn}</p>
      <p>Selected: {selectedUnitLabel}</p>
      <p>Player HP: {state.units.filter((u) => u.team === "player").map((u) => `${u.id}:${u.hp}`).join(" ") || "none"}</p>

      <div className="intent-block">
        <h2>Enemy Intent</h2>
        {enemies.length === 0 ? (
          <p>All enemies defeated.</p>
        ) : (
          <ul>
            {state.enemyIntents.map((intent) => {
              const targetText = intent.targetId ? ` -> ${intent.targetId}` : "";
              const moveText = intent.to ? ` (${intent.to.x},${intent.to.y})` : "";
              return (
                <li key={intent.enemyId}>
                  {intent.enemyId}: {intent.type}
                  {moveText}
                  {targetText}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <button className="end-turn" onClick={onEndTurn}>
        End Turn
      </button>
    </aside>
  );
};
