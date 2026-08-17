import { SimpleGrid } from '@mantine/core';

import type { MergedSpaceFileItem } from '../../../files/util/get-merged-space-files-with-uploads';
import { UploadCard } from './upload-card';

export interface UploadGridProps {
  items: MergedSpaceFileItem[];
  spaceId?: string;
  apiBaseUrl: string;
  removing: boolean;
  onRemove: (fileId: string) => void;
}

export function UploadGrid({ items, spaceId, apiBaseUrl, removing, onRemove }: UploadGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
      {items.map((item) => {
        const upload = item.upload;

        return (
          <UploadCard
            key={item.listKey}
            item={item}
            percent={
              upload && upload.bytesTotal > 0
                ? Math.round((upload.bytesUploaded / upload.bytesTotal) * 100)
                : undefined
            }
            isReady={item.serverStatus === 'READY' || upload?.status === 'success'}
            isError={upload?.status === 'error'}
            spaceId={spaceId}
            apiBaseUrl={apiBaseUrl}
            removing={removing}
            onRemove={onRemove}
          />
        );
      })}
    </SimpleGrid>
  );
}
