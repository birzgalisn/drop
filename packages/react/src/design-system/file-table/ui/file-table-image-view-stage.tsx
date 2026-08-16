import { ProgressiveImage } from '../../media/feature/progressive-image';
import { useImageViewContext } from './image-view-context';

export function FileTableImageViewStage() {
  const { active } = useImageViewContext();

  if (!active) {
    return null;
  }

  const previewSrc = active.previewSrc ?? null;

  return (
    <ProgressiveImage
      key={active.id}
      src={active.src}
      preview={previewSrc}
      alt={active.name}
      fit="contain"
    />
  );
}
