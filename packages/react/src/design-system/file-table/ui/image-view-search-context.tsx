import { createContext, useContext, type ReactNode } from 'react';

export type ImageViewSearchValue = {
  activeId: string | null;
  onActiveIdChange: (fileId: string | null) => void;
};

const ImageViewSearchContext = createContext<ImageViewSearchValue | null>(null);

export function useImageViewSearch() {
  const ctx = useContext(ImageViewSearchContext);
  if (!ctx) {
    throw new Error('`FileTable.ImageView.Search` must wrap the surface that opens the image view');
  }
  return ctx;
}

export function FileTableImageViewSearch({
  activeId,
  onActiveIdChange,
  children,
}: ImageViewSearchValue & { children?: ReactNode }) {
  const value = { activeId, onActiveIdChange };

  return (
    <ImageViewSearchContext.Provider value={value}>{children}</ImageViewSearchContext.Provider>
  );
}
