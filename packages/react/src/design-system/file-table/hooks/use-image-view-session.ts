import { Carousel } from '@repo/shared';

import type { ImageViewItem, UseImageViewResult } from '../util/types';

export function useImageViewSession({
  items,
  activeId,
  onActiveIdChange,
  getDownloadHref,
}: {
  items: readonly ImageViewItem[];
  activeId: string | null;
  onActiveIdChange: (id: string | null) => void;
  getDownloadHref?: (item: ImageViewItem) => string | null;
}): UseImageViewResult {
  const active = Carousel.item(items, activeId);
  const canNavigate = items.length > 1;

  const isViewable = (id: string) => Boolean(Carousel.item(items, id));

  const handleOpen = (id: string) => {
    if (Carousel.item(items, id)) {
      onActiveIdChange(id);
    }
  };

  const handleClose = () => {
    onActiveIdChange(null);
  };

  const handleGoPrev = () => {
    onActiveIdChange(Carousel.prev(items, active?.id));
  };

  const handleGoNext = () => {
    onActiveIdChange(Carousel.next(items, active?.id));
  };

  return {
    active,
    canNavigate,
    isViewable,
    open: handleOpen,
    close: handleClose,
    goPrev: handleGoPrev,
    goNext: handleGoNext,
    getDownloadHref,
  } as const;
}
