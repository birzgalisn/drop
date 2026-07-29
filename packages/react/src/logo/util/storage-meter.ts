/** Sand → amber → rose as reserve headroom shrinks. */
export function getMeterColors(pressure: number): { from: string; to: string } {
  if (pressure < 0.45) {
    return { from: '#8f7154', to: '#c0a88a' };
  }
  if (pressure < 0.75) {
    return { from: '#a65d32', to: '#d4a06a' };
  }
  return { from: '#9a3535', to: '#c4784a' };
}

/**
 * Map 0–1 fill onto the Syne-caps ink band inside the em box.
 * Raw % of the line box left low fills below the glyphs and high fills “full” early.
 */
export function getInkWaterline(fillRatio: number): number {
  const inkBottom = 0.14;
  const inkTop = 0.86;
  return inkBottom + fillRatio * (inkTop - inkBottom);
}
