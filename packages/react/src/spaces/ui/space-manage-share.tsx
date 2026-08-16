import { Button, CopyButton, TextInput, Tooltip } from '@mantine/core';
import { CheckIcon } from '@phosphor-icons/react/Check';
import { CopyIcon } from '@phosphor-icons/react/Copy';
import { Dates } from '@repo/shared';

import { Group } from '../../design-system/group/feature/group';
import { IconButton } from '../../design-system/icon-button/feature/icon-button';
import { Panel } from '../../design-system/panel/feature/panel';
import { Pin } from '../../design-system/pin/feature/pin';
import { QrCode } from '../../design-system/qr-code/feature/qr-code';
import { Stack } from '../../design-system/stack/feature/stack';
import { Text } from '../../design-system/text/feature/text';
import { ICON_SIZE } from '../../design-system/util/icon-size';
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
    <Panel tone="surface">
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="regular">
        <Stack gap="regular" flex={1} miw={0}>
          <Stack gap="tight">
            <Text variant="title">Share link</Text>
            <Text>{expiresAt ? `Expires ${Dates.formatDate(expiresAt)}` : 'Live share'}</Text>
          </Stack>
          <SharePin pin={pin} />
        </Stack>
        <QrCode data={pinUrl ?? publicUrl} />
      </Group>

      <Stack gap="regular">
        <TextInput
          value={publicUrl}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
          rightSection={
            <CopyButton value={publicUrl}>
              {({ copied, copy }) => (
                <IconButton
                  variant="subtle"
                  onClick={copy}
                  aria-label={copied ? 'Copied' : 'Copy link'}
                >
                  {copied ? <CheckIcon size={ICON_SIZE.md} /> : <CopyIcon size={ICON_SIZE.md} />}
                </IconButton>
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
      <Text>
        The PIN was set when you shared. Recipients need it to unlock — send it with the link if you
        still have it.
      </Text>
    );
  }

  return (
    <Group gap="regular" align="center" wrap="nowrap">
      <Text>PIN</Text>
      <Pin value={pin} readOnly />
      <CopyButton value={pin}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? 'Copied' : 'Copy PIN'}>
            <IconButton
              variant="subtle"
              aria-label={copied ? 'PIN copied' : 'Copy PIN'}
              onClick={copy}
            >
              {copied ? <CheckIcon size={ICON_SIZE.md} /> : <CopyIcon size={ICON_SIZE.md} />}
            </IconButton>
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
    <Group grow gap="regular">
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
