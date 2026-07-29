import { SpaceManage } from '@repo/react/spaces/manage';
import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useSharePin } from '../../../shared/hooks/use-share-pin';
import {
  spaceImageSearchSchema,
  useSpaceImageSearch,
} from '../../../shared/hooks/use-space-image-search';
import { useSpaceNavigation } from '../../../shared/hooks/use-space-navigation';
import { getApiBaseUrl } from '../../../shared/util/get-api-base-url';

export const Route = createFileRoute('/spaces/$spaceId/')({
  validateSearch: spaceImageSearchSchema,
  component: SpaceManagePage,
});

function SpaceManagePage() {
  const { spaceId } = Route.useParams();
  const { activeImageId, onActiveImageIdChange } = useSpaceImageSearch({ from: Route.fullPath });
  const { pin, clear } = useSharePin({ spaceId });
  const { goHome } = useSpaceNavigation();

  return (
    <SpaceManage
      spaceId={spaceId}
      apiBaseUrl={getApiBaseUrl()}
      pin={pin}
      activeImageId={activeImageId}
      onActiveImageIdChange={onActiveImageIdChange}
      onHome={() => {
        clear();
        goHome();
      }}
      draftFallback={<Navigate to="/spaces/$spaceId/upload" params={{ spaceId }} replace />}
    />
  );
}
