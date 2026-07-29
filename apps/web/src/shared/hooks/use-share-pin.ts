import { useState } from 'react';

const SHARE_PIN_STORAGE_PREFIX = 'drop:share-pin:';

function getSharePinStorageKey(spaceId: string): string {
  return `${SHARE_PIN_STORAGE_PREFIX}${spaceId}`;
}

/** Persist author PIN for manage (Preview / cross-tab). */
export function stashSharePin(options: { spaceId: string; pin: string }): void {
  localStorage.setItem(getSharePinStorageKey(options.spaceId), options.pin);
}

/**
 * Author PIN for the manage surface (`spaceId` from the URL).
 * Reads storage once on mount.
 */
export function useSharePin(options: { spaceId: string }) {
  const { spaceId } = options;

  const [pin] = useState(() => localStorage.getItem(getSharePinStorageKey(spaceId)) ?? undefined);

  const clear = () => {
    localStorage.removeItem(getSharePinStorageKey(spaceId));
  };

  return { pin, clear };
}
