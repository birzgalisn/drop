import { Tooltip, UnstyledButton } from '@mantine/core';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import { useStorageCapacity } from '../hooks/use-storage-capacity';

import classes from './drop-logo.module.css';

export type DropLogoProps = {
  /** Navigate home / fresh start. When omitted, the logo is inert. */
  onHome?: () => void;
  /** Compact chrome beside a page title. Display is the landing wordmark. */
  size?: 'display' | 'compact';
};

/** Brand wordmark — live storage fill when capacity is available; clickable when `onHome` is set. */
export function DropLogo({ onHome, size = 'display' }: DropLogoProps): ReactNode {
  const { meter } = useStorageCapacity();
  const Tag = size === 'compact' || onHome ? 'p' : 'h1';

  let content: ReactNode = (
    <Tag
      className={clsx(classes.wordmark, classes[size], meter && classes.meter)}
      style={meter?.style}
    >
      Drop
    </Tag>
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
