import { Loader as MantineLoader } from '@mantine/core';

import { Center, type CenterProps } from '../../center/feature/center';

export type LoaderProps = Pick<CenterProps, 'component'>;

export function Loader({ component }: LoaderProps) {
  return (
    <Center component={component} mih="100vh">
      <MantineLoader />
    </Center>
  );
}
