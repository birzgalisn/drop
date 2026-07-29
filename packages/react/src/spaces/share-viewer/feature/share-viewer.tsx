import { FloatyBackground } from '../../../design-system/floaty-background/feature/floaty-background';
import { useShareUnlock } from '../../hooks/use-share-unlock';
import { ShareViewerFiles } from '../ui/share-viewer-files';
import { ShareViewerUnlock } from '../ui/share-viewer-unlock';

export interface ShareViewerProps {
  token: string;
  apiBaseUrl: string;
  activeImageId?: string | null;
  onActiveImageIdChange?: (fileId: string | null) => void;
  onHome: () => void;
  /** Shown to the author only, as a shortcut back to the manage surface. */
  onManage?: (options: { spaceId: string; pin?: string }) => void;
}

/** Recipient surface: PIN gate, then the read-only file list. */
export function ShareViewer({
  token,
  apiBaseUrl,
  activeImageId,
  onActiveImageIdChange,
  onHome,
  onManage,
}: ShareViewerProps) {
  const { unlockedPin, isUnlocking, pinResetKey, form, unlock, resetPinAfterError } =
    useShareUnlock({ token });

  return (
    <>
      <FloatyBackground />

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
          activeImageId={activeImageId}
          onActiveImageIdChange={onActiveImageIdChange}
          onHome={onHome}
          onManage={onManage}
        />
      )}
    </>
  );
}
