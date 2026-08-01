import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ReorderSpaceFileEntryInput {
  @Field(() => ID)
  fileId!: string;

  @Field(() => Int)
  sortOrder!: number;
}

@InputType()
export class ReorderSpaceFilesInput {
  @Field(() => ID)
  spaceId!: string;

  @Field(() => [ReorderSpaceFileEntryInput])
  files!: ReorderSpaceFileEntryInput[];
}
