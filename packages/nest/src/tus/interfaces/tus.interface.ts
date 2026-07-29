export interface TusOptions {
  /** Absolute path on disk where tus stores in-progress uploads and their metadata. */
  root: string;
  /** URL base path tus handles requests under (always `/files` — see {@link TusConfig.PATH}). */
  path: string;
  /** Rejects uploads larger than this. */
  maxUploadBytes: number;
}
