import * as z from "zod";
import { Router } from "express";

import type { Response } from "express";
import type { Action } from "@/io/action.type";
import { createED25519Keypair } from "./utils/createED25519KeypairRaw";
import { client } from "@/io/graphql";

const RegisterBotInput = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const registerBot = async (
  req: Action<typeof RegisterBotInput.shape>,
  res: Response<{ key: string }>,
) => {
  const arg1 = RegisterBotInput.parse(req.body.input.arg1);

  //create key pair for the bot
  const { publicKey, privateKey } = await createED25519Keypair();

  const userId = req.body?.session_variables["x-hasura-user-id"];

  if (!userId) {
    throw new Error("User not authenticated");

    return;
  }

  const response = await client.mutation(
    /* GraphQL */ `
      mutation CreateBot(
        $name: String!
        $description: String
        $key: String!
        $userId: Int!
      ) {
        insert_bots_one(
          object: {
            name: $name
            description: $description
            key: $key
            user_id: $userId
          }
        ) {
          id
        }
      }
    `,
    {
      name: arg1.name,
      description: arg1.description,
      key: publicKey,
      userId: req.body.session_variables["x-hasura-user-id"],
    },
  );

  res.status(200).json({
    key: privateKey,
  });
};
const router = Router();

router.all("/auth/register-bot", registerBot);

export default router;

/*
    curl -X POST http://localhost:3000/auth/register-bot \
    -H "Content-Type: application/json" \
    -d '{
    "session_variables": {
        "x-hasura-user-id": 5
    },
    "input": {
      "arg1": {
        "name": "My Bot",
        "description": "This is my bot"
      }
    }
  }'
*/
