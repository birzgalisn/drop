import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, shares } from '../../drizzle';
import type { ShareRow } from './insert-share.use-case';

@Injectable()
export class FindShareByTokenUseCase implements UseCase<string, ShareRow | undefined> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(token: string, db?: DrizzleClient): Promise<ShareRow | undefined> {
    const client = this.drizzle.client(db);
    const [row] = await client.select().from(shares).where(eq(shares.token, token)).limit(1);

    return row;
  }
}
