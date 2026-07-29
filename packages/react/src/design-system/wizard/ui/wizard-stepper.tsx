import { Box, Stepper } from '@mantine/core';
import { CheckIcon } from '@phosphor-icons/react/Check';

export interface WizardStepperStep<TStep extends string> {
  id: TStep;
  label: string;
}

export interface WizardStepperProps<TStep extends string> {
  steps: ReadonlyArray<WizardStepperStep<TStep>>;
  activeStep: TStep;
  onStepClick: (options: { step: TStep; index: number }) => void;
  /** Return false to ignore click. Default: always true. */
  canSelectStep?: (options: { step: TStep; index: number; activeIndex: number }) => boolean;
  allowNextStepsSelect?: boolean;
}

export function WizardStepper<TStep extends string>({
  steps,
  activeStep,
  onStepClick,
  canSelectStep,
  allowNextStepsSelect,
}: WizardStepperProps<TStep>) {
  const activeIndex = steps.findIndex((item) => item.id === activeStep);

  return (
    <Box maw={420} mx="auto" w="100%">
      <Stepper
        active={activeIndex < 0 ? 0 : activeIndex}
        completedIcon={<CheckIcon size={14} weight="bold" />}
        onStepClick={(index) => {
          const target = steps[index];

          if (!target || index === activeIndex) {
            return;
          }

          if (canSelectStep && !canSelectStep({ step: target.id, index, activeIndex })) {
            return;
          }

          onStepClick({ step: target.id, index });
        }}
        allowNextStepsSelect={
          allowNextStepsSelect ??
          (canSelectStep
            ? steps.some((item, index) => canSelectStep({ step: item.id, index, activeIndex }))
            : true)
        }
        size="sm"
        styles={{
          separator: {
            marginInline: 12,
            minWidth: 48,
            flex: '1 1 48px',
          },
        }}
      >
        {steps.map((item) => (
          <Stepper.Step key={item.id} label={item.label} />
        ))}
      </Stepper>
    </Box>
  );
}
