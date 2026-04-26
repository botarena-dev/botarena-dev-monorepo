import "dotenv/config";
import "colors";

import { createServer } from "node:http";
import express from "express";
import cors from "cors";

const SERVER_PORT = Number(process.env.SERVER_PORT ?? 31337);

import { writeHeaders } from "./src/writeHeaders.ts";
import { createSocketIoServer } from "./src/sockets.ts";
import { createGameState } from "./src/game-engine/index.ts";

// Do some startup work, like writing the headers to the console.
writeHeaders();

// First we create the games we want to play.
const gameState = createGameState(
  "arena-1",
  process.env.PLAYERS_PUBLIC_KEYS
    ? process.env.PLAYERS_PUBLIC_KEYS.split(",")
    : [],
);

// Bring up the server and the API's
const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const { io } = createSocketIoServer(httpServer);

import { createAPI } from "./src/api.ts";
// Add API routes
const router = createAPI();
app.use(router);

// Listen on the port
httpServer.listen(SERVER_PORT, () => {
  console.log(
    `Bot Arena Server API running on ${`http://localhost:${SERVER_PORT}`.yellow}`
      .green,
    `and socket.io running on ${`ws://localhost:${SERVER_PORT}`.yellow}`.green,
  );
  console.log("-".repeat(80).yellow);
});
