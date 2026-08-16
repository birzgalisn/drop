import { XIcon } from '@phosphor-icons/react/X';

import { ICON_SIZE } from '../../util/icon-size';
import { FileTableImageViewControl } from './file-table-image-view-control';
import { useImageViewContext } from './image-view-context';

export function FileTableImageViewClose() {
  const { close } = useImageViewContext();

  return (
    <FileTableImageViewControl placement="close" onClick={close} aria-label="Close image view">
      <XIcon size={ICON_SIZE.lg} />
    </FileTableImageViewControl>
  );
}
