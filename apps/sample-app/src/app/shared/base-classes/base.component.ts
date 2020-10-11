import { Directive } from '@angular/core';
import { Router } from '@angular/router';
import { appInjector } from '../../app.injector';
import { BaseGeneric } from '@sample-app/shared/base-classes/base-generic.component';
import { TranslyService, TranslyOnText } from 'ngx-transly';
import { AppText } from '@sample-app/shared/models/app-text.model';
import { BehaviorSubject } from 'rxjs';

@Directive()
export abstract class BaseComponent extends BaseGeneric {
  public isSpinner = false;
  protected router: Router;
  translyService: TranslyService;
  translate;
  appText$: BehaviorSubject<AppText>;
  isAppText$;

  constructor() {
    super();
    this.router = appInjector.get(Router);
    this.translyService = appInjector.get(TranslyService);
    this.translate = this.translyService.translate;
    this.appText$ = this.translyService.text$ as BehaviorSubject<AppText>;
    this.isAppText$ = this.translyService.isText$;
    this.translyService.onText((data: TranslyOnText) => this.onTranslyText(data));
  }

  protected showSpinner() {
    this.isSpinner = true;
  }

  protected hideSpinner() {
    this.isSpinner = false;
  }

  onTranslyText(data: TranslyOnText) {}
}
