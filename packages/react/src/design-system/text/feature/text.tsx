import clsx from 'clsx';
import type { ReactNode } from 'react';

import type { TextVariant } from '../util/variants';

import classes from './text.module.css';

export type TextProps = {
  variant?: TextVariant;
  truncate?: boolean;
  component?: 'p' | 'span' | 'h1' | 'h2';
  className?: string;
  children?: ReactNode;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
};

export function Text({
  variant = 'muted',
  truncate,
  component: Tag = 'p',
  className,
  children,
  'aria-hidden': ariaHidden,
  'aria-label': ariaLabel,
}: TextProps) {
  return (
    <Tag
      className={clsx(classes.root, classes[variant], truncate && classes.truncate, className)}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  );
}
