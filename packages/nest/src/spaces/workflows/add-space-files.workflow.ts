import { Injectable } from '@nestjs/common';
import { AppError, SpaceBundle } from '@repo/shared';

import { type DrizzleClient, DrizzleService, SpaceStatus } from '../../drizzle';
import type { AddSpaceFilesResult } from '../models/add-space-files-result.model';
import { SpaceEventsService } from '../services/space-events.service';
import {
  CountActiveSpaceFilesUseCase,
  FindSpaceByIdUseCase,
  InsertSpaceFilesUseCase,
  LoadAuthoredSpaceUseCase,
  MaxSpaceFileSortOrderUseCase,
  type SpaceRow,
  SumSpaceFileBytesUseCase,
} from '../use-cases';
import { CreateSpaceWorkflow } from './create-space.workflow';

export interface AddSpaceFilesWorkflowInput {
  spaceId?: string;
  files: { originalName: string; mimeType: string; byteSize: number }[];
  /** Author cookie; required when adding to an existing space. */
  authorKey?: string;
}

export interface AddSpaceFilesWorkflowResult {
  result: AddSpaceFilesResult;
  /** Set only when a brand-new draft space was created, so the resolver sets the author cookie. */
  createdAuthorKey?: string;
}

@Injectable()
export class AddSpaceFilesWorkflow {
  constructor(
    private readonly drizzle: DrizzleService,
    private readonly createSpace: CreateSpaceWorkflow,
    private readonly findSpaceById: FindSpaceByIdUseCase,
    private readonly sumBytes: SumSpaceFileBytesUseCase,
    private readonly countFiles: CountActiveSpaceFilesUseCase,
    private readonly maxSortOrder: MaxSpaceFileSortOrderUseCase,
    private readonly insertFiles: InsertSpaceFilesUseCase,
    private readonly loadAuthoredSpace: LoadAuthoredSpaceUseCase,
    private readonly spaceEvents: SpaceEventsService,
  ) {}

  async execute(input: AddSpaceFilesWorkflowInput): Promise<AddSpaceFilesWorkflowResult> {
    const { presented, inserted, createdAuthorKey } = await this.drizzle.db.transaction(
      async (tx) => {
        const target = await this.resolveTarget({ input, tx });

        SpaceBundle.assertFits({
          existingBytes: target.existingBytes,
          existingCount: target.existingCount,
          incoming: input.files,
        });

        const insertedRows = await this.insertFiles.execute(
          {
            spaceId: target.space.id,
            files: input.files.map((file, index) => ({
              originalName: file.originalName,
              mimeType: file.mimeType,
              byteSize: file.byteSize,
              sortOrder: target.nextSortOrder + index,
            })),
          },
          tx,
        );

        return {
          presented: await this.loadAuthoredSpace.execute({ space: target.space }, tx),
          inserted: insertedRows,
          createdAuthorKey: target.createdAuthorKey,
        };
      },
    );

    await this.spaceEvents.broadcastSpaceUpdated(presented);

    return {
      result: { space: presented, files: inserted },
      createdAuthorKey,
    };
  }

  private async resolveTarget(options: {
    input: AddSpaceFilesWorkflowInput;
    tx: DrizzleClient;
  }): Promise<{
    space: SpaceRow;
    createdAuthorKey?: string;
    existingBytes: number;
    existingCount: number;
    nextSortOrder: number;
  }> {
    const { input, tx } = options;

    if (!input.spaceId) {
      const { space, authorKey } = await this.createSpace.execute(undefined, tx);

      return {
        space,
        createdAuthorKey: authorKey,
        existingBytes: 0,
        existingCount: 0,
        nextSortOrder: 0,
      };
    }

    const space = await this.findSpaceById.execute(input.spaceId, tx);

    if (!space) {
      throw AppError.notFound('Space not found');
    }

    if (!input.authorKey || input.authorKey !== space.authorKey) {
      throw AppError.unauthorized('You are not the author of this space');
    }

    if (space.status !== SpaceStatus.DRAFT && space.status !== SpaceStatus.SHARED) {
      throw AppError.badRequest('Cannot add files to a space that is no longer editable');
    }

    const [existingBytes, existingCount, maxSortOrder] = await Promise.all([
      this.sumBytes.execute(space.id, tx),
      this.countFiles.execute(space.id, tx),
      this.maxSortOrder.execute(space.id, tx),
    ]);

    return {
      space,
      existingBytes,
      existingCount,
      nextSortOrder: maxSortOrder + 1,
    };
  }
}
