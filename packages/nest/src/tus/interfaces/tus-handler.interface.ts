import type { Upload } from '@tus/server';

/**
 * Callbacks a feature module registers into the {@link TusHandlerRegistry} for
 * one `UploadType`. The shared `/files` endpoint dispatches to whichever
 * handler matches the upload's `uploadType` metadata.
 */
export interface TusUploadHandler {
  onUploadCreate?: (req: unknown, upload: Upload) => Promise<void> | void;
  onUploadFinish?: (req: unknown, upload: Upload) => Promise<void> | void;
}
