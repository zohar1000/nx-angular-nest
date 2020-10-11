import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { UserProfile } from '@shared/models/user-profile.model';
import { RefreshTokenResponse } from '@shared/models/refresh-token-response.model';
import { ServerResponse } from '@shared/models/server-response.model';
import { AuthTokenName } from '@shared/enums/auth-token-name.enum';
import { ApiService } from '@sample-app/core/services/api.service';
import { Observable, of } from 'rxjs';
import { ServerLoginResponse } from '@shared/models/server-login-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = `v1/auth`;
  userProfile: UserProfile | null = null;

  constructor(private apiService: ApiService,
              private localStorageService: LocalStorageService) {
  }

  getPermissions() {
    return this.apiService.get(`${this.url}/permissions`)
  }

  login(data) {
    return this.apiService.post(`${this.url}/login`, data).pipe(
      tap((response: ServerResponse) => {
        if (!response.isSuccess) return;
        const loginResponse: ServerLoginResponse = response.data;
        this.setUser(loginResponse.user as UserProfile);
        this.storeAuthTokens(loginResponse);
      })
    )
  }

  getAccessToken() {
    return localStorage.getItem(AuthTokenName.Access);
  }

  storeAuthTokens(data: ServerLoginResponse | RefreshTokenResponse) {
    this.localStorageService.setItem(AuthTokenName.Access, data.accessToken);
    this.localStorageService.setItem(AuthTokenName.Refresh, data.refreshToken);
  }

  setUser(userProfile: UserProfile) {
    this.userProfile = userProfile;
  }

  clearUser() {
    this.userProfile = null;
    this.localStorageService.deleteItem(AuthTokenName.Access);
    this.localStorageService.deleteItem(AuthTokenName.Refresh);
  }

  refresh(): Observable<ServerResponse> {
    const refreshToken = localStorage.getItem(AuthTokenName.Refresh);
    if (refreshToken) {
      return this.apiService.post(`${this.url}/refresh`, { refreshToken });
    } else {
      return of({ isSuccess: false });
    }
  }
}
