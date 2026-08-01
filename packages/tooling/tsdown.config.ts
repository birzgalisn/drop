import { defineConfig } from 'tsdown';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  clean: true,
  dts: true,
  sourcemap: isDev,
  format: 'cjs',
  fixedExtension: false,
  platform: 'node',
  tsconfig: './tsconfig.json',
  entry: ['./jest/index.ts'],
  unbundle: true,
  exports: false,
  deps: {
    skipNodeModulesBundle: true,
    neverBundle: ['jest', /^@jest\//],
  },
});
