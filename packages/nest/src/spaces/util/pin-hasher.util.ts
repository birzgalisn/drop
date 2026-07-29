import { BinaryLike, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptPromise: (password: BinaryLike, salt: BinaryLike, keylen: number) => Promise<Buffer> =
  promisify(scrypt);

/**
 * Stateless PIN hashing built on `node:crypto` scrypt (no bcrypt dependency).
 * Stored format is `scrypt$<saltHex>$<hashHex>`, so salt travels with the hash
 * and verification is self-describing.
 */
export class PinHasher {
  private static readonly SCHEME = 'scrypt';
  private static readonly SALT_BYTES = 16;
  private static readonly KEY_BYTES = 64;

  static async hash(pin: string): Promise<string> {
    const salt = randomBytes(PinHasher.SALT_BYTES);
    const derived = await scryptPromise(pin, salt, PinHasher.KEY_BYTES);

    return `${PinHasher.SCHEME}$${salt.toString('hex')}$${derived.toString('hex')}`;
  }

  static async verify(pin: string, stored: string): Promise<boolean> {
    const [scheme, saltHex, hashHex] = stored.split('$');

    if (scheme !== PinHasher.SCHEME || !saltHex || !hashHex) {
      return false;
    }

    const expected = Buffer.from(hashHex, 'hex');
    const derived = await scryptPromise(pin, Buffer.from(saltHex, 'hex'), expected.length);

    return derived.length === expected.length && timingSafeEqual(derived, expected);
  }
}
