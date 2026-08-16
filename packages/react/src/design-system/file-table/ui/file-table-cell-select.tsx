import type { Row } from '@tanstack/react-table';
import type { ChangeEvent, SyntheticEvent } from 'react';

import { Box } from '../../box/feature/box';
import { Checkbox } from '../../checkbox/feature/checkbox';
import type { TableFeatures } from '../../table/hooks/create-table';
import { useTableContext } from '../../table/hooks/create-table';
import type { TableRowBase } from '../../table/util/types';

import classes from './file-table-cell-select.module.css';

export function FileTableCellSelect<T extends TableRowBase>({
  row,
}: {
  row: Row<TableFeatures, T>;
}) {
  const table = useTableContext<T>();
  const disabled = !row.getCanSelect();

  return (
    <table.Subscribe selector={(state) => state.rowSelection[row.id] === true}>
      {(checked) => <FileTableSelectCheckbox row={row} checked={checked} disabled={disabled} />}
    </table.Subscribe>
  );
}

function FileTableSelectCheckbox<T extends TableRowBase>({
  row,
  checked,
  disabled,
}: {
  row: Row<TableFeatures, T>;
  checked: boolean;
  disabled: boolean;
}) {
  const handleStop = (event: SyntheticEvent) => {
    event.stopPropagation();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (!disabled) {
      row.toggleSelected(event.currentTarget.checked);
    }
  };

  return (
    <Box display="flex" h={40} className={classes.slot}>
      <Checkbox
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onClick={handleStop}
        onMouseDown={handleStop}
        onKeyDown={handleStop}
        aria-label={`Select ${row.id}`}
      />
    </Box>
  );
}
