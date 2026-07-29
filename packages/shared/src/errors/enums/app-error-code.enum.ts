export enum AppErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  /** Malformed request/argument that is not tied to a user-facing input field. */
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  /** Input validation failure. Always carries per-field detail (`fieldErrors`). */
  VALIDATION = 'VALIDATION',
  STORAGE_FULL = 'STORAGE_FULL',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INTERNAL = 'INTERNAL',
}
