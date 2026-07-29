import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddSpaceFileInput {
  @Field()
  originalName: string;

  @Field()
  mimeType: string;

  @Field(() => Int)
  byteSize: number;
}

@InputType()
export class AddSpaceFilesInput {
  /** Omitted on the first batch — the workflow creates a fresh draft space. */
  @Field(() => ID, { nullable: true })
  spaceId?: string;

  @Field(() => [AddSpaceFileInput])
  files: AddSpaceFileInput[];
}
