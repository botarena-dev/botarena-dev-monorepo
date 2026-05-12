import * as z from "zod";
import { Router } from "express";

import { hashPassword } from "@/routes/auth/utils/hashPassword";
import { client } from "@/io/graphql";

import type { Response } from "express";
import type { Action } from "@/io/action.type";

const SignUpInput = z.object({
  nickname: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
  email: z.email(),
});

export const signUp = async (
  req: Action<typeof SignUpInput.shape>,
  res: Response<{ id: number }>,
) => {
  const arg1 = SignUpInput.parse(req.body.input.arg1);

  const hashedPassword = await hashPassword(arg1.password);

  //TODO: Store the user in the database with the hashed password
  const response = await client.mutation(
    /* GraphQL */ `
      mutation CreateUser(
        $passwordHash: String!
        $nickname: String!
        $email: String!
      ) {
        insert_users_one(
          object: {
            password_hash: $passwordHash
            email: $email
            nickname: $nickname
          }
        ) {
          id
        }
      }
    `,
    {
      passwordHash: hashedPassword,
      nickname: arg1.nickname,
      email: arg1.email,
    },
  );

  res.status(200).json({
    id: response.data.insert_users_one.id,
  });
};
const router = Router();

router.all("/auth/sign-up", signUp);

export default router;

/*
    curl -X POST http://localhost:3000/auth/sign-up \
    -H "Content-Type: application/json" \
    -d '{
    "input": {
      "arg1": {
        "nickname": "Botko Prime",
        "password": "test1234!",
        "email": "botko@example.com"
      }
    }
  }'
*/
