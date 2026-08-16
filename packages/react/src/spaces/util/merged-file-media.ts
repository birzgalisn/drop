import type { MergedSpaceFileItem } from './get-merged-space-files-with-uploads';
import { spaceFileMediaUrl } from './space-file-media-url';

export function mergedFileIsReady(item: MergedSpaceFileItem): boolean {
  return item.serverStatus === 'READY' || item.upload?.status === 'success';
}

export function mergedFileStatusLabel(item: MergedSpaceFileItem): string {
  const upload = item.upload;

  if (upload?.status === 'error') {
    return 'Failed';
  }

  if (mergedFileIsReady(item)) {
    return 'Ready';
  }

  if (upload && upload.bytesTotal > 0) {
    return `${Math.round((upload.bytesUploaded / upload.bytesTotal) * 100)}%`;
  }

  return item.serverStatus ?? 'Pending';
}

export function mergedFileThumbSrc({
  item,
  spaceId,
  apiBaseUrl,
}: {
  item: MergedSpaceFileItem;
  spaceId: string;
  apiBaseUrl: string;
}): string | null {
  const thumbUrl = spaceFileMediaUrl({
    apiBaseUrl,
    scope: 'spaces',
    scopeId: spaceId,
    fileId: item.id,
    variant: 'thumb',
  });

  if (item.thumbKey) {
    return thumbUrl;
  }

  if (item.upload?.previewUrl) {
    return item.upload.previewUrl;
  }

  return mergedFileIsReady(item) ? thumbUrl : null;
}

export function attachMergedFileMedia({
  items,
  spaceId,
  apiBaseUrl,
}: {
  items: MergedSpaceFileItem[];
  spaceId?: string;
  apiBaseUrl: string;
}): MergedSpaceFileItem[] {
  return items.map((item) => ({
    ...item,
    statusLabel: mergedFileStatusLabel(item),
    thumbSrc: spaceId ? mergedFileThumbSrc({ item, spaceId, apiBaseUrl }) : null,
  }));
}

export function mergedFileViewSrc({
  item,
  spaceId,
  apiBaseUrl,
}: {
  item: MergedSpaceFileItem;
  spaceId: string;
  apiBaseUrl: string;
}): string | null {
  if (item.thumbKey) {
    return spaceFileMediaUrl({
      apiBaseUrl,
      scope: 'spaces',
      scopeId: spaceId,
      fileId: item.id,
      variant: 'preview',
    });
  }

  if (mergedFileIsReady(item)) {
    return spaceFileMediaUrl({
      apiBaseUrl,
      scope: 'spaces',
      scopeId: spaceId,
      fileId: item.id,
    });
  }

  return null;
}
