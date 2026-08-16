import { useQuery } from '@apollo/client/react';
import { Alert, Badge, Loader } from '@mantine/core';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/ArrowSquareOut';

import { Center } from '../../../design-system/center/feature/center';
import { Container } from '../../../design-system/container/feature/container';
import { Dropzone } from '../../../design-system/dropzone/feature/dropzone';
import {
  FileTable,
  type UseFileTable,
  type UseImageView,
} from '../../../design-system/file-table/feature/file-table';
import { Group } from '../../../design-system/group/feature/group';
import { Stack } from '../../../design-system/stack/feature/stack';
import { useTableContext } from '../../../design-system/table/feature/table';
import { Text } from '../../../design-system/text/feature/text';
import { ICON_SIZE } from '../../../design-system/util/icon-size';
import { DropLogo } from '../../../logo/feature/drop-logo';
import { SharedSpaceDocument } from '../../data-access/shared-space.generated';
import { useSharedSpaceLiveUpdates } from '../../hooks/use-space-live-updates';
import { useShareViewerFileTable } from '../hooks/use-share-viewer-file-table';
import { useShareViewerImageView } from '../hooks/use-share-viewer-image-view';
import {
  getShareViewerFileRows,
  type ShareViewerFileRow,
} from '../util/get-share-viewer-file-rows';
import { openShareZip } from '../util/open-share-zip';
import { shareViewerFileColumns } from '../util/share-viewer-file-columns';

export interface ShareViewerFilesProps {
  token: string;
  apiBaseUrl: string;
  /** Forwarded to the manage handoff when the viewer is also the author. */
  unlockedPin: string;
  onHome: () => void;
  onManage?: (options: { spaceId: string; pin?: string }) => void;
}

/** The unlocked share: shared space query, live updates, and the file list. */
export function ShareViewerFiles({
  token,
  apiBaseUrl,
  unlockedPin,
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

  const files = getShareViewerFileRows({
    files: sharedSpace.files ?? [],
    token,
    apiBaseUrl,
  });

  const useTable: UseFileTable<ShareViewerFileRow> = ({ rows }) =>
    useShareViewerFileTable({ rows });

  const useImageView: UseImageView<ShareViewerFileRow> = ({ rows }) =>
    useShareViewerImageView({
      rows,
      token,
      apiBaseUrl,
    });

  return (
    <Container size="sm" py={48}>
      <Stack gap="loose">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap="tight">
            <DropLogo onHome={onHome} size="compact" />
            <Stack gap="tight" maw={420}>
              <Text variant="title" component="h1">
                Shared with you
              </Text>
              <Text>Download files or select several for a zip.</Text>
            </Stack>
          </Stack>

          {sharedSpace.isAuthor && onManage ? (
            <Badge
              component="button"
              type="button"
              color="sand"
              variant="light"
              rightSection={<ArrowSquareOutIcon size={ICON_SIZE.sm} />}
              style={{ cursor: 'pointer', flexShrink: 0 }}
              onClick={() => onManage({ spaceId: sharedSpace.id, pin: unlockedPin || undefined })}
            >
              Manager
            </Badge>
          ) : null}
        </Group>

        <Dropzone hasFiles={files.length > 0}>
          <FileTable
            rows={files}
            columns={shareViewerFileColumns}
            useTable={useTable}
            useImageView={useImageView}
          >
            {({ Toolbar, List, ImageView }) => (
              <>
                <Toolbar>
                  <Toolbar.Search placeholder="Search by name" />
                  <Toolbar.Actions>
                    <Toolbar.Zip
                      onZip={(fileIds) => openShareZip({ apiBaseUrl, token, fileIds })}
                    />
                  </Toolbar.Actions>
                </Toolbar>
                <List empty={<ShareViewerFilesEmpty />} />
                <ImageView />
              </>
            )}
          </FileTable>
        </Dropzone>
      </Stack>
    </Container>
  );
}

function ShareViewerFilesEmpty() {
  const table = useTableContext();
  const hasFiles = table.getCoreRowModel().rows.length > 0;

  return (
    <Text>{hasFiles ? 'No files match that name.' : 'No files are available in this space.'}</Text>
  );
}
