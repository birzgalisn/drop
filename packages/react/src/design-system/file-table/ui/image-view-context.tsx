import { createContext, useContext, type ReactNode } from 'react';

import type { TableRowBase } from '../../table/util/types';
import type { UseImageView, UseImageViewResult } from '../util/types';
import { ImageViewActionsContext } from './image-view-actions-context';

export type ImageViewSession = Omit<UseImageViewResult, 'open' | 'isViewable'>;

export const ImageViewContext = createContext<ImageViewSession | null>(null);

export function useImageViewContext() {
  const ctx = useContext(ImageViewContext);
  if (!ctx) {
    throw new Error('`useImageViewContext` must be used within `FileTable`');
  }
  return ctx;
}

export function FileTableImageViewProvider<T extends TableRowBase>({
  rows,
  useImageView,
  children,
}: {
  rows: T[];
  useImageView: UseImageView<T>;
  children: ReactNode;
}) {
  const { open, isViewable, active, canNavigate, close, goPrev, goNext, getDownloadHref } =
    useImageView({ rows });
  const actions = { open, isViewable };
  const session = { active, canNavigate, close, goPrev, goNext, getDownloadHref };

  return (
    <ImageViewActionsContext.Provider value={actions}>
      <ImageViewContext.Provider value={session}>{children}</ImageViewContext.Provider>
    </ImageViewActionsContext.Provider>
  );
}
