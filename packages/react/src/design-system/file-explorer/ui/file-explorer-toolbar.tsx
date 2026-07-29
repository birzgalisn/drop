import { Box, Button, Checkbox, Group, Text, Tooltip } from '@mantine/core';

const CHECKBOX_STYLES = {
  input: { transition: 'none' },
  icon: { transition: 'none' },
} as const;

export interface FileExplorerToolbarProps {
  fileCount: number;
  selected: ReadonlySet<string>;
  selectableIds: string[];
  allSelected: boolean;
  someSelected: boolean;
  removing: boolean;
  onToggleAll: () => void;
  onClearSelection: () => void;
  onZip?: (fileIds: string[]) => void;
  onRemoveMany?: (fileIds: string[]) => void;
}

export function FileExplorerToolbar({
  fileCount,
  selected,
  selectableIds,
  allSelected,
  someSelected,
  removing,
  onToggleAll,
  onClearSelection,
  onZip,
  onRemoveMany,
}: FileExplorerToolbarProps) {
  if (fileCount === 0) {
    return null;
  }

  const selectedIds = [...selected].filter((id) => selectableIds.includes(id));

  return (
    <Group justify="space-between" align="center">
      <Group gap="sm">
        <Checkbox
          checked={allSelected}
          indeterminate={someSelected && !allSelected}
          onChange={onToggleAll}
          aria-label="Select all files"
          disabled={selectableIds.length === 0}
          styles={CHECKBOX_STYLES}
        />
        <Text size="sm" c="dimmed">
          {someSelected
            ? `${selected.size} selected`
            : `${fileCount} file${fileCount === 1 ? '' : 's'}`}
        </Text>
      </Group>
      <Group gap="sm">
        {onRemoveMany ? (
          <DeleteButton
            ids={selectedIds}
            removing={removing}
            onRemoveMany={onRemoveMany}
            onClearSelection={onClearSelection}
          />
        ) : null}
        {onZip && selectableIds.length > 0 ? (
          <Button
            size="compact-sm"
            variant="light"
            onClick={() => onZip(someSelected ? selectedIds : [])}
            aria-label={
              someSelected ? `Download ${selected.size} selected files` : 'Download all files'
            }
          >
            Download{someSelected ? ` (${selected.size})` : ''}
          </Button>
        ) : null}
      </Group>
    </Group>
  );
}

function DeleteButton({
  ids,
  removing,
  onRemoveMany,
  onClearSelection,
}: {
  ids: string[];
  removing: boolean;
  onRemoveMany: (fileIds: string[]) => void;
  onClearSelection: () => void;
}) {
  const canDelete = ids.length > 0;
  const button = (
    <Button
      size="compact-sm"
      color="red"
      variant="light"
      loading={removing}
      disabled={!canDelete}
      onClick={() => {
        onRemoveMany(ids);
        onClearSelection();
      }}
      aria-label={
        canDelete
          ? `Delete ${ids.length} selected file${ids.length === 1 ? '' : 's'}`
          : 'Delete selected files'
      }
    >
      Delete{canDelete ? ` (${ids.length})` : ''}
    </Button>
  );

  if (canDelete) {
    return button;
  }

  return (
    <Tooltip label="Select files to delete">
      <Box component="span" display="inline-flex">
        {button}
      </Box>
    </Tooltip>
  );
}
