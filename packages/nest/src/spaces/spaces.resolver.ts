import { Args, Context, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import {
  addSpaceFilesInputSchema,
  createShareInputSchema,
  reorderSpaceFilesInputSchema,
  unlockShareInputSchema,
} from '@repo/shared';

import { ZodValidationPipe } from '../validation';
import { AddSpaceFilesInput } from './dto/add-space-files.input';
import { CreateShareInput } from './dto/create-share.input';
import { ReorderSpaceFilesInput } from './dto/reorder-space-files.input';
import { UnlockShareInput } from './dto/unlock-share.input';
import { AddSpaceFilesResult } from './models/add-space-files-result.model';
import { Share } from './models/share.model';
import { Space } from './models/space.model';
import { UnlockShareResult } from './models/unlock-share-result.model';
import { AuthoredSpace } from './pipes/authored-space.decorator';
import { SpaceAuthorPipe } from './pipes/space-author.pipe';
import { SpaceContext, type SpaceGraphqlContext } from './services/space-context.service';
import { SpaceEventsService, type SpaceUpdatedPayload } from './services/space-events.service';
import { type SpaceRow } from './use-cases';
import {
  AddSpaceFilesWorkflow,
  CreateShareWorkflow,
  CreateSpaceWorkflow,
  GetSharedSpaceWorkflow,
  GetSpaceWorkflow,
  RemoveSpaceFileWorkflow,
  ReorderSpaceFilesWorkflow,
  UnlockShareWorkflow,
} from './workflows';

@Resolver()
export class SpacesResolver {
  constructor(
    private readonly createSpaceWorkflow: CreateSpaceWorkflow,
    private readonly addSpaceFilesWorkflow: AddSpaceFilesWorkflow,
    private readonly removeSpaceFileWorkflow: RemoveSpaceFileWorkflow,
    private readonly reorderSpaceFilesWorkflow: ReorderSpaceFilesWorkflow,
    private readonly createShareWorkflow: CreateShareWorkflow,
    private readonly getSpaceWorkflow: GetSpaceWorkflow,
    private readonly unlockShareWorkflow: UnlockShareWorkflow,
    private readonly getSharedSpaceWorkflow: GetSharedSpaceWorkflow,
    private readonly spaceEvents: SpaceEventsService,
    private readonly spaceContext: SpaceContext,
  ) {}

  @Mutation(() => Space, {
    description: 'Creates an empty draft space and binds the author cookie.',
  })
  async createSpace(@Context() ctx: SpaceGraphqlContext): Promise<Space> {
    const { space, authorKey } = await this.createSpaceWorkflow.execute();
    this.spaceContext.setAuthorCookie(ctx, authorKey);

    return space;
  }

  @Mutation(() => AddSpaceFilesResult)
  async addSpaceFiles(
    @Args('input', new ZodValidationPipe(addSpaceFilesInputSchema)) input: AddSpaceFilesInput,
    @Context() ctx: SpaceGraphqlContext,
  ): Promise<AddSpaceFilesResult> {
    const { result, createdAuthorKey } = await this.addSpaceFilesWorkflow.execute({
      spaceId: input.spaceId,
      files: input.files,
      authorKey: this.spaceContext.readAuthorKey(ctx),
    });

    if (createdAuthorKey) {
      this.spaceContext.setAuthorCookie(ctx, createdAuthorKey);
    }

    return result;
  }

  @Mutation(() => Space)
  async removeSpaceFile(
    @Args('spaceId', { type: () => ID }) _spaceId: string,
    @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow,
    @Args('fileId', { type: () => ID }) fileId: string,
  ): Promise<Space> {
    return this.removeSpaceFileWorkflow.execute({
      spaceId: space.id,
      fileIds: [fileId],
    });
  }

  @Mutation(() => Space, {
    description: 'Author-only. Soft-removes one or more files in a single transaction.',
  })
  async removeSpaceFiles(
    @Args('spaceId', { type: () => ID }) _spaceId: string,
    @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow,
    @Args('fileIds', { type: () => [ID] }) fileIds: string[],
  ): Promise<Space> {
    return this.removeSpaceFileWorkflow.execute({
      spaceId: space.id,
      fileIds,
    });
  }

  @Mutation(() => Space, {
    description: 'Author-only. Sets sortOrder for each file (absolute indices in the author list).',
  })
  async reorderSpaceFiles(
    @Args('input', new ZodValidationPipe(reorderSpaceFilesInputSchema))
    input: ReorderSpaceFilesInput,
    @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow,
  ): Promise<Space> {
    return this.reorderSpaceFilesWorkflow.execute({
      spaceId: space.id,
      files: input.files,
    });
  }

  @Query(() => Space, {
    nullable: true,
    description: 'The author sees their draft with files; others see public metadata only.',
  })
  async space(
    @Args('id', { type: () => ID }) id: string,
    @Context() ctx: SpaceGraphqlContext,
  ): Promise<Space | null> {
    return this.getSpaceWorkflow.execute({
      spaceId: id,
      authorKey: this.spaceContext.readAuthorKey(ctx),
    });
  }

  @Mutation(() => Share)
  async createShare(
    @Args('input', new ZodValidationPipe(createShareInputSchema)) input: CreateShareInput,
    @AuthoredSpace(SpaceAuthorPipe) space: SpaceRow,
  ): Promise<Share> {
    return this.createShareWorkflow.execute({
      spaceId: space.id,
      expiryDays: input.expiryDays,
      pin: input.pin,
    });
  }

  @Mutation(() => UnlockShareResult, {
    description: 'Verifies the PIN and sets the share session cookie. Returns no file list.',
  })
  async unlockShare(
    @Args('input', new ZodValidationPipe(unlockShareInputSchema)) input: UnlockShareInput,
    @Context() ctx: SpaceGraphqlContext,
  ): Promise<UnlockShareResult> {
    const result = await this.unlockShareWorkflow.execute(input);
    this.spaceContext.setShareSessionCookie(ctx, input.token);

    return result;
  }

  @Query(() => Space, {
    nullable: true,
    description: 'Requires the share session cookie set by unlockShare; returns ready files.',
  })
  async sharedSpace(
    @Args('token') token: string,
    @Context() ctx: SpaceGraphqlContext,
  ): Promise<Space> {
    return this.getSharedSpaceWorkflow.execute({
      token,
      shareSession: this.spaceContext.readShareSession(ctx),
    });
  }

  @Subscription(() => Space, {
    resolve: (payload: SpaceUpdatedPayload) => payload.spaceUpdated,
  })
  spaceUpdated(@Args('spaceId', { type: () => ID }) spaceId: string) {
    return this.spaceEvents.subscribeToSpace(spaceId);
  }
}
