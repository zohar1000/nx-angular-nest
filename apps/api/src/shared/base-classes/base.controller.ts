import { HttpException } from '@nestjs/common';
import { HttpStatusCodes } from '@shared/enums/http-status-codes.enum';
import { EventEmitter } from 'events';
import { ServerResponse } from '@shared/models/server-response.model';

export abstract class BaseController extends EventEmitter {
  readonly DEFAULT_ERROR_CODE = HttpStatusCodes.DefaultError;
  protected constructor(protected errorService = null) {
    super();
  }

  protected successResponse(data = {}): ServerResponse {
    return { isSuccess: true, data };
  }

  protected errorResponse(message = '', code = this.DEFAULT_ERROR_CODE): ServerResponse {
    return { isSuccess: false, error: { code, message: message }};
  }

  protected exceptionResponse(message, status = this.DEFAULT_ERROR_CODE) {
    // throw new HttpException({ status, error: message }, status);
    throw new HttpException(message, status);
  }
}
