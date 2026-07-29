import { Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService, spaceFiles } from '../../drizzle';
import type { SpaceFileRow } from './insert-space-files.use-case';

export interface FindSpaceFileByIdInput {
  fileId: string;
  spaceId?: string;
}

@Injectable()
export class FindSpaceFileByIdUseCase implements UseCase<
  FindSpaceFileByIdInput,
  SpaceFileRow | undefined
> {
  constructor(private readonly drizzle: DrizzleService) {}

  async execute(
    input: FindSpaceFileByIdInput,
    db?: DrizzleClient,
  ): Promise<SpaceFileRow | undefined> {
    const client = this.drizzle.client(db);
    const idMatch = eq(spaceFiles.id, input.fileId);
    const where = input.spaceId ? and(idMatch, eq(spaceFiles.spaceId, input.spaceId)) : idMatch;

    const [row] = await client.select().from(spaceFiles).where(where).limit(1);

    return row;
  }
}
