import { SpaceWizard } from '@repo/react/spaces';
import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useSpaceNavigation } from '../../../shared/hooks/use-space-navigation';
import { getApiBaseUrl } from '../../../shared/util/get-api-base-url';
import { SPACE_SAMPLES } from '../../../shared/util/load-sample-space-files';
import { routeHead } from '../../../shared/util/route-head';

export const Route = createFileRoute('/spaces/$spaceId/upload')({
  head: () => routeHead('Upload'),
  component: SpaceUploadPage,
});

function SpaceUploadPage() {
  const { spaceId } = Route.useParams();
  const { goHome, goToWizardStep, goToManage } = useSpaceNavigation();

  return (
    <SpaceWizard
      step="upload"
      spaceId={spaceId}
      apiBaseUrl={getApiBaseUrl()}
      samples={SPACE_SAMPLES}
      onHome={goHome}
      onNavigate={goToWizardStep}
      onShared={goToManage}
      alreadySharedFallback={<Navigate to="/spaces/$spaceId" params={{ spaceId }} replace />}
    />
  );
}
