import type { SpaceFileFieldsFragment } from '../data-access/space-fields.generated';
import type { SpaceUploadItem } from './upload-space-files-tus';

export interface MergedSpaceFileItem {
  id: string;
  fileId: string;
  /** Stable list key — prefers upload.clientKey so stage→commit does not remount. */
  listKey: string;
  name: string;
  byteSize: number;
  sortOrder: number;
  createdAt?: unknown;
  serverStatus?: SpaceFileFieldsFragment['status'];
  /** Set once thumbnail variants exist on the server — prefer these over blob previews. */
  thumbKey?: string | null;
  previewKey?: string | null;
  upload?: SpaceUploadItem;
  selectable?: boolean;
  thumbSrc?: string | null;
  statusLabel?: string;
}

export interface GetMergedSpaceFilesWithUploadsOptions {
  files: SpaceFileFieldsFragment[];
  uploads: SpaceUploadItem[];
}

function isBridgeableStatus(status: SpaceFileFieldsFragment['status']): boolean {
  return status === 'PENDING' || status === 'UPLOADING' || status === 'PAUSED';
}

/**
 * Merge server files with in-flight / staged uploads. Staged previews use a
 * temporary id until addSpaceFiles returns; match those to new server rows by
 * name + size so the list does not flash duplicates.
 *
 * Name+size matching is only for true staged temps onto non-READY server rows.
 * Committed uploads (fileId already on the server) bind by id only — otherwise
 * re-uploading the same filenames steals older uploads onto READY rows and
 * appends the new staged temps as phantom cards.
 *
 * Prefer upload.sortOrder while an upload row exists so pending positions stick
 * until the server catches up.
 */
export function getMergedSpaceFilesWithUploads(
  options: GetMergedSpaceFilesWithUploadsOptions,
): MergedSpaceFileItem[] {
  const { files, uploads } = options;
  const serverFileIds = new Set(files.map((file) => file.id));
  const uploadsById = new Map(uploads.map((upload) => [upload.fileId, upload]));
  const usedUploadIds = new Set<string>();

  const takeUploadForFile = (file: SpaceFileFieldsFragment): SpaceUploadItem | undefined => {
    const byId = uploadsById.get(file.id);

    if (byId && !usedUploadIds.has(byId.fileId)) {
      usedUploadIds.add(byId.fileId);
      return byId;
    }

    // Bridge staged temps → new PENDING/UPLOADING rows before commit remaps ids.
    // Never name-match onto READY (or FAILED): that steals prior-batch uploads
    // when the user re-adds the same filenames.
    if (!isBridgeableStatus(file.status)) {
      return undefined;
    }

    const staged = uploads.find(
      (upload) =>
        !serverFileIds.has(upload.fileId) &&
        !usedUploadIds.has(upload.fileId) &&
        upload.name === file.name &&
        upload.bytesTotal === file.byteSize,
    );

    if (staged) {
      usedUploadIds.add(staged.fileId);
      return staged;
    }

    return undefined;
  };

  const merged: MergedSpaceFileItem[] = files
    .filter((file) => file.status !== 'REMOVED')
    .map((file) => {
      const upload = takeUploadForFile(file);

      const ready = file.status === 'READY' || upload?.status === 'success';

      return {
        id: file.id,
        fileId: file.id,
        listKey: upload?.clientKey ?? file.id,
        name: file.name,
        byteSize: file.byteSize,
        sortOrder: upload?.sortOrder ?? file.sortOrder,
        createdAt: file.createdAt,
        serverStatus: file.status,
        thumbKey: file.thumbKey,
        previewKey: file.previewKey,
        upload,
        selectable: ready,
      };
    });

  for (const upload of uploads) {
    if (usedUploadIds.has(upload.fileId)) {
      continue;
    }

    merged.push({
      id: upload.fileId,
      fileId: upload.fileId,
      listKey: upload.clientKey,
      name: upload.name,
      byteSize: upload.bytesTotal,
      sortOrder: upload.sortOrder,
      upload,
      selectable: upload.status === 'success',
    });
  }

  merged.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

  return merged;
}

export function getNextAppendSortOrder(items: ReadonlyArray<{ sortOrder: number }>): number {
  if (items.length === 0) {
    return 0;
  }

  return items.reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1;
}
