import { Server, Socket } from "socket.io";
import type { Server as HttpServer } from "node:http";
import z from "zod";

import {
  getGameState,
  connectPlayerBotToGame,
  playerPlaysCommand,
} from "./game-engine/index.ts";
import type { PlayerCommand } from "./game-engine/index.ts";

export const createSendServerMessage =
  (socket: Server | Socket) => (message: string) => {
    socket.emit("server:message", message);
  };
export const createSendServerError =
  (socket: Server | Socket) => (errorMessage: string, details?: object) => {
    socket.emit("server:error", errorMessage, {
      details: { timestamp: Date.now(), ...details },
    });
  };

export const joinGame = () => {};

export const createSocketIoServer = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  const sendServerMessageToAllSockets = createSendServerMessage(io);
  const sendServerErrorToAllSockets = createSendServerError(io);

  const broadcastPublicState = (socket: Server | Socket) => {
    const gameState = getGameState("arena-1"); // TODO: Dynamic game ID
    socket.emit("game:state", gameState);
  };

  io.on("connection", (socket) => {
    console.log(`Client connected, socket id: ${`${socket.id}`.yellow}`.green);
    const sendServerMessage = createSendServerMessage(socket);
    const sendServerError = createSendServerError(socket);

    sendServerMessage("Welcome to the Bot Arena!");
    sendServerMessage("Please authenticate to join the game!");

    let gameId: string | null = null; // If gameId is null, the client is not authenticated.

    socket.on("auth:get-challenge", () => {
      console.log(`Client ${socket.id} requested auth challenge`.yellow);
      socket.emit("auth:challenge", "this-is-a-challenge-jwt");
    });

    socket.on("game:join", (data) => {
      console.log(
        `Client ${socket.id} wants to join the game with token: ${JSON.stringify(data)}`,
      );

      // TODO: Validate token and get gameId from it. For now, we just accept any token and assign a gameId.
      gameId = data.gameId;
      sendServerMessage("You joined the game: " + gameId);
      // broadcastPublicState(socket);
      console.log(
        `Client ${`${socket.id}`.yellow} joined game ${`${gameId}`.yellow}`
          .green,
      );
      connectPlayerBotToGame(gameId ?? "", data.publicKey, socket, io);
    });

    const gameCommandSchema = z.object({
      frame: z.number(),
      command: z.enum(["left", "right", "nop"]),
      publicKey: z.string(),
      signature: z.string(),
    });
    socket.on("game:command", (input) => {
      const parseResult = gameCommandSchema.safeParse(input);
      if (!parseResult.success) {
        console.log(
          `Invalid command from client ${socket.id}: ${JSON.stringify(input)}`
            .red,
        );
        return;
      }
      const { frame, command, publicKey } = parseResult.data;
      console.log(
        `Received command from client ${socket.id} for game ${gameId}: ${command} at frame ${frame}`,
      );
      playerPlaysCommand(gameId!, command, frame, publicKey, socket, io);
      // broadcastPublicState();
    });

    socket.on("disconnect", () => {
      console.log(
        `Client disconnected, socket id: ${`${socket.id}`.yellow}`.red,
      );
    });
  });

  // const timer = setInterval(() => {
  //   const gameState = getGameState("arena-1"); // TODO: Dynamic game ID
  //   if (!gameState || gameState.status !== "running") {
  //     return;
  //   }
  //   // broadcastPublicState();
  // }, 300);

  return { io };
};
