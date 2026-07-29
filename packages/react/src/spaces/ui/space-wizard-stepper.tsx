import { WizardStepper } from '../../design-system/wizard/ui/wizard-stepper';
import {
  SPACE_WIZARD_STEP_ORDER,
  type SpaceWizardNavigate,
  type SpaceWizardStep,
} from '../util/space-wizard-steps';

const STEP_LABELS: Record<SpaceWizardStep, string> = {
  upload: 'Upload',
  share: 'Share',
};

export interface SpaceWizardStepperProps {
  step: SpaceWizardStep;
  spaceId?: string;
  /** Forward navigation stays blocked until the space has at least one file. */
  hasFiles: boolean;
  onNavigate: SpaceWizardNavigate;
}

export function SpaceWizardStepper({
  step,
  spaceId,
  hasFiles,
  onNavigate,
}: SpaceWizardStepperProps) {
  const activeIndex = SPACE_WIZARD_STEP_ORDER.indexOf(step);

  return (
    <WizardStepper
      steps={SPACE_WIZARD_STEP_ORDER.map((id) => ({ id, label: STEP_LABELS[id] }))}
      activeStep={step}
      onStepClick={({ step: target, index }) => {
        if (!spaceId || index === activeIndex) {
          return;
        }

        if (index < activeIndex || hasFiles) {
          onNavigate({ step: target, spaceId });
        }
      }}
      canSelectStep={({ index }) => index <= activeIndex || hasFiles}
    />
  );
}
