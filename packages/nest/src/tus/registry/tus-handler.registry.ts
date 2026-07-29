import { Injectable } from '@nestjs/common';
import type { UploadType } from '@repo/shared';

import type { TusUploadHandler } from '../interfaces/tus-handler.interface';

/**
 * Maps each {@link UploadType} to the handler that owns it, so the single
 * `/files` tus endpoint can dispatch without any upload-type-specific code.
 * Feature modules inject this and call {@link register} once at startup.
 */
@Injectable()
export class TusHandlerRegistry {
  private readonly handlers = new Map<UploadType, TusUploadHandler>();

  register(uploadType: UploadType, handler: TusUploadHandler): void {
    this.handlers.set(uploadType, handler);
  }

  get(uploadType: UploadType): TusUploadHandler | undefined {
    return this.handlers.get(uploadType);
  }
}
