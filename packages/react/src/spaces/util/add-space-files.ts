import type {
  AddSpaceFilesMutation,
  AddSpaceFilesMutationVariables,
} from '../data-access/add-space-files.generated';
import type {
  ReorderSpaceFilesMutation,
  ReorderSpaceFilesMutationVariables,
} from '../data-access/reorder-space-files.generated';
import type { SpaceFileFieldsFragment } from '../data-access/space-fields.generated';
import {
  getMergedSpaceFilesWithUploads,
  getNextAppendSortOrder,
} from './get-merged-space-files-with-uploads';
import { applySortOrderToUploads, getSortOrderDrift } from './reconcile-sort-order';
import { useSpaceUploadStore, type SpaceUploadItem } from './upload-space-files-tus';

type Mutate<TData, TVariables> = (options: {
  variables: TVariables;
}) => Promise<{ data?: TData | null }>;

export interface AddSpaceFilesOptions {
  /** Already validated by `validateSpaceFiles`. */
  files: File[];
  spaceId?: string;
  apiBaseUrl: string;
  serverFiles: SpaceFileFieldsFragment[];
  uploads: SpaceUploadItem[];
  addSpaceFiles: Mutate<AddSpaceFilesMutation, AddSpaceFilesMutationVariables>;
  reorderSpaceFiles: Mutate<ReorderSpaceFilesMutation, ReorderSpaceFilesMutationVariables>;
}

/**
 * Stage local previews, register the files with the API, then hand the returned
 * ids to tus. Staged rows are discarded if the mutation fails, so a rejected
 * batch never leaves phantom cards behind.
 *
 * Returns the space id (created on the first add of a new space).
 */
export async function addSpaceFiles(options: AddSpaceFilesOptions): Promise<string> {
  const {
    files,
    spaceId,
    apiBaseUrl,
    serverFiles,
    uploads,
    addSpaceFiles: addSpaceFilesMutation,
    reorderSpaceFiles,
  } = options;
  const store = useSpaceUploadStore.getState();

  const merged = getMergedSpaceFilesWithUploads({ files: serverFiles, uploads });
  let nextSortOrder = getNextAppendSortOrder(merged);

  const stagedIds = files.map((file) => {
    const localId = store.stage({
      file,
      spaceId: spaceId ?? 'pending',
      sortOrder: nextSortOrder,
    });

    nextSortOrder += 1;

    return localId;
  });

  const discardStaged = () => {
    for (const localId of stagedIds) {
      useSpaceUploadStore.getState().discard(localId);
    }
  };

  try {
    const { data } = await addSpaceFilesMutation({
      variables: {
        input: {
          spaceId,
          files: files.map((file) => ({
            originalName: file.name,
            mimeType: file.type,
            byteSize: file.size,
          })),
        },
      },
    });
    const result = data?.addSpaceFiles;

    if (!result) {
      discardStaged();
      throw new Error('Unable to add files');
    }

    const nextSpaceId = result.space.id;

    result.files.forEach((serverFile, index) => {
      const localId = stagedIds[index];

      if (localId) {
        useSpaceUploadStore.getState().commit({
          localId,
          fileId: serverFile.id,
          spaceId: nextSpaceId,
          mimeType: serverFile.mimeType,
          apiBaseUrl,
        });
      }
    });

    // The API returned fewer rows than we staged — drop the leftovers.
    for (const localId of stagedIds.slice(result.files.length)) {
      useSpaceUploadStore.getState().discard(localId);
    }

    await persistSortOrder({
      spaceId: nextSpaceId,
      serverFiles: result.space.files ?? [],
      reorderSpaceFiles,
    });

    return nextSpaceId;
  } catch (error) {
    discardStaged();
    throw error;
  }
}

async function persistSortOrder(options: {
  spaceId: string;
  serverFiles: SpaceFileFieldsFragment[];
  reorderSpaceFiles: Mutate<ReorderSpaceFilesMutation, ReorderSpaceFilesMutationVariables>;
}): Promise<void> {
  const { spaceId, serverFiles, reorderSpaceFiles } = options;
  const uploads = useSpaceUploadStore
    .getState()
    .uploads.filter((upload) => upload.spaceId === spaceId || upload.spaceId === 'pending');
  const entries = getSortOrderDrift({ serverFiles, uploads });

  if (!entries) {
    return;
  }

  await reorderSpaceFiles({ variables: { input: { spaceId, files: entries } } });
  applySortOrderToUploads({ serverFiles, uploads });
}
