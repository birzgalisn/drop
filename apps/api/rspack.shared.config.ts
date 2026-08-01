import { isAbsolute, resolve } from 'node:path';

import type { Configuration } from '@rspack/cli';
import { rspack, type ExternalItem } from '@rspack/core';

const __dirname = import.meta.dirname;

export class RspackConfig {
  static dirname = __dirname;

  static rootDir = resolve(__dirname, '../..');

  static isDev = process.env.NODE_ENV === 'development';

  static getOutputPath(): string {
    return resolve(RspackConfig.dirname, 'dist');
  }

  static getResolve(): Configuration['resolve'] {
    return {
      extensions: ['...', '.ts', '.tsx'],
      conditionNames: ['@repo', 'development', 'import', 'require', 'default'],
      modules: ['node_modules', resolve(RspackConfig.rootDir, 'node_modules')],
    };
  }

  static getModule(): Configuration['module'] {
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

  static getOptimization(): Configuration['optimization'] {
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
   */
  static getExternals({
    allowHmrPoll = false,
  }: { allowHmrPoll?: boolean } = {}): Configuration['externals'] {
    const packageExternal: ExternalItem = ({ request }, callback) => {
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
      const [, pkg] =
        request.match(/node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?((?:@[^/]+\/)?[^/]+)/) ?? [];

      if (pkg) {
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

  /** Optional `pg-native` is expected to be missing. */
  static getIgnoreWarnings(): Configuration['ignoreWarnings'] {
    return [/Can't resolve 'pg-native'/];
  }

  static getParser(): NonNullable<Configuration['module']>['parser'] {
    return {
      javascript: {
        exportsPresence: 'warn',
      },
    };
  }
}
