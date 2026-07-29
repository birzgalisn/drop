import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, shares } from '../../drizzle';
import type { ShareRow } from './insert-share.use-case';

@Injectable()
export class FindShareBySpaceIdUseCase implements UseCase<string, ShareRow | undefined> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(spaceId: string, db?: DrizzleClient): Promise<ShareRow | undefined> {
    const client = this.drizzle.client(db);
    const [row] = await client.select().from(shares).where(eq(shares.spaceId, spaceId)).limit(1);

    return row;
  }
}
