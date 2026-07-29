import { ShareViewer } from '@repo/react/spaces/share-viewer';
import { createFileRoute } from '@tanstack/react-router';

import {
  spaceImageSearchSchema,
  useSpaceImageSearch,
} from '../../shared/hooks/use-space-image-search';
import { useSpaceNavigation } from '../../shared/hooks/use-space-navigation';
import { getApiBaseUrl } from '../../shared/util/get-api-base-url';

export const Route = createFileRoute('/s/$token')({
  validateSearch: spaceImageSearchSchema,
  component: SharePage,
});

function SharePage() {
  const { token } = Route.useParams();
  const { activeImageId, onActiveImageIdChange } = useSpaceImageSearch({ from: Route.fullPath });
  const { goHome, goToManage } = useSpaceNavigation();

  return (
    <ShareViewer
      token={token}
      apiBaseUrl={getApiBaseUrl()}
      activeImageId={activeImageId}
      onActiveImageIdChange={onActiveImageIdChange}
      onHome={goHome}
      onManage={goToManage}
    />
  );
}
