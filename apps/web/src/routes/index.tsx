import { SpaceWizard } from '@repo/react/spaces';
import { createFileRoute } from '@tanstack/react-router';

import { useSpaceNavigation } from '../shared/hooks/use-space-navigation';
import { getApiBaseUrl } from '../shared/util/get-api-base-url';
import { SPACE_SAMPLES } from '../shared/util/load-sample-space-files';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { goHome, goToWizardStep, goToManage } = useSpaceNavigation();

  return (
    <SpaceWizard
      step="upload"
      apiBaseUrl={getApiBaseUrl()}
      samples={SPACE_SAMPLES}
      onHome={goHome}
      onNavigate={goToWizardStep}
      onSpaceCreated={(spaceId) => goToWizardStep({ step: 'upload', spaceId })}
      onShared={goToManage}
    />
  );
}
