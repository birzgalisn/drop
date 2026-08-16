import { SpaceConfig } from '@repo/shared';
import { memo, type ReactNode } from 'react';

import { Anchor } from '../../design-system/anchor/feature/anchor';
import { Background } from '../../design-system/background/feature/background';
import { Container } from '../../design-system/container/feature/container';
import { Dropzone } from '../../design-system/dropzone/feature/dropzone';
import { Group } from '../../design-system/group/feature/group';
import { Stack } from '../../design-system/stack/feature/stack';
import { Text } from '../../design-system/text/feature/text';
import { DropLogo } from '../../logo/feature/drop-logo';
import { usePruneReadyUploads } from '../hooks/use-prune-ready-uploads';
import { useSpaceFiles } from '../hooks/use-space-files';
import { useAuthorSpaceLiveUpdates } from '../hooks/use-space-live-updates';
import { SpaceDropzoneEmpty } from '../ui/space-dropzone-empty';
import { SpaceManageBootError, SpaceManageBootLoader } from '../ui/space-manage-boot';
import { SpaceManageFileList } from '../ui/space-manage-file-list';
import { SpaceManagePreviewLink } from '../ui/space-manage-preview-link';
import { SpaceManageSharePanel } from '../ui/space-manage-share';
import { useUploadToast } from '../upload-notifications/hooks/use-upload-toast';
import { clearSpaceUploads } from '../util/clear-space-uploads';

export interface SpaceManageProps {
  spaceId: string;
  apiBaseUrl: string;
  /** Author PIN for the preview link / share panel (the app stashes it locally). */
  pin?: string;
  /**
   * Rendered instead of the manage surface while the space is still a draft —
   * the app passes a router `<Navigate />` back to the upload step.
   */
  draftFallback?: ReactNode;
  onHome: () => void;
}

/** Author surface for a shared space: share handoff first, then the files. */
export const SpaceManage = memo(function SpaceManage({
  spaceId,
  apiBaseUrl,
  pin,
  draftFallback,
  onHome,
}: SpaceManageProps) {
  const { space, items, uploads, loading, error, removing, addFiles, removeFile, removeFiles } =
    useSpaceFiles({ spaceId, apiBaseUrl, fetchPolicy: 'cache-and-network' });

  useAuthorSpaceLiveUpdates(spaceId);
  usePruneReadyUploads(items);
  useUploadToast({ uploads, spaceId, onCancelUpload: (fileId) => void removeFile(fileId) });

  const startNewDrop = () => {
    clearSpaceUploads();
    onHome();
  };

  if (loading && !space) {
    return (
      <>
        <Background />
        <SpaceManageBootLoader />
      </>
    );
  }

  if (error || !space) {
    return (
      <>
        <Background />
        <SpaceManageBootError error={error} onHome={startNewDrop} />
      </>
    );
  }

  if (space.status === 'DRAFT' && draftFallback) {
    return draftFallback;
  }

  const base = apiBaseUrl.replace(/\/$/, '');
  const token = space.share?.token;

  return (
    <>
      <Background />
      <Container size="sm" py={48}>
        <Stack gap="loose">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Stack gap="tight">
              <DropLogo onHome={startNewDrop} size="compact" />
              <Stack gap="tight" maw={420}>
                <Text variant="title" component="h1">
                  Manage this Drop
                </Text>
                <Text>
                  {pin
                    ? 'Your share is live. Copy the share link below, then add or remove files anytime.'
                    : 'Your share is live. Send the link below plus the PIN you set when sharing.'}
                </Text>
              </Stack>
            </Stack>
            {token ? <SpaceManagePreviewLink token={token} pin={pin} /> : null}
          </Group>

          {token ? (
            <SpaceManageSharePanel
              token={token}
              expiresAt={space.share?.expiresAt ? String(space.share.expiresAt) : null}
              pin={pin}
            />
          ) : null}

          <Stack gap="regular">
            <Stack gap="tight">
              <Text variant="title">Files in this Drop</Text>
              <Text>
                Add or remove files anytime. Recipients only see ready files after they unlock with
                the PIN.
              </Text>
            </Stack>
            <Dropzone
              hasFiles={items.length > 0}
              onAddFiles={(files) => void addFiles(files)}
              maxSize={SpaceConfig.FILE_MAX_BYTES}
              empty={<SpaceDropzoneEmpty />}
            >
              <SpaceManageFileList
                items={items}
                spaceId={spaceId}
                apiBaseUrl={base}
                removing={removing}
                onRemoveFiles={(fileIds) => void removeFiles(fileIds)}
              />
            </Dropzone>
          </Stack>

          <Stack ta="center">
            <Text>
              Done sharing this one?{' '}
              <Anchor component="button" onClick={startNewDrop}>
                Start a new Drop
              </Anchor>
            </Text>
          </Stack>
        </Stack>
      </Container>
    </>
  );
});
