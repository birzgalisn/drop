import { Injectable } from '@nestjs/common';

import type { UseCase } from '../../common';
import { type DrizzleClient, DrizzleService } from '../../drizzle';
import type { Space } from '../models/space.model';
import type { SpaceRow } from './create-space.use-case';
import { FindShareBySpaceIdUseCase } from './find-share-by-space-id.use-case';
import { FindSpaceByIdUseCase } from './find-space-by-id.use-case';
import { ListSpaceFilesUseCase } from './list-space-files.use-case';

export interface LoadAuthoredSpaceInput {
  space: SpaceRow;
}

@Injectable()
export class LoadAuthoredSpaceUseCase implements UseCase<LoadAuthoredSpaceInput, Space> {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly findSpaceById: FindSpaceByIdUseCase,
    private readonly listFiles: ListSpaceFilesUseCase,
    private readonly findShareBySpaceId: FindShareBySpaceIdUseCase,
  ) {}

  async execute(input: LoadAuthoredSpaceInput, db?: DrizzleClient): Promise<Space> {
    const client = this.drizzle.client(db);
    const [files, share] = await Promise.all([
      this.listFiles.execute({ spaceId: input.space.id }, client),
      this.findShareBySpaceId.execute(input.space.id, client),
    ]);

    return Object.assign(input.space, {
      files,
      share: share ?? null,
    });
  }

  async forSpaceId(spaceId: string, db?: DrizzleClient): Promise<Space | null> {
    const space = await this.findSpaceById.execute(spaceId, db);

    if (!space) {
      return null;
    }

    return this.execute({ space }, db);
  }
}
