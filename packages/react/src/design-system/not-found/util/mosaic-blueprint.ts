const DIGIT_ROWS = 7;
/** Empty blueprint columns between digits — equal on both sides. */
const GAP_COLS = 2;

/**
 * Shared cell size on one mosaic grid. Digit widths differ (4 vs 5) so
 * ink-to-ink gaps stay even — a trailing empty col on “4” widened the first gap.
 */
const FOUR: ReadonlyArray<ReadonlyArray<0 | 1>> = [
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [1, 1, 1, 1],
  [0, 0, 0, 1],
  [0, 0, 0, 1],
  [0, 0, 0, 1],
];

const ZERO: ReadonlyArray<ReadonlyArray<0 | 1>> = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [0, 1, 1, 1, 0],
];

const DIGITS = [FOUR, ZERO, FOUR] as const;

export type MosaicCell = {
  row: number;
  col: number;
  index: number;
};

/** Flatten 404 bitmaps onto one shared grid, with equal gap columns between digits. */
function getMosaicCells(digits: ReadonlyArray<ReadonlyArray<ReadonlyArray<0 | 1>>>): {
  cols: number;
  rows: number;
  cells: MosaicCell[];
} {
  const cells: MosaicCell[] = [];
  let index = 0;
  let colOffset = 0;

  for (let digitIndex = 0; digitIndex < digits.length; digitIndex += 1) {
    const pattern = digits[digitIndex]!;
    const digitCols = pattern[0]!.length;

    for (let row = 0; row < DIGIT_ROWS; row += 1) {
      const rowBits = pattern[row]!;
      for (let col = 0; col < digitCols; col += 1) {
        if (!rowBits[col]) {
          continue;
        }
        cells.push({ row: row + 1, col: colOffset + col + 1, index });
        index += 1;
      }
    }

    colOffset += digitCols + (digitIndex < DIGITS.length - 1 ? GAP_COLS : 0);
  }

  return { cols: colOffset, rows: DIGIT_ROWS, cells };
}

export const MOSAIC = getMosaicCells(DIGITS);
