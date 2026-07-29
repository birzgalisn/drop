import type { RegisterAsyncOptions } from '../../common';
import type { TusOptions } from './tus.interface';

export type TusRegisterAsyncOptions<Args extends readonly unknown[] = readonly unknown[]> =
  RegisterAsyncOptions<Args, TusOptions>;
