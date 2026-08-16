import { ActionIcon as MantineActionIcon } from '@mantine/core';
import clsx from 'clsx';
import type { MouseEventHandler, ReactNode, Ref } from 'react';

import classes from './icon-button.module.css';

const VARIANT = {
  subtle: 'subtle',
  solid: 'filled',
  default: 'default',
  ghost: 'transparent',
} as const;

const TONE = {
  neutral: undefined,
  danger: 'red',
} as const;

export type IconButtonVariant = keyof typeof VARIANT;
export type IconButtonTone = keyof typeof TONE;

type IconButtonShared = {
  'aria-label': string;
  children: ReactNode;
  variant?: IconButtonVariant;
  tone?: IconButtonTone;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
};

export type IconButtonProps = IconButtonShared &
  (
    | {
        onClick: MouseEventHandler<HTMLButtonElement>;
        href?: never;
      }
    | {
        href: string;
        onClick?: never;
      }
  );

export function IconButton({
  variant = 'subtle',
  tone = 'neutral',
  className,
  children,
  loading,
  disabled,
  ref,
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps) {
  const shared = {
    variant: VARIANT[variant],
    color: TONE[tone],
    size: 'sm' as const,
    loading,
    disabled,
    'aria-label': ariaLabel,
    className: clsx(classes.root, className),
  };

  if ('href' in props && props.href) {
    return (
      <MantineActionIcon
        component="a"
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        {...shared}
      >
        {children}
      </MantineActionIcon>
    );
  }

  return (
    <MantineActionIcon ref={ref} type="button" onClick={props.onClick} {...shared}>
      {children}
    </MantineActionIcon>
  );
}
