import { memo } from 'react';

import { Background } from '../../../design-system/background/feature/background';
import { Box } from '../../../design-system/box/feature/box';
import { useShareUnlock } from '../../hooks/use-share-unlock';
import { ShareViewerFiles } from '../ui/share-viewer-files';
import { ShareViewerUnlock } from '../ui/share-viewer-unlock';

export interface ShareViewerProps {
  token: string;
  apiBaseUrl: string;
  onHome: () => void;
  /** Shown to the author only, as a shortcut back to the manage surface. */
  onManage?: (options: { spaceId: string; pin?: string }) => void;
}

/** Recipient surface: PIN gate, then the read-only file list. */
export const ShareViewer = memo(function ShareViewer({
  token,
  apiBaseUrl,
  onHome,
  onManage,
}: ShareViewerProps) {
  const { unlockedPin, isUnlocking, pinResetKey, form, unlock, resetPinAfterError } =
    useShareUnlock({ token });

  return (
    <>
      <Background />

      <Box component="main">
        {unlockedPin === null ? (
          <ShareViewerUnlock
            form={form}
            isUnlocking={isUnlocking}
            pinResetKey={pinResetKey}
            onUnlock={unlock}
            onUnlockError={resetPinAfterError}
            onHome={onHome}
          />
        ) : (
          <ShareViewerFiles
            token={token}
            apiBaseUrl={apiBaseUrl.replace(/\/$/, '')}
            unlockedPin={unlockedPin}
            onHome={onHome}
            onManage={onManage}
          />
        )}
      </Box>
    </>
  );
});
