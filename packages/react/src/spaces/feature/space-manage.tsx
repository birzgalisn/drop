import { Anchor, Container, Group, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';

import { FloatyBackground } from '../../design-system/floaty-background/feature/floaty-background';
import { DropLogo } from '../../logo/feature/drop-logo';
import { usePruneReadyUploads } from '../hooks/use-prune-ready-uploads';
import { useSpaceFiles } from '../hooks/use-space-files';
import { useAuthorSpaceLiveUpdates } from '../hooks/use-space-live-updates';
import { SpaceFilesDropzone } from '../ui/space-files-dropzone';
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
  activeImageId?: string | null;
  onActiveImageIdChange?: (fileId: string | null) => void;
  onHome: () => void;
}

/** Author surface for a shared space: share handoff first, then the files. */
export function SpaceManage({
  spaceId,
  apiBaseUrl,
  pin,
  draftFallback,
  activeImageId,
  onActiveImageIdChange,
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
        <FloatyBackground />
        <SpaceManageBootLoader />
      </>
    );
  }

  if (error || !space) {
    return (
      <>
        <FloatyBackground />
        <SpaceManageBootError message={error?.message} onHome={startNewDrop} />
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
      <FloatyBackground />
      <Container size="sm" py={48} pos="relative" style={{ zIndex: 1 }}>
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <Stack gap={6}>
              <DropLogo onHome={startNewDrop} order={3} />
              <Stack gap={6}>
                <Title order={2}>Manage this Drop</Title>
                <Text c="dimmed" size="sm" maw={420}>
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

          <Stack gap="md">
            <Text fw={600}>Files in this Drop</Text>
            <Text size="sm" c="dimmed">
              Add or remove files anytime. Recipients only see ready files after they unlock with
              the PIN.
            </Text>
            <SpaceFilesDropzone
              hasFiles={items.length > 0}
              onAddFiles={(files) => void addFiles(files)}
            >
              <SpaceManageFileList
                items={items}
                spaceId={spaceId}
                apiBaseUrl={base}
                removing={removing}
                onRemoveFiles={(fileIds) => void removeFiles(fileIds)}
                activeImageId={activeImageId}
                onActiveImageIdChange={onActiveImageIdChange}
              />
            </SpaceFilesDropzone>
          </Stack>

          <Text size="sm" c="dimmed" ta="center">
            Done sharing this one?{' '}
            <Anchor component="button" type="button" onClick={startNewDrop}>
              Start a new Drop
            </Anchor>
          </Text>
        </Stack>
      </Container>
    </>
  );
}
