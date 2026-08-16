import { createContext, useContext } from 'react';

import type { UseImageViewResult } from '../util/types';

export type ImageViewActions = Pick<UseImageViewResult, 'open' | 'isViewable'>;

export const ImageViewActionsContext = createContext<ImageViewActions | null>(null);

export function useImageViewActions() {
  const ctx = useContext(ImageViewActionsContext);
  if (!ctx) {
    throw new Error('`FileTable.Row` must be rendered inside `FileTable`');
  }
  return ctx;
}
