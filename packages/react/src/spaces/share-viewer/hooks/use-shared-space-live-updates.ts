import { useSubscription } from '@apollo/client/react';

import { SpaceFileStatus } from '../../../_generated/graphql-types';
import { SpaceUpdatedDocument } from '../../files/data-access/space-updated.generated';
import { SharedSpaceDocument } from '../data-access/shared-space.generated';

/**
 * Keeps the recipient SharedSpace query in sync. Filters to READY files and
 * clears author-only share details from the cache write.
 */
export function useSharedSpaceLiveUpdates(options: {
  token: string;
  spaceId: string | undefined;
}): void {
  const { token, spaceId } = options;

  useSubscription(SpaceUpdatedDocument, {
    ...(spaceId
      ? {
          variables: { spaceId },
        }
      : {
          variables: { spaceId: '' },
          skip: true,
        }),
    onData: ({ client, data }) => {
      const space = data.data?.spaceUpdated;

      if (!space) {
        return;
      }

      const existing = client.readQuery({
        query: SharedSpaceDocument,
        variables: { token },
      });

      client.writeQuery({
        query: SharedSpaceDocument,
        variables: { token },
        data: {
          sharedSpace: {
            ...space,
            share: null,
            isAuthor: existing?.sharedSpace?.isAuthor ?? space.isAuthor,
            files: (space.files ?? []).filter((f) => f.status === SpaceFileStatus.Ready),
          },
        },
      });
    },
  });
}
