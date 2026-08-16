import { Global, Module } from '@nestjs/common';

import { mediaConfig } from './media.config';
import { MediaResolver } from './media.resolver';
import { MediaStorageService } from './services/media-storage.service';
import { MediaZipService } from './services/media-zip.service';

const mediaEnvFromConfig = mediaConfig.asProvider();

@Global()
@Module({
  imports: [...mediaEnvFromConfig.imports],
  providers: [MediaStorageService, MediaZipService, MediaResolver],
  exports: [MediaStorageService, MediaZipService],
})
export class MediaModule {}
