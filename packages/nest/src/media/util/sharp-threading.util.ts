import { availableParallelism } from 'node:os';

import sharp from 'sharp';

/**
 * Caps libvips at the host CPU count for the process. Call once from app
 * bootstrap so every domain that uses sharp shares one thread pool.
 */
export class SharpThreading {
  static configure(): void {
    sharp.cache(false);
    sharp.concurrency(availableParallelism());
  }
}
