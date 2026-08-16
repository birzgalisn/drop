import type { Readable } from 'node:stream';

import { StreamableFile } from '@nestjs/common';

export class Streamable {
  static file(input: {
    stream: Readable;
    contentType: string;
    filename: string;
    inline?: boolean;
  }): StreamableFile {
    const encoded = encodeURIComponent(input.filename);
    const disposition = input.inline
      ? `inline; filename="${encoded}"`
      : `attachment; filename="${encoded}"`;

    return new StreamableFile(input.stream, {
      type: input.contentType,
      disposition,
    });
  }

  static zip(input: { stream: Readable; filename: string }): StreamableFile {
    return Streamable.file({
      stream: input.stream,
      contentType: 'application/zip',
      filename: input.filename,
    });
  }
}
