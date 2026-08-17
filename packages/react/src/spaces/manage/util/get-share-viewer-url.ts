/** Absolute share-viewer URL (optional PIN hash for author preview / copy). */
export function getShareViewerUrl(options: { token: string; pin?: string }): string {
  const { token, pin } = options;
  const base = `${window.location.origin}/s/${token}`;

  return pin ? `${base}#pin=${encodeURIComponent(pin)}` : base;
}
