import type { Coord, EnemyIntent, GameState } from "../game/types";

type Props = {
  state: GameState;
  moveTiles: Coord[];
  attackTargetIds: string[];
  selectedUnitId: string | null;
  onTileClick: (coord: Coord) => void;
};

const coordKey = ({ x, y }: Coord): string => `${x},${y}`;

const tileHasIntentTarget = (coord: Coord, intents: EnemyIntent[]): boolean =>
  intents.some((intent) => intent.to && intent.to.x === coord.x && intent.to.y === coord.y);

export const GameBoard = ({ state, moveTiles, attackTargetIds, selectedUnitId, onTileClick }: Props) => {
  const moveSet = new Set(moveTiles.map(coordKey));
  const attackTargetSet = new Set(attackTargetIds);

  return (
    <div className="board-wrap">
      <div className="axis top-axis">
        <span />
        {Array.from({ length: state.boardSize }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
      <div className="board-row">
        <div className="axis left-axis">
          {Array.from({ length: state.boardSize }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
        <div
          className="board"
          style={{
            gridTemplateColumns: `repeat(${state.boardSize}, 1fr)`,
            gridTemplateRows: `repeat(${state.boardSize}, 1fr)`
          }}
        >
          {Array.from({ length: state.boardSize * state.boardSize }, (_, index) => {
            const x = index % state.boardSize;
            const y = Math.floor(index / state.boardSize);
            const coord = { x, y };
            const key = coordKey(coord);

            const unit = state.units.find((u) => u.position.x === x && u.position.y === y);
            const isObstacle = state.obstacles.some((o) => o.x === x && o.y === y);
            const isMoveTile = moveSet.has(key);
            const isSelectedUnit = unit?.id === selectedUnitId;
            const isAttackTarget = unit ? attackTargetSet.has(unit.id) : false;
            const hasIntentTarget = tileHasIntentTarget(coord, state.enemyIntents);

            const classes = ["tile"];
            if (isObstacle) classes.push("tile-obstacle");
            if (isMoveTile) classes.push("tile-move");
            if (isSelectedUnit) classes.push("tile-selected");
            if (isAttackTarget) classes.push("tile-attack");
            if (hasIntentTarget) classes.push("tile-intent");

            return (
              <button key={key} className={classes.join(" ")} onClick={() => onTileClick(coord)}>
                {unit ? (
                  <span className={`unit ${unit.team === "player" ? "unit-player" : "unit-enemy"}`}>
                    {unit.id}
                    <small>{unit.hp}</small>
                  </span>
                ) : isObstacle ? (
                  <span className="obstacle">#</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
