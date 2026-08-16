import { MantineProvider, type MantineProviderProps } from '@mantine/core';

import '@mantine/core/styles.css';

import { uiTheme } from '../util/theme';

import './theme.css';

export type UiProviderProps = Pick<MantineProviderProps, 'children'>;

export function UiProvider({ children }: UiProviderProps) {
  return (
    <MantineProvider defaultColorScheme="dark" forceColorScheme="dark" theme={uiTheme}>
      {children}
    </MantineProvider>
  );
}
