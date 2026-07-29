import { MantineProvider, type MantineProviderProps } from '@mantine/core';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { dropTheme } from '../util/drop-theme';

import './drop-theme.css';

export type UiProviderProps = MantineProviderProps;

export function UiProvider({ children, theme = dropTheme, ...props }: UiProviderProps) {
  return (
    <MantineProvider defaultColorScheme="dark" forceColorScheme="dark" theme={theme} {...props}>
      {children}
    </MantineProvider>
  );
}
