import { useState } from 'react';

import type { MergedSpaceFileItem } from '../../util/get-merged-space-files-with-uploads';
import { spaceFileMediaUrl } from '../../util/space-file-media-url';

export interface UseUploadCardPreviewSrcOptions {
  item: MergedSpaceFileItem;
  isReady: boolean;
  spaceId?: string;
  apiBaseUrl: string;
}

export interface UseUploadCardPreviewSrcResult {
  src: string | null;
  preview: string | null;
  onPreviewError: () => void;
}

/**
 * Picks the preview layers for one card: the local blob while uploading, the
 * server thumbnail once it exists, and a crossfade between them.
 */
export function useUploadCardPreviewSrc(
  options: UseUploadCardPreviewSrcOptions,
): UseUploadCardPreviewSrcResult {
  const { item, isReady, spaceId, apiBaseUrl } = options;
  const [failedPreviewUrl, setFailedPreviewUrl] = useState<string | null>(null);

  const thumbUrl = spaceId
    ? spaceFileMediaUrl({
        apiBaseUrl,
        scope: 'spaces',
        scopeId: spaceId,
        fileId: item.fileId,
        variant: 'thumb',
      })
    : null;
  const previewUrl = item.upload?.previewUrl;
  const serverThumb = item.thumbKey ? thumbUrl : null;
  const blobFailed = previewUrl != null && failedPreviewUrl === previewUrl;
  const blobPreview = previewUrl && !blobFailed ? previewUrl : null;
  const readyFallback = !serverThumb && !blobPreview && isReady ? thumbUrl : null;

  const preview = blobPreview ?? readyFallback;
  const src = serverThumb ?? preview;

  return {
    src,
    preview: preview && src && preview !== src ? preview : null,
    onPreviewError: () => {
      if (previewUrl && preview === previewUrl) {
        setFailedPreviewUrl(previewUrl);
      }
    },
  };
}
