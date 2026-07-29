import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaces, SpaceStatus } from '../../drizzle';
import type { SpaceRow } from './create-space.use-case';

@Injectable()
export class MarkSpaceSharedUseCase implements UseCase<string, SpaceRow | undefined> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(spaceId: string, db?: DrizzleClient): Promise<SpaceRow | undefined> {
    const client = this.drizzle.client(db);
    const [row] = await client
      .update(spaces)
      .set({ status: SpaceStatus.SHARED, updatedAt: new Date() })
      .where(eq(spaces.id, spaceId))
      .returning();

    return row;
  }
}
