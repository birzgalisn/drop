import type { ReactNode } from 'react';

import { Background } from '../../design-system/background/feature/background';
import { Container } from '../../design-system/container/feature/container';
import { Stack } from '../../design-system/stack/feature/stack';
import { Text } from '../../design-system/text/feature/text';
import { DropLogo } from '../../logo/feature/drop-logo';
import { useSpaceFiles } from '../hooks/use-space-files';
import { useAuthorSpaceLiveUpdates } from '../hooks/use-space-live-updates';
import { SpaceWizardShare } from '../ui/space-wizard-share';
import { SpaceWizardStepper } from '../ui/space-wizard-stepper';
import { useUploadToast } from '../upload-notifications/hooks/use-upload-toast';
import type { SpaceWizardNavigate, SpaceWizardStep } from '../util/space-wizard-steps';
import { SpaceWizardUpload } from '../wizard-upload/feature/space-wizard-upload';
import type { UploadSamples } from '../wizard-upload/types';

export interface SpaceWizardProps {
  step: SpaceWizardStep;
  /** Absent on the landing route until the first upload creates the space. */
  spaceId?: string;
  apiBaseUrl: string;
  /** Optional demo files offered under the dropzone while empty. */
  samples?: UploadSamples;
  /**
   * Rendered instead of the wizard when the space is already shared — the app
   * passes a router `<Navigate />` to the manage surface.
   */
  alreadySharedFallback?: ReactNode;
  onHome: () => void;
  onNavigate: SpaceWizardNavigate;
  /** After the first upload creates a space — typically sync the URL. */
  onSpaceCreated?: (spaceId: string) => void;
  onShared: (payload: { spaceId: string; token: string; pin: string }) => void;
}

/** Two-step author flow: upload files, then create the share link. */
export function SpaceWizard({
  step,
  spaceId,
  apiBaseUrl,
  samples,
  alreadySharedFallback,
  onHome,
  onNavigate,
  onSpaceCreated,
  onShared,
}: SpaceWizardProps) {
  const { space, items, uploads, removing, addFiles, removeFile } = useSpaceFiles({
    spaceId,
    apiBaseUrl,
    includePendingUploads: true,
    onSpaceCreated,
  });

  useAuthorSpaceLiveUpdates(spaceId);
  useUploadToast({ uploads, spaceId, onCancelUpload: (fileId) => void removeFile(fileId) });

  if (step === 'upload' && spaceId && space?.status === 'SHARED' && alreadySharedFallback) {
    return alreadySharedFallback;
  }

  return (
    <>
      <Background />
      <Container size="sm" py={64}>
        <Stack gap="loose">
          <Stack gap="tight" align="center" ta="center">
            <DropLogo onHome={onHome} />
            <Stack maw={360} ta="center">
              <Text>Share images with a private, PIN-protected link.</Text>
            </Stack>
          </Stack>

          <SpaceWizardStepper
            step={step}
            spaceId={spaceId}
            hasFiles={items.length > 0}
            onNavigate={onNavigate}
          />

          {step === 'upload' ? (
            <SpaceWizardUpload
              items={items}
              spaceId={spaceId}
              // The URL lags one render behind the space that the first add creates.
              nextStepSpaceId={spaceId ?? uploads[0]?.spaceId}
              apiBaseUrl={apiBaseUrl.replace(/\/$/, '')}
              removing={removing}
              samples={samples}
              onAddFiles={addFiles}
              onRemoveFile={(fileId) => void removeFile(fileId)}
              onNavigate={onNavigate}
            />
          ) : (
            <SpaceWizardShare spaceId={spaceId} onShared={onShared} />
          )}
        </Stack>
      </Container>
    </>
  );
}

export { clearSpaceUploads } from '../util/clear-space-uploads';
export type { SpaceWizardNavigate, SpaceWizardStep } from '../util/space-wizard-steps';
export type { UploadSamples, UploadSamplesPreview } from '../wizard-upload/types';
