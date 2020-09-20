import { BaseComponent } from './base.component';
import { BaseEntityService } from '@sample-app/shared/base-classes/base-entity.service';
import { GetPageRequest } from '@shared/models/get-page-request.model';

// TODO:
// save in local storage: sort key, sort direction

export abstract class BaseEntityListComponent extends BaseComponent {
  constructor(public entityService: BaseEntityService) {
    super();
  }

  onClickAdd() {
    this.entityService.navigateToAddPage();
  }

  onClickEdit() {
    this.entityService.navigateToEditPage(102);
  }

  onClickDelete() {
    this.entityService.submitDeleteItem(102);
  }

  onClickGetPage(pageIndex, key = 'id', order) {
    const req = this.getDefaultPageRequest();
    req.paging.pageIndex = !pageIndex ? 0 : Number(pageIndex);
    req.sort.key = !key ? 'id' : key;
    req.sort.order = !order ? 1 : Number(order);
    this.entityService.getPage(req);
  }

  getDefaultPageRequest(): GetPageRequest {
    return {
      paging: {
        pageIndex: 0,
        pageSize: 10
      },
      filter: {},
      sort: {
        key: 'id',
        order: 1
      },
      isTotalCount: true
    }
  }

}
