import { registerEnumType } from '@nestjs/graphql';

import { SpaceFileStatus } from '../../drizzle/schema/enums';

registerEnumType(SpaceFileStatus, {
  name: 'SpaceFileStatus',
  description: 'Upload/processing status of a single space file.',
});

export { SpaceFileStatus };
