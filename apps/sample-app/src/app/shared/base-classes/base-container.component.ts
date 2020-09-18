import { ApiService } from '../../core/services/api.service';
import { Directive } from '@angular/core';
import { appInjector } from '../../app.injector';

@Directive()
export abstract class BaseContainerComponent {
  apiService: ApiService;

  constructor() {
    this.apiService = appInjector.get(ApiService);
  }
}
