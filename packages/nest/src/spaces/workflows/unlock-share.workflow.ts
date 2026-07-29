import { Injectable } from '@nestjs/common';
import { AppError, AppErrorCode } from '@repo/shared';

import { FindShareByTokenUseCase } from '../use-cases';
import { PinHasher } from '../util/pin-hasher.util';

export interface UnlockShareWorkflowInput {
  token: string;
  pin: string;
}

export interface UnlockShareWorkflowResult {
  ok: true;
}

/**
 * Verifies the share exists, is unexpired, and the PIN matches. Callers bind
 * the share-session cookie after success (GraphQL context or HTTP reply).
 */
@Injectable()
export class UnlockShareWorkflow {
  constructor(private readonly findShareByToken: FindShareByTokenUseCase) {}

  async execute(input: UnlockShareWorkflowInput): Promise<UnlockShareWorkflowResult> {
    const share = await this.findShareByToken.execute(input.token);

    if (!share || share.expiresAt.getTime() <= Date.now()) {
      throw new AppError({
        code: AppErrorCode.UNAUTHORIZED,
        message: 'This share link is invalid or has expired',
        fieldErrors: [{ path: 'pin', message: 'This share link is invalid or has expired' }],
      });
    }

    const ok = await PinHasher.verify(input.pin, share.pinHash);

    if (!ok) {
      throw new AppError({
        code: AppErrorCode.UNAUTHORIZED,
        message: 'Incorrect PIN',
        fieldErrors: [{ path: 'pin', message: 'Incorrect PIN' }],
      });
    }

    return { ok: true };
  }
}
