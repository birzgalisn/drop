import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core';
import clsx from 'clsx';
import type { MouseEventHandler } from 'react';

import type { ButtonSize } from '../../util/button-size';
import type { WithoutStyle } from '../../util/without-style';

import classes from './button.module.css';

const VARIANT = {
  subtle: 'light',
  solid: 'filled',
  default: 'default',
} as const;

const TONE = {
  neutral: undefined,
  danger: 'red',
} as const;

export type ButtonVariant = keyof typeof VARIANT;
export type ButtonTone = keyof typeof TONE;
export type { ButtonSize };

export type ButtonProps = WithoutStyle<
  Pick<MantineButtonProps, 'loading' | 'disabled' | 'fullWidth' | 'children'>
> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  'aria-label'?: string;
};

export function Button({
  variant = 'solid',
  tone = 'neutral',
  size = 'sm',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <MantineButton
      variant={VARIANT[variant]}
      color={TONE[tone]}
      size={size}
      type={type}
      className={clsx(classes.root, classes[size])}
      {...props}
    />
  );
}
