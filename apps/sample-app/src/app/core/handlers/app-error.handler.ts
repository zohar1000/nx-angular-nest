import { ErrorHandler } from '@angular/core';

export class AppErrorHandler implements ErrorHandler {
  handleError(error) {
// console.log('error message:', `Error ${error.status} - ${error.statusText}`);
    console.log('Error:', error);
  }
}
