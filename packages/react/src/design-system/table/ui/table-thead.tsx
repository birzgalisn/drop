import { Table as MantineTable } from '@mantine/core';
import type { ReactNode } from 'react';

export function TableThead({ children }: { children?: ReactNode }) {
  return <MantineTable.Thead>{children}</MantineTable.Thead>;
}
