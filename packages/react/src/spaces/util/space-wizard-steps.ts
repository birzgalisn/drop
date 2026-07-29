export type SpaceWizardStep = 'upload' | 'share';

/** App router callback for wizard stage / space-id URL sync. */
export type SpaceWizardNavigate = (options: { step: SpaceWizardStep; spaceId?: string }) => void;

export const SPACE_WIZARD_STEP_ORDER: SpaceWizardStep[] = ['upload', 'share'];
