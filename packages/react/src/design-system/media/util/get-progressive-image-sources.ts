export function getProgressiveImageSources({
  src,
  preview,
}: {
  src: string | null;
  preview?: string | null;
}): { baseSrc: string | null; fullSrc: string | null } {
  const previewSrc = preview && preview !== src ? preview : null;

  return {
    baseSrc: previewSrc ?? src,
    fullSrc: src && previewSrc ? src : null,
  };
}
