import { ErrorHandler, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './interceptors/app.interceptor';
import { AppErrorHandler } from '@sample-app/core/handlers/app-error.handler';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ]
})
export class CoreModule {}
