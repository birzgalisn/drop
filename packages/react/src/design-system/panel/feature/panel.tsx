import { Stack, type StackProps } from '@mantine/core';
import type { ReactNode } from 'react';

export type PanelTone = 'surface' | 'elevated';

export interface PanelProps extends Omit<StackProps, 'style'> {
  tone?: PanelTone;
  children: ReactNode;
}

/** Bordered, padded surface used for share/form chrome. */
export function Panel({ tone = 'elevated', children, ...rest }: PanelProps) {
  return (
    <Stack
      p="md"
      gap="sm"
      style={{
        background: tone === 'surface' ? 'var(--drop-surface)' : 'var(--drop-elevated)',
        borderRadius: 12,
        border: '1px solid var(--drop-border)',
      }}
      {...rest}
    >
      {children}
    </Stack>
  );
}
