import { useNavigate, useSearch } from '@tanstack/react-router';
import { z } from 'zod';

import { Route as ShareRoute } from '../../routes/s/$token';
import { Route as SpaceManageRoute } from '../../routes/spaces/$spaceId/index';

/** Shared `?image=` search shape for manage / share viewer routes. */
export const spaceImageSearchSchema = z.object({
  image: z.uuid().optional(),
});

/** Routes that own `?image=` via {@link spaceImageSearchSchema}. */
type SpaceImageSearchFrom = typeof ShareRoute.fullPath | typeof SpaceManageRoute.fullPath;

/**
 * URL-owned lightbox id (`?image=`). Keeps explorer open state in the address bar
 * across manage and share surfaces.
 */
export function useSpaceImageSearch<From extends SpaceImageSearchFrom>(options: { from: From }) {
  const { from } = options;

  const navigate = useNavigate();

  const { image } = useSearch({ from });

  const onActiveImageIdChange = (fileId: string | null) => {
    void navigate({
      to: '.',
      search: fileId ? { image: fileId } : {},
      replace: true,
      resetScroll: false,
    });
  };

  return {
    activeImageId: image ?? null,
    onActiveImageIdChange,
  };
}
