import { Component, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BaseComponent } from './shared/base-classes/base.component';
import { AuthService } from './core/services/auth.service';
import { AppEventType } from '@sample-app/shared/enums/app-event-type.enum';
import { RouteChangeData } from 'ng-route-change';
import { ServerResponse } from '@shared/models/server-response.model';
import { TranslyOnText } from 'ngx-transly';

// TODO: return user permissions in index.html in prod

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends BaseComponent {
  @ViewChild('sidenav') sidenav;
  @ViewChild('langSelect') langSelect;
  isSideNavOpened = false;
  isFullPage;
  isInitialized = false;
  langCode;
  langs;

  constructor(public authService: AuthService) {
    super();
    this.regSub(this.appEventsService.getObsaervable(AppEventType.ShowAppSpinner).subscribe(() => setTimeout(() => this.isSpinner = true)));
    this.regSub(this.appEventsService.getObsaervable(AppEventType.HideAppSpinner).subscribe(() => setTimeout(() => this.isSpinner = false)));
    this.regSub(this.authService.getPermissions()
      .pipe(finalize(() => this.isInitialized = true))
      .subscribe(
        (response: ServerResponse) => this.authService.setUser(response.data),
        () => this.logout()
      ));
  }

  onTranslyText(data: TranslyOnText) {
    super.onTranslyText(data);
    this.langs = data.langs;
    this.langCode = data.langCode;
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
    if (data.type === 'LoginSuccess') {
      this.router.navigate(['']);
    }
  }

  logout() {
    this.authService.clearUser();
    this.router.navigate(['/login']);
  }

  async onChangeLang() {
    await this.translyService.setLang(this.langCode);
  }
}
