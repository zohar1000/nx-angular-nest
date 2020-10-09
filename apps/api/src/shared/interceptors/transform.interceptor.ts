import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpStatusCodes } from '@shared/enums/http-status-codes.enum';
import { logt } from 'zshared';
import { SanitationService } from '../services/sanitation.service';
import { ErrorService } from '../services/error.service';
import { appConfig } from '../../app-config';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  isLogResponses = appConfig.logging.isLogClientResponses;
  excludedLogResponses = !appConfig.logging.excludedLogResponses || appConfig.logging.excludedLogResponses.length === 0 ? null : appConfig.logging.excludedLogResponses;

  constructor(private errorService: ErrorService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (!SanitationService.isPurified(request.body)) {
      const token = request.headers ? request.headers.authorization : '';
      // GlobalService.errorService.logi('a possible xss attack request detected', request.method, request.url, request.body, token);
      this.errorService.logi('a possible xss attack request detected', request.method, request.url, request.body, token);
      const invalidResponse: Response<any> = {
        data: {
          errorCode: HttpStatusCodes.DefaultError,
          errorMessage: 'invalid request',
          statusCode: HttpStatusCodes.DefaultError
        }
      };
      response.statusCode = HttpStatusCodes.DefaultError;
      return of(invalidResponse);
    }

    return next.handle().pipe(map(data => {
      const userId = request.user ? request.user.userId : 0;
      if (data.errorMessage) {
        const statusCode = data.errorCode && data.errorCode > 0 ? data.errorCode : HttpStatusCodes.DefaultError;
        response.statusCode = statusCode;
        data.statusCode = statusCode;
        if (this.isLogResponse(request.url)) logt('<== ERROR  user:', userId, ', data:', response.statusCode, JSON.stringify(data));
      } else {
        if (response.statusCode === 201) response.statusCode = HttpStatusCodes.DefaultSuccess;
      }
      if (this.isLogResponse(request.url)) logt('<== user:', userId, ', statusCode:', response.statusCode, JSON.stringify(data));
      return data;
    }));
  }

  isLogResponse(url) {
    if (!this.isLogResponses) return false;
    if (!this.excludedLogResponses) return true;
    return !this.excludedLogResponses.some(item => url.indexOf(item) !== -1);
  }
}
