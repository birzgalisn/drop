import { Table as MantineTable } from '@mantine/core';
import type { ReactNode } from 'react';

export function TableTbody({ children }: { children?: ReactNode }) {
  return <MantineTable.Tbody>{children}</MantineTable.Tbody>;
}
