import { AfterViewInit, Directive, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from './base.component';
import { BaseTableDataSource } from '@sample-app/shared/base-classes/base-table.data-source';
import { MatTable } from '@angular/material/table';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { ItemsPageSettings } from '@shared/models/items-page-settings.model';

@Directive()
export abstract class BaseEntityListComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() items$;
  @Input() totalCount$: BehaviorSubject<number>;
  @Input() pageSettings$: BehaviorSubject<ItemsPageSettings>;
  @Output() navigateToAddPage = new EventEmitter();
  @Output() navigateToEditPage = new EventEmitter();
  @Output() submitDeleteItem = new EventEmitter();
  @Output() onChangePageIndex = new EventEmitter();
  @Output() onChangePageSize = new EventEmitter();
  @Output() onChangeSort = new EventEmitter();
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatSort) tableSort: MatSort;
  dataSource: BaseTableDataSource;
  readonly pageSizeOptions = [5, 10, 20, 50, 100, 250];

  constructor(@Inject(Tokens.EntityTableColumns) public tableColumns: string[]) {
    super();
  }

  ngOnInit() {
    this.dataSource = new BaseTableDataSource(this.items$);
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.tablePaginator;
    // this.table.dataSource = this.dataSource;
  }

  onClickAdd() {
    this.navigateToAddPage.emit();
  }

  onClickEdit(id) {
    this.navigateToEditPage.emit(id);
  }

  onClickDelete(id) {
    this.submitDeleteItem.emit(id);
  }

  onChangePaging(e: PageEvent) {
    console.log('onChangePaging:', e);
    if (e.previousPageIndex !== e.pageIndex) {
      this.onChangePageIndex.emit(e.pageIndex);
    } else if (e.pageSize !== this.pageSettings$.value.paging.pageSize) {
      this.onChangePageSize.emit(e.pageSize);
    }
  }

  onClickPageIndex(pageIndex) {
    pageIndex = !pageIndex ? 0 : Number(pageIndex);
    this.onChangePageIndex.emit(pageIndex);
  }

  onClickPageSize(pageSize) {
    pageSize = !pageSize ? 10 : Number(pageSize);
    this.onChangePageSize.emit(pageSize);
  }

  onClickSort(key = 'id', order) {
    key = !key ? '' : key;
    order = !order ? 1 : Number(order);
    this.onChangeSort.emit({ key, order });
  }
}
