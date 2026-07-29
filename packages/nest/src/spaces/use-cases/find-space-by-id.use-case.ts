import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaces } from '../../drizzle';
import type { SpaceRow } from './create-space.use-case';

@Injectable()
export class FindSpaceByIdUseCase implements UseCase<string, SpaceRow | undefined> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(id: string, db?: DrizzleClient): Promise<SpaceRow | undefined> {
    const client = this.drizzle.client(db);
    const [row] = await client.select().from(spaces).where(eq(spaces.id, id)).limit(1);

    return row;
  }
}
