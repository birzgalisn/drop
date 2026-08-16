import { renderSVG } from 'uqr';

export function getQrSvgDataUrl(data: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderSVG(data, { border: 2 }))}`;
}
