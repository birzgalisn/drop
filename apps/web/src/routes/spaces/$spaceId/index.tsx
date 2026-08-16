import { FileTable } from '@repo/react/design-system';
import { SpaceManage } from '@repo/react/spaces/manage';
import { createFileRoute, Navigate } from '@tanstack/react-router';

import { useSharePin } from '../../../shared/hooks/use-share-pin';
import {
  spaceImageSearchSchema,
  useSpaceImageSearch,
} from '../../../shared/hooks/use-space-image-search';
import { useSpaceNavigation } from '../../../shared/hooks/use-space-navigation';
import { getApiBaseUrl } from '../../../shared/util/get-api-base-url';
import { routeHead } from '../../../shared/util/route-head';

export const Route = createFileRoute('/spaces/$spaceId/')({
  validateSearch: spaceImageSearchSchema,
  head: () => routeHead('Space'),
  component: SpaceManagePage,
});

function SpaceManagePage() {
  const { spaceId } = Route.useParams();
  const { activeImageId, onActiveImageIdChange } = useSpaceImageSearch({ from: Route.fullPath });
  const { pin, clear } = useSharePin({ spaceId });
  const { goHome } = useSpaceNavigation();
  const apiBaseUrl = getApiBaseUrl();

  const handleHome = () => {
    clear();
    goHome();
  };

  const draftFallback = <Navigate to="/spaces/$spaceId/upload" params={{ spaceId }} replace />;

  return (
    <FileTable.ImageView.Search activeId={activeImageId} onActiveIdChange={onActiveImageIdChange}>
      <SpaceManage
        spaceId={spaceId}
        apiBaseUrl={apiBaseUrl}
        pin={pin}
        onHome={handleHome}
        draftFallback={draftFallback}
      />
    </FileTable.ImageView.Search>
  );
}
