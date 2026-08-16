import { FileTable } from '@repo/react/design-system';
import { ShareViewer } from '@repo/react/spaces/share-viewer';
import { createFileRoute } from '@tanstack/react-router';

import {
  spaceImageSearchSchema,
  useSpaceImageSearch,
} from '../../shared/hooks/use-space-image-search';
import { useSpaceNavigation } from '../../shared/hooks/use-space-navigation';
import { getApiBaseUrl } from '../../shared/util/get-api-base-url';
import { routeHead } from '../../shared/util/route-head';

export const Route = createFileRoute('/s/$token')({
  validateSearch: spaceImageSearchSchema,
  head: () => routeHead('Shared'),
  component: SharePage,
});

function SharePage() {
  const { token } = Route.useParams();
  const { activeImageId, onActiveImageIdChange } = useSpaceImageSearch({ from: Route.fullPath });
  const { goHome, goToManage } = useSpaceNavigation();

  return (
    <FileTable.ImageView.Search activeId={activeImageId} onActiveIdChange={onActiveImageIdChange}>
      <ShareViewer
        token={token}
        apiBaseUrl={getApiBaseUrl()}
        onHome={goHome}
        onManage={goToManage}
      />
    </FileTable.ImageView.Search>
  );
}
