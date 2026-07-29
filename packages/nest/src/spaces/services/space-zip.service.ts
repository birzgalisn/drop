import path from 'node:path';
import type { Readable } from 'node:stream';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import archiver from 'archiver';

import { mediaConfig } from '../../media';
import type { SpaceFileWithStorageKey } from '../use-cases';

export interface OpenSpaceZipResult {
  stream: Readable;
  filename: string;
}

@Injectable()
export class SpaceZipService {
  constructor(@Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>) {}

  static parseFileIds(raw: string | string[] | undefined): string[] {
    if (!raw) {
      return [];
    }

    const parts = Array.isArray(raw) ? raw : [raw];

    return parts
      .flatMap((value) => value.split(','))
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }

  open(input: { spaceId: string; files: SpaceFileWithStorageKey[] }): OpenSpaceZipResult {
    const { spaceId, files } = input;
    const archive = archiver('zip', { zlib: { level: 9 } });

    for (const file of files) {
      archive.file(path.join(this.media.root, file.storageKey), { name: file.originalName });
    }

    void archive.finalize();

    return {
      stream: archive,
      filename: `space-${spaceId}.zip`,
    };
  }
}
