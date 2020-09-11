import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ServerResponse } from '../models/server-response.model';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message: any = exception.message as unknown;
    if (status === 401) {
      message = 'user is not authorized';
    } else if (typeof message === 'object') {
      if (typeof message.message === 'string') {
        message = message.message;
      } else if (typeof message.error === 'string') {
        message = message.error;
      } else {
        message = 'an error occurred';
      }
    }
    const body: ServerResponse = { isSuccess: false, error: { code: status, message}};
    response.status(status).json(body);
  }
}
