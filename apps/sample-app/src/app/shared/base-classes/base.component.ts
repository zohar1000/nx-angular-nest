import { Directive, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { appInjector } from '../../app.injector';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  public isLoading = false;
  protected httpClient: HttpClient;
  // protected dialog: MatDialog;
  protected router: Router;
  protected toastrService: ToastrService;
  // protected spinnerService: NgxSpinnerService;
  private subs: Subscription[] = [];

  constructor() {
    this.httpClient = appInjector.get(HttpClient);
    this.toastrService = appInjector.get(ToastrService);
    this.router = appInjector.get(Router);
    // this.spinnerService = appInjector.get(NgxSpinnerService);
    // this.dialog = appInjector.get(MatDialog);
  }

  regSub(sub) {
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => { if (!sub.closed) sub.unsubscribe(); });
  }

  showSpinner(id?) {
    // this.spinnerService.show(id, this.SPINNER_OPTIONS);
  }

  hideSpinner(id?) {
    // this.spinnerService.hide(id);
  }
}
