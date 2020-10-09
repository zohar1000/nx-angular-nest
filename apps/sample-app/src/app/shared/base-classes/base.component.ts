import { Directive } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { appInjector } from '../../app.injector';
import { BaseGeneric } from '@sample-app/shared/base-classes/base-generic.component';

@Directive()
export abstract class BaseComponent extends BaseGeneric {
  public isSpinner = false;
  protected httpClient: HttpClient;
  // protected dialog: MatDialog;
  protected router: Router;
  protected toastrService: ToastrService;
  // protected spinnerService: NgxSpinnerService;

  constructor() {
    super();
    this.httpClient = appInjector.get(HttpClient);
    this.toastrService = appInjector.get(ToastrService);
    this.router = appInjector.get(Router);
    // this.spinnerService = appInjector.get(NgxSpinnerService);
    // this.dialog = appInjector.get(MatDialog);
  }

  protected showSpinner() {
    this.isSpinner = true;
  }

  protected hideSpinner() {
    this.isSpinner = false;
  }
}
