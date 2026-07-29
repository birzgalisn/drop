import { DynamicModule, Module, type Provider } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { TusHook } from './hooks/tus.hook';
import type { TusRegisterAsyncOptions } from './interfaces/tus-register-async-options.interface';
import type { TusOptions } from './interfaces/tus.interface';
import { TusHandlerRegistry } from './registry/tus-handler.registry';
import { TUS_OPTIONS } from './tokens/tus.tokens';

@Module({})
export class TusModule {
  static registerAsync<TArgs extends readonly unknown[]>(
    asyncOptions: TusRegisterAsyncOptions<TArgs>,
  ): DynamicModule {
    return {
      module: TusModule,
      global: true,
      imports: asyncOptions.imports ?? [],
      providers: [
        ...(asyncOptions.providers ?? []),
        TusHandlerRegistry,
        {
          provide: TUS_OPTIONS,
          inject: asyncOptions.inject ? [...asyncOptions.inject] : [],
          useFactory: asyncOptions.useFactory,
        },
        TusModule.tusHookProvider(),
      ],
      exports: [TusHook, TusHandlerRegistry],
    };
  }

  private static tusHookProvider(): Provider {
    return {
      provide: TusHook,
      useFactory: (
        opts: TusOptions,
        httpAdapterHost: HttpAdapterHost,
        registry: TusHandlerRegistry,
      ) => new TusHook(httpAdapterHost, registry, opts),
      inject: [TUS_OPTIONS, HttpAdapterHost, TusHandlerRegistry],
    };
  }
}
