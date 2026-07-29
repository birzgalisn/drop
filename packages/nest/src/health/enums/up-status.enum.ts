import { registerEnumType } from '@nestjs/graphql';

export enum UpStatus {
  OK = 'OK',
}

registerEnumType(UpStatus, {
  name: 'UpStatus',
  valuesMap: {
    [UpStatus.OK]: {
      description: 'Up and healthy.',
    },
  },
});
