export type PublicPlayerState = {
  id: string;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
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
  grid: Uint8Array;
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
    grid: new Uint8Array(400 * 200),
  };

  // Spawning has buffer of 10% of the canvas size from the borders
  const spawnBufferX = gameState.canvasWidth * 0.1;
  const spawnBufferY = gameState.canvasHeight * 0.1;

  // Set players positions
  for (const publicKey of playersPublicKeys) {
    const x = Math.floor(
      Math.random() * (gameState.canvasWidth - 2 * spawnBufferX) + spawnBufferX,
    );
    const y = Math.floor(
      Math.random() * (gameState.canvasHeight - 2 * spawnBufferY) +
        spawnBufferY,
    );

    gameState.players.push({
      id: `p${gameState.players.length + 1}-${publicKey.slice(0, 6)}`,
      x,
      y,
      prevX: x,
      prevY: y,
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

const pixelIndex = (width: number) => (x: number, y: number) => {
  return Math.floor(y) * width + Math.floor(x);
};

const markLine = (
  gameState: PublicGameState,
  player: PublicPlayerState,
  playerIndex: number,
) => {
  const { x: x1, y: y1, prevX: x0, prevY: y0, id } = player;
  const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0));

  for (let i = 0; i < steps; i++) {
    const t = steps === 0 ? 0 : i / steps;

    const ix = x0 + (x1 - x0) * t;
    const iy = y0 + (y1 - y0) * t;

    const markValue = 1 + (playerIndex + 1);

    // Mark small circle around the point to avoid holes in the line
    const radius = 3;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= radius) {
          const px = ix + dx;
          const py = iy + dy;
          if (
            px >= 0 &&
            px < gameState.canvasWidth &&
            py >= 0 &&
            py < gameState.canvasHeight
          ) {
            gameState.grid[pixelIndex(gameState.canvasWidth)(px, py)] =
              markValue;
          }
        }
      }
    }

    // gameState.grid[pixelIndex(gameState.canvasWidth)(ix, iy)] = markValue;
  }
};

export const evaluteFrame = (gameId: string) => {
  const gameState = getGameState(gameId);
  if (!gameState) {
    return;
  }
  const TURN_SPEED = 0.06; // radians per frame

  // For each command played this frame, update the corresponding player state
  for (const { publicKey, command } of gameState.playersCommandsThisFrame) {
    const player = gameState.players.find((p) =>
      p.id.endsWith(publicKey.slice(0, 6)),
    );
    if (!player) {
      continue;
    }
    if (!player.alive) {
      continue;
    }
    switch (command) {
      case "left":
        player.azimuth =
          (player.azimuth - TURN_SPEED + 2 * Math.PI) % (2 * Math.PI);
        break;
      case "right":
        player.azimuth = (player.azimuth + TURN_SPEED) % (2 * Math.PI);
        break;
      case "nop":
        break;
    }

    // Move player in the direction of the azimuth
    const radians = player.azimuth;
    player.prevX = player.x;
    player.prevY = player.y;
    player.x += Math.cos(radians);
    player.y += Math.sin(radians);

    markLine(gameState, player, gameState.players.indexOf(player));

    // Check for collisions with walls
    if (
      player.x < 0 ||
      player.x >= gameState.canvasWidth ||
      player.y < 0 ||
      player.y >= gameState.canvasHeight
    ) {
      player.alive = false;
      console.log(
        `Player ${player.id} collided with wall and died at frame ${gameState.frame} in game ${gameId}`
          .red,
      );
    }

    // Check for collisions with other players
    for (const otherPlayer of gameState.players) {
      if (otherPlayer.id === player.id) {
        continue;
      }
      if (!otherPlayer.alive) {
        continue;
      }
      const dx = player.x - otherPlayer.x;
      const dy = player.y - otherPlayer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 2) {
        player.alive = false;
        otherPlayer.alive = false;
        console.log(
          `Player ${player.id} collided with player ${otherPlayer.id} and both died at frame ${gameState.frame} in game ${gameId}`
            .red,
        );
      }
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

  // Evaluate frame based on the commands
  evaluteFrame(gameId);

  gameState.frame = gameState.frame + 1;
  gameState.playersCommandsThisFrame = [];

  const alivePlayers = gameState.players.filter((p) => p.alive);

  if (alivePlayers.length < 2 || gameState.frame > gameState.maxFrames) {
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
