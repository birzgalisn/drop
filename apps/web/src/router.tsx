import { RouterProvider, createRouter } from '@tanstack/react-router';

import { routeTree } from './route-tree.generated';
import { InternalErrorPage } from './shared/ui/internal-error-page';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultErrorComponent: InternalErrorPage,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function Router() {
  return <RouterProvider router={router} />;
}
