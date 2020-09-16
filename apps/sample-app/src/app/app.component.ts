import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivationEnd } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from './shared/classes/base.component';
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

    // this.spinnerService.start();
  }

  onClickSidenavItem(path = '') {
    this.sidenav.close();
    this.router.navigate([path]).then();
  }

}
