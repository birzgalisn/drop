import { Injectable } from '@nestjs/common';
import { AppError } from '@repo/shared';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, shares } from '../../drizzle';

export interface InsertShareInput {
  spaceId: string;
  token: string;
  pinHash: string;
  expiresAt: Date;
}

export type ShareRow = typeof shares.$inferSelect;

@Injectable()
export class InsertShareUseCase implements UseCase<InsertShareInput, ShareRow> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: InsertShareInput, db?: DrizzleClient): Promise<ShareRow> {
    const client = this.drizzle.client(db);
    const [row] = await client
      .insert(shares)
      .values({
        spaceId: input.spaceId,
        token: input.token,
        pinHash: input.pinHash,
        expiresAt: input.expiresAt,
      })
      .returning();

    if (!row) {
      throw AppError.internal('Failed to create share');
    }

    return row;
  }
}
