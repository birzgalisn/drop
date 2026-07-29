import { Title, Tooltip, UnstyledButton } from '@mantine/core';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import { useStorageCapacity } from '../hooks/use-storage-capacity';

import classes from './drop-logo.module.css';

export interface DropLogoProps {
  /** Navigate home / fresh start. When omitted, the logo is inert. */
  onHome?: () => void;
  order?: 1 | 2 | 3;
}

/** Brand wordmark — live storage fill when capacity is available; clickable when `onHome` is set. */
export function DropLogo({ onHome, order = 1 }: DropLogoProps): ReactNode {
  const { meter } = useStorageCapacity();

  let content: ReactNode = (
    <Title
      order={order}
      className={clsx(classes.wordmark, meter && classes.meter)}
      style={meter?.style}
    >
      Drop
    </Title>
  );

  if (onHome) {
    content = (
      <UnstyledButton onClick={onHome} aria-label="Go to home" className={classes.button}>
        {content}
      </UnstyledButton>
    );
  }

  if (meter?.label) {
    content = (
      <Tooltip label={meter.label} openDelay={400}>
        {content}
      </Tooltip>
    );
  }

  return content;
}
