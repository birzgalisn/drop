import { Stepper } from '../../design-system/stepper/feature/stepper';
import {
  SPACE_WIZARD_STEPS,
  type SpaceWizardNavigate,
  type SpaceWizardStep,
} from '../util/space-wizard-steps';

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
  const handleStepClick = ({ step: target }: { step: SpaceWizardStep }) => {
    if (!spaceId) {
      return;
    }

    onNavigate({ step: target, spaceId });
  };

  const handleCanSelectStep = ({ index, activeIndex }: { index: number; activeIndex: number }) =>
    Boolean(spaceId) && (index <= activeIndex || hasFiles);

  return (
    <Stepper
      steps={SPACE_WIZARD_STEPS}
      activeStep={step}
      onStepClick={handleStepClick}
      canSelectStep={handleCanSelectStep}
    />
  );
}
