import { Field, Float, ObjectType } from '@nestjs/graphql';

/**
 * Host media-volume capacity from `statfs`. Byte fields are {@link Float}
 * because GraphQL `Int` is 32-bit and disk sizes exceed ~2 GiB.
 */
@ObjectType()
export class StorageCapacity {
  @Field(() => Float)
  totalBytes!: number;

  @Field(() => Float)
  usedBytes!: number;

  @Field(() => Float)
  availableBytes!: number;

  @Field(() => Float)
  reserveBytes!: number;

  @Field(() => Boolean, {
    description: 'False when free space is at or below the configured reserve.',
  })
  uploadAllowed!: boolean;
}
