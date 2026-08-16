import { createContext, useContext } from 'react';

export const DropzoneOpenContext = createContext<(() => void) | null>(null);

export function useDropzoneOpen() {
  const open = useContext(DropzoneOpenContext);
  if (!open) {
    throw new Error('`useDropzoneOpen` must be used within `Dropzone`');
  }
  return open;
}
