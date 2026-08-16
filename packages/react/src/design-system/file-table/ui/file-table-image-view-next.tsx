import { CaretRightIcon } from '@phosphor-icons/react/CaretRight';

import { ICON_SIZE } from '../../util/icon-size';
import { FileTableImageViewControl } from './file-table-image-view-control';
import { useImageViewContext } from './image-view-context';

export function FileTableImageViewNext() {
  const { canNavigate, goNext } = useImageViewContext();

  if (!canNavigate) {
    return null;
  }

  return (
    <FileTableImageViewControl placement="next" onClick={goNext} aria-label="Next image">
      <CaretRightIcon size={ICON_SIZE.lg} />
    </FileTableImageViewControl>
  );
}
