import z from "zod";
import { Router } from "express";

import { verifyPassword } from "@/routes/auth/utils/hashPassword";
import { client } from "@/io/graphql";
import { provideJWT } from "@/routes/auth/utils/provideJWT";

import type { Action } from "@/io/action.type";
import type { Response } from "express";

const SignInInput = z.object({
  email: z.email(),
  password: z.string().min(6).max(100),
});

export const signIn = async (
  req: Action<typeof SignInInput.shape>,
  res: Response<{ accessToken: string }>,
) => {
  const arg1 = SignInInput.parse(req.body.input.arg1);

  const usersResponse = await client.query(
    /* GraphQL */ `
      query GetUserByEmail($email: String!) {
        users(where: { email: { _eq: $email } }) {
          id
          email
          password_hash
        }
      }
    `,
    { email: arg1.email },
  );

  const user = usersResponse.data.users[0];

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordVerified = verifyPassword(arg1.password, user.password_hash);

  if (!passwordVerified) {
    throw new Error("Invalid credentials");
  }

  const accessToken = await provideJWT(
    ["user"],
    user.id.toString(),
    user.email,
  );

  res.status(200).json({
    accessToken,
  });
};

const router = Router();

router.all("/auth/sign-in", signIn);

export default router;

/*
    curl -X POST http://localhost:3000/auth/sign-in \
    -H "Content-Type: application/json" \
    -d '{
    "input": {
      "arg1": {
        "password": "test1234!",
        "email": "botko@example.com"
      }
    }
  }'
*/
