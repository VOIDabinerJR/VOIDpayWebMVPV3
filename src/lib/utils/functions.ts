import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

/**
 * Populates target object with non-empty properties from source object
 * @param source Source object containing potential updates
 * @param target Target object to be updated
 */
function populateUpdatedFields<T extends Record<string, any>>(
  source: Partial<T>,
  target: T
): void {
  for (const key in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      source[key] !== ''
    ) {
      target[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
}

/**
 * Generates a short 4-character alphanumeric ID
 * @returns Random 4-character string
 */
function shortID(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * Generates an extended ID with prefix and random characters
 * @param id Prefix for the generated ID
 * @returns String combining the prefix and random characters
 */
function shortID2(id: string): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = id + 'VOID';
  for (let i = 0; i < 40; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * Generates a random UUID v4 as client ID
 * @returns UUID string
 */
function generateClientId(): string {
  return uuidv4();
}

/**
 * Generates a cryptographically secure random client secret
 * @returns Hexadecimal string
 */
function generateClientSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generates a transaction reference using UUID v4
 * @returns UUID string
 */
function generateTransictionReference(): string {
  return uuidv4();
}

/**
 * Hashes information using bcrypt
 * @param info Information to be hashed
 * @returns Promise resolving to hashed string or error message
 */
async function hashInfo(info: string): Promise<string> {
  try {
    const hashedInfo = await bcrypt.hash(info, 8);
    return hashedInfo;
  } catch (error) {
    console.error('Error hashing info:', error);
    return 'Error hashing info';
  }
}

export {
  populateUpdatedFields,
  generateClientId,
  generateClientSecret,
  shortID,
  hashInfo,
  shortID2,
  generateTransictionReference
};
