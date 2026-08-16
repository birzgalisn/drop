import { BullModule } from '@nestjs/bullmq';
import { Module, type Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from '../config';
import { mediaConfig } from '../media';
import { SpaceThumbnails } from './constants/space-thumbnails.constants';
import { SharesDownloadController } from './controllers/shares-download.controller';
import { SpacesDownloadController } from './controllers/spaces-download.controller';
import { GenerateThumbnailsProcessor } from './jobs/generate-thumbnails.processor';
import { SpaceCleanupJob } from './jobs/space-cleanup.job';
import { SpaceResolver } from './models/space.model';
import { ShareSessionPipe } from './pipes/share-session.pipe';
import { SpaceAuthorPipe } from './pipes/space-author.pipe';
import { SpaceContext } from './services/space-context.service';
import { SpaceEventsService } from './services/space-events.service';
import { SpaceFileMediaService } from './services/space-file-media.service';
import { SpaceThumbnailsService } from './services/space-thumbnails.service';
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
  LoadAuthoredSpaceUseCase,
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
  LoadAuthoredSpaceUseCase,
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

/**
 * The spaces domain. Relies on global Drizzle/Media/Tus/PubSub and on
 * Bull/Schedule roots registered at the compose edge (`apps/api`).
 */
@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    ConfigModule.forFeature(mediaConfig),
    BullModule.registerQueue({ name: SpaceThumbnails.QUEUE }),
  ],
  controllers: [SharesDownloadController, SpacesDownloadController],
  providers: [
    ...useCases,
    ...workflows,
    SpaceContext,
    SpaceEventsService,
    SpaceThumbnailsService,
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
