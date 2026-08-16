import { useState } from 'react';

import type { TableRowBase, UseImageViewResult } from '../util/types';
import { useImageViewSession } from './use-image-view-session';

export function useDefaultImageView<T extends TableRowBase>(_options: {
  rows: T[];
}): UseImageViewResult {
  const [activeId, setActiveId] = useState<string | null>(null);

  return useImageViewSession({
    items: [],
    activeId,
    onActiveIdChange: setActiveId,
  });
}
