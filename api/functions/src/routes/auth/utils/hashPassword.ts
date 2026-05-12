import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync: (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer> = promisify(scrypt);

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);

  return `${salt}:${derivedKey.toString("hex")}`;
};

export const verifyPassword = async (password: string, hash: string) => {
  const [salt, key] = hash.split(":");

  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = await scryptAsync(password, salt, 64);

  return timingSafeEqual(derivedKey, keyBuffer);
};
