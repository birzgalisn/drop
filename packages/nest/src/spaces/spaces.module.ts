import { BullModule } from '@nestjs/bullmq';
import { Module, type Provider } from '@nestjs/common';
import { ConfigModule, type ConfigType } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { mediaConfig } from '../media';
import { redisConfig } from '../pubsub';
import { SpaceThumbnails } from './constants/space-thumbnails.constants';
import { SharesDownloadController } from './controllers/shares-download.controller';
import { SpacesDownloadController } from './controllers/spaces-download.controller';
import { GenerateThumbnailsProcessor } from './jobs/generate-thumbnails.processor';
import { SpaceCleanupJob } from './jobs/space-cleanup.job';
import { SpaceResolver } from './models/space.model';
import { ShareSessionPipe } from './pipes/share-session.pipe';
import { SpaceAuthorPipe } from './pipes/space-author.pipe';
import { SpaceEventsService } from './services/space-events.service';
import { SpaceFileMediaService } from './services/space-file-media.service';
import { SpaceThumbnailsService } from './services/space-thumbnails.service';
import { SpaceZipService } from './services/space-zip.service';
import { SpacesResolver } from './spaces.resolver';
import { SpaceFilesTusHooks } from './tus/hooks/space-files-tus.hooks';
import {
  ClaimSpaceFileUploadUseCase,
  CountActiveSpaceFilesUseCase,
  CreateSpaceUseCase,
  DeleteExpiredDraftsUseCase,
  DeleteExpiredSharesUseCase,
  FindShareBySpaceIdUseCase,
  FindShareByTokenUseCase,
  FindSpaceByIdUseCase,
  FindSpaceFileByIdUseCase,
  InsertShareUseCase,
  InsertSpaceFilesUseCase,
  ListReadySpaceFilesUseCase,
  ListSpaceFilesUseCase,
  MaxSpaceFileSortOrderUseCase,
  MarkSpaceFileThumbnailsReadyUseCase,
  MarkSpaceSharedUseCase,
  RemoveSpaceFileUseCase,
  ReorderSpaceFilesUseCase,
  SumSpaceFileBytesUseCase,
} from './use-cases';
import {
  AddSpaceFilesWorkflow,
  CompleteSpaceFileUploadWorkflow,
  CreateShareWorkflow,
  CreateSpaceWorkflow,
  GetSharedSpaceWorkflow,
  GetSpaceWorkflow,
  RemoveSpaceFileWorkflow,
  ReorderSpaceFilesWorkflow,
  UnlockShareWorkflow,
} from './workflows';

const useCases: Provider[] = [
  ClaimSpaceFileUploadUseCase,
  CountActiveSpaceFilesUseCase,
  CreateSpaceUseCase,
  DeleteExpiredDraftsUseCase,
  DeleteExpiredSharesUseCase,
  FindShareBySpaceIdUseCase,
  FindShareByTokenUseCase,
  FindSpaceByIdUseCase,
  FindSpaceFileByIdUseCase,
  InsertShareUseCase,
  InsertSpaceFilesUseCase,
  ListReadySpaceFilesUseCase,
  ListSpaceFilesUseCase,
  MaxSpaceFileSortOrderUseCase,
  MarkSpaceFileThumbnailsReadyUseCase,
  MarkSpaceSharedUseCase,
  RemoveSpaceFileUseCase,
  ReorderSpaceFilesUseCase,
  SumSpaceFileBytesUseCase,
];

const workflows: Provider[] = [
  AddSpaceFilesWorkflow,
  CompleteSpaceFileUploadWorkflow,
  CreateShareWorkflow,
  CreateSpaceWorkflow,
  GetSharedSpaceWorkflow,
  GetSpaceWorkflow,
  RemoveSpaceFileWorkflow,
  ReorderSpaceFilesWorkflow,
  UnlockShareWorkflow,
];

const redisEnvFromConfig = redisConfig.asProvider();

/**
 * The spaces domain. Relies on the global Drizzle/Media/Tus/PubSub modules and
 * wires its own BullMQ queue (thumbnails) and cron schedule (cleanup).
 */
@Module({
  imports: [
    ConfigModule.forFeature(mediaConfig),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [...redisEnvFromConfig.imports],
      inject: [...redisEnvFromConfig.inject],
      useFactory: (redis: ConfigType<typeof redisConfig>) => ({
        connection: redis.bullmq,
      }),
    }),
    BullModule.registerQueue({ name: SpaceThumbnails.QUEUE }),
  ],
  controllers: [SharesDownloadController, SpacesDownloadController],
  providers: [
    ...useCases,
    ...workflows,
    SpaceEventsService,
    SpaceThumbnailsService,
    SpaceZipService,
    SpaceFileMediaService,
    SpaceAuthorPipe,
    ShareSessionPipe,
    SpaceFilesTusHooks,
    GenerateThumbnailsProcessor,
    SpaceCleanupJob,
    SpacesResolver,
    SpaceResolver,
  ],
})
export class SpacesModule {}
