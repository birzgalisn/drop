export type SpaceWizardStep = 'upload' | 'share';

/** App router callback for wizard stage / space-id URL sync. */
export type SpaceWizardNavigate = (options: { step: SpaceWizardStep; spaceId?: string }) => void;

export const SPACE_WIZARD_STEPS: ReadonlyArray<{ id: SpaceWizardStep; label: string }> = [
  { id: 'upload', label: 'Upload' },
  { id: 'share', label: 'Share' },
];
