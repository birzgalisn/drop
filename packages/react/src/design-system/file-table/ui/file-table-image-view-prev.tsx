import { CaretLeftIcon } from '@phosphor-icons/react/CaretLeft';

import { ICON_SIZE } from '../../util/icon-size';
import { FileTableImageViewControl } from './file-table-image-view-control';
import { useImageViewContext } from './image-view-context';

export function FileTableImageViewPrev() {
  const { canNavigate, goPrev } = useImageViewContext();

  if (!canNavigate) {
    return null;
  }

  return (
    <FileTableImageViewControl placement="prev" onClick={goPrev} aria-label="Previous image">
      <CaretLeftIcon size={ICON_SIZE.lg} />
    </FileTableImageViewControl>
  );
}
