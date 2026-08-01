import { defineConfig } from '@rspack/cli';

import { RspackConfig } from './rspack.shared.config';

/** One-off bundle for `generate:schema` — not part of the production API build. */
export default defineConfig({
  context: RspackConfig.dirname,
  target: 'node',
  mode: 'production',
  entry: {
    'write-graphql-schema': './src/write-graphql-schema.ts',
  },
  output: {
    path: RspackConfig.getOutputPath(),
    filename: '[name].js',
    clean: false,
  },
  resolve: RspackConfig.getResolve(),
  module: {
    ...RspackConfig.getModule(),
    parser: RspackConfig.getParser(),
  },
  optimization: RspackConfig.getOptimization(),
  externalsType: 'commonjs',
  externals: RspackConfig.getExternals(),
  ignoreWarnings: RspackConfig.getIgnoreWarnings(),
  devtool: false,
});
