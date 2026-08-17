import { UploadType } from '@repo/shared';
import * as tus from 'tus-js-client';
import { create } from 'zustand';

import { getFilesTusEndpoint } from './get-files-tus-endpoint';

export type SpaceUploadStatus = 'pending' | 'uploading' | 'paused' | 'success' | 'error';

/** Phase of the single upload toast. */
export type UploadToastPhase = 'idle' | 'active' | 'complete';

export type CancelUploadHandler = (fileId: string) => void;

export interface SpaceUploadItem {
  fileId: string;
  /**
   * Stable across stage→commit (local id preserved). Use for React keys so the
   * preview image does not remount and flash empty when the server id arrives.
   */
  clientKey: string;
  spaceId: string;
  name: string;
  mimeType: string;
  bytesTotal: number;
  bytesUploaded: number;
  status: SpaceUploadStatus;
  speedBytesPerSec: number;
  previewUrl: string;
  /** Absolute author-list index; kept across stage→commit. */
  sortOrder: number;
  error?: string;
  file: File;
  /** Null while staged locally, waiting for addSpaceFiles to return real ids. */
  tusUpload: tus.Upload | null;
  lastSampleAt: number;
  lastSampleBytes: number;
}

const RETRY_DELAYS = [0, 1000, 3000, 5000, 10000];
const SPEED_SMOOTHING = 0.3;

function safeAbort(options: { upload: tus.Upload | null; shouldTerminate: boolean }): void {
  const { upload, shouldTerminate } = options;

  if (!upload) {
    return;
  }

  try {
    const result = upload.abort(shouldTerminate);

    if (result != null && typeof (result as Promise<unknown>).then === 'function') {
      void (result as Promise<unknown>).catch(() => undefined);
    }
  } catch {
    // Sync failures from tus — ignore.
  }
}

export interface SpaceUploadStore {
  uploads: SpaceUploadItem[];
  manuallyPaused: boolean;
  offline: boolean;

  /**
   * Show a local preview immediately (before addSpaceFiles). Returns a temporary
   * id later passed to {@link SpaceUploadStore.commit} or {@link SpaceUploadStore.discard}.
   */
  stage: (options: { file: File; spaceId: string; sortOrder?: number }) => string;
  /** Swap a staged local id for the server file id and start the tus upload. */
  commit: (options: {
    localId: string;
    fileId: string;
    spaceId: string;
    mimeType: string;
    apiBaseUrl: string;
  }) => void;
  /** Drop a staged preview after addSpaceFiles fails. */
  discard: (localId: string) => void;
  remove: (fileId: string) => void;
  /** Abort everything — used when starting a fresh Drop. */
  clearAll: () => void;
  pauseAll: () => void;
  resumeAll: () => void;
  /** Apply absolute list indices (e.g. after addFiles reconciles pending order). */
  setSortOrders: (entries: ReadonlyArray<{ fileId: string; sortOrder: number }>) => void;

  /**
   * Toast state lives here because the toast renders in a Mantine portal outside
   * the React tree and cannot receive props.
   */
  toastPhase: UploadToastPhase;
  toastBatchIds: string[];
  setToastPhase: (phase: UploadToastPhase) => void;
  setToastBatchIds: (ids: string[]) => void;
  addToastBatchId: (fileId: string) => void;
  resetToast: () => void;
  /** The mounted space surface registers the handler that also deletes server-side. */
  setCancelUploadHandler: (handler: CancelUploadHandler | null) => void;
  cancelUpload: (fileId: string) => void;
}

/**
 * In-flight space-file uploads. Module-scoped Zustand store so transfers keep
 * running across wizard route remounts (Select → Share → manage).
 */
export const useSpaceUploadStore = create<SpaceUploadStore>((set, get) => {
  let cancelHandler: CancelUploadHandler | null = null;

  const findUpload = (fileId: string) => get().uploads.find((upload) => upload.fileId === fileId);

  const patchUpload = (
    fileId: string,
    patch: (upload: SpaceUploadItem) => Partial<SpaceUploadItem>,
  ) => {
    set((state) => ({
      uploads: state.uploads.map((upload) =>
        upload.fileId === fileId ? { ...upload, ...patch(upload) } : upload,
      ),
    }));
  };

  const canRun = () => !get().manuallyPaused && !get().offline;

  const suspendActive = () => {
    const suspendable = get().uploads.filter(
      (upload) =>
        upload.tusUpload && (upload.status === 'uploading' || upload.status === 'pending'),
    );

    for (const upload of suspendable) {
      safeAbort({ upload: upload.tusUpload, shouldTerminate: false });
    }

    const suspendedIds = new Set(suspendable.map((upload) => upload.fileId));

    set((state) => ({
      uploads: state.uploads.map((upload) =>
        suspendedIds.has(upload.fileId)
          ? { ...upload, status: 'paused', speedBytesPerSec: 0 }
          : upload,
      ),
    }));
  };

  const resumeRunnable = () => {
    if (!canRun()) {
      return;
    }

    const resumable = get().uploads.filter(
      (upload) => upload.tusUpload && upload.status === 'paused',
    );
    const resumedIds = new Set(resumable.map((upload) => upload.fileId));

    set((state) => ({
      uploads: state.uploads.map((upload) =>
        resumedIds.has(upload.fileId)
          ? {
              ...upload,
              status: 'uploading',
              lastSampleAt: Date.now(),
              lastSampleBytes: upload.bytesUploaded,
            }
          : upload,
      ),
    }));

    for (const upload of resumable) {
      upload.tusUpload?.start();
    }
  };

  const handleProgress = (options: {
    fileId: string;
    bytesUploaded: number;
    bytesTotal: number;
  }) => {
    const { fileId, bytesUploaded, bytesTotal } = options;

    patchUpload(fileId, (upload) => {
      const now = Date.now();
      const elapsed = (now - upload.lastSampleAt) / 1000;
      const next: Partial<SpaceUploadItem> = {
        bytesUploaded,
        bytesTotal: bytesTotal || upload.bytesTotal,
        status: 'uploading',
      };

      if (elapsed > 0) {
        const instantaneous = Math.max(0, bytesUploaded - upload.lastSampleBytes) / elapsed;

        next.speedBytesPerSec =
          upload.speedBytesPerSec === 0
            ? instantaneous
            : upload.speedBytesPerSec * (1 - SPEED_SMOOTHING) + instantaneous * SPEED_SMOOTHING;
        next.lastSampleAt = now;
        next.lastSampleBytes = bytesUploaded;
      }

      return next;
    });
  };

  const createTusUpload = (options: {
    file: File;
    fileId: string;
    spaceId: string;
    mimeType: string;
    apiBaseUrl: string;
  }) => {
    const { file, fileId, spaceId, mimeType, apiBaseUrl } = options;

    return new tus.Upload(file, {
      endpoint: getFilesTusEndpoint({ apiBaseUrl }),
      retryDelays: RETRY_DELAYS,
      removeFingerprintOnSuccess: true,
      metadata: {
        uploadType: UploadType.SpaceFile,
        spaceId,
        fileId,
        mimeType,
      },
      onBeforeRequest: (req) => {
        const xhr: XMLHttpRequest = req.getUnderlyingObject();
        xhr.withCredentials = true;
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        handleProgress({ fileId, bytesUploaded, bytesTotal });
      },
      onSuccess: () => {
        patchUpload(fileId, (upload) => ({
          status: 'success',
          bytesUploaded: upload.bytesTotal,
          speedBytesPerSec: 0,
        }));
      },
      onError: (error) => {
        patchUpload(fileId, () => ({
          status: 'error',
          speedBytesPerSec: 0,
          error: error.message,
        }));
      },
    });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      set({ offline: false });
      resumeRunnable();
    });
    window.addEventListener('offline', () => {
      set({ offline: true });
      suspendActive();
    });
  }

  return {
    uploads: [],
    manuallyPaused: false,
    offline: typeof navigator !== 'undefined' && !navigator.onLine,
    toastPhase: 'idle',
    toastBatchIds: [],

    stage(options) {
      const { file, spaceId, sortOrder = 0 } = options;
      const fileId = crypto.randomUUID();

      set((state) => ({
        uploads: [
          ...state.uploads,
          {
            fileId,
            clientKey: fileId,
            spaceId,
            name: file.name,
            mimeType: file.type,
            bytesTotal: file.size,
            bytesUploaded: 0,
            status: 'pending',
            speedBytesPerSec: 0,
            previewUrl: URL.createObjectURL(file),
            sortOrder,
            file,
            tusUpload: null,
            lastSampleAt: Date.now(),
            lastSampleBytes: 0,
          },
        ],
      }));

      return fileId;
    },

    commit(options) {
      const { localId, fileId, spaceId, mimeType, apiBaseUrl } = options;
      const staged = findUpload(localId);

      if (!staged || staged.tusUpload) {
        return;
      }

      if (findUpload(fileId)) {
        // Already committed under the server id — drop the duplicate staged row.
        get().discard(localId);
        return;
      }

      const tusUpload = createTusUpload({
        file: staged.file,
        fileId,
        spaceId,
        mimeType,
        apiBaseUrl,
      });
      const running = canRun();

      set((state) => ({
        uploads: state.uploads.map((upload) =>
          upload.fileId === localId
            ? {
                ...upload,
                fileId,
                spaceId,
                mimeType,
                status: running ? 'uploading' : 'paused',
                tusUpload,
                lastSampleAt: Date.now(),
                lastSampleBytes: 0,
              }
            : upload,
        ),
      }));

      if (running) {
        tusUpload.start();
      }
    },

    discard(localId) {
      const staged = findUpload(localId);

      if (!staged || staged.tusUpload) {
        return;
      }

      URL.revokeObjectURL(staged.previewUrl);
      set((state) => ({
        uploads: state.uploads.filter((upload) => upload.fileId !== localId),
      }));
    },

    remove(fileId) {
      const target = findUpload(fileId);

      if (!target) {
        return;
      }

      const shouldTerminate =
        target.status === 'uploading' || target.status === 'paused' || target.status === 'error';

      safeAbort({ upload: target.tusUpload, shouldTerminate });
      URL.revokeObjectURL(target.previewUrl);
      set((state) => ({
        uploads: state.uploads.filter((upload) => upload.fileId !== fileId),
      }));
    },

    clearAll() {
      for (const upload of get().uploads) {
        safeAbort({ upload: upload.tusUpload, shouldTerminate: false });
        URL.revokeObjectURL(upload.previewUrl);
      }

      set({ uploads: [], manuallyPaused: false });
    },

    pauseAll() {
      suspendActive();
      set({ manuallyPaused: true });
    },

    resumeAll() {
      // Flip the flag first so canRun() sees it before resumeRunnable.
      set({ manuallyPaused: false });
      resumeRunnable();
    },

    setSortOrders(entries) {
      const bySortOrder = new Map(entries.map((entry) => [entry.fileId, entry.sortOrder]));

      set((state) => ({
        uploads: state.uploads.map((upload) => {
          const sortOrder = bySortOrder.get(upload.fileId);

          return sortOrder === undefined || sortOrder === upload.sortOrder
            ? upload
            : { ...upload, sortOrder };
        }),
      }));
    },

    setToastPhase(phase) {
      set({ toastPhase: phase });
    },

    setToastBatchIds(ids) {
      set({ toastBatchIds: ids });
    },

    addToastBatchId(fileId) {
      set((state) =>
        state.toastBatchIds.includes(fileId)
          ? state
          : { toastBatchIds: [...state.toastBatchIds, fileId] },
      );
    },

    resetToast() {
      set({ toastPhase: 'idle', toastBatchIds: [] });
    },

    setCancelUploadHandler(handler) {
      cancelHandler = handler;
    },

    cancelUpload(fileId) {
      set((state) => ({
        toastBatchIds: state.toastBatchIds.filter((id) => id !== fileId),
      }));

      if (cancelHandler) {
        cancelHandler(fileId);
        return;
      }

      // Fallback if the space surface unmounted — still abort the tus transfer.
      get().remove(fileId);
    },
  };
});
