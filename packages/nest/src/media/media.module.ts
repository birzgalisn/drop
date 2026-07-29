import { Global, Module } from '@nestjs/common';

import { mediaConfig } from './media.config';
import { MediaResolver } from './media.resolver';
import { MediaStorageService } from './services/media-storage.service';

const mediaEnvFromConfig = mediaConfig.asProvider();

@Global()
@Module({
  imports: [...mediaEnvFromConfig.imports],
  providers: [MediaStorageService, MediaResolver],
  exports: [MediaStorageService],
})
export class MediaModule {}
