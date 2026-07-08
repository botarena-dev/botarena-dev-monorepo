import "colors";

import express from "express";
import { getGameState } from "@/game-engine";

export const createAPI = () => {
  const router = express.Router();

  router.get("/simulation", (_req, res) => {
    const gameState = getGameState("arena-1"); // TODO: Dynamic game ID
    res.send(gameState);
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
