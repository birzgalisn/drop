import { useMutation } from '@apollo/client/react';
import { SegmentedControl, Tooltip } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ArrowsClockwiseIcon } from '@phosphor-icons/react/ArrowsClockwise';
import {
  SpaceConfig,
  createShareFormSchema,
  pluralize,
  type CreateShareFormValues,
} from '@repo/shared';

import { useAppForm, type UseAppFormReturn } from '../../../common/hooks/use-app-form';
import { Button } from '../../../design-system/button/feature/button';
import { Group } from '../../../design-system/group/feature/group';
import { IconButton } from '../../../design-system/icon-button/feature/icon-button';
import { Panel } from '../../../design-system/panel/feature/panel';
import { Pin } from '../../../design-system/pin/feature/pin';
import { Stack } from '../../../design-system/stack/feature/stack';
import { Text } from '../../../design-system/text/feature/text';
import { ICON_SIZE } from '../../../design-system/util/icon-size';
import { SpaceDocument } from '../../files/data-access/space.generated';
import { stashShareViewerPin } from '../../share-viewer/util/share-viewer-pin';
import { CreateShareDocument } from '../data-access/create-share.generated';
import { getSharePin } from '../util/get-share-pin';

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
      <Stack gap="loose">
        <Panel tone="surface" gap="loose">
          <Text variant="title">Protect &amp; share</Text>
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
    <Stack gap="regular">
      <Stack gap="tight">
        <Text variant="label">Link expires after</Text>
        <Text>After this, the link stops working and the files are removed</Text>
      </Stack>
      <SegmentedControl
        value={String(form.values.expiryDays)}
        onChange={(next) =>
          form.setFieldValue('expiryDays', Number(next) as CreateShareFormValues['expiryDays'])
        }
        data={SpaceConfig.SHARE_EXPIRY_PRESETS_DAYS.map((days) => ({
          value: String(days),
          label: `${days} ${pluralize({ count: days, singular: 'day' })}`,
        }))}
      />
    </Stack>
  );
}

function PinField({ form }: { form: ShareForm }) {
  const pinProps = form.getInputProps('pin');

  return (
    <Stack gap="regular">
      <Stack gap="tight">
        <Text variant="label">PIN</Text>
        <Text>
          Recipients must enter this {SpaceConfig.SHARE_PIN_LENGTH}-digit PIN to open the space
        </Text>
      </Stack>
      <Group gap="regular" wrap="nowrap" align="center">
        <Pin
          length={SpaceConfig.SHARE_PIN_LENGTH}
          value={String(pinProps.value ?? '')}
          onChange={pinProps.onChange}
          error={Boolean(pinProps.error)}
          ariaLabel="Share PIN"
        />
        <Tooltip label="Generate a random PIN">
          <IconButton
            variant="default"
            size="sm"
            aria-label="Generate PIN"
            onClick={() => form.setFieldValue('pin', getSharePin())}
          >
            <ArrowsClockwiseIcon size={ICON_SIZE.xl} />
          </IconButton>
        </Tooltip>
      </Group>
      {typeof pinProps.error === 'string' && pinProps.error.length > 0 && (
        <Text variant="error">{pinProps.error}</Text>
      )}
    </Stack>
  );
}
