import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql';

import { SpaceFileStatus } from '../enums/space-file-status.enum';

/**
 * GraphQL view of a `space_file` row. Return the Drizzle row as the parent;
 * `storageKey` stays undecorated (downloads use REST). `thumbKey` / `previewKey`
 * are set when the thumbnail worker finishes.
 */
@ObjectType()
export class SpaceFile {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  spaceId!: string;

  @Field()
  originalName!: string;

  @Field()
  mimeType!: string;

  @Field(() => Int)
  byteSize!: number;

  @Field(() => Int)
  sortOrder!: number;

  @Field(() => SpaceFileStatus)
  status!: SpaceFileStatus;

  /** Internal — used by download routes; not in the schema. */
  storageKey?: string | null;

  @Field(() => String, { nullable: true })
  thumbKey?: string | null;

  @Field(() => String, { nullable: true })
  previewKey?: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
