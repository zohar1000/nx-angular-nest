import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RefreshTokenResponse } from '@shared/models/refresh-token-response.model';
import { AuthService } from '../services/auth.service';
import { AppEventType } from '@sample-app/shared/enums/app-event-type.enum';
import { BaseService } from '@sample-app/shared/base-classes/base.service';
import { HttpStatusCodes } from '@shared/enums/http-status-codes.enum';
import { ServerResponse } from '@shared/models/server-response.model';

@Injectable({ providedIn: 'root' })
export class AppInterceptor extends BaseService implements HttpInterceptor {
  private isDuringRefresh = false;
  private refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, private authService: AuthService) {
    super();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// console.log('req:', req.method, req.url);
    const accessToken = this.authService.getAccessToken();
    if (accessToken) req = this.addToken(req, accessToken);

    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(error, req, next);
        } else {
          return this.showToastrAndReturnError(error);
        }
      })
    );
  }

  private handle401Error(org401Error, req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isDuringRefresh) {
      this.isDuringRefresh = true;
      this.refreshToken$.next(null);

      return this.authService.refresh().pipe(
        switchMap((serverResponse: ServerResponse) => {
          this.isDuringRefresh = false;
          if (serverResponse.isSuccess) {
            const refreshTokenResponse: RefreshTokenResponse = serverResponse.data;
            this.authService.storeAuthTokens(refreshTokenResponse);
            this.refreshToken$.next(refreshTokenResponse);
            return next.handle(this.addToken(req, refreshTokenResponse.accessToken));
          }
          this.refreshToken$.next({ isSuccess: false });
          this.router.navigate(['/login']);
          return throwError(org401Error);
        }));
    } else {
      return this.refreshToken$.pipe(
        filter(response => response != null),
        take(1),
        switchMap((response: RefreshTokenResponse) => {
          if (!response.isSuccess) {
            return this.showToastrAndReturnError(org401Error);
          } else {
            return next.handle(this.addToken(req, response.accessToken));
          }
        }));
    }
  }

  private addToken(req: HttpRequest<any>, accessToken: string) {
    return req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
  }

  showToastrAndReturnError(error) {
    this.appEventsService.sendAppEvent(AppEventType.HideAppSpinner);
    let message;
    if (error instanceof HttpErrorResponse) message = error?.error?.error?.message;
    message = message || error.statusText;
    if (error.status !== HttpStatusCodes.DefaultError) message = `Error ${error.status} - ${message}`;
    this.toastrService.error(message);
    return throwError(error);
  }
}
