import { TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/MagnifyingGlass';
import type { ChangeEvent } from 'react';

import { ICON_SIZE } from '../../util/icon-size';
import { useTableContext } from '../hooks/create-table';
import { useTableGlobalFilter } from '../hooks/use-table-selection';
import type { TableRowBase } from '../util/types';

import classes from './table-toolbar.module.css';

export function TableToolbarSearch({
  placeholder = 'Search',
  label = placeholder,
}: {
  placeholder?: string;
  label?: string;
}) {
  const table = useTableContext<TableRowBase>();
  const globalFilter = useTableGlobalFilter();

  if (!table.options.enableGlobalFilter) {
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    table.setGlobalFilter(event.currentTarget.value);
  };

  return (
    <TextInput
      className={classes.search}
      value={globalFilter}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label={label}
      size="xs"
      autoComplete="off"
      leftSection={<MagnifyingGlassIcon size={ICON_SIZE.sm} aria-hidden />}
    />
  );
}
