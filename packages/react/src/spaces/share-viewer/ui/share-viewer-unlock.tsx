import { Center, Paper, PinInput, Stack, Text, Title } from '@mantine/core';
import { SpaceConfig, type UnlockShareFormValues } from '@repo/shared';

import type { UseAppFormReturn } from '../../../common/hooks/use-app-form';
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
    <Center mih="100vh" p="md" pos="relative" style={{ zIndex: 1 }}>
      <Stack gap="lg" align="center">
        <DropLogo onHome={onHome} />
        <Paper p="xl" radius="md" withBorder w={360} bg="var(--drop-elevated)">
          <Stack gap="md">
            <Stack gap={4}>
              <Title order={3}>Shared with you</Title>
              <Text size="sm" c="dimmed">
                Enter the PIN from the sender to view and download the files.
              </Text>
            </Stack>

            <Stack gap={6}>
              <Text size="sm" fw={500}>
                PIN
              </Text>
              <PinInput
                key={pinResetKey}
                length={SpaceConfig.SHARE_PIN_LENGTH}
                type="number"
                oneTimeCode
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
                aria-label="Share PIN"
              />
              {pinError ? (
                <Text size="xs" c="red">
                  {pinError}
                </Text>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Center>
  );
}
