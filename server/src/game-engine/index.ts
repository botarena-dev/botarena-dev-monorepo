export type PublicPlayerState = {
  id: string;
  x: number;
  y: number;
  alive: boolean;
  azimuth: number;
};

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
};

export type ArenaState = {
  status: "waiting" | "running" | "finished";
  frames: { [frame: number]: {} };
  result: "p1" | "p2" | "p3" | "p4" | "draw" | null;
};

const possibleCommandsInFrame = ["nop", "left", "right"] as const;

export type PlayerCommand = (typeof possibleCommandsInFrame)[number];

import { randomUUID } from "node:crypto";

const inMemoryGameStates: { [gameId: string]: PublicGameState } = {};

export const createGameState = (
  gameId: string,
  playersPublicKeys: string[],
): PublicGameState => {
  if (Array.isArray(playersPublicKeys)) {
    if (playersPublicKeys.length > 4) {
      throw new Error("Too many players, max is 4");
    } else if (playersPublicKeys.length < 2) {
      throw new Error("Not enough players, min is 2");
    }
  } else {
    throw new Error("playersPublicKeys must be an array of strings");
  }

  const gameState: PublicGameState = {
    gameId: gameId ?? `arena-${randomUUID()}`,
    gameType: "curve-arena",
    canvasWidth: 400,
    canvasHeight: 200,
    possibleCommandsInFrame,
    status: "waiting",
    frame: 0,
    maxFrames: 3000,
    createdAt: Date.now(),
    startedAt: null,
    endedAt: null,
    updatedAt: Date.now(),
    playersPublicKeys,
    playersReady: [],
    playersCommandsThisFrame: [],
    players: [],
  };

  // Set players positions
  for (const publicKey of playersPublicKeys) {
    gameState.players.push({
      id: `p${gameState.players.length + 1}-${publicKey.slice(0, 6)}`,
      x: Math.floor(Math.random() * gameState.canvasWidth),
      y: Math.floor(Math.random() * gameState.canvasHeight),
      alive: true,
      azimuth: Math.floor(Math.random() * 360),
    });
  }

  inMemoryGameStates[gameState.gameId] = gameState;

  console.log(
    `[createGameState] Created game state with id ${gameState.gameId} and players ${gameState.players
      .map((p) => p.id)
      .join(", ")}`.green,
  );
  return gameState;
};

export const getGameState = (gameId: string): PublicGameState | null => {
  if (!inMemoryGameStates[gameId]) {
    // TODO: Better safety here
    return null;
  }
  return inMemoryGameStates[gameId] ?? null;
};

export const startGame = (gameId: string, io: any) => {
  const gameState = getGameState(gameId);
  if (!gameState) {
    return;
  }
  gameState.status = "running";
  gameState.startedAt = Date.now();
  gameState.updatedAt = Date.now();
  gameState.frame = 1;

  console.log(`Game ${gameId} started!`.green);

  {
    // Broadcast the new state back to all!
    const gameState = getGameState(gameId);
    io.emit("game:state", { ...gameState });
  }
};

export const connectPlayerBotToGame = (
  gameId: string,
  publicKey: string,
  socket: any,
  io: any,
) => {
  const gameState = getGameState(gameId);
  if (!gameState) {
    return;
  }
  console.log(
    `[connectPlayerBotToGame] Connecting player bot with socket id ${socket.id} to game ${gameId}`
      .magenta,
  );

  // Add the player to the ready list
  // TODO: Better checks here...
  if (!gameState.playersReady.includes(publicKey)) {
    gameState.playersReady.push(publicKey);
    gameState.updatedAt = Date.now();
    if (gameState.playersReady.length === gameState.playersPublicKeys.length) {
      gameState.status = "running";
      gameState.startedAt = Date.now();
      console.log(
        `All players are ready in game ${gameId}, starting the game!`.green,
      );
      startGame(gameId, io);
    }
  }
};

export const moveToNextFrame = (gameId: string, io: any) => {
  const gameState = getGameState(gameId);
  if (!gameState) {
    return;
  }
  console.log(
    `All players have played their command for frame ${gameState.frame} in game ${gameId}, moving to next frame!`
      .green,
  );
  gameState.frame = gameState.frame + 1;
  gameState.playersCommandsThisFrame = [];

  if (gameState.frame > gameState.maxFrames) {
    gameState.status = "finished";
    gameState.endedAt = Date.now();
    console.log(`Game ${gameId} has ended!`.red);
    return;
  }

  setTimeout(() => {
    // Broadcast the new state back to all!
    const gameState = getGameState(gameId);
    io.emit("game:state", { ...gameState });
  }, 10);
};

export const playerPlaysCommand = (
  gameId: string,
  command: PlayerCommand,
  frame: number,
  publicKey: string,
  socket: any,
  io: any,
) => {
  const gameState = getGameState(gameId);
  if (!gameState) {
    return;
  }
  console.log(
    `Player with pubkey ${publicKey} plays command ${command} at frame ${frame} in game ${gameId}`
      .magenta,
  );

  // Save command to game state, if all commands are in, move to next frame and update game state accordingly
  // Push command only if this pubkey hasn't played a command this frame yet
  if (
    !gameState.playersCommandsThisFrame.find((c) => c.publicKey === publicKey)
  ) {
    gameState.playersCommandsThisFrame.push({ publicKey: publicKey, command });
    gameState.updatedAt = Date.now();
  }
  if (
    gameState.playersCommandsThisFrame.length ===
    gameState.playersPublicKeys.length
  ) {
    // Move to next frame
    moveToNextFrame(gameId, io);
  }
};
