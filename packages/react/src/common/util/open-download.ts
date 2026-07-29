/** Opens a download URL in the same window (cookie-authenticated downloads). */
export function openDownload(url: string): void {
  window.location.assign(url);
}
