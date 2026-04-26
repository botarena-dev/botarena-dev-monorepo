import "dotenv/config";
import "colors";

// We connect to the endpoint with socket.io client
import { io } from "socket.io-client";

import { writeHeaders } from "./src/writeHeaders.ts";

const SERVER_URL = process.env.SERVER_URL ?? "ws://localhost:31337";

const socket = io(SERVER_URL, {
  transports: ["websocket"],
});

// Clear the console
console.clear();

import {
  createED25519Keypair,
  getPublicKeyFromPrivateKey,
} from "./src/createED25519Keypair.ts";
// console.log(await createED25519Keypair());

const BOT_PRIVATE_KEY_INDEX = process.env.BOT_PRIVATE_KEY_INDEX ?? "1";
const BOT_PRIVATE_KEY = process.env[`BOT_PRIVATE_KEY_${BOT_PRIVATE_KEY_INDEX}`];

const BOT_PUBLIC_KEY = await getPublicKeyFromPrivateKey(BOT_PRIVATE_KEY);

writeHeaders();
console.log(`Bot trying to connect to server at: ${SERVER_URL.yellow}`.green);
console.log(`Client playing as: ${BOT_PUBLIC_KEY}`.yellow);
console.log("-".repeat(80).yellow);

socket.on("connect", () => {
  console.log(`Connected to server, socket id: ${`${socket.id}`.yellow}`.green);
  // Wait a bit before requesting the auth challenge, just for fun
  console.log(
    "Waiting 1 second before requesting auth challenge... just for fun...".blue,
  );
  setTimeout(() => {
    console.log("Requesting auth challenge from server...".blue);
    socket.emit("auth:get-challenge");
  }, 1000);
});
socket.on("disconnect", () => {
  console.log("Disconnected from server".red);
});

socket.on("auth:challenge", (challengeJWT) => {
  console.log(`Received auth challenge: ${JSON.stringify(challengeJWT)}`.blue);
  // TODO: Sign the challenge and send the response

  // Join game
  console.log(`Joining game arena-1 as ${BOT_PUBLIC_KEY} `.blue);
  socket.emit("game:join", {
    gameId: "arena-1",
    publicKey: BOT_PUBLIC_KEY,
    signature: challengeJWT + "my-signature",
  });
});

let lastFrameISentCommand = -1; // To reduce spam.
// Get game request
socket.on("game:state", (gameState) => {
  console.log(
    `Received game state`.blue,
    `Frame: ${gameState.frame}`.yellow,
    `Status: ${gameState.status}`.yellow,
  );

  if (
    gameState.status === "running" &&
    gameState.frame !== lastFrameISentCommand
  ) {
    if (gameState.frame % 100 === 0) {
      socket.emit("game:command", {
        frame: gameState.frame,
        command: "left",
        publicKey: BOT_PUBLIC_KEY,
        signature: "my signature",
      });
    } else {
      socket.emit("game:command", {
        frame: gameState.frame,
        command: "nop",
        publicKey: BOT_PUBLIC_KEY,
        signature: "my signature",
      });
    }
    lastFrameISentCommand = gameState.frame;
  }
});

// Server messages and errors
socket.on("server:message", (message) => {
  // console.log(`Received server message: ${JSON.stringify(message)}`.magenta);
  console.log(`${message}`.magenta);
});
socket.on("server:error", (error) => {
  // console.log(`Received server error: ${JSON.stringify(error)}`.red);
  console.log(`${error}`.red);
});
