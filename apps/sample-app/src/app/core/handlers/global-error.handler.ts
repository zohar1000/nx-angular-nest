import { ErrorHandler } from '@angular/core';
import { ErrorLogService } from '@sample-app/core/services/error-log.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { appInjector } from '@sample-app/app.injector';
import { HttpStatusCodes } from '@shared/enums/http-status-codes.enum';

export class GlobalErrorHandler implements ErrorHandler {
  errorLogService: ErrorLogService;
  toastrService: ToastrService;

  handleError(error: Error | HttpErrorResponse) {
// console.log('error message:', `Error ${error.status} - ${error.statusText}`);
    const isLogError = this.showToasterMessage(error);
    if (isLogError) this.logError(error);
  }

  showToasterMessage(error: Error | HttpErrorResponse): boolean {
    if (!this.toastrService) this.toastrService = appInjector.get(ToastrService);
    let isLogError = true;
    let title = '';
    let message = '';
    if (error instanceof HttpErrorResponse) {  // Server or connection error happened
      if (!navigator.onLine) {  // Handle offline error
        isLogError = false;
        message = 'No internet connection';
      } else if (error.status >= 403) {  // Handle Http Error (error.status === 403, 404...)
        title = `Server Error`;
        if (error.status !== HttpStatusCodes.DefaultError) title += ` ${error.status}`;
        message = error?.error?.error?.message || error.statusText;
      } else {
        isLogError = false;
      }
    } else {  // Handle Client Error (Angular Error, ReferenceError...)
      message = error.message.split('\n')[0];
    }

    if (message) {
      if (this.toastrService) {
        this.toastrService.error(message, title);
      } else {
        if (title) alert(title);
        alert(message);
      }
    }

    return isLogError;
  }

  logError(error) {
    if (!this.errorLogService) this.errorLogService = appInjector.get(ErrorLogService);
    if (this.errorLogService) {
      this.errorLogService.logError('An unhandled error occurred', error);
    } else {
      console.log('An unhandled error occurred', error);
    }
  }
}
