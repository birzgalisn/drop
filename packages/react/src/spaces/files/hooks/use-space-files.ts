import { useMutation, useQuery } from '@apollo/client/react';
import { notifications } from '@mantine/notifications';

import { GraphqlErrors } from '../../../common/util/graphql-errors.util';
import { AddSpaceFilesDocument } from '../data-access/add-space-files.generated';
import { RemoveSpaceFilesDocument } from '../data-access/remove-space-files.generated';
import { ReorderSpaceFilesDocument } from '../data-access/reorder-space-files.generated';
import type { SpaceFieldsFragment } from '../data-access/space-fields.generated';
import { SpaceDocument } from '../data-access/space.generated';
import { addSpaceFiles } from '../util/add-space-files';
import {
  getMergedSpaceFilesWithUploads,
  type MergedSpaceFileItem,
} from '../util/get-merged-space-files-with-uploads';
import { attachMergedFileMedia } from '../util/merged-file-media';
import { removeSpaceFiles } from '../util/remove-space-files';
import { useSpaceUploadStore, type SpaceUploadItem } from '../util/upload-space-files-tus';
import { validateSpaceFiles } from '../util/validate-space-files';

export interface UseSpaceFilesOptions {
  spaceId?: string;
  apiBaseUrl: string;
  /** Include `pending` tus rows — the wizard shows previews before a space exists. */
  includePendingUploads?: boolean;
  /** Called after the first add creates a space, so the route can sync the URL. */
  onSpaceCreated?: (spaceId: string) => void;
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'no-cache' | 'cache-only';
}

export interface UseSpaceFilesResult {
  space: SpaceFieldsFragment | null;
  /** Server rows merged with in-flight uploads — what every file surface renders. */
  items: MergedSpaceFileItem[];
  uploads: SpaceUploadItem[];
  loading: boolean;
  error?: Error;
  removing: boolean;
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (fileId: string) => Promise<void>;
  removeFiles: (fileIds: string[]) => Promise<void>;
}

const EMPTY_UPLOADS: SpaceUploadItem[] = [];
const EMPTY_FILES: NonNullable<SpaceFieldsFragment['files']> = [];

/** Files of one space plus the upload actions that mutate them. */
export function useSpaceFiles(options: UseSpaceFilesOptions): UseSpaceFilesResult {
  const {
    spaceId,
    apiBaseUrl,
    includePendingUploads = false,
    onSpaceCreated,
    fetchPolicy,
  } = options;

  const [addSpaceFilesMutation] = useMutation(AddSpaceFilesDocument);
  const [removeSpaceFilesMutation, { loading: removing }] = useMutation(RemoveSpaceFilesDocument);
  const [reorderSpaceFilesMutation] = useMutation(ReorderSpaceFilesDocument);

  const { data, loading, error } = useQuery(SpaceDocument, {
    variables: { id: spaceId ?? '' },
    skip: !spaceId,
    ...(fetchPolicy ? { fetchPolicy } : {}),
  });

  const space = data?.space ?? null;
  const serverFiles = space?.files ?? EMPTY_FILES;
  const allUploads = useSpaceUploadStore((state) => state.uploads);

  const uploads = getSpaceUploads({ allUploads, spaceId, includePendingUploads });
  const merged = getMergedSpaceFilesWithUploads({ files: serverFiles, uploads });
  const items = attachMergedFileMedia({ items: merged, spaceId, apiBaseUrl });

  const handleAddFiles = async (incoming: File[]) => {
    const { accepted, errors } = validateSpaceFiles({ incoming, existingFiles: serverFiles });

    for (const message of errors) {
      notifications.show({ color: 'red', message });
    }

    if (accepted.length === 0) {
      return;
    }

    try {
      const nextSpaceId = await addSpaceFiles({
        files: accepted,
        spaceId,
        apiBaseUrl,
        serverFiles,
        uploads,
        addSpaceFiles: addSpaceFilesMutation,
        reorderSpaceFiles: reorderSpaceFilesMutation,
      });

      if (!spaceId) {
        onSpaceCreated?.(nextSpaceId);
      }
    } catch (addError) {
      notifications.show({ color: 'red', message: GraphqlErrors.message(addError) });
    }
  };

  const handleRemoveFiles = async (fileIds: string[]) => {
    try {
      await removeSpaceFiles({
        fileIds,
        spaceId,
        serverFiles,
        removeSpaceFiles: removeSpaceFilesMutation,
      });
    } catch (removeError) {
      notifications.show({ color: 'red', message: GraphqlErrors.message(removeError) });
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    await handleRemoveFiles([fileId]);
  };

  return {
    space,
    items,
    uploads,
    loading,
    error: error ?? undefined,
    removing,
    addFiles: handleAddFiles,
    removeFile: handleRemoveFile,
    removeFiles: handleRemoveFiles,
  };
}

function getSpaceUploads({
  allUploads,
  spaceId,
  includePendingUploads,
}: {
  allUploads: SpaceUploadItem[];
  spaceId?: string;
  includePendingUploads: boolean;
}) {
  if (!spaceId) {
    return includePendingUploads ? allUploads : EMPTY_UPLOADS;
  }

  const next = allUploads.filter((upload) =>
    includePendingUploads
      ? upload.spaceId === spaceId || upload.spaceId === 'pending'
      : upload.spaceId === spaceId,
  );

  return next.length === 0 ? EMPTY_UPLOADS : next;
}
