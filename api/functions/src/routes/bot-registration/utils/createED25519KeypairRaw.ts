export const createED25519Keypair = async (): Promise<{
  publicKey: string;
  privateKey: string;
}> => {
  // Use the Web Crypto API to generate an Ed25519 key pair
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "Ed25519",
      namedCurve: "Ed25519",
    },
    true, // extractable
    ["sign", "verify"],
  );

  const publicKeyBuffer = await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey,
  );
  const publicKey = Buffer.from(publicKeyBuffer).toString("base64");

  const privateKeyBuffer = await crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey,
  );
  const privateKey = Buffer.from(privateKeyBuffer).toString("base64");

  return { publicKey, privateKey };
};

export const getPublicKeyFromPrivateKey = async (
  privateKeyBase64: string,
): Promise<string> => {
  const privateKeyBuffer = Buffer.from(privateKeyBase64, "base64");

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    { name: "Ed25519" },
    true,
    ["sign"],
  );

  const publicKeyBuffer = await crypto.subtle.exportKey("spki", privateKey);
  return Buffer.from(publicKeyBuffer).toString("base64");
};
