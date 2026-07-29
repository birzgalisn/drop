// @ts-check

import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { rspack } from '@rspack/core';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @typedef {import('@rspack/cli').Configuration} Configuration */

export class RspackConfig {
  static dirname = __dirname;

  static rootDir = resolve(__dirname, '../..');

  static isDev = process.env.NODE_ENV === 'development';

  /** @returns {string} */
  static getOutputPath() {
    return resolve(RspackConfig.dirname, 'dist');
  }

  /** @returns {Configuration['resolve']} */
  static getResolve() {
    return {
      extensions: ['...', '.ts', '.tsx', '.jsx'],
      conditionNames: ['@repo', 'development', 'import', 'require', 'default'],
      modules: ['node_modules', resolve(RspackConfig.rootDir, 'node_modules')],
    };
  }

  /** @returns {Configuration['module']} */
  static getModule() {
    return {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules\/(?!@repo\/)/,
          use: {
            loader: 'builtin:swc-loader',
            options: {
              detectSyntax: 'auto',
              jsc: {
                parser: {
                  syntax: 'typescript',
                  decorators: true,
                },
                transform: {
                  legacyDecorator: true,
                  decoratorMetadata: true,
                },
              },
            },
          },
        },
        {
          test: /\.node$/,
          type: 'asset/resource',
        },
      ],
    };
  }

  /** @returns {Configuration['optimization']} */
  static getOptimization() {
    return {
      minimizer: [
        new rspack.SwcJsMinimizerRspackPlugin({
          minimizerOptions: {
            compress: {
              keep_classnames: true,
              keep_fnames: true,
            },
            mangle: {
              keep_classnames: true,
              keep_fnames: true,
            },
          },
        }),
      ],
    };
  }

  /**
   * Bundle only app + `@repo/*` sources. Everything else (esp. `pg` under pnpm) must stay
   * external — bundling `pg` breaks EventEmitter/`stream.on` at runtime.
   *
   * @param {{ allowHmrPoll?: boolean }} [options]
   * @returns {Configuration['externals']}
   */
  static getExternals({ allowHmrPoll = false } = {}) {
    /** @type {import('@rspack/core').ExternalItem} */
    const packageExternal = ({ request }, callback) => {
      if (!request) {
        callback();
        return;
      }

      if (allowHmrPoll && /@rspack\/core\/hot\/poll/.test(request)) {
        callback();
        return;
      }

      // Relative imports — keep bundling.
      if (request.startsWith('.')) {
        callback();
        return;
      }

      // Absolute path into node_modules (common with pnpm) — externalize by package name.
      const fromNodeModules = request.match(
        /node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?((?:@[^/]+\/)?[^/]+)/,
      );

      if (fromNodeModules) {
        const pkg = fromNodeModules[1];

        if (pkg.startsWith('@repo/')) {
          callback();
          return;
        }

        callback(undefined, `commonjs ${pkg}`);
        return;
      }

      // Absolute workspace/source paths — keep bundling (SWC compiles `@repo` TS).
      if (isAbsolute(request)) {
        callback();
        return;
      }

      // Bare package specifier — bundle only workspace packages.
      if (request.startsWith('@repo/')) {
        callback();
        return;
      }

      callback(undefined, `commonjs ${request}`);
    };

    return [packageExternal];
  }

  /**
   * Optional `pg-native` is expected to be missing.
   *
   * @returns {Configuration['ignoreWarnings']}
   */
  static getIgnoreWarnings() {
    return [/Can't resolve 'pg-native'/];
  }

  /**
   * @returns {NonNullable<Configuration['module']>['parser']}
   */
  static getParser() {
    return {
      javascript: {
        exportsPresence: 'warn',
      },
    };
  }
}
