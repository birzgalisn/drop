import { pgEnum } from 'drizzle-orm/pg-core';

export enum SpaceStatus {
  DRAFT = 'draft',
  READY = 'ready',
  SHARED = 'shared',
  EXPIRED = 'expired',
}

export const spaceStatusEnum = pgEnum('space_status', [
  SpaceStatus.DRAFT,
  SpaceStatus.READY,
  SpaceStatus.SHARED,
  SpaceStatus.EXPIRED,
]);

export enum SpaceFileStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  PAUSED = 'paused',
  READY = 'ready',
  FAILED = 'failed',
  REMOVED = 'removed',
}

export const spaceFileStatusEnum = pgEnum('space_file_status', [
  SpaceFileStatus.PENDING,
  SpaceFileStatus.UPLOADING,
  SpaceFileStatus.PAUSED,
  SpaceFileStatus.READY,
  SpaceFileStatus.FAILED,
  SpaceFileStatus.REMOVED,
]);
