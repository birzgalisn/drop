import { Badge, Tooltip } from '@mantine/core';
import { ArrowSquareOutIcon } from '@phosphor-icons/react/ArrowSquareOut';

import { ICON_SIZE } from '../../../design-system/util/icon-size';
import { stashShareViewerPin } from '../../share-viewer/util/share-viewer-pin';
import { getShareViewerUrl } from '../util/get-share-viewer-url';

/** Opens the share as a recipient would see it, PIN included when we have it. */
export function SpaceManagePreviewLink({ token, pin }: { token: string; pin?: string }) {
  const previewUrl = pin ? getShareViewerUrl({ token, pin }) : getShareViewerUrl({ token });

  return (
    <Tooltip label="Open share as a recipient">
      <Badge
        component="a"
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        color="sand"
        variant="light"
        rightSection={<ArrowSquareOutIcon size={ICON_SIZE.sm} />}
        style={{ cursor: 'pointer', flexShrink: 0 }}
        onClick={() => {
          if (pin) {
            stashShareViewerPin({ token, pin });
          }
        }}
      >
        Preview
      </Badge>
    </Tooltip>
  );
}
