import {
  Context,
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { SpaceStatus } from '../enums/space-status.enum';
import { SpaceContext, type SpaceGraphqlContext } from '../util/space-context.util';
import { Share } from './share.model';
import { SpaceFile } from './space-file.model';

/**
 * GraphQL view of a `space` row. Return the Drizzle row as the parent;
 * `authorKey` stays undecorated. `isAuthor` is resolved from the author cookie.
 * `files` is only populated for callers allowed to see them; `share` is author-only.
 */
@ObjectType()
export class Space {
  @Field(() => ID)
  id!: string;

  @Field(() => SpaceStatus)
  status!: SpaceStatus;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => [SpaceFile], { nullable: true })
  files?: SpaceFile[];

  @Field(() => Share, { nullable: true })
  share?: Share | null;

  /** Derived via {@link SpaceResolver.isAuthor} (`@ResolveField` only). */
  isAuthor?: boolean;

  /** Internal — compared to the author cookie; not in the schema. */
  authorKey!: string;
}

@Resolver(Space)
export class SpaceResolver {
  @ResolveField(() => Boolean, {
    description: 'True when the caller holds the author cookie for this space.',
  })
  isAuthor(@Parent() space: Space, @Context() ctx: SpaceGraphqlContext): boolean {
    return SpaceContext.readAuthorKey(ctx) === space.authorKey;
  }
}
