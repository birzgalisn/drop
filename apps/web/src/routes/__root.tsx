import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router';

import { InternalErrorPage } from '../shared/ui/internal-error-page';
import { NotFoundPage } from '../shared/ui/not-found-page';

export const Route = createRootRoute({
  component: RootPage,
  notFoundComponent: NotFoundPage,
  errorComponent: InternalErrorPage,
  head: () => ({
    meta: [{ title: 'Drop' }],
  }),
});

function RootPage() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
