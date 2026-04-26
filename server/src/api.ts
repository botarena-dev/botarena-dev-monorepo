import { Battleground } from "./game-engine/old-index.ts";
import type { PublicGameState } from "./game-engine/index.ts";
import express from "express";

import { getGameState } from "./game-engine/index.ts";

export const createAPI = () => {
  const router = express.Router();

  router.get("/simulation", (_req, res) => {
    const battleground = new Battleground([1, 2, 3]);
    res.send({ players: battleground.players, grid: battleground.grid });
  });

  router.get("/game/state", (_req, res) => {
    const gameState = getGameState("arena-1"); // TODO: Dynamic game ID
    res.send(gameState);
  });

  router.get("/game/status", (_req, res) => {
    const gameState = getGameState("arena-1"); // TODO: Dynamic game ID
    res.send(gameState);
  });

  // This has to be last
  router.use("/", express.static("public", { index: "index.html" }));

  return router;
};
