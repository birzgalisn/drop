import { Outlet, createRootRoute } from '@tanstack/react-router';

import { NotFoundPage } from '../shared/ui/not-found-page';

export const Route = createRootRoute({
  component: RootPage,
  notFoundComponent: NotFoundPage,
});

function RootPage() {
  return <Outlet />;
}
