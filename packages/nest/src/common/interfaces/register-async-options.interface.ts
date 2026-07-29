import type { DynamicModule, InjectionToken, Provider } from '@nestjs/common';

export interface RegisterAsyncOptions<
  Args extends readonly unknown[] = readonly unknown[],
  TResult = unknown,
> {
  imports?: DynamicModule['imports'];
  inject?: InjectionToken[];
  providers?: Provider[];
  useFactory: (...args: Args) => TResult | Promise<TResult>;
}
