import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UnlockShareInput {
  @Field()
  token!: string;

  @Field()
  pin!: string;
}
