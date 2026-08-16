import { Box as MantineBox, Stepper as MantineStepper } from '@mantine/core';
import { CheckIcon } from '@phosphor-icons/react/Check';
import clsx from 'clsx';

import { ICON_SIZE } from '../../util/icon-size';

import classes from './stepper.module.css';

export type StepperSize = 'narrow' | 'regular' | 'wide';

export type StepperStep<Step extends string> = {
  id: Step;
  label: string;
};

export type StepperProps<Step extends string> = {
  steps: ReadonlyArray<StepperStep<Step>>;
  activeStep: Step;
  onStepClick: (options: { step: Step; index: number }) => void;
  canSelectStep?: (options: { step: Step; index: number; activeIndex: number }) => boolean;
  size?: StepperSize;
};

export function Stepper<Step extends string>({
  steps,
  activeStep,
  onStepClick,
  canSelectStep,
  size = 'regular',
}: StepperProps<Step>) {
  const activeIndex = steps.findIndex((item) => item.id === activeStep);
  const resolvedIndex = activeIndex < 0 ? 0 : activeIndex;

  const canSelect = (index: number) => {
    const target = steps[index];
    if (!target) {
      return false;
    }

    if (!canSelectStep) {
      return true;
    }

    return canSelectStep({ step: target.id, index, activeIndex: resolvedIndex });
  };

  const handleStepClick = (index: number) => {
    const target = steps[index];
    if (!target || index === resolvedIndex || !canSelect(index)) {
      return;
    }

    onStepClick({ step: target.id, index });
  };

  const allowNextStepsSelect = steps.some((_step, index) => canSelect(index));

  return (
    <MantineBox className={clsx(classes.root, classes[size])}>
      <MantineStepper
        active={resolvedIndex}
        completedIcon={<CheckIcon size={ICON_SIZE.md} weight="bold" />}
        onStepClick={handleStepClick}
        allowNextStepsSelect={allowNextStepsSelect}
        size="sm"
      >
        {steps.map((item) => (
          <MantineStepper.Step key={item.id} label={item.label} />
        ))}
      </MantineStepper>
    </MantineBox>
  );
}
