import { SpaceConfig, type UnlockShareFormValues } from '@repo/shared';

import type { UseAppFormReturn } from '../../../common/hooks/use-app-form';
import { Center } from '../../../design-system/center/feature/center';
import { Paper } from '../../../design-system/paper/feature/paper';
import { Pin } from '../../../design-system/pin/feature/pin';
import { Stack } from '../../../design-system/stack/feature/stack';
import { Text } from '../../../design-system/text/feature/text';
import { DropLogo } from '../../../logo/feature/drop-logo';

export interface ShareViewerUnlockProps {
  form: UseAppFormReturn<UnlockShareFormValues>;
  isUnlocking: boolean;
  /** Remounts the PIN input so focus returns to the first cell after a failure. */
  pinResetKey: number;
  onUnlock: (pin: string) => Promise<boolean>;
  onUnlockError: (error: unknown) => void;
  onHome: () => void;
}

/** PIN gate — recipients see nothing about the space until this succeeds. */
export function ShareViewerUnlock({
  form,
  isUnlocking,
  pinResetKey,
  onUnlock,
  onUnlockError,
  onHome,
}: ShareViewerUnlockProps) {
  const tryUnlock = async (pin: string) => {
    if (isUnlocking || pin.length !== SpaceConfig.SHARE_PIN_LENGTH) {
      return;
    }

    try {
      await onUnlock(pin);
    } catch (error) {
      onUnlockError(error);
    }
  };

  const pinError = typeof form.errors.pin === 'string' ? form.errors.pin : '';

  return (
    <Center mih="100vh" p="md">
      <Stack gap="loose" align="center">
        <DropLogo onHome={onHome} />
        <Paper p="xl" w={360} bg="var(--elevated)">
          <Stack gap="regular">
            <Stack gap="tight">
              <Text variant="title">Shared with you</Text>
              <Text>Enter the PIN from the sender to view and download the files.</Text>
            </Stack>

            <Stack gap="tight">
              <Text variant="label">PIN</Text>
              <Pin
                key={pinResetKey}
                length={SpaceConfig.SHARE_PIN_LENGTH}
                mask
                autoFocus
                disabled={isUnlocking}
                value={String(form.values.pin ?? '')}
                onChange={(value) => {
                  if (value.length > 0) {
                    form.clearFieldError('pin');
                  }

                  form.setFieldValue('pin', value);
                }}
                onComplete={(value) => void tryUnlock(value)}
                error={Boolean(form.errors.pin)}
                ariaLabel="Share PIN"
              />
              {pinError ? <Text variant="error">{pinError}</Text> : null}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Center>
  );
}
