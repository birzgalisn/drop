import babel from '@rolldown/plugin-babel';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      generatedRouteTree: './src/route-tree.generated.ts',
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    sourcemap: isDev,
  },
  server: {
    host: true,
    port: 4000,
  },
  preview: {
    host: true,
    port: 4000,
  },
});
