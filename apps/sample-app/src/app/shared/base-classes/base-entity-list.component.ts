import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from './base.component';

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
  @Output() pageSize = new EventEmitter();
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

  onClickPageSize(pageSize) {
    pageSize = !pageSize ? 10 : Number(pageSize);
    this.pageSize.emit(pageSize);
  }

  onClickSort(key = 'id', order) {
    key = !key ? '' : key;
    order = !order ? 1 : Number(order);
    this.sort.emit({ key, order });
  }
}
