import { createFileRoute } from '@tanstack/react-router';

import { NotFoundPage } from '../shared/ui/not-found-page';
import { routeHead } from '../shared/util/route-head';

export const Route = createFileRoute('/404')({
  head: () => routeHead('Not found'),
  component: NotFoundPage,
});
