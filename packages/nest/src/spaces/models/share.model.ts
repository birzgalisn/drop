import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL view of a `share` row. Return the Drizzle row as-is; `pinHash` stays
 * undecorated so it never enters the schema.
 */
@ObjectType()
export class Share {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  spaceId!: string;

  @Field()
  token!: string;

  @Field(() => GraphQLISODateTime)
  expiresAt!: Date;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  /** Internal — used by unlock paths; not in the schema. */
  pinHash!: string;
}
