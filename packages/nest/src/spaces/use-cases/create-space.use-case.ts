import { Injectable } from '@nestjs/common';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaces, SpaceStatus } from '../../drizzle';

export interface CreateSpaceInput {
  authorKey: string;
  ownerUserId?: string | null;
}

export type SpaceRow = typeof spaces.$inferSelect;

@Injectable()
export class CreateSpaceUseCase implements UseCase<CreateSpaceInput, SpaceRow> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(input: CreateSpaceInput, db?: DrizzleClient): Promise<SpaceRow> {
    const client = this.drizzle.client(db);
    const [row] = await client
      .insert(spaces)
      .values({
        authorKey: input.authorKey,
        ownerUserId: input.ownerUserId ?? null,
        status: SpaceStatus.DRAFT,
      })
      .returning();

    return row;
  }
}
