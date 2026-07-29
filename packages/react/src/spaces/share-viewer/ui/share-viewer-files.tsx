import { useQuery } from '@apollo/client/react';
import { Alert, Badge, Center, Container, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/ArrowSquareOut';

import { getZipQuery } from '../../../common/util/build-query-string';
import { openDownload } from '../../../common/util/open-download';
import { FileExplorer } from '../../../design-system/file-explorer/feature/file-explorer';
import { DropLogo } from '../../../logo/feature/drop-logo';
import { SharedSpaceDocument } from '../../data-access/shared-space.generated';
import { useSharedSpaceLiveUpdates } from '../../hooks/use-space-live-updates';
import { mapShareViewerFiles } from '../util/map-share-viewer-files';

export interface ShareViewerFilesProps {
  token: string;
  apiBaseUrl: string;
  /** Forwarded to the manage handoff when the viewer is also the author. */
  unlockedPin: string;
  activeImageId?: string | null;
  onActiveImageIdChange?: (fileId: string | null) => void;
  onHome: () => void;
  onManage?: (options: { spaceId: string; pin?: string }) => void;
}

/** The unlocked share: shared space query, live updates, and the file list. */
export function ShareViewerFiles({
  token,
  apiBaseUrl,
  unlockedPin,
  activeImageId,
  onActiveImageIdChange,
  onHome,
  onManage,
}: ShareViewerFilesProps) {
  const { data, loading, error } = useQuery(SharedSpaceDocument, {
    variables: { token },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const sharedSpace = data?.sharedSpace;

  useSharedSpaceLiveUpdates({ token, spaceId: sharedSpace?.id });

  if (loading) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  if (error || !sharedSpace) {
    return (
      <Center mih="100vh" p="md">
        <Alert color="red" title="Unable to load this space">
          {error?.message ?? 'This share may have expired.'}
        </Alert>
      </Center>
    );
  }

  const files = mapShareViewerFiles({
    files: sharedSpace.files ?? [],
    token,
    apiBaseUrl,
  });

  return (
    <Container size="sm" py={48} pos="relative" style={{ zIndex: 1 }}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={6}>
            <DropLogo onHome={onHome} order={3} />
            <Stack gap={6}>
              <Title order={2}>Shared with you</Title>
              <Text c="dimmed" size="sm" maw={420}>
                Download files or select several for a zip. You cannot change this Drop.
              </Text>
            </Stack>
          </Stack>

          {sharedSpace.isAuthor && onManage ? (
            <Badge
              component="button"
              type="button"
              color="sand"
              variant="light"
              mt={4}
              rightSection={<ArrowSquareOutIcon size={12} />}
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={() => onManage({ spaceId: sharedSpace.id, pin: unlockedPin || undefined })}
            >
              Manager
            </Badge>
          ) : null}
        </Group>

        <FileExplorer
          files={files}
          emptyMessage="No files are available in this space."
          onZip={(fileIds) => {
            openDownload(`${apiBaseUrl}/shares/${token}/zip${getZipQuery(fileIds)}`);
          }}
          getDownloadHref={(file) => `${apiBaseUrl}/shares/${token}/files/${file.id}`}
          activeImageId={activeImageId}
          onActiveImageIdChange={onActiveImageIdChange}
        />
      </Stack>
    </Container>
  );
}
