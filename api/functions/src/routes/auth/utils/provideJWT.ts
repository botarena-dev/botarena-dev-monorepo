import { importPKCS8, SignJWT } from "jose";

export const provideJWT = async (
  roles: string[],
  userId: string,
  email: string,
) => {
  const payload = {
    userId,
    "x-hasura-allowed-roles": roles,
    "x-hasura-default-role": roles[0],
    "x-hasura-user-id": userId,
    "x-hasura-email": email,
  };

  const privateKeyPem: string | undefined = process.env.JWT_PRIVATE_KEY;

  if (!privateKeyPem) {
    throw new Error("JWT private key not set");
  }

  const privateKey = await importPKCS8(privateKeyPem, "EdDSA");

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "EdDSA" })
    .sign(privateKey);

  return token;
};
