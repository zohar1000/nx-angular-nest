import { ErrorHandler } from '@angular/core';
import { ErrorLogService } from '@sample-app/core/services/error-log.service';
import { appInjector } from '@sample-app/app.injector';

export class GlobalErrorHandler implements ErrorHandler {
  errorLogService: ErrorLogService;

  handleError(error) {
// console.log('error message:', `Error ${error.status} - ${error.statusText}`);
    if (!this.errorLogService) this.errorLogService = appInjector.get(ErrorLogService);
    if (this.errorLogService) {
      this.errorLogService.logError('An unhandled error occurred', error);
    } else {
      console.log('An unhandled error occurred', error);
    }
  }
}
