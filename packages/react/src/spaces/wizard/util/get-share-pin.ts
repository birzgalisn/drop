import { SpaceConfig } from '@repo/shared';

/** Cryptographically random numeric PIN of `SpaceConfig.SHARE_PIN_LENGTH` digits. */
export function getSharePin(): string {
  const max = 10 ** SpaceConfig.SHARE_PIN_LENGTH;
  const [random] = crypto.getRandomValues(new Uint32Array(1));
  const value = random! % max;

  return String(value).padStart(SpaceConfig.SHARE_PIN_LENGTH, '0');
}
