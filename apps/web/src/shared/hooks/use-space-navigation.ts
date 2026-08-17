import { clearSpaceUploads, type SpaceWizardStep } from '@repo/react/spaces/wizard';
import { useNavigate } from '@tanstack/react-router';

import { stashSharePin } from './use-share-pin';

/** App-router navigation for space surfaces. */
export function useSpaceNavigation() {
  const navigate = useNavigate();

  const goHome = () => {
    clearSpaceUploads();
    void navigate({ to: '/' });
  };

  const goToWizardStep = (options: { step: SpaceWizardStep; spaceId?: string }) => {
    const { step, spaceId } = options;

    if (!spaceId) {
      goHome();
      return;
    }

    switch (step) {
      case 'upload':
        void navigate({ to: '/spaces/$spaceId/upload', params: { spaceId } });
        return;
      case 'share':
        void navigate({ to: '/spaces/$spaceId/share', params: { spaceId } });
        return;
    }
  };

  const goToManage = (options: { spaceId: string; pin?: string }) => {
    const { spaceId, pin } = options;

    if (pin) {
      stashSharePin({ spaceId, pin });
    }

    void navigate({ to: '/spaces/$spaceId', params: { spaceId } });
  };

  return { goHome, goToWizardStep, goToManage };
}
