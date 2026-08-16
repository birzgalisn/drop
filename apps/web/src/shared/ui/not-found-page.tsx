import { Background, NotFound } from '@repo/react/design-system';

import { DocumentTitle } from './document-title';

/** Dedicated / unmatched 404 surface. */
export function NotFoundPage() {
  return (
    <>
      <DocumentTitle page="Not found" />
      <Background />
      <NotFound />
    </>
  );
}
