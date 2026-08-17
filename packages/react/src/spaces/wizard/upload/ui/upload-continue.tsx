import { Button } from '../../../../design-system/button/feature/button';
import { Group } from '../../../../design-system/group/feature/group';
import type { SpaceWizardNavigate } from '../../util/space-wizard-steps';

export interface UploadContinueProps {
  count: number;
  /** Undefined until the first add creates the space. */
  spaceId?: string;
  onNavigate: SpaceWizardNavigate;
}

export function UploadContinue({ count, spaceId, onNavigate }: UploadContinueProps) {
  if (count === 0) {
    return null;
  }

  const canContinue = Boolean(spaceId) && spaceId !== 'pending';

  return (
    <Group justify="flex-end">
      <Button
        onClick={() => canContinue && onNavigate({ step: 'share', spaceId })}
        disabled={!canContinue}
      >
        Continue
      </Button>
    </Group>
  );
}
