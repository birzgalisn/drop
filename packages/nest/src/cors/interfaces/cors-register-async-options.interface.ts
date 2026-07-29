import type { RegisterAsyncOptions } from '../../common';
import type { CorsOptions } from './cors.interface';

export type CorsRegisterAsyncOptions<Args extends readonly unknown[] = readonly unknown[]> =
  RegisterAsyncOptions<Args, CorsOptions>;
