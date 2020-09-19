import { ToastrService } from 'ngx-toastr';
import { appInjector } from '@sample-app/app.injector';
import { AppEventsService } from '@sample-app/core/services/app-events.service';
import { AppEventType } from '@sample-app/shared/enums/app-event-type.enum';

export abstract class BaseGeneric {
  protected toastrService: ToastrService;
  protected appEventsService: AppEventsService;

  constructor() {
    this.toastrService = appInjector.get(ToastrService);
    this.appEventsService = appInjector.get(AppEventsService);
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
