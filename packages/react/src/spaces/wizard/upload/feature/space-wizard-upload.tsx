import { SpaceConfig } from '@repo/shared';

import { Dropzone } from '../../../../design-system/dropzone/feature/dropzone';
import { Stack } from '../../../../design-system/stack/feature/stack';
import { SPACE_DROPZONE_EMPTY } from '../../../files/constants/space-dropzone-empty';
import { usePruneReadyUploads } from '../../../files/hooks/use-prune-ready-uploads';
import type { MergedSpaceFileItem } from '../../../files/util/get-merged-space-files-with-uploads';
import type { SpaceWizardNavigate } from '../../util/space-wizard-steps';
import { UploadContinue } from '../ui/upload-continue';
import { UploadGrid } from '../ui/upload-grid';
import { UploadHeader } from '../ui/upload-header';
import { UploadSamples } from '../ui/upload-samples';
import type { UploadSamples as UploadSamplesConfig } from '../util/types';

export interface SpaceWizardUploadProps {
  items: MergedSpaceFileItem[];
  /** Used to build preview URLs; undefined before the space exists. */
  spaceId?: string;
  /** Target for Continue — may be known before the route URL catches up. */
  nextStepSpaceId?: string;
  apiBaseUrl: string;
  removing: boolean;
  samples?: UploadSamplesConfig;
  onAddFiles: (files: File[]) => Promise<void>;
  onRemoveFile: (fileId: string) => void;
  onNavigate: SpaceWizardNavigate;
}

/** Upload step: dropzone, preview grid, sample CTA, and the Continue button. */
export function SpaceWizardUpload({
  items,
  spaceId,
  nextStepSpaceId,
  apiBaseUrl,
  removing,
  samples,
  onAddFiles,
  onRemoveFile,
  onNavigate,
}: SpaceWizardUploadProps) {
  usePruneReadyUploads(items);

  const hasFiles = items.length > 0;

  return (
    <Stack gap="regular">
      <Stack gap="tight">
        <Dropzone
          hasFiles={hasFiles}
          onAddFiles={(files) => void onAddFiles(files)}
          maxSize={SpaceConfig.FILE_MAX_BYTES}
          empty={<Dropzone.Empty {...SPACE_DROPZONE_EMPTY} />}
        >
          <Stack gap="regular">
            <UploadHeader count={items.length} />
            <UploadGrid
              items={items}
              spaceId={spaceId}
              apiBaseUrl={apiBaseUrl}
              removing={removing}
              onRemove={onRemoveFile}
            />
          </Stack>
        </Dropzone>

        {samples && !hasFiles ? (
          <UploadSamples previews={samples.previews} load={samples.load} onAddFiles={onAddFiles} />
        ) : null}
      </Stack>

      <UploadContinue count={items.length} spaceId={nextStepSpaceId} onNavigate={onNavigate} />
    </Stack>
  );
}
