import { Inject, Injectable } from '@nestjs/common';
import type { PubSubEngine } from 'graphql-subscriptions';

import { GRAPHQL_PUBSUB } from '../../pubsub';
import { SpaceEvents } from '../constants/space-events.constants';
import type { Space } from '../models/space.model';

export interface SpaceUpdatedPayload {
  spaceUpdated: Space;
}

/** Broadcasts `spaceUpdated` events on a per-space Redis topic and exposes the subscription iterator. */
@Injectable()
export class SpaceEventsService {
  constructor(@Inject(GRAPHQL_PUBSUB) private readonly pubSub: PubSubEngine) {}

  async broadcastSpaceUpdated(space: Space): Promise<void> {
    const payload: SpaceUpdatedPayload = { spaceUpdated: space };
    await this.pubSub.publish(SpaceEvents.trigger(space.id), payload);
  }

  subscribeToSpace(spaceId: string): AsyncIterableIterator<SpaceUpdatedPayload> {
    return this.pubSub.asyncIterableIterator<SpaceUpdatedPayload>(SpaceEvents.trigger(spaceId));
  }
}
