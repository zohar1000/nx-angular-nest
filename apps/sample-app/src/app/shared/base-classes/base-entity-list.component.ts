import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from './base.component';
import { GetPageRequest } from '@shared/models/get-page-request.model';

// TODO:
// save in local storage: sort key, sort direction

@Directive()
export abstract class BaseEntityListComponent extends BaseComponent {
  @Input() items$;
  @Input() totalCount$;
  @Output() navigateToAddPage = new EventEmitter();
  @Output() navigateToEditPage = new EventEmitter();
  @Output() submitDeleteItem = new EventEmitter();
  @Output() pageIndex = new EventEmitter();
  @Output() sort = new EventEmitter();

  onClickAdd() {
    this.navigateToAddPage.emit();
  }

  onClickEdit() {
    this.navigateToEditPage.emit(102);
  }

  onClickDelete() {
    this.submitDeleteItem.emit(102);
  }

  onClickPageIndex(pageIndex) {
    pageIndex = !pageIndex ? 0 : Number(pageIndex);
    this.pageIndex.emit(pageIndex);
  }

  onClickSort(key = 'id', order) {
    key = !key ? 'id' : key;
    order = !order ? 1 : Number(order);
    this.sort.emit({ key, order });
  }

/*
  onClickGetPage(pageIndex, key = 'id', order) {
    const req = this.getDefaultPageRequest();
    req.paging.pageIndex = !pageIndex ? 0 : Number(pageIndex);
    req.sort.key = !key ? 'id' : key;
    req.sort.order = !order ? 1 : Number(order);
    this.getPage.emit(req);
  }
*/

/*
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
*/

}
