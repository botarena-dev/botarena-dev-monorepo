import { PlayerCommand } from "./commands";
import { PublicPlayerState } from "./player-state.type";

export type PublicGameState = {
  gameId: string;
  gameType: "curve-arena";
  canvasWidth: number;
  canvasHeight: number;
  possibleCommandsInFrame: readonly PlayerCommand[];
  status: "waiting" | "running" | "finished";
  frame: number;
  maxFrames: number;
  createdAt: number | null;
  startedAt: number | null;
  endedAt: number | null;
  updatedAt: number;
  playersPublicKeys: string[];
  playersReady: string[];
  playersCommandsThisFrame: { publicKey: string; command: PlayerCommand }[];
  players: PublicPlayerState[];
  grid: Uint8Array;
};
