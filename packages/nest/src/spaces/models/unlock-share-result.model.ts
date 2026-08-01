import { Field, ObjectType } from '@nestjs/graphql';

/**
 * Deliberately minimal: unlocking only confirms the PIN and sets the share
 * session cookie. No file list is returned here — clients must call
 * `sharedSpace` afterwards with the session cookie.
 */
@ObjectType()
export class UnlockShareResult {
  @Field()
  ok!: boolean;
}
