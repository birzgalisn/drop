import { Query, Resolver } from '@nestjs/graphql';

import { StorageCapacity } from './models/storage-capacity.model';
import { MediaStorageService } from './services/media-storage.service';

@Resolver()
export class MediaResolver {
  constructor(private readonly media: MediaStorageService) {}

  @Query(() => StorageCapacity, {
    description: 'Host media-volume disk capacity for the Drop storage meter.',
  })
  storageCapacity(): Promise<StorageCapacity> {
    return this.media.readStorageCapacity();
  }
}
