export type Team = "player" | "enemy";

export type Coord = {
  x: number;
  y: number;
};

export type Unit = {
  id: string;
  team: Team;
  hp: number;
  maxHp: number;
  movement: number;
  attackDamage: number;
  position: Coord;
  hasMoved: boolean;
  hasAttacked: boolean;
};

export type EnemyIntent = {
  enemyId: string;
  type: "move" | "attack" | "wait";
  from: Coord;
  to?: Coord;
  targetId?: string;
};

export type GameState = {
  turn: number;
  boardSize: number;
  units: Unit[];
  obstacles: Coord[];
  selectedUnitId: string | null;
  enemyIntents: EnemyIntent[];
};
