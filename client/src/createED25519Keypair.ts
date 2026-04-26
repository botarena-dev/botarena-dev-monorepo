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

  // Export the public key in raw format (32 bytes)
  const publicKeyBuffer = await crypto.subtle.exportKey(
    "raw",
    keyPair.publicKey,
  );
  const publicKey = Buffer.from(publicKeyBuffer).toString("base64");

  // Export the private key in PKCS8 format
  const privateKeyBuffer = await crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey,
  );
  // Export only the raw private key (32 bytes) instead of the full PKCS8 structure
  const privateKeyRawBuffer = Buffer.from(privateKeyBuffer).slice(-32);
  const privateKey = privateKeyRawBuffer.toString("base64");

  return { publicKey, privateKey };
};

export const getPublicKeyFromPrivateKey = async (
  privateKeyBase64: string,
): Promise<string> => {
  const privateKeyBuffer = Buffer.from(privateKeyBase64, "base64");
  if (privateKeyBuffer.length !== 32) {
    throw new Error(
      `Invalid private key length: expected 32 bytes, got ${privateKeyBuffer.length} bytes`,
    );
  }

  // PKCS#8 prefix for Ed25519 private key
  const pkcs8Prefix = Buffer.from([
    0x30,
    0x2e, // SEQUENCE
    0x02,
    0x01,
    0x00, // version
    0x30,
    0x05, // algorithm
    0x06,
    0x03,
    0x2b,
    0x65,
    0x70, // OID 1.3.101.112 (Ed25519)
    0x04,
    0x22, // OCTET STRING
    0x04,
    0x20, // inner OCTET STRING (32 bytes)
  ]);

  const pkcs8Key = Buffer.concat([pkcs8Prefix, privateKeyBuffer]);

  // Derive the public key from the private key using the Ed25519 algorithm
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    pkcs8Key,
    { name: "Ed25519" },
    true,
    ["sign"],
  );

  // Get the public key from the private key CryptoKey object
  const publicKeyBuffer = await crypto.subtle
    .exportKey("jwk", privateKey)
    .then((jwk) => {
      if (jwk.kty !== "OKP" || jwk.crv !== "Ed25519" || !jwk.x) {
        throw new Error("Invalid JWK format for Ed25519 key");
      }
      return Buffer.from(jwk.x, "base64");
    });

  return publicKeyBuffer.toString("base64");
};
