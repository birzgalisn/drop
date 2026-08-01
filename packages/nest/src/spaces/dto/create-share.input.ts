import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateShareInput {
  @Field(() => ID)
  spaceId!: string;

  @Field(() => Int)
  expiryDays!: number;

  @Field()
  pin!: string;
}
