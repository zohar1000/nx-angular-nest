import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { appInjector } from '../../../../../api/src/app.injector';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  public isLoading = false;
  protected httpClient: HttpClient;
  // protected dialog: MatDialog;
  protected router: Router;
  protected toastrService: ToastrService;
  private subs: Subscription[] = [];

  constructor() {
    this.httpClient = appInjector.get(HttpClient);
    this.toastrService = appInjector.get(ToastrService);
    this.router = appInjector.get(Router);
    // this.dialog = appInjector.get(MatDialog);
  }

  regSub(sub) {
    this.subs.push(sub);
  }

  ngOnDestroy() {
    this.subs.forEach(sub => { if (!sub.closed) sub.unsubscribe(); });
  }
}
