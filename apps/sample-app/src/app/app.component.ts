import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivationEnd } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from './shared/base-classes/base.component';
import { AuthService } from './core/services/auth.service';

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
  isSpinner = true;

  constructor(private authService: AuthService) {
    super();

    this.router.events.subscribe(e => {
      if (e instanceof ActivationEnd) {
        this.isFullPage = e.snapshot && e.snapshot.data ? e.snapshot.data.isFullPage : false;
      }
    });

    this.regSub(this.authService.getPermissions()
      .pipe(finalize(() => this.isInitialized = true))
      .subscribe(
        () => {},
        err => this.router.navigate(['/login'], { state: { isLogout: true }})
      ));
  }

  onClickSidenavItem(path = '') {
    this.sidenav.close();
    this.router.navigate([path]).then();
  }

  onChildEvent(data) {
    // your logic here
    if (data.type === 'LoginSuccess') {
      this.userProfile = data.user;
console.log('this:', this);
      this.router.navigate(['/user']);
    }
  }

  logout() {
    this.userProfile = null;
    this.authService.logout();
    this.router.navigate(['/login'], { state: { isLogout: true }});
  }
}
