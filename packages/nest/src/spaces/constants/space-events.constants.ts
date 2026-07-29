/** Redis pub/sub topic helpers for live space updates. */
export class SpaceEvents {
  static readonly SUBSCRIPTION = 'spaceUpdated';

  static trigger(spaceId: string): string {
    return `${SpaceEvents.SUBSCRIPTION}.${spaceId}`;
  }
}
