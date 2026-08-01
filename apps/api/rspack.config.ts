import { defineConfig } from '@rspack/cli';
import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin';

import { RspackConfig } from './rspack.shared.config';

export default defineConfig({
  context: RspackConfig.dirname,
  target: 'node',
  mode: RspackConfig.isDev ? 'development' : 'production',
  entry: RspackConfig.isDev
    ? { main: ['@rspack/core/hot/poll?100', './src/main.ts'] }
    : { main: './src/main.ts' },
  output: {
    path: RspackConfig.getOutputPath(),
    filename: '[name].js',
    clean: !RspackConfig.isDev,
  },
  resolve: RspackConfig.getResolve(),
  module: {
    ...RspackConfig.getModule(),
    parser: RspackConfig.getParser(),
  },
  optimization: RspackConfig.getOptimization(),
  externalsType: 'commonjs',
  externals: RspackConfig.getExternals({ allowHmrPoll: true }),
  ignoreWarnings: RspackConfig.getIgnoreWarnings(),
  plugins: RspackConfig.isDev
    ? [new RunScriptWebpackPlugin({ name: 'main.js', autoRestart: false })]
    : [],
  devtool: RspackConfig.isDev ? 'source-map' : false,
  // Nest `autoSchemaFile` rewrites `src/_generated/schema.graphql` on boot. If
  // rspack watches that path, HMR restarts race the still-bound :3000 listen.
  watchOptions: RspackConfig.isDev ? { ignored: /[\\/]src[\\/]_generated[\\/]/ } : undefined,
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
  },
});
