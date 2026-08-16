import { MediaPlaceholder } from '../ui/media-placeholder';
import { ProgressiveImageBaseLayer } from '../ui/progressive-image-base-layer';
import { ProgressiveImageFrame } from '../ui/progressive-image-frame';
import { ProgressiveImageHiResLayer } from '../ui/progressive-image-hi-res-layer';
import { getProgressiveImageSources } from '../util/get-progressive-image-sources';

export type ProgressiveImageProps = {
  src: string | null;
  preview?: string | null;
  alt: string;
  fit?: 'cover' | 'contain';
  onPreviewError?: () => void;
};

export function ProgressiveImage({
  src,
  preview,
  alt,
  fit = 'cover',
  onPreviewError,
}: ProgressiveImageProps) {
  const { baseSrc, fullSrc } = getProgressiveImageSources({ src, preview });

  if (!baseSrc) {
    return <MediaPlaceholder w="100%" h="100%" aria-hidden />;
  }

  return (
    <ProgressiveImageFrame>
      <ProgressiveImageBaseLayer
        key={baseSrc}
        src={baseSrc}
        alt={alt}
        fit={fit}
        aria-hidden={fullSrc != null}
        onError={onPreviewError}
      />
      {fullSrc ? (
        <ProgressiveImageHiResLayer key={fullSrc} src={fullSrc} alt={alt} fit={fit} />
      ) : null}
    </ProgressiveImageFrame>
  );
}
