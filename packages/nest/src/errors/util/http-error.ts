import { HttpException } from '@nestjs/common';
import { AppError, type AppErrorExtensions } from '@repo/shared';

export class HttpError extends HttpException {
  static fromApp(error: AppError): HttpError {
    const body: AppErrorExtensions & { statusCode: number; message: string } = {
      statusCode: error.httpStatus,
      message: error.message,
      code: error.code,
    };

    if (error.fieldErrors && error.fieldErrors.length > 0) {
      body.fieldErrors = error.fieldErrors;
    }

    return new HttpError(body, error.httpStatus);
  }
}
