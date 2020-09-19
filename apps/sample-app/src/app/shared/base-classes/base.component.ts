import { Directive, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { appInjector } from '../../app.injector';
import { BaseGeneric } from '@sample-app/shared/base-classes/base-generic.component';

@Directive()
export abstract class BaseComponent extends BaseGeneric implements OnDestroy {
  public isSpinner = false;
  protected httpClient: HttpClient;
  // protected dialog: MatDialog;
  protected router: Router;
  protected toastrService: ToastrService;
  // protected spinnerService: NgxSpinnerService;
  private subs: Subscription[] = [];

  constructor() {
    super();
    this.httpClient = appInjector.get(HttpClient);
    this.toastrService = appInjector.get(ToastrService);
    this.router = appInjector.get(Router);
    // this.spinnerService = appInjector.get(NgxSpinnerService);
    // this.dialog = appInjector.get(MatDialog);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => { if (!sub.closed) sub.unsubscribe(); });
  }

  protected regSub(sub) {
    this.subs.push(sub);
  }

  protected showSpinner() {
    this.isSpinner = true;
  }

  protected hideSpinner() {
    this.isSpinner = false;
  }
}
