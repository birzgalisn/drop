import { Anchor as MantineAnchor } from '@mantine/core';
import type { MouseEventHandler, ReactNode } from 'react';

import classes from './anchor.module.css';

export type AnchorProps = {
  children?: ReactNode;
} & (
  | {
      href: string;
      onClick?: never;
      component?: 'a';
    }
  | {
      href?: never;
      component: 'button';
      onClick?: MouseEventHandler<HTMLButtonElement>;
    }
);

export function Anchor(props: AnchorProps) {
  if (props.component === 'button') {
    return (
      <MantineAnchor
        component="button"
        type="button"
        underline="hover"
        className={classes.root}
        onClick={props.onClick}
      >
        {props.children}
      </MantineAnchor>
    );
  }

  return (
    <MantineAnchor href={props.href} underline="hover" className={classes.root}>
      {props.children}
    </MantineAnchor>
  );
}
