import { HttpException } from '@nestjs/common';
import { HttpStatusCodes } from '../enums/http-status-codes.enum';
import { EventEmitter } from 'events';

export abstract class BaseController extends EventEmitter {
  readonly DEFAULT_ERROR_CODE = HttpStatusCodes.DefaultError;
  protected constructor(protected errorService = null) {
    super();
  }

  protected successResponse(data = {}) {
    return { isSuccess: true, data };
  }

  protected errorResponse(message = 'server error occurred', code = this.DEFAULT_ERROR_CODE) {
    return { error: { code, message: message }};
  }

  protected exceptionResponse(message, status = this.DEFAULT_ERROR_CODE) {
    throw new HttpException({ status, error: message }, status);
  }
}
