import { AppErrorCode } from '../enums/app-error-code.enum';

/** Lookup helpers for {@link AppErrorCode}. */
export class AppErrorCodes {
  static readonly HTTP_STATUS: Record<AppErrorCode, number> = {
    [AppErrorCode.NOT_FOUND]: 404,
    [AppErrorCode.CONFLICT]: 409,
    [AppErrorCode.BAD_REQUEST]: 400,
    [AppErrorCode.UNAUTHORIZED]: 401,
    [AppErrorCode.VALIDATION]: 400,
    [AppErrorCode.STORAGE_FULL]: 507,
    [AppErrorCode.SERVICE_UNAVAILABLE]: 503,
    [AppErrorCode.INTERNAL]: 500,
  };
}
