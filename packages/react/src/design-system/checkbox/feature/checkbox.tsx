import {
  Checkbox as MantineCheckbox,
  type CheckboxProps as MantineCheckboxProps,
} from '@mantine/core';

import type { WithoutStyle } from '../../util/without-style';

import classes from './checkbox.module.css';

export type CheckboxProps = WithoutStyle<
  Pick<
    MantineCheckboxProps,
    | 'checked'
    | 'indeterminate'
    | 'disabled'
    | 'onChange'
    | 'onClick'
    | 'onKeyDown'
    | 'onMouseDown'
    | 'aria-label'
  >
>;

export function Checkbox(props: CheckboxProps) {
  return (
    <MantineCheckbox
      classNames={{
        root: classes.root,
        body: classes.body,
        inner: classes.inner,
        labelWrapper: classes.labelWrapper,
        input: classes.input,
        icon: classes.icon,
      }}
      {...props}
    />
  );
}
