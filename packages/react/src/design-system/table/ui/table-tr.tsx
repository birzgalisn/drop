import { Table as MantineTable } from '@mantine/core';
import type { ReactNode } from 'react';

export function TableTr({ children }: { children?: ReactNode }) {
  return <MantineTable.Tr>{children}</MantineTable.Tr>;
}
