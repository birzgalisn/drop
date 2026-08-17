import { useSpaceUploadStore } from './upload-space-files-tus';

/** Clear in-flight / staged uploads — call when leaving for a fresh Drop. */
export function clearSpaceUploads(): void {
  useSpaceUploadStore.getState().clearAll();
}
