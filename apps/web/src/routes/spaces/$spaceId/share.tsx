import { SpaceWizard } from '@repo/react/spaces';
import { createFileRoute } from '@tanstack/react-router';

import { useSpaceNavigation } from '../../../shared/hooks/use-space-navigation';
import { getApiBaseUrl } from '../../../shared/util/get-api-base-url';
import { routeHead } from '../../../shared/util/route-head';

export const Route = createFileRoute('/spaces/$spaceId/share')({
  head: () => routeHead('Share'),
  component: SpaceSharePage,
});

function SpaceSharePage() {
  const { spaceId } = Route.useParams();
  const { goHome, goToWizardStep, goToManage } = useSpaceNavigation();

  return (
    <SpaceWizard
      step="share"
      spaceId={spaceId}
      apiBaseUrl={getApiBaseUrl()}
      onHome={goHome}
      onNavigate={goToWizardStep}
      onShared={goToManage}
    />
  );
}
