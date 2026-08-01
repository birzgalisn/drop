import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  format: 'cjs',
  fixedExtension: false,
  platform: 'node',
  tsconfig: './tsconfig.json',
  entry: ['./src/index.ts'],
  unbundle: true,
  exports: false,
});
