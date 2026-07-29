export interface UploadSamplesPreview {
  src: string;
  alt?: string;
}

export interface UploadSamples {
  /** App-owned loader (e.g. fetch `/samples/*.jpg`) — keeps paths out of `@repo/react`. */
  load: () => Promise<File[]>;
  /** Public preview URLs for the fanned thumbs (typically three). */
  previews: UploadSamplesPreview[];
}
