import { useState } from 'react';

import type { MergedSpaceFileItem } from '../../util/get-merged-space-files-with-uploads';

export interface UseUploadCardPreviewSrcOptions {
  item: MergedSpaceFileItem;
  isReady: boolean;
  spaceId?: string;
  apiBaseUrl: string;
}

export interface UseUploadCardPreviewSrcResult {
  lowSrc: string | null;
  highSrc: string | null;
  onLowError: () => void;
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
    ? `${apiBaseUrl}/spaces/${spaceId}/files/${item.fileId}?variant=thumb`
    : null;
  const previewUrl = item.upload?.previewUrl;
  const serverThumb = item.thumbKey ? thumbUrl : null;
  const blobFailed = previewUrl != null && failedPreviewUrl === previewUrl;
  const blobPreview = previewUrl && !blobFailed ? previewUrl : null;
  const readyFallback = !serverThumb && !blobPreview && isReady ? thumbUrl : null;

  const lowLayer = blobPreview ?? readyFallback;

  return {
    lowSrc: lowLayer ?? serverThumb,
    highSrc: serverThumb && lowLayer && serverThumb !== lowLayer ? serverThumb : null,
    onLowError: () => {
      if (previewUrl && lowLayer === previewUrl) {
        setFailedPreviewUrl(previewUrl);
      }
    },
  };
}
