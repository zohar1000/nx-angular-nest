import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { RefreshTokenResponse } from '@shared/models/refresh-token-response.model';
import { AuthService } from '../services/auth.service';
import { AppEventType } from '@sample-app/shared/enums/app-event-type.enum';
import { BaseService } from '@sample-app/shared/base-classes/base.service';

@Injectable({ providedIn: 'root' })
export class AppInterceptor extends BaseService implements HttpInterceptor {
  private isRefreshing = false;
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
        this.appEventsService.sendAppEvent(AppEventType.HideAppSpinner);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(error, req, next);
        } else {
          return this.showToastrAndReturnError(error);
        }
      })
    );
  }

  private handle401Error(org401Error, req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshToken$.next(null);

      return this.authService.refresh().pipe(
        switchMap((response: RefreshTokenResponse) => {
          this.isRefreshing = false;
          this.refreshToken$.next(response);
          if (!response.isSuccess) {
            this.router.navigate(['/login'], { state: { isLogout: true }});
            return throwError(org401Error);
          } else {
            this.authService.storeAuthTokens(response);
            return next.handle(this.addToken(req, response.accessToken));
          }
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
    this.toastrService.error(`Error ${error.status} - ${error.statusText}`);
    return throwError(error);
  }
}
