import { registerEnumType } from '@nestjs/graphql';

import { SpaceStatus } from '../../drizzle/schema/enums';

registerEnumType(SpaceStatus, {
  name: 'SpaceStatus',
  description: 'Lifecycle status of a space.',
});

export { SpaceStatus };
