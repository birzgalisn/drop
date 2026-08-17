import type {
  RemoveSpaceFilesMutation,
  RemoveSpaceFilesMutationVariables,
} from '../data-access/remove-space-files.generated';
import type { SpaceFileFieldsFragment } from '../data-access/space-fields.generated';
import { useSpaceUploadStore } from './upload-space-files-tus';

type Mutate<TData, TVariables> = (options: {
  variables: TVariables;
}) => Promise<{ data?: TData | null }>;

/**
 * Files the server never heard about (staged, or an in-flight upload of a space
 * that does not exist yet) are dropped locally; the rest go through the API and
 * are only cleared from the store once it confirms.
 */
export async function removeSpaceFiles(options: {
  fileIds: string[];
  spaceId?: string;
  serverFiles: SpaceFileFieldsFragment[];
  removeSpaceFiles: Mutate<RemoveSpaceFilesMutation, RemoveSpaceFilesMutationVariables>;
}): Promise<void> {
  const { fileIds, spaceId, serverFiles, removeSpaceFiles: removeSpaceFilesMutation } = options;
  const store = useSpaceUploadStore.getState();
  const uniqueIds = [...new Set(fileIds)];
  const serverIds: string[] = [];

  for (const fileId of uniqueIds) {
    if (spaceId && serverFiles.some((file) => file.id === fileId)) {
      serverIds.push(fileId);
    } else {
      store.remove(fileId);
    }
  }

  if (serverIds.length === 0 || !spaceId) {
    return;
  }

  await removeSpaceFilesMutation({ variables: { spaceId, fileIds: serverIds } });

  for (const fileId of serverIds) {
    useSpaceUploadStore.getState().remove(fileId);
  }
}
