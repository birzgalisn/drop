import { DownloadSimpleIcon } from '@phosphor-icons/react/DownloadSimple';

import { ICON_SIZE } from '../../util/icon-size';
import { FileTableImageViewControl } from './file-table-image-view-control';
import { useImageViewContext } from './image-view-context';

export function FileTableImageViewDownload() {
  const { active, getDownloadHref } = useImageViewContext();
  const downloadHref = active ? (getDownloadHref?.(active) ?? null) : null;

  if (!active || !downloadHref) {
    return null;
  }

  return (
    <FileTableImageViewControl
      placement="download"
      href={downloadHref}
      aria-label={`Download ${active.name}`}
    >
      <DownloadSimpleIcon size={ICON_SIZE.lg} />
    </FileTableImageViewControl>
  );
}
