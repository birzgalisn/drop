import { useMutation } from '@apollo/client/react';
import {
  ActionIcon,
  Button,
  Group,
  PinInput,
  SegmentedControl,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ArrowsClockwiseIcon } from '@phosphor-icons/react/ArrowsClockwise';
import { SpaceConfig, createShareFormSchema, type CreateShareFormValues } from '@repo/shared';
import type { CSSProperties } from 'react';

import { useAppForm, type UseAppFormReturn } from '../../common/hooks/use-app-form';
import { Panel } from '../../design-system/panel/feature/panel';
import { CreateShareDocument } from '../data-access/create-share.generated';
import { SpaceDocument } from '../data-access/space.generated';
import { getSharePin } from '../util/get-share-pin';
import { stashShareViewerPin } from '../util/share-viewer-pin';

type ShareForm = UseAppFormReturn<CreateShareFormValues>;

export interface SpaceWizardShareProps {
  spaceId?: string;
  /** After createShare — leave for the manage surface (URL owns success). */
  onShared: (payload: { spaceId: string; token: string; pin: string }) => void;
}

/** Share step: pick an expiry and a PIN, then create the share link. */
export function SpaceWizardShare({ spaceId, onShared }: SpaceWizardShareProps) {
  const [createShare, { loading }] = useMutation(CreateShareDocument);

  const form = useAppForm<CreateShareFormValues>({
    schema: createShareFormSchema,
    initialValues: {
      expiryDays: SpaceConfig.SHARE_EXPIRY_PRESETS_DAYS[1],
      pin: '',
    },
  });

  const submit = form.onSubmit(async (values) => {
    if (!spaceId) {
      return;
    }

    try {
      const { data } = await createShare({
        variables: { input: { spaceId, expiryDays: values.expiryDays, pin: values.pin } },
        refetchQueries: [{ query: SpaceDocument, variables: { id: spaceId } }],
        awaitRefetchQueries: true,
        update(cache) {
          cache.modify({
            id: cache.identify({ __typename: 'Space', id: spaceId }),
            fields: {
              status: () => 'SHARED',
            },
          });
        },
      });

      if (data?.createShare.token) {
        stashShareViewerPin({ token: data.createShare.token, pin: values.pin });
        notifications.show({
          color: 'sand',
          title: 'Share is live',
          message: 'Copy your link with PIN on the next screen.',
        });
        onShared({ spaceId, token: data.createShare.token, pin: values.pin });
      }
    } catch (error) {
      form.handleError(error);
    }
  });

  return (
    <form onSubmit={submit}>
      <Stack gap="lg">
        <Panel tone="surface" gap="lg">
          <Text fw={600}>Protect &amp; share</Text>
          <ExpiryField form={form} />
          <PinField form={form} />
        </Panel>
        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            Share
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function ExpiryField({ form }: { form: ShareForm }) {
  return (
    <Stack gap={4}>
      <Text size="sm" fw={500}>
        Link expires after
      </Text>
      <SegmentedControl
        value={String(form.values.expiryDays)}
        onChange={(next) =>
          form.setFieldValue('expiryDays', Number(next) as CreateShareFormValues['expiryDays'])
        }
        data={SpaceConfig.SHARE_EXPIRY_PRESETS_DAYS.map((days) => ({
          value: String(days),
          label: `${days} day${days === 1 ? '' : 's'}`,
        }))}
      />
    </Stack>
  );
}

function PinField({ form }: { form: ShareForm }) {
  const pinProps = form.getInputProps('pin');

  return (
    <Stack gap={6}>
      <Text size="sm" fw={500}>
        PIN
      </Text>
      <Text size="xs" c="dimmed">
        Recipients must enter this {SpaceConfig.SHARE_PIN_LENGTH}-digit PIN to open the space
      </Text>
      <Group
        gap="xs"
        wrap="nowrap"
        align="center"
        style={{ '--share-pin-control-size': '36px' } as CSSProperties}
      >
        <PinInput
          length={SpaceConfig.SHARE_PIN_LENGTH}
          type="number"
          oneTimeCode
          value={String(pinProps.value ?? '')}
          onChange={pinProps.onChange}
          error={Boolean(pinProps.error)}
          aria-label="Share PIN"
          styles={{
            pinInput: {
              width: 'var(--share-pin-control-size)',
              height: 'var(--share-pin-control-size)',
              '--input-height': 'var(--share-pin-control-size)',
              '--input-size': 'var(--share-pin-control-size)',
            },
          }}
        />
        <Tooltip label="Generate a random PIN">
          <ActionIcon
            variant="default"
            aria-label="Generate PIN"
            onClick={() => form.setFieldValue('pin', getSharePin())}
            style={{
              width: 'var(--share-pin-control-size)',
              height: 'var(--share-pin-control-size)',
              minWidth: 'var(--share-pin-control-size)',
              minHeight: 'var(--share-pin-control-size)',
            }}
          >
            <ArrowsClockwiseIcon size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>
      {typeof pinProps.error === 'string' && pinProps.error.length > 0 && (
        <Text size="xs" c="red">
          {pinProps.error}
        </Text>
      )}
    </Stack>
  );
}
