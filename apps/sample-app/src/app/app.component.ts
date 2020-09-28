import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from './shared/base-classes/base.component';
import { AuthService } from './core/services/auth.service';
import { AppEventType } from '@sample-app/shared/enums/app-event-type.enum';
import { RouteChangeData } from 'ng-route-change';
import { UserProfile } from '@shared/models/user-profile.model';
import { ServerResponse } from '@shared/models/server-response.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends BaseComponent {
  @ViewChild('sidenav') sidenav;
  isSideNavOpened = false;
  isFullPage;
  isInitialized = false;
  userProfile: UserProfile = null;

  constructor(private authService: AuthService) {
    super();

    this.regSub(this.authService.getPermissions()
      .pipe(finalize(() => this.isInitialized = true))
      .subscribe(
        (response: ServerResponse) => this.userProfile = response.data,
        () => this.router.navigate(['/login'], { state: { isLogout: true }})
      ));

    this.regSub(this.appEventsService.getObsaervable(AppEventType.ShowAppSpinner).subscribe(() => setTimeout(() => this.isSpinner = true)));
    this.regSub(this.appEventsService.getObsaervable(AppEventType.HideAppSpinner).subscribe(() => setTimeout(() => this.isSpinner = false)));
  }

  onRouteChange(data: RouteChangeData) {
    this.isFullPage = data.state.data ? Boolean(data.state.data.isFullPage) : false;
    this.isSideNavOpened = false;
  }

  onClickSidenavItem(path = '') {
    this.sidenav.close();
    this.router.navigate([path]).then();
  }

  onChildEvent(data) {
    // your logic here
    if (data.type === 'LoginSuccess') {
      this.userProfile = data.user;
      this.router.navigate(['']);
    }
  }

  logout() {
    this.userProfile = null;
    this.authService.logout();
    this.router.navigate(['/login'], { state: { isLogout: true }});
  }
}
