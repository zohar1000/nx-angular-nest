import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';
import { UserProfile } from '@shared/models/user-profile.model';
import { RefreshTokenResponse } from '@shared/models/refresh-token-response.model';
import { ServerResponse } from '@shared/models/server-response.model';
import { LocalStrategyResponse } from '@shared/models/local-strategy-response.model';
import { map } from 'rxjs/operators';
// import { Store } from '@ngrx/store';
// import { User } from '../../../shared/models/user.model';
// import { LocalStorageService } from '../../../core/services/local-storage.service';
// import { AuthTokenName } from '../../../shared/enums/auth-token-name.enum';
// import { AppState } from '../../../shared/models/app-state.model';
// import { Login, Logout, Permissions } from '../../../store/auth/auth.actions';

enum AuthTokenName {
  Access = 'accesstoken',
  Refresh = 'refreshtoken'
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `${environment.serverAddress}/v1/auth`;

  constructor(// private store: Store<AppState>,
              private http: HttpClient,
              private localStorageService: LocalStorageService) {
  }

  getPermissions() {
    return this.http.get(`${this.url}/permissions`)
  }

  login(data) {
    return this.http.post(`${this.url}/login`, data).pipe(
      map((response: ServerResponse): UserProfile | null => {
        const localStrategyResponse: LocalStrategyResponse = response.data;
        if (!localStrategyResponse.isLoginSuccess) {
          return null;
        } else {
          this.storeAuthTokens(localStrategyResponse.user);
          return localStrategyResponse.user;
        }
      })
    )
  }
/*
  loginSuccess(user: User) {
    this.storeAuthTokens(user);
    const authState = { firstName: user.firstName, email: user.email, role: user.role };
    this.store.dispatch(Login(authState));
  }
*/
  public logout() {
    this.localStorageService.clear();
    // this.store.dispatch(Logout());
  }

  getAccessToken() {
    return localStorage.getItem(AuthTokenName.Access);
  }

  storeAuthTokens(data: UserProfile | RefreshTokenResponse) {
    this.localStorageService.setItem(AuthTokenName.Access, data.accessToken);
    this.localStorageService.setItem(AuthTokenName.Refresh, data.refreshToken);
  }

  refresh() {
    const refreshToken = localStorage.getItem(AuthTokenName.Refresh);
    return this.http.post(`${this.url}/refresh`, { refreshToken });
  }
}
