import { ApiService } from '../../core/services/api.service';
import { Directive } from '@angular/core';
import { appInjector } from '../../app.injector';
import { BaseComponent } from '@sample-app/shared/base-classes/base.component';

@Directive()
export abstract class BaseContainerComponent extends BaseComponent {
  apiService: ApiService;

  constructor() {
    super();
    this.apiService = appInjector.get(ApiService);
  }
}
