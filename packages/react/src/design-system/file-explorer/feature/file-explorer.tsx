import { Stack, Text } from '@mantine/core';

import { useFileExplorer } from '../hooks/use-file-explorer';
import type { FileExplorerProps } from '../types';
import { FileExplorerImageView } from '../ui/file-explorer-image-view';
import { FileExplorerList } from '../ui/file-explorer-list';
import { FileExplorerToolbar } from '../ui/file-explorer-toolbar';

export type { FileExplorerItem, FileExplorerProps } from '../types';

/** Finder-style selectable file list with toolbar, rows, and image lightbox. */
export function FileExplorer({
  files,
  onZip,
  getDownloadHref,
  onRemoveMany,
  removing = false,
  emptyMessage = 'No files yet.',
  embedded = false,
  activeImageId,
  onActiveImageIdChange,
}: FileExplorerProps) {
  const {
    selected,
    selectableIds,
    allSelected,
    someSelected,
    viewableFiles,
    activeImage,
    toggleAll,
    toggleOne,
    clearSelection,
    openImage,
    closeImage,
    goPrev,
    goNext,
  } = useFileExplorer({ files, activeImageId, onActiveImageIdChange });

  return (
    <Stack gap="sm">
      {files.length === 0 && !embedded ? (
        <Text c="dimmed" size="sm">
          {emptyMessage}
        </Text>
      ) : null}

      <FileExplorerToolbar
        fileCount={files.length}
        selected={selected}
        selectableIds={selectableIds}
        allSelected={allSelected}
        someSelected={someSelected}
        removing={removing}
        onToggleAll={toggleAll}
        onClearSelection={clearSelection}
        onZip={onZip}
        onRemoveMany={onRemoveMany}
      />

      <FileExplorerList
        files={files}
        embedded={embedded}
        selected={selected}
        onToggleOne={toggleOne}
        onOpenImage={openImage}
      />

      <FileExplorerImageView
        file={activeImage}
        canNavigate={viewableFiles.length > 1}
        getDownloadHref={getDownloadHref}
        onClose={closeImage}
        onPrev={goPrev}
        onNext={goNext}
      />
    </Stack>
  );
}
