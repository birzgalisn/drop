/** Run after the next paint so opacity transitions start from a committed frame. */
export function fadeInAfterPaint(onReady: () => void): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(onReady);
  });
}
