import {
  ActionIcon,
  Button,
  CopyButton,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { CheckIcon } from '@phosphor-icons/react/Check';
import { CopyIcon } from '@phosphor-icons/react/Copy';
import { Dates } from '@repo/shared';

import { Panel } from '../../design-system/panel/feature/panel';
import { QrCode } from '../../design-system/qr-code/feature/qr-code';
import { getShareViewerUrl } from '../util/get-share-viewer-url';

export interface SpaceManageSharePanelProps {
  token: string;
  expiresAt: string | null;
  /** Only known when the author still has the PIN stashed locally. */
  pin?: string;
}

/** Share handoff: link, PIN, QR, and copy buttons. */
export function SpaceManageSharePanel({ token, expiresAt, pin }: SpaceManageSharePanelProps) {
  const publicUrl = getShareViewerUrl({ token });
  const pinUrl = pin ? getShareViewerUrl({ token, pin }) : null;

  return (
    <Panel>
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
        <Stack gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <Stack gap={4}>
            <Text fw={600}>Share link</Text>
            <Text size="sm" c="dimmed">
              {expiresAt ? `Expires ${Dates.formatDate(expiresAt)}` : 'Live share'}
            </Text>
          </Stack>
          <SharePin pin={pin} />
        </Stack>
        <QrCode url={pinUrl ?? publicUrl} size={88} />
      </Group>

      <Stack gap="xs">
        <TextInput
          value={publicUrl}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
          rightSection={
            <CopyButton value={publicUrl}>
              {({ copied, copy }) => (
                <ActionIcon
                  variant="subtle"
                  onClick={copy}
                  aria-label={copied ? 'Copied' : 'Copy link'}
                >
                  {copied ? <CheckIcon size={14} /> : <CopyIcon size={16} />}
                </ActionIcon>
              )}
            </CopyButton>
          }
        />
        <CopyActions publicUrl={publicUrl} pinUrl={pinUrl} />
      </Stack>
    </Panel>
  );
}

function SharePin({ pin }: { pin?: string }) {
  if (!pin) {
    return (
      <Text size="xs" c="dimmed">
        The PIN was set when you shared. Recipients need it to unlock — send it with the link if you
        still have it.
      </Text>
    );
  }

  return (
    <Group gap="sm" align="center" wrap="nowrap">
      <Text size="sm" c="dimmed" style={{ flexShrink: 0 }}>
        PIN
      </Text>
      <Text ff="monospace" fw={700} style={{ fontSize: '1.35rem', letterSpacing: '0.22em' }}>
        {pin}
      </Text>
      <CopyButton value={pin}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? 'Copied' : 'Copy PIN'}>
            <ActionIcon
              variant="subtle"
              color={copied ? 'sand' : 'graphite'}
              aria-label={copied ? 'PIN copied' : 'Copy PIN'}
              onClick={copy}
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={16} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
}

function CopyActions({ publicUrl, pinUrl }: { publicUrl: string; pinUrl: string | null }) {
  if (!pinUrl) {
    return (
      <CopyButton value={publicUrl}>
        {({ copied, copy }) => (
          <Button fullWidth variant={copied ? 'light' : 'filled'} onClick={copy}>
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        )}
      </CopyButton>
    );
  }

  return (
    <Group grow gap="xs">
      <CopyButton value={pinUrl}>
        {({ copied, copy }) => (
          <Button fullWidth variant={copied ? 'light' : 'filled'} onClick={copy}>
            {copied ? 'Copied' : 'Copy with PIN'}
          </Button>
        )}
      </CopyButton>
      <CopyButton value={publicUrl}>
        {({ copied, copy }) => (
          <Button fullWidth variant={copied ? 'light' : 'default'} onClick={copy}>
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        )}
      </CopyButton>
    </Group>
  );
}
