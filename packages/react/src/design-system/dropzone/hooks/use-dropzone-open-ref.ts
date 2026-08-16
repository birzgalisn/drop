import { useRef } from 'react';

export function useDropzoneOpenRef() {
  const openRef = useRef<() => void>(null);

  const open = () => {
    openRef.current?.();
  };

  return { openRef, open } as const;
}
