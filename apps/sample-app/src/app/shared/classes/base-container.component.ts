import { ApiService } from '../../core/services/api.service';
import { Directive } from '@angular/core';

@Directive()
export abstract class BaseContainerComponent {
  constructor(protected apiService: ApiService) {}
}
