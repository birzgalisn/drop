import { PinInput, type PinInputProps } from '@mantine/core';

import { GAP } from '../../util/gap';
import type { WithoutStyle } from '../../util/without-style';

import classes from './pin.module.css';

type PinFieldProps = WithoutStyle<
  Pick<
    PinInputProps,
    | 'length'
    | 'value'
    | 'mask'
    | 'disabled'
    | 'error'
    | 'autoFocus'
    | 'onChange'
    | 'onComplete'
    | 'ariaLabel'
    | 'id'
  >
> & {
  readOnly?: false;
};

type PinValueProps = {
  readOnly: true;
  value: string;
};

export type PinProps = PinFieldProps | PinValueProps;

export function Pin(props: PinProps) {
  if (props.readOnly) {
    return <span className={classes.value}>{props.value}</span>;
  }

  const { mask = false, ...rest } = props;

  return (
    <PinInput
      type="number"
      oneTimeCode
      radius="md"
      size="sm"
      gap={GAP.regular}
      mask={mask}
      {...rest}
    />
  );
}
