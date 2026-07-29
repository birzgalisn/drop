export interface FileExplorerItem {
  id: string;
  name: string;
  byteSize: number;
  createdAt?: string | Date | null;
  statusLabel?: string;
  /** Optional thumbnail / preview URL (prefer small previews, not full downloads). */
  thumbUrl?: string | null;
  /** Viewer display URL — prefer optimized `md` WebP over the original. */
  viewUrl?: string | null;
  /** When false, row checkbox is disabled (e.g. not READY). Default true. */
  selectable?: boolean;
}

export interface FileExplorerProps {
  files: FileExplorerItem[];
  /** Zip download; receives selected ids (empty = all selectable). */
  onZip?: (fileIds: string[]) => void;
  /** Per-file download href; return null to hide Download in the lightbox. */
  getDownloadHref?: (file: FileExplorerItem) => string | null;
  /** Batch remove selected ids; omit to hide toolbar Delete. */
  onRemoveMany?: (fileIds: string[]) => void;
  removing?: boolean;
  emptyMessage?: string;
  /** Nested in a dropzone — softer list chrome, no standalone empty state. */
  embedded?: boolean;
  /**
   * Controlled open image id (e.g. URL `?image=`). When `onActiveImageIdChange`
   * is set, open/close/prev/next call it instead of internal state.
   */
  activeImageId?: string | null;
  onActiveImageIdChange?: (fileId: string | null) => void;
}
