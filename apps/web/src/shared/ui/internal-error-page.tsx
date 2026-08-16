import { Background, InternalError } from '@repo/react/design-system';

import { DocumentTitle } from './document-title';

/** Router default / unmatched exception surface. */
export function InternalErrorPage() {
  return (
    <>
      <DocumentTitle page="Couldn't load" />
      <Background />
      <InternalError />
    </>
  );
}
