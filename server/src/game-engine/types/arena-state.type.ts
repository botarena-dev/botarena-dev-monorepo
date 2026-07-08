export type ArenaState = {
  status: "waiting" | "running" | "finished";
  frames: { [frame: number]: {} };
  result: "p1" | "p2" | "p3" | "p4" | "draw" | null;
};
