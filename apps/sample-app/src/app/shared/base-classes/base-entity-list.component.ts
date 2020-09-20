import { BaseComponent } from './base.component';
import { BaseEntityService } from '@sample-app/shared/base-classes/base-entity.service';

export abstract class BaseEntityListComponent extends BaseComponent {
  constructor(public entityService: BaseEntityService) {
    super();
  }

}
