import type { ReactNode } from 'react';

import { Anchor } from '../../anchor/feature/anchor';
import { Center } from '../../center/feature/center';
import { Stack } from '../../stack/feature/stack';
import { Text } from '../../text/feature/text';

import classes from './error-screen.module.css';

export interface ErrorScreenProps {
  code: ReactNode;
  message: string;
  action: string;
  href?: string;
  onAction?: () => void;
}

export function ErrorScreen({ code, message, action, href = '/', onAction }: ErrorScreenProps) {
  return (
    <Center component="main" className={classes.root} role="status" aria-live="polite">
      <Stack gap="loose" align="center">
        <Text variant="title" className={classes.code}>
          {code}
        </Text>
        <Stack gap="regular" align="center" ta="center">
          <Text>{message}</Text>
          {onAction ? (
            <Anchor component="button" onClick={onAction}>
              {action}
            </Anchor>
          ) : (
            <Anchor href={href}>{action}</Anchor>
          )}
        </Stack>
      </Stack>
    </Center>
  );
}
