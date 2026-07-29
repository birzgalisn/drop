import { Field, ObjectType } from '@nestjs/graphql';

import { SpaceFile } from './space-file.model';
import { Space } from './space.model';

/** Result of {@link AddSpaceFilesWorkflow}: the (possibly just-created) space and the files that were added. */
@ObjectType()
export class AddSpaceFilesResult {
  @Field(() => Space)
  space: Space;

  @Field(() => [SpaceFile])
  files: SpaceFile[];
}
