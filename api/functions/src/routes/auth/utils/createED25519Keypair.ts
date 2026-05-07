export const createED25519Keypair = async (): Promise<{
  publicKey: string;
  privateKey: string;
}> => {
  const keyPair = await crypto.subtle.generateKey({ name: "Ed25519" }, true, [
    "sign",
    "verify",
  ]);

  // Export public key as SPKI (standard PEM-compatible format)
  const publicKeyBuffer = await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey,
  );
  const publicKeyB64 = Buffer.from(publicKeyBuffer).toString("base64");
  const publicKey = `-----BEGIN PUBLIC KEY-----\n${publicKeyB64}\n-----END PUBLIC KEY-----`;

  // Export private key as PKCS8 (keep the full structure, don't slice!)
  const privateKeyBuffer = await crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey,
  );
  const privateKeyB64 = Buffer.from(privateKeyBuffer).toString("base64");
  const privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKeyB64}\n-----END PRIVATE KEY-----`;

  return { publicKey, privateKey };
};
