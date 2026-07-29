import { Box, Button, Center, Stack, Text, type CenterProps, type TextProps } from '@mantine/core';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import { NotFoundMosaic, NotFoundStrays } from '../ui/not-found-mosaic';

import classes from './not-found.module.css';

export interface NotFoundProps extends Omit<CenterProps, 'children'> {
  children: ReactNode;
}

/** Full-viewport 404 shell — compose Stage / Mosaic / Message / Home at the call site. */
export function NotFound({ children, className, ...rest }: NotFoundProps): ReactNode {
  return (
    <Center className={clsx(classes.root, className)} role="status" aria-live="polite" {...rest}>
      <Stack gap="xl" align="center">
        {children}
      </Stack>
    </Center>
  );
}

function NotFoundStage({ children }: { children: ReactNode }) {
  return (
    <Box className={classes.stage} aria-hidden>
      {children}
    </Box>
  );
}

function NotFoundFooter({ children }: { children: ReactNode }) {
  return <Box className={classes.footer}>{children}</Box>;
}

export type NotFoundMessageProps = Omit<TextProps, 'children'> & {
  children?: ReactNode;
};

function NotFoundMessage({
  children = 'Lost in the stack',
  className,
  ...rest
}: NotFoundMessageProps) {
  return (
    <Text className={clsx(classes.copy, className)} size="lg" c="dimmed" ta="center" {...rest}>
      {children}
    </Text>
  );
}

export interface NotFoundHomeProps {
  onHome: () => void;
  children?: ReactNode;
}

function NotFoundHome({ onHome, children = 'Go Home' }: NotFoundHomeProps) {
  return (
    <Button variant="light" color="sand" onClick={onHome}>
      {children}
    </Button>
  );
}

NotFound.Stage = NotFoundStage;
NotFound.Strays = NotFoundStrays;
NotFound.Mosaic = NotFoundMosaic;
NotFound.Footer = NotFoundFooter;
NotFound.Message = NotFoundMessage;
NotFound.Home = NotFoundHome;
