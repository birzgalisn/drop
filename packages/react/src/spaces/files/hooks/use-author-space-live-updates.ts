import { useSubscription } from '@apollo/client/react';

import { SpaceUpdatedDocument } from '../data-access/space-updated.generated';
import { SpaceDocument } from '../data-access/space.generated';

/**
 * Keeps the author Space query in sync when files change (add/remove/ready/thumbs).
 */
export function useAuthorSpaceLiveUpdates(spaceId: string | undefined): void {
  useSubscription(SpaceUpdatedDocument, {
    ...(spaceId
      ? {
          variables: { spaceId },
          onData: ({ client, data }) => {
            const space = data.data?.spaceUpdated;

            if (!space) {
              return;
            }

            const existing = client.readQuery({
              query: SpaceDocument,
              variables: { id: spaceId },
            });

            client.writeQuery({
              query: SpaceDocument,
              variables: { id: spaceId },
              data: {
                space: {
                  ...space,
                  // Subscription payloads default isAuthor=false; keep the query value.
                  isAuthor: existing?.space?.isAuthor ?? space.isAuthor,
                },
              },
            });
          },
        }
      : {
          variables: { spaceId: '' },
          skip: true,
        }),
  });
}
