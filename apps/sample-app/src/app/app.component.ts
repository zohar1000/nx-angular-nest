import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivationEnd } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from './shared/base-classes/base.component';
import { AuthService } from './core/services/auth.service';
import { AppEventType } from '@sample-app/shared/enums/app-event-type.enum';

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
  userProfile = null;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {
    super();

    this.regSub(this.router.events.subscribe(e => {
      if (e instanceof ActivationEnd) {
        this.isFullPage = e.snapshot && e.snapshot.data ? e.snapshot.data.isFullPage : false;
      }
    }));

    this.regSub(this.authService.getPermissions()
      .pipe(finalize(() => this.isInitialized = true))
      .subscribe(
        () => {},
        () => this.router.navigate(['/login'], { state: { isLogout: true }})
      ));

    this.regSub(this.appEventsService.getObsaervable(AppEventType.ShowAppSpinner).subscribe(() => setTimeout(() => this.isSpinner = true)));
    this.regSub(this.appEventsService.getObsaervable(AppEventType.HideAppSpinner).subscribe(() => setTimeout(() => this.isSpinner = false)));
  }

  onClickSidenavItem(path = '') {
    this.sidenav.close();
    this.router.navigate([path]).then();
  }

  onChildEvent(data) {
    // your logic here
    if (data.type === 'LoginSuccess') {
      this.userProfile = data.user;
      this.router.navigate(['/user']);
    }
  }

  logout() {
    this.userProfile = null;
    this.authService.logout();
    this.router.navigate(['/login'], { state: { isLogout: true }});
  }
}
