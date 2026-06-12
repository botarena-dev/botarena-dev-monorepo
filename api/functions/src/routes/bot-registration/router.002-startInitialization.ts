import * as z from "zod";
import { Router } from "express";

import type { Response } from "express";
import type { Action } from "@/io/action.type";
import { createED25519Keypair } from "./utils/createED25519KeypairRaw";

const StartInitializationInput = z.object({});

export const startInitialization = async (
  req: Action<typeof StartInitializationInput.shape>,
  res: Response<{ success: boolean }>,
) => {
  const arg1 = StartInitializationInput.parse(req.body.input.arg1);

  //create key pair for the bot
  const { publicKey, privateKey } = await createED25519Keypair();

  console.log(publicKey);
  console.log(privateKey);

  res.status(200).json({
    success: true,
  });
};
const router = Router();

router.all("/auth/start-initialization", startInitialization);

export default router;

/*
    curl -X POST http://localhost:3000/auth/start-initialization \
    -H "Content-Type: application/json" \
    -d '{
    "input": {
      "arg1": {
        
      }
    }
  }'
*/
