import { useMutation } from '@apollo/client/react';
import { unlockShareFormSchema, type UnlockShareFormValues } from '@repo/shared';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { useAppForm, type UseAppFormReturn } from '../../common/hooks/use-app-form';
import { UnlockShareDocument } from '../data-access/unlock-share.generated';
import { getShareViewerPin, stashShareViewerPin } from '../util/share-viewer-pin';

function getPinFromHash(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return new URLSearchParams(window.location.hash.replace(/^#/, '')).get('pin') ?? '';
}

/** Persist the unlocked PIN in the hash so a reload can auto-unlock. */
function writePinToHash(pin: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  const next = `${window.location.pathname}${window.location.search}#pin=${encodeURIComponent(pin)}`;
  window.history.replaceState(null, '', next);
}

export interface UseShareUnlockResult {
  /** Null until the PIN is accepted. */
  unlockedPin: string | null;
  isUnlocking: boolean;
  /** Bumps to remount PinInput after a failed attempt (resets focus to first cell). */
  pinResetKey: number;
  form: UseAppFormReturn<UnlockShareFormValues>;
  unlock: (pin: string) => Promise<boolean>;
  /** Clear the PIN, surface the error, and remount the PinInput. */
  resetPinAfterError: (error: unknown) => void;
}

/**
 * PIN gate for a share. Auto-unlocks from `#pin=` or a PIN stashed by the
 * manage → preview handoff, so those links open without retyping.
 */
export function useShareUnlock({ token }: { token: string }): UseShareUnlockResult {
  const [unlockedPin, setUnlockedPin] = useState<string | null>(null);
  const [initialPin] = useState(() => getPinFromHash() || getShareViewerPin(token));
  const [pinResetKey, setPinResetKey] = useState(0);
  const [unlockShare, { loading: isUnlocking }] = useMutation(UnlockShareDocument);
  const autoUnlockAttempted = useRef(false);

  const form = useAppForm<UnlockShareFormValues>({
    schema: unlockShareFormSchema,
    initialValues: { pin: initialPin },
  });

  const resetPinAfterError = (error: unknown) => {
    form.setFieldValue('pin', '');
    form.handleError(error);
    setPinResetKey((key) => key + 1);
  };

  const unlock = async (pin: string) => {
    const { data } = await unlockShare({ variables: { token, pin } });

    if (data?.unlockShare.ok) {
      writePinToHash(pin);
      stashShareViewerPin({ token, pin });
      setUnlockedPin(pin);
      return true;
    }

    return false;
  };

  const attemptAutoUnlock = useEffectEvent(() => {
    if (!initialPin || autoUnlockAttempted.current) {
      return;
    }

    autoUnlockAttempted.current = true;
    void unlock(initialPin).catch(resetPinAfterError);
  });

  useEffect(() => {
    attemptAutoUnlock();
  }, []);

  return {
    unlockedPin,
    isUnlocking,
    pinResetKey,
    form,
    unlock,
    resetPinAfterError,
  };
}
