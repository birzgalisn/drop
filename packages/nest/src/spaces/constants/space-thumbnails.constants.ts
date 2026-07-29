/** BullMQ queue + job ids for space-file thumb/preview generation. */
export class SpaceThumbnails {
  /** Queue that generates thumb/preview WebPs when upload completes. */
  static readonly QUEUE = 'space-thumbnails';

  /** Single job name on {@link SpaceThumbnails.QUEUE}. */
  static readonly JOB = 'generate-thumbnails';

  /**
   * One thumbnail job at a time — encodes are CPU-bound and share the global
   * sharp/libvips pool (configured at app bootstrap via SharpThreading).
   */
  static readonly WORKER_CONCURRENCY = 1;

  /** BullMQ custom ids cannot contain `:`. */
  static jobId(fileId: string): string {
    return `generate-thumbnails-${fileId}`;
  }
}
