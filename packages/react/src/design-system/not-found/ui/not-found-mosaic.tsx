import { Box } from '@mantine/core';
import clsx from 'clsx';
import type { CSSProperties, ReactNode } from 'react';

import { MOSAIC } from '../util/mosaic-blueprint';

import classes from './not-found-mosaic.module.css';

/** Favicon sand papers — cream in front, deeper tan behind. */
const FILE_TONES = [
  { face: '#f7f2ea', fold: '#d4c4ae', edge: '#b39674' },
  { face: '#ece4d7', fold: '#c0a88a', edge: '#8f7154' },
  { face: '#dccfbc', fold: '#b39674', edge: '#765c45' },
  { face: '#cbb89d', fold: '#8f7154', edge: '#5c4837' },
  { face: '#f0e8dc', fold: '#c0a88a', edge: '#a68765' },
  { face: '#b9a486', fold: '#765c45', edge: '#3f3126' },
] as const;

type StackLayer = {
  scale: number;
  lx: number;
  ly: number;
  rot: number;
};

/** Back → front: larger behind, smaller in front. */
const STACK_LAYERS: ReadonlyArray<StackLayer> = [
  { scale: 1.38, lx: -7, ly: -5, rot: -16 },
  { scale: 1.08, lx: 4, ly: -1, rot: 9 },
  { scale: 0.72, lx: 1, ly: 4, rot: -5 },
];

const STRAY_LAYERS: ReadonlyArray<StackLayer> = [
  { scale: 1.28, lx: -6, ly: -4, rot: -14 },
  { scale: 0.78, lx: 3, ly: 3, rot: 8 },
];

/** Side / top strays only — never under the copy + CTA. */
const STRAYS = [
  { top: '4%', left: '2%', tone: 3 },
  { top: '8%', left: '86%', tone: 0 },
  { top: '42%', left: '-3%', tone: 5 },
  { top: '38%', left: '94%', tone: 2 },
  { top: '-2%', left: '46%', tone: 1 },
  { top: '18%', left: '90%', tone: 4 },
] as const;

function scatterStyle(options: { index: number; tame?: boolean }): CSSProperties {
  const { index, tame = false } = options;
  const restSpan = tame ? 44 : 76;
  const restRot = ((index * 41) % restSpan) - restSpan / 2;
  const jitterX = ((index * 19) % (tame ? 11 : 17)) - (tame ? 5 : 8);
  const jitterY = ((index * 23) % (tame ? 9 : 13)) - (tame ? 3 : 5);
  const stackScale = tame ? 0.96 + ((index * 11) % 5) * 0.02 : 0.9 + ((index * 13) % 7) * 0.03;

  return {
    '--z': String((index % 7) + 1),
    '--jx': `${jitterX}px`,
    '--jy': `${jitterY}px`,
    '--rest-rot': `${restRot}deg`,
    '--stack-scale': String(stackScale),
  } as CSSProperties;
}

function layerStyle(options: {
  cellIndex: number;
  depth: number;
  layer: StackLayer;
}): CSSProperties {
  const { cellIndex, depth, layer } = options;
  const flip = cellIndex % 2 === 0 ? 1 : -1;
  const drift = ((cellIndex * 7 + depth * 11) % 5) - 2;

  return {
    '--layer-z': String(depth + 1),
    '--layer-scale': String(layer.scale),
    '--lx': `${layer.lx * flip + drift}px`,
    '--ly': `${layer.ly + (depth === 0 ? -1 : 1)}px`,
    '--layer-rot': `${layer.rot * flip + drift}deg`,
  } as CSSProperties;
}

function FileCard({ toneIndex }: { toneIndex: number }) {
  const tone = FILE_TONES[toneIndex % FILE_TONES.length]!;

  return (
    <svg className={classes.glyph} viewBox="0 0 40 52" width="100%" height="100%" aria-hidden>
      <path
        fill={tone.face}
        stroke={tone.edge}
        strokeWidth="0.85"
        d="M5.5 2h18.2L35 13.5V46a4.5 4.5 0 0 1-4.5 4.5h-25A4.5 4.5 0 0 1 1 46V6.5A4.5 4.5 0 0 1 5.5 2Z"
      />
      <path fill={tone.fold} d="M23.7 2V11a2.6 2.6 0 0 0 2.6 2.6H35Z" />
      <path
        fill="none"
        stroke={tone.edge}
        strokeWidth="0.85"
        strokeLinejoin="round"
        d="M23.7 2V11a2.6 2.6 0 0 0 2.6 2.6H35"
      />
      <path
        stroke={tone.edge}
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.4"
        d="M10 22.5h17M10 28.5h13.5M10 34.5h15.5"
      />
    </svg>
  );
}

function FileStack({
  cellIndex,
  layers,
}: {
  cellIndex: number;
  layers: ReadonlyArray<StackLayer>;
}) {
  const frontTone = cellIndex % FILE_TONES.length;
  const layerCount = layers.length;
  const frontDepth = layerCount - 1;

  return (
    <Box component="span" className={classes.stack}>
      {layers.map((layer, depth) => {
        const isFront = depth === frontDepth;
        const toneIndex = (frontTone + (layerCount - 1 - depth) * 2) % FILE_TONES.length;
        return (
          <Box
            component="span"
            key={depth}
            className={clsx(classes.layer, isFront ? classes.layerFront : classes.layerBack)}
            style={layerStyle({ cellIndex, depth, layer })}
          >
            <FileCard toneIndex={toneIndex} />
          </Box>
        );
      })}
    </Box>
  );
}

/** Shared-grid 404 digits built from stacked file cards. */
export function NotFoundMosaic(): ReactNode {
  return (
    <Box
      className={classes.mosaic}
      style={{ '--cols': MOSAIC.cols, '--rows': MOSAIC.rows } as CSSProperties}
    >
      {MOSAIC.cells.map((cell) => (
        <Box
          component="span"
          key={`${cell.row}-${cell.col}`}
          className={classes.cell}
          style={{
            gridColumn: cell.col,
            gridRow: cell.row,
            ...scatterStyle({ index: cell.index, tame: true }),
          }}
        >
          <FileStack cellIndex={cell.index} layers={STACK_LAYERS} />
        </Box>
      ))}
    </Box>
  );
}

/** Decorative piles around the mosaic — top / sides only. */
export function NotFoundStrays(): ReactNode {
  return STRAYS.map((stray, index) => {
    const fileIndex = MOSAIC.cells.length + index;
    return (
      <Box
        component="span"
        key={`${stray.top}-${stray.left}`}
        className={classes.stray}
        style={
          {
            '--top': stray.top,
            '--left': stray.left,
            ...scatterStyle({ index: fileIndex + 3 }),
          } as CSSProperties
        }
      >
        <FileStack cellIndex={stray.tone + fileIndex} layers={STRAY_LAYERS} />
      </Box>
    );
  });
}
