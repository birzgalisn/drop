import path from 'node:path';
import type { Readable } from 'node:stream';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import archiver from 'archiver';

import { mediaConfig } from '../media.config';

export interface ZipEntry {
  storageKey: string;
  name: string;
}

export interface OpenZipResult {
  stream: Readable;
  filename: string;
}

@Injectable()
export class MediaZipService {
  constructor(@Inject(mediaConfig.KEY) private readonly media: ConfigType<typeof mediaConfig>) {}

  open(input: { filename: string; files: ZipEntry[] }): OpenZipResult {
    const archive = archiver('zip', { zlib: { level: 9 } });

    for (const file of input.files) {
      archive.file(path.join(this.media.root, file.storageKey), { name: file.name });
    }

    void archive.finalize();

    return {
      stream: archive,
      filename: input.filename,
    };
  }
}
