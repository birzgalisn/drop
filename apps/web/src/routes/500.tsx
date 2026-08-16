import { createFileRoute } from '@tanstack/react-router';

import { InternalErrorPage } from '../shared/ui/internal-error-page';
import { routeHead } from '../shared/util/route-head';

export const Route = createFileRoute('/500')({
  head: () => routeHead("Couldn't load"),
  component: InternalErrorPage,
});
