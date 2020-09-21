import { ToastrService } from 'ngx-toastr';
import { appInjector } from '@sample-app/app.injector';
import { AppEventsService } from '@sample-app/core/services/app-events.service';
import { AppEventType } from '@sample-app/shared/enums/app-event-type.enum';
import { Subscription } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';
import { ApiService } from '@sample-app/core/services/api.service';

@Directive()
export abstract class BaseGeneric implements OnDestroy {
  protected apiService: ApiService;
  protected appEventsService: AppEventsService;
  protected toastrService: ToastrService;
  private subs: Subscription[] = [];

  constructor() {
    this.apiService = appInjector.get(ApiService);
    this.appEventsService = appInjector.get(AppEventsService);
    this.toastrService = appInjector.get(ToastrService);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => { if (!sub.closed) sub.unsubscribe(); });
  }

  protected regSub(sub) {
    this.subs.push(sub);
  }

  protected showSuccessToastr(message?, title?) {
    this.toastrService.success(message, title);
  }

  protected showErrorToastr(message?, title?) {
    this.toastrService.error(message, title);
  }

  protected logError(...params) {
    console.log('=> Error:', ...params);
  }

  showAppSpinner() {
    this.appEventsService.sendAppEvent(AppEventType.ShowAppSpinner);
  }

  hideAppSpinner() {
    this.appEventsService.sendAppEvent(AppEventType.HideAppSpinner);
  }
}
