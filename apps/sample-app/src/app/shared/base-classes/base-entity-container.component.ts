import { BaseEntityService } from './base-entity.service';

export abstract class BaseEntityContainerComponent {

  constructor(private entityKey: string,
              private entityService: BaseEntityService) {

  }
}
